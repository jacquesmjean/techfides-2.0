/**
 * LLM Content Generation — Strategy-Aware
 *
 * Bridges the vLLM client with the sequence templates to produce
 * personalized email content per lead + strategy angle + step.
 */

import { chatCompletion } from "@/lib/velocity/llm/client";
import { SEQUENCE_TEMPLATES } from "./sequence-templates";
import type { StrategyAngle } from "@prisma/client";

export interface EmailContent {
  subject: string;
  bodyParagraphs: string[];
  ctaText: string;
  ctaUrl: string;
  personalizationAnchor: string;
}

export interface LeadEnrichmentContext {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  vertical: string;
  companyRevenue?: string;
  companyEmployees?: number;
  techStack?: string[];
  recentNews?: string[];
  linkedinActivity?: string[];
  estimatedMonthlySaas?: number;
  toolCount?: number;
}

const BASE_URL = process.env.TECHFIDES_PUBLIC_URL || "https://techfides.com";

/**
 * Generate personalized email content using the local LLM.
 */
export async function generatePersonalizedEmail(
  lead: LeadEnrichmentContext,
  angle: StrategyAngle,
  step: number
): Promise<EmailContent> {
  const templates = SEQUENCE_TEMPLATES[angle];
  const template = templates?.[step - 1];

  if (!template) {
    return getFallbackContent(lead, angle, step);
  }

  const ctaUrl = `${BASE_URL}${template.ctaPath}?utm_source=velocity&utm_medium=email&utm_campaign=${angle.toLowerCase()}&utm_content=step${step}`;

  const systemPrompt = `You are a B2B sales copywriter for TechFides, a company that deploys sovereign AI on client hardware. You write concise, direct emails for executives.

Company context:
- TechFides deploys AI locally — no cloud, no data leakage
- Pricing: Silver ($5K setup, $500/mo), Gold ($10K, $1K/mo), Platinum ($15K+, $2.5K+/mo)
- Services: AI 360 Assessment, TEDOS OS governance platform, Transformation Management
- Verticals: Legal, Medical, Auto, Trades

Rules:
- Max 150 words for the body
- No corporate jargon — write like a smart human
- One clear CTA
- Reference specific enrichment data naturally
- Do NOT use exclamation marks
- Output valid JSON only`;

  const userPrompt = `Generate an email for:
Recipient: ${lead.firstName} ${lead.lastName}, ${lead.title} at ${lead.company}
Vertical: ${lead.vertical}
Company Revenue: ${lead.companyRevenue || "unknown"}
Company Size: ${lead.companyEmployees || "unknown"} employees
Tech Stack: ${(lead.techStack || []).join(", ") || "unknown"}
Recent News: ${(lead.recentNews || []).join("; ") || "none"}
Estimated Monthly SaaS Spend: $${lead.estimatedMonthlySaas || "unknown"}
Tool Count: ${lead.toolCount || "unknown"}

Strategy: ${angle}
Step ${step}/5: "${template.label}"
Instructions: ${template.bodyPrompt}
Subject template hint: "${template.subjectTemplate}"

Respond with JSON:
{
  "subject": "the email subject line",
  "bodyParagraphs": ["paragraph 1", "paragraph 2", "paragraph 3"],
  "personalizationAnchor": "the specific data point used for personalization"
}`;

  try {
    const response = await chatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 500,
      responseFormat: "json_object",
    });

    const parsed = JSON.parse(response.content) as {
      subject?: string;
      bodyParagraphs?: string[];
      personalizationAnchor?: string;
    };

    return {
      subject: parsed.subject || template.subjectTemplate.replace("{company}", lead.company).replace("{firstName}", lead.firstName),
      bodyParagraphs: parsed.bodyParagraphs || ["[LLM returned empty body — using fallback]"],
      ctaText: template.ctaText,
      ctaUrl,
      personalizationAnchor: parsed.personalizationAnchor || "general",
    };
  } catch {
    return getFallbackContent(lead, angle, step);
  }
}

/**
 * Deterministic fallback when LLM is unavailable or in mock mode.
 */
function getFallbackContent(
  lead: LeadEnrichmentContext,
  angle: StrategyAngle,
  step: number
): EmailContent {
  const templates = SEQUENCE_TEMPLATES[angle];
  const template = templates?.[step - 1] || templates?.[0];

  const ctaUrl = `${BASE_URL}${template?.ctaPath || "/contact"}?utm_source=velocity&utm_medium=email&utm_campaign=${angle.toLowerCase()}&utm_content=step${step}`;

  const subject = (template?.subjectTemplate || "A message from TechFides")
    .replace("{company}", lead.company)
    .replace("{firstName}", lead.firstName)
    .replace("{vertical}", lead.vertical)
    .replace("{saasTotal}", `${lead.estimatedMonthlySaas || "X,XXX"}`)
    .replace("{toolCount}", `${lead.toolCount || "multiple"}`)
    .replace("{topTools}", (lead.techStack || []).slice(0, 3).join(", ") || "your current tools")
    .replace("{hours}", "10+")
    .replace("$X", "$150K+");

  const bodyMap: Record<StrategyAngle, string[]> = {
    STRATEGIC_ALIGNMENT: [
      `${lead.firstName}, most AI initiatives fail not because of the technology — but because the IT foundation wasn't aligned with business goals first.`,
      `At TechFides, we've built the AI 360 Assessment specifically to diagnose alignment gaps before they become expensive. For ${lead.company}, this could mean the difference between a successful AI deployment and another stalled pilot.`,
      `Would a 30-minute strategy session make sense this week?`,
    ],
    COST_RECOVERY: [
      `${lead.firstName}, by our estimates, ${lead.company} is spending $${lead.estimatedMonthlySaas || "3,000"}+/month on cloud AI tools you don't own.`,
      `What if you could deploy the same capability on your own hardware, for a predictable monthly retainer — and own the infrastructure forever?`,
      `TechFides' Sovereign AI stack eliminates the cloud tax. No more per-seat fees, no data leaving your building.`,
    ],
    TEDOS_GOVERNANCE: [
      `${lead.firstName}, we understand ${lead.company} may not be ready for full AI deployment yet — and that's actually the smart position.`,
      `The bigger issue we see is legacy app fragmentation. TEDOS sits on top of your existing systems as a governance layer — no rip-and-replace required.`,
      `Governance first, AI second. That's the order that actually works.`,
    ],
    SUBSCRIPTION_REDUCTION: [
      `${lead.firstName}, we detected ${lead.toolCount || "multiple"} SaaS tools in ${lead.company}'s stack — that's a lot of monthly invoices.`,
      `What if you could replace the top 3 with a single system you own? No more per-seat pricing, no more vendor lock-in. The savings go straight to your bottom line.`,
      `We built TechFides to help companies like yours stop renting and start owning.`,
    ],
  };

  return {
    subject,
    bodyParagraphs: bodyMap[angle] || bodyMap.COST_RECOVERY,
    ctaText: template?.ctaText || "Learn More",
    ctaUrl,
    personalizationAnchor: "fallback_template",
  };
}
