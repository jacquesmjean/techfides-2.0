"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type UseCase = {
  category: string;
  accent: string;
  permitted: string[];
  conditional: string[];
  prohibited: string[];
};

const useCases: UseCase[] = [
  {
    category: "Public, Non-Sensitive Work",
    accent: "text-accent-green",
    permitted: [
      "Drafting internal memos, agendas, and meeting summaries from non-classified notes.",
      "Producing first drafts of public-facing marketing copy, job descriptions, and external blog posts.",
      "Generating slide outlines, diagrams, and images from prompts that contain no client or personnel data.",
    ],
    conditional: [
      "Research summaries where the prompt includes general industry context but no named client data.",
    ],
    prohibited: [],
  },
  {
    category: "Client & Engagement Work",
    accent: "text-electric-400",
    permitted: [
      "Using approved, contractually-reviewed AI tools on client material where the client has signed the AI addendum.",
      "Summarizing meeting transcripts inside the approved workspace tenant bound by the client agreement.",
    ],
    conditional: [
      "Using AI on client material when the contract is silent — requires written approval from the engagement lead and General Counsel before the first use.",
      "Fine-tuning, embedding, or storing client material in a vector database — requires an approved Vendor Risk Assessment and client notification.",
    ],
    prohibited: [
      "Pasting client-confidential, personal, or regulated data into any AI tool not on the approved list.",
      "Using a consumer AI tool (free tier, personal account) for any client work, under any circumstance.",
    ],
  },
  {
    category: "Code & Engineering",
    accent: "text-purple-400",
    permitted: [
      "Using approved AI coding assistants inside the company-managed IDE, with telemetry and license compliance enabled.",
      "Generating code scaffolding, refactors, and unit tests for internal tooling where no proprietary algorithm is exposed.",
    ],
    conditional: [
      "Submitting code that contains proprietary business logic or trade secrets to any AI tool — requires CTO approval and the use of an enterprise tenant with zero-retention settings verified in writing.",
    ],
    prohibited: [
      "Committing AI-generated code without human review, test coverage, and an attribution note in the commit message.",
      "Using AI to generate cryptographic, security, or authentication code without a human security reviewer.",
    ],
  },
  {
    category: "HR, Finance & Legal",
    accent: "text-accent-amber",
    permitted: [
      "Using AI to summarize public regulatory filings, case law, and general guidance.",
      "Drafting internal communications from outlines approved by the function lead.",
    ],
    conditional: [
      "Applying AI to hiring workflows (resume screening, interview scoring) — requires a completed bias assessment, HR sign-off, and annual audit.",
    ],
    prohibited: [
      "Using AI to generate final legal opinions, employment decisions, or financial filings without a qualified human reviewer of record.",
      "Entering salary, benefits, health, or performance-review data into any AI tool without explicit HR and Legal approval.",
    ],
  },
  {
    category: "Customer-Facing AI",
    accent: "text-rose-400",
    permitted: [
      "Deploying AI features that have passed the pre-launch governance checklist, including a disclosure and escalation path.",
    ],
    conditional: [
      "Piloting customer-facing AI in a limited cohort — requires written scope, success criteria, opt-out path, and a kill switch owner named on record.",
    ],
    prohibited: [
      "Shipping any customer-facing AI feature without disclosure to the customer that AI is being used.",
      "Using AI to generate regulated communications (medical, financial advice, legal guidance) without a licensed human review step and disclaimers reviewed by counsel.",
    ],
  },
];

type DataRule = {
  class: string;
  examples: string;
  rule: string;
  color: string;
};

