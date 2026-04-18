"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";
import { AI360_DOMAINS } from "@/lib/ai360/questions";
import type { OverallAggregation, DomainAggregation, QuestionAggregation } from "@/lib/ai360/aggregation";

export default function VarianceAnalysisPage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { orgName } = useAssessment();
  const [data, setData] = useState<OverallAggregation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"overview" | "domains" | "respondents" | "blindspots">("overview");

  useEffect(() => {
    fetch(`/api/v1/ai360/${assessmentId}/aggregate`)
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .finally(() => setLoading(false));
  }, [assessmentId]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!data || data.respondentCount < 2) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-heading font-bold text-brand-dark mb-2">Multi-Respondent Analysis</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Variance analysis requires at least 2 respondents. Invite team members from the Admin tab and have them answer questions using the respondent picker.
        </p>
      </div>
    );
  }

  const views = [
    { key: "overview" as const, label: "Alignment Overview" },
    { key: "domains" as const, label: "Domain Variance" },
    { key: "respondents" as const, label: "Respondent Comparison" },
    { key: "blindspots" as const, label: `Blind Spots (${data.blindSpots.length})` },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-brand-dark">Variance Analysis</h2>
          <p className="text-sm text-gray-500">{data.respondentCount} respondents across {orgName} — comparing declared reality vs. operational truth</p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 mb-6">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeView === v.key ? "bg-brand-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {activeView === "overview" && <OverviewView data={data} />}
      {activeView === "domains" && <DomainsView data={data} />}
      {activeView === "respondents" && <RespondentsView data={data} />}
      {activeView === "blindspots" && <BlindSpotsView data={data} />}
    </div>
  );
}

