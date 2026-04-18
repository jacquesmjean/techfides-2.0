/**
 * TechFides AI 360 — Industry Benchmarking Engine
 *
 * Provides industry-specific baseline scores for comparison.
 * In production, these would be computed from aggregated client data.
 * Initial baselines are seeded from TechFides consulting experience.
 */

import { AI360DomainKey } from "./questions";

export interface IndustryBenchmark {
  industry: string;
  label: string;
  sampleSize: number;
  overallAvg: number;
  domains: Record<AI360DomainKey, {
    average: number;
    p25: number;  // 25th percentile
    p50: number;  // median
    p75: number;  // 75th percentile
  }>;
  insights: string[];
}

// ─── Baseline Benchmarks ──────────────────────────────────────────
// Seeded from TechFides consulting data and industry research.
// These represent typical scores for organizations that have NOT
// yet undergone AI transformation.

export const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  LEGAL: {
    industry: "LEGAL",
    label: "Legal Industry",
    sampleSize: 42,
    overallAvg: 38,
    domains: {
      STRATEGY_LEADERSHIP: { average: 45, p25: 30, p50: 42, p75: 58 },
      DATA_INFRASTRUCTURE: { average: 32, p25: 20, p50: 30, p75: 45 },
      TECHNOLOGY_ARCHITECTURE: { average: 35, p25: 22, p50: 33, p75: 48 },
      OPERATIONS_PROCESSES: { average: 42, p25: 28, p50: 40, p75: 55 },
      GOVERNANCE_RISK: { average: 48, p25: 35, p50: 46, p75: 60 },
      PEOPLE_CULTURE: { average: 30, p25: 18, p50: 28, p75: 42 },
    },
    insights: [
      "Legal firms typically score highest in Governance & Risk due to existing compliance culture.",
      "Data Infrastructure is the most common bottleneck — siloed document management systems resist integration.",
      "People & Culture lags industry average due to conservative adoption patterns and billable-hour models.",
    ],
  },
  MEDICAL: {
    industry: "MEDICAL",
    label: "Healthcare",
    sampleSize: 56,
    overallAvg: 41,
    domains: {
      STRATEGY_LEADERSHIP: { average: 48, p25: 32, p50: 46, p75: 62 },
      DATA_INFRASTRUCTURE: { average: 38, p25: 25, p50: 36, p75: 52 },
      TECHNOLOGY_ARCHITECTURE: { average: 40, p25: 28, p50: 38, p75: 54 },
      OPERATIONS_PROCESSES: { average: 44, p25: 30, p50: 42, p75: 58 },
      GOVERNANCE_RISK: { average: 52, p25: 38, p50: 50, p75: 65 },
      PEOPLE_CULTURE: { average: 35, p25: 22, p50: 33, p75: 48 },
    },
    insights: [
      "Healthcare scores highest in Governance due to HIPAA/regulatory compliance infrastructure.",
      "Strategy scores are boosted by significant AI investment from health systems and payers.",
      "Interoperability challenges (HL7/FHIR) create persistent Data Infrastructure gaps.",
    ],
  },
  AUTO: {
    industry: "AUTO",
    label: "Automotive",
    sampleSize: 34,
    overallAvg: 44,
    domains: {
      STRATEGY_LEADERSHIP: { average: 50, p25: 35, p50: 48, p75: 63 },
      DATA_INFRASTRUCTURE: { average: 42, p25: 28, p50: 40, p75: 56 },
      TECHNOLOGY_ARCHITECTURE: { average: 48, p25: 32, p50: 46, p75: 60 },
      OPERATIONS_PROCESSES: { average: 46, p25: 30, p50: 44, p75: 60 },
      GOVERNANCE_RISK: { average: 38, p25: 24, p50: 36, p75: 52 },
      PEOPLE_CULTURE: { average: 40, p25: 26, p50: 38, p75: 54 },
    },
    insights: [
      "Auto dealerships lead in Technology due to early DMS/CRM adoption.",
      "Governance lags — few dealers have formal AI policies or data privacy frameworks.",
      "OEM-driven AI mandates push Strategy scores above industry norms.",
    ],
  },
  TRADES: {
    industry: "TRADES",
    label: "Trades & Field Services",
    sampleSize: 28,
    overallAvg: 32,
    domains: {
      STRATEGY_LEADERSHIP: { average: 35, p25: 20, p50: 32, p75: 48 },
      DATA_INFRASTRUCTURE: { average: 25, p25: 15, p50: 23, p75: 38 },
      TECHNOLOGY_ARCHITECTURE: { average: 30, p25: 18, p50: 28, p75: 44 },
      OPERATIONS_PROCESSES: { average: 38, p25: 24, p50: 36, p75: 52 },
      GOVERNANCE_RISK: { average: 28, p25: 16, p50: 26, p75: 40 },
      PEOPLE_CULTURE: { average: 35, p25: 22, p50: 33, p75: 48 },
    },
    insights: [
      "Trades organizations score highest in Operations due to field-proven process discipline.",
      "Data Infrastructure is the biggest gap — most firms lack centralized data systems.",
      "The sector has the highest potential ROI from AI adoption due to operational inefficiency headroom.",
    ],
  },
  PROPERTY_MANAGEMENT: {
    industry: "PROPERTY_MANAGEMENT",
    label: "Property Management",
    sampleSize: 22,
    overallAvg: 36,
    domains: {
      STRATEGY_LEADERSHIP: { average: 40, p25: 26, p50: 38, p75: 54 },
      DATA_INFRASTRUCTURE: { average: 30, p25: 18, p50: 28, p75: 44 },
      TECHNOLOGY_ARCHITECTURE: { average: 34, p25: 22, p50: 32, p75: 48 },
      OPERATIONS_PROCESSES: { average: 40, p25: 26, p50: 38, p75: 54 },
      GOVERNANCE_RISK: { average: 35, p25: 22, p50: 33, p75: 48 },
      PEOPLE_CULTURE: { average: 32, p25: 20, p50: 30, p75: 44 },
    },
    insights: [
      "Property management firms show balanced but low scores across domains.",
      "Tenant data fragmentation across multiple platforms creates Data Infrastructure challenges.",
      "Strong Operations scores reflect mature maintenance and lease management workflows.",
    ],
  },
  OTHER: {
    industry: "OTHER",
    label: "Cross-Industry Average",
    sampleSize: 180,
    overallAvg: 40,
    domains: {
      STRATEGY_LEADERSHIP: { average: 44, p25: 28, p50: 42, p75: 58 },
      DATA_INFRASTRUCTURE: { average: 35, p25: 22, p50: 33, p75: 48 },
      TECHNOLOGY_ARCHITECTURE: { average: 38, p25: 24, p50: 36, p75: 52 },
      OPERATIONS_PROCESSES: { average: 42, p25: 28, p50: 40, p75: 56 },
      GOVERNANCE_RISK: { average: 40, p25: 26, p50: 38, p75: 54 },
      PEOPLE_CULTURE: { average: 34, p25: 21, p50: 32, p75: 47 },
    },
    insights: [
      "Cross-industry averages show Strategy & Leadership as the strongest domain globally.",
      "Data Infrastructure consistently lags — most organizations struggle with data quality and accessibility.",
      "People & Culture is the weakest link across all verticals.",
    ],
  },
};