const dataRules: DataRule[] = [
  {
    class: "P0 · Regulated / Restricted",
    examples:
      "PHI, full PII, payment data, client-privileged material, trade secrets, source code containing proprietary algorithms.",
    rule: "Prohibited in any AI tool except those explicitly approved by CISO with a signed Vendor Risk Assessment and zero-retention settings verified.",
    color: "border-rose-500/50 bg-rose-500/5 text-rose-300",
  },
  {
    class: "P1 · Confidential",
    examples:
      "Non-public financials, internal strategy, client names and engagement details, personnel records, vendor contracts.",
    rule: "Only in approved enterprise tenants with documented retention controls. Never in consumer or personal-account tools.",
    color: "border-accent-amber/50 bg-accent-amber/5 text-accent-amber",
  },
  {
    class: "P2 · Internal",
    examples:
      "Internal docs without client identifiers, non-confidential planning material, general operational notes.",
    rule: "Permitted in approved enterprise tenants. Avoid in consumer tools unless the content is intended for public release.",
    color: "border-electric-500/50 bg-electric-500/5 text-electric-400",
  },
  {
    class: "P3 · Public",
    examples:
      "Material already published, publicly available research, marketing copy intended for external release.",
    rule: "No restrictions beyond normal usage policies.",
    color: "border-accent-green/50 bg-accent-green/5 text-accent-green",
  },
];

