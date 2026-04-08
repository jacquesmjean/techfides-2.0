"use client";

import { useGSE } from "@/lib/gse/store";
import { STAGE_CONFIG } from "@/lib/gse/types";
import type { PipelineStage, Lead, Activity } from "@/lib/gse/types";
import { useMemo } from "react";

// Utility: Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

// Utility: Format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Top Metrics Cards
function MetricsRow() {
  const { getPipelineMetrics, getRevenueMetrics, leads } = useGSE();
  const pipelineMetrics = getPipelineMetrics();
  const revenueMetrics = getRevenueMetrics();
  const activeLeads = leads.filter((l) => l.stage !== "closed-won" && l.stage !== "closed-lost");

  const metrics = [
    {
      label: "Active Pipeline",
      value: formatCurrency(pipelineMetrics.totalValue),
      subvalue: `${pipelineMetrics.totalLeads} leads`,
      icon: "📊",
      trend: "+12%",
      trendColor: "text-green-400",
    },
    {
      label: "Weighted Forecast",
      value: formatCurrency(pipelineMetrics.weightedValue),
      subvalue: "Probability-adjusted",
      icon: "🎯",
      trend: "+8%",
      trendColor: "text-green-400",
    },
    {
      label: "Monthly Recurring Revenue",
      value: formatCurrency(revenueMetrics.mrr),
      subvalue: `${revenueMetrics.totalClosed} closed deals`,
      icon: "💰",
      trend: "+15%",
      trendColor: "text-green-400",
    },
    {
      label: "Conversion Rate",
      value: `${pipelineMetrics.conversionRate.toFixed(1)}%`,
      subvalue: "Won vs. Decided",
      icon: "✅",
      trend: "industry avg 35%",
      trendColor: "text-sky-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">{metric.label}</p>
              <p className="text-3xl font-bold text-slate-100 mt-2">{metric.value}</p>
              <p className="text-xs text-slate-500 mt-1">{metric.subvalue}</p>
            </div>
            <span className="text-3xl">{metric.icon}</span>
          </div>
          <div className={`text-xs mt-4 ${metric.trendColor} font-medium`}>{metric.trend}</div>
        </div>
      ))}
    </div>
  );
}

// Pipeline Funnel
function PipelineFunnel() {
  const { leads } = useGSE();

  const stages: PipelineStage[] = ["prospect", "qualified", "proposal", "negotiation", "closed-won"];
  const stageData = stages.map((stage) => {
    const stageLeads = leads.filter((l) => l.stage === stage);
    const count = stageLeads.length;
    const value = stageLeads.reduce((sum, l) => sum + l.dealValue, 0);
    return { stage, count, value, config: STAGE_CONFIG[stage] };
  });

  const maxValue = Math.max(...stageData.map((s) => s.value));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h2 className="text-lg font-bold text-slate-100 mb-6">Pipeline Funnel</h2>
      <div className="space-y-4">
        {stageData.map((stage) => {
          const percentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
          return (
            <div key={stage.stage}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stage.config.icon}</span>
                  <span className="text-sm font-medium text-slate-300">{stage.config.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">{stage.count} deals</span>
                  <span className="text-sky-400 font-bold">{formatCurrency(stage.value)}</span>
                </div>
              </div>
              <div className="h-8 bg-slate-800 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-end pr-3 transition-all"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-bold text-slate-950">{percentage.toFixed(0)}%</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Hot Leads Section
function HotLeads() {
  const { leads } = useGSE();

  const topLeads = leads
    .filter((l) => l.stage !== "closed-lost")
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, 5);

  const getHeatColor = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-amber-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h2 className="text-lg font-bold text-slate-100 mb-4">Hot Leads</h2>
      <div className="space-y-4">
        {topLeads.map((lead) => (
          <div key={lead.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-slate-100">{lead.contact.firstName} {lead.contact.lastName}</p>
                <p className="text-xs text-slate-400">{lead.contact.company}</p>
              </div>
              <span className={`text-xs px-2 py-1 bg-slate-700 text-slate-200 rounded`}>
                {STAGE_CONFIG[lead.stage].label}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mr-2">
                  <div
                    className={`h-full ${getHeatColor(lead.heatScore)}`}
                    style={{ width: `${lead.heatScore}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-300 font-bold">{lead.heatScore}/100</span>
            </div>
            <p className="text-xs text-sky-400">{formatCurrency(lead.dealValue)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stale Leads Alerts
function StaleLeadsAlerts() {
  const { leads } = useGSE();

  const staleLeads = leads.filter((l) => l.staleDays > 3 && l.stage !== "closed-won" && l.stage !== "closed-lost");

  if (staleLeads.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-1">⚠️</span>
        <div>
          <p className="text-sm font-bold text-amber-400">
            {staleLeads.length} lead{staleLeads.length !== 1 ? "s" : ""} need attention
          </p>
          <p className="text-xs text-amber-300/80 mt-1">No activity for 3+ days</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {staleLeads.slice(0, 3).map((lead) => (
              <button
                key={lead.id}
                className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30 transition-colors"
              >
                {lead.contact.firstName} {lead.contact.lastName.charAt(0)}.
              </button>
            ))}
            {staleLeads.length > 3 && <span className="text-xs text-amber-300/60 py-1">+{staleLeads.length - 3} more</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent Activity Feed
function ActivityFeed() {
  const { activities, getLeadById } = useGSE();

  const getActivityColor = (type: string) => {
    switch (type) {
      case "payment-received":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "email-sent":
      case "email-received":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "meeting":
      case "call":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "stage-change":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "deal-room-created":
      case "document-sent":
      case "document-signed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-700/20 text-slate-300 border-slate-600/30";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment-received":
        return "💳";
      case "email-sent":
      case "email-received":
        return "📧";
      case "meeting":
        return "🤝";
      case "call":
        return "☎️";
      case "stage-change":
        return "📈";
      case "deal-room-created":
        return "🔐";
      case "document-sent":
      case "document-signed":
        return "📄";
      case "note":
        return "📝";
      default:
        return "📌";
    }
  };

  const recentActivities = activities.slice(0, 10);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h2 className="text-lg font-bold text-slate-100 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {recentActivities.map((activity) => {
          const lead = getLeadById(activity.leadId);
          return (
            <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
              <span className="text-lg flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">{activity.title}</p>
                {lead && (
                  <p className="text-xs text-slate-400">
                    {lead.contact.firstName} {lead.contact.lastName} • {lead.contact.company}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">{getRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function GSEDashboard() {
  return (
    <div className="min-h-full bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Metrics */}
        <section>
          <MetricsRow />
        </section>

        {/* Pipeline Funnel and Hot Leads */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PipelineFunnel />
          </div>
          <div className="flex flex-col gap-6">
            <HotLeads />
            <StaleLeadsAlerts />
          </div>
        </section>

        {/* Activity Feed */}
        <section>
          <ActivityFeed />
        </section>
      </div>
    </div>
  );
}
