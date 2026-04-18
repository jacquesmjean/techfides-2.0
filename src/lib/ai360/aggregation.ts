/**
 * TechFides AI 360 — Multi-Respondent Aggregation & Variance Analysis
 *
 * Aggregates responses across multiple respondents per question,
 * identifies alignment gaps, and surfaces overconfidence/blind spots.
 */

import { AI360_QUESTIONS, AI360_DOMAINS, AI360DomainKey, getQuestionsByDomain } from "./questions";

// ─── Types ────────────────────────────────────────────────────────

export interface RespondentResponse {
  questionId: string;
  responderId: string;
  responderName: string | null;
  responderRole: string | null;
  selectedOption: number;
  notes: string | null;
}

export interface QuestionAggregation {
  questionId: string;
  questionText: string;
  domain: AI360DomainKey;
  weight: number;
  responses: {
    responderId: string;
    responderName: string;
    responderRole: string;
    selectedOption: number;
    notes: string;
  }[];
  respondentCount: number;
  average: number;
  median: number;
  min: number;
  max: number;
  spread: number;        // max - min
  stdDev: number;
  consensus: "strong" | "moderate" | "weak" | "divergent";
  aggregatedScore: number; // weighted average × question weight
}

export interface DomainAggregation {
  domain: AI360DomainKey;
  label: string;
  questions: QuestionAggregation[];
  averageScore: number;       // 0-100 percentage
  respondentBreakdown: {
    responderId: string;
    responderName: string;
    responderRole: string;
    domainAverage: number;    // that respondent's average for this domain
  }[];
  alignmentScore: number;     // 0-100, how aligned respondents are
  topDiscrepancies: {
    questionId: string;
    questionText: string;
    spread: number;
    highResponder: string;
    lowResponder: string;
  }[];
}

export interface OverallAggregation {
  domains: DomainAggregation[];
  respondentCount: number;
  respondents: {
    id: string;
    name: string;
    role: string;
    questionsAnswered: number;
    overallAverage: number;
  }[];
  globalAlignment: number;    // 0-100
  declaredVsObserved: {       // perception gap analysis
    domain: AI360DomainKey;
    leadershipAvg: number;    // CLIENT_ADMIN responses
    operationalAvg: number;   // CONTRIBUTOR responses
    gap: number;
  }[];
  blindSpots: {
    questionId: string;
    questionText: string;
    domain: AI360DomainKey;
    description: string;
  }[];
}

// ─── Aggregation Engine ───────────────────────────────────────────