export default function AcceptableUsePolicy() {
  return (
    <ArtifactShell
      module="AEGIS Policy Core"
      moduleAccent="text-electric-400"
      artifactNumber="1.1"
      title="AI Acceptable Use Policy"
      subtitle="The single source of truth for how the organization uses AI. Written to be acknowledged by every employee, enforceable by managers, and auditable by regulators."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="1"
        title="Purpose & Authority"
        intent="Establish the authority of this policy, define its scope, and make clear that acknowledgment is a condition of employment and contractor engagement."
      >
        <p className="text-sm text-slate-300">
          This policy governs the use of artificial intelligence tools, models,
          and agents by all employees, contractors, and consultants of{" "}
          <Placeholder>CLIENT NAME</Placeholder> (&quot;the Organization&quot;).
          It is issued under the authority of the AI Governance Council
          (&quot;the Council&quot;), ratified by the Executive Sponsor, and
          enforced by line management. Violations may result in disciplinary
          action up to and including termination.
        </p>
        <p className="text-sm text-slate-300">
          This policy supersedes any informal practice, team norm, or prior
          guidance on AI use. Where this policy conflicts with a
          contractually-binding customer or regulatory requirement, the more
          restrictive rule applies.
        </p>
        <SubSection title="Scope">
          <p>
            This policy applies to every AI system used on behalf of the
            Organization, including (a) third-party SaaS AI tools, (b)
            foundation-model APIs integrated into internal software, (c)
            AI-enabled features built into other products the Organization
            licenses, and (d) AI agents that act autonomously on behalf of an
            employee, contractor, or the Organization.
          </p>
        </SubSection>
        <SubSection title="Acknowledgment">
          <p>
            All personnel must acknowledge this policy at onboarding and at
            each annual refresh. Acknowledgment is tracked by HR and is a
            condition of continued access to production systems. New-hire
            onboarding will include a 20-minute live briefing on this policy
            chaired by the AI Governance Lead.
          </p>
        </SubSection>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.1, GOVERN-2.1" },
            { name: "ISO 42001", control: "Clauses 5, 7.3" },
            { name: "SOC 2", control: "CC1.4, CC2.2" },
            { name: "EU AI Act", control: "Art. 4 · AI literacy" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Foundational Principles"
        intent="The five non-negotiable principles that govern every AI decision. Everything else in this policy is a specific expression of one of these."
      >
        <ol className="space-y-4">
          {[
            {
              n: "1",
              name: "Human Accountability",
              body: "Every output produced with AI has a human owner. AI is a tool, not an actor. No decision with material consequence is made by AI alone — a named human is always accountable.",
            },
            {
              n: "2",
              name: "Data Minimization",
              body: "No AI tool receives more data than the task requires. Prompts are written to the narrowest scope. Data not needed for the task is not sent.",
            },
            {
              n: "3",
              name: "Disclosed Use",
              body: "When AI is used in a deliverable or decision that affects a customer, employee, or partner, that use is disclosed. Clients are told when AI is used on their work. Employees are told when AI is used in decisions about them.",
            },
            {
              n: "4",
              name: "Auditable Operation",
              body: "Every AI system operates leaving evidence: what model, what prompt, what output, which user, what time. Evidence is retained per the data retention schedule and produced on request.",
            },
            {
              n: "5",
              name: "Reversible by Default",
              body: "AI-generated outputs in production can be turned off, corrected, or rolled back. No AI feature ships without a kill switch, an owner, and a defined rollback procedure.",
            },
          ].map((p) => (
            <li
              key={p.n}
              className="flex gap-4 rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-electric-500/40 bg-electric-500/10 font-mono text-sm font-bold text-electric-400">
                {p.n}
              </span>
              <div>
                <h4 className="text-base font-semibold text-slate-100">
                  {p.name}
                </h4>
                <p className="mt-1 text-sm text-slate-300">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Data Handling by Classification"
        intent="The hard rule that governs what data is allowed in which AI tools. This is the line auditors and regulators will draw first."
        pageBreak
      >
        <div className="space-y-3">
          {dataRules.map((d) => (
            <div
              key={d.class}
              className={`rounded-lg border p-4 ${d.color}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest">
                {d.class}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                <span className="font-semibold">Examples — </span>
                {d.examples}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-200">
                Rule: {d.rule}
              </p>
            </div>
          ))}
        </div>
        <GuidanceCallout>
          The classification system above is the operational expression of the
          Data Classification artifact (2.1). If this policy and 2.1 disagree
          on any point, 2.1 is the source of truth and this policy must be
          revised within 30 days.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Permitted, Conditional, and Prohibited Uses"
        intent="The practical table every manager will point to when answering 'can I use AI for this?'"
        pageBreak
      >
        <div className="space-y-5">
          {useCases.map((u) => (
            <div
              key={u.category}
              className="rounded-lg border border-slate-800 bg-navy-900/20 p-5"
            >
              <h3 className={`text-lg font-bold ${u.accent}`}>{u.category}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-green">
                    Permitted
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {u.permitted.length === 0 ? (
                      <li className="italic text-slate-500">None in this category.</li>
                    ) : (
                      u.permitted.map((x) => <li key={x}>{x}</li>)
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-amber">
                    Conditional
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {u.conditional.length === 0 ? (
                      <li className="italic text-slate-500">None.</li>
                    ) : (
                      u.conditional.map((x) => <li key={x}>{x}</li>)
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    Prohibited
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {u.prohibited.length === 0 ? (
                      <li className="italic text-slate-500">None.</li>
                    ) : (
                      u.prohibited.map((x) => <li key={x}>{x}</li>)
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Approved Tools & Access"
        intent="The concrete list of what is in bounds today. This section is revised quarterly by the Council; the dated revision below governs until superseded."
      >
        <SubSection title="Approved Enterprise AI Tools">
          <p className="mb-3">
            The following tools are approved for use subject to the data
            classification rules in §3. This list is dated and is revised by
            Council decision; any tool not on this list is not approved,
            regardless of individual preference or vendor marketing.
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tool</th>
                  <th className="px-4 py-3 font-semibold">Tier / Tenant</th>
                  <th className="px-4 py-3 font-semibold">Max Class</th>
                  <th className="px-4 py-3 font-semibold">VRA On File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <Placeholder>TOOL {i}</Placeholder>
                    </td>
                    <td className="px-4 py-3">
                      <Placeholder>ENTERPRISE / TENANT</Placeholder>
                    </td>
                    <td className="px-4 py-3">
                      <Placeholder>P0/P1/P2/P3</Placeholder>
                    </td>
                    <td className="px-4 py-3">
                      <Placeholder>YES + DATE</Placeholder>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
        <SubSection title="Requesting a New Tool">
          <p>
            Employees may propose adding a tool to the approved list by
            submitting a request to the AI Governance Lead. The request must
            include the intended use case, data classification, business case,
            and a contact for the vendor. The Council will respond within 10
            business days with an approval, a request for additional
            information, or a formal decline.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Roles & Responsibilities"
        intent="Make enforcement concrete. Every employee knows who to ask, who decides, and who is accountable."
      >
        <dl className="space-y-3">
          {[
            {
              role: "Every Employee / Contractor",
              duty:
                "Read and acknowledge this policy. Classify the data in any prompt before sending. Escalate ambiguity to your manager. Report suspected violations to the AI Governance Lead.",
            },
            {
              role: "Line Managers",
              duty:
                "Ensure acknowledgment for your team. Approve routine use cases within your function. Escalate conditional uses to the AI Governance Lead. Enforce the policy in practice — including when it is inconvenient.",
            },
            {
              role: "AI Governance Lead",
              duty:
                "Maintain this policy. Operate the exception process. Chair Council reviews. Own the approved tools list and the revision schedule.",
            },
            {
              role: "General Counsel",
              duty:
                "Review the policy annually for regulatory and contractual alignment. Sign off on conditional use cases involving legal, privileged, or regulated material.",
            },
            {
              role: "CISO",
              duty:
                "Own the data classification rules, the Vendor Risk Assessment process, and the security review of any tool on the approved list.",
            },
            {
              role: "Executive Sponsor",
              duty:
                "Ratify policy changes on the Council's recommendation. Escalate to the board when material exceptions, incidents, or tradeoffs require a board-level decision.",
            },
          ].map((r) => (
            <div
              key={r.role}
              className="rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <dt className="text-sm font-semibold text-slate-100">{r.role}</dt>
              <dd className="mt-1 text-sm text-slate-300">{r.duty}</dd>
            </div>
          ))}
        </dl>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Exceptions & Violations"
        intent="Every policy is tested on its exceptions. Make the exception process real — and make the violation consequence real too."
      >
        <SubSection title="Exception Process">
          <p>
            Any use that falls in the Conditional column of §4, or that
            requires deviation from this policy for a specific engagement, is
            an exception. Exceptions require (1) a written request stating the
            use case, data involved, and duration; (2) approval from the
            relevant function lead; (3) approval from the AI Governance Lead;
            (4) a record in the Exception Log. Standing exceptions are
            reviewed at every Council meeting and expire if not re-ratified
            quarterly.
          </p>
        </SubSection>
        <SubSection title="Violations">
          <p>
            Violations are handled proportionately. First-time, good-faith
            errors are addressed with coaching and a documented note. Repeated
            violations, willful violations, or violations resulting in data
            exposure trigger the incident response process (artifact 2.3) and
            may result in access revocation, formal discipline, or
            termination. Violations that involve client data are also reviewed
            against the client&apos;s contractual notification obligations.
          </p>
        </SubSection>
        <GuidanceCallout>
          Do not write an exception process that no one can use. If the
          approval flow takes two weeks for a 30-minute use case, employees
          will route around it and shadow AI returns. Approval for a routine
          conditional use case should complete inside three business days.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="8"
        title="Review & Revision"
        intent="Policies decay if not revisited. Commit to the cadence up front so decay is visible when it happens."
      >
        <p className="text-sm text-slate-300">
          This policy is reviewed quarterly by the AI Governance Council. A
          full revision is issued annually. Out-of-cycle revisions are issued
          when (a) a regulatory change requires it, (b) a material incident
          exposes a gap, or (c) the Council determines a principle requires
          clarification. All revisions are version-controlled; the current
          version and effective date are recorded on the cover page of this
          document.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Effective Date
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              <Placeholder>DATE</Placeholder>
            </p>
          </div>
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Next Scheduled Review
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              <Placeholder>DATE (QUARTERLY)</Placeholder>
            </p>
          </div>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="9"
        title="Acknowledgment"
        intent="The legal signal that an employee has read, understood, and agrees to be bound by this policy. Collected at onboarding and at each annual refresh."
      >
        <div className="rounded-md border border-electric-500/40 bg-electric-500/5 p-5 text-sm text-slate-300">
          <p>
            I acknowledge that I have read and understood the AI Acceptable
            Use Policy. I understand that compliance with this policy is a
            condition of my continued employment or engagement. I agree to
            escalate any ambiguity to my manager or the AI Governance Lead
            before acting. I understand that violations may result in
            disciplinary action, access revocation, or termination.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Name
              </p>
              <p className="mt-1 border-b border-slate-700 pb-1 text-slate-200">
                <Placeholder>FULL NAME</Placeholder>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Signature
              </p>
              <p className="mt-1 border-b border-slate-700 pb-1 text-slate-200">
                <Placeholder>SIGNED</Placeholder>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Date
              </p>
              <p className="mt-1 border-b border-slate-700 pb-1 text-slate-200">
                <Placeholder>DATE</Placeholder>
              </p>
            </div>
          </div>
        </div>
      </ArtifactSection>
    </ArtifactShell>
  );
}
