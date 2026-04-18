"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type AutonomyTier = "T1" | "T2" | "T3" | "T4";

const autonomyTiers: Array<{
  tier: AutonomyTier;
  name: string;
  description: string;
  humanRole: string;
  examples: string;
  color: string;
}> = [
  {
    tier: "T1",
    name: "Assistive",
    description:
      "AI produces a draft; human accepts, edits, or discards every output before it leaves the workflow.",
    humanRole: "Author of record. AI never acts without explicit human commit.",
    examples: "Email drafting, meeting summaries, research briefs.",
    color: "border-accent-green/50 bg-accent-green/10 text-accent-green",
  },
  {
    tier: "T2",
    name: "Reviewed",
    description:
      "AI produces an output that proceeds only after a checkpoint review by a named role. Rejection is cheap; approval is logged.",
    humanRole:
      "Reviewer of record. Must confirm classification, factual accuracy, and policy fit at the checkpoint.",
    examples:
      "Contract redline suggestions, support-ticket responses on common categories, marketing copy for Tier-2 channels.",
    color: "border-indigo-500/50 bg-indigo-500/10 text-indigo-300",
  },
  {
    tier: "T3",
    name: "Monitored",
    description:
      "AI executes autonomously in production. Human oversight is by sampling and by exception — outputs are monitored, not pre-approved.",
    humanRole:
      "Accountable owner reviews aggregate outputs, error rate, and outliers weekly or monthly per the workflow spec.",
    examples:
      "Data enrichment, ticket routing, pricing draft generation, first-touch triage.",
    color: "border-accent-amber/50 bg-accent-amber/10 text-accent-amber",
  },
  {
    tier: "T4",
    name: "Autonomous",
    description:
      "AI acts end-to-end on decisions with real-world effect. Permitted only with model-level evaluation, hard guardrails, and rollback.",
    humanRole:
      "Off the hot path. Oversees via control-plane dashboards and kill-switch authority.",
    examples:
      "Automated refunds under threshold, scheduled content publishing, inventory rebalancing within policy band.",
    color: "border-rose-500/50 bg-rose-500/10 text-rose-300",
  },
];

type WorkflowSpec = {
  id: string;
  name: string;
  owner: string;
  tier: AutonomyTier;
  tool: string;
  dataClass: string;
  trigger: string;
  outputs: string;
  guardrails: string[];
  checkpoint: string;
  metrics: string;
};