// ─── Alignment Overview ───────────────────────────────────────────
function OverviewView({ data }: { data: OverallAggregation }) {
  return (
    <div className="space-y-6">
      {/* Alignment Score */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Global Alignment</p>
          <p className={`text-4xl font-bold ${data.globalAlignment >= 70 ? "text-emerald-600" : data.globalAlignment >= 50 ? "text-amber-600" : "text-red-600"}`}>
            {data.globalAlignment}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {data.globalAlignment >= 70 ? "Strong consensus across respondents" : data.globalAlignment >= 50 ? "Moderate alignment — notable gaps exist" : "Significant divergence detected"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Respondents</p>
          <p className="text-4xl font-bold text-brand-dark">{data.respondentCount}</p>
          <p className="text-xs text-gray-400 mt-1">Across leadership and operations</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Blind Spots</p>
          <p className={`text-4xl font-bold ${data.blindSpots.length > 0 ? "text-red-600" : "text-emerald-600"}`}>{data.blindSpots.length}</p>
          <p className="text-xs text-gray-400 mt-1">Where leadership overestimates readiness</p>
        </div>
      </div>

      {/* Declared vs Observed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-brand-dark mb-1">Declared vs. Operational Reality</h3>
        <p className="text-xs text-gray-500 mb-4">Compares leadership perception (Client Admins) against operational truth (Contributors)</p>
        <div className="space-y-4">
          {data.declaredVsObserved.map((d) => {
            const domainDef = AI360_DOMAINS.find((dd) => dd.key === d.domain);
            const gap = d.gap;
            const gapColor = Math.abs(gap) > 15 ? "text-red-600 bg-red-50" : Math.abs(gap) > 8 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";
            return (
              <div key={d.domain} className="grid grid-cols-12 items-center gap-4">
                <span className="col-span-3 text-sm text-gray-700">{domainDef?.label}</span>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-20">Leadership</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${d.leadershipAvg}%` }} />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{d.leadershipAvg}%</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-20">Operations</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${d.operationalAvg >= 60 ? "bg-emerald-400" : d.operationalAvg >= 40 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${d.operationalAvg}%` }} />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{d.operationalAvg}%</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${gapColor}`}>
                    {gap > 0 ? "+" : ""}{gap}% gap
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain alignment bars */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-brand-dark mb-4">Domain Alignment Scores</h3>
        <div className="space-y-3">
          {data.domains.map((d) => (
            <div key={d.domain} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-44">{d.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full transition-all ${d.alignmentScore >= 70 ? "bg-emerald-400" : d.alignmentScore >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${d.alignmentScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold w-10 text-right">{d.alignmentScore}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Domain Variance ──────────────────────────────────────────────
function DomainsView({ data }: { data: OverallAggregation }) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {data.domains.map((d) => (
        <div key={d.domain} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setExpandedDomain(expandedDomain === d.domain ? null : d.domain)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-900">{d.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.alignmentScore >= 70 ? "bg-emerald-50 text-emerald-700" : d.alignmentScore >= 50 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                {d.alignmentScore}% aligned
              </span>
              {d.topDiscrepancies.length > 0 && (
                <span className="text-xs text-red-500">{d.topDiscrepancies.length} discrepancies</span>
              )}
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedDomain === d.domain ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedDomain === d.domain && (
            <div className="border-t border-gray-100 px-5 py-4">
              {/* Top discrepancies */}
              {d.topDiscrepancies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Top Discrepancies</h4>
                  {d.topDiscrepancies.map((disc) => (
                    <div key={disc.questionId} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                      <p className="text-xs text-gray-500 font-mono">{disc.questionId}</p>
                      <p className="text-sm text-gray-800">{disc.questionText}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-emerald-600">High: {disc.highResponder}</span>
                        <span className="text-red-600">Low: {disc.lowResponder}</span>
                        <span className="font-bold text-red-700">Spread: {disc.spread}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Question-level detail */}
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">All Questions</h4>
              <div className="space-y-2">
                {d.questions.filter((q) => q.respondentCount > 0).map((q) => (
                  <QuestionVarianceRow key={q.questionId} question={q} />
                ))}
              </div>

              {/* Per-respondent breakdown */}
              {d.respondentBreakdown.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Respondent Averages</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {d.respondentBreakdown.filter((r) => r.domainAverage > 0).map((r) => (
                      <div key={r.responderId} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{r.responderName}</p>
                          <p className="text-xs text-gray-400">{r.responderRole.replace("_", " ")}</p>
                        </div>
                        <span className="text-sm font-bold text-brand-dark">{r.domainAverage.toFixed(1)}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QuestionVarianceRow({ question }: { question: QuestionAggregation }) {
  const consensusColors = {
    strong: "bg-emerald-50 text-emerald-700",
    moderate: "bg-blue-50 text-blue-700",
    weak: "bg-amber-50 text-amber-700",
    divergent: "bg-red-50 text-red-700",
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
      <span className="text-xs font-mono text-gray-400 w-10">{question.questionId}</span>
      <span className="text-sm text-gray-700 flex-1 truncate">{question.questionText}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Response dots */}
        <div className="flex gap-0.5">
          {question.responses.map((r, i) => (
            <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ backgroundColor: r.selectedOption >= 4 ? "#D1FAE5" : r.selectedOption <= 2 ? "#FEE2E2" : "#FEF3C7", color: r.selectedOption >= 4 ? "#047857" : r.selectedOption <= 2 ? "#B91C1C" : "#92400E" }}>
              {r.selectedOption}
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-500 w-10 text-center">{question.average.toFixed(1)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${consensusColors[question.consensus]}`}>
          {question.consensus}
        </span>
      </div>
    </div>
  );
}

// ─── Respondent Comparison ────────────────────────────────────────
function RespondentsView({ data }: { data: OverallAggregation }) {
  return (
    <div className="space-y-6">
      {/* Respondent Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {data.respondents.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-primary">
                {r.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-400">{r.role.replace("_", " ")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-brand-dark">{r.overallAverage.toFixed(1)}</p>
                <p className="text-xs text-gray-400">Avg Score</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-brand-dark">{r.questionsAnswered}</p>
                <p className="text-xs text-gray-400">Answered</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-respondent domain comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-brand-dark mb-4">Domain Score Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Domain</th>
                {data.respondents.map((r) => (
                  <th key={r.id} className="px-3 py-2 text-center text-xs font-semibold text-gray-500">{r.name}</th>
                ))}
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Spread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.domains.map((d) => {
                const scores = d.respondentBreakdown.filter((r) => r.domainAverage > 0);
                const vals = scores.map((s) => s.domainAverage);
                const spread = vals.length > 1 ? (Math.max(...vals) - Math.min(...vals)).toFixed(1) : "—";
                return (
                  <tr key={d.domain}>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{d.label}</td>
                    {data.respondents.map((r) => {
                      const rb = d.respondentBreakdown.find((rb2) => rb2.responderId === r.id);
                      const val = rb?.domainAverage || 0;
                      return (
                        <td key={r.id} className="px-3 py-2.5 text-center">
                          {val > 0 ? (
                            <span className={`text-sm font-semibold ${val >= 4 ? "text-emerald-600" : val >= 3 ? "text-amber-600" : "text-red-600"}`}>
                              {val.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-xs font-bold ${typeof spread === "string" && spread !== "—" && parseFloat(spread) >= 1.5 ? "text-red-600" : "text-gray-500"}`}>
                        {spread}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Blind Spots ──────────────────────────────────────────────────
function BlindSpotsView({ data }: { data: OverallAggregation }) {
  if (data.blindSpots.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
        <p className="text-emerald-700 font-semibold">No blind spots detected</p>
        <p className="text-sm text-emerald-600 mt-1">Leadership and operational assessments are well-aligned.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700">
          <strong>Blind spots</strong> are areas where leadership significantly overestimates the organization&apos;s readiness compared to operational teams.
          A gap of 2+ points between leadership and operations flags overconfidence that could derail AI initiatives.
        </p>
      </div>

      {data.blindSpots.map((bs, i) => {
        const domainDef = AI360_DOMAINS.find((d) => d.key === bs.domain);
        return (
          <div key={i} className="bg-white rounded-xl border border-red-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400">{bs.questionId}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{domainDef?.shortLabel}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{bs.questionText}</p>
                <p className="text-sm text-red-600 mt-1">{bs.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
