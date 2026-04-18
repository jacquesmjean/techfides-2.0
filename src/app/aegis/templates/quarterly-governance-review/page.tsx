"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type AgendaItem = {
  block: string;
  duration: string;
  owner: string;
  purpose: string;
  output: string;
};

const agenda: AgendaItem[] = [
  {
    block: "0 · Roll-call + prior actions",
    duration: "10 min",
    owner: "Governance Lead",
    purpose:
      "Confirm attendance, quorum, and completion status of prior-quarter action items. Actions not closed are rolled to this quarter or escalated.",
    output: "Prior-actions report with close/defer/escalate decisions.",
  },
  {
    block: "1 · Inventory & scope changes",
    duration: "15 min",
    owner: "AI Governance Lead",
    purpose:
      "Walk through every addition, reclassification, and retirement in Artifact 3.1 since the last review. Confirm each carries an owner and next-review date.",
    output: "Inventory deltas approved; any unowned rows escalated.",
  },
  {
    block: "2 · Risk register walk",
    duration: "20 min",
    owner: "AI Governance Lead + Risk Owner",
    purpose:
      "P0/P1 risks reviewed individually from Artifact 1.3. New risks, status changes, and closed mitigations. Treatment decisions confirmed or revised.",
    output: "Risk register updated; any newly P0 risk has a named mitigation owner and deadline.",
  },
  {
    block: "3 · Workflow performance",
    duration: "20 min",
    owner: "Workflow Owners",
    purpose:
      "Each T3/T4 workflow (Artifact 4.1) walks through its quarter: metrics vs. tolerance, exception count, drift signals. T1/T2 workflows reviewed in aggregate.",
    output:
      "Workflows flagged for redesign / retirement. Owner & deadline captured.",
  },
  {
    block: "4 · Incidents & near-misses",
    duration: "15 min",
    owner: "CISO / Incident Commander",
    purpose:
      "Every SEV-1/SEV-2 and a sampling of SEV-3/SEV-4 incidents from Artifact 2.3. Root-cause themes, systemic follow-ups, external notifications completed.",
    output: "After-action items confirmed; cross-cutting themes captured.",
  },
  {
    block: "5 · Value & spend",
    duration: "15 min",
    owner: "VP Finance + Governance Lead",
    purpose:
      "Ledgers from Artifact 3.3 reconciled. Scale/Hold/Rework/Retire decisions at every initiative. Forward-quarter budget check.",
    output: "Initiative dispositions confirmed; material budget variances escalated.",
  },
  {
    block: "6 · Policy & regulatory update",
    duration: "15 min",
    owner: "General Counsel + Governance Lead",
    purpose:
      "Regulatory developments since last review. Policy 1.1 change proposals. EU AI Act / state AI law / sectoral obligations tracking.",
    output: "Policy change PRs approved or deferred; reg tracker updated.",
  },
  {
    block: "7 · Vendor posture",
    duration: "10 min",
    owner: "CISO + Procurement",
    purpose:
      "Vendors from Artifact 2.2 with posture change (SOC report expired, breach, acquisition). Renewals in the next 90 days.",
    output: "Vendor actions: reassess / renegotiate / replace.",
  },
  {
    block: "8 · People & culture",
    duration: "10 min",
    owner: "CHRO + Governance Lead",
    purpose:
      "Training completion (5.3), adoption signals (5.2), feedback from the employee forum. Role-change watch items.",
    output: "People actions named; escalations to ExCo if any.",
  },
  {
    block: "9 · Next-quarter priorities",
    duration: "20 min",
    owner: "Executive Sponsor",
    purpose:
      "Rank the next-quarter work. Top 5 priorities feed the roadmap (Artifact 6.3) and the executive dashboard (Artifact 6.1).",
    output: "Prioritized list with owner + deadline for each.",
  },
  {
    block: "10 · Decisions, actions, close",
    duration: "10 min",
    owner: "Governance Lead",
    purpose:
      "Confirm every decision with attribution. Restate every action with owner and due date. Board pack deltas assigned.",
    output: "Minutes draft circulated within 24 hours; actions tracked in the register.",
  },
];

