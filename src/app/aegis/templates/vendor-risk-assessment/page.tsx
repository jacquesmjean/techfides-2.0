"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type Question = {
  id: string;
  prompt: string;
  looking: string;
  redFlags: string[];
};

type Domain = {
  code: string;
  name: string;
  accent: string;
  intent: string;
  questions: Question[];
};

const domains: Domain[] = [
  {
    code: "D1",
    name: "Model & Training Data",
    accent: "text-electric-400",
    intent:
      "Understand what the model is, what it was trained on, and how changes are communicated.",
    questions: [
      {
        id: "D1-Q1",
        prompt:
          "Identify every model that will be used to serve our account, including provider, base model, version, and any fine-tuning or retrieval layers.",
        looking:
          "A concrete list — not marketing names. If the answer is 'we use the best model available', you have no contract.",
        redFlags: [
          "Vague 'proprietary model' language without a base provider named.",
          "Model selection advertised as automatic, with no change notification.",
        ],
      },
      {
        id: "D1-Q2",
        prompt:
          "What was the model trained on, and can you attest in writing that our prompts and outputs are not used to train current or future models?",
        looking:
          "A written attestation with scope (applies to our tenant, all tiers) and duration (binding for the contract term).",
        redFlags: [
          "Training exclusion is opt-in rather than default.",
          "Attestation silent on fine-tuning, evaluation, or support review workflows.",
        ],
      },
      {
        id: "D1-Q3",
        prompt:
          "How do you notify customers of model version changes, and what is the minimum notice?",
        looking:
          "Notice in days, with an ability to pin to a version for regulated use. Best-in-class: 30+ days for material changes, with changelog detail.",
        redFlags: [
          "Changes communicated via blog post only.",
          "No version-pinning option.",
        ],
      },
    ],
  },
  {
    code: "D2",
    name: "Data Handling & Retention",
    accent: "text-purple-400",
    intent:
      "Verify what happens to our data end to end. This is the domain that most often hides risk.",
    questions: [
      {
        id: "D2-Q1",
        prompt:
          "Describe the full data lifecycle: ingestion, processing, storage, logging, deletion. Where does data rest, and for how long?",
        looking:
          "A diagram or table with specific retention windows per artifact. Zero-retention options documented per tier.",
        redFlags: [
          "Retention stated as 'industry standard' without a number.",
          "Support agents have unrestricted access to prompts and outputs.",
        ],
      },
      {
        id: "D2-Q2",
        prompt:
          "Can data be processed within specified geographic regions, and do you bind the region to our tenant contractually?",
        looking:
          "Named data residency with a contractual commitment, not best-effort.",
        redFlags: [
          "Residency determined by performance routing and can change.",
          "Support and logs fall outside the residency commitment.",
        ],
      },
      {
        id: "D2-Q3",
        prompt:
          "List every subprocessor — including downstream inference providers and observability vendors — and your notification process for subprocessor changes.",
        looking:
          "A current subprocessor list, and a 15+ day notification window with our right to object.",
        redFlags: [
          "No subprocessor list provided.",
          "Subprocessor changes are one-sided; we have no objection right.",
        ],
      },
      {
        id: "D2-Q4",
        prompt:
          "On termination, what is your data deletion commitment, within what timeline, and how is deletion evidenced?",
        looking:
          "Written commitment with a specific timeline (e.g., 30 days) and a deletion certificate on request.",
        redFlags: [
          "Deletion stated as 'per our standard practice' without a certificate.",
        ],
      },
    ],
  },
  {
    code: "D3",
    name: "Security & Access",
    accent: "text-rose-400",
    intent: "Standard security hygiene plus AI-specific controls.",
    questions: [
      {
        id: "D3-Q1",
        prompt:
          "Provide your most recent SOC 2 Type II report, ISO 27001 certificate, and any other relevant attestations (HIPAA, PCI, FedRAMP, ISO 42001).",
        looking:
          "Current (within 12 months) reports under NDA, with scope matching the services we will consume.",
        redFlags: [
          "Reports are over 18 months old.",
          "Scope of the report excludes the services we plan to use.",
        ],
      },
      {
        id: "D3-Q2",
        prompt:
          "Describe the tenant isolation model. Can users from another tenant — through a prompt injection, shared embedding, or system prompt leak — observe our content?",
        looking:
          "Logical tenant isolation with named controls; best-in-class: dedicated inference or region-partitioned embeddings for regulated customers.",
        redFlags: [
          "Shared vector stores across customers without documented partitioning.",
          "System prompts visible across tenants.",
        ],
      },
      {
        id: "D3-Q3",
        prompt:
          "How are administrative and support personnel identified, authenticated, and logged when accessing tenant data — including prompts and outputs?",
        looking:
          "SSO, MFA, just-in-time access with approvals, full audit logs exportable to our SIEM on request.",
        redFlags: [
          "Standing support access with no customer-visible log.",
          "Shared support credentials.",
        ],
      },
    ],
  },
  {
    code: "D4",
    name: "Legal & Regulatory",
    accent: "text-accent-amber",
    intent:
      "Contractual commitments and the vendor's regulatory posture relative to ours.",
    questions: [
      {
        id: "D4-Q1",
        prompt:
          "Provide your Data Processing Agreement, Business Associate Agreement (if applicable), and AI-specific addendum.",
        looking:
          "Executable templates matched to our regulatory profile. For HIPAA, a signed BAA before any PHI flows.",
        redFlags: [
          "No AI addendum offered.",
          "BAA exists but carves out AI-related processing.",
        ],
      },
      {
        id: "D4-Q2",
        prompt:
          "For customers with EU AI Act obligations, do you provide the documentation needed for our compliance — and under what commercial model?",
        looking:
          "Documentation provided at no extra cost for covered obligations; clear statement of responsibility split.",
        redFlags: [
          "Compliance documentation behind a premium tier.",
          "Vendor disclaims all regulatory responsibility.",
        ],
      },
      {
        id: "D4-Q3",
        prompt:
          "Describe your IP indemnification for model output, including any carve-outs for fine-tuning, RAG, or customer-provided prompts.",
        looking:
          "Meaningful indemnification with caps disclosed; clear rules for staying within the indemnified path.",
        redFlags: [
          "No indemnification offered.",
          "Indemnification so narrow it effectively never applies.",
        ],
      },
    ],
  },
  {
    code: "D5",
    name: "Operational Reliability",
    accent: "text-accent-green",
    intent:
      "What happens when the vendor has an outage, a bug, or a silent model change.",
    questions: [
      {
        id: "D5-Q1",
        prompt:
          "Provide your uptime commitment, credit structure, and historical uptime for the past 12 months with incident summaries.",
        looking:
          "Specific SLA with credit model; historical data with root-cause narratives.",
        redFlags: [
          "No SLA.",
          "Historical data presented as percentages only, with no incident list.",
        ],
      },
      {
        id: "D5-Q2",
        prompt:
          "How will our team be notified of outages, degraded performance, and model behavior regressions? Through what channel, within what time?",
        looking:
          "Status page, API-queryable, plus proactive email within 15 minutes of incident detection.",
        redFlags: [
          "Notifications are best-effort Twitter posts.",
          "No API-queryable status.",
        ],
      },
      {
        id: "D5-Q3",
        prompt:
          "Describe the kill switch or override we have if a model version change degrades our production workflow.",
        looking:
          "Ability to pin to a prior version for at least 30 days, or revert via API.",
        redFlags: [
          "No customer-side rollback option.",
        ],
      },
    ],
  },
  {
    code: "D6",
    name: "Exit & Portability",
    accent: "text-indigo-400",
    intent: "Plan the departure at onboarding, not at renewal.",
    questions: [
      {
        id: "D6-Q1",
        prompt:
          "Describe the export format for all tenant data — prompts, outputs, embeddings, fine-tunes, telemetry — and the timeline to produce a full export on request.",
        looking:
          "Standard formats (JSON, CSV, documented schema) with a 10–15 business day turnaround.",
        redFlags: [
          "No export option for fine-tuned models.",
          "Export costs are priced per GB at punitive rates.",
        ],
      },
      {
        id: "D6-Q2",
        prompt:
          "What must we do to migrate to an alternative provider, and what commitments will you make to prevent lock-in?",
        looking:
          "A named migration path or an articulate acknowledgment of the trade-offs.",
        redFlags: [
          "Vendor refuses to discuss exit; 'that is not a conversation we have with customers.'",
        ],
      },
    ],
  },
];

