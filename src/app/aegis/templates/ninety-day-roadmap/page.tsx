"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type WeekBlock = {
  week: string;
  phase: string;
  theme: string;
  accent: string;
  ringColor: string;
  objectives: string[];
  artifacts: { number: string; title: string; owner: string }[];
  gate: {
    name: string;
    criteria: string[];
  };
  stakeholders: string[];
  risks: string[];
};

const phaseAccent = {
  stand: {
    accent: "text-electric-400",
    ringColor: "border-electric-500/40",
    badge: "bg-electric-500/10 text-electric-400 border-electric-500/40",
  },
  harden: {
    accent: "text-purple-400",
    ringColor: "border-purple-500/40",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/40",
  },
  scale: {
    accent: "text-accent-green",
    ringColor: "border-accent-green/40",
    badge: "bg-accent-green/10 text-accent-green border-accent-green/40",
  },
  handover: {
    accent: "text-accent-amber",
    ringColor: "border-accent-amber/40",
    badge: "bg-accent-amber/10 text-accent-amber border-accent-amber/40",
  },
};

const weeks: WeekBlock[] = [
  {
    week: "Weeks 1–2",
    phase: "Phase A · Stand Up",
    theme: "Establish authority, visibility, and the policy baseline.",
    accent: phaseAccent.stand.accent,
    ringColor: phaseAccent.stand.ringColor,
    objectives: [
      "Charter the AI Governance Council and confirm decision rights.",
      "Ratify AI Acceptable Use Policy v1.0 across the organization.",
      "Stand up the AI Inventory as the single source of truth for AI systems, tools, and agents.",
    ],
    artifacts: [
      {
        number: "1.1",
        title: "AI Acceptable Use Policy",
        owner: "General Counsel + TechFides",
      },
      {
        number: "1.2",
        title: "RACI for AI Decisions",
        owner: "Executive Sponsor",
      },
      {
        number: "3.1",
        title: "AI Inventory Dashboard (initial load)",
        owner: "TechFides + IT",
      },
    ],
    gate: {
      name: "Gate A — Authority Established",
      criteria: [
        "AI Governance Council charter signed by CEO / Executive Sponsor.",
        "Acceptable Use Policy published and acknowledged by 100% of in-scope employees.",
        "AI Inventory loaded with Shadow AI Scan findings and at least 95% SaaS coverage.",
      ],
    },
    stakeholders: [
      "Executive Sponsor (decision-maker)",
      "General Counsel (policy owner)",
      "CISO / Head of IT (inventory + control owner)",
      "HR (acknowledgment rollout)",
    ],
    risks: [
      "Policy scope too narrow — excludes agentic AI or customer-facing AI.",
      "Inventory captured once and never refreshed — becomes stale inside 60 days.",
      "Council composition missing operating unit leaders — decisions lack field context.",
    ],
  },
  {
    week: "Weeks 3–5",
    phase: "Phase A · Stand Up",
    theme: "Classify data, assess vendors, and define the risk register.",
    accent: phaseAccent.stand.accent,
    ringColor: phaseAccent.stand.ringColor,
    objectives: [
      "Publish the Data Classification standard and AI Data Map.",
      "Complete Vendor & Tool Risk Assessments for all P0 and P1 AI systems.",
      "Populate the AI Risk Register with quantified, owned risks.",
    ],
    artifacts: [
      {
        number: "2.1",
        title: "Data Classification & AI Data Map",
        owner: "CISO",
      },
      {
        number: "2.2",
        title: "Vendor & Tool Risk Assessments",
        owner: "Procurement + CISO",
      },
      { number: "1.3", title: "AI Risk Register", owner: "Risk / Compliance" },
    ],
    gate: {
      name: "Gate B — Risk Surface Mapped",
      criteria: [
        "Data Classification standard approved; all P0 AI systems have a data flow diagram.",
        "Vendor assessments complete for every P0/P1 tool; P2/P3 backlog scheduled.",
        "Risk Register contains at least 15 quantified risks with named owners and due dates.",
      ],
    },
    stakeholders: [
      "CISO (standard + vendor review)",
      "Procurement (contract gating)",
      "Data Protection Officer / Privacy",
      "Operating unit leads (flow validation)",
    ],
    risks: [
      "Vendor assessments become a paperwork exercise — no real risk discovered because the questionnaire is generic.",
      "Data map omits AI training data or fine-tuned model inputs.",
      "Risk register lacks dollar quantification — executives cannot prioritize.",
    ],
  },
  {
    week: "Weeks 6–8",
    phase: "Phase B · Harden",
    theme: "Operationalize incident response, shield critical flows, and lock down shadow AI.",
    accent: phaseAccent.harden.accent,
    ringColor: phaseAccent.harden.ringColor,
    objectives: [
      "Deploy AI Incident Response Runbook and run a tabletop exercise.",
      "Remediate all P0 Shadow AI findings from the diagnostic scan.",
      "Instrument Value & Spend tracking for licensed AI tools.",
    ],
    artifacts: [
      {
        number: "2.3",
        title: "AI Incident Response Runbook",
        owner: "CISO + Legal",
      },
      {
        number: "3.2",
        title: "Shadow AI Scan — Remediation Close-out",
        owner: "IT + TechFides",
      },
      { number: "3.3", title: "Value & Spend Tracker", owner: "Finance + IT" },
    ],
    gate: {
      name: "Gate C — Incident-Ready",
      criteria: [
        "Tabletop exercise executed; after-action report filed within 5 business days.",
        "P0 Shadow AI findings closed or formally accepted by the Council with compensating control.",
        "Spend tracker reconciled to finance actuals ±3% for the trailing quarter.",
      ],
    },
    stakeholders: [
      "CISO (runbook owner)",
      "General Counsel (notification + disclosure playbook)",
      "Communications (external messaging)",
      "Finance (spend reconciliation)",
    ],
    risks: [
      "Runbook ignores third-party AI vendor incidents — only covers internal systems.",
      "Shadow AI closures are license cancellations without workflow replacement — users re-adopt other tools.",
      "Value tracking captures cost but not realized productivity, leaving ROI indefensible.",
    ],
  },
  {
    week: "Weeks 9–10",
    phase: "Phase C · Scale",
    theme: "Move from policy to productized AI workflows and durable enablement.",
    accent: phaseAccent.scale.accent,
    ringColor: phaseAccent.scale.ringColor,
    objectives: [
      "Ship the first wave of governed workflow automations tied to measurable outcomes.",
      "Publish the prompt and template library with access controls and data classifications.",
      "Update SOPs to reflect AI-assisted steps, review points, and escalation paths.",
    ],
    artifacts: [
      {
        number: "4.1",
        title: "Governed Workflow Automations (Wave 1)",
        owner: "TechFides + Process Owners",
      },
      {
        number: "4.2",
        title: "Prompt & Template Library",
        owner: "Knowledge Ops",
      },
      {
        number: "4.3",
        title: "SOP Updates for AI-Assisted Work",
        owner: "Operations",
      },
    ],
    gate: {
      name: "Gate D — Production Workflows",
      criteria: [
        "At least 3 workflows live in production with human-in-loop review steps documented.",
        "Template library restricted by role; no P2+ data is pasted into templates marked public.",
        "SOPs for the top 5 AI-touched processes updated and published.",
      ],
    },
    stakeholders: [
      "Process Owners (design + sign-off)",
      "Head of Operations (SOP authority)",
      "Training / L&D",
      "Internal Audit (control walk-through)",
    ],
    risks: [
      "Workflows deployed without rollback or kill-switch plans.",
      "Template library becomes a wiki — never curated, no versioning.",
      "SOPs updated on paper but not reinforced through manager routines.",
    ],
  },
  {
    week: "Weeks 11–12",
    phase: "Phase D · Handover",
    theme: "Transfer the operating rhythm and prove it to the board.",
    accent: phaseAccent.handover.accent,
    ringColor: phaseAccent.handover.ringColor,
    objectives: [
      "Install the quarterly governance review cadence with the Council.",
      "Launch role-based training and measure completion / assessment scores.",
      "Deliver the executive dashboard, board reporting pack, and 12-month roadmap.",
    ],
    artifacts: [
      {
        number: "5.1",
        title: "Quarterly Governance Review Template",
        owner: "TechFides → Internal PM",
      },
      {
        number: "5.2",
        title: "Adoption Playbook",
        owner: "Change Management",
      },
      {
        number: "5.3",
        title: "Role-Based Training Curriculum",
        owner: "L&D",
      },
      { number: "6.1", title: "Executive AI Dashboard", owner: "TechFides" },
      {
        number: "6.2",
        title: "Board Reporting Pack",
        owner: "Executive Sponsor",
      },
      { number: "6.3", title: "12-Month AI Roadmap", owner: "Executive Team" },
    ],
    gate: {
      name: "Gate E — Handover Certified",
      criteria: [
        "First quarterly governance review executed against the template with full Council attendance.",
        "Training completion ≥90% across in-scope roles; assessment pass rate ≥80%.",
        "Board reporting pack delivered and a 12-month roadmap approved with budget envelope.",
      ],
    },
    stakeholders: [
      "Board / Audit Committee",
      "Executive Sponsor",
      "Internal Program Owner (post-handover)",
      "Retainer sponsor (ongoing governance)",
    ],
    risks: [
      "Handover ends with no internal owner named — the program dies at month four.",
      "Training is generic, not role-based — engineers get the same content as sales reps.",
      "Board pack is consulting output, not operating artifacts — loses credibility on the second review.",
    ],
  },
];

