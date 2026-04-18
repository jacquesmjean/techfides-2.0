"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type Severity = {
  level: "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4";
  name: string;
  triggers: string[];
  response: string;
  notify: string;
  sla: string;
  color: string;
};

const severities: Severity[] = [
  {
    level: "SEV-1",
    name: "Critical",
    triggers: [
      "Regulated data (PHI/PII/payment) confirmed exposed outside approved boundary.",
      "Customer-facing AI produces defamatory, harmful, or regulated-advice output in production.",
      "Trade-secret or proprietary algorithm confirmed sent to a non-approved AI tool.",
    ],
    response:
      "Declare immediately. Executive Sponsor and General Counsel paged. Incident Commander stands up the incident room.",
    notify:
      "Executive Sponsor + General Counsel + CISO + AI Governance Lead + affected function lead — within 30 minutes of detection.",
    sla: "Initial written update to Sponsor within 2 hours; hourly updates thereafter until containment.",
    color: "border-rose-500/60 bg-rose-500/10 text-rose-300",
  },
  {
    level: "SEV-2",
    name: "Major",
    triggers: [
      "Confidential (P1) data sent to an approved AI tool but with configuration error (retention, tenant).",
      "Model version change in production workflow causing material output regression.",
      "Vendor subprocessor change that materially alters data residency without notification.",
    ],
    response:
      "Incident Commander assigned. Parallel tracks for technical remediation and stakeholder communications.",
    notify:
      "CISO + AI Governance Lead + function lead within 1 hour; Executive Sponsor informed within 4 hours.",
    sla: "Written update to stakeholders every 4 hours until resolution.",
    color: "border-accent-amber/60 bg-accent-amber/10 text-accent-amber",
  },
  {
    level: "SEV-3",
    name: "Moderate",
    triggers: [
      "Internal (P2) data sent to a consumer AI tool by an employee.",
      "Hallucination or error in AI-assisted deliverable caught pre-delivery but with downstream rework required.",
      "Governed workflow kill switch triggered but no customer impact.",
    ],
    response:
      "On-call responder investigates, documents, and remediates within a named working window.",
    notify:
      "AI Governance Lead within 4 business hours; function lead same day.",
    sla: "After-action note within 5 business days.",
    color: "border-electric-500/60 bg-electric-500/10 text-electric-300",
  },
  {
    level: "SEV-4",
    name: "Near-miss / Control Signal",
    triggers: [
      "Shadow AI usage discovered and self-reported before data movement.",
      "Policy ambiguity prevented an employee from knowing whether a use was permitted.",
      "Tool monitoring surfaces unusual prompt patterns investigated and found benign.",
    ],
    response: "Log, review, and feed into the quarterly Council review.",
    notify: "AI Governance Lead weekly digest.",
    sla: "Addressed in the next Council meeting.",
    color: "border-slate-600 bg-slate-800/40 text-slate-300",
  },
];

type PhaseStep = {
  title: string;
  owner: string;
  steps: string[];
};

