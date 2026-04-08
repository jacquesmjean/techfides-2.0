"use client";

import React, { useState, useMemo } from "react";
import { useGSE } from "@/lib/gse/store";
import type { SalesGoal, ForecastPoint } from "@/lib/gse/types";
import { SEED_SALES_GOALS, SEED_QUARTERLY_FORECAST, SEED_MONTHLY_FORECAST } from "@/lib/gse/data";

// ============================================================
// REVENUE FORECAST CHART (SVG Bar + Line)
// ============================================================
function RevenueChart({ data, maxValue }: { data: ForecastPoint[]; maxValue: number }) {
  const padding = { top: 40, right: 20, bottom: 60, left: 80 };
  const chartWidth = 1200;
  const chartHeight = 400;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const barWidth = innerWidth / data.length * 0.6;
  const barSpacing = innerWidth / data.length;

  // Grid lines
  const gridLines = [0, 50000, 100000, 150000, 200000];

  // Projected line points
  const projectedPoints = data.map((d, i) => {
    const x = padding.left + i * barSpacing + barSpacing / 2;
    const y = padding.top + innerHeight - (d.projected / maxValue) * innerHeight;
    return `${x},${y}`;
  });

  const getBarColor = (actual: number, target: number) => {
    if (actual === 0) return "#64748b"; // gray for no data
    if (actual >= target) return "#22c55e"; // green
    return "#f59e0b"; // amber
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">Revenue Forecast</h3>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ maxHeight: "450px" }}>
        <defs>
          <linearGradient id="projectedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map((value) => {
          const y = padding.top + innerHeight - (value / maxValue) * innerHeight;
          return (
            <g key={`grid-${value}`}>
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#475569" strokeDasharray="4,4" strokeWidth="1" />
              <text x={padding.left - 10} y={y + 5} textAnchor="end" className="text-xs fill-slate-500">
                ${(value / 1000).toFixed(0)}K
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding.left + i * barSpacing + barSpacing / 2 - barWidth / 2;

          // Target bar (outline, semi-transparent)
          const targetHeight = (d.target / maxValue) * innerHeight;
          const targetY = padding.top + innerHeight - targetHeight;

          // Actual bar
          const actualHeight = (d.actual / maxValue) * innerHeight;
          const actualY = padding.top + innerHeight - actualHeight;

          // Projected bar
          const projectedHeight = (d.projected / maxValue) * innerHeight;
          const projectedY = padding.top + innerHeight - projectedHeight;

          return (
            <g key={`bar-group-${i}`}>
              {/* Target bar outline */}
              <rect
                x={x - 5}
                y={targetY}
                width={barWidth}
                height={targetHeight}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                rx="4"
                opacity="0.5"
              />

              {/* Actual bar (if > 0) */}
              {d.actual > 0 && (
                <rect
                  x={x + barWidth / 3 - 3}
                  y={actualY}
                  width={barWidth / 3 + 2}
                  height={actualHeight}
                  fill={getBarColor(d.actual, d.target)}
                  rx="4"
                  className="transition-all duration-300 hover:opacity-90"
                  style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.3))" }}
                />
              )}

              {/* Projected bar */}
              <rect
                x={x - barWidth / 3 - 1}
                y={projectedY}
                width={barWidth / 3 + 2}
                height={projectedHeight}
                fill="url(#projectedGradient)"
                stroke="#0ea5e9"
                strokeWidth="1"
                rx="4"
                className="transition-all duration-300 hover:opacity-90"
              />

              {/* Label */}
              <text x={x + barWidth / 2} y={padding.top + innerHeight + 20} textAnchor="middle" className="text-xs fill-slate-400">
                {d.label}
              </text>

              {/* Hover values (hidden by default) */}
              <g className="group">
                <rect x={x - 40} y={actualY - 40} width="80" height="50" fill="#1e293b" rx="4" opacity="0" className="group-hover:opacity-100 transition-opacity" />
                <text x={x + barWidth / 2} y={actualY - 20} textAnchor="middle" className="text-xs fill-slate-200 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  ${(d.actual / 1000).toFixed(0)}K
                </text>
                <text x={x + barWidth / 2} y={actualY - 8} textAnchor="middle" className="text-xs fill-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${(d.projected / 1000).toFixed(0)}K proj
                </text>
              </g>
            </g>
          );
        })}

        {/* Projected trend line */}
        <polyline
          points={projectedPoints.join(" ")}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
          opacity="0.8"
          filter="url(#glow)"
          className="transition-opacity duration-300"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Y-axis */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerHeight} stroke="#64748b" strokeWidth="2" />

        {/* X-axis */}
        <line x1={padding.left} y1={padding.top + innerHeight} x2={chartWidth - padding.right} y2={padding.top + innerHeight} stroke="#64748b" strokeWidth="2" />
      </svg>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 rounded bg-slate-500 opacity-50" />
          <span className="text-slate-400">Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 rounded bg-green-500" />
          <span className="text-slate-400">Actual (On Track)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 rounded bg-amber-500" />
          <span className="text-slate-400">Actual (Behind)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 rounded bg-blue-500" />
          <span className="text-slate-400">Projected</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS RING (SVG Circle)
