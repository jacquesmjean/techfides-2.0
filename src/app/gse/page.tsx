"use client";

import Link from "next/link";
import { useGSE } from "@/lib/gse/store";

export default function CEOCockpit() {
  const { leads, activities, getPipelineMetrics, getRevenueMetrics } = useGSE();
  const pipeline = getPipelineMetrics();
  const revenue = getRevenueMetrics();

  const hotLeads = leads.filter((l) => l.heatScore >= 70).sort((a, b) => b.heatScore - a.heatScore).slice(0, 5);
  const tier2Leads = leads.filter((l) => l.dealValue >= 50000);
  const tier2Value = tier2Leads.reduce((s, l) => s + l.dealValue, 0);
  const staleLeads = leads.filter((l) => l.staleDays > 3 && l.stage !== "closed-won" && l.stage !== "closed-lost");

  const machineHealth = {
    domainsHealthy: 18, domainsTotal: 20,
    leadsToday: 42, leadsTarget: 50,
    deliverability: 98.2, responseRate: 4.8,
  };
  const timeReclaimed = { hoursThisWeek: 127, hoursLastWeek: 112, automatedTasks: 843 };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CEO Cockpit</h1>
          <p className="text-sm text-slate-400">Real-time command view of the TechFides sovereign enterprise</p>
        </div>
        <div className="flex gap-2">
          <Link href="/gse/alerts" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20">
            {staleLeads.length} Alerts
          </Link>
          <Link href="/gse/outreach" className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400">
            Approve Drafts
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <CCard label="Revenue Velocity" value={`${pipeline.avgCycleTime}d`} detail="Avg lead-to-close" good={pipeline.avgCycleTime < 30} />
        <CCard label="Time Reclaimed" value={`${timeReclaimed.hoursThisWeek}h`} detail={`${timeReclaimed.automatedTasks} tasks automated`} good delta={`+${timeReclaimed.hoursThisWeek - timeReclaimed.hoursLastWeek}h vs last week`} />
        <CCard label="Tier 2 Pipeline" value={`$${(tier2Value / 1000).toFixed(0)}K`} detail={`${tier2Leads.length} high-value deals`} good={tier2Value > 100000} />
        <CCard label="Monthly Revenue" value={`$${revenue.mrr.toLocaleString()}`} detail={`Target: $${revenue.targetThisMonth.toLocaleString()}`} good={revenue.mrr >= revenue.targetThisMonth * 0.8} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200">Machine Health</h2>
            <Link href="/gse/health" className="text-[10px] text-sky-400 hover:text-sky-300">View Details &rarr;</Link>
          </div>
          <div className="space-y-3">
            <HBar label="Deliverability" val={machineHealth.deliverability} max={100} unit="%" ok={95} />
            <HBar label="Lead Throughput" val={machineHealth.leadsToday} max={machineHealth.leadsTarget} unit={`/${machineHealth.leadsTarget}`} ok={40} />
            <HBar label="Domains Healthy" val={machineHealth.domainsHealthy} max={machineHealth.domainsTotal} unit={`/${machineHealth.domainsTotal}`} ok={16} />
            <HBar label="Response Rate" val={machineHealth.responseRate} max={10} unit="%" ok={3} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200">Active Alerts</h2>
            <Link href="/gse/alerts" className="text-[10px] text-sky-400 hover:text-sky-300">View All &rarr;</Link>
          </div>
          <div className="space-y-2">
            {staleLeads.length > 0 ? staleLeads.slice(0, 4).map((l) => (
              <Link key={l.id} href={`/gse/leads/${l.id}`} className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 hover:bg-amber-500/10">
                <span className="text-sm">{l.heatScore >= 80 ? "\uD83D\uDD34" : "\uD83D\uDFE1"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{l.contact.firstName} {l.contact.lastName}</p>
                  <p className="text-[10px] text-slate-400">{l.staleDays}d stale &middot; Heat: {l.heatScore} &middot; ${l.dealValue.toLocaleString()}</p>
                </div>
              </Link>
            )) : <p className="text-xs text-slate-500 text-center py-4">No active alerts</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <h2 className="text-sm font-bold text-slate-200 mb-4">Closing-Ready Leads</h2>
          {hotLeads.length > 0 ? <div className="space-y-2">{hotLeads.map((l) => (
            <Link key={l.id} href={`/gse/leads/${l.id}`} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-2 hover:border-sky-500/30">
              <div><p className="text-xs font-medium text-slate-200">{l.contact.firstName} {l.contact.lastName}</p><p className="text-[10px] text-slate-400">{l.contact.company}</p></div>
              <div className="text-right"><p className="text-xs font-bold text-sky-400">${l.dealValue.toLocaleString()}</p>
                <div className="flex items-center gap-1"><div className="h-1.5 w-12 rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-500" style={{ width: `${l.heatScore}%` }} /></div><span className="text-[10px] text-slate-400">{l.heatScore}</span></div>
              </div>
            </Link>
          ))}</div> : <p className="text-xs text-slate-500 text-center py-4">No leads above threshold</p>}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <h2 className="text-sm font-bold text-slate-200 mb-4">Pipeline Funnel</h2>
          <div className="space-y-2">
            {(["prospect", "qualified", "proposal", "negotiation", "closed-won"] as const).map((stage) => {
              const d = pipeline.stageBreakdown[stage];
              const mx = Math.max(...Object.values(pipeline.stageBreakdown).map((s) => s.value), 1);
              const c: Record<string, string> = { prospect: "#64748b", qualified: "#38bdf8", proposal: "#a78bfa", negotiation: "#f59e0b", "closed-won": "#22c55e" };
              return (<div key={stage}><div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 capitalize">{stage.replace("-", " ")}</span><span className="text-slate-300">{d.count} &middot; ${d.value.toLocaleString()}</span></div><div className="h-2 rounded-full bg-slate-800"><div className="h-full rounded-full" style={{ width: `${(d.value / mx) * 100}%`, backgroundColor: c[stage] }} /></div></div>);
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-sm font-bold text-slate-200 mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {activities.slice(0, 8).map((a) => {
            const l = leads.find((x) => x.id === a.leadId);
            return (<div key={a.id} className="flex items-center gap-3 text-xs"><span className="text-slate-500 w-16 shrink-0">{new Date(a.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><span className={a.automated ? "text-sky-400" : "text-slate-300"}>{a.automated ? "\u2699\uFE0F" : "\uD83D\uDC64"}</span><span className="text-slate-300 truncate">{a.title}</span>{l && <span className="text-slate-500 shrink-0">&middot; {l.contact.company}</span>}</div>);
          })}
        </div>
      </div>
    </div>
  );
}

function CCard({ label, value, detail, good, delta }: { label: string; value: string; detail?: string; good?: boolean; delta?: string }) {
  return (
    <div className={`rounded-xl border p-4 ${good ? "border-green-500/20 bg-green-500/5" : "border-slate-800 bg-slate-900/30"}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-100">{value}</p>
      {detail && <p className="mt-0.5 text-[10px] text-slate-400">{detail}</p>}
      {delta && <p className="mt-1 text-[10px] text-green-400">{delta}</p>}
    </div>
  );
}

function HBar({ label, val, max, unit, ok }: { label: string; val: number; max: number; unit: string; ok: number }) {
  const pct = (val / max) * 100;
  const s = val >= ok ? "g" : val >= ok * 0.8 ? "y" : "r";
  const cl = { g: "#22c55e", y: "#f59e0b", r: "#ef4444" };
  const dt = { g: "\uD83D\uDFE2", y: "\uD83D\uDFE1", r: "\uD83D\uDD34" };
  return (<div><div className="flex items-center justify-between mb-1"><span className="text-[11px] text-slate-400 flex items-center gap-1.5"><span className="text-xs">{dt[s]}</span>{label}</span><span className="text-[11px] font-semibold text-slate-300">{val}{unit}</span></div><div className="h-1.5 rounded-full bg-slate-800"><div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: cl[s] }} /></div></div>);
}