const attendeesRequired = [
  {
    role: "Executive Sponsor",
    accountability: "Chair. Convenes, closes, owns outcomes to the ExCo and Board.",
  },
  {
    role: "AI Governance Lead",
    accountability: "Quarterback. Prepares packet, walks artifacts, captures decisions.",
  },
  {
    role: "General Counsel",
    accountability: "Policy, regulatory, incident-notification authority.",
  },
  {
    role: "CISO",
    accountability: "Security posture, incident ownership, vendor risk.",
  },
  {
    role: "CHRO",
    accountability: "Role change, training, workforce communications.",
  },
  {
    role: "VP Finance",
    accountability: "Spend ledger, ROI discipline, budget decisions.",
  },
  {
    role: "Function Heads",
    accountability: "Each affected function sends its head when workflows from their area are on the agenda.",
  },
  {
    role: "Scribe",
    accountability:
      "Captures minutes, actions, decisions. Not a participant — independent role.",
  },
];

const artifactsConsulted = [
  { num: "1.1", name: "AI Acceptable Use Policy — change review" },
  { num: "1.2", name: "RACI — any role changes since last review" },
  { num: "1.3", name: "AI Risk Register — P0/P1 walk" },
  { num: "2.1", name: "Data Classification & AI Data Map — scope changes" },
  { num: "2.2", name: "Vendor & Tool Risk Assessments — posture + renewals" },
  { num: "2.3", name: "AI Incident Response Runbook — quarter's incidents" },
  { num: "3.1", name: "AI Inventory Dashboard — adds, changes, retirements" },
  { num: "3.2", name: "Shadow AI Scan Report — fresh findings" },
  { num: "3.3", name: "AI Value & Spend Tracker — ledger + scorecards" },
  { num: "4.1", name: "Governed Workflow Automations — metrics per workflow" },
  { num: "4.2", name: "Prompt & Template Library — eval regressions" },
  { num: "4.3", name: "SOP Updates — releases since last review" },
  { num: "5.2", name: "Adoption Playbook — adoption signals" },
  { num: "5.3", name: "Role-Based Training Curriculum — completion rates" },
];

const preReadChecklist = [
  "Governance Lead publishes pre-read 5 business days prior.",
  "Each artifact owner confirms their artifact is current (not stale), including Next Review Due dates.",
  "Finance publishes Artifact 3.3 with quarter close data no later than 3 business days prior.",
  "Incidents packet compiled from Artifact 2.3 by CISO 3 business days prior.",
  "Pre-read includes: prior minutes, action register, artifact snapshots, decision items with options.",
  "Decisions required at the meeting are flagged in the pre-read with their options — no decisions get introduced fresh in the room.",
];