const phases: PhaseStep[] = [
  {
    title: "Phase 1 · Detect",
    owner: "Every Employee + On-call + CISO monitoring",
    steps: [
      "Any employee can raise an incident through the AI Incident hotline or the #ai-incidents channel — retaliation for good-faith reports is prohibited and tracked by the Council.",
      "Automated detection from tool telemetry, DLP, or SaaS discovery feeds the CISO on-call queue.",
      "Every raised signal receives an acknowledgment within 30 minutes, 24/7, and a severity rating within 2 hours.",
    ],
  },
  {
    title: "Phase 2 · Triage",
    owner: "Incident Commander (Governance Lead or CISO delegate)",
    steps: [
      "Incident Commander opens an incident ticket with a unique ID, severity, and initial summary.",
      "Affected data classifications identified and scope bounded: what data, what tools, which users, since when.",
      "Decide: is this a SEV-1? If so, page the full leadership chain now — do not wait for more evidence.",
    ],
  },
  {
    title: "Phase 3 · Contain",
    owner: "CISO + affected function lead",
    steps: [
      "Revoke tool access for the involved accounts if data movement is suspected in progress.",
      "Disable the offending integration, kill switch the workflow, or pin the model version as applicable.",
      "Preserve evidence: prompts, outputs, logs, audit trails. Do not 'clean up' the scene.",
      "Notify affected vendors if their infrastructure is implicated; request subprocessor cooperation.",
    ],
  },
  {
    title: "Phase 4 · Investigate",
    owner: "Incident Commander + CISO + General Counsel",
    steps: [
      "Reconstruct the timeline: first occurrence, detection time, what the condition produced.",
      "Identify the root condition, not just the proximate trigger. Classify as policy gap, control failure, vendor failure, or human error.",
      "Assess legal exposure: regulatory notification obligations, client contractual notifications, insurance triggers.",
      "Draft the internal incident narrative and the external communication plan in parallel.",
    ],
  },
  {
    title: "Phase 5 · Notify",
    owner: "General Counsel + Executive Sponsor",
    steps: [
      "Regulatory notifications in the required window (see §5 matrix). If uncertain, escalate to outside counsel.",
      "Customer / client notifications per contract. Standard practice: notify within 72 hours of confirmed material impact.",
      "Internal notification to affected employees, with guidance on what they can and cannot say publicly.",
      "Board notification if incident meets materiality threshold (see §6).",
    ],
  },
  {
    title: "Phase 6 · Remediate",
    owner: "CISO + function lead + Governance Lead",
    steps: [
      "Close the immediate vulnerability: configuration fix, access revocation, policy clarification, tool removal.",
      "Verify closure with an independent check — the person who remediated cannot be the person who verifies.",
      "Track remediation tasks in the engagement's system of record; do not rely on chat-thread follow-through.",
    ],
  },
  {
    title: "Phase 7 · After-Action",
    owner: "Governance Lead + Incident Commander",
    steps: [
      "Within 5 business days for SEV-1/SEV-2, 10 for SEV-3: deliver a written after-action report (template in §7).",
      "Identify the systemic change required: policy update, control redesign, training gap, vendor change.",
      "File at least one durable action item with a named owner and a due date.",
      "Present the after-action at the next Council meeting; reference it in the quarterly board pack.",
    ],
  },
];

