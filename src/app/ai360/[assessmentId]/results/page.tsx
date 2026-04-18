"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";
import { ScoreCircle, HeatMap } from "@/components/ai360/HeatMap";
import { OverallScore, MATURITY_LABELS } from "@/lib/ai360/scoring";
import { AI360_DOMAINS, AI360_QUESTIONS } from "@/lib/ai360/questions";
import { compareToBenchmark, BenchmarkComparison } from "@/lib/ai360/benchmarks";

type SubTab = "review" | "overview" | "benchmark" | "opportunities" | "risks" | "downloads";

export default function ResultsPage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { status } = useAssessment();
  const [activeTab, setActiveTab] = useState<SubTab>("review");
  const [scores, setScores] = useState<OverallScore | null>(null);
  const [responses, setResponses] = useState<Record<string, { selectedOption: number; notes: string }>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/ai360/${assessmentId}/score`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/v1/ai360/${assessmentId}/responses`).then((r) => r.ok ? r.json() : { responses: [] }),
    ]).then(([scoreData, responseData]) => {
      if (scoreData) setScores(scoreData);
      const map: Record<string, { selectedOption: number; notes: string }> = {};
      for (const r of responseData?.responses || []) {
        map[r.questionId] = { selectedOption: r.selectedOption, notes: r.notes || "" };
      }
      setResponses(map);
    }).finally(() => setLoading(false));
  }, [assessmentId]);

  const isPublished = status === "PUBLISHED";

  const SUB_TABS: { key: SubTab; label: string }[] = [
    { key: "review", label: "Review Summary" },
    { key: "overview", label: "Executive Overview" },
    { key: "benchmark", label: "Industry Benchmark" },
    { key: "opportunities", label: "Opportunity Map" },
    { key: "risks", label: "Risks" },
    { key: "downloads", label: "Downloads" },
  ];

  function toggleSection(key: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
        {isPublished && (
          <span className="ml-auto text-xs text-gray-400">When status is Published, all results are final and read-only for clients.</span>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "review" && <ReviewTab responses={responses} expandedSections={expandedSections} onToggle={toggleSection} />}
      {activeTab === "overview" && <OverviewTab scores={scores} status={status} />}
      {activeTab === "benchmark" && <BenchmarkTab scores={scores} status={status} assessmentId={assessmentId} />}
      {activeTab === "opportunities" && <OpportunitiesTab scores={scores} status={status} />}
      {activeTab === "risks" && <RisksTab scores={scores} status={status} />}
      {activeTab === "downloads" && <DownloadsTab scores={scores} status={status} assessmentId={assessmentId} />}
    </div>
  );
}

