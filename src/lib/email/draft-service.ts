/**
 * Draft Generation Service — Core orchestrator
 *
 * Shared logic used by both the API route and BullMQ worker.
 * Queries leads, generates personalized content via LLM, renders
 * branded HTML, pushes to Outlook, and saves to database.
 */

import { db } from "@/lib/db";
import { selectStrategy } from "./strategy-selector";
import { generatePersonalizedEmail } from "./generate-content";
import { renderBrandedEmail } from "./templates/branded-outreach";
import { createOutlookDraft, getOutlookAccessToken } from "./outlook-client";
import type { StrategyAngle } from "@prisma/client";

export interface GenerateDraftsOptions {
  heatScoreThreshold?: number;
  tier2Limit?: number;
  tier1Limit?: number;
  triggeredBy: "schedule" | "manual";
}

export interface GenerateDraftsResult {
  generated: number;
  skipped: number;
  pivoted: number;
  errors: { leadId: string; error: string }[];
  tier2Generated: number;
  tier1Generated: number;
}

/**
 * Generate branded email drafts for qualifying leads.
 * Splits between Tier 2 (Strategic Alignment) and Tier 1 (Cost Recovery).
 */
export async function generateDrafts(
  options: GenerateDraftsOptions
): Promise<GenerateDraftsResult> {
  // Load config
  const config = await db.outreachConfig.findFirst();
  const threshold = options.heatScoreThreshold ?? config?.heatScoreThreshold ?? 40;
  const tier2Limit = options.tier2Limit ?? config?.dailyTier2Split ?? 25;
  const tier1Limit = options.tier1Limit ?? config?.dailyTier1Split ?? 25;
  const pivotAfterStep = config?.pivotAfterStep ?? 3;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count today's existing drafts
  const todayCount = await db.emailDraft.count({
    where: { batchDate: { gte: today } },
  });

  const totalLimit = tier2Limit + tier1Limit;
  if (todayCount >= totalLimit) {
    return {
      generated: 0,
      skipped: 0,
      pivoted: 0,
      errors: [],
      tier2Generated: 0,
      tier1Generated: 0,
    };
  }

  // Get leads who already have a draft today
  const draftedToday = await db.emailDraft.findMany({
    where: { batchDate: { gte: today } },
    select: { leadId: true },
  });
  const draftedLeadIds = new Set(draftedToday.map((d) => d.leadId));

  // Get leads sent in last 7 days (cooldown)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentlySent = await db.emailDraft.findMany({
    where: { status: "SENT", sentAt: { gte: sevenDaysAgo } },
    select: { leadId: true },
  });
  const recentLeadIds = new Set(recentlySent.map((d) => d.leadId));

  // Query qualifying leads
  const leads = await db.lead.findMany({
    where: {
      heatScore: { gte: threshold },
      stage: { in: ["PROSPECT", "QUALIFIED", "PROPOSAL"] },
      tier: { not: "REJECTED" },
      id: { notIn: [...Array.from(draftedLeadIds), ...Array.from(recentLeadIds)] },
    },
    include: { enrichments: { take: 1, orderBy: { enrichedAt: "desc" } }, emailDrafts: { orderBy: { createdAt: "desc" }, take: 5 } },
    orderBy: { heatScore: "desc" },
    take: totalLimit,
  });

  // Split by tier
  const tier2Leads = leads.filter((l) => l.tier === "TIER_2").slice(0, tier2Limit);
  const tier1Leads = leads.filter((l) => l.tier !== "TIER_2").slice(0, tier1Limit);
  const allLeads = [...tier2Leads, ...tier1Leads];

  const result: GenerateDraftsResult = {
    generated: 0,
    skipped: 0,
    pivoted: 0,
    errors: [],
    tier2Generated: 0,
    tier1Generated: 0,
  };

  // Get Outlook access token once for the batch
  let accessToken: string;
  try {
    accessToken = await getOutlookAccessToken();
  } catch (e) {
    return {
      ...result,
      errors: [{ leadId: "all", error: `Outlook auth failed: ${e instanceof Error ? e.message : "Unknown"}` }],
    };
  }

  for (const lead of allLeads) {
    try {
      // Determine strategy
      const lastDraft = lead.emailDrafts[0];
      const heatScoreAtStart = lead.emailDrafts.length > 0
        ? (lead.emailDrafts[lead.emailDrafts.length - 1] as unknown as { metadata?: { heatScoreAtStart?: number } })?.metadata?.heatScoreAtStart ?? lead.heatScore
        : lead.heatScore;

      const strategy = selectStrategy({
        tier: lead.tier as "TIER_1" | "TIER_2" | "UNKNOWN" | "REJECTED",
        heatScore: lead.heatScore,
        heatScoreAtSequenceStart: heatScoreAtStart as number,
        currentAngle: (lastDraft?.strategyAngle as StrategyAngle) ?? null,
        currentStep: lastDraft?.sequenceStep ?? 0,
        pivotAfterStep,
      });

      if (strategy.isPivot) result.pivoted++;

      // Generate content
      const enrichment = lead.enrichments[0];
      const techStack = (enrichment?.companyTechStack as string[]) || [];
      const content = await generatePersonalizedEmail(
        {
          firstName: lead.firstName,
          lastName: lead.lastName,
          company: lead.company,
          title: lead.title || "",
          vertical: lead.vertical,
          companyRevenue: enrichment?.companyRevenue ?? undefined,
          companyEmployees: enrichment?.companyEmployees ?? undefined,
          techStack,
          estimatedMonthlySaas: techStack.length * 500, // rough estimate
          toolCount: techStack.length,
        },
        strategy.angle,
        strategy.sequenceStep
      );

      // Render branded HTML
      const { html, text } = renderBrandedEmail({
        recipientFirstName: lead.firstName,
        recipientCompany: lead.company,
        subject: content.subject,
        bodyParagraphs: content.bodyParagraphs,
        ctaText: content.ctaText,
        ctaUrl: content.ctaUrl,
        senderName: "Jacques Jean",
        senderTitle: "Founder & CEO",
      });

      // Push to Outlook
      const outlookResult = await createOutlookDraft(accessToken, {
        subject: content.subject,
        bodyHtml: html,
        toName: `${lead.firstName} ${lead.lastName}`,
        toEmail: lead.email,
      });

      // Save to database
      await db.emailDraft.create({
        data: {
          leadId: lead.id,
          subject: content.subject,
          bodyHtml: html,
          bodyText: text,
          outlookDraftId: outlookResult.outlookDraftId,
          outlookMessageId: outlookResult.outlookMessageId,
          status: "DRAFT",
          batchDate: today,
          strategyAngle: strategy.angle,
          sequenceStep: strategy.sequenceStep,
          pivotedFrom: strategy.pivotedFrom,
          metadata: {
            personalizationAnchor: content.personalizationAnchor,
            heatScoreAtStart: lead.heatScore,
            triggeredBy: options.triggeredBy,
          },
        },
      });

      // Log activity
      await db.activity.create({
        data: {
          leadId: lead.id,
          type: "AUTO_NURTURE",
          title: `Draft generated: ${strategy.angle} step ${strategy.sequenceStep}${strategy.isPivot ? " (PIVOT)" : ""}`,
          description: content.subject,
          automated: true,
          metadata: { angle: strategy.angle, step: strategy.sequenceStep, pivot: strategy.isPivot },
        },
      });

      result.generated++;
      if (lead.tier === "TIER_2") result.tier2Generated++;
      else result.tier1Generated++;
    } catch (err) {
      result.errors.push({
        leadId: lead.id,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return result;
}
