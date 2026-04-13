/**
 * Deal Intelligence — Pre-Meeting Prospect Profiler
 *
 * Generates a comprehensive "Closing Dossier" for every prospect
 * before a meeting. Combines enrichment data, behavioral signals,
 * and AI analysis to give the closer everything they need to win.
 *
 * Output: A structured briefing with business profile, persona,
 * SWOT, pain map, objection playbook, and recommended hooks.
 */

import { db } from "@/lib/db";
import { chatCompletion } from "@/lib/velocity/llm/client";

export interface ProspectProfile {
  // Company Intelligence
  company: {
    name: string;
    industry: string;
    revenue: string;
    employees: string;
    techStack: string[];
    recentNews: string[];
    tier: string;
  };

  // Decision Maker Persona
  persona: {
    name: string;
    title: string;
    linkedinUrl: string | null;
    decisionStyle: string;     // "analytical" | "driver" | "amiable" | "expressive"
    likelyPriorities: string[];
    communicationTips: string[];
  };

  // SWOT Analysis
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };

  // Pain Map — where they need help most
  painMap: {
    primary: { pain: string; severity: "critical" | "high" | "medium"; evidence: string };
    secondary: Array<{ pain: string; severity: "critical" | "high" | "medium"; evidence: string }>;
  };

  // Objection Playbook
  objections: Array<{
    objection: string;
    response: string;
    proof: string;
  }>;

  // Closing Strategy
  strategy: {
    recommendedService: string;
    recommendedTier: string;
    openingHook: string;
    valueProposition: string;
    closingQuestion: string;
    urgencyAngle: string;
    competitorWeakness: string;
    pricingAnchor: string;
  };

  // Conversation Starters
  icebreakers: string[];

  // Risk Assessment
  dealRisk: {
    level: "low" | "medium" | "high";
    factors: string[];
    mitigation: string[];
  };

  generatedAt: string;
}

/**
 * Generate a full prospect profile for a lead.
 */
