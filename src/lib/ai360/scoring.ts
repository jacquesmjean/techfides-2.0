/**
 * TechFides AI 360 Readiness Assessment — Scoring Engine
 *
 * Computes domain scores, overall score, maturity levels,
 * heat map data, and risk profiles from assessment responses.
 */

import {
  AI360_DOMAINS,
  AI360_QUESTIONS,
  AI360DomainKey,
  AI360DomainDef,
} from "./questions";

// ─── Types ────────────────────────────────────────────────────────

export interface ResponseInput {
  questionId: string;
  selectedOption: number; // 1–5
}

export interface DomainScore {
  domain: AI360DomainKey;
  label: string;
  rawScore: number;
  maxScore: number;
  percentage: number;         // 0–100
  maturity: MaturityLevel;
  color: HeatColor;
  questionCount: number;
  answeredCount: number;
  strengths: string[];        // question IDs scoring 4+
  gaps: string[];             // question IDs scoring ≤2
}

export interface OverallScore {
  score: number;              // 0–100 weighted average
  maturity: MaturityLevel;
  domains: DomainScore[];
  heatMap: HeatMapCell[];
  riskProfile: RiskItem[];
  opportunities: OpportunityItem[];
  completionRate: number;     // % of questions answered
}

export type MaturityLevel = "LEADING" | "ADVANCING" | "DEVELOPING" | "EMERGING" | "NASCENT";

export type HeatColor = "green" | "yellow" | "red";

export interface HeatMapCell {
  domain: AI360DomainKey;
  label: string;
  percentage: number;
  color: HeatColor;
}

export interface RiskItem {
  severity: "critical" | "high" | "medium" | "low";
  domain: AI360DomainKey;
  title: string;
  description: string;
  questionIds: string[];
}

export interface OpportunityItem {
  category: "quick_win" | "strategic" | "foundational" | "scale";
  domain: AI360DomainKey;
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
}

// ─── Domain Weights (for overall score) ───────────────────────────
const DOMAIN_WEIGHTS: Record<AI360DomainKey, number> = {
  STRATEGY_LEADERSHIP: 1.2,
  DATA_INFRASTRUCTURE: 1.2,
  TECHNOLOGY_ARCHITECTURE: 1.0,
  OPERATIONS_PROCESSES: 1.0,
  GOVERNANCE_RISK: 1.1,
  PEOPLE_CULTURE: 1.0,
};

// ─── Maturity Thresholds ──────────────────────────────────────────
function getMaturityLevel(percentage: number): MaturityLevel {
  if (percentage >= 80) return "LEADING";
  if (percentage >= 60) return "ADVANCING";
  if (percentage >= 40) return "DEVELOPING";
  if (percentage >= 20) return "EMERGING";
  return "NASCENT";
}

function getHeatColor(percentage: number): HeatColor {
  if (percentage >= 60) return "green";
  if (percentage >= 40) return "yellow";
  return "red";
}

const MATURITY_LABELS: Record<MaturityLevel, string> = {
  LEADING: "Leading",
  ADVANCING: "Advancing",
  DEVELOPING: "Developing",
  EMERGING: "Emerging",
  NASCENT: "Nascent",
};

// ─── Scoring Engine ───────────────────────────────────────────────

export function computeScores(responses: ResponseInput[]): OverallScore {
  const responseMap = new Map(responses.map((r) => [r.questionId, r.selectedOption]));
  const domainScores: DomainScore[] = [];

  for (const domainDef of AI360_DOMAINS) {
    const domainQuestions = AI360_QUESTIONS.filter((q) => q.domain === domainDef.key);
    let rawScore = 0;
    let maxScore = 0;
    let answeredCount = 0;
    const strengths: string[] = [];
    const gaps: string[] = [];

    for (const q of domainQuestions) {
      maxScore += q.weight * 5;
      const answer = responseMap.get(q.id);
      if (answer !== undefined) {
        answeredCount++;
        const questionScore = answer * q.weight;
        rawScore += questionScore;
        if (answer >= 4) strengths.push(q.id);
        if (answer <= 2) gaps.push(q.id);
      }
    }

    const percentage = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

    domainScores.push({
      domain: domainDef.key,
      label: domainDef.label,
      rawScore,
      maxScore,
      percentage,
      maturity: getMaturityLevel(percentage),
      color: getHeatColor(percentage),
      questionCount: domainQuestions.length,
      answeredCount,
      strengths,
      gaps,
    });
  }

  // Weighted overall score
  let weightedSum = 0;
  let weightTotal = 0;
  for (const ds of domainScores) {
    const w = DOMAIN_WEIGHTS[ds.domain];
    weightedSum += ds.percentage * w;
    weightTotal += w;
  }
  const overallPercentage = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0;

  // Heat map
  const heatMap: HeatMapCell[] = domainScores.map((ds) => ({
    domain: ds.domain,
    label: ds.label,
    percentage: ds.percentage,
    color: ds.color,
  }));

  // Risk profile from gaps
  const riskProfile = generateRiskProfile(domainScores);

  // Opportunities from domain analysis
  const opportunities = generateOpportunities(domainScores);

  // Completion rate
  const totalQuestions = AI360_QUESTIONS.length;
  const totalAnswered = responses.length;
  const completionRate = Math.round((totalAnswered / totalQuestions) * 100);

  return {
    score: overallPercentage,
    maturity: getMaturityLevel(overallPercentage),
    domains: domainScores,
    heatMap,
    riskProfile,
    opportunities,
    completionRate,
  };
}