const workflowLibrary: WorkflowSpec[] = [
  {
    id: "WF-01",
    name: "Contract Review Assistant",
    owner: "General Counsel",
    tier: "T2",
    tool: "Claude for Work",
    dataClass: "P1 (counterparty contract)",
    trigger: "New contract uploaded to CLM with tag 'AI-review'.",
    outputs:
      "Redline summary, risk flags against the playbook, suggested rewrites with clause citations.",
    guardrails: [
      "No filings, no outbound communication to counterparty.",
      "Privileged material excluded by CLM workflow tag.",
      "All citations linked to source clause — unsourced suggestions rejected.",
    ],
    checkpoint: "Contract attorney reviews every output before any edit is sent.",
    metrics:
      "Redline accuracy (vs. attorney gold standard), time saved, missed-issue rate at 90 days post-execution.",
  },
  {
    id: "WF-02",
    name: "Proposal Response Copilot",
    owner: "VP Sales",
    tier: "T2",
    tool: "ChatGPT Enterprise + internal knowledge base",
    dataClass: "P2 (internal), no P0/P1",
    trigger: "New RFP imported to opportunity record.",
    outputs:
      "Draft responses to each RFP question keyed to approved proposal library, gap list for manual response.",
    guardrails: [
      "Responses drawn only from approved library snippets — no free-form marketing claims.",
      "Pricing, SLA, and security sections excluded from AI generation.",
      "Final document regenerated from approved snippets after editor accepts.",
    ],
    checkpoint:
      "Proposal manager reviews full draft before it leaves the tool; Sales Engineering reviews technical sections.",
    metrics: "Turnaround time, win rate on AI-assisted vs. control, editor rework hours.",
  },
  {
    id: "WF-03",
    name: "Support Ticket Triage",
    owner: "VP Customer",
    tier: "T3",
    tool: "Zendesk AI + internal routing rules",
    dataClass: "P2 (customer-submitted ticket content, scrubbed of PII).",
    trigger: "New ticket enters queue.",
    outputs:
      "Category, priority, owning team, suggested first response pulled from library.",
    guardrails: [
      "PII stripped at ingress before any AI processing.",
      "Any ticket flagged 'regulated' routed to human queue with no AI touch.",
      "Suggested responses tagged as such — agent must approve before send.",
    ],
    checkpoint:
      "Weekly sample review of 50 routed tickets + misroute rate audit.",
    metrics: "Routing accuracy, first-response time, CSAT on AI-assisted vs. manual.",
  },
  {
    id: "WF-04",
    name: "Engineering Code Assistant",
    owner: "VP Engineering",
    tier: "T2",
    tool: "GitHub Copilot Business",
    dataClass: "P2 code; P1 only in flagged private repos per policy 1.1.",
    trigger: "Developer invokes suggestion in IDE.",
    outputs: "Code suggestion inline, unit test suggestion, PR description draft.",
    guardrails: [
      "Disabled in repos containing secrets, customer data, or unlicensed third-party code.",
      "Suggested dependencies auto-scanned for license + CVE before merge.",
      "No push directly to protected branches — review required.",
    ],
    checkpoint:
      "PR review by second engineer — AI origin noted in PR template but not a separate approval gate.",
    metrics: "PR cycle time, revert rate on AI-originated code, test coverage delta.",
  },
  {
    id: "WF-05",
    name: "Meeting Notes & Action Items",
    owner: "Chief of Staff",
    tier: "T1",
    tool: "Otter.ai Business",
    dataClass: "P2 only. Never legal, HR, customer calls, or board.",
    trigger: "Bot invited to meeting by meeting owner.",
    outputs:
      "Transcript, summary, action item list attributed to named attendees.",
    guardrails: [
      "Explicit participant consent captured at meeting start.",
      "Auto-stop on any statement flagged as privileged or HR-sensitive.",
      "30-day retention; no long-term storage without owner action.",
    ],
    checkpoint: "Meeting owner edits and distributes notes — AI output is never sent unedited.",
    metrics:
      "Summary fidelity (spot-check), action-item hit rate, consent-capture compliance.",
  },
  {
    id: "WF-06",
    name: "Pricing Draft Generation",
    owner: "VP Finance",
    tier: "T3",
    tool: "Internal pricing engine + Claude API",
    dataClass: "P1 (deal-specific), processed in a tenant-isolated environment.",
    trigger: "Opportunity moves to 'Pricing' stage.",
    outputs:
      "Draft price sheet within configured band using product rules and deal attributes.",
    guardrails: [
      "Hard band limits enforced deterministically — AI cannot price outside.",
      "Any discount >15% or term >24 months routes to human approval.",
      "Output includes rationale and source inputs — no opaque pricing.",
    ],
    checkpoint:
      "AE reviews draft; Finance approves any exceptions; quarterly audit of band adherence.",
    metrics:
      "Pricing cycle time, band-adherence rate, approved-exception frequency.",
  },
  {
    id: "WF-07",
    name: "Refunds Under Threshold",
    owner: "VP Customer",
    tier: "T4",
    tool: "Internal automation + rules engine",
    dataClass: "P1 (transaction data), internal only.",
    trigger: "Customer refund request matching policy criteria.",
    outputs: "Refund executed within policy thresholds; notification to customer.",
    guardrails: [
      "Hard $ limit per transaction and per customer per month.",
      "Fraud signals auto-escalate to human queue regardless of value.",
      "Daily + weekly aggregate reporting with anomaly alerting.",
    ],
    checkpoint:
      "No per-transaction human review. Weekly statistical review + quarterly full audit by Finance.",
    metrics:
      "Rate within threshold, exception frequency, customer CSAT post-refund, abuse signals.",
  },
];

