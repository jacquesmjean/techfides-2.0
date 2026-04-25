"use client";

import { useEffect, useState } from "react";

/**
 * HR & Performance — wired to /api/v1/hr/employees.
 *
 * Phase 2: real employee records, onboarding progress, performance tiers.
 * Phase 4 (future): automated performance ingestion + compensation analysis.
 */

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  type: "FTE" | "CONTRACTOR";
  status: "ONBOARDING" | "ACTIVE" | "ON_LEAVE" | "TERMINATED";
  tier: "Top" | "Mid" | "Low" | null;
  region: "US" | "MX" | "CEMAC";
  payRate: number;
  utilization: number | null;
  roi: number | null;
  nps: number | null;
  folderPath: string | null;
  startDate: string | null;
  onboardingProgress: number;
  requiredTaskCount: number;
  completedTaskCount: number;
}

const TIER_COLORS: Record<string, { color: string; bg: string }> = {
  Top: { color: "text-green-400", bg: "bg-green-500/10" },
  Mid: { color: "text-sky-400", bg: "bg-sky-500/10" },
  Low: { color: "text-red-400", bg: "bg-red-500/10" },
  Unranked: { color: "text-slate-400", bg: "bg-slate-500/10" },
};

const STATUS_BADGE: Record<string, { color: string; bg: string; label: string }> = {
  ONBOARDING: { color: "text-amber-400", bg: "bg-amber-500/10", label: "Onboarding" },
  ACTIVE: { color: "text-green-400", bg: "bg-green-500/10", label: "Active" },
  ON_LEAVE: { color: "text-slate-400", bg: "bg-slate-500/10", label: "On Leave" },
  TERMINATED: { color: "text-red-400", bg: "bg-red-500/10", label: "Terminated" },
};

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/hr/employees")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Employee[]) => setEmployees(data))
      .catch((e) => setError(e.message ?? "Failed to load"));
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">HR & Performance</h1>
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          Failed to load: {error}
        </div>
      </div>
    );
  }

  if (!employees) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">HR & Performance</h1>
        <p className="mt-4 text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  const active = employees.filter((e) => e.status === "ACTIVE" || e.status === "ONBOARDING");
  const fteCount = active.filter((e) => e.type === "FTE").length;
  const contractorCount = active.filter((e) => e.type === "CONTRACTOR").length;
  const totalPayroll = active.reduce((s, e) => s + (e.payRate || 0), 0);
  const onboarding = employees.filter((e) => e.status === "ONBOARDING");

  const withROI = active.filter((e) => e.roi !== null);
  const avgROI = withROI.length > 0 ? (withROI.reduce((s, e) => s + (e.roi ?? 0), 0) / withROI.length).toFixed(1) : "—";
  const withNPS = active.filter((e) => e.nps !== null);
  const avgNPS = withNPS.length > 0 ? (withNPS.reduce((s, e) => s + (e.nps ?? 0), 0) / withNPS.length).toFixed(1) : "—";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">HR &amp; Performance</h1>
        <p className="text-sm text-slate-400">Human Capital Management — onboarding, performance, and payroll efficiency</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Team</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-100">{active.length}</p>
          <p className="text-[10px] text-slate-400">{fteCount} FTE, {contractorCount} contractors</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Payroll</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-100">${totalPayroll.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Onboarding</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-400">{onboarding.length}</p>
          <p className="text-[10px] text-slate-400">{onboarding.length === 1 ? "person" : "people"} in progress</p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg ROI per Resource</p>
          <p className="mt-1 text-2xl font-extrabold text-green-400">{avgROI === "—" ? avgROI : `${avgROI}x`}</p>
          <p className="text-[10px] text-slate-400">NPS {avgNPS}</p>
        </div>
      </div>

      {/* Onboarding panel — only show if anyone is onboarding */}
      {onboarding.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-sm font-bold text-amber-300 mb-4">Onboarding in Progress</h2>
          <div className="space-y-3">
            {onboarding.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-amber-500/10 bg-slate-900/40 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{e.name}</p>
                  <p className="text-[11px] text-slate-400">{e.role} · {e.type === "FTE" ? "Full-time" : "Contractor"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">{e.completedTaskCount} of {e.requiredTaskCount} tasks</p>
                    <div className="mt-1 h-1.5 w-32 rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${e.onboardingProgress}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-amber-400">{e.onboardingProgress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance tier breakdown — only count tiered employees */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">Performance Quadrant (Top / Mid / Low)</h2>
        <div className="grid grid-cols-3 gap-4">
          {(["Top", "Mid", "Low"] as const).map((tier) => {
            const tierResources = active.filter((e) => e.tier === tier);
            const cfg = TIER_COLORS[tier];
            return (
              <div key={tier} className={`rounded-lg border ${cfg.bg} border-slate-700/50 p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${cfg.color}`}>{tier} Performers</span>
                  <span className="text-xs text-slate-400">{tierResources.length}</span>
                </div>
                <div className="space-y-2">
                  {tierResources.length === 0 ? (
                    <p className="text-[11px] italic text-slate-500">no one tiered yet</p>
                  ) : (
                    tierResources.map((e) => (
                      <div key={e.id} className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-200">{e.name}</span>
                          <span className="text-slate-500 ml-1">({e.role})</span>
                        </div>
                        <span className={cfg.color}>{e.roi !== null ? `${e.roi}x ROI` : "—"}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Roster */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200">Roster</h2>
          <p className="text-[10px] text-slate-400">{employees.length} total · {employees.filter((e) => e.status === "TERMINATED").length} archived</p>
        </div>
        {employees.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-400">No employees yet.</p>
            <p className="mt-2 text-xs text-slate-500">
              Create one via <code className="rounded bg-slate-800 px-1.5 py-0.5 text-amber-300">POST /api/v1/hr/employees</code>
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Name</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Role</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Type</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Region</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Status</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Onboarding</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">ROI</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Tier</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Pay/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {employees.map((e) => {
                const tierKey = e.tier ?? "Unranked";
                const cfg = TIER_COLORS[tierKey];
                const status = STATUS_BADGE[e.status];
                return (
                  <tr key={e.id} className="hover:bg-slate-900/30">
                    <td className="p-3 text-xs font-medium text-slate-200">{e.name}</td>
                    <td className="p-3 text-xs text-slate-400">{e.role}</td>
                    <td className="p-3 text-xs text-slate-400">{e.type === "FTE" ? "FTE" : "Contractor"}</td>
                    <td className="p-3 text-xs text-slate-400">{e.region}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${status.color} ${status.bg}`}>{status.label}</span>
                    </td>
                    <td className="p-3">
                      {e.status === "ONBOARDING" ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-slate-800">
                            <div className="h-full rounded-full bg-amber-500" style={{ width: `${e.onboardingProgress}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400">{e.onboardingProgress}%</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">complete</span>
                      )}
                    </td>
                    <td className="p-3 text-xs font-semibold" style={{ color: e.roi === null ? "#64748b" : e.roi >= 2.5 ? "#22c55e" : e.roi >= 1.5 ? "#38bdf8" : "#ef4444" }}>
                      {e.roi !== null ? `${e.roi}x` : "—"}
                    </td>
                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${cfg.color} ${cfg.bg}`}>{tierKey}</span></td>
                    <td className="p-3 text-xs text-slate-400">${e.payRate.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