// ============================================================
function ProgressRing({ goal }: { goal: SalesGoal }) {
  const percentage = Math.min((goal.actual / goal.target) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;

  let ringColor = "#ef4444"; // red < 50%
  if (percentage >= 50 && percentage < 75) ringColor = "#f59e0b"; // amber
  if (percentage >= 75) ringColor = "#22c55e"; // green

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
      <h4 className="mb-4 text-sm font-semibold text-slate-200">{goal.label}</h4>
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" opacity="0.3" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
            style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.4))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold" style={{ color: ringColor }}>
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-slate-500">achieved</div>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">Target:</span>
          <span className="font-semibold">${(goal.target / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Actual:</span>
          <span className="font-semibold text-green-400">${(goal.actual / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Pipeline:</span>
          <span className="font-semibold text-blue-400">${(goal.pipelineValue / 1000).toFixed(0)}K</span>
        </div>
        <div className="mt-3 border-t border-slate-700 pt-2 flex justify-between">
          <span className="text-slate-500">Deals Closed:</span>
          <span className="font-semibold">{goal.deals}</span>
        </div>
      </div>

      {/* Pipeline coverage */}
      {goal.pipelineValue > 0 && (
        <div className="mt-4 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          <span className="text-slate-500">Coverage:</span> {((goal.pipelineValue / (goal.target - goal.actual)) * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}

// ============================================================
// GOAL SIMULATOR
// ============================================================
function GoalSimulator({ annualTarget }: { annualTarget: number }) {
  const [dealsPerMonth, setDealsPerMonth] = useState(3);
  const [avgDealSize, setAvgDealSize] = useState(10000);
  const [closeRate, setCloseRate] = useState(40);

  const simulated = useMemo(() => {
    const monthly = dealsPerMonth * avgDealSize * (closeRate / 100);
    const quarterly = monthly * 3;
    const annual = monthly * 12;
    return { monthly, quarterly, annual };
  }, [dealsPerMonth, avgDealSize, closeRate]);

  const gap = annualTarget - simulated.annual;
  const isOnTrack = simulated.annual >= annualTarget * 0.9;
  const isBehind = simulated.annual < annualTarget * 0.7;

  const getStatus = () => {
    if (isOnTrack) return { label: "On Track", color: "#22c55e", icon: "🟢" };
    if (isBehind) return { label: "Behind Target", color: "#ef4444", icon: "🔴" };
    return { label: "At Risk", color: "#f59e0b", icon: "🟡" };
  };

  const status = getStatus();

  const getRecommendations = () => {
    if (isOnTrack) {
      return ["Maintain current pace.", "Consider expanding to new vertical.", "Document winning strategies for team."];
    }
    if (isBehind) {
      const dealShortfall = Math.ceil((gap / avgDealSize / (closeRate / 100)) / 12);
      const dealSizeIncrease = Math.ceil(gap / dealsPerMonth / 12 / (closeRate / 100));
      return [
        `Increase outreach by ${dealShortfall} deals/month.`,
        `Raise avg deal size by $${dealSizeIncrease.toLocaleString()}.`,
        "Improve close rate by focusing on qualification.",
      ];
    }
    return [
      `Need ${Math.ceil((gap / (avgDealSize * (closeRate / 100))) / 12)} more deals/month.`,
      "Review pipeline quality and close rate.",
    ];
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-6 text-lg font-semibold text-slate-100">Goal Simulator</h3>

      {/* Sliders */}
      <div className="space-y-6">
        {/* Deals per month */}
        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-sm font-medium text-slate-300">New Deals Per Month</label>
            <span className="text-lg font-bold text-blue-400">{dealsPerMonth}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={dealsPerMonth}
            onChange={(e) => setDealsPerMonth(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Average deal size */}
        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-sm font-medium text-slate-300">Average Deal Size</label>
            <span className="text-lg font-bold text-green-400">${(avgDealSize / 1000).toFixed(0)}K</span>
          </div>
          <input
            type="range"
            min="5000"
            max="20000"
            step="1000"
            value={avgDealSize}
            onChange={(e) => setAvgDealSize(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-green-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>$5K</span>
            <span>$20K</span>
          </div>
        </div>

        {/* Close rate */}
        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-sm font-medium text-slate-300">Close Rate</label>
            <span className="text-lg font-bold text-amber-400">{closeRate}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={closeRate}
            onChange={(e) => setCloseRate(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>10%</span>
            <span>80%</span>
          </div>
        </div>
      </div>

      {/* Projected results */}
      <div className="mt-8 rounded-lg bg-slate-800 p-4">
        <h4 className="mb-4 font-semibold text-slate-200">Projected Revenue</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-slate-500">Monthly</div>
            <div className="text-2xl font-bold text-slate-100">${(simulated.monthly / 1000).toFixed(0)}K</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Quarterly</div>
            <div className="text-2xl font-bold text-slate-100">${(simulated.quarterly / 1000).toFixed(0)}K</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Annual</div>
            <div className="text-2xl font-bold text-blue-400">${(simulated.annual / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>

      {/* Comparison chart */}
      <div className="mt-6">
        <h4 className="mb-3 text-sm font-semibold text-slate-300">Pace Comparison</h4>
        <svg viewBox="0 0 400 100" className="w-full">
          <defs>
            <linearGradient id="currentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="simulatedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={status.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={status.color} stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="targetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Target bar */}
          <rect x="20" y="50" width="350" height="20" fill="url(#targetGradient)" rx="3" />
          <text x="10" y="62" textAnchor="end" className="text-xs fill-slate-400">
            Target
          </text>

          {/* Simulated bar */}
          <rect x="20" y="80" width={Math.min(350 * (simulated.annual / annualTarget), 350)} height="20" fill={status.color} opacity="0.7" rx="3" />
          <text x="10" y="92" textAnchor="end" className="text-xs fill-slate-400">
            Simulated
          </text>
        </svg>
      </div>

      {/* Status */}
      <div className="mt-6 rounded-lg border p-4" style={{ backgroundImage: `linear-gradient(135deg, ${status.color}22, ${status.color}11)`, borderColor: status.color }}>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">{status.icon}</span>
          <h4 className="text-lg font-semibold text-slate-100">{status.label}</h4>
        </div>

        {gap !== 0 && (
          <p className="mb-3 text-sm text-slate-300">
            <span style={{ color: status.color }} className="font-semibold">
              {gap > 0 ? `$${Math.abs(gap / 1000).toFixed(0)}K short` : `$${Math.abs(gap / 1000).toFixed(0)}K ahead`}
            </span>
            {" of target"}
          </p>
        )}

        <div className="space-y-2">
          {getRecommendations().map((rec, i) => (
            <p key={i} className="text-xs text-slate-400">
              • {rec}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESULTS TABLE
// ============================================================
function ResultsTable({ goals }: { goals: SalesGoal[] }) {
  const sortedGoals = [...goals].sort((a, b) => {
    const percentA = Math.min((a.actual / a.target) * 100, 100);
    const percentB = Math.min((b.actual / b.target) * 100, 100);
    return percentA - percentB; // worst first
  });

  const getStatus = (percentage: number) => {
    if (percentage < 25) return { label: "Critical", color: "#ef4444", bg: "#7f1d1d" };
    if (percentage < 50) return { label: "Behind", color: "#f59e0b", bg: "#78350f" };
    if (percentage < 75) return { label: "On Track", color: "#f59e0b", bg: "#78350f" };
    return { label: "Ahead", color: "#22c55e", bg: "#14532d" };
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Goal</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Level</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Period</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-300">Target</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-300">Actual</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-300">%</th>
              <th className="px-6 py-3 text-center font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedGoals.map((goal) => {
              const percentage = Math.min((goal.actual / goal.target) * 100, 100);
              const statusInfo = getStatus(percentage);
              const isCritical = percentage < 25;

              return (
                <tr
                  key={goal.id}
                  className={`border-b border-slate-800 transition-colors ${isCritical ? "bg-red-950 bg-opacity-20" : "hover:bg-slate-800"}`}
                >
                  <td className="px-6 py-4 text-slate-200">
                    <div className="font-medium">{goal.label}</div>
                    <div className="text-xs text-slate-500">{goal.assignedTo}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 capitalize">{goal.level}</td>
                  <td className="px-6 py-4 text-slate-400">{goal.periodLabel}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-200">${(goal.target / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-400">${(goal.actual / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-200">{Math.round(percentage)}%</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function ForecastPage() {
  const [viewMode, setViewMode] = useState<"yearly" | "quarterly" | "monthly">("quarterly");

  // Use seed data
  const allGoals = SEED_SALES_GOALS;
  const quarterlyForecast = SEED_QUARTERLY_FORECAST;
  const monthlyForecast = SEED_MONTHLY_FORECAST;

  const forecastData = viewMode === "quarterly" ? quarterlyForecast : monthlyForecast;
  const maxForecastValue = Math.max(...forecastData.map((d) => Math.max(d.target, d.projected, d.actual))) * 1.15;

  // KPI calculations
  const annualGoal = allGoals.find((g) => g.period === "yearly");
  const annualTarget = annualGoal?.target || 500000;
  const ytdClosed = allGoals
    .filter((g) => (g.period === "quarterly" || g.period === "monthly") && g.level === "organization")
    .reduce((sum, g) => sum + g.actual, 0);

  const projectedYearEnd = forecastData.reduce((sum, d) => sum + d.projected, 0);
  const gapToTarget = annualTarget - projectedYearEnd;

  return (
    <div className="space-y-6 bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Sales Forecast & Goals</h1>
        <p className="mt-1 text-slate-400">Plan. Track. Win.</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {(["yearly", "quarterly", "monthly"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === mode ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Annual Target */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">Annual Target</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">${(annualTarget / 1000).toFixed(0)}K</p>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: "100%" }} />
          </div>
        </div>

        {/* YTD Closed */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">YTD Closed</p>
          <p className="mt-2 text-3xl font-bold text-green-400">${(ytdClosed / 1000).toFixed(0)}K</p>
          <p className="mt-2 text-xs text-slate-500">{((ytdClosed / annualTarget) * 100).toFixed(1)}% of annual</p>
        </div>

        {/* Projected Year-End */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">Projected Year-End</p>
          <p className="mt-2 text-3xl font-bold text-blue-400">${(projectedYearEnd / 1000).toFixed(0)}K</p>
          <p className="mt-2 text-xs text-slate-500">{((projectedYearEnd / annualTarget) * 100).toFixed(1)}% of target</p>
        </div>

        {/* Gap to Target */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">Gap to Target</p>
          <p className={`mt-2 text-3xl font-bold ${gapToTarget <= 0 ? "text-green-400" : "text-red-400"}`}>
            {gapToTarget > 0 ? "-" : "+"}${Math.abs(gapToTarget / 1000).toFixed(0)}K
          </p>
          <p className="mt-2 text-xs text-slate-500">{gapToTarget > 0 ? "Need to close" : "Ahead of"} target</p>
        </div>
      </div>

      {/* Main content - Chart + Goals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart data={forecastData} maxValue={maxForecastValue} />
        </div>

        {/* Goals tabs take 1 column */}
        <div className="flex flex-col gap-6">
          <GoalSimulator annualTarget={annualTarget} />
        </div>
      </div>

      {/* Goals Section with Tabs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Goals & Progress</h2>

        {/* Organization goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-300">Organization</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allGoals
              .filter((g) => g.level === "organization")
              .slice(0, 3)
              .map((goal) => (
                <ProgressRing key={goal.id} goal={goal} />
              ))}
          </div>
        </div>

        {/* Team goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-300">Team</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allGoals
              .filter((g) => g.level === "team")
              .map((goal) => (
                <ProgressRing key={goal.id} goal={goal} />
              ))}
          </div>
        </div>

        {/* Individual goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-300">Individual</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allGoals
              .filter((g) => g.level === "individual")
              .map((goal) => (
                <ProgressRing key={goal.id} goal={goal} />
              ))}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">All Goals Summary</h2>
        <ResultsTable goals={allGoals} />
      </div>
    </div>
  );
}