export function aggregateResponses(responses: RespondentResponse[]): OverallAggregation {
  // Group by respondent
  const respondentMap = new Map<string, { name: string; role: string; responses: RespondentResponse[] }>();
  for (const r of responses) {
    if (!respondentMap.has(r.responderId)) {
      respondentMap.set(r.responderId, {
        name: r.responderName || "Unknown",
        role: r.responderRole || "Unknown",
        responses: [],
      });
    }
    respondentMap.get(r.responderId)!.responses.push(r);
  }

  const respondentCount = respondentMap.size;

  // Build domain aggregations
  const domains: DomainAggregation[] = [];

  for (const domainDef of AI360_DOMAINS) {
    const domainQuestions = getQuestionsByDomain(domainDef.key);
    const questionAggs: QuestionAggregation[] = [];

    for (const q of domainQuestions) {
      const qResponses = responses
        .filter((r) => r.questionId === q.id && r.selectedOption > 0)
        .map((r) => ({
          responderId: r.responderId,
          responderName: r.responderName || "Unknown",
          responderRole: r.responderRole || "Unknown",
          selectedOption: r.selectedOption,
          notes: r.notes || "",
        }));

      if (qResponses.length === 0) {
        questionAggs.push({
          questionId: q.id,
          questionText: q.text,
          domain: q.domain,
          weight: q.weight,
          responses: [],
          respondentCount: 0,
          average: 0,
          median: 0,
          min: 0,
          max: 0,
          spread: 0,
          stdDev: 0,
          consensus: "strong",
          aggregatedScore: 0,
        });
        continue;
      }

      const values = qResponses.map((r) => r.selectedOption);
      const avg = values.reduce((s, v) => s + v, 0) / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const med = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const spread = max - min;
      const variance = values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      const consensus: QuestionAggregation["consensus"] =
        spread <= 1 ? "strong" :
        spread <= 2 ? "moderate" :
        spread <= 3 ? "weak" : "divergent";

      questionAggs.push({
        questionId: q.id,
        questionText: q.text,
        domain: q.domain,
        weight: q.weight,
        responses: qResponses,
        respondentCount: qResponses.length,
        average: Math.round(avg * 100) / 100,
        median: med,
        min,
        max,
        spread,
        stdDev: Math.round(stdDev * 100) / 100,
        consensus,
        aggregatedScore: Math.round(avg * q.weight * 100) / 100,
      });
    }

    // Domain-level metrics
    const answeredQuestions = questionAggs.filter((q) => q.respondentCount > 0);
    const maxDomainScore = domainQuestions.reduce((s, q) => s + q.weight * 5, 0);
    const actualDomainScore = answeredQuestions.reduce((s, q) => s + q.aggregatedScore, 0);
    const domainPct = maxDomainScore > 0 ? Math.round((actualDomainScore / maxDomainScore) * 100) : 0;

    // Per-respondent domain averages
    const respondentBreakdown = Array.from(respondentMap.entries()).map(([id, info]) => {
      const domainResponses = info.responses.filter((r) => {
        const q = AI360_QUESTIONS.find((qq) => qq.id === r.questionId);
        return q && q.domain === domainDef.key && r.selectedOption > 0;
      });
      const avg = domainResponses.length > 0
        ? domainResponses.reduce((s, r) => s + r.selectedOption, 0) / domainResponses.length
        : 0;
      return {
        responderId: id,
        responderName: info.name,
        responderRole: info.role,
        domainAverage: Math.round(avg * 100) / 100,
      };
    });

    // Alignment score (inverse of average spread)
    const avgSpread = answeredQuestions.length > 0
      ? answeredQuestions.reduce((s, q) => s + q.spread, 0) / answeredQuestions.length
      : 0;
    const alignmentScore = Math.round(Math.max(0, 100 - avgSpread * 25));

    // Top discrepancies
    const topDiscrepancies = answeredQuestions
      .filter((q) => q.spread >= 2 && q.respondentCount >= 2)
      .sort((a, b) => b.spread - a.spread)
      .slice(0, 3)
      .map((q) => {
        const highResp = q.responses.reduce((a, b) => a.selectedOption > b.selectedOption ? a : b);
        const lowResp = q.responses.reduce((a, b) => a.selectedOption < b.selectedOption ? a : b);
        return {
          questionId: q.questionId,
          questionText: q.questionText,
          spread: q.spread,
          highResponder: `${highResp.responderName} (${highResp.selectedOption}/5)`,
          lowResponder: `${lowResp.responderName} (${lowResp.selectedOption}/5)`,
        };
      });

    domains.push({
      domain: domainDef.key,
      label: domainDef.label,
      questions: questionAggs,
      averageScore: domainPct,
      respondentBreakdown,
      alignmentScore,
      topDiscrepancies,
    });
  }

  // Global respondent summaries
  const respondents = Array.from(respondentMap.entries()).map(([id, info]) => {
    const answered = info.responses.filter((r) => r.selectedOption > 0);
    const avg = answered.length > 0
      ? answered.reduce((s, r) => s + r.selectedOption, 0) / answered.length
      : 0;
    return {
      id,
      name: info.name,
      role: info.role,
      questionsAnswered: answered.length,
      overallAverage: Math.round(avg * 100) / 100,
    };
  });

  // Global alignment
  const globalAlignment = domains.length > 0
    ? Math.round(domains.reduce((s, d) => s + d.alignmentScore, 0) / domains.length)
    : 100;

  // Declared vs Observed (leadership vs operations)
  const declaredVsObserved = domains.map((d) => {
    const leadershipResps = d.respondentBreakdown.filter((r) => r.responderRole === "CLIENT_ADMIN");
    const operationalResps = d.respondentBreakdown.filter((r) => r.responderRole === "CONTRIBUTOR");

    const leadershipAvg = leadershipResps.length > 0
      ? Math.round(leadershipResps.reduce((s, r) => s + r.domainAverage, 0) / leadershipResps.length * 20)
      : 0;
    const operationalAvg = operationalResps.length > 0
      ? Math.round(operationalResps.reduce((s, r) => s + r.domainAverage, 0) / operationalResps.length * 20)
      : 0;

    return {
      domain: d.domain,
      leadershipAvg,
      operationalAvg,
      gap: leadershipAvg - operationalAvg,
    };
  });

  // Blind spots: questions where leadership scores high but operations scores low
  const blindSpots: OverallAggregation["blindSpots"] = [];
  for (const d of domains) {
    for (const q of d.questions) {
      if (q.respondentCount < 2) continue;
      const leaderResp = q.responses.filter((r) => r.responderRole === "CLIENT_ADMIN");
      const opResp = q.responses.filter((r) => r.responderRole === "CONTRIBUTOR");

      if (leaderResp.length > 0 && opResp.length > 0) {
        const leaderAvg = leaderResp.reduce((s, r) => s + r.selectedOption, 0) / leaderResp.length;
        const opAvg = opResp.reduce((s, r) => s + r.selectedOption, 0) / opResp.length;
        if (leaderAvg - opAvg >= 2) {
          blindSpots.push({
            questionId: q.questionId,
            questionText: q.questionText,
            domain: q.domain,
            description: `Leadership rates ${Math.round(leaderAvg * 10) / 10}/5 but operations rates ${Math.round(opAvg * 10) / 10}/5 — a ${Math.round((leaderAvg - opAvg) * 10) / 10} point perception gap.`,
          });
        }
      }
    }
  }

  return {
    domains,
    respondentCount,
    respondents,
    globalAlignment,
    declaredVsObserved,
    blindSpots,
  };
}
