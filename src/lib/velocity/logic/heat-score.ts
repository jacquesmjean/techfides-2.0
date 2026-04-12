/**
 * HeatScore Engine — Confusion & Involvement Signal Scoring
 *
 * Calculates lead heat based on behavioral signals (email engagement,
 * website visits) and enrichment signals (Legacy Friction for Tier 2,
 * Tool Fatigue for Tier 1).
 *
 * Threshold: 40 points triggers outreach eligibility.
 */

export interface ScoringWeights {
  // Behavioral signals
  EMAIL_OPEN: number;
  EMAIL_CLICK_AI360: number;
  EMAIL_CLICK_CALCULATOR: number;
  EMAIL_REPLY: number;
  WEBSITE_PRICING_VIEW: number;
  DEAL_ROOM_VIEW: number;
  CONTACT_FORM_SUBMIT: number;

  // Confusion Signals (Tier 2 — Legacy Friction)
  JOB_POSTING_ERP_MANAGER: number;
  JOB_POSTING_DIGITAL_TRANSFORM: number;
  MERGER_ACQUISITION_NEWS: number;
  EXECUTIVE_HIRE: number;

  // Involvement Signals (Tier 1 — Tool Fatigue)
  HIGH_COST_SAAS_STACK: number;
  MULTIPLE_AI_TOOL_SUBSCRIPTIONS: number;
  TOOL_FATIGUE_SIGNALS: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  EMAIL_OPEN: 10,
  EMAIL_CLICK_AI360: 20,
  EMAIL_CLICK_CALCULATOR: 20,
  EMAIL_REPLY: 30,
  WEBSITE_PRICING_VIEW: 15,
  DEAL_ROOM_VIEW: 25,
  CONTACT_FORM_SUBMIT: 40,

  JOB_POSTING_ERP_MANAGER: 25,
  JOB_POSTING_DIGITAL_TRANSFORM: 25,
  MERGER_ACQUISITION_NEWS: 30,
  EXECUTIVE_HIRE: 20,

  HIGH_COST_SAAS_STACK: 15,
  MULTIPLE_AI_TOOL_SUBSCRIPTIONS: 20,
  TOOL_FATIGUE_SIGNALS: 15,
};

export interface DetectedSignal {
  type: keyof ScoringWeights;
  source: string;
  detail: string;
  points: number;
}

/**
 * Detect "Confusion Signals" from enrichment data — indicates
 * Legacy Friction (Tier 2 targets).
 */
export function detectConfusionSignals(
  enrichment: Record<string, unknown> | null,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): DetectedSignal[] {
  if (!enrichment) return [];
  const signals: DetectedSignal[] = [];

  const jobPostings = enrichment.jobPostings as Array<{ title?: string }> | undefined;
  if (jobPostings) {
    for (const job of jobPostings) {
      const title = (job.title || "").toLowerCase();
      if (title.includes("erp") || title.includes("sap") || title.includes("oracle")) {
        signals.push({
          type: "JOB_POSTING_ERP_MANAGER",
          source: "enrichment",
          detail: `Job posting: ${job.title}`,
          points: weights.JOB_POSTING_ERP_MANAGER,
        });
      }
      if (title.includes("digital transformation") || title.includes("modernization")) {
        signals.push({
          type: "JOB_POSTING_DIGITAL_TRANSFORM",
          source: "enrichment",
          detail: `Job posting: ${job.title}`,
          points: weights.JOB_POSTING_DIGITAL_TRANSFORM,
        });
      }
    }
  }

  const news = enrichment.recentNews as Array<{ headline?: string }> | undefined;
  if (news) {
    for (const item of news) {
      const headline = (item.headline || "").toLowerCase();
      if (headline.includes("merger") || headline.includes("acquisition") || headline.includes("acquires")) {
        signals.push({
          type: "MERGER_ACQUISITION_NEWS",
          source: "enrichment",
          detail: `News: ${item.headline}`,
          points: weights.MERGER_ACQUISITION_NEWS,
        });
      }
      if (headline.includes("new cto") || headline.includes("new cio") || headline.includes("vp of it") || headline.includes("chief technology")) {
        signals.push({
          type: "EXECUTIVE_HIRE",
          source: "enrichment",
          detail: `News: ${item.headline}`,
          points: weights.EXECUTIVE_HIRE,
        });
      }
    }
  }

  return signals;
}

/**
 * Detect "Involvement Signals" from enrichment data — indicates
 * Tool Fatigue (Tier 1 targets).
 */
export function detectInvolvementSignals(
  enrichment: Record<string, unknown> | null,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): DetectedSignal[] {
  if (!enrichment) return [];
  const signals: DetectedSignal[] = [];

  const techStack = (enrichment.companyTechStack as string[]) || [];
  const lowerStack = techStack.map((t) => t.toLowerCase());

  // High-cost SaaS detection
  const highCostTools = ["salesforce", "hubspot", "azure openai", "openai", "dynamics 365", "servicenow", "workday"];
  const foundHighCost = highCostTools.filter((tool) =>
    lowerStack.some((t) => t.includes(tool))
  );

  if (foundHighCost.length > 0) {
    signals.push({
      type: "HIGH_COST_SAAS_STACK",
      source: "enrichment",
      detail: `High-cost tools: ${foundHighCost.join(", ")}`,
      points: weights.HIGH_COST_SAAS_STACK,
    });
  }

  // Multiple AI tool subscriptions
  const aiTools = ["openai", "azure openai", "google ai", "anthropic", "cohere", "jasper", "copy.ai"];
  const foundAiTools = aiTools.filter((tool) =>
    lowerStack.some((t) => t.includes(tool))
  );

  if (foundAiTools.length >= 2) {
    signals.push({
      type: "MULTIPLE_AI_TOOL_SUBSCRIPTIONS",
      source: "enrichment",
      detail: `AI tools: ${foundAiTools.join(", ")}`,
      points: weights.MULTIPLE_AI_TOOL_SUBSCRIPTIONS,
    });
  }

  // Tool fatigue: 3+ overlapping SaaS tools
  if (techStack.length >= 5) {
    signals.push({
      type: "TOOL_FATIGUE_SIGNALS",
      source: "enrichment",
      detail: `${techStack.length} tools in stack`,
      points: weights.TOOL_FATIGUE_SIGNALS,
    });
  }

  return signals;
}

/**
 * Calculate total heat score from all signal sources.
 */
export function calculateHeatScore(
  behavioralSignals: DetectedSignal[],
  confusionSignals: DetectedSignal[],
  involvementSignals: DetectedSignal[]
): { score: number; signals: DetectedSignal[] } {
  const allSignals = [...behavioralSignals, ...confusionSignals, ...involvementSignals];
  const score = Math.min(100, allSignals.reduce((sum, s) => sum + s.points, 0));
  return { score, signals: allSignals };
}
