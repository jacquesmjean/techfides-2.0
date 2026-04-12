"use client";

import Link from "next/link";
import { useGSE } from "@/lib/gse/store";

/**
 * Red Flag Alerts — Exception-based notification center.
 * CEO only sees alerts that require human decision.
 */

interface Alert {
  id: string;
  type: "whale" | "stall" | "blackout" | "alignment" | "cashflow";
  severity: "critical" | "high" | "medium";
  title: string;
  description: string;
  leadId?: string;
  timestamp: string;
  resolved: boolean;
}

const ALERT_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  whale: { icon: "\uD83D\uDC33", color: "text-sky-400", bg: "border-sky-500/20 bg-sky-500/5", label: "Whale Alert" },
  stall: { icon: "\u26A0\uFE0F", color: "text-amber-400", bg: "border-amber-500/20 bg-amber-500/5", label: "Stall Alert" },
  blackout: { icon: "\uD83D\uDD34", color: "text-red-400", bg: "border-red-500/20 bg-red-500/5", label: "Blackout" },
  alignment: { icon: "\uD83D\uDCA1", color: "text-purple-400", bg: "border-purple-500/20 bg-purple-500/5", label: "Alignment Gap" },
  cashflow: { icon: "\uD83D\uDCB0", color: "text-green-400", bg: "border-green-500/20 bg-green-500/5", label: "Cash Flow" },
};

const SEVERITY_BADGE: Record<string, { color: string; bg: string }> = {
  critical: { color: "text-red-400", bg: "bg-red-500/10" },
  high: { color: "text-amber-400", bg: "bg-amber-500/10" },
  medium: { color: "text-sky-400", bg: "bg-sky-500/10" },
};

export default function AlertsPage() {
  const { leads } = useGSE();

  // Generate alerts from real data
  const alerts: Alert[] = [];

  // Stall alerts: heatScore >80 with staleDays >0
  leads
    .filter((l) => l.heatScore >= 80 && l.staleDays > 0 && l.stage !== "closed-won" && l.stage !== "closed-lost")
    .forEach((l) => {
      alerts.push({
        id: `stall-${l.id}`,
        type: "stall",
        severity: l.staleDays > 3 ? "critical" : "high",
        title: `${l.contact.firstName} ${l.contact.lastName} — No contact for ${l.staleDays} days`,
        description: `Heat score ${l.heatScore}, deal value $${l.dealValue.toLocaleString()}. This hot lead is going cold.`,
        leadId: l.id,
        timestamp: l.lastActivity,
        resolved: false,
      });
    });

  // Whale alerts: high-value deals in negotiation
  leads
    .filter((l) => l.dealValue >= 10000 && l.stage === "negotiation" && l.heatScore >= 70)
    .forEach((l) => {
      alerts.push({
        id: `whale-${l.id}`,
        type: "whale",
        severity: "high",
        title: `Tier 2 Whale: ${l.contact.company} — $${l.dealValue.toLocaleString()}`,
        description: `${l.contact.firstName} ${l.contact.lastName} is in negotiation with heat score ${l.heatScore}. Closing window is open.`,
        leadId: l.id,
        timestamp: l.lastActivity,
        resolved: false,
      });
    });

  // Stale leads with medium heat
  leads
    .filter((l) => l.staleDays > 5 && l.heatScore >= 40 && l.heatScore < 80 && l.stage !== "closed-won" && l.stage !== "closed-lost")
    .forEach((l) => {
      alerts.push({
        id: `medium-${l.id}`,
        type: "stall",
        severity: "medium",
        title: `${l.contact.firstName} ${l.contact.lastName} drifting — ${l.staleDays} days inactive`,
        description: `${l.contact.company}, heat ${l.heatScore}. Consider re-engagement or pivot.`,
        leadId: l.id,
        timestamp: l.lastActivity,
        resolved: false,
      });
    });

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2 };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Red Flag Alerts</h1>
        <p className="text-sm text-slate-400">Exception-based reporting &mdash; you only see what requires a human decision</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`rounded-xl border p-4 ${criticalCount > 0 ? "border-red-500/30 bg-red-500/5 animate-pulse" : "border-slate-800 bg-slate-900/30"}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical</p>
          <p className={`mt-1 text-3xl font-extrabold ${criticalCount > 0 ? "text-red-400" : "text-slate-600"}`}>{criticalCount}</p>
        </div>
        <div className={`rounded-xl border p-4 ${highCount > 0 ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800 bg-slate-900/30"}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High</p>
          <p className={`mt-1 text-3xl font-extrabold ${highCount > 0 ? "text-amber-400" : "text-slate-600"}`}>{highCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medium</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-400">{alerts.length - criticalCount - highCount}</p>
        </div>
      </div>

      {/* Alert Trigger Reference */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
        <div className="flex flex-wrap gap-4 text-[10px]">
          {Object.entries(ALERT_CONFIG).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1 text-slate-400">
              <span>{cfg.icon}</span> {cfg.label}
            </span>
          ))}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-12 text-center">
            <p className="text-2xl">\uD83D\uDFE2</p>
            <p className="mt-2 text-lg font-bold text-green-400">All Clear</p>
            <p className="mt-1 text-sm text-slate-400">No alerts requiring your attention</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const cfg = ALERT_CONFIG[alert.type];
            const sev = SEVERITY_BADGE[alert.severity];
            return (
              <div key={alert.id} className={`rounded-xl border ${cfg.bg} p-5`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{cfg.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${sev.color} ${sev.bg}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-semibold text-slate-200">{alert.title}</h3>
                      <p className="mt-1 text-xs text-slate-400">{alert.description}</p>
                      <p className="mt-2 text-[10px] text-slate-500">
                        {new Date(alert.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  {alert.leadId && (
                    <Link
                      href={`/gse/leads/${alert.leadId}`}
                      className="shrink-0 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400"
                    >
                      Take Action
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