export default function QuarterlyGovernanceReviewPage() {
  return (
    <ArtifactShell
      module="Module 5 · Cadence"
      moduleAccent="text-accent-green"
      artifactNumber="5.1"
      title="Quarterly Governance Review Template"
      subtitle="The meeting that turns AEGIS artifacts into decisions. A standard 2.5-hour agenda, required attendees, pre-read discipline, and a minutes structure that feeds the board pack."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="01"
        title="Purpose"
        intent="A quarter without a governance review is a quarter where the artifacts drifted, the risk register grew stale, and the organization forgot which workflows were in production. This template makes the review boring, predictable, and unmissable."
      >
        <SubSection title="What this meeting produces">
          <ul className="list-disc space-y-1 pl-5">
            <li>Decisions, with named decision-makers, captured in the minutes.</li>
            <li>Refreshed risk register (Artifact 1.3) — reviewed, not just read.</li>
            <li>Signed-off inventory deltas (Artifact 3.1).</li>
            <li>Workflow dispositions — Scale / Hold / Rework / Retire — per Artifact 3.3 thresholds.</li>
            <li>Prioritized next-quarter work feeding the roadmap (Artifact 6.3) and board pack (Artifact 6.2).</li>
          </ul>
        </SubSection>

        <SubSection title="What this meeting is not">
          <ul className="list-disc space-y-1 pl-5">
            <li>Not a status update — those go in the executive dashboard (Artifact 6.1).</li>
            <li>Not a vendor pitch — new tools route through intake (Artifact 3.1), not this meeting.</li>
            <li>Not a training session — policy and tool walkthroughs belong in Artifact 5.3.</li>
          </ul>
        </SubSection>

        <GuidanceCallout>
          Guard the agenda. The single failure mode of governance reviews is
          scope creep — a clever operator turns the meeting into a product
          demo, a procurement debate, or a town hall. Cut politely and
          redirect. This meeting has one job.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="02"
        title="Cadence & Logistics"
        intent="Predictability is the point. The meeting happens every quarter whether anything dramatic has happened or not — and especially when nothing has."
      >
        <SubSection title="When">
          <p>
            Third Tuesday of the first month of each quarter. 2.5 hours. On
            calendar one year in advance. Attendance is in-person unless
            otherwise agreed.
          </p>
        </SubSection>
        <SubSection title="Quorum">
          <p>
            Meeting does not start without Executive Sponsor, General
            Counsel, AI Governance Lead, and at least one function head. If
            quorum fails, the meeting is rescheduled within 10 business days
            — not canceled.
          </p>
        </SubSection>
        <SubSection title="Minutes & distribution">
          <p>
            Draft minutes within 24 hours, final within 5 business days.
            Distribution: attendees + ExCo. Board-material items also routed
            to Artifact 6.2 prep.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="03"
        title="Attendees"
        intent="Each named role owns a block of the agenda. If the role can't make the meeting, a delegate with decision authority must attend — no silent chairs."
      >
        <div className="overflow-hidden rounded-md border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Accountability
                </th>
              </tr>
            </thead>
            <tbody>
              {attendeesRequired.map((a) => (
                <tr key={a.role} className="border-b border-slate-800/60 last:border-0 align-top">
                  <td className="px-4 py-3 font-semibold text-slate-100">{a.role}</td>
                  <td className="px-4 py-3 text-slate-400">{a.accountability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="04"
        title="Pre-Read Discipline"
        intent="Governance reviews that fail, fail because the room is reading the pre-read. Enforce the 5-day rule."
      >
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          {preReadChecklist.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        <GuidanceCallout>
          If the pre-read isn&rsquo;t ready 5 business days ahead, the
          meeting is postponed. Do this once per client and it will never
          happen again.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="05"
        title="Standard Agenda"
        intent="Eleven blocks, 2.5 hours. Anything that does not fit here belongs in a different forum."
        pageBreak
      >
        <div className="overflow-hidden rounded-md border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                {["Block", "Duration", "Owner", "Purpose", "Output"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-slate-800 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agenda.map((a) => (
                <tr key={a.block} className="border-b border-slate-800/60 last:border-0 align-top">
                  <td className="px-3 py-3 font-semibold text-slate-100">{a.block}</td>
                  <td className="px-3 py-3 text-slate-400">{a.duration}</td>
                  <td className="px-3 py-3 text-slate-300">{a.owner}</td>
                  <td className="px-3 py-3 text-slate-300">{a.purpose}</td>
                  <td className="px-3 py-3 text-accent-green">{a.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="06"
        title="Artifacts Consulted"
        intent="Every AEGIS artifact touches this meeting in some form. This is the canonical list."
      >
        <div className="overflow-hidden rounded-md border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  #
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Used For
                </th>
              </tr>
            </thead>
            <tbody>
              {artifactsConsulted.map((a) => (
                <tr key={a.num} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-4 py-2 font-mono text-xs text-accent-green">{a.num}</td>
                  <td className="px-4 py-2 text-slate-300">{a.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="07"
        title="Minutes Template"
        intent="A consistent minutes structure makes the quarter comparable over time and makes the board pack compilation (Artifact 6.2) mechanical rather than interpretive."
      >
        <div className="rounded-md border border-slate-800 bg-navy-900/20 p-6 text-sm">
          <dl className="grid gap-x-6 gap-y-3 md:grid-cols-2">
            {[
              ["Meeting", <Placeholder key="m">CLIENT</Placeholder>, "Q# 20NN Governance Review"],
              ["Date", <Placeholder key="d">YYYY-MM-DD</Placeholder>, "Duration · 2.5 hr"],
              ["Attendees", "Listed by role; proxies noted.", ""],
              ["Quorum", "Confirmed / not confirmed (rescheduled).", ""],
              ["Agenda hit?", "Every block: held / deferred / extended.", ""],
              ["Decisions", "Each as: D-NN · decision · decision-maker · effective date.", ""],
              ["Actions", "Each as: A-NN · action · owner · due date.", ""],
              ["Risks changed", "List with before/after severity.", ""],
              ["Incidents walked", "Summary + cross-cutting themes.", ""],
              ["Escalations to ExCo", "Item, reason, urgency.", ""],
              ["Next meeting", "Date + known-open items.", ""],
            ].map(([k, v, v2], i) => (
              <div key={i}>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {k}
                </dt>
                <dd className="mt-1 text-slate-300">
                  {v} {v2 ? <span className="text-slate-500">· {v2}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="08"
        title="Regulatory Mapping"
        intent="A documented, quorate governance review cadence is a core expectation of every AI assurance framework in force today."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.1 / GOVERN-4.1" },
            { name: "ISO 42001", control: "Clause 9 / Clause 9.3" },
            { name: "ISO 27001", control: "Clause 9.3 (management review)" },
            { name: "SOC 2", control: "CC2.3 / CC4.1 / CC5.3" },
            { name: "EU AI Act", control: "Art. 17 (QMS)" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