export default function AIIncidentResponseRunbook() {
  return (
    <ArtifactShell
      module="AEGIS Shield"
      moduleAccent="text-purple-400"
      artifactNumber="2.3"
      title="AI Incident Response Runbook"
      subtitle="The seven-phase playbook the organization runs the moment an AI incident is detected. Written to be usable at 2 a.m. — specific, named, and testable."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="1"
        title="Purpose"
        intent="Make the incident response path short, obvious, and rehearsed. The cost of a slow response to an AI incident is almost always larger than the cost of the incident itself."
      >
        <p className="text-sm text-slate-300">
          AI incidents are a new species with old shape. Like any incident
          they require detection, containment, notification, and learning —
          but they add specifics: prompt and output evidence, model version
          context, vendor subprocessor trails, and customer-facing output
          that may have already reached a user. This runbook adapts standard
          IR discipline to those specifics and reduces the response to seven
          named phases with named owners.
        </p>
        <GuidanceCallout>
          This runbook only earns trust the first time it is used. Run a
          tabletop on the highest-likelihood SEV-1 scenario within 30 days of
          adoption. The tabletop will surface the three gaps the Council
          must close before the real incident arrives.
        </GuidanceCallout>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "MANAGE-2, MANAGE-4" },
            { name: "ISO 42001", control: "Clause 10 · Improvement" },
            { name: "SOC 2", control: "CC7.3, CC7.4 · Incidents" },
            { name: "ISO 27001", control: "A.5.24–A.5.28 · IR" },
            { name: "GDPR", control: "Art. 33, 34 · Breach notification" },
            { name: "HIPAA", control: "§164.410 · BA breach" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Severity Ladder"
        intent="Four levels, triggers stated concretely, notification windows explicit."
        pageBreak
      >
        <div className="space-y-4">
          {severities.map((s) => (
            <div key={s.level} className={`rounded-lg border p-5 ${s.color}`}>
              <div className="flex items-baseline justify-between border-b border-slate-700/40 pb-3">
                <div>
                  <p className="font-mono text-xs font-bold tracking-widest">
                    {s.level}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-100">
                    {s.name}
                  </h3>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Triggers
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {s.triggers.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Immediate response
                    </p>
                    <p className="mt-1">{s.response}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Notify
                    </p>
                    <p className="mt-1">{s.notify}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Communication SLA
                    </p>
                    <p className="mt-1">{s.sla}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Incident Roles"
        intent="Small team, clear seats. The role is held for the duration of the incident regardless of seniority."
      >
        <dl className="space-y-3">
          {[
            {
              role: "Incident Commander",
              scope:
                "Runs the incident end-to-end. Authorized to make all tactical calls during the incident, including pulling production workflows offline. Typically the Governance Lead or a CISO-designated deputy.",
            },
            {
              role: "Technical Lead",
              scope:
                "Owns the technical investigation, evidence preservation, and remediation execution. Reports into the Incident Commander.",
            },
            {
              role: "Communications Lead",
              scope:
                "Owns internal status updates, drafts external communications for General Counsel review, and manages vendor communications.",
            },
            {
              role: "General Counsel",
              scope:
                "Owns regulatory and contractual obligation analysis, external counsel engagement, and privilege assertions.",
            },
            {
              role: "Executive Sponsor",
              scope:
                "Owns go/no-go for external communication, board notification, and public disclosure decisions.",
            },
            {
              role: "Scribe",
              scope:
                "Maintains a contemporaneous incident timeline — time-stamped entries for every action, decision, and inbound signal. The scribe's log is the evidence of record.",
            },
          ].map((r) => (
            <div
              key={r.role}
              className="rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <dt className="text-sm font-semibold text-slate-100">
                {r.role}
              </dt>
              <dd className="mt-1 text-sm text-slate-300">{r.scope}</dd>
            </div>
          ))}
        </dl>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Seven-Phase Response"
        intent="The operational sequence. Each phase has a named owner and the specific steps that must happen inside it."
        pageBreak
      >
        <div className="space-y-4">
          {phases.map((p, i) => (
            <div
              key={p.title}
              className="rounded-lg border border-slate-800 bg-navy-900/20 p-5"
            >
              <div className="flex items-baseline gap-4 border-b border-slate-800 pb-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-electric-500/40 bg-electric-500/10 font-mono text-xs font-bold text-electric-400">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {p.title}
                  </h3>
                  <p className="mt-0.5 text-xs italic text-slate-500">
                    Owner — {p.owner}
                  </p>
                </div>
              </div>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300">
                {p.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Notification Matrix"
        intent="Who must be told, by when, under which regime. When the runbook is activated, the Commander checks this matrix row by row."
      >
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">Trigger</th>
                <th className="px-3 py-3 font-semibold">Regime</th>
                <th className="px-3 py-3 font-semibold">Window</th>
                <th className="px-3 py-3 font-semibold">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {[
                {
                  t: "Personal data breach affecting EU data subjects",
                  r: "GDPR Art. 33",
                  w: "72 hours to supervisory authority",
                  o: "General Counsel + DPO",
                },
                {
                  t: "PHI breach affecting ≥500 individuals",
                  r: "HIPAA / HITECH",
                  w: "60 days to HHS + individuals",
                  o: "General Counsel + Privacy Officer",
                },
                {
                  t: "California residents PII exposed",
                  r: "CCPA / CPRA",
                  w: "Without unreasonable delay — typically 30–45 days",
                  o: "General Counsel",
                },
                {
                  t: "Client-contracted notification",
                  r: "Contractual",
                  w: "Per MSA — typically 24–72 hours",
                  o: "Engagement lead + General Counsel",
                },
                {
                  t: "Material incident — public company",
                  r: "SEC (if applicable)",
                  w: "4 business days from materiality determination",
                  o: "Executive Sponsor + Counsel + IR",
                },
                {
                  t: "Board notification — materiality met",
                  r: "Governance",
                  w: "Same day as materiality determination",
                  o: "Executive Sponsor",
                },
                {
                  t: "Vendor cooperation request",
                  r: "Vendor contract",
                  w: "Per contract — typically 24 hours",
                  o: "CISO",
                },
                {
                  t: "Insurance notification",
                  r: "Cyber / E&O policies",
                  w: "Per policy — typically 24–72 hours",
                  o: "General Counsel + Finance",
                },
              ].map((row) => (
                <tr key={row.t} className="hover:bg-navy-900/30">
                  <td className="px-3 py-3 font-medium text-slate-200">
                    {row.t}
                  </td>
                  <td className="px-3 py-3 text-slate-300">{row.r}</td>
                  <td className="px-3 py-3 text-slate-300">{row.w}</td>
                  <td className="px-3 py-3 text-slate-400">{row.o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GuidanceCallout>
          This matrix is a starting point, not a complete list. At onboarding
          for each new regulated engagement, the Governance Lead and General
          Counsel add the jurisdiction-specific regimes that apply and the
          exact statutory windows.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Materiality"
        intent="The materiality definition the Executive Sponsor uses to trigger board notification. Stated up front so there is no argument during an incident."
      >
        <p className="text-sm text-slate-300">
          An AI incident is material and requires board notification when any
          one of the following is true:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Confirmed exposure of regulated data (PHI / PII / payment /
            privileged) affecting <Placeholder>N</Placeholder> or more
            individuals or records.
          </li>
          <li>
            Financial impact (remediation, fines, legal) projected at{" "}
            <Placeholder>$ THRESHOLD</Placeholder> or greater.
          </li>
          <li>
            Regulatory inquiry, investigation, or formal notice to a
            regulator.
          </li>
          <li>
            Customer-facing AI output that causes harm, discrimination, or
            demonstrable financial injury to a named party.
          </li>
          <li>
            Public disclosure required under any applicable law, contract, or
            market obligation.
          </li>
        </ul>
        <GuidanceCallout>
          Boards dislike surprises more than they dislike bad news. When in
          doubt on materiality, notify. The downside of an unnecessary board
          note is minor; the downside of a board learning about a material
          incident from a newspaper is a governance incident itself.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="After-Action Report Template"
        intent="The structure every after-action follows. Filed in the engagement's system of record and reviewed at the next Council."
      >
        <div className="rounded-lg border border-slate-800 bg-navy-900/20 p-5 text-sm text-slate-300">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong>Incident ID & Severity.</strong> Unique ID, severity
              ladder entry, and effective period (start → containment →
              closure).
            </li>
            <li>
              <strong>Summary.</strong> Three sentences: what happened, what
              data / systems / people were involved, how it was detected.
            </li>
            <li>
              <strong>Timeline.</strong> Time-stamped events from first
              occurrence to closure, drawn from the scribe&apos;s log.
            </li>
            <li>
              <strong>Root condition.</strong> Not just the proximate trigger.
              What in the system made this possible? Classify as policy,
              control, vendor, or human-error.
            </li>
            <li>
              <strong>Impact assessment.</strong> Data scope, customer impact,
              regulatory implications, financial exposure (range).
            </li>
            <li>
              <strong>Response assessment.</strong> What went well. What went
              slowly. What would have failed under a larger incident.
            </li>
            <li>
              <strong>Durable changes.</strong> Policy updates, control
              changes, training requirements, vendor renegotiations — each
              with a named owner and due date.
            </li>
            <li>
              <strong>Notifications made.</strong> Regulatory, contractual,
              insurance, board. Date / method / recipient / acknowledgment.
            </li>
            <li>
              <strong>Risk register updates.</strong> Risks added, risks
              re-scored, risks closed.
            </li>
            <li>
              <strong>Sign-off.</strong> Incident Commander, CISO, General
              Counsel, Executive Sponsor.
            </li>
          </ol>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="8"
        title="Exercising the Runbook"
        intent="The runbook must be rehearsed. Unexercised runbooks are theater."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            <strong>Within 30 days of adoption —</strong> tabletop exercise
            on the highest-likelihood SEV-1 scenario. Attended by every named
            role. Scribe produces an after-action against this runbook as
            if it were a real incident.
          </li>
          <li>
            <strong>Semi-annually —</strong> tabletop on a rotating scenario
            (shadow AI exposure, model version regression, vendor
            subprocessor change, customer-facing output failure).
          </li>
          <li>
            <strong>Annually —</strong> a live simulation involving
            technical response, not just a paper exercise. Include a vendor
            notification dry-run.
          </li>
          <li>
            <strong>After every SEV-1 or SEV-2 —</strong> explicit review of
            whether this runbook held up. Revisions are tracked as version
            updates; the prior version is retained for audit.
          </li>
        </ul>
      </ArtifactSection>
    </ArtifactShell>
  );
}