type MasterRow = {
  number: string;
  title: string;
  module: string;
  target: string;
  owner: string;
  gate: string;
};

const masterSchedule: MasterRow[] = [
  {
    number: "1.1",
    title: "AI Acceptable Use Policy",
    module: "Policy Core",
    target: "Week 2",
    owner: "General Counsel",
    gate: "A",
  },
  {
    number: "1.2",
    title: "RACI for AI Decisions",
    module: "Policy Core",
    target: "Week 2",
    owner: "Executive Sponsor",
    gate: "A",
  },
  {
    number: "1.3",
    title: "AI Risk Register",
    module: "Policy Core",
    target: "Week 5",
    owner: "Risk / Compliance",
    gate: "B",
  },
  {
    number: "2.1",
    title: "Data Classification & AI Data Map",
    module: "Shield",
    target: "Week 4",
    owner: "CISO",
    gate: "B",
  },
  {
    number: "2.2",
    title: "Vendor & Tool Risk Assessments",
    module: "Shield",
    target: "Week 5",
    owner: "Procurement + CISO",
    gate: "B",
  },
  {
    number: "2.3",
    title: "AI Incident Response Runbook",
    module: "Shield",
    target: "Week 7",
    owner: "CISO + Legal",
    gate: "C",
  },
  {
    number: "3.1",
    title: "AI Inventory Dashboard",
    module: "Signal",
    target: "Week 2 (initial), ongoing",
    owner: "IT + TechFides",
    gate: "A",
  },
  {
    number: "3.2",
    title: "Shadow AI Scan (diagnostic) + Remediation",
    module: "Signal",
    target: "Week 8 close-out",
    owner: "IT + TechFides",
    gate: "C",
  },
  {
    number: "3.3",
    title: "Value & Spend Tracker",
    module: "Signal",
    target: "Week 8",
    owner: "Finance + IT",
    gate: "C",
  },
  {
    number: "4.1",
    title: "Governed Workflow Automations",
    module: "Deploy",
    target: "Week 10",
    owner: "TechFides + Process Owners",
    gate: "D",
  },
  {
    number: "4.2",
    title: "Prompt & Template Library",
    module: "Deploy",
    target: "Week 10",
    owner: "Knowledge Ops",
    gate: "D",
  },
  {
    number: "4.3",
    title: "SOP Updates for AI-Assisted Work",
    module: "Deploy",
    target: "Week 10",
    owner: "Operations",
    gate: "D",
  },
  {
    number: "5.1",
    title: "Quarterly Governance Review Template",
    module: "Cadence",
    target: "Week 11",
    owner: "TechFides → Internal PM",
    gate: "E",
  },
  {
    number: "5.2",
    title: "Adoption Playbook",
    module: "Cadence",
    target: "Week 11",
    owner: "Change Management",
    gate: "E",
  },
  {
    number: "5.3",
    title: "Role-Based Training Curriculum",
    module: "Cadence",
    target: "Week 12",
    owner: "L&D",
    gate: "E",
  },
  {
    number: "6.1",
    title: "Executive AI Dashboard",
    module: "Brief",
    target: "Week 12",
    owner: "TechFides",
    gate: "E",
  },
  {
    number: "6.2",
    title: "Board Reporting Pack",
    module: "Brief",
    target: "Week 12",
    owner: "Executive Sponsor",
    gate: "E",
  },
  {
    number: "6.3",
    title: "12-Month AI Roadmap",
    module: "Brief",
    target: "Week 12",
    owner: "Executive Team",
    gate: "E",
  },
];

