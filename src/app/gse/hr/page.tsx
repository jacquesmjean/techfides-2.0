"use client";

/**
 * HR & Performance — Human Capital Management placeholder.
 *
 * Shows the vision for resource tracking, performance heatmaps,
 * and compensation-vs-output analysis. Currently displays mock data
 * to demonstrate the dashboard structure.
 */

const resources = [
  { name: "Sarah K.", role: "AI Engineer", tier: "Top", type: "FTE", utilization: 92, roi: 3.4, nps: 9.2, region: "US", cost: 14000 },
  { name: "Miguel R.", role: "DevOps Lead", tier: "Top", type: "FTE", utilization: 88, roi: 3.1, nps: 8.8, region: "MX", cost: 8500 },
  { name: "David T.", role: "AI Consultant", tier: "Mid", type: "Contractor", utilization: 76, roi: 2.1, nps: 7.5, region: "US", cost: 12000 },
  { name: "Aminata B.", role: "Strategy Analyst", tier: "Mid", type: "FTE", utilization: 81, roi: 2.4, nps: 8.1, region: "GA", cost: 6000 },
  { name: "James W.", role: "Full-Stack Dev", tier: "Mid", type: "Contractor", utilization: 70, roi: 1.8, nps: 7.0, region: "US", cost: 11000 },
  { name: "Fatima L.", role: "Project Coord.", tier: "Low", type: "Contractor", utilization: 55, roi: 0.9, nps: 6.2, region: "MX", cost: 5000 },
];

const TIER_COLORS: Record<string, { color: string; bg: string }> = {
  Top: { color: "text-green-400", bg: "bg-green-500/10" },
  Mid: { color: "text-sky-400", bg: "bg-sky-500/10" },
  Low: { color: "text-red-400", bg: "bg-red-500/10" },
};

export default function HRPage() {
  const totalPayroll = resources.reduce((s, r) => s + r.cost, 0);
  const avgROI = (resources.reduce((s, r) => s + r.roi, 0) / resources.length).toFixed(1);
  const avgNPS = (resources.reduce((s, r) => s + r.nps, 0) / resources.length).toFixed(1);
  const topCount = resources.filter((r) => r.tier === "Top").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">HR &amp; Performance</h1>
        <p className="text-sm text-slate-400">Human Capital Management &mdash; Resource ROI, performance heatmap, and payroll efficiency</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Team</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-100">{resources.length}</p>
          <p className="text-[10px] text-slate-400">{resources.filter((r) => r.type === "FTE").length} FTE, {resources.filter((r) => r.type === "Contractor").length} contractors</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Payroll</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-100">${totalPayroll.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg ROI per Resource</p>
          <p className="mt-1 text-2xl font-extrabold text-green-400">{avgROI}x</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Client NPS</p>
          <p className="mt-1 text-2xl font-extrabold text-sky-400">{avgNPS}</p>
        </div>
      </div>

      {/* Performance Bell Curve */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">Performance Quadrant (Top / Mid / Low)</h2>
        <div className="grid grid-cols-3 gap-4">
          {(["Top", "Mid", "Low"] as const).map((tier) => {
            const tierResources = resources.filter((r) => r.tier === tier);
            const cfg = TIER_COLORS[tier];
            return (
              <div key={tier} className={`rounded-lg border ${cfg.bg} border-slate-700/50 p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${cfg.color}`}>{tier} Performers</span>
                  <span className="text-xs text-slate-400">{tierResources.length}</span>
                </div>
                <div className="space-y-2">
                  {tierResources.map((r) => (
                    <div key={r.name} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-200">{r.name}</span>
                        <span className="text-slate-500 ml-1">({r.role})</span>
                      </div>
                      <span className={cfg.color}>{r.roi}x ROI</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">Resource Matrix</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50">
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Name</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Role</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Type</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Region</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Utilization</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">ROI</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Client NPS</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Tier</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {resources.map((r) => {
              const cfg = TIER_COLORS[r.tier];
              return (
                <tr key={r.name} className="hover:bg-slate-900/30">
                  <td className="p-3 text-xs font-medium text-slate-200">{r.name}</td>
                  <td className="p-3 text-xs text-slate-400">{r.role}</td>
                  <td className="p-3 text-xs text-slate-400">{r.type}</td>
                  <td className="p-3 text-xs text-slate-400">{r.region}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-sky-500" style={{ width: `${r.utilization}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400">{r.utilization}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs font-semibold" style={{ color: r.roi >= 2.5 ? "#22c55e" : r.roi >= 1.5 ? "#38bdf8" : "#ef4444" }}>{r.roi}x</td>
                  <td className="p-3 text-xs text-slate-400">{r.nps}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${cfg.color} ${cfg.bg}`}>{r.tier}</span></td>
                  <td className="p-3 text-xs text-slate-400">${r.cost.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Coming Soon */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center">
        <p className="text-sm text-slate-400">
          Full HR module (automated performance ingestion, compensation-vs-output scatter plot, quarterly reports) coming in Phase 4 of the C&amp;C build.
        </p>
      </div>
    </div>
  );
}
