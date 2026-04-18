"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type Horizon = "Now" | "Next" | "Later";

const horizonStyle: Record<Horizon, string> = {
  Now: "bg-accent-green/20 text-accent-green border-accent-green/40",
  Next: "bg-electric-500/20 text-electric-300 border-electric-500/40",
  Later: "bg-purple-500/20 text-purple-300 border-purple-500/40",
};

type Category = "Governance" | "Enablement" | "Workflow" | "Platform" | "Compliance";

const categoryStyle: Record<Category, string> = {
  Governance: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  Enablement: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  Workflow: "bg-electric-500/20 text-electric-300 border-electric-500/40",
  Platform: "bg-slate-500/20 text-slate-200 border-slate-500/40",
  Compliance: "bg-accent-amber/20 text-accent-amber border-accent-amber/40",
};

export default function TwelveMonthAiRoadmapPage() {
  return (
    <ArtifactShell
      module="Module 6 · Brief"
      moduleAccent="text-indigo-400"
      artifactNumber="6.3"
      title="12-Month AI Roadmap"
      subtitle="Now / Next / Later roadmap across five categories. Refreshed at every QGR. The roadmap the executive team commits to and the board pack references."
      classification="CONFIDENTIAL"
      version="v1.0"
    >
      <ArtifactSection number="1" title="Purpose">
        <p>
          The 12-Month AI Roadmap is the forward plan that binds every other
          AEGIS artifact together. It is the place where value hypotheses
          (Artifact 3.3), governance investments (Module 1 + 2), and workflow
          design (Module 4) land on a timeline the executive team can commit
          to. It is reviewed every quarter at QGR and re-baselined every
          12 months. Items move between horizons; they do not accumulate
          forever.
        </p>
        <GuidanceCallout>
          A roadmap is a set of commitments, not a wishlist. Anything in
          <em> Now</em> has a named owner, a start date, and a stop condition.
          Anything in <em>Later</em> should be defensible as a deliberate
          not-yet, not an unplanned maybe.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Horizon Definitions"
        intent={"Three horizons. Fixed meanings. No \u2018soon\u2019 or \u2018Q-ish\u2019 \u2014 the horizon itself is the commitment level."}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              {
                horizon: "Now" as Horizon,
                window: "Months 1–3",
                commitment: "Active. Resourced. Named owner. In the current quarter plan.",
                exit: "Shipped, retired, or demoted to Later with rationale at QGR.",
              },
              {
                horizon: "Next" as Horizon,
                window: "Months 4–6",
                commitment: "Planned. Budget sketched. Owner tentatively named. Prerequisites identified.",
                exit: "Promoted to Now at QGR, or demoted to Later with rationale.",
              },
              {
                horizon: "Later" as Horizon,
                window: "Months 7–12+",
                commitment: "Directional. Hypothesis-level. Review conditions named.",
                exit: "Promoted to Next at QGR, or dropped with a dated decision.",
              },
            ]
          ).map((h) => (
            <div
              key={h.horizon}
              className="rounded-xl border border-navy-700 bg-navy-900/60 p-4"
            >
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${horizonStyle[h.horizon]}`}
              >
                {h.horizon}
              </span>
              <p className="mt-3 text-xs uppercase tracking-wide text-navy-300">
                {h.window}
              </p>
              <p className="mt-2 text-sm text-navy-100">
                <span className="font-semibold text-white">Commitment:</span>{" "}
                {h.commitment}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Exit:</span>{" "}
                {h.exit}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Roadmap Item Schema"
        intent="Every item on the roadmap uses this schema — no exceptions. Incomplete items do not enter the roadmap until the fields are filled."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Field</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2">Guidance</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["Item ID", <Placeholder key="id">RM-000</Placeholder>, "Stable identifier for the life of the item."],
                ["Title", <Placeholder key="t">[Title]</Placeholder>, "Outcome-phrased, not activity-phrased."],
                ["Category", <Placeholder key="c">Governance / Enablement / Workflow / Platform / Compliance</Placeholder>, "One category only. Forces sharper framing."],
                ["Horizon", <Placeholder key="h">Now / Next / Later</Placeholder>, "Set and defended at QGR."],
                ["Owner", <Placeholder key="o">[Name]</Placeholder>, "Single name. Accountable, not advisory."],
                ["Sponsor", <Placeholder key="s">[Name]</Placeholder>, "Executive who clears blockers and reports at QGR."],
                ["Outcome", <Placeholder key="oc">[Observable change]</Placeholder>, "What is true after this item is done. Measurable where possible."],
                ["Value Hypothesis", <Placeholder key="vh">[Value type + estimate + confidence]</Placeholder>, "From Value & Spend framework (3.3)."],
                ["Prerequisites", <Placeholder key="pre">[Upstream items / artifacts]</Placeholder>, "Explicit chains. No hidden dependencies."],
                ["Risk Exposure", <Placeholder key="r">[High/Med/Low + top risk]</Placeholder>, "From Risk Register (2.3). Very High requires Exec Sponsor approval to enter Now."],
                ["Decision Gates", <Placeholder key="dg">[Go/no-go checkpoints]</Placeholder>, "Pre-declared, not improvised."],
                ["Stop Condition", <Placeholder key="stop">[What would make us kill this]</Placeholder>, "Every Now item has a stop condition. This is non-negotiable."],
              ].map(([field, value, guidance], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{field}</td>
                  <td className="py-3 pr-4">{value}</td>
                  <td className="py-3 text-navy-200">{guidance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Illustrative Roadmap"
        intent="Representative sample across the five categories and three horizons. Replace with client-specific items during the Diagnostic synthesis."
      >
        <div className="space-y-4">
          {(
            [
              {
                id: "RM-001",
                title: "Ratify AI Use Policy + AUP v1.0",
                category: "Governance" as Category,
                horizon: "Now" as Horizon,
                owner: "AI Governance Lead",
                sponsor: "General Counsel",
                outcome: "Policy ratified by Exec, AUP acknowledged by 100% of staff, training currency baselined.",
                value: "Risk avoidance (audit-ready posture).",
              },
              {
                id: "RM-002",
                title: "Ship WF-03 (support triage) to T2 autonomy",
                category: "Workflow" as Category,
                horizon: "Now" as Horizon,
                owner: "VP Support",
                sponsor: "COO",
                outcome: "Cycle time on triage down 40% vs baseline. ≥80% of in-scope agents run 3+/week.",
                value: "Productivity + CX — projected $420k / 12 mo.",
              },
              {
                id: "RM-003",
                title: "Launch Builder training cohort + certification",
                category: "Enablement" as Category,
                horizon: "Now" as Horizon,
                owner: "AI Governance Lead + L&D",
                sponsor: "CHRO",
                outcome: "25 certified Builders across Engineering + Data + Product. Merge protection enforced on prompt library.",
                value: "Risk avoidance + throughput capacity.",
              },
              {
                id: "RM-004",
                title: "Expand AI Inventory to include embedded features in SaaS tools",
                category: "Compliance" as Category,
                horizon: "Next" as Horizon,
                owner: "AI Governance Lead",
                sponsor: "CISO",
                outcome: "Inventory captures embedded-AI vendor features; vendor risk reassessed for top 10.",
                value: "Risk avoidance (shadow AI surface area).",
              },
              {
                id: "RM-005",
                title: "Evaluate internal model hosting for CLIENT-RESTRICTED workloads",
                category: "Platform" as Category,
                horizon: "Next" as Horizon,
                owner: "VP Engineering",
                sponsor: "CISO",
                outcome: "Decision: host vs. continue approved vendor. Costed options on table.",
                value: "Data sovereignty + unit economics.",
              },
              {
                id: "RM-006",
                title: "Scale WF-03 pattern to Finance AR/AP (WF-0X)",
                category: "Workflow" as Category,
                horizon: "Next" as Horizon,
                owner: "VP Finance",
                sponsor: "CFO",
                outcome: "New workflow specced + approved; pilot running in 6 of 10 target processes.",
                value: "Error reduction + throughput — projected $260k / 12 mo.",
              },
              {
                id: "RM-007",
                title: "Publish ISO 42001 readiness gap analysis",
                category: "Compliance" as Category,
                horizon: "Next" as Horizon,
                owner: "AI Governance Lead",
                sponsor: "General Counsel",
                outcome: "Gap analysis complete. Decision on formal certification path at QGR.",
                value: "Customer-facing posture + contract velocity.",
              },
              {
                id: "RM-008",
                title: "Assistant pattern for customer-facing comms (T1 only)",
                category: "Workflow" as Category,
                horizon: "Later" as Horizon,
                owner: "CMO",
                sponsor: "CEO",
                outcome: "Design + red-team suite drafted. Pilot conditional on WF-03 sustainment.",
                value: "Throughput + CX.",
              },
              {
                id: "RM-009",
                title: "Governance automation — inventory + risk register sync",
                category: "Platform" as Category,
                horizon: "Later" as Horizon,
                owner: "VP Engineering",
                sponsor: "AI Governance Lead",
                outcome: "Prototype reduces manual inventory upkeep by >50%.",
                value: "Program efficiency + audit readiness.",
              },
            ]
          ).map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-navy-700 bg-navy-900/60 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-semibold text-electric-400">
                  {r.id}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${categoryStyle[r.category]}`}
                >
                  {r.category}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${horizonStyle[r.horizon]}`}
                >
                  {r.horizon}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                {r.title}
              </p>
              <p className="mt-2 text-xs text-navy-200">
                <span className="font-semibold text-navy-100">Owner:</span>{" "}
                {r.owner} · <span className="font-semibold text-navy-100">Sponsor:</span>{" "}
                {r.sponsor}
              </p>
              <p className="mt-2 text-sm text-navy-100">
                <span className="font-semibold text-white">Outcome:</span>{" "}
                {r.outcome}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Value:</span>{" "}
                {r.value}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Re-Planning Cadence"
        intent="The roadmap is a living document. These are the only times it changes."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Event</th>
                <th className="py-2 pr-4">What Changes</th>
                <th className="py-2">Output</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["QGR (quarterly)", "Horizon promotions/demotions. New items admitted. Stop-conditions exercised.", "Roadmap v+1 with diff log"],
                ["Annual re-baseline", "Full rebuild. Every item re-justified against current strategy. 12-month window reset.", "Roadmap v2.0 delivered to Board (6.2)"],
                ["Material incident", "Immediate pause of any Now item tied to the incident. Review at next QGR.", "Incident RCA + roadmap impact memo"],
                ["Strategy change", "Exec Sponsor calls emergency QGR. Items re-scoped, de-scoped, or added.", "Roadmap interim version + minute"],
                ["Regulatory shift inside 90 days", "Compliance-category items jump horizons as needed. Other work may be displaced.", "AI Governance Lead memo + roadmap update"],
              ].map(([event, changes, output], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{event}</td>
                  <td className="py-3 pr-4 text-navy-200">{changes}</td>
                  <td className="py-3 text-navy-200">{output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Anti-Patterns"
        intent="Roadmaps fail for a small, recognizable set of reasons. Catch them early."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              pattern: "Now shelf keeps growing",
              why: "Items added but none shipped or demoted. Now becomes Later in disguise.",
              counter: "Enforce a Now cap (e.g., 5 items per category). No admits without a demotion or a ship.",
            },
            {
              pattern: "Later becomes a dumping ground",
              why: "Ideas land in Later and are never reviewed.",
              counter: "Every QGR, review Later. Promote, sharpen, or drop. Nothing stays untouched for 2 quarters.",
            },
            {
              pattern: "No stop conditions",
              why: "Items ship late, pivot often, and no one can tell when to stop.",
              counter: "Stop conditions are a schema requirement (Section 3). Items without one do not enter Now.",
            },
            {
              pattern: "Governance and workflow items trade air time",
              why: "When the program is pushed, governance slips because it looks optional.",
              counter: "Governance has its own category and minimum allocation per horizon. Protected at QGR.",
            },
            {
              pattern: "Value hypotheses go unchecked",
              why: "Projected value never reconciles with realized value.",
              counter: "At each QGR, reconcile projected vs realized against the Value Tracker (3.3). Adjust confidence.",
            },
            {
              pattern: "Roadmap does not match the board pack",
              why: "Two forks of truth confuse the board and the staff.",
              counter: "The board pack (6.2) pulls directly from this artifact. Any divergence is a pack error and is corrected.",
            },
          ].map((a) => (
            <div
              key={a.pattern}
              className="rounded-xl border border-rose-500/30 bg-navy-900/60 p-4"
            >
              <p className="text-sm font-semibold text-rose-300">{a.pattern}</p>
              <p className="mt-2 text-sm text-navy-100">
                <span className="font-semibold text-white">Why it happens:</span>{" "}
                {a.why}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Counter:</span>{" "}
                {a.counter}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Regulatory & Framework Mapping"
        intent="A roadmap is the vehicle by which the frameworks below expect demonstrable program evolution over time."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.1, GOVERN-5.1, MANAGE-4.3" },
            { name: "ISO 42001", control: "Cl. 6.2, 9.1, 10.2" },
            { name: "ISO 27001", control: "Cl. 6.2, 10.1" },
            { name: "SOC 2", control: "CC3.1, CC4.2, CC5.2" },
            { name: "EU AI Act", control: "Art. 17(1)(h)" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
