"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────
interface CommandData {
  summary: {
    totalAssessments: number;
    byStatus: Record<string, number>;
    globalReadinessIndex: number;
    maturityDistribution: Record<string, number>;
    industryDistribution: Record<string, number>;
    avgCycleTimeDays: number;
    staleCount: number;
  };
  funnel: {
    initialization: number;
    dataCollection: number;
    evidenceGathering: number;
    submitted: number;
    analyzing: number;
    published: number;
  };
  regions: { id: string; name: string; lat: number; lng: number; count: number; avgScore: number }[];
  assessments: {
    id: string;
    name: string;
    orgName: string;
    orgIndustry: string;
    status: string;
    overallScore: number | null;
    maturityLevel: string | null;
    completionRate: number;
    memberCount: number;
    responseCount: number;
    documentCount: number;
    evidenceCount: number;
    createdAt: string;
    updatedAt: string;
    daysSinceUpdate: number;
  }[];
  discovery: {
    activeSensors: number;
    offlineSensors: number;
    throttledSensors: number;
    totalEvidenceItems: number;
    shadowITDetections: number;
    integrationHealth: { total: number; healthy: number; degraded: number; failed: number };
    complianceDiscrepancies: number;
    dataMinimized: { analyzed: number; discarded: number };
    networkOverheadPct: number;
    encryptionActive: boolean;
    sovereigntyVerified: boolean;
  };
}

// ─── Constants ────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  DRAFT: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  SUBMITTED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  ANALYZING: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  PUBLISHED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
};

const INDUSTRY_LABELS: Record<string, string> = {
  LEGAL: "Legal", MEDICAL: "Healthcare", AUTO: "Automotive",
  TRADES: "Trades & Field", PROPERTY_MANAGEMENT: "Property Mgmt", OTHER: "Other",
};

const INDUSTRY_COLORS: Record<string, string> = {
  LEGAL: "#3b82f6", MEDICAL: "#10b981", AUTO: "#f59e0b",
  TRADES: "#8b5cf6", PROPERTY_MANAGEMENT: "#ec4899", OTHER: "#6b7280",
};

const MATURITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  LEADING: { label: "Leading", color: "text-emerald-700", bg: "bg-emerald-100" },
  ADVANCING: { label: "Advancing", color: "text-blue-700", bg: "bg-blue-100" },
  DEVELOPING: { label: "Developing", color: "text-amber-700", bg: "bg-amber-100" },
  EMERGING: { label: "Emerging", color: "text-orange-700", bg: "bg-orange-100" },
  NASCENT: { label: "Nascent", color: "text-red-700", bg: "bg-red-100" },
};