// ─── Risk Profile Generation ──────────────────────────────────────

function generateRiskProfile(domainScores: DomainScore[]): RiskItem[] {
  const risks: RiskItem[] = [];

  for (const ds of domainScores) {
    if (ds.gaps.length === 0) continue;

    const severity: RiskItem["severity"] =
      ds.percentage < 20 ? "critical" :
      ds.percentage < 40 ? "high" :
      ds.percentage < 60 ? "medium" : "low";

    const domainDef = AI360_DOMAINS.find((d) => d.key === ds.domain)!;
    const gapQuestions = ds.gaps.map((id) => AI360_QUESTIONS.find((q) => q.id === id)!);
    const highWeightGaps = gapQuestions.filter((q) => q.weight >= 1.25);

    if (highWeightGaps.length > 0) {
      risks.push({
        severity: ds.percentage < 40 ? "critical" : "high",
        domain: ds.domain,
        title: `${domainDef.shortLabel}: Critical gaps in foundational capabilities`,
        description: `${highWeightGaps.length} high-impact question(s) scored below threshold in ${domainDef.label}. These represent core capabilities that block AI readiness.`,
        questionIds: highWeightGaps.map((q) => q.id),
      });
    }

    if (ds.gaps.length >= 3) {
      risks.push({
        severity,
        domain: ds.domain,
        title: `${domainDef.shortLabel}: Systemic weakness across multiple areas`,
        description: `${ds.gaps.length} of ${ds.questionCount} questions scored at or below 2 in ${domainDef.label}, indicating broad immaturity in this domain.`,
        questionIds: ds.gaps,
      });
    }
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  risks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return risks;
}

// ─── Opportunity Generation ───────────────────────────────────────

function generateOpportunities(domainScores: DomainScore[]): OpportunityItem[] {
  const opps: OpportunityItem[] = [];

  for (const ds of domainScores) {
    const domainDef = AI360_DOMAINS.find((d) => d.key === ds.domain)!;

    // Quick wins: domains at 40–60% with some strengths
    if (ds.percentage >= 40 && ds.percentage < 60 && ds.strengths.length > 0) {
      opps.push({
        category: "quick_win",
        domain: ds.domain,
        title: `Accelerate ${domainDef.shortLabel} from Developing to Advancing`,
        description: `${domainDef.label} shows existing strengths (${ds.strengths.length} areas scoring 4+). Targeted effort on ${ds.gaps.length} gap areas can quickly elevate this domain.`,
        effort: "low",
        impact: "medium",
      });
    }

    // Strategic: domains at 60–80% ready to reach Leading
    if (ds.percentage >= 60 && ds.percentage < 80) {
      opps.push({
        category: "strategic",
        domain: ds.domain,
        title: `Elevate ${domainDef.shortLabel} to Leading maturity`,
        description: `${domainDef.label} is Advancing with ${ds.percentage}% readiness. Strategic investment in remaining gaps can achieve industry-leading capability.`,
        effort: "medium",
        impact: "high",
      });
    }

    // Foundational: domains below 40% need base building
    if (ds.percentage < 40) {
      opps.push({
        category: "foundational",
        domain: ds.domain,
        title: `Build ${domainDef.shortLabel} foundation`,
        description: `${domainDef.label} is at ${ds.percentage}% — establishing basic capabilities is prerequisite for any AI initiative in this area.`,
        effort: "high",
        impact: "high",
      });
    }

    // Scale: domains at 80%+ can be leveraged
    if (ds.percentage >= 80) {
      opps.push({
        category: "scale",
        domain: ds.domain,
        title: `Scale and replicate ${domainDef.shortLabel} excellence`,
        description: `${domainDef.label} is at Leading level (${ds.percentage}%). This maturity can be leveraged as a model for weaker domains.`,
        effort: "low",
        impact: "high",
      });
    }
  }

  return opps;
}

// ─── Exports for labels ───────────────────────────────────────────
export { MATURITY_LABELS, getMaturityLevel, getHeatColor };