const weeklyCadence = [
  {
    name: "Steering Committee",
    frequency: "Weekly · 60 min",
    attendees: "Executive Sponsor, CISO, General Counsel, TechFides Partner",
    purpose:
      "Gate progress, unblock decisions, own scope changes and slippage. The only forum authorized to move a gate date.",
  },
  {
    name: "Delivery Stand-up",
    frequency: "Twice weekly · 20 min",
    attendees: "TechFides lead, workstream owners, client PM",
    purpose:
      "Surface blockers within 48 hours. No status theater — if there is nothing to decide, cancel the stand-up.",
  },
  {
    name: "Council Review",
    frequency: "Bi-weekly · 90 min",
    attendees: "AI Governance Council (full)",
    purpose:
      "Approve artifacts, ratify risk acceptances, and review the inventory delta. This is the body of record for governance decisions.",
  },
  {
    name: "Executive Readout",
    frequency: "End of each phase",
    attendees: "Executive Sponsor + designated execs",
    purpose:
      "Walk the phase gate evidence, approve the go-decision for the next phase, and ratify any scope changes.",
  },
];

export default function NinetyDayRoadmap() {
  return (
    <ArtifactShell
      module="Diagnostic Engagement"
      moduleAccent="text-accent-green"
      artifactNumber="D.3"
      title="90-Day Governance Roadmap"
      subtitle="The phase-by-phase delivery plan that converts the diagnostic findings into a governed AI operating model in 12 weeks."
      classification="CLIENT-RESTRICTED"
    >
      <ArtifactSection
        number="1"
        title="Purpose & How to Use"
        intent="Give the Executive Sponsor and the Council a single, contract-grade roadmap they can hold TechFides — and themselves — accountable to. This is not a plan of intentions. It is a delivery commitment with gated evidence."
      >
        <p className="text-sm text-slate-300">
          The roadmap converts the findings from the 2-week diagnostic
          (Stakeholder Interviews, Shadow AI Scan, 6-Layer Gap Assessment) into
          a 90-day execution sequence. Each phase ends at a gate that must be
          passed on evidence — not intent — before the next phase begins.
        </p>
        <p className="text-sm text-slate-300">
          Use this document three ways: (1) as the Statement of Work backbone
          signed at engagement kickoff; (2) as the weekly steering committee
          agenda; (3) as the evidence log the board will review at the 90-day
          handover.
        </p>
        <GuidanceCallout>
          Do not present this roadmap as &quot;flexible.&quot; Flexibility comes
          from scope trades inside a phase — not from moving gates. Moving a
          gate requires a written change request ratified by the steering
          committee, with a revised date and a stated cost-of-delay. That
          discipline is what makes the roadmap defensible to a board.
        </GuidanceCallout>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1, MANAGE-1" },
            { name: "ISO 42001", control: "Clause 6 · Planning" },
            { name: "SOC 2", control: "CC2.2, CC3.4" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Engagement Shape"
        intent="Name the structure before naming the weeks. The shape is four phases, five gates, one steering committee."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-navy-900/30 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
              Phase A
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-100">
              Stand Up · Weeks 1–5
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Authority, visibility, and the policy baseline. Ends with Gate B
              (Risk Surface Mapped).
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-navy-900/30 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
              Phase B
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-100">
              Harden · Weeks 6–8
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Incident readiness, shadow AI closure, spend instrumentation.
              Ends with Gate C (Incident-Ready).
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-navy-900/30 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-green">
              Phase C
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-100">
              Scale · Weeks 9–10
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Governed workflows, prompt library, SOP rewires. Ends with Gate D
              (Production Workflows).
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-navy-900/30 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-amber">
              Phase D
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-100">
              Handover · Weeks 11–12
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Cadence, training, executive and board reporting. Ends with Gate
              E (Handover Certified).
            </p>
          </div>
        </div>
        <GuidanceCallout>
          If a client pushes to compress below 12 weeks, compress scope — not
          gates. Dropping artifacts is honest; moving gates silently is how
          programs fail at month four.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Phase-by-Phase Plan"
        intent="For each week block: theme, objectives, artifacts produced, the gate that closes it, stakeholders on the hook, and the risks that most often derail it."
        pageBreak
      >
        <div className="space-y-8">
          {weeks.map((w) => (
            <div
              key={w.week}
              className={`rounded-lg border ${w.ringColor} bg-navy-900/20 p-6`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${w.accent}`}
                  >
                    {w.phase}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-100">
                    {w.week}
                  </h3>
                </div>
                <span className="text-xs italic text-slate-400">
                  {w.theme}
                </span>
              </div>

              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Objectives
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
                    {w.objectives.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Artifacts Produced
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                    {w.artifacts.map((a) => (
                      <li key={a.number} className="flex gap-3">
                        <span className="font-mono text-xs text-slate-500">
                          {a.number}
                        </span>
                        <span className="flex-1">
                          {a.title}
                          <span className="block text-xs text-slate-500">
                            Owner: {a.owner}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 rounded-md border border-electric-500/30 bg-electric-500/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
                  {w.gate.name}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {w.gate.criteria.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    On the Hook
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {w.stakeholders.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    Typical Derailers
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {w.risks.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Master Artifact Schedule"
        intent="The 18 Core artifacts, cross-referenced to week, owner, and closing gate. This is the delivery contract."
        pageBreak
      >
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Artifact</th>
                <th className="px-4 py-3 font-semibold">Module</th>
                <th className="px-4 py-3 font-semibold">Target</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {masterSchedule.map((row) => (
                <tr key={row.number} className="hover:bg-navy-900/30">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {row.number}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{row.module}</td>
                  <td className="px-4 py-3 text-slate-400">{row.target}</td>
                  <td className="px-4 py-3 text-slate-400">{row.owner}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-sm border border-electric-500/40 bg-electric-500/5 px-2 py-0.5 font-mono text-xs font-bold text-electric-400">
                      {row.gate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GuidanceCallout>
          Owners in this table are named roles, not names. Before the roadmap
          is signed, convert every &quot;Owner&quot; cell to a named individual
          with written acceptance. A role cannot be escalated to; a person can.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Operating Cadence"
        intent="The meeting cadence that runs underneath the roadmap. Four forums, each with a specific decision they are authorized to make."
      >
        <div className="space-y-3">
          {weeklyCadence.map((c) => (
            <div
              key={c.name}
              className="rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-100">
                  {c.name}
                </h3>
                <span className="text-xs font-medium text-electric-400">
                  {c.frequency}
                </span>
              </div>
              <p className="mt-1 text-xs italic text-slate-500">
                {c.attendees}
              </p>
              <p className="mt-2 text-sm text-slate-300">{c.purpose}</p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Success Criteria at Day 90"
        intent="How the board will judge whether the engagement delivered. These criteria are stated up front so they cannot be renegotiated in arrears."
      >
        <SubSection title="Governance">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              AI Governance Council has met at least six times, with minutes
              and decisions logged.
            </li>
            <li>
              Acceptable Use Policy acknowledged by 100% of in-scope employees;
              new-hire acknowledgment wired into onboarding.
            </li>
            <li>
              AI Risk Register maintained with ≥25 risks, owners, and review
              dates; quantified exposure stated in dollars.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Security & Trust">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              P0 Shadow AI findings closed or accepted with compensating
              controls on file.
            </li>
            <li>
              Incident Response Runbook exercised; after-action report filed;
              gaps scheduled.
            </li>
            <li>
              Vendor Risk Assessments complete for all P0/P1 tools; a running
              backlog established for P2/P3.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Adoption & Value">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              At least 3 governed workflows live in production with documented
              before/after metrics.
            </li>
            <li>
              Training completion ≥90% across in-scope roles; assessment pass
              rate ≥80%.
            </li>
            <li>
              Value & Spend tracker reconciled to finance; ROI stated in
              realized productivity, not hypothetical hours.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Board-Readiness">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Board Reporting Pack delivered, including incident summary,
              inventory delta, ROI, and risk posture.
            </li>
            <li>
              12-Month AI Roadmap ratified by the executive team with budget
              envelope and milestone dates.
            </li>
            <li>
              Internal owner named and accepting responsibility for the
              ongoing governance cadence beyond day 90.
            </li>
          </ul>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Commercial Terms & Handover"
        intent="Stated explicitly because they affect the work. No ambiguity between engagement end and governance start."
      >
        <SubSection title="Scope">
          <p>
            This roadmap covers the 12-week Core Implementation engagement
            following the 2-week Diagnostic. It explicitly does not include
            platform selection, custom model training, or implementation of
            controls inside third-party SaaS tools that require vendor
            engagement beyond the scope of this contract. Those are scoped as
            Phase 2 initiatives in the 12-Month Roadmap.
          </p>
        </SubSection>
        <SubSection title="Handover on Day 90">
          <p>
            On the last day of week 12, TechFides transfers operating
            ownership to <Placeholder>INTERNAL PROGRAM OWNER NAME</Placeholder>
            . Artifacts, evidence logs, and council minutes are deposited in
            the client&apos;s designated system of record. TechFides retains no
            working copies except those specified in the data retention rider.
          </p>
        </SubSection>
        <SubSection title="Post-Engagement Retainer (optional)">
          <p>
            Continued governance cadence, quarterly reviews, and on-call
            advisory are delivered under the AEGIS Governance Retainer. The
            retainer is priced separately and is not required — but without
            it, the cadence is the client&apos;s to run alone.
          </p>
        </SubSection>
        <GuidanceCallout>
          Be direct in the handover conversation. Most governance programs
          decay in months 4–6 after a consultant leaves. Name that pattern out
          loud in the retainer discussion; clients who refuse a retainer but
          also have no named internal owner are at high risk of failure, and
          TechFides should say so on record.
        </GuidanceCallout>
      </ArtifactSection>
    </ArtifactShell>
  );
}
