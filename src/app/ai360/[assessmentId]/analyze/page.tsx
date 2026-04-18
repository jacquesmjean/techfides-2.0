"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";
import { OverallScore, MATURITY_LABELS } from "@/lib/ai360/scoring";
import { AI360_DOMAINS } from "@/lib/ai360/questions";
import { ScoreCircle, HeatMap } from "@/components/ai360/HeatMap";

interface RiskEntry {
  severity: "critical" | "high" | "medium" | "low";
  domain: string;
  title: string;
  description: string;
  mitigation: string;
}

interface OpportunityEntry {
  category: "quick_win" | "strategic" | "foundational" | "scale";
  domain: string;
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
}

export default function AnalyzePage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { status, orgName } = useAssessment();
  const [scores, setScores] = useState<OverallScore | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [narrativeSummary, setNarrativeSummary] = useState("");
  const [risks, setRisks] = useState<RiskEntry[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "risks" | "opportunities" | "preview">("summary");
  const [loading, setLoading] = useState(true);

  const canEdit = status === "ANALYZING" || status === "SUBMITTED";

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/ai360/${assessmentId}/score`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/v1/ai360/${assessmentId}`).then((r) => r.ok ? r.json() : null),
    ]).then(([scoreData, assessmentData]) => {
      if (scoreData) setScores(scoreData);
      if (assessmentData) {
        setExecutiveSummary(assessmentData.executiveSummary || "");
        setNarrativeSummary(assessmentData.narrativeSummary || "");
        if (assessmentData.keyRisks) {
          setRisks(assessmentData.keyRisks);
        } else if (scoreData?.riskProfile) {
          setRisks(scoreData.riskProfile.map((r: { severity: string; domain: string; title: string; description: string }) => ({
            ...r, mitigation: "",
          })));
        }
        if (assessmentData.opportunityMap?.items) {
          setOpportunities(assessmentData.opportunityMap.items);
        } else if (scoreData?.opportunities) {
          setOpportunities(scoreData.opportunities);
        }
      }
    }).finally(() => setLoading(false));
  }, [assessmentId]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/v1/ai360/${assessmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executiveSummary,
          narrativeSummary,
          keyRisks: risks,
          opportunityMap: { items: opportunities },
        }),
      });
      setLastSaved(new Date());
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const tabs = [
    { key: "summary" as const, label: "Executive Narrative" },
    { key: "risks" as const, label: `Risks (${risks.length})` },
    { key: "opportunities" as const, label: `Opportunities (${opportunities.length})` },
    { key: "preview" as const, label: "Preview Report" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-brand-dark">Analyst Workbench</h2>
          <p className="text-sm text-gray-500">Craft the executive narrative, refine risks, and shape the opportunity roadmap for {orgName}.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {saving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ""}
          </span>
          <button
            onClick={handleSave}
            disabled={!canEdit || saving}
            className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            Save Changes
          </button>
          <a
            href={`/api/v1/ai360/${assessmentId}/score/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-brand-primary text-brand-primary text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Download PDF
          </a>
        </div>
      </div>

      {/* Score Summary Bar */}
      {scores && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center text-sm font-bold"
              style={{ borderColor: scores.score >= 60 ? "#10B981" : scores.score >= 40 ? "#F59E0B" : "#EF4444", color: scores.score >= 60 ? "#10B981" : scores.score >= 40 ? "#F59E0B" : "#EF4444" }}>
              {scores.score}
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-dark">{MATURITY_LABELS[scores.maturity]}</p>
              <p className="text-xs text-gray-400">{scores.completionRate}% complete</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          {scores.domains.map((d) => (
            <div key={d.domain} className="text-center">
              <p className="text-xs text-gray-500">{AI360_DOMAINS.find((dd) => dd.key === d.domain)?.shortLabel}</p>
              <p className="text-sm font-bold" style={{ color: d.color === "green" ? "#10B981" : d.color === "yellow" ? "#F59E0B" : "#EF4444" }}>
                {d.percentage}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab Nav */}
      <div className="flex gap-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === t.key
                ? "bg-brand-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "summary" && (
        <SummaryEditor
          executiveSummary={executiveSummary}
          narrativeSummary={narrativeSummary}
          onExecChange={setExecutiveSummary}
          onNarrChange={setNarrativeSummary}
          readOnly={!canEdit}
          scores={scores}
          orgName={orgName}
        />
      )}
      {activeTab === "risks" && (
        <RiskEditor risks={risks} onChange={setRisks} readOnly={!canEdit} />
      )}
      {activeTab === "opportunities" && (
        <OpportunityEditor opportunities={opportunities} onChange={setOpportunities} readOnly={!canEdit} />
      )}
      {activeTab === "preview" && scores && (
        <ReportPreview scores={scores} executiveSummary={executiveSummary} narrativeSummary={narrativeSummary} risks={risks} opportunities={opportunities} orgName={orgName} />
      )}
    </div>
  );
}

// ─── Summary Editor ───────────────────────────────────────────────
function SummaryEditor({ executiveSummary, narrativeSummary, onExecChange, onNarrChange, readOnly, scores, orgName }: {
  executiveSummary: string; narrativeSummary: string; onExecChange: (v: string) => void; onNarrChange: (v: string) => void; readOnly: boolean; scores: OverallScore | null; orgName: string;
}) {
  function generateAutoSummary() {
    if (!scores) return;
    const strong = scores.domains.filter((d) => d.color === "green").map((d) => d.label);
    const weak = scores.domains.filter((d) => d.color === "red").map((d) => d.label);
    const riskCount = scores.riskProfile.filter((r) => r.severity === "critical" || r.severity === "high").length;

    let text = `${orgName} demonstrates ${MATURITY_LABELS[scores.maturity].toLowerCase()} AI readiness with an overall score of ${scores.score}% across six assessment domains.`;
    if (strong.length > 0) text += `\n\nKey strengths include ${strong.join(" and ")}, which show maturity levels ready for advanced AI deployment.`;
    if (weak.length > 0) text += `\n\nCritical attention is needed in ${weak.join(" and ")}, where significant gaps indicate foundational work is required.`;
    if (riskCount > 0) text += `\n\n${riskCount} high-priority risk(s) have been identified that should be addressed immediately.`;
    text += `\n\n${scores.opportunities.length} strategic opportunities have been mapped to accelerate the AI transformation journey.`;

    onExecChange(text);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-brand-dark">Executive Summary</h3>
          {!readOnly && (
            <button onClick={generateAutoSummary} className="text-xs text-brand-primary hover:text-brand-dark font-medium">
              Auto-generate from scores
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-3">The 60-second snapshot clients see first. Keep it concise, actionable, and clear.</p>
        <textarea
          value={executiveSummary}
          onChange={(e) => onExecChange(e.target.value)}
          disabled={readOnly}
          rows={8}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 leading-relaxed placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:bg-gray-50 resize-y"
          placeholder="Write the executive summary that will appear at the top of the client's report..."
        />
        <p className="text-xs text-gray-400 mt-2">{executiveSummary.length} characters</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-brand-dark mb-3">Detailed Narrative</h3>
        <p className="text-xs text-gray-400 mb-3">Deeper analysis for stakeholders who want to understand the full picture.</p>
        <textarea
          value={narrativeSummary}
          onChange={(e) => onNarrChange(e.target.value)}
          disabled={readOnly}
          rows={12}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 leading-relaxed placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:bg-gray-50 resize-y"
          placeholder="Provide a detailed narrative covering each domain, key findings, and strategic recommendations..."
        />
      </div>
    </div>
  );
}

// ─── Risk Editor ──────────────────────────────────────────────────
function RiskEditor({ risks, onChange, readOnly }: { risks: RiskEntry[]; onChange: (r: RiskEntry[]) => void; readOnly: boolean }) {
  function addRisk() {
    onChange([...risks, { severity: "medium", domain: "STRATEGY_LEADERSHIP", title: "", description: "", mitigation: "" }]);
  }

  function updateRisk(idx: number, field: string, value: string) {
    const updated = [...risks];
    (updated[idx] as unknown as Record<string, string>)[field] = value;
    onChange(updated);
  }

  function removeRisk(idx: number) {
    onChange(risks.filter((_, i) => i !== idx));
  }

  const severityColors: Record<string, string> = {
    critical: "bg-red-50 border-red-200",
    high: "bg-orange-50 border-orange-200",
    medium: "bg-amber-50 border-amber-200",
    low: "bg-gray-50 border-gray-200",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Define and prioritize risks identified during the assessment analysis.</p>
        {!readOnly && (
          <button onClick={addRisk} className="px-3 py-1.5 bg-brand-primary text-white text-sm rounded-lg hover:bg-brand-dark transition-colors">
            + Add Risk
          </button>
        )}
      </div>

      {risks.map((risk, i) => (
        <div key={i} className={`rounded-xl border p-5 ${severityColors[risk.severity] || "bg-gray-50 border-gray-200"}`}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Severity</label>
              <select value={risk.severity} onChange={(e) => updateRisk(i, "severity", e.target.value)} disabled={readOnly}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Domain</label>
              <select value={risk.domain} onChange={(e) => updateRisk(i, "domain", e.target.value)} disabled={readOnly}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                {AI360_DOMAINS.map((d) => (
                  <option key={d.key} value={d.key}>{d.shortLabel}</option>
                ))}
              </select>
            </div>
            <div className="col-span-6">
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input type="text" value={risk.title} onChange={(e) => updateRisk(i, "title", e.target.value)} disabled={readOnly}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="col-span-1 flex items-end justify-center">
              {!readOnly && (
                <button onClick={() => removeRisk(i)} className="text-red-400 hover:text-red-600 text-xs py-1.5">Remove</button>
              )}
            </div>
            <div className="col-span-6">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea value={risk.description} onChange={(e) => updateRisk(i, "description", e.target.value)} disabled={readOnly}
                rows={2} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm resize-y" />
            </div>
            <div className="col-span-6">
              <label className="block text-xs font-medium text-gray-500 mb-1">Mitigation</label>
              <textarea value={risk.mitigation} onChange={(e) => updateRisk(i, "mitigation", e.target.value)} disabled={readOnly}
                rows={2} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm resize-y" placeholder="Recommended mitigation steps..." />
            </div>
          </div>
        </div>
      ))}

      {risks.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          No risks defined. Click &quot;Add Risk&quot; or auto-generated risks will appear when scores are computed.
        </div>
      )}
    </div>
  );
}

// ─── Opportunity Editor ───────────────────────────────────────────
function OpportunityEditor({ opportunities, onChange, readOnly }: { opportunities: OpportunityEntry[]; onChange: (o: OpportunityEntry[]) => void; readOnly: boolean }) {
  function addOpp() {
    onChange([...opportunities, { category: "quick_win", domain: "STRATEGY_LEADERSHIP", title: "", description: "", effort: "medium", impact: "medium" }]);
  }

  function updateOpp(idx: number, field: string, value: string) {
    const updated = [...opportunities];
    (updated[idx] as unknown as Record<string, string>)[field] = value;
    onChange(updated);
  }

  function removeOpp(idx: number) {
    onChange(opportunities.filter((_, i) => i !== idx));
  }

  const catLabels: Record<string, string> = { quick_win: "Quick Win", strategic: "Strategic", foundational: "Foundational", scale: "Scale" };
  const catColors: Record<string, string> = { quick_win: "bg-emerald-50 border-emerald-200", strategic: "bg-blue-50 border-blue-200", foundational: "bg-amber-50 border-amber-200", scale: "bg-violet-50 border-violet-200" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Map opportunities by category, effort, and impact for the client roadmap.</p>
        {!readOnly && (
          <button onClick={addOpp} className="px-3 py-1.5 bg-brand-primary text-white text-sm rounded-lg hover:bg-brand-dark transition-colors">
            + Add Opportunity
          </button>
        )}
      </div>

      {opportunities.map((opp, i) => (
        <div key={i} className={`rounded-xl border p-5 ${catColors[opp.category] || "bg-gray-50 border-gray-200"}`}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select value={opp.category} onChange={(e) => updateOpp(i, "category", e.target.value)} disabled={readOnly}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                {Object.entries(catLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Domain</label>
              <select value={opp.domain} onChange={(e) => updateOpp(i, "domain", e.target.value)} disabled={readOnly}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                {AI360_DOMAINS.map((d) => (
                  <option key={d.key} value={d.key}>{d.shortLabel}</option>
                ))}
              </select>
            </div>
            <div className="col-span-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input type="text" value={opp.title} onChange={(e) => updateOpp(i, "title", e.target.value)} disabled={readOnly}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Effort</label>
              <select value={opp.effort} onChange={(e) => updateOpp(i, "effort", e.target.value)} disabled={readOnly}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                <option value="low">Low</option>
                <option value="medium">Med</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Impact</label>
              <select value={opp.impact} onChange={(e) => updateOpp(i, "impact", e.target.value)} disabled={readOnly}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                <option value="low">Low</option>
                <option value="medium">Med</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-span-2 flex items-end justify-center">
              {!readOnly && (
                <button onClick={() => removeOpp(i)} className="text-red-400 hover:text-red-600 text-xs py-1.5">Remove</button>
              )}
            </div>
            <div className="col-span-12">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea value={opp.description} onChange={(e) => updateOpp(i, "description", e.target.value)} disabled={readOnly}
                rows={2} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm resize-y" />
            </div>
          </div>
        </div>
      ))}

      {opportunities.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          No opportunities defined yet.
        </div>
      )}
    </div>
  );
}

// ─── Report Preview ───────────────────────────────────────────────
function ReportPreview({ scores, executiveSummary, narrativeSummary, risks, opportunities, orgName }: {
  scores: OverallScore; executiveSummary: string; narrativeSummary: string; risks: RiskEntry[]; opportunities: OpportunityEntry[]; orgName: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Report header */}
      <div className="bg-brand-dark p-8">
        <p className="text-brand-primary text-sm font-semibold tracking-wider">TECHFIDES AI 360 READINESS ASSESSMENT</p>
        <h2 className="text-2xl font-heading font-bold text-white mt-2">{orgName}</h2>
        <p className="text-gray-400 text-sm mt-1">Executive Report Preview</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Score + Heat Map */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 flex justify-center">
            <ScoreCircle score={scores.score} size={160} label={MATURITY_LABELS[scores.maturity]} />
          </div>
          <div className="col-span-8">
            <HeatMap cells={scores.heatMap} />
          </div>
        </div>

        {/* Executive Summary */}
        {executiveSummary && (
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-dark mb-3">Executive Summary</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{executiveSummary}</div>
          </div>
        )}

        {/* Narrative */}
        {narrativeSummary && (
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-dark mb-3">Detailed Analysis</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{narrativeSummary}</div>
          </div>
        )}

        {/* Risks */}
        {risks.length > 0 && (
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-dark mb-3">Key Risks</h3>
            <div className="space-y-2">
              {risks.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded text-white ${
                    r.severity === "critical" ? "bg-red-500" : r.severity === "high" ? "bg-orange-500" : r.severity === "medium" ? "bg-amber-500" : "bg-gray-400"
                  }`}>{r.severity}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                    {r.mitigation && <p className="text-xs text-brand-primary mt-1">Mitigation: {r.mitigation}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-dark mb-3">Opportunities</h3>
            <div className="space-y-2">
              {opportunities.map((o, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{o.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.description}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Effort: {o.effort}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Impact: {o.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-brand-dark p-4 text-center">
        <p className="text-xs text-gray-400">Confidential — Prepared by TechFides for {orgName}</p>
      </div>
    </div>
  );
}
