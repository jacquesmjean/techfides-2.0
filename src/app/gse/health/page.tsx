"use client";

/**
 * Machine Health — The Pulse of the 24/7 Engine
 *
 * Monitors: domain deliverability, lead throughput, logic drift,
 * outreach performance, and system component status.
 */

const domains = [
  { name: "send-01.techfides.io", health: 98, sent: 1240, bounceRate: 0.8, status: "active" },
  { name: "send-02.techfides.io", health: 95, sent: 980, bounceRate: 1.2, status: "active" },
  { name: "outreach.techfides.com", health: 92, sent: 1560, bounceRate: 1.8, status: "active" },
  { name: "send-03.techfides.io", health: 88, sent: 720, bounceRate: 2.4, status: "active" },
  { name: "mail.techfides.mx", health: 96, sent: 430, bounceRate: 0.5, status: "active" },
  { name: "send-04.techfides.io", health: 72, sent: 890, bounceRate: 4.1, status: "warning" },
  { name: "send-05.techfides.io", health: 45, sent: 340, bounceRate: 8.2, status: "quarantined" },
];

const systemComponents = [
  { name: "Velocity Engine (vLLM)", status: "operational", uptime: "99.97%", latency: "1.2s" },
  { name: "PostgreSQL Database", status: "operational", uptime: "99.99%", latency: "4ms" },
  { name: "Redis (BullMQ)", status: "operational", uptime: "99.98%", latency: "1ms" },
  { name: "Outlook Graph API", status: "operational", uptime: "99.5%", latency: "340ms" },
  { name: "Apollo Enrichment", status: "degraded", uptime: "97.2%", latency: "2.8s" },
  { name: "Qdrant Vector DB", status: "operational", uptime: "99.96%", latency: "12ms" },
];

const statusColors: Record<string, { dot: string; text: string; bg: string }> = {
  operational: { dot: "\uD83D\uDFE2", text: "text-green-400", bg: "bg-green-500/5 border-green-500/20" },
  degraded: { dot: "\uD83D\uDFE1", text: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/20" },
  down: { dot: "\uD83D\uDD34", text: "text-red-400", bg: "bg-red-500/5 border-red-500/20" },
};

export default function MachineHealthPage() {
  const healthyDomains = domains.filter((d) => d.health >= 80).length;
  const avgDeliverability = (domains.reduce((s, d) => s + d.health, 0) / domains.length).toFixed(1);
  const totalSent = domains.reduce((s, d) => s + d.sent, 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Machine Health</h1>
        <p className="text-sm text-slate-400">The Pulse of the 24/7 Engine &mdash; real-time system monitoring</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Domains Active</p>
          <p className="mt-1 text-2xl font-extrabold text-green-400">{healthyDomains}/{domains.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Deliverability</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-100">{avgDeliverability}%</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emails Sent (7d)</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-100">{totalSent.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Throughput</p>
          <p className="mt-1 text-2xl font-extrabold text-sky-400">42/50</p>
          <p className="text-[10px] text-slate-400">daily target</p>
        </div>
      </div>

      {/* Domain Health Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">Domain Deliverability Monitor</h2>
          <p className="text-[10px] text-slate-400">Auto-quarantine at &lt;80% health. Self-healing rotates in backup domains.</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50">
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Domain</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Health</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Sent (7d)</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Bounce Rate</th>
              <th className="p-3 text-left text-[10px] font-medium text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {domains.map((d) => {
              const healthColor = d.health >= 90 ? "text-green-400" : d.health >= 80 ? "text-amber-400" : "text-red-400";
              const statusLabel = d.status === "quarantined" ? "\uD83D\uDD34 Quarantined" : d.status === "warning" ? "\uD83D\uDFE1 Warning" : "\uD83D\uDFE2 Active";
              return (
                <tr key={d.name} className="hover:bg-slate-900/30">
                  <td className="p-3 font-mono text-xs text-slate-300">{d.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-slate-800">
                        <div className="h-full rounded-full" style={{ width: `${d.health}%`, backgroundColor: d.health >= 90 ? "#22c55e" : d.health >= 80 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span className={`text-xs font-semibold ${healthColor}`}>{d.health}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-slate-400">{d.sent.toLocaleString()}</td>
                  <td className="p-3 text-xs text-slate-400">{d.bounceRate}%</td>
                  <td className="p-3 text-xs">{statusLabel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* System Components */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">System Components</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {systemComponents.map((c) => {
            const s = statusColors[c.status] || statusColors.operational;
            return (
              <div key={c.name} className={`rounded-lg border ${s.bg} p-4`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{s.dot}</span>
                  <span className={`text-xs font-semibold ${s.text}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-200">{c.name}</p>
                <div className="mt-2 flex gap-4 text-[10px] text-slate-400">
                  <span>Uptime: {c.uptime}</span>
                  <span>Latency: {c.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logic Drift */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">Logic Drift Monitor</h2>
        <p className="text-xs text-slate-400 mb-4">Tracks AI response quality over time. Flags when personalization becomes stale.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Open Rate (7d avg)", value: "42.3%", trend: "+2.1%", good: true },
            { label: "Reply Rate (7d avg)", value: "4.8%", trend: "-0.3%", good: false },
            { label: "Personalization Score", value: "87/100", trend: "Stable", good: true },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-4">
              <p className="text-[10px] text-slate-400">{m.label}</p>
              <p className="mt-1 text-xl font-bold text-slate-100">{m.value}</p>
              <p className={`mt-1 text-[10px] ${m.good ? "text-green-400" : "text-amber-400"}`}>{m.trend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