// ─── Review Tab ───────────────────────────────────────────────────
function ReviewTab({
  responses,
  expandedSections,
  onToggle,
}: {
  responses: Record<string, { selectedOption: number; notes: string }>;
  expandedSections: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h2 className="text-lg font-bold text-gray-900">Review all answers before submission</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Read-only preview of every question and answer, grouped by section.
      </p>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => AI360_DOMAINS.forEach((d) => onToggle(d.key))}
          className="px-4 py-2 text-sm font-medium border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50"
        >
          Expand all sections
        </button>
        <button
          onClick={() => AI360_DOMAINS.forEach((d) => { if (expandedSections.has(d.key)) onToggle(d.key); })}
          className="px-4 py-2 text-sm font-medium border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50"
        >
          Collapse all sections
        </button>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 mb-6">
        After submission, this review view remains available in read-only form while TechFides analyzes the assessment.
      </div>

      <div className="space-y-3">
        {AI360_DOMAINS.map((domain) => {
          const questions = AI360_QUESTIONS.filter((q) => q.domain === domain.key);
          const answered = questions.filter((q) => responses[q.id]?.selectedOption > 0).length;
          const isExpanded = expandedSections.has(domain.key);

          return (
            <div key={domain.key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => onToggle(domain.key)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{domain.label}</span>
                  <span className="text-xs text-gray-400">{answered}/{questions.length} answered</span>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {questions.map((q) => {
                    const resp = responses[q.id];
                    const selectedLabel = resp?.selectedOption
                      ? q.options.find((o) => o.value === resp.selectedOption)?.label
                      : null;
                    return (
                      <div key={q.id} className="px-5 py-3 flex items-start gap-3">
                        <span className="text-xs font-mono text-gray-400 mt-0.5 w-10">{q.id}</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{q.text}</p>
                          {selectedLabel ? (
                            <p className="text-sm text-blue-600 font-medium mt-1">{resp.selectedOption}/5 — {selectedLabel}</p>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1">Not answered</p>
                          )}
                          {resp?.notes && <p className="text-xs text-gray-500 mt-1 italic">{resp.notes}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Executive Overview Tab ───────────────────────────────────────
function OverviewTab({ scores, status }: { scores: OverallScore | null; status: string }) {
  if (status !== "PUBLISHED" && !scores) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">Results are not yet available. The executive overview will appear once the assessment is Published.</p>
      </div>
    );
  }

  if (!scores) return null;

  return (
    <div className="space-y-6">
      {/* 60-Second Snapshot */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">60-Second Snapshot</h3>
        <p className="text-sm text-gray-500 mb-6">Quick view: AI readiness strengths, governance gaps, and priority areas.</p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 flex justify-center">
            <ScoreCircle score={scores.score} size={180} label={MATURITY_LABELS[scores.maturity]} />
          </div>
          <div className="col-span-8">
            <HeatMap cells={scores.heatMap} />
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{scores.score}%</p>
            <p className="text-xs text-gray-500">Overall Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{scores.completionRate}%</p>
            <p className="text-xs text-gray-500">Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{scores.riskProfile.filter((r) => r.severity === "critical" || r.severity === "high").length}</p>
            <p className="text-xs text-gray-500">High/Critical Risks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-500">{scores.opportunities.length}</p>
            <p className="text-xs text-gray-500">Opportunities</p>
          </div>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Narrative Summary</h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>
            Based on the assessment of {scores.domains.reduce((s, d) => s + d.answeredCount, 0)} responses across 6 domains,
            the organization demonstrates <strong>{MATURITY_LABELS[scores.maturity].toLowerCase()}</strong> AI readiness
            with an overall score of <strong>{scores.score}%</strong>.
          </p>
          {scores.domains.filter((d) => d.color === "green").length > 0 && (
            <p>
              <strong>Strengths:</strong> {scores.domains.filter((d) => d.color === "green").map((d) => d.label).join(", ")} show
              strong maturity and are ready for advanced AI initiatives.
            </p>
          )}
          {scores.domains.filter((d) => d.color === "red").length > 0 && (
            <p>
              <strong>Critical gaps:</strong> {scores.domains.filter((d) => d.color === "red").map((d) => d.label).join(", ")} require
              immediate attention before AI deployment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Opportunities Tab ────────────────────────────────────────────
function OpportunitiesTab({ scores, status }: { scores: OverallScore | null; status: string }) {
  if (!scores || status !== "PUBLISHED") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">Opportunities are grouped into fixed categories that balance value, effort, and risk. Clients always see a read-only view based on TechFides-approved results.</p>
      </div>
    );
  }

  const categories = [
    { key: "quick_win", label: "Quick Wins", color: "emerald", icon: "zap" },
    { key: "strategic", label: "Strategic Investments", color: "blue", icon: "target" },
    { key: "foundational", label: "Foundation Building", color: "amber", icon: "layers" },
    { key: "scale", label: "Scale & Replicate", color: "violet", icon: "expand" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Opportunities are grouped into fixed categories that balance value, effort, and risk.
      </p>
      {categories.map((cat) => {
        const items = scores.opportunities.filter((o) => o.category === cat.key);
        if (items.length === 0) return null;
        return (
          <div key={cat.key}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: cat.color === "emerald" ? "#047857" : cat.color === "blue" ? "#1d4ed8" : cat.color === "amber" ? "#b45309" : "#6d28d9" }}>{cat.label}</h3>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${item.effort === "low" ? "bg-emerald-50 text-emerald-700" : item.effort === "medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                        Effort: {item.effort}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.impact === "high" ? "bg-emerald-50 text-emerald-700" : item.impact === "medium" ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-700"}`}>
                        Impact: {item.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Risks Tab ────────────────────────────────────────────────────
function RisksTab({ scores, status }: { scores: OverallScore | null; status: string }) {
  if (!scores || status !== "PUBLISHED") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">Risks use fixed severity levels and mitigation notes to make governance decisions transparent. Clients always see the final, approved view only.</p>
      </div>
    );
  }

  const severityColors = {
    critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-800" },
    high: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-800" },
    medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-800" },
    low: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", badge: "bg-gray-100 text-gray-700" },
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Risks use fixed severity levels and mitigation notes to make governance decisions transparent.
      </p>
      <div className="space-y-3">
        {scores.riskProfile.map((risk, i) => {
          const colors = severityColors[risk.severity];
          return (
            <div key={i} className={`rounded-xl border ${colors.border} ${colors.bg} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${colors.badge}`}>{risk.severity}</span>
                    <span className="text-xs text-gray-400">{AI360_DOMAINS.find((d) => d.key === risk.domain)?.label}</span>
                  </div>
                  <p className={`text-sm font-semibold ${colors.text}`}>{risk.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                </div>
              </div>
            </div>
          );
        })}
        {scores.riskProfile.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <p className="text-sm text-emerald-700 font-medium">No significant risks identified. The organization shows strong readiness across all domains.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Benchmark Tab ────────────────────────────────────────────
function BenchmarkTab({ scores, status, assessmentId }: { scores: OverallScore | null; status: string; assessmentId: string }) {
  const [benchmark, setBenchmark] = useState<BenchmarkComparison | null>(null);
  const [industry, setIndustry] = useState<string>("");

  useEffect(() => {
    // Get the assessment's industry
    fetch(`/api/v1/ai360/${assessmentId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setIndustry(d.orgIndustry); });
  }, [assessmentId]);

  useEffect(() => {
    if (scores && industry) {
      const comparison = compareToBenchmark(
        industry,
        scores.score,
        scores.domains.map((d) => ({ domain: d.domain, label: d.label, percentage: d.percentage }))
      );
      setBenchmark(comparison);
    }
  }, [scores, industry]);

  if (!scores || !benchmark) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">Industry benchmarks will appear once scores are computed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-heading font-bold text-brand-dark mb-1">Industry Comparison</h3>
        <p className="text-sm text-gray-500 mb-6">
          How you compare to {benchmark.sampleSize} assessed organizations in {benchmark.industryLabel}.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Your Score</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">{benchmark.overall.clientScore}%</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Industry Average</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">{benchmark.overall.industryAvg}%</p>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: benchmark.overall.delta > 0 ? "#D1FAE5" : benchmark.overall.delta < -5 ? "#FEE2E2" : "#FEF3C7" }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Percentile</p>
            <p className="text-3xl font-bold mt-1" style={{ color: benchmark.overall.delta > 0 ? "#047857" : benchmark.overall.delta < -5 ? "#B91C1C" : "#92400E" }}>
              {benchmark.overall.percentile}th
            </p>
          </div>
        </div>
      </div>

      {/* Domain comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-brand-dark mb-4">Domain-Level Comparison</h3>
        <div className="space-y-4">
          {benchmark.domains.map((d) => (
            <div key={d.domain} className="grid grid-cols-12 items-center gap-3">
              <span className="col-span-3 text-sm text-gray-700">{d.label}</span>
              <div className="col-span-5">
                <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                  {/* Industry average marker */}
                  <div className="absolute top-0 h-6 w-0.5 bg-gray-400 z-10" style={{ left: `${d.industryAvg}%` }} />
                  {/* Client score bar */}
                  <div className="h-6 rounded-full transition-all" style={{
                    width: `${d.clientScore}%`,
                    backgroundColor: d.delta > 10 ? "#10B981" : d.delta > 0 ? "#00AEEF" : d.delta > -10 ? "#F59E0B" : "#EF4444"
                  }} />
                </div>
              </div>
              <span className="col-span-1 text-sm font-bold text-right">{d.clientScore}%</span>
              <span className="col-span-1 text-xs text-gray-400 text-center">vs {d.industryAvg}%</span>
              <span className="col-span-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  d.delta > 10 ? "bg-emerald-50 text-emerald-700" : d.delta > 0 ? "bg-blue-50 text-blue-700" : d.delta > -10 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                }`}>
                  {d.delta > 0 ? "+" : ""}{d.delta}%
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <span>Gray line = industry average</span>
          <span>Bar = your score</span>
        </div>
      </div>

      {/* Competitive advantages & gaps */}
      {benchmark.competitiveAdvantages.length > 0 && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
          <h3 className="text-sm font-semibold text-emerald-800 mb-2">Competitive Advantages</h3>
          <ul className="space-y-1">
            {benchmark.competitiveAdvantages.map((a, i) => (
              <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                <span className="mt-0.5">+</span>{a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {benchmark.criticalGaps.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-5">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Critical Gaps vs. Industry</h3>
          <ul className="space-y-1">
            {benchmark.criticalGaps.map((g, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                <span className="mt-0.5">-</span>{g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Industry insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-brand-dark mb-3">Industry Insights ({benchmark.industryLabel})</h3>
        <ul className="space-y-2">
          {benchmark.insights.map((insight, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-brand-primary mt-0.5">&#8226;</span>{insight}
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-400 mt-3">Based on {benchmark.sampleSize} assessed organizations in {benchmark.industryLabel}.</p>
      </div>
    </div>
  );
}

// ─── Downloads Tab ────────────────────────────────────────────────
function DownloadsTab({ scores, status, assessmentId }: { scores: OverallScore | null; status: string; assessmentId: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Downloads are static snapshots of Published results, suitable for executive briefings and audit archives.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <DownloadCard
          title="Executive Summary Report"
          description="Complete AI readiness assessment with scores, heat maps, and recommendations."
          format="PDF"
          disabled={status !== "PUBLISHED"}
          onClick={() => window.open(`/api/v1/ai360/${assessmentId}/score/pdf`, "_blank")}
        />
        <DownloadCard
          title="Raw Scores Export (CSV)"
          description="All responses and scores in spreadsheet format for further analysis."
          format="CSV"
          disabled={status !== "PUBLISHED"}
          onClick={() => window.open(`/api/v1/ai360/${assessmentId}/export?format=csv`, "_blank")}
        />
        <DownloadCard
          title="Full Data Export (JSON)"
          description="Complete assessment data including domains, risks, and opportunities."
          format="JSON"
          disabled={status !== "PUBLISHED"}
          onClick={() => window.open(`/api/v1/ai360/${assessmentId}/export?format=json`, "_blank")}
        />
        <DownloadCard
          title="Risk & Exposure Report"
          description="Governance deficiencies, data integrity risks, and compliance vulnerabilities."
          format="PDF"
          disabled={status !== "PUBLISHED"}
          onClick={() => window.open(`/api/v1/ai360/${assessmentId}/score/pdf`, "_blank")}
        />
      </div>
    </div>
  );
}

function DownloadCard({ title, description, format, disabled, onClick }: {
  title: string; description: string; format: string; disabled: boolean; onClick: () => void;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${disabled ? "opacity-50" : "hover:border-blue-300 cursor-pointer"} transition-colors`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{format}</span>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400"
      >
        {disabled ? "Available after publishing" : "Download"}
      </button>
    </div>
  );
}
