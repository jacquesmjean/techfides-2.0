"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type Signal = "Green" | "Amber" | "Red";

const signalStyle: Record<Signal, string> = {
  Green: "bg-accent-green/20 text-accent-green border-accent-green/40",
  Amber: "bg-accent-amber/20 text-accent-amber border-accent-amber/40",
  Red: "bg-rose-500/20 text-rose-300 border-rose-500/40",
};

export default function ExecutiveAiDashboardPage() {
  return (
    <ArtifactShell
      module="Module 6 · Brief"
      moduleAccent="text-indigo-400"
      artifactNumber="6.1"
      title="Executive AI Dashboard"
      subtitle="One-page monthly dashboard for the executive team. Fourteen signals across adoption, value, risk, and compliance — refreshed the first business day of each month."
      classification="CONFIDENTIAL"
      version="v1.0"
    >
      <ArtifactSection number="1" title="Purpose">
        <p>
          The Executive AI Dashboard is the single, standing artifact the
          executive team reviews each month to know whether the AI program is
          on track, where it is drifting, and where it has stalled. Every
          number on this page is traceable to a source artifact under AEGIS.
          Nothing is bespoke, nothing is hand-edited, and the same fourteen
          signals are reviewed each cycle so the team reads trends, not
          narratives.
        </p>
        <GuidanceCallout>
          The dashboard is not a status update. It is an instrument panel. If
          the AI Governance Lead finds themselves writing long prose around
          the numbers, the numbers are wrong or the signals are wrong —
          escalate at the next QGR instead of padding the narrative.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Header Block"
        intent="The five fixed fields that anchor every dashboard cycle."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Field</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2">Source</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["Reporting Period", <Placeholder key="period">Month YYYY</Placeholder>, "System date"],
                ["Program Stage", <Placeholder key="stage">Foundation / Scaling / Mature</Placeholder>, "Set at QGR"],
                ["Program Signal (overall)", <Placeholder key="sig">Green / Amber / Red</Placeholder>, "AI Governance Lead — worst of Risk + Adoption signals"],
                ["Open Executive Decisions", <Placeholder key="dec">N</Placeholder>, "Count from QGR minutes awaiting Exec action"],
                ["Next QGR Date", <Placeholder key="next">YYYY-MM-DD</Placeholder>, "Cadence (Artifact 5.1)"],
              ].map(([field, value, source], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{field}</td>
                  <td className="py-3 pr-4">{value}</td>
                  <td className="py-3 text-navy-200">{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Fourteen Monthly Signals"
        intent="Each signal has a defined threshold. The AI Governance Lead sets the color mechanically; no interpretation beyond the rule."
      >
        <div className="space-y-3">
          {(
            [
              {
                pillar: "Adoption",
                signal: "Active workflows in production",
                rule: "Green ≥ plan; Amber = plan -1; Red ≥ plan -2",
                source: "Governed Workflows (4.1)",
                color: "Green" as Signal,
              },
              {
                pillar: "Adoption",
                signal: "Users with ≥3 runs this month",
                rule: "Green ≥ 80% of in-scope; Amber 60–80%; Red < 60%",
                source: "Adoption Playbook (5.2) metrics",
                color: "Green" as Signal,
              },
              {
                pillar: "Adoption",
                signal: "Median cycle-time improvement vs baseline",
                rule: "Green ≥ target; Amber within 25% of target; Red < 75% of target",
                source: "Adoption Playbook (5.2) per-workflow plan",
                color: "Amber" as Signal,
              },
              {
                pillar: "Value",
                signal: "Trailing 90-day realized value",
                rule: "Green ≥ plan; Amber within 20%; Red > 20% below plan",
                source: "Value & Spend Tracker (3.3)",
                color: "Green" as Signal,
              },
              {
                pillar: "Value",
                signal: "Spend vs approved envelope",
                rule: "Green ≤ envelope; Amber 100–110%; Red > 110%",
                source: "Value & Spend Tracker (3.3)",
                color: "Green" as Signal,
              },
              {
                pillar: "Value",
                signal: "Initiatives past decision-gate without decision",
                rule: "Green 0; Amber 1–2; Red 3+",
                source: "QGR minutes (5.1)",
                color: "Amber" as Signal,
              },
              {
                pillar: "Risk",
                signal: "Open risks at High / Very High",
                rule: "Green ≤ 2; Amber 3–5; Red > 5 OR any Very High aged > 30 days",
                source: "AI Risk Register (2.3)",
                color: "Amber" as Signal,
              },
              {
                pillar: "Risk",
                signal: "Incidents this month (by severity)",
                rule: "Green 0 P1/P2; Amber any P2; Red any P1",
                source: "AI Incident Runbook (2.6)",
                color: "Green" as Signal,
              },
              {
                pillar: "Risk",
                signal: "Vendor risk reassessments overdue",
                rule: "Green 0; Amber 1–2; Red 3+",
                source: "Vendor Risk Assessment (2.5)",
                color: "Green" as Signal,
              },
              {
                pillar: "Compliance",
                signal: "AI Inventory freshness",
                rule: "Green 100% entries reviewed ≤ 90 days; Amber 90–99%; Red < 90%",
                source: "AI Inventory Dashboard (3.1)",
                color: "Green" as Signal,
              },
              {
                pillar: "Compliance",
                signal: "Training currency (by tier)",
                rule: "Green 100% in-cycle; Amber 95–99%; Red < 95%",
                source: "Role-Based Training (5.3)",
                color: "Amber" as Signal,
              },
              {
                pillar: "Compliance",
                signal: "Policy exceptions open",
                rule: "Green ≤ 3, all with expiry; Amber 4–6; Red any past expiry",
                source: "Policy Core (Module 2)",
                color: "Green" as Signal,
              },
              {
                pillar: "Compliance",
                signal: "Regulatory watch items on radar",
                rule: "Informational. Flag if any item requires action inside 90 days.",
                source: "Governance scan (AI Governance Lead)",
                color: "Green" as Signal,
              },
              {
                pillar: "Program",
                signal: "QGR action items aged > 60 days",
                rule: "Green 0; Amber 1–2; Red 3+",
                source: "QGR minutes (5.1)",
                color: "Green" as Signal,
              },
            ]
          ).map((r, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-navy-700 bg-navy-900/60 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-navy-300">
                    {r.pillar}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${signalStyle[r.color]}`}
                  >
                    {r.color}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">
                  {r.signal}
                </p>
                <p className="mt-1 text-xs text-navy-200">
                  <span className="font-semibold text-navy-100">Rule:</span>{" "}
                  {r.rule}
                </p>
                <p className="mt-1 text-xs text-navy-300">
                  Source · {r.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Open Executive Decisions"
        intent="Three to five items, never more. Anything beyond five is a sign the governance cadence is falling behind."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Decision</th>
                <th className="py-2 pr-4">Owner</th>
                <th className="py-2 pr-4">Brought by</th>
                <th className="py-2 pr-4">Decide by</th>
                <th className="py-2">Recommendation</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["Approve T3 autonomy for WF-05 (support triage)", "CEO + CISO", "AI Governance Lead", "Next QGR", "Approve with 90-day review"],
                ["Retire M-02 prompt library entries v<1.3", "AI Governance Lead", "Builder cohort", "30 days", "Approve retirement"],
                ["Increase envelope for Value Initiative V-03 by $80k", "CFO", "Exec Sponsor", "Next QGR", "Approve with scale gates"],
                [<Placeholder key="d1">Decision 4</Placeholder>, <Placeholder key="o1">Owner</Placeholder>, <Placeholder key="b1">Brought by</Placeholder>, <Placeholder key="by1">YYYY-MM-DD</Placeholder>, <Placeholder key="r1">Recommendation</Placeholder>],
                [<Placeholder key="d2">Decision 5</Placeholder>, <Placeholder key="o2">Owner</Placeholder>, <Placeholder key="b2">Brought by</Placeholder>, <Placeholder key="by2">YYYY-MM-DD</Placeholder>, <Placeholder key="r2">Recommendation</Placeholder>],
              ].map((row, i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-3 ${j === 0 ? "pr-4 font-semibold text-white" : "pr-4 text-navy-200"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Trend Lines"
        intent="Six sparkline slots. Numeric reference only — the visual goes in the executive PDF. Twelve-month trailing window."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Monthly active AI-assisted runs", current: "[value]", trend: "[↑/↓/→]" },
            { label: "Realized value ($ trailing 90-day)", current: "[value]", trend: "[↑/↓/→]" },
            { label: "Spend vs envelope (%)", current: "[value]", trend: "[↑/↓/→]" },
            { label: "Open High/Very High risks", current: "[value]", trend: "[↑/↓/→]" },
            { label: "Incidents P1/P2 (rolling 12-mo)", current: "[value]", trend: "[↑/↓/→]" },
            { label: "Training currency %", current: "[value]", trend: "[↑/↓/→]" },
          ].map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-electric-500/30 bg-navy-900/60 p-4"
            >
              <p className="text-xs uppercase tracking-wide text-navy-300">
                {t.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {t.current}
              </p>
              <p className="mt-1 text-xs text-navy-200">
                12-mo trend · {t.trend}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Footer — Data Contract"
        intent="Where each number comes from and who guarantees it. If this section is not defensible, the dashboard is not defensible."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Source Artifact</th>
                <th className="py-2 pr-4">Data Owner</th>
                <th className="py-2 pr-4">Freshness SLA</th>
                <th className="py-2">Last Audit</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["3.1 AI Inventory Dashboard", "AI Governance Lead", "≤ 30 days", <Placeholder key="la1">YYYY-MM-DD</Placeholder>],
                ["3.3 Value & Spend Tracker", "CFO delegate + AI Governance Lead", "Quarterly close + month-end estimate", <Placeholder key="la2">YYYY-MM-DD</Placeholder>],
                ["4.1 Governed Workflows", "AI Governance Lead", "On-change + monthly", <Placeholder key="la3">YYYY-MM-DD</Placeholder>],
                ["2.3 AI Risk Register", "AI Governance Lead + CISO", "Monthly", <Placeholder key="la4">YYYY-MM-DD</Placeholder>],
                ["2.6 AI Incident Runbook", "CISO", "On-incident + monthly", <Placeholder key="la5">YYYY-MM-DD</Placeholder>],
                ["2.5 Vendor Risk Assessment", "Procurement + CISO", "Annual + on-change", <Placeholder key="la6">YYYY-MM-DD</Placeholder>],
                ["5.2 Adoption Playbook", "Adoption Lead per workflow", "Weekly during Activation/Embed", <Placeholder key="la7">YYYY-MM-DD</Placeholder>],
                ["5.3 Role-Based Training", "HR + AI Governance Lead", "Monthly", <Placeholder key="la8">YYYY-MM-DD</Placeholder>],
              ].map((row, i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-3 ${j === 0 ? "pr-4 font-semibold text-white" : "pr-4 text-navy-200"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GuidanceCallout>
          If a source artifact is stale past its SLA on dashboard day, the
          signal for that pillar defaults to Amber. Do not report a number you
          cannot defend.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Regulatory & Framework Mapping"
        intent="Executive-visible, continuous monitoring is a recurring requirement across every framework in scope."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-4.1, MEASURE-3.3, MANAGE-4.3" },
            { name: "ISO 42001", control: "Cl. 9.1, 9.3" },
            { name: "ISO 27001", control: "Cl. 9.3, A.5.1" },
            { name: "SOC 2", control: "CC3.1, CC4.1, CC5.3" },
            { name: "EU AI Act", control: "Art. 17(1), 26(5)" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