type Signal =
  | "Green · Proceed"
  | "Yellow · Conditional"
  | "Red · Escalate"
  | "Black · Reject";

const overallSignals: { level: Signal; description: string; color: string }[] = [
  {
    level: "Green · Proceed",
    description:
      "No red flags. All P0/P1 controls verified. Proceed to contract with standard AEGIS redlines.",
    color: "border-accent-green/50 bg-accent-green/5 text-accent-green",
  },
  {
    level: "Yellow · Conditional",
    description:
      "Gaps that can be closed with contract language, compensating controls, or scoped usage. Council ratifies conditions; VRA re-reviewed at renewal.",
    color: "border-accent-amber/50 bg-accent-amber/5 text-accent-amber",
  },
  {
    level: "Red · Escalate",
    description:
      "Material gaps. Escalate to Executive Sponsor. Proceed only with a documented risk acceptance and a targeted mitigation plan.",
    color: "border-rose-500/50 bg-rose-500/5 text-rose-300",
  },
  {
    level: "Black · Reject",
    description:
      "Fundamental misalignment. The vendor does not meet baseline obligations and cannot be brought into compliance through contract. Do not proceed.",
    color: "border-slate-700 bg-slate-800/40 text-slate-300",
  },
];

export default function VendorRiskAssessment() {
  return (
    <ArtifactShell
      module="AEGIS Shield"
      moduleAccent="text-purple-400"
      artifactNumber="2.2"
      title="Vendor & Tool Risk Assessment"
      subtitle="The six-domain assessment every AI vendor passes before it goes on the approved list — and is re-assessed at every contract renewal. Questions with the specific evidence we accept, and the red flags that stop the conversation."
      classification="CLIENT-RESTRICTED"
    >
      <ArtifactSection
        number="1"
        title="Purpose"
        intent="Move vendor review from checkbox to diligence. This assessment is the tool that turns a procurement conversation into a governance decision."
      >
        <p className="text-sm text-slate-300">
          This assessment is required for every AI vendor before it is added
          to the approved tools list in the AUP (§1.1), and again at every
          contract renewal. Its questions are framed to elicit evidence —
          not reassurance — and are tagged with the specific red flags that,
          when observed, should stop the engagement or escalate it to the
          Council.
        </p>
        <GuidanceCallout>
          A vendor who cannot answer these questions in writing should not be
          approved on promises. If a vendor refuses to commit to a written
          answer on a P0 question, treat that refusal as the answer.
        </GuidanceCallout>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "MAP-3, MEASURE-2, MANAGE-2" },
            { name: "ISO 42001", control: "Clause 8.3 · Third parties" },
            { name: "SOC 2", control: "CC9.1, CC9.2 · Vendor management" },
            { name: "ISO 27001", control: "A.5.19–A.5.23 · Supplier relationships" },
            { name: "HIPAA", control: "§164.308(b) · BAA obligations" },
            { name: "GDPR", control: "Art. 28 · Processors" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="When This Assessment Runs"
        intent="Stating triggers explicitly is how you prevent the assessment from becoming a one-time gate."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            <strong>Before adoption.</strong> Any new AI tool proposed for the
            approved list. Procurement cannot issue a PO without a completed
            VRA signed by the AI Governance Lead and CISO.
          </li>
          <li>
            <strong>At renewal.</strong> Every existing approved vendor at
            contract renewal, with a lightweight delta review for materially
            unchanged vendors.
          </li>
          <li>
            <strong>On material change.</strong> When a vendor notifies of a
            subprocessor change, a model swap, a change in data residency,
            or a material security event. Material-change VRAs are completed
            within 15 business days.
          </li>
          <li>
            <strong>Ad hoc.</strong> When an incident, regulatory inquiry, or
            client audit surfaces a concern about a specific vendor.
          </li>
        </ul>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Six Assessment Domains"
        intent="The full questionnaire. Every domain has a primary intent; every question has the evidence we expect and the red flags that should trigger escalation."
        pageBreak
      >
        <div className="space-y-6">
          {domains.map((d) => (
            <div
              key={d.code}
              className="rounded-lg border border-slate-800 bg-navy-900/20 p-5"
            >
              <div className="flex items-baseline gap-4 border-b border-slate-800 pb-3">
                <span
                  className={`font-mono text-xs font-bold tracking-widest ${d.accent}`}
                >
                  {d.code}
                </span>
                <h3 className={`text-lg font-semibold ${d.accent}`}>
                  {d.name}
                </h3>
              </div>
              <p className="mt-3 text-sm italic text-slate-400">
                <span className="not-italic font-semibold text-slate-300">
                  Intent —
                </span>{" "}
                {d.intent}
              </p>
              <div className="mt-4 space-y-4">
                {d.questions.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-md border border-slate-800 bg-navy-900/30 p-4"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-slate-500">
                        {q.id}
                      </span>
                      <p className="text-sm font-semibold text-slate-100">
                        {q.prompt}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      <span className="font-semibold text-slate-400">
                        What we look for —{" "}
                      </span>
                      {q.looking}
                    </p>
                    <div className="mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                        Red flags
                      </p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">
                        {q.redFlags.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Scoring & Overall Signal"
        intent="Every domain receives a score; the rollup produces the single signal that drives the decision."
      >
        <SubSection title="Per-domain scoring (0–4)">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-300">
            <li>
              <strong>4 · Exemplary.</strong> Evidence exceeds expectations;
              written commitments in place; recent independent validation.
            </li>
            <li>
              <strong>3 · Sufficient.</strong> All expectations met with
              documented evidence. No red flags.
            </li>
            <li>
              <strong>2 · Conditional.</strong> Core expectations met, with
              specific gaps to be closed by contract language or compensating
              controls.
            </li>
            <li>
              <strong>1 · Deficient.</strong> Material gaps with no clear
              remediation path inside the engagement.
            </li>
            <li>
              <strong>0 · Absent.</strong> Evidence not provided or refused.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Overall signal">
          <div className="space-y-3">
            {overallSignals.map((s) => (
              <div
                key={s.level}
                className={`rounded-md border p-4 ${s.color}`}
              >
                <p className="text-sm font-bold">{s.level}</p>
                <p className="mt-1 text-sm text-slate-300">{s.description}</p>
              </div>
            ))}
          </div>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Cover Sheet"
        intent="Each completed VRA begins with this cover sheet. It is the artifact that travels with the contract, not the raw responses."
      >
        <div className="rounded-lg border border-slate-800 bg-navy-900/20 p-5 text-sm text-slate-300">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Vendor
              </p>
              <p className="mt-1 text-slate-200">
                <Placeholder>VENDOR NAME</Placeholder>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Tool / Service
              </p>
              <p className="mt-1 text-slate-200">
                <Placeholder>TOOL + VERSION</Placeholder>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Proposed Use Case
              </p>
              <p className="mt-1 text-slate-200">
                <Placeholder>SUMMARY</Placeholder>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Max Data Classification
              </p>
              <p className="mt-1 text-slate-200">
                <Placeholder>P0 / P1 / P2 / P3</Placeholder>
              </p>
            </div>
          </div>
          <hr className="my-4 border-slate-800" />
          <div className="grid gap-4 md:grid-cols-6">
            {domains.map((d) => (
              <div key={d.code}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {d.code}
                </p>
                <p className="mt-1 text-lg font-bold text-slate-200">
                  <Placeholder>0-4</Placeholder>
                </p>
              </div>
            ))}
          </div>
          <hr className="my-4 border-slate-800" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Overall Signal
            </p>
            <p className="mt-1 text-slate-200">
              <Placeholder>GREEN / YELLOW / RED / BLACK</Placeholder>
            </p>
          </div>
          <hr className="my-4 border-slate-800" />
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Prepared by
              </p>
              <p className="mt-1 text-slate-200">
                <Placeholder>AI GOV. LEAD</Placeholder>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                CISO sign-off
              </p>
              <p className="mt-1 text-slate-200">
                <Placeholder>SIGNATURE + DATE</Placeholder>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Next review
              </p>
              <p className="mt-1 text-slate-200">
                <Placeholder>DATE</Placeholder>
              </p>
            </div>
          </div>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Conditions & Redlines"
        intent="When the signal is Yellow, the conditions that close the gap go in contract language. The standard redlines below should be in every AEGIS-governed AI contract."
      >
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="rounded-md border border-slate-800 bg-navy-900/20 p-3">
            <strong>Zero-retention clause.</strong> Vendor commits in writing
            that prompts, outputs, and derived data from our tenant are not
            used to train current or future models.
          </li>
          <li className="rounded-md border border-slate-800 bg-navy-900/20 p-3">
            <strong>Subprocessor change notification.</strong> Minimum 15
            business days&apos; notice, with our right to object and
            terminate without penalty if the change materially changes data
            residency or security posture.
          </li>
          <li className="rounded-md border border-slate-800 bg-navy-900/20 p-3">
            <strong>Version pinning.</strong> Ability to pin to a specific
            model version for at least 30 days after a vendor version change,
            to allow us to test and certify the new version.
          </li>
          <li className="rounded-md border border-slate-800 bg-navy-900/20 p-3">
            <strong>Data deletion certificate.</strong> On termination or
            request, a signed deletion certificate provided within 30 days.
          </li>
          <li className="rounded-md border border-slate-800 bg-navy-900/20 p-3">
            <strong>Audit rights.</strong> Annual audit right (or acceptance
            of an equivalent SOC 2 / ISO 27001 report) for regulated
            engagements.
          </li>
          <li className="rounded-md border border-slate-800 bg-navy-900/20 p-3">
            <strong>Regulatory pass-through.</strong> Vendor cooperates with
            our regulator audits within a stated window and at no additional
            cost.
          </li>
        </ul>
      </ArtifactSection>
    </ArtifactShell>
  );
}