export async function generateProspectProfile(leadId: string): Promise<ProspectProfile | null> {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      enrichments: { orderBy: { enrichedAt: "desc" }, take: 1 },
      activities: { orderBy: { createdAt: "desc" }, take: 10 },
      emailDrafts: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!lead) return null;

  const enrichment = lead.enrichments[0];
  const techStack = (enrichment?.companyTechStack as string[]) || [];
  const recentNews = ((enrichment?.recentNews as Array<{ headline?: string }>) || []).map((n) => n.headline || "");
  const revenue = enrichment?.companyRevenue || "Unknown";
  const employees = enrichment?.companyEmployees ? String(enrichment.companyEmployees) : "Unknown";

  // Determine tier
  const tier = lead.tier === "TIER_2" ? "Tier 2 ($150K-$5M)" : "Tier 1 ($10K-$60K)";

  // Analyze behavioral signals
  const emailOpens = lead.activities.filter((a) => a.type === "EMAIL_OPENED").length;
  const emailClicks = lead.activities.filter((a) => a.type === "EMAIL_CLICKED").length;
  const hasReplied = lead.activities.some((a) => a.type === "EMAIL_RECEIVED");

  // Determine decision style from title
  const title = (lead.title || "").toLowerCase();
  let decisionStyle = "analytical";
  if (title.includes("ceo") || title.includes("owner") || title.includes("president")) decisionStyle = "driver";
  else if (title.includes("cto") || title.includes("engineer") || title.includes("technical")) decisionStyle = "analytical";
  else if (title.includes("hr") || title.includes("people") || title.includes("culture")) decisionStyle = "amiable";
  else if (title.includes("marketing") || title.includes("sales") || title.includes("growth")) decisionStyle = "expressive";

  // Build the profile using LLM
  const prompt = `You are a B2B sales intelligence analyst for TechFides, a sovereign AI company.

Generate a comprehensive prospect profile for a pre-meeting briefing.

PROSPECT DATA:
- Name: ${lead.firstName} ${lead.lastName}
- Title: ${lead.title || "Unknown"}
- Company: ${lead.company}
- Industry/Vertical: ${lead.vertical}
- Revenue: ${revenue}
- Employees: ${employees}
- Tech Stack: ${techStack.join(", ") || "Unknown"}
- Recent News: ${recentNews.join("; ") || "None found"}
- Heat Score: ${lead.heatScore}/100
- Pipeline Stage: ${lead.stage}
- Deal Value: $${lead.dealValue.toLocaleString()}
- Engagement: ${emailOpens} opens, ${emailClicks} clicks, ${hasReplied ? "has replied" : "no reply yet"}
- Tier: ${tier}
- Decision Style: ${decisionStyle}

TECHFIDES SERVICES:
- Sovereign AI: Deploy Llama/Mistral/Phi on client hardware ($5K-$15K+ setup, $500-$2,500+/mo)
- AI 360 Assessment: Diagnose AI readiness gaps ($45K-$85K)
- TEDOS OS: Governance layer on legacy systems ($75K-$750K+)
- Transformation Management: Full digital transformation ($50K-$350K)

Respond with valid JSON:
{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "opportunities": ["...", "..."],
  "threats": ["...", "..."],
  "primaryPain": { "pain": "...", "severity": "critical|high|medium", "evidence": "..." },
  "secondaryPains": [{ "pain": "...", "severity": "...", "evidence": "..." }],
  "objections": [{ "objection": "...", "response": "...", "proof": "..." }],
  "openingHook": "...",
  "valueProposition": "...",
  "closingQuestion": "...",
  "urgencyAngle": "...",
  "competitorWeakness": "...",
  "pricingAnchor": "...",
  "icebreakers": ["...", "...", "..."],
  "riskLevel": "low|medium|high",
  "riskFactors": ["..."],
  "riskMitigation": ["..."],
  "priorities": ["...", "...", "..."],
  "communicationTips": ["...", "...", "..."]
}`;

  let aiData: Record<string, unknown> = {};
  try {
    const response = await chatCompletion({
      messages: [
        { role: "system", content: "You are a B2B sales intelligence analyst. Output valid JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 1500,
      responseFormat: "json_object",
    });
    aiData = JSON.parse(response.content) as Record<string, unknown>;
  } catch {
    // Use deterministic fallbacks if LLM is unavailable
    aiData = generateFallbackProfile(lead, tier, techStack, decisionStyle);
  }

  const recommendedService = lead.tier === "TIER_2" ? "AI 360 Assessment" : "Sovereign AI";
  const recommendedTier = lead.dealValue >= 15000 ? "Platinum" : lead.dealValue >= 10000 ? "Gold" : "Silver";

  const profile: ProspectProfile = {
    company: {
      name: lead.company,
      industry: lead.vertical,
      revenue,
      employees,
      techStack,
      recentNews,
      tier,
    },
    persona: {
      name: `${lead.firstName} ${lead.lastName}`,
      title: lead.title || "Executive",
      linkedinUrl: lead.linkedinUrl,
      decisionStyle,
      likelyPriorities: (aiData.priorities as string[]) || ["Cost reduction", "Data security", "Operational efficiency"],
      communicationTips: (aiData.communicationTips as string[]) || [
        decisionStyle === "driver" ? "Be direct. Lead with ROI numbers. Respect their time." :
        decisionStyle === "analytical" ? "Bring data. Show technical architecture. Allow time for questions." :
        decisionStyle === "amiable" ? "Build rapport first. Focus on team impact. Be patient." :
        "Share the vision. Use stories. Show the big picture."
      ],
    },
    swot: {
      strengths: (aiData.strengths as string[]) || ["Established business", "Market presence"],
      weaknesses: (aiData.weaknesses as string[]) || ["Cloud dependency", "Legacy tech stack"],
      opportunities: (aiData.opportunities as string[]) || ["AI-driven efficiency", "Data sovereignty"],
      threats: (aiData.threats as string[]) || ["Competitor cloud lock-in", "Data breach risk"],
    },
    painMap: {
      primary: (aiData.primaryPain as { pain: string; severity: "critical" | "high" | "medium"; evidence: string }) || {
        pain: lead.tier === "TIER_2" ? "Legacy IT fragmentation blocking AI adoption" : "Cloud AI subscriptions draining budget",
        severity: "high",
        evidence: techStack.length > 3 ? `${techStack.length} tools in stack = complexity` : "Industry pattern",
      },
      secondary: (aiData.secondaryPains as Array<{ pain: string; severity: "critical" | "high" | "medium"; evidence: string }>) || [
        { pain: "Data leaving the building on every API call", severity: "high", evidence: "Using cloud AI" },
        { pain: "Vendor lock-in limiting negotiation power", severity: "medium", evidence: "Single vendor dependency" },
      ],
    },
    objections: (aiData.objections as Array<{ objection: string; response: string; proof: string }>) || [
      { objection: "We're not ready for AI", response: "That's exactly why the AI 360 Assessment exists — it identifies readiness gaps before you invest.", proof: "70% of AI pilots fail without proper assessment." },
      { objection: "It's too expensive", response: `You're currently spending on cloud AI with zero ownership. Over 36 months, TechFides saves you $${Math.round(lead.dealValue * 2).toLocaleString()}.`, proof: "Use the ROI calculator at techfides.com/pricing." },
      { objection: "We already have a solution", response: "Your current solution sends data to third parties. Sovereignty means you own the hardware and the data never leaves.", proof: "Every API call to cloud AI is a data leakage event." },
    ],
    strategy: {
      recommendedService,
      recommendedTier,
      openingHook: (aiData.openingHook as string) || `${lead.firstName}, I noticed ${lead.company} is using ${techStack[0] || "cloud AI tools"} — are you comfortable with where that data goes?`,
      valueProposition: (aiData.valueProposition as string) || `Deploy the same AI capability on hardware you own, in your building, for a predictable monthly retainer. Zero cloud tax. Zero data leakage.`,
      closingQuestion: (aiData.closingQuestion as string) || `If I could show you the exact ROI for ${lead.company} in 15 minutes, would that be worth a conversation this week?`,
      urgencyAngle: (aiData.urgencyAngle as string) || "Cloud AI costs increase 15-20% annually. Every month delayed is money lost.",
      competitorWeakness: (aiData.competitorWeakness as string) || "No competitor offers fully sovereign, self-hosted AI with on-site deployment and $0 installation.",
      pricingAnchor: `${recommendedTier} tier: $${recommendedTier === "Platinum" ? "15,000+" : recommendedTier === "Gold" ? "10,000" : "5,000"} setup, $${recommendedTier === "Platinum" ? "2,500+" : recommendedTier === "Gold" ? "1,000" : "500"}/mo. Installation: $0.`,
    },
    icebreakers: (aiData.icebreakers as string[]) || [
      recentNews[0] ? `I saw the news about ${recentNews[0].slice(0, 50)}... how is that impacting your tech priorities?` : `How is ${lead.company} thinking about AI governance heading into next quarter?`,
      `What's the biggest time sink for your team right now?`,
      `If you could eliminate one recurring cost from your tech stack, what would it be?`,
    ],
    dealRisk: {
      level: (aiData.riskLevel as "low" | "medium" | "high") || (lead.heatScore >= 70 ? "low" : lead.heatScore >= 40 ? "medium" : "high"),
      factors: (aiData.riskFactors as string[]) || [
        lead.staleDays > 5 ? `${lead.staleDays} days since last activity` : null,
        !hasReplied ? "No direct reply yet" : null,
        lead.heatScore < 50 ? "Low engagement score" : null,
      ].filter(Boolean) as string[],
      mitigation: (aiData.riskMitigation as string[]) || [
        "Lead with a quick-win demonstration",
        "Offer a no-obligation 15-minute cost-benefit analysis",
        "Reference a similar company in their vertical",
      ],
    },
    generatedAt: new Date().toISOString(),
  };

  // Store the dossier in the database
  try {
    await db.dossier.create({
      data: {
        leadId,
        intentScore: lead.heatScore,
        triggerEvent: `Pre-meeting prep generated`,
        painPoints: [profile.painMap.primary.pain, ...profile.painMap.secondary.map((p) => p.pain)],
        recommendedHook: profile.strategy.openingHook,
        recommendedTier: recommendedTier,
        estimatedDeal: lead.dealValue,
        snapshotJson: JSON.parse(JSON.stringify(profile)),
      },
    });
  } catch {
    // Non-critical — profile is still returned
  }

  return profile;
}

function generateFallbackProfile(
  lead: { firstName: string; company: string; vertical: string; dealValue: number; tier: string; heatScore: number },
  tier: string,
  techStack: string[],
  decisionStyle: string,
): Record<string, unknown> {
  const isT2 = tier.includes("Tier 2");
  return {
    strengths: ["Established market presence", `${lead.vertical} industry expertise`],
    weaknesses: [isT2 ? "Legacy IT fragmentation" : "Cloud subscription dependency", "Data leaving premises via cloud APIs"],
    opportunities: [isT2 ? "TEDOS governance layer for legacy modernization" : "Sovereign AI for cost elimination", "Competitive advantage through data sovereignty"],
    threats: ["Increasing cloud AI costs (15-20% annual)", "Regulatory tightening on data handling"],
    primaryPain: {
      pain: isT2 ? "Misaligned IT blocking business growth" : `Paying $${Math.round(lead.dealValue / 10).toLocaleString()}+/mo for AI you don't own`,
      severity: "high",
      evidence: techStack.length > 0 ? `Using ${techStack.slice(0, 3).join(", ")}` : "Industry pattern",
    },
    secondaryPains: [
      { pain: "Sensitive data sent to third-party AI providers", severity: "high", evidence: "Cloud AI usage" },
    ],
    objections: [
      { objection: "We're not ready", response: "The AI 360 Assessment diagnoses exactly where you are — it's the starting point, not the end.", proof: "70% of AI initiatives fail without readiness assessment." },
      { objection: "Too expensive", response: `You're spending more than this on cloud subscriptions. TechFides pays for itself in ${Math.ceil(lead.dealValue / 2000)} months.`, proof: "ROI calculator at techfides.com/pricing" },
    ],
    openingHook: `${lead.firstName}, I've been looking at how ${lead.vertical} businesses like ${lead.company} are approaching AI — and there's a pattern I want to share with you.`,
    valueProposition: isT2
      ? "We don't replace your systems — we put a governance layer on top that brings order to the chaos."
      : "Stop paying the cloud tax. Own your AI on your hardware. $0 installation.",
    closingQuestion: `What would it mean for ${lead.company} if you could ${isT2 ? "align your IT with your business strategy" : "cut your AI costs by 60%"} in the next 90 days?`,
    urgencyAngle: "Every month on cloud AI is another month of data leakage and rising costs.",
    competitorWeakness: "Nobody else offers $0 installation + model-agnostic local deployment.",
    pricingAnchor: `Starting at $5,000 setup with a $500/month retainer. $0 installation.`,
    icebreakers: [
      `How is ${lead.company} handling ${isT2 ? "the governance question around AI" : "the growing cost of AI tools"}?`,
      "What's the one thing that would make your team 2x more productive tomorrow?",
      `If you could change one thing about your current tech stack, what would it be?`,
    ],
    riskLevel: lead.heatScore >= 70 ? "low" : "medium",
    riskFactors: lead.heatScore < 50 ? ["Below-average engagement"] : [],
    riskMitigation: ["Lead with quick-win demo", "Reference similar vertical success"],
    priorities: [isT2 ? "Strategic IT alignment" : "Cost reduction", "Data security", "Operational efficiency"],
    communicationTips: [
      decisionStyle === "driver" ? "Be direct. Lead with numbers. Keep it under 20 minutes." :
      decisionStyle === "analytical" ? "Bring architecture diagrams. Show the technical depth. Be prepared for detailed questions." :
      "Build rapport first. Share client stories. Let them ask questions.",
    ],
  };
}
