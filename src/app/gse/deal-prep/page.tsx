"use client";

import { useState } from "react";
import { useGSE } from "@/lib/gse/store";

interface ProspectProfile {
  company: { name: string; industry: string; revenue: string; employees: string; techStack: string[]; recentNews: string[]; tier: string };
  persona: { name: string; title: string; linkedinUrl: string | null; decisionStyle: string; likelyPriorities: string[]; communicationTips: string[] };
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  painMap: { primary: { pain: string; severity: string; evidence: string }; secondary: Array<{ pain: string; severity: string; evidence: string }> };
  objections: Array<{ objection: string; response: string; proof: string }>;
  strategy: { recommendedService: string; recommendedTier: string; openingHook: string; valueProposition: string; closingQuestion: string; urgencyAngle: string; competitorWeakness: string; pricingAnchor: string };
  icebreakers: string[];
  dealRisk: { level: string; factors: string[]; mitigation: string[] };
  generatedAt: string;
}

const STYLE_CFG: Record<string, { label: string; icon: string; color: string }> = {
  driver: { label: "Driver", icon: "\uD83C\uDFAF", color: "#ef4444" },
  analytical: { label: "Analytical", icon: "\uD83E\uDDE0", color: "#38bdf8" },
  amiable: { label: "Amiable", icon: "\uD83E\uDD1D", color: "#22c55e" },
  expressive: { label: "Expressive", icon: "\u2728", color: "#f59e0b" },
};

const SEV_COLORS: Record<string, string> = { critical: "text-red-400", high: "text-amber-400", medium: "text-sky-400" };