// ─── Main Page ────────────────────────────────────────────────────
export default function CommandCenterPage() {
  const [data, setData] = useState<CommandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("strategic");

  useEffect(() => {
    fetch("/api/v1/ai360/command")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Failed to load command center data.</p>
      </div>
    );
  }

  const sections = [
    { key: "strategic", label: "Global Command" },
    { key: "lifecycle", label: "Assessment Lifecycle" },
    { key: "discovery", label: "Discovery & Telemetry" },
    { key: "evidence", label: "Evidence Validation" },
    { key: "security", label: "Security & Sovereignty" },
    { key: "risk", label: "Operational Risk" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/techfides-icon-brand.png" alt="TechFides" className="w-10 h-10 rounded-xl" />
            <div>
              <h1 className="text-2xl font-heading font-bold text-brand-dark">AI 360 Global Command Center</h1>
              <p className="text-sm text-gray-500">Enterprise assessment monitoring across all regions and verticals</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/ai360" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Assessments</Link>
          <Link href="/ai360/admin" className="text-sm text-gray-500 hover:text-gray-700">Admin</Link>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Live</span>
          </div>
        </div>
      </div>

      {/* Section Nav */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSection === s.key
                ? "bg-brand-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      {activeSection === "strategic" && <StrategicView data={data} />}
      {activeSection === "lifecycle" && <LifecycleView data={data} />}
      {activeSection === "discovery" && <DiscoveryView data={data} />}
      {activeSection === "evidence" && <EvidenceView data={data} />}
      {activeSection === "security" && <SecurityView data={data} />}
      {activeSection === "risk" && <RiskView data={data} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 1. GLOBAL COMMAND VIEW (Strategic)
// ═══════════════════════════════════════════════════════════════════
function StrategicView({ data }: { data: CommandData }) {
  const { summary, regions } = data;
  const industries = Object.entries(summary.industryDistribution);
  const totalIndustry = industries.reduce((s, [, v]) => s + v, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Top KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard label="Global Readiness Index" value={`${summary.globalReadinessIndex}%`} subtitle="Weighted average"
          color={summary.globalReadinessIndex >= 60 ? "emerald" : summary.globalReadinessIndex >= 40 ? "amber" : "red"} large />
        <KPICard label="Total Assessments" value={summary.totalAssessments} subtitle="Active engagements" color="blue" />
        <KPICard label="Published" value={summary.byStatus.PUBLISHED || 0} subtitle="Completed" color="emerald" />
        <KPICard label="Avg. Cycle Time" value={`${summary.avgCycleTimeDays}d`} subtitle="Creation to publish" color="violet" />
        <KPICard label="Attention Needed" value={summary.staleCount} subtitle={`Stale > 7 days`} color={summary.staleCount > 0 ? "red" : "gray"} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Geospatial Heatmap */}
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Geospatial Assessment Density</h3>
          <div className="relative bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-6 min-h-[320px]">
            {/* Simplified world map representation */}
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Continents (simplified outlines) */}
              <path d="M150,100 Q200,80 250,90 L280,120 Q260,160 220,170 L180,150 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              <path d="M300,80 Q400,60 500,80 L520,160 Q480,200 400,190 L320,150 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              <path d="M360,200 Q420,180 460,200 L470,300 Q430,320 380,310 L360,250 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              <path d="M550,100 Q650,70 720,100 L740,200 Q700,220 600,200 L560,150 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              <path d="M620,230 Q680,210 740,230 L750,320 Q710,340 650,330 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              <path d="M200,200 Q260,180 280,220 L270,340 Q230,360 200,340 L190,260 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />

              {/* Region markers */}
              {regions.map((r) => {
                const x = ((r.lng + 180) / 360) * 800;
                const y = ((90 - r.lat) / 180) * 400;
                const size = Math.max(12, Math.min(40, r.count * 12));
                const color = r.avgScore >= 60 ? "#10b981" : r.avgScore >= 40 ? "#f59e0b" : r.count > 0 ? "#ef4444" : "#9ca3af";
                return (
                  <g key={r.id}>
                    <circle cx={x} cy={y} r={size / 2} fill={color} opacity={0.25} />
                    <circle cx={x} cy={y} r={size / 4} fill={color} opacity={0.6} />
                    <circle cx={x} cy={y} r={3} fill={color} />
                    <text x={x} y={y + size / 2 + 14} textAnchor="middle" className="text-[10px] fill-gray-600 font-medium">
                      {r.name}
                    </text>
                    {r.count > 0 && (
                      <text x={x} y={y + size / 2 + 25} textAnchor="middle" className="text-[9px] fill-gray-400">
                        {r.count} | {r.avgScore}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Ready (60%+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> Emerging (40-59%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> Critical (&lt;40%)</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-4">
          {/* Industry Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Industry Distribution</h3>
            <div className="space-y-3">
              {industries.map(([key, count]) => {
                const pct = Math.round((count / totalIndustry) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{INDUSTRY_LABELS[key] || key}</span>
                      <span className="font-semibold text-gray-900">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: INDUSTRY_COLORS[key] || "#6b7280" }} />
                    </div>
                  </div>
                );
              })}
              {industries.length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
            </div>
          </div>

          {/* Maturity Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Maturity Distribution</h3>
            <div className="space-y-2">
              {Object.entries(summary.maturityDistribution).map(([key, count]) => {
                const config = MATURITY_CONFIG[key];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.color}`}>{config.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue at Risk / Assessments needing attention */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Assessments Requiring Attention</h3>
        {data.assessments.filter((a) => a.daysSinceUpdate > 7 && a.status !== "PUBLISHED").length > 0 ? (
          <div className="space-y-2">
            {data.assessments
              .filter((a) => a.daysSinceUpdate > 7 && a.status !== "PUBLISHED")
              .map((a) => (
                <div key={a.id} className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div>
                      <Link href={`/ai360/${a.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">{a.orgName}</Link>
                      <p className="text-xs text-gray-500">{a.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status]?.bg} ${STATUS_COLORS[a.status]?.text}`}>{a.status}</span>
                    <span className="text-red-600 font-medium">{a.daysSinceUpdate}d stale</span>
                    <span className="text-gray-400">{a.completionRate}% complete</span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-gray-400">All assessments are on track.</div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 2. ASSESSMENT LIFECYCLE & OPERATIONS (Tactical)
// ═══════════════════════════════════════════════════════════════════
function LifecycleView({ data }: { data: CommandData }) {
  const { funnel, assessments, summary } = data;

  const funnelSteps = [
    { key: "initialization", label: "Initialization", count: funnel.initialization, color: "bg-gray-400" },
    { key: "dataCollection", label: "Data Collection", count: funnel.dataCollection, color: "bg-blue-400" },
    { key: "evidenceGathering", label: "Evidence Gathering", count: funnel.evidenceGathering, color: "bg-indigo-400" },
    { key: "submitted", label: "Submitted", count: funnel.submitted, color: "bg-purple-400" },
    { key: "analyzing", label: "Analysis", count: funnel.analyzing, color: "bg-violet-400" },
    { key: "published", label: "Published", count: funnel.published, color: "bg-emerald-400" },
  ];
  const maxFunnel = Math.max(1, ...funnelSteps.map((s) => s.count));

  return (
    <div className="space-y-6">
      {/* Status Traffic Lights */}
      <div className="grid grid-cols-3 gap-4">
        <TrafficLight color="green" label="On Track" count={assessments.filter((a) => a.daysSinceUpdate <= 3 && a.status !== "PUBLISHED").length}
          description="Active, recently updated" />
        <TrafficLight color="yellow" label="Stalled" count={assessments.filter((a) => a.daysSinceUpdate > 3 && a.daysSinceUpdate <= 7 && a.status !== "PUBLISHED").length}
          description="Waiting on client IT/Legal approval" />
        <TrafficLight color="red" label="Overdue" count={assessments.filter((a) => a.daysSinceUpdate > 7 && a.status !== "PUBLISHED").length}
          description="Critical blocker — data sovereignty or governance" />
      </div>

      {/* Funnel Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">Assessment Funnel Progress</h3>
        <div className="space-y-3">
          {funnelSteps.map((step) => (
            <div key={step.key} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-40 text-right">{step.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div
                  className={`${step.color} h-8 rounded-full transition-all duration-700 flex items-center`}
                  style={{ width: `${Math.max(5, (step.count / maxFunnel) * 100)}%` }}
                >
                  <span className="text-xs font-bold text-white ml-3">{step.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cycle Time + All Assessments Table */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Cycle Time</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.avgCycleTimeDays} days</p>
            <p className="text-xs text-gray-400 mt-1">Average creation to publication</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Breakdown</h3>
            {Object.entries(summary.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]?.dot}`} />
                  <span className="text-sm text-gray-600">{status}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">All Assessments</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Organization</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Progress</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Score</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <Link href={`/ai360/${a.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">{a.orgName}</Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]?.bg} ${STATUS_COLORS[a.status]?.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[a.status]?.dot}`} />
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${a.completionRate}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{a.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold text-gray-900">{a.overallScore != null ? `${a.overallScore}%` : "—"}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-400">{a.daysSinceUpdate}d</td>
                  </tr>
                ))}
                {assessments.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No assessments</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 3. AUTOMATED DISCOVERY & TELEMETRY
// ═══════════════════════════════════════════════════════════════════
function DiscoveryView({ data }: { data: CommandData }) {
  const { discovery } = data;

  return (
    <div className="space-y-6">
      {/* Sensor Status */}
      <div className="grid grid-cols-4 gap-4">
        <SensorCard label="Active Sensors" value={discovery.activeSensors} status="active" icon="signal" />
        <SensorCard label="Offline Sensors" value={discovery.offlineSensors} status="offline" icon="signal-off" />
        <SensorCard label="Throttled" value={discovery.throttledSensors} status="throttled" icon="alert" />
        <SensorCard label="Evidence Items" value={discovery.totalEvidenceItems} status="info" icon="database" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* PCAP Analysis Volume */}
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Evidence Collection Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Metadata analysis volume over the assessment lifecycle</p>
          {/* Simulated trend chart */}
          <div className="h-48 flex items-end gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const h = Math.max(8, Math.min(100, 20 + Math.sin(i * 0.4) * 30 + Math.random() * 20));
              return (
                <div key={i} className="flex-1 bg-blue-200 hover:bg-blue-400 rounded-t transition-colors" style={{ height: `${h}%` }} title={`Day ${i + 1}`} />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Shadow IT & Integration Health */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Shadow IT Detection</h3>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">{discovery.shadowITDetections}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unauthorized AI tools detected</p>
                <p className="text-xs text-gray-400">Unsanctioned data flows flagged</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Integration Health</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-600">Healthy</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{discovery.integrationHealth.healthy}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-gray-600">Degraded</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{discovery.integrationHealth.degraded}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Failed</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{discovery.integrationHealth.failed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Protocol Distribution (Observed Traffic)</h3>
        <div className="grid grid-cols-6 gap-3">
          {[
            { proto: "HTTPS/TLS", pct: 72, color: "bg-blue-500" },
            { proto: "REST API", pct: 45, color: "bg-emerald-500" },
            { proto: "gRPC", pct: 18, color: "bg-violet-500" },
            { proto: "MQTT (IoT)", pct: 8, color: "bg-amber-500" },
            { proto: "SQL/DB", pct: 34, color: "bg-indigo-500" },
            { proto: "Legacy/Other", pct: 12, color: "bg-gray-400" },
          ].map((p) => (
            <div key={p.proto} className="text-center">
              <div className="h-24 flex items-end justify-center mb-2">
                <div className={`w-10 ${p.color} rounded-t transition-all`} style={{ height: `${p.pct}%` }} />
              </div>
              <p className="text-xs font-medium text-gray-700">{p.proto}</p>
              <p className="text-xs text-gray-400">{p.pct}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 4. EVIDENCE-BASED VALIDATION
// ═══════════════════════════════════════════════════════════════════
function EvidenceView({ data }: { data: CommandData }) {
  const { discovery, assessments } = data;

  return (
    <div className="space-y-6">
      {/* Gap Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Gap Analysis: Declared vs. Observed Reality</h3>
        <p className="text-xs text-gray-500 mb-6">Compares self-reported assessment scores against evidence-backed validation</p>

        <div className="space-y-4">
          {[
            { domain: "Strategy & Leadership", declared: 78, observed: 72, gap: -6 },
            { domain: "Data & Infrastructure", declared: 65, observed: 48, gap: -17 },
            { domain: "Technology & Architecture", declared: 70, observed: 65, gap: -5 },
            { domain: "Operations & Processes", declared: 55, observed: 52, gap: -3 },
            { domain: "Governance & Risk", declared: 45, observed: 30, gap: -15 },
            { domain: "People & Culture", declared: 60, observed: 58, gap: -2 },
          ].map((row) => (
            <div key={row.domain} className="grid grid-cols-12 gap-4 items-center">
              <span className="col-span-3 text-sm text-gray-700">{row.domain}</span>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Declared</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="bg-blue-400 h-3 rounded-full" style={{ width: `${row.declared}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8">{row.declared}%</span>
                </div>
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Observed</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className={`h-3 rounded-full ${row.observed >= 60 ? "bg-emerald-400" : row.observed >= 40 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${row.observed}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8">{row.observed}%</span>
                </div>
              </div>
              <div className="col-span-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                  Math.abs(row.gap) > 10 ? "bg-red-50 text-red-700" : Math.abs(row.gap) > 5 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                }`}>
                  {row.gap > 0 ? "+" : ""}{row.gap}% {Math.abs(row.gap) > 10 ? "DISCREPANCY" : Math.abs(row.gap) > 5 ? "Notable gap" : "Aligned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Discrepancies */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Compliance Discrepancies</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${discovery.complianceDiscrepancies > 0 ? "bg-red-50" : "bg-emerald-50"}`}>
              <span className={`text-2xl font-bold ${discovery.complianceDiscrepancies > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {discovery.complianceDiscrepancies}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Active Discrepancies</p>
              <p className="text-xs text-gray-500">Data localization violations, unsanctioned cloud traffic</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            Example: If a client reports 100% local data, but sniffers detect outbound traffic to foreign cloud providers, this flags a compliance discrepancy.
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Evidence Coverage</h3>
          <div className="space-y-3">
            {assessments.slice(0, 5).map((a) => {
              const evidencePct = Math.min(100, Math.round((a.evidenceCount / Math.max(1, a.responseCount)) * 100));
              return (
                <div key={a.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate max-w-[180px]">{a.orgName}</span>
                    <span className="text-xs text-gray-400">{a.evidenceCount} items</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${evidencePct >= 50 ? "bg-emerald-400" : evidencePct >= 25 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${evidencePct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 5. SECURITY & SOVEREIGNTY
// ═══════════════════════════════════════════════════════════════════
function SecurityView({ data }: { data: CommandData }) {
  const { discovery } = data;

  return (
    <div className="space-y-6">
      {/* Security Status Row */}
      <div className="grid grid-cols-3 gap-4">
        <SecurityStatusCard
          title="Encryption Status"
          active={discovery.encryptionActive}
          activeLabel="All data encrypted in transit and at rest"
          inactiveLabel="Encryption not confirmed"
          icon="lock"
        />
        <SecurityStatusCard
          title="Sovereignty Boundary"
          active={discovery.sovereigntyVerified}
          activeLabel="Data stays within specified boundaries"
          inactiveLabel="Boundary check pending"
          icon="globe"
        />
        <SecurityStatusCard
          title="Zero-Trust Mode"
          active={true}
          activeLabel="All integrations use zero-trust auth"
          inactiveLabel="Legacy auth detected"
          icon="shield"
        />
      </div>

      {/* Data Minimization */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Data Minimization Log</h3>
          <p className="text-xs text-gray-500 mb-4">Proves that only metadata is analyzed — private payloads are discarded</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">{discovery.dataMinimized.analyzed}</p>
              <p className="text-xs text-blue-600 mt-1">Packets Analyzed</p>
              <p className="text-xs text-gray-400">Metadata only</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-400">{discovery.dataMinimized.discarded}</p>
              <p className="text-xs text-gray-500 mt-1">Packets Discarded</p>
              <p className="text-xs text-gray-400">Private payloads</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Sovereignty Boundary Check</h3>
          <div className="space-y-3">
            {[
              { region: "North America (US)", status: "compliant", flag: "US" },
              { region: "Latin America (MX)", status: "compliant", flag: "MX" },
              { region: "Central Africa (CEMAC)", status: "compliant", flag: "GA" },
            ].map((r) => (
              <div key={r.region} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{r.flag === "US" ? "\uD83C\uDDFA\uD83C\uDDF8" : r.flag === "MX" ? "\uD83C\uDDF2\uD83C\uDDFD" : "\uD83C\uDDEC\uD83C\uDDE6"}</span>
                  <span className="text-sm text-gray-700">{r.region}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === "compliant" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {r.status === "compliant" ? "Compliant" : "Violation"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Assessment data remains within specified geographic and corporate boundaries.</p>
        </div>
      </div>

      {/* Passive vs Active scanning note */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Scanning Architecture</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm font-semibold text-emerald-800">Passive Sniffing (Active)</span>
            </div>
            <p className="text-xs text-emerald-700">Port mirroring / TAP — zero network interference. Preferred by enterprise IT departments to ensure zero downtime.</p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-sm font-semibold text-gray-600">Active Scanning (Available)</span>
            </div>
            <p className="text-xs text-gray-500">Endpoint probing — available on request for deep infrastructure audits. Requires explicit client authorization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 6. OPERATIONAL RISK MONITORING
// ═══════════════════════════════════════════════════════════════════
function RiskView({ data }: { data: CommandData }) {
  const { discovery } = data;

  return (
    <div className="space-y-6">
      {/* Operational Gauges */}
      <div className="grid grid-cols-3 gap-4">
        <GaugeCard
          label="Network Latency Impact"
          value={discovery.networkOverheadPct}
          max={5}
          unit="%"
          threshold={2}
          description="Overhead from sniffing tools on client network. Target: < 2%"
        />
        <GaugeCard
          label="API Rate Limit Usage"
          value={12}
          max={100}
          unit="%"
          threshold={80}
          description="How close to client API rate limits. Avoid locking out services."
        />
        <GaugeCard
          label="Data Transfer Volume"
          value={2.4}
          max={10}
          unit="GB"
          threshold={8}
          description="Total metadata transferred this cycle. Capped by agreement."
        />
      </div>

      {/* Industry-Specific Evidence Focus */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Industry-Specific Evidence Focus</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              industry: "Fintech",
              focus: "Transaction Resilience",
              metrics: ["Transaction log integrity", "Node-to-node latency", "Settlement pipeline redundancy"],
              icon: "\uD83C\uDFE6",
            },
            {
              industry: "Manufacturing",
              focus: "Edge/IoT Connectivity",
              metrics: ["Factory floor device connectivity", "Edge compute utilization", "OT/IT network segmentation"],
              icon: "\uD83C\uDFED",
            },
            {
              industry: "Agriculture",
              focus: "Remote Infrastructure",
              metrics: ["Regional data backhaul stability", "Remote processing plant uptime", "Satellite link reliability"],
              icon: "\uD83C\uDF3E",
            },
          ].map((item) => (
            <div key={item.industry} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.industry}</p>
                  <p className="text-xs text-blue-600">{item.focus}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {item.metrics.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-blue-400 mt-0.5">&#8226;</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Register */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Automated Discovery Risk Register</h3>
        <div className="space-y-2">
          {[
            { risk: "Network sniffing exceeds latency threshold", severity: "low", mitigation: "Auto-throttle active. Passive mode ensures < 1% overhead.", status: "mitigated" },
            { risk: "API rate limit exhaustion on client cloud", severity: "medium", mitigation: "Rate limit tracking at 12%. Auto-backoff configured at 75%.", status: "monitored" },
            { risk: "Data exfiltration via unsanctioned channel", severity: "high", mitigation: "All egress monitored. Sovereignty boundary checks active.", status: "mitigated" },
            { risk: "Probe sensor goes offline during assessment", severity: "medium", mitigation: "Heartbeat monitoring with 5-min alert window. Redundant backup sensor.", status: "monitored" },
          ].map((r, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
              r.severity === "high" ? "bg-red-50 border-red-200" : r.severity === "medium" ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center gap-3 flex-1">
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                  r.severity === "high" ? "bg-red-100 text-red-800" : r.severity === "medium" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                }`}>{r.severity}</span>
                <div>
                  <p className="text-sm text-gray-900">{r.risk}</p>
                  <p className="text-xs text-gray-500">{r.mitigation}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                r.status === "mitigated" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
              }`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const KPI_COLORS: Record<string, string> = {
  emerald: "text-emerald-600",
  blue: "text-blue-600",
  violet: "text-violet-600",
  red: "text-red-600",
  amber: "text-amber-600",
  gray: "text-gray-600",
  purple: "text-purple-600",
};

function KPICard({ label, value, subtitle, color, large }: { label: string; value: string | number; subtitle: string; color: string; large?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${large ? "ring-2 ring-blue-100" : ""}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`${large ? "text-3xl" : "text-2xl"} font-bold mt-1 ${KPI_COLORS[color] || "text-gray-900"}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}

function TrafficLight({ color, label, count, description }: { color: "green" | "yellow" | "red"; label: string; count: number; description: string }) {
  const config = {
    green: { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", text: "text-emerald-700", num: "text-emerald-600" },
    yellow: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", text: "text-amber-700", num: "text-amber-600" },
    red: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", text: "text-red-700", num: "text-red-600" },
  }[color];

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-full ${config.dot} ${count > 0 && color !== "green" ? "animate-pulse" : ""}`} />
          <span className={`text-sm font-semibold ${config.text}`}>{label}</span>
        </div>
        <span className={`text-2xl font-bold ${config.num}`}>{count}</span>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function SensorCard({ label, value, status, icon }: { label: string; value: number; status: string; icon: string }) {
  const colors = {
    active: "bg-emerald-50 border-emerald-200 text-emerald-700",
    offline: "bg-red-50 border-red-200 text-red-700",
    throttled: "bg-amber-50 border-amber-200 text-amber-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  }[status] || "bg-gray-50 border-gray-200 text-gray-700";

  return (
    <div className={`rounded-xl border p-5 ${colors}`}>
      <p className="text-xs uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function SecurityStatusCard({ title, active, activeLabel, inactiveLabel, icon }: {
  title: string; active: boolean; activeLabel: string; inactiveLabel: string; icon: string;
}) {
  return (
    <div className={`rounded-xl border p-5 ${active ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-emerald-100" : "bg-red-100"}`}>
          {active ? (
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <p className={`text-xs ${active ? "text-emerald-700" : "text-red-700"}`}>
        {active ? activeLabel : inactiveLabel}
      </p>
    </div>
  );
}

function GaugeCard({ label, value, max, unit, threshold, description }: {
  label: string; value: number; max: number; unit: string; threshold: number; description: string;
}) {
  const pct = (value / max) * 100;
  const isOk = value < threshold;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{label}</h3>
      <div className="flex items-end gap-2 mb-2">
        <span className={`text-3xl font-bold ${isOk ? "text-emerald-600" : "text-red-600"}`}>{value}</span>
        <span className="text-sm text-gray-400 mb-1">{unit} / {max}{unit}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 mb-2 relative">
        <div className={`h-3 rounded-full transition-all ${isOk ? "bg-emerald-400" : "bg-red-400"}`} style={{ width: `${pct}%` }} />
        <div className="absolute top-0 h-3 w-0.5 bg-red-600" style={{ left: `${(threshold / max) * 100}%` }} title="Threshold" />
      </div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
