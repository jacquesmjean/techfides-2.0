"use client";

import Link from "next/link";
import { useGSE } from "@/lib/gse/store";

/**
 * CEO Cockpit — 10-Dashboard Command Center
 *
 * The single screen Jacques opens every morning.
 * Each tile = one dashboard condensed into a status light + key metric + action.
 * Green = target met. Yellow = drift (self-healing). Red = human decision needed.
 */

export default function CEOCockpit() {
  const gse = useGSE();
  const leads = gse.leads || [];
  const activities = gse.activities || [];

  let pipeline = { totalLeads: 0, totalValue: 0, weightedValue: 0, avgDealSize: 0, conversionRate: 0, avgCycleTime: 0, stageBreakdown: {} as Record<string, { count: number; value: number }> };
  let revenue = { mrr: 0, arr: 0, sowRevenue: 0, totalClosed: 0, closedThisMonth: 0, targetThisMonth: 10000, pipelineCoverage: 0 };

  try {
    pipeline = gse.getPipelineMetrics();
    revenue = gse.getRevenueMetrics();
  } catch {
    // Use defaults on error
  }

  const hotLeads = leads.filter((l) => l.heatScore >= 70).length;
  const staleLeads = leads.filter((l) => l.staleDays > 3 && l.stage !== "closed-won" && l.stage !== "closed-lost").length;
  const tier2Value = leads.filter((l) => l.dealValue >= 50000).reduce((s, l) => s + l.dealValue, 0);
  const activeDeals = leads.filter((l) => ["prospect", "qualified", "proposal", "negotiation"].includes(l.stage)).length;

  // Mock data for dashboards not yet connected to live APIs
  const mockData = {
    cashFlow: { net: 42500, arAging: 12000, dryPowder: 185000 },
    throughput: { today: 42, target: 50 },
    assessments: { inProgress: 3, completionRate: 87 },
    hrUtilization: 78,
    domainHealth: 96,
    nps: 8.4,
    productRevenuePct: 62,
    hoursReclaimed: 127,
    compliancePct: 94,
  };

  const dashboards: DashboardTile[] = [
    {
      id: "revenue",
      number: "01",
      title: "Revenue & Liquidity",
      subtitle: "The Pulse",
      icon: "\uD83D\uDCB0",
      status: revenue.mrr >= revenue.targetThisMonth * 0.8 ? "green" : revenue.mrr >= revenue.targetThisMonth * 0.5 ? "yellow" : "red",
      metric: `$${revenue.mrr.toLocaleString()}`,
      metricLabel: "MRR",
      secondaryMetrics: [
        { label: "Cash Flow", value: `$${mockData.cashFlow.net.toLocaleString()}` },
        { label: "AR Aging", value: `$${mockData.cashFlow.arAging.toLocaleString()}` },
        { label: "Dry Powder", value: `$${mockData.cashFlow.dryPowder.toLocaleString()}` },
      ],
      action: revenue.mrr < revenue.targetThisMonth * 0.8 ? "Review pipeline — MRR below 80% of target" : "On track",
      link: "/gse/forecast",
    },
    {
      id: "velocity",
      number: "02",
      title: "Velocity Funnel",
      subtitle: "The Money Machine",
      icon: "\uD83D\uDE80",
      status: mockData.throughput.today >= 40 ? "green" : mockData.throughput.today >= 25 ? "yellow" : "red",
      metric: `${mockData.throughput.today}/${mockData.throughput.target}`,
      metricLabel: "Daily Leads",
      secondaryMetrics: [
        { label: "Pipeline", value: `$${pipeline.totalValue.toLocaleString()}` },
        { label: "Hot (70+)", value: String(hotLeads) },
        { label: "Cycle Time", value: `${pipeline.avgCycleTime}d` },
      ],
      action: hotLeads > 0 ? `${hotLeads} hot leads ready to close — review now` : "Funnel healthy",
      link: "/gse/pipeline",
    },
    {
      id: "bigticket",
      number: "03",
      title: "Big Ticket Diagnostic",
      subtitle: "AI 360 & TEDOS Pipeline",
      icon: "\uD83C\uDFAF",
      status: mockData.assessments.completionRate >= 80 ? "green" : "yellow",
      metric: String(mockData.assessments.inProgress),
      metricLabel: "Active Assessments",
      secondaryMetrics: [
        { label: "Completion Rate", value: `${mockData.assessments.completionRate}%` },
        { label: "Tier 2 Value", value: `$${(tier2Value / 1000).toFixed(0)}K` },
      ],
      action: tier2Value > 100000 ? "High-value pipeline — prioritize Tier 2 closes" : "Build Tier 2 pipeline",
      link: "/gse/projects",
    },
    {
      id: "hr",
      number: "04",
      title: "Human Capital ROI",
      subtitle: "Team Performance",
      icon: "\uD83D\uDC65",
      status: mockData.hrUtilization >= 75 ? "green" : mockData.hrUtilization >= 60 ? "yellow" : "red",
      metric: `${mockData.hrUtilization}%`,
      metricLabel: "Utilization",
      secondaryMetrics: [
        { label: "Top Performers", value: "2" },
        { label: "Review Needed", value: "1" },
      ],
      action: mockData.hrUtilization < 75 ? "Review underutilized contractors" : "Team performing well",
      link: "/gse/hr",
    },
    {
      id: "health",
      number: "05",
      title: "Sovereign Health",
      subtitle: "Systems Monitor",
      icon: "\uD83D\uDDA5\uFE0F",
      status: mockData.domainHealth >= 95 ? "green" : mockData.domainHealth >= 80 ? "yellow" : "red",
      metric: `${mockData.domainHealth}%`,
      metricLabel: "Domain Health",
      secondaryMetrics: [
        { label: "Uptime", value: "99.97%" },
        { label: "Stale Leads", value: String(staleLeads) },
      ],
      action: staleLeads > 5 ? `${staleLeads} leads going cold — re-engage or pivot` : "Machine running clean",
      link: "/gse/health",
    },
    {
      id: "simulator",
      number: "06",
      title: "What-If Simulator",
      subtitle: "Digital Twin",
      icon: "\uD83D\uDD2E",
      status: "green",
      metric: "3",
      metricLabel: "Scenarios Ready",
      secondaryMetrics: [
        { label: "Last Run", value: "Today" },
        { label: "Confidence", value: "87%" },
      ],
      action: "Test: What if we double outreach volume?",
      link: "/gse/intelligence",
    },
    {
      id: "advocacy",
      number: "07",
      title: "Client Advocacy",
      subtitle: "Retention & NPS",
      icon: "\u2B50",
      status: mockData.nps >= 8 ? "green" : mockData.nps >= 6 ? "yellow" : "red",
      metric: String(mockData.nps),
      metricLabel: "Avg NPS",
      secondaryMetrics: [
        { label: "Active Clients", value: "—" },
        { label: "Upsell Ready", value: "—" },
      ],
      action: mockData.nps < 8 ? "Call detractors in Tier 2 bracket personally" : "Client satisfaction strong",
      link: "/gse/clients",
    },
    {
      id: "compliance",
      number: "08",
      title: "Compliance Audit",
      subtitle: "Global Governance",
      icon: "\uD83D\uDEE1\uFE0F",
      status: mockData.compliancePct >= 90 ? "green" : "yellow",
      metric: `${mockData.compliancePct}%`,
      metricLabel: "Compliance Score",
      secondaryMetrics: [
        { label: "Audit Trail", value: "Active" },
        { label: "Regions", value: "US/MX/GA" },
      ],
      action: mockData.compliancePct < 95 ? "Review governance flags before they become liabilities" : "Compliant across all regions",
      link: "/gse/intelligence",
    },
    {
      id: "innovation",
      number: "09",
      title: "Innovation & R&D",
      subtitle: "Product vs Services",
      icon: "\uD83D\uDE80",
      status: mockData.productRevenuePct >= 60 ? "green" : mockData.productRevenuePct >= 40 ? "yellow" : "red",
      metric: `${mockData.productRevenuePct}%`,
      metricLabel: "Product Revenue",
      secondaryMetrics: [
        { label: "Services", value: `${100 - mockData.productRevenuePct}%` },
        { label: "R&D Velocity", value: "On Track" },
      ],
      action: mockData.productRevenuePct < 50 ? "Service work is cannibalizing product dev — pivot resources" : "Product-led transition on track",
      link: "/gse/analytics",
    },
    {
      id: "time",
      number: "10",
      title: "Executive Time",
      subtitle: "Your ROI",
      icon: "\u23F0",
      status: mockData.hoursReclaimed >= 100 ? "green" : "yellow",
      metric: `${mockData.hoursReclaimed}h`,
      metricLabel: "Hours Reclaimed",
      secondaryMetrics: [
        { label: "This Week", value: `${mockData.hoursReclaimed}h saved` },
        { label: "Automated Tasks", value: "843" },
      ],
      action: mockData.hoursReclaimed < 100 ? "Trigger further automation in C&C Core" : "Machine handling the heavy lifting",
      link: "/gse/intelligence",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CEO Cockpit</h1>
          <p className="text-sm text-slate-400">
            10-dashboard command center — 360° visibility, zero blind spots
          </p>
        </div>
        <div className="flex gap-2">
          {staleLeads > 0 && (
            <Link href="/gse/alerts" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 animate-pulse">
              {staleLeads} Alerts
            </Link>
          )}
          <Link href="/gse/deal-prep" className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400">
            Deal Prep
          </Link>
          <Link href="/gse/outreach" className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white">
            Approve Drafts
          </Link>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-800 bg-slate-900/30 px-6 py-3">
        <QStat label="Active Deals" value={String(activeDeals)} />
        <div className="h-8 w-px bg-slate-800" />
        <QStat label="Pipeline" value={`$${(pipeline.totalValue / 1000).toFixed(0)}K`} />
        <div className="h-8 w-px bg-slate-800" />
        <QStat label="MRR" value={`$${revenue.mrr.toLocaleString()}`} />
        <div className="h-8 w-px bg-slate-800" />
        <QStat label="Win Rate" value={`${pipeline.conversionRate.toFixed(0)}%`} />
        <div className="h-8 w-px bg-slate-800" />
        <QStat label="Hot Leads" value={String(hotLeads)} highlight={hotLeads > 0} />
      </div>

      {/* 10 Dashboard Tiles — 2x5 grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {dashboards.map((d) => (
          <DashTile key={d.id} dashboard={d} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Recent Activity</h2>
        <div className="space-y-1.5">
          {activities.slice(0, 6).map((a) => {
            const lead = leads.find((l) => l.id === a.leadId);
            return (
              <div key={a.id} className="flex items-center gap-3 text-xs">
                <span className="text-slate-500 w-14 shrink-0">{new Date(a.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className={a.automated ? "text-sky-400" : "text-slate-300"}>
                  {a.automated ? "\u2699\uFE0F" : "\uD83D\uDC64"}
                </span>
                <span className="text-slate-300 truncate">{a.title}</span>
                {lead && <span className="text-slate-500 shrink-0">&middot; {lead.contact.company}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Types & Components ----

interface DashboardTile {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  status: "green" | "yellow" | "red";
  metric: string;
  metricLabel: string;
  secondaryMetrics: Array<{ label: string; value: string }>;
  action: string;
  link: string;
}

function DashTile({ dashboard: d }: { dashboard: DashboardTile }) {
  const statusColors = {
    green: { dot: "\uD83D\uDFE2", border: "border-green-500/20", bg: "hover:bg-green-500/5" },
    yellow: { dot: "\uD83D\uDFE1", border: "border-amber-500/20", bg: "hover:bg-amber-500/5" },
    red: { dot: "\uD83D\uDD34", border: "border-red-500/20 animate-pulse", bg: "hover:bg-red-500/5" },
  };
  const sc = statusColors[d.status];

  return (
    <Link href={d.link} className={`block rounded-xl border ${sc.border} bg-slate-900/30 p-5 transition-all ${sc.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{d.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-500">{d.number}</span>
              <span className="text-sm font-bold text-slate-200">{d.title}</span>
              <span className="text-xs">{sc.dot}</span>
            </div>
            <p className="text-[10px] text-slate-500">{d.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-slate-100">{d.metric}</p>
          <p className="text-[9px] text-slate-500">{d.metricLabel}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-4">
        {d.secondaryMetrics.map((m) => (
          <div key={m.label}>
            <p className="text-[9px] text-slate-500">{m.label}</p>
            <p className="text-xs font-semibold text-slate-300">{m.value}</p>
          </div>
        ))}
      </div>

      <div className={`mt-3 rounded-lg px-3 py-1.5 text-[10px] ${
        d.status === "red" ? "bg-red-500/10 text-red-400" :
        d.status === "yellow" ? "bg-amber-500/10 text-amber-400" :
        "bg-slate-800/50 text-slate-400"
      }`}>
        <span className="font-semibold">Action:</span> {d.action}
      </div>
    </Link>
  );
}

function QStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`text-sm font-extrabold ${highlight ? "text-sky-400" : "text-slate-200"}`}>{value}</p>
    </div>
  );
}