export default function DealPrepPage() {
  const { leads } = useGSE();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [profile, setProfile] = useState<ProspectProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const activeLeads = leads
    .filter((l) => ["prospect", "qualified", "proposal", "negotiation"].includes(l.stage))
    .sort((a, b) => b.heatScore - a.heatScore);

  async function handleGenerate() {
    if (!selectedLeadId) return;
    setLoading(true);
    setProfile(null);
    try {
      const res = await fetch(`/api/v1/intelligence/deal-prep/${selectedLeadId}`);
      const data = await res.json();
      setProfile(data);
    } catch {
      alert("Failed to generate profile. Check database connection.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Deal Prep Intelligence</h1>
        <p className="text-sm text-slate-400">AI-generated prospect profiles for pre-meeting briefings. Know everything before you walk in.</p>
      </div>

      {/* Lead Selector */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="lead-select" className="block text-xs font-medium text-slate-300 mb-1">Select a prospect to profile</label>
          <select id="lead-select" value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-sky-500 focus:outline-none">
            <option value="">Choose a lead...</option>
            {activeLeads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.contact.firstName} {l.contact.lastName} — {l.contact.company} (Heat: {l.heatScore}, ${l.dealValue.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleGenerate} disabled={!selectedLeadId || loading}
          className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-50">
          {loading ? "Generating..." : "Generate Briefing"}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" />
          <p className="mt-4 text-sm text-slate-400">Analyzing prospect and building your closing playbook...</p>
        </div>
      )}

      {profile && !loading && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-slate-900/50 to-transparent p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Pre-Meeting Briefing</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-100">{profile.persona.name}</h2>
                <p className="text-sm text-slate-400">{profile.persona.title} at {profile.company.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-300">{profile.company.industry}</span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-300">{profile.company.tier}</span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-300">Rev: {profile.company.revenue}</span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-300">{profile.company.employees} employees</span>
                  {(() => {
                    const sc = STYLE_CFG[profile.persona.decisionStyle];
                    return sc ? <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ color: sc.color, backgroundColor: `${sc.color}15` }}>{sc.icon} {sc.label} Personality</span> : null;
                  })()}
                </div>
              </div>
              <div className={`rounded-xl border px-4 py-3 text-center ${profile.dealRisk.level === "low" ? "border-green-500/30 bg-green-500/5" : profile.dealRisk.level === "medium" ? "border-amber-500/30 bg-amber-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                <p className="text-[9px] font-bold uppercase text-slate-400">Deal Risk</p>
                <p className={`text-lg font-extrabold ${profile.dealRisk.level === "low" ? "text-green-400" : profile.dealRisk.level === "medium" ? "text-amber-400" : "text-red-400"}`}>{profile.dealRisk.level.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Communication Tips */}
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="text-xs font-bold text-sky-400 mb-2">\uD83D\uDDE3\uFE0F How to Communicate with {profile.persona.name.split(" ")[0]}</p>
            <ul className="space-y-1">
              {profile.persona.communicationTips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-sky-400 shrink-0">\u2192</span>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Opening Hook */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
              <p className="text-xs font-bold text-green-400 mb-2">\uD83C\uDFAF Opening Hook</p>
              <p className="text-sm text-slate-200 italic">&ldquo;{profile.strategy.openingHook}&rdquo;</p>
            </div>

            {/* Closing Question */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="text-xs font-bold text-amber-400 mb-2">\uD83D\uDD11 Closing Question</p>
              <p className="text-sm text-slate-200 italic">&ldquo;{profile.strategy.closingQuestion}&rdquo;</p>
            </div>
          </div>

          {/* Icebreakers */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <p className="text-xs font-bold text-slate-300 mb-3">\u2744\uFE0F Conversation Starters</p>
            <div className="space-y-2">
              {profile.icebreakers.map((ice, i) => (
                <p key={i} className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3">&ldquo;{ice}&rdquo;</p>
              ))}
            </div>
          </div>

          {/* Pain Map */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-xs font-bold text-red-400 mb-3">\uD83D\uDCA2 Pain Map — Where They Need Help Most</p>
            <div className="rounded-lg border border-red-500/30 bg-slate-950/50 p-4 mb-3">
              <div className="flex items-center gap-2"><span className={`text-xs font-bold uppercase ${SEV_COLORS[profile.painMap.primary.severity] || "text-red-400"}`}>{profile.painMap.primary.severity}</span><span className="text-sm font-semibold text-slate-200">{profile.painMap.primary.pain}</span></div>
              <p className="mt-1 text-xs text-slate-400">Evidence: {profile.painMap.primary.evidence}</p>
            </div>
            {profile.painMap.secondary.map((p, i) => (
              <div key={i} className="rounded-lg border border-slate-700/50 bg-slate-950/30 p-3 mb-2">
                <div className="flex items-center gap-2"><span className={`text-[10px] font-bold uppercase ${SEV_COLORS[p.severity] || "text-slate-400"}`}>{p.severity}</span><span className="text-xs text-slate-300">{p.pain}</span></div>
                <p className="mt-0.5 text-[10px] text-slate-500">{p.evidence}</p>
              </div>
            ))}
          </div>

          {/* SWOT */}
          <div className="grid gap-3 md:grid-cols-4">
            {(["strengths", "weaknesses", "opportunities", "threats"] as const).map((key) => {
              const cfg = { strengths: { label: "Strengths", color: "green", icon: "\uD83D\uDCAA" }, weaknesses: { label: "Weaknesses", color: "red", icon: "\u26A0\uFE0F" }, opportunities: { label: "Opportunities", color: "sky", icon: "\uD83D\uDE80" }, threats: { label: "Threats", color: "amber", icon: "\uD83D\uDEE1\uFE0F" } }[key];
              return (
                <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                  <p className="text-xs font-bold text-slate-300 mb-2">{cfg.icon} {cfg.label}</p>
                  <ul className="space-y-1">{profile.swot[key].map((item, i) => <li key={i} className="text-[11px] text-slate-400">&bull; {item}</li>)}</ul>
                </div>
              );
            })}
          </div>

          {/* Objection Playbook */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <p className="text-xs font-bold text-slate-300 mb-4">\uD83D\uDEE1\uFE0F Objection Playbook</p>
            <div className="space-y-4">
              {profile.objections.map((obj, i) => (
                <div key={i} className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-4">
                  <p className="text-xs font-bold text-red-400">They say: &ldquo;{obj.objection}&rdquo;</p>
                  <p className="mt-2 text-xs text-green-400 font-medium">You say: &ldquo;{obj.response}&rdquo;</p>
                  <p className="mt-1 text-[10px] text-slate-500">Proof: {obj.proof}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy Card */}
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
            <p className="text-xs font-bold text-sky-400 mb-4">\uD83C\uDFC6 Closing Strategy</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div><p className="text-[10px] text-slate-500">Recommended Service</p><p className="text-sm font-semibold text-slate-200">{profile.strategy.recommendedService}</p></div>
              <div><p className="text-[10px] text-slate-500">Recommended Tier</p><p className="text-sm font-semibold text-slate-200">{profile.strategy.recommendedTier}</p></div>
              <div><p className="text-[10px] text-slate-500">Urgency Angle</p><p className="text-xs text-slate-300">{profile.strategy.urgencyAngle}</p></div>
              <div><p className="text-[10px] text-slate-500">Competitor Weakness</p><p className="text-xs text-slate-300">{profile.strategy.competitorWeakness}</p></div>
              <div className="md:col-span-2"><p className="text-[10px] text-slate-500">Value Proposition</p><p className="text-xs text-slate-200">{profile.strategy.valueProposition}</p></div>
              <div className="md:col-span-2"><p className="text-[10px] text-slate-500">Pricing Anchor</p><p className="text-xs text-slate-200">{profile.strategy.pricingAnchor}</p></div>
            </div>
          </div>

          {/* Risk Factors */}
          {profile.dealRisk.factors.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
              <p className="text-xs font-bold text-slate-300 mb-3">Risk Factors &amp; Mitigation</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-[10px] text-red-400 font-bold mb-1">Risks</p>
                  {profile.dealRisk.factors.map((f, i) => <p key={i} className="text-xs text-slate-400">&bull; {f}</p>)}
                </div>
                <div>
                  <p className="text-[10px] text-green-400 font-bold mb-1">Mitigation</p>
                  {profile.dealRisk.mitigation.map((m, i) => <p key={i} className="text-xs text-slate-400">&bull; {m}</p>)}
                </div>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-500 text-center">Generated {new Date(profile.generatedAt).toLocaleString()} &bull; Stored as dossier for sales team reference</p>
        </div>
      )}

      {!profile && !loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-16 text-center">
          <p className="text-3xl">\uD83E\uDDE0</p>
          <p className="mt-4 text-lg font-semibold text-slate-300">Select a prospect and generate their profile</p>
          <p className="mt-2 text-sm text-slate-400">The AI will analyze their business, persona, pain points, and build your complete closing playbook.</p>
        </div>
      )}
    </div>
  );
}