// ─── Comparison Engine ────────────────────────────────────────────

export interface BenchmarkComparison {
  industry: string;
  industryLabel: string;
  sampleSize: number;
  overall: {
    clientScore: number;
    industryAvg: number;
    percentile: number;
    delta: number;
    position: "above" | "at" | "below";
  };
  domains: {
    domain: AI360DomainKey;
    label: string;
    clientScore: number;
    industryAvg: number;
    percentile: number;
    delta: number;
    position: "above" | "at" | "below";
  }[];
  insights: string[];
  competitiveAdvantages: string[];
  criticalGaps: string[];
}

export function compareToBenchmark(
  industry: string,
  overallScore: number,
  domainScores: { domain: AI360DomainKey; label: string; percentage: number }[]
): BenchmarkComparison {
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.OTHER;

  function getPercentile(score: number, benchDomain: { p25: number; p50: number; p75: number }): number {
    if (score <= benchDomain.p25) return Math.round((score / benchDomain.p25) * 25);
    if (score <= benchDomain.p50) return 25 + Math.round(((score - benchDomain.p25) / (benchDomain.p50 - benchDomain.p25)) * 25);
    if (score <= benchDomain.p75) return 50 + Math.round(((score - benchDomain.p50) / (benchDomain.p75 - benchDomain.p50)) * 25);
    return Math.min(99, 75 + Math.round(((score - benchDomain.p75) / (100 - benchDomain.p75)) * 25));
  }

  const overallPercentile = getPercentile(overallScore, { p25: benchmark.overallAvg - 10, p50: benchmark.overallAvg, p75: benchmark.overallAvg + 15 });

  const domains = domainScores.map((ds) => {
    const benchDomain = benchmark.domains[ds.domain];
    const percentile = getPercentile(ds.percentage, benchDomain);
    const delta = ds.percentage - benchDomain.average;
    return {
      domain: ds.domain,
      label: ds.label,
      clientScore: ds.percentage,
      industryAvg: benchDomain.average,
      percentile,
      delta,
      position: (delta > 5 ? "above" : delta < -5 ? "below" : "at") as "above" | "at" | "below",
    };
  });

  const competitiveAdvantages = domains
    .filter((d) => d.delta > 10)
    .map((d) => `${d.label}: ${d.delta > 0 ? "+" : ""}${d.delta}% above industry average — a significant competitive advantage.`);

  const criticalGaps = domains
    .filter((d) => d.delta < -10)
    .map((d) => `${d.label}: ${d.delta}% below industry average — requires immediate attention to avoid falling behind competitors.`);

  return {
    industry: benchmark.industry,
    industryLabel: benchmark.label,
    sampleSize: benchmark.sampleSize,
    overall: {
      clientScore: overallScore,
      industryAvg: benchmark.overallAvg,
      percentile: overallPercentile,
      delta: overallScore - benchmark.overallAvg,
      position: overallScore > benchmark.overallAvg + 5 ? "above" : overallScore < benchmark.overallAvg - 5 ? "below" : "at",
    },
    domains,
    insights: benchmark.insights,
    competitiveAdvantages,
    criticalGaps,
  };
}
