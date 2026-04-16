"use client";

import { useState, useEffect, useCallback } from "react";

// ---- Types ----
interface LeadSummary {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  vertical: string;
  tier: string;
  heatScore: number;
  email: string;
}

interface Draft {
  id: string;
  leadId: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  strategyAngle: string;
  sequenceStep: number;
  pivotedFrom: string | null;
  status: string;
  batchDate: string;
  sentAt: string | null;
  createdAt: string;
  lead: LeadSummary;
}

interface DraftsResponse {
  drafts: Draft[];
  metrics: {
    totalToday: number;
    sentToday: number;
    pendingToday: number;
    dailyLimit: number;
  };
}

interface OutreachConfig {
  id: string;
  dailyDraftLimit: number;
  dailyTier2Split: number;
  dailyTier1Split: number;
  heatScoreThreshold: number;
  pivotAfterStep: number;
  scheduleHour: number;
  scheduleMinute: number;
  scheduleDays: string;
  enabled: boolean;
}

// ---- Strategy badge config ----
const STRATEGY_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  STRATEGIC_ALIGNMENT: { label: "Strategic", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  COST_RECOVERY: { label: "Cost Recovery", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  AEGIS_GOVERNANCE: { label: "AEGIS Pivot", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  SUBSCRIPTION_REDUCTION: { label: "Sub Reduction", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

const VERTICAL_ICONS: Record<string, string> = {
  LEGAL: "\u2696\uFE0F",
  MEDICAL: "\uD83C\uDFE5",
  AUTO: "\uD83D\uDE97",
  TRADES: "\uD83D\uDD27",
  OTHER: "\uD83D\uDCCB",
};

export default function OutreachPage() {
  const [tab, setTab] = useState<"drafts" | "history" | "settings">("drafts");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [metrics, setMetrics] = useState({ totalToday: 0, sentToday: 0, pendingToday: 0, dailyLimit: 50 });
  const [config, setConfig] = useState<OutreachConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [previewDraft, setPreviewDraft] = useState<Draft | null>(null);

  const fetchDrafts = useCallback(async (status?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      const res = await fetch(`/api/v1/outreach/drafts?${params}`);
      const data: DraftsResponse = await res.json();
      setDrafts(data.drafts);
      setMetrics(data.metrics);
    } catch (e) {
      console.error("Failed to fetch drafts:", e);
    }
    setLoading(false);
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/outreach/config");
      const data: OutreachConfig = await res.json();
      setConfig(data);
    } catch (e) {
      console.error("Failed to fetch config:", e);
    }
  }, []);

  useEffect(() => {
    fetchDrafts(tab === "history" ? "SENT" : "DRAFT");
    fetchConfig();
  }, [fetchDrafts, fetchConfig, tab]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/v1/outreach/generate-drafts", { method: "POST" });
      const result = await res.json();
      alert(`Generated ${result.generated} drafts (T2: ${result.tier2Generated}, T1: ${result.tier1Generated}). Pivots: ${result.pivoted}. Errors: ${result.errors?.length || 0}`);
      fetchDrafts("DRAFT");
    } catch {
      alert("Draft generation failed");
    }
    setGenerating(false);
  }

  async function handleSend(draftId: string) {
    setSendingId(draftId);
    try {
      const res = await fetch("/api/v1/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });
      if (res.ok) {
        fetchDrafts("DRAFT");
      } else {
        const err = await res.json();
        alert(`Send failed: ${err.error}`);
      }
    } catch {
      alert("Send failed");
    }
    setSendingId(null);
  }

  async function handleSaveConfig() {
    if (!config) return;
    try {
      await fetch("/api/v1/outreach/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      alert("Settings saved");
    } catch {
      alert("Failed to save");
    }
  }

  const tier2Count = drafts.filter((d) => ["STRATEGIC_ALIGNMENT", "AEGIS_GOVERNANCE"].includes(d.strategyAngle)).length;
  const tier1Count = drafts.filter((d) => ["COST_RECOVERY", "SUBSCRIPTION_REDUCTION"].includes(d.strategyAngle)).length;
  const pivotCount = drafts.filter((d) => d.pivotedFrom).length;
  const avgHeat = drafts.length > 0 ? Math.round(drafts.reduce((s, d) => s + d.lead.heatScore, 0) / drafts.length) : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Outreach Engine</h1>
          <p className="mt-1 text-sm text-slate-400">
            Branded email drafts with tiered strategy + auto-pivot
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-400 disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Drafts Now"}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Today's Drafts"
          value={`${metrics.totalToday}/${metrics.dailyLimit}`}
          detail={`T2: ${tier2Count} | T1: ${tier1Count}`}
        />
        <MetricCard label="Sent Today" value={String(metrics.sentToday)} />
        <MetricCard label="Pivots Active" value={String(pivotCount)} detail="Auto-pivoted sequences" />
        <MetricCard label="Avg Heat Score" value={String(avgHeat)} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
        {(["drafts", "history", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              tab === t
                ? "bg-sky-500/20 text-sky-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t === "drafts" ? "Pending Drafts" : t === "history" ? "Sent History" : "Settings"}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" />
        </div>
      ) : tab === "drafts" ? (
        <div className="space-y-3">
          {drafts.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
              <p className="text-lg font-semibold text-slate-300">No pending drafts</p>
              <p className="mt-2 text-sm text-slate-400">
                Click &quot;Generate Drafts Now&quot; to create branded outreach emails for today.
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onSend={() => handleSend(draft.id)}
                onPreview={() => setPreviewDraft(draft)}
                sending={sendingId === draft.id}
              />
            ))
          )}
        </div>
      ) : tab === "history" ? (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="p-3 text-left font-medium text-slate-400">Lead</th>
                <th className="p-3 text-left font-medium text-slate-400">Subject</th>
                <th className="p-3 text-left font-medium text-slate-400">Strategy</th>
                <th className="p-3 text-left font-medium text-slate-400">Step</th>
                <th className="p-3 text-left font-medium text-slate-400">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {drafts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No sent emails yet
                  </td>
                </tr>
              ) : (
                drafts.map((d) => {
                  const badge = STRATEGY_BADGES[d.strategyAngle];
                  return (
                    <tr key={d.id} className="hover:bg-slate-900/30">
                      <td className="p-3">
                        <p className="font-medium text-slate-200">{d.lead.firstName} {d.lead.lastName}</p>
                        <p className="text-xs text-slate-400">{d.lead.company}</p>
                      </td>
                      <td className="p-3 text-slate-300">{d.subject}</td>
                      <td className="p-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ color: badge?.color, backgroundColor: badge?.bg }}
                        >
                          {badge?.label}{d.pivotedFrom ? " (Pivot)" : ""}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{d.sequenceStep}/5</td>
                      <td className="p-3 text-slate-400">
                        {d.sentAt ? new Date(d.sentAt).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <SettingsPanel config={config} onChange={setConfig} onSave={handleSaveConfig} />
      )}

      {/* Preview Modal */}
      {previewDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h3 className="font-semibold text-slate-100">{previewDraft.subject}</h3>
                <p className="text-xs text-slate-400">
                  To: {previewDraft.lead.firstName} {previewDraft.lead.lastName} &lt;{previewDraft.lead.email}&gt;
                </p>
              </div>
              <button
                onClick={() => setPreviewDraft(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                &#x2715;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto p-2">
              <iframe
                srcDoc={previewDraft.bodyHtml}
                title="Email Preview"
                className="h-[600px] w-full rounded-lg border-0"
                sandbox=""
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
              <button
                onClick={() => setPreviewDraft(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSend(previewDraft.id);
                  setPreviewDraft(null);
                }}
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Sub-components ----

function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
      {detail && <p className="mt-0.5 text-xs text-slate-500">{detail}</p>}
    </div>
  );
}

function DraftCard({
  draft,
  onSend,
  onPreview,
  sending,
}: {
  draft: Draft;
  onSend: () => void;
  onPreview: () => void;
  sending: boolean;
}) {
  const badge = STRATEGY_BADGES[draft.strategyAngle];
  const vIcon = VERTICAL_ICONS[draft.lead.vertical] || "";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base">{vIcon}</span>
            <span className="text-sm font-semibold text-slate-200">
              {draft.lead.firstName} {draft.lead.lastName}
            </span>
            <span className="text-xs text-slate-400">{draft.lead.company}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ color: badge?.color, backgroundColor: badge?.bg }}
            >
              {badge?.label}
              {draft.pivotedFrom ? " (Pivot)" : ""}
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
              Step {draft.sequenceStep}/5
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
              Heat: {draft.lead.heatScore}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-100">{draft.subject}</p>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2">
            {draft.bodyText.slice(0, 200)}...
          </p>
        </div>
        <div className="ml-4 flex shrink-0 gap-2">
          <button
            onClick={onPreview}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-sky-500/50 hover:text-white"
          >
            Preview
          </button>
          <button
            onClick={onSend}
            disabled={sending}
            className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({
  config,
  onChange,
  onSave,
}: {
  config: OutreachConfig | null;
  onChange: (c: OutreachConfig) => void;
  onSave: () => void;
}) {
  if (!config) return <p className="text-slate-400">Loading settings...</p>;

  const update = (field: keyof OutreachConfig, value: unknown) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
      <h3 className="text-lg font-semibold text-slate-100">Outreach Configuration</h3>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="threshold" className="block text-sm font-medium text-slate-300">
            Heat Score Threshold
          </label>
          <input
            id="threshold"
            type="range"
            min={10}
            max={80}
            value={config.heatScoreThreshold}
            onChange={(e) => update("heatScoreThreshold", Number(e.target.value))}
            className="mt-2 w-full accent-sky-500"
          />
          <p className="mt-1 text-sm text-sky-400 font-semibold">{config.heatScoreThreshold} points</p>
        </div>

        <div>
          <label htmlFor="pivotStep" className="block text-sm font-medium text-slate-300">
            Auto-Pivot After Step
          </label>
          <select
            id="pivotStep"
            value={config.pivotAfterStep}
            onChange={(e) => update("pivotAfterStep", Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          >
            <option value={2}>Step 2</option>
            <option value={3}>Step 3 (Recommended)</option>
            <option value={4}>Step 4</option>
          </select>
        </div>

        <div>
          <label htmlFor="t2split" className="block text-sm font-medium text-slate-300">
            Daily Tier 2 (Strategic) Limit
          </label>
          <input
            id="t2split"
            type="number"
            min={0}
            max={50}
            value={config.dailyTier2Split}
            onChange={(e) => update("dailyTier2Split", Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </div>

        <div>
          <label htmlFor="t1split" className="block text-sm font-medium text-slate-300">
            Daily Tier 1 (Cost Recovery) Limit
          </label>
          <input
            id="t1split"
            type="number"
            min={0}
            max={50}
            value={config.dailyTier1Split}
            onChange={(e) => update("dailyTier1Split", Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </div>

        <div>
          <label htmlFor="schedHour" className="block text-sm font-medium text-slate-300">
            Schedule Time
          </label>
          <input
            id="schedHour"
            type="time"
            value={`${String(config.scheduleHour).padStart(2, "0")}:${String(config.scheduleMinute).padStart(2, "0")}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(Number);
              update("scheduleHour", h);
              onChange({ ...config, scheduleHour: h, scheduleMinute: m });
            }}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="enabled" className="text-sm font-medium text-slate-300">
            Auto-Generation Enabled
          </label>
          <input
            id="enabled"
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => update("enabled", e.target.checked)}
            className="h-5 w-5 accent-sky-500"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onSave}
          className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