const autonomyStyle = (t: AutonomyTier) => {
  const entry = autonomyTiers.find((x) => x.tier === t);
  return entry?.color ?? "";
};

export default function GovernedWorkflowAutomationsPage() {
  return (
    <ArtifactShell
      module="Module 4 · Deploy"
      moduleAccent="text-cyan-400"
      artifactNumber="4.1"
      title="Governed Workflow Automations"
      subtitle="Library of AI-assisted workflows with autonomy tier, guardrails, checkpoints, and measurement — the operational layer where policy becomes practice."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="01"
        title="Purpose"
        intent="Deploy is where the first three modules meet the work. Every workflow here is an explicit contract: who owns it, what it is allowed to touch, where the human is, and how success is measured."
      >
        <SubSection title="What a governed workflow is">
          <p>
            A governed workflow is a named, owned, documented path through
            which AI contributes to real work under explicit controls. Ad-hoc
            AI use lives under Policy 1.1 — the workflows in this artifact
            are the sanctioned, repeatable patterns that do not require
            case-by-case approval.
          </p>
        </SubSection>

        <SubSection title="What this artifact is not">
          <ul className="list-disc space-y-1 pl-5">
            <li>Not an exhaustive list of every AI interaction — those belong under the Acceptable Use Policy.</li>
            <li>Not technical documentation of the integration — those live in engineering systems and are referenced here.</li>
            <li>Not a prompt library — prompts reside in Artifact 4.2 and are referenced by workflow ID.</li>
          </ul>
        </SubSection>

        <GuidanceCallout>
          Resist the pull to document everything. Twelve well-governed
          workflows that people actually run will do more for the client than
          fifty aspirational entries. Build the template around the work
          already happening, not the work you wish was.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="02"
        title="Autonomy Tiers"
        intent="The tier is the single most important attribute on every workflow — it dictates oversight, logging, and the escalation path."
      >
        <div className="space-y-4">
          {autonomyTiers.map((t) => (
            <div
              key={t.tier}
              className="rounded-md border border-slate-800 bg-navy-900/30 p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`inline-block rounded-sm border px-2 py-1 text-xs font-bold uppercase tracking-widest ${t.color}`}
                >
                  {t.tier} · {t.name}
                </span>
              </div>
              <p className="mb-3 text-sm text-slate-300">{t.description}</p>
              <p className="mb-1 text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-widest text-slate-500">
                  Human role ·{" "}
                </span>
                {t.humanRole}
              </p>
              <p className="text-xs italic text-slate-500">Examples — {t.examples}</p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="03"
        title="Workflow Specification Template"
        intent="Every entry in the library carries the same eleven fields. Any entry missing a field is not in service."
      >
        <div className="rounded-md border border-slate-800 bg-navy-900/20 p-6">
          <dl className="grid gap-x-6 gap-y-4 md:grid-cols-2">
            {[
              ["Workflow ID", "WF-NN (unique, stable)"],
              ["Name", "Short, action-oriented"],
              ["Owner", "Named accountable individual"],
              ["Autonomy Tier", "T1 / T2 / T3 / T4"],
              ["Tool(s)", "References inventory IDs (Artifact 3.1)"],
              ["Data Classes", "Per Artifact 2.1 — P0/P1/P2/P3 allowed"],
              ["Trigger", "Precisely what kicks off the workflow"],
              ["Outputs", "What the workflow produces and for whom"],
              ["Guardrails", "Explicit prohibitions + enforcement mechanism"],
              ["Human Checkpoint", "Where and by whom oversight happens"],
              ["Metrics", "Success + risk measures, cadence, threshold"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {k}
                </dt>
                <dd className="mt-1 text-sm text-slate-300">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="04"
        title="Workflow Library"
        intent="Seven example workflows spanning all four autonomy tiers. Clients typically ship 8–15 workflows through the AEGIS program in the first year."
        pageBreak
      >
        <div className="space-y-6">
          {workflowLibrary.map((w) => (
            <div
              key={w.id}
              className="rounded-md border border-slate-800 bg-navy-900/20 p-5"
            >
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-cyan-400">{w.id}</span>
                  <h4 className="text-base font-bold text-slate-100">{w.name}</h4>
                </div>
                <span
                  className={`inline-block rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${autonomyStyle(w.tier)}`}
                >
                  {w.tier} · {autonomyTiers.find((t) => t.tier === w.tier)?.name}
                </span>
              </div>

              <dl className="grid gap-x-6 gap-y-3 text-sm md:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Owner</dt>
                  <dd className="mt-0.5 text-slate-300">{w.owner}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tool</dt>
                  <dd className="mt-0.5 text-slate-300">{w.tool}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Data Class</dt>
                  <dd className="mt-0.5 text-slate-300">{w.dataClass}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Trigger</dt>
                  <dd className="mt-0.5 text-slate-300">{w.trigger}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Outputs</dt>
                  <dd className="mt-0.5 text-slate-300">{w.outputs}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Guardrails</dt>
                  <dd className="mt-0.5">
                    <ul className="list-disc space-y-1 pl-5 text-slate-300">
                      {w.guardrails.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Human Checkpoint
                  </dt>
                  <dd className="mt-0.5 text-slate-300">{w.checkpoint}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Metrics</dt>
                  <dd className="mt-0.5 text-slate-300">{w.metrics}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="05"
        title="Lifecycle"
        intent="A workflow is never 'done.' These five phases keep the library honest over time."
      >
        <SubSection title="1 · Design">
          <p>
            Owner drafts the spec against this template. Governance Lead
            reviews autonomy tier and guardrails. Engineering confirms
            technical feasibility.
          </p>
        </SubSection>
        <SubSection title="2 · Pilot">
          <p>
            Run in a bounded environment against synthetic or low-impact
            real data for a fixed window. Metrics baselined. Failure modes
            documented.
          </p>
        </SubSection>
        <SubSection title="3 · Launch">
          <p>
            Production deployment following sign-off by Owner, Governance
            Lead, and affected function head. Entry in Prompt Library (4.2)
            and relevant SOPs (4.3) published in the same release.
          </p>
        </SubSection>
        <SubSection title="4 · Operate">
          <p>
            Continuous telemetry against the stated metrics. Weekly review
            by Owner; monthly review in Governance Committee; quarterly
            inclusion in Board Pack (6.2).
          </p>
        </SubSection>
        <SubSection title="5 · Retire">
          <p>
            Triggered by ROI failure (Artifact 3.3), regulatory shift, or
            tool retirement (3.1). Access revoked, artifacts archived, SOPs
            updated. Lessons learned folded into the next design.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="06"
        title="Escalation & Exceptions"
        intent="When reality diverges from the spec, these paths catch it before it becomes an incident."
      >
        <SubSection title="Owner-initiated exception">
          <p>
            Temporary deviation from the spec to handle a specific case.
            Bounded in scope and time, logged, reviewed at the next
            governance meeting. Recurring exceptions are a signal to update
            the spec.
          </p>
        </SubSection>
        <SubSection title="Guardrail breach">
          <p>
            Any automated signal that the workflow operated outside its
            stated guardrails is a SEV-3 incident at minimum (Artifact 2.3).
            Runbook applies. Workflow is paused pending root cause.
          </p>
        </SubSection>
        <SubSection title="Drift">
          <p>
            Metric trends outside tolerance over two review cycles trigger
            mandatory re-design review. Owner has 60 days to bring the
            workflow back within tolerance or recommend retirement.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="07"
        title="Regulatory Mapping"
        intent="Governed workflow documentation is increasingly a line-item in customer security reviews and regulatory assurance exercises."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "MANAGE-1.3 / MEASURE-2.7" },
            { name: "ISO 42001", control: "Clause 8 / Annex A.6" },
            { name: "SOC 2", control: "CC6.1 / CC7.2 / CC8.1" },
            { name: "EU AI Act", control: "Art. 9 / 14 / 17" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
