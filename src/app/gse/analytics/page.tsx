"use client";

import { useMemo } from "react";
import { useGSE } from "@/lib/gse/store";
import { STAGE_CONFIG, SERVICE_CONFIG, VERTICAL_CONFIG } from "@/lib/gse/types";
import type { PipelineStage, ServiceType, Vertical } from "@/lib/gse/types";

export default function AnalyticsPage() {
  const { leads, getPipelineMetrics, getRevenueMetrics } = useGSE();

  const pipelineMetrics = useMemo(() => getPipelineMetrics(), [getPipelineMetrics]);
  const revenueMetrics = useMemo(() => getRevenueMetrics(), [getRevenueMetrics]);

  // Revenue by Service breakdown
  const revenueByService = useMemo(() => {
    const breakdown: Record<ServiceType, number> = {
      "sovereign-ai": 0,
      "ai-readiness-360": 0,
      "transformation-management": 0,
      tedos: 0,
    };
    leads.forEach((lead) => {
      if (lead.stage !== "closed-lost") {
        breakdown[lead.service] += lead.dealValue;
      }
    });
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { breakdown, total };
  }, [leads]);

  // Revenue by Vertical breakdown
  const revenueByVertical = useMemo(() => {
    const breakdown: Record<Vertical, number> = {
      legal: 0,
      medical: 0,
      auto: 0,
      trades: 0,
      "property-management": 0,
      other: 0,
    };
    leads.forEach((lead) => {
      if (lead.stage !== "closed-lost") {
        breakdown[lead.vertical] += lead.dealValue;
      }
    });
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { breakdown, total };
  }, [leads]);

  // Deal velocity by stage
  const dealVelocity = useMemo(() => {
    const stages = Object.keys(STAGE_CONFIG) as PipelineStage[];
    return stages.map((stage) => {
      const stageLeads = leads.filter((l) => l.stage === stage);
      let avgDays = 0;
      if (stageLeads.length > 0) {
        const totalDays = stageLeads.reduce((sum, l) => {
          const created = new Date(l.createdAt).getTime();
          const now = new Date().getTime();
          return sum + Math.floor((now - created) / (1000 * 60 * 60 * 24));
        }, 0);
        avgDays = Math.round(totalDays / stageLeads.length);
      }
      return {
        stage,
        avgDays,
        count: stageLeads.length,
        value: stageLeads.reduce((sum, l) => sum + l.dealValue, 0),
      };
    });
  }, [leads]);

  // Win/Loss analysis
  const winLossAnalysis = useMemo(() => {
    const won = leads.filter((l) => l.stage === "closed-won");
    const lost = leads.filter((l) => l.stage === "closed-lost");
    const totalDecided = won.length + lost.length;
    return {
      wonCount: won.length,
      lostCount: lost.length,
      wonValue: won.reduce((sum, l) => sum + l.dealValue, 0),
      lostValue: lost.reduce((sum, l) => sum + l.dealValue, 0),
      conversionRate: totalDecided > 0 ? ((won.length / totalDecided) * 100).toFixed(1) : "0",
      avgDealSize: won.length > 0 ? (won.reduce((sum, l) => sum + l.dealValue, 0) / won.length).toFixed(0) : "0",
    };
  }, [leads]);

  // Pipeline by stage values for stacked bar
  const stageValues = useMemo(() => {
    const stages = Object.keys(STAGE_CONFIG) as PipelineStage[];
    return stages.map((stage) => ({
      stage,
      value: pipelineMetrics.stageBreakdown[stage].value,
    }));
  }, [pipelineMetrics]);

  const totalPipelineValue = stageValues.reduce((sum, s) => sum + s.value, 0);

  // Formatting helper
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Financial Intelligence</h1>
        <p className="text-slate-400 mt-2">Real-time pipeline analytics and revenue forecasting</p>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-medium">Monthly Recurring Revenue</div>
          <div className="text-3xl font-bold text-sky-400 mt-2">{formatCurrency(revenueMetrics.mrr)}</div>
          <div className="text-xs text-slate-500 mt-2">Current committed revenue</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-medium">Annual Recurring Revenue</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{formatCurrency(revenueMetrics.arr)}</div>
          <div className="text-xs text-slate-500 mt-2">MRR × 12 months</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-medium">Total SOW Revenue</div>
          <div className="text-3xl font-bold text-cyan-400 mt-2">{formatCurrency(revenueMetrics.sowRevenue)}</div>
          <div className="text-xs text-slate-500 mt-2">From closed-won deals</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-medium">Pipeline Coverage</div>
          <div className="text-3xl font-bold text-purple-400 mt-2">{revenueMetrics.pipelineCoverage.toFixed(1)}x</div>
          <div className="text-xs text-slate-500 mt-2">vs monthly target</div>
        </div>
      </div>

      {/* Pipeline Value by Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Pipeline Value by Stage</h2>
        <div className="space-y-4">
          <div className="flex h-12 rounded-lg overflow-hidden gap-1 bg-slate-800">
            {stageValues.map((stage) => {
              const percentage = totalPipelineValue > 0 ? (stage.value / totalPipelineValue) * 100 : 0;
              const config = STAGE_CONFIG[stage.stage];
              return (
                <div
                  key={stage.stage}
                  className="flex items-center justify-center transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color,
                    minWidth: percentage > 5 ? "auto" : "0",
                  }}
                  title={`${config.label}: ${formatCurrency(stage.value)}`}
                >
                  {percentage > 8 && (
                    <span className="text-xs font-bold text-slate-950">{percentage.toFixed(0)}%</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-6 gap-3">
            {stageValues.map((stage) => {
              const config = STAGE_CONFIG[stage.stage];
              return (
                <div key={stage.stage} className="text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: config.color }}></div>
                    <span className="text-slate-300">{config.label}</span>
                  </div>
                  <div className="text-slate-400 font-medium">{formatCurrency(stage.value)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue by Service & Vertical */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue by Service */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Revenue by Service</h2>
          <div className="space-y-3">
            {Object.entries(revenueByService.breakdown).map(([service, value]) => {
              const config = SERVICE_CONFIG[service as ServiceType];
              const percentage = revenueByService.total > 0 ? (value / revenueByService.total) * 100 : 0;
              return (
                <div key={service}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{config.icon}</span>
                      <span className="text-sm text-slate-300">{config.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-100">{formatCurrency(value)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: config.color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Total</span>
              <span className="text-sm font-bold text-slate-100">{formatCurrency(revenueByService.total)}</span>
            </div>
          </div>
        </div>

        {/* Revenue by Vertical */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Revenue by Vertical</h2>
          <div className="space-y-3">
            {Object.entries(revenueByVertical.breakdown)
              .filter(([_, value]) => value > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([vertical, value]) => {
                const config = VERTICAL_CONFIG[vertical as Vertical];
                const percentage = revenueByVertical.total > 0 ? (value / revenueByVertical.total) * 100 : 0;
                return (
                  <div key={vertical}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <span className="text-sm text-slate-300">{config.label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-100">{formatCurrency(value)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Total</span>
              <span className="text-sm font-bold text-slate-100">{formatCurrency(revenueByVertical.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Velocity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Deal Velocity by Stage</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Stage</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Avg Days</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Deals</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {dealVelocity.map((row) => {
                const config = STAGE_CONFIG[row.stage];
                const isSlowing = row.avgDays > 14;
                return (
                  <tr
                    key={row.stage}
                    className={`border-b border-slate-800 ${isSlowing ? "bg-amber-500/10" : ""}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <span className="text-slate-300">{config.label}</span>
                      </div>
                    </td>
                    <td className={`text-right py-3 px-4 font-medium ${isSlowing ? "text-amber-400" : "text-slate-100"}`}>
                      {row.avgDays}d
                      {isSlowing && <span className="text-xs ml-2">⚠️</span>}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">{row.count}</td>
                    <td className="text-right py-3 px-4 text-sky-400 font-medium">{formatCurrency(row.value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Win/Loss Analysis */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Win/Loss Summary</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Won Deals</span>
                <span className="text-2xl font-bold text-emerald-400">{winLossAnalysis.wonCount}</span>
              </div>
              <div className="text-xs text-slate-500">{formatCurrency(winLossAnalysis.wonValue)} in revenue</div>
            </div>
            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Lost Deals</span>
                <span className="text-2xl font-bold text-red-400">{winLossAnalysis.lostCount}</span>
              </div>
              <div className="text-xs text-slate-500">{formatCurrency(winLossAnalysis.lostValue)} in lost value</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Conversion Rate</h2>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-6xl font-bold text-sky-400">{winLossAnalysis.conversionRate}%</div>
            <div className="text-sm text-slate-400 mt-4">Of all decided deals</div>
            <div className="mt-6 p-3 bg-slate-800 rounded text-xs text-slate-300 text-center">
              {winLossAnalysis.wonCount} won, {winLossAnalysis.lostCount} lost
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Average Deal Size</h2>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-4xl font-bold text-cyan-400">{formatCurrency(parseFloat(winLossAnalysis.avgDealSize))}</div>
            <div className="text-sm text-slate-400 mt-4">Per closed-won deal</div>
            <div className="mt-6 text-xs text-slate-500 text-center">
              Based on {winLossAnalysis.wonCount} {winLossAnalysis.wonCount === 1 ? "deal" : "deals"}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Target Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-100">Monthly Target Tracker</h2>
          <div className="text-sm text-slate-400">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Closed This Month</span>
                <span className="text-sm font-bold text-sky-400">{formatCurrency(revenueMetrics.closedThisMonth)}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (revenueMetrics.closedThisMonth / revenueMetrics.targetThisMonth) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <div className="text-xs text-slate-400 mb-1">Target</div>
              <div className="text-lg font-bold text-slate-100">{formatCurrency(revenueMetrics.targetThisMonth)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Progress</div>
              <div className="text-lg font-bold text-slate-100">
                {((revenueMetrics.closedThisMonth / revenueMetrics.targetThisMonth) * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Remaining</div>
              <div className="text-lg font-bold text-amber-400">
                {formatCurrency(Math.max(0, revenueMetrics.targetThisMonth - revenueMetrics.closedThisMonth))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
