"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type RaciMark = "R" | "A" | "C" | "I" | "—";

type Decision = {
  id: string;
  decision: string;
  category: string;
  marks: Record<Role, RaciMark>;
  escalation: string;
  frequency: string;
};

type Role =
  | "Executive Sponsor"
  | "AI Governance Lead"
  | "CISO"
  | "General Counsel"
  | "Function Lead"
  | "Individual Employee"
  | "Council";

const roles: Role[] = [
  "Executive Sponsor",
  "AI Governance Lead",
  "CISO",
  "General Counsel",
  "Function Lead",
  "Individual Employee",
  "Council",
];

const markStyle: Record<RaciMark, string> = {
  R: "bg-electric-500/20 text-electric-300 border-electric-500/40",
  A: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  C: "bg-accent-amber/15 text-accent-amber border-accent-amber/40",
  I: "bg-slate-700/40 text-slate-300 border-slate-600/40",
  "—": "text-slate-600 border-transparent",
};

const decisions: Decision[] = [
  {
    id: "D-01",
    decision: "Approve a new AI tool for the enterprise",
    category: "Tooling",
    marks: {
      "Executive Sponsor": "I",
      "AI Governance Lead": "R",
      CISO: "C",
      "General Counsel": "C",
      "Function Lead": "C",
      "Individual Employee": "—",
      Council: "A",
    },
    escalation:
      "If a Council member objects, the decision escalates to the Executive Sponsor.",
    frequency: "Monthly intake; target 10 business days to decision.",
  },
  {
    id: "D-02",
    decision: "Approve a routine Conditional use case (§4 of the AUP)",
    category: "Day-to-Day",
    marks: {
      "Executive Sponsor": "—",
      "AI Governance Lead": "A",
      CISO: "I",
      "General Counsel": "I",
      "Function Lead": "R",
      "Individual Employee": "I",
      Council: "I",
    },
    escalation:
      "Denied requests can be appealed to the Council at the next scheduled review.",
    frequency: "Target response: three business days.",
  },
  {
    id: "D-03",
    decision: "Approve AI use on privileged or regulated material",
    category: "Legal / Compliance",
    marks: {
      "Executive Sponsor": "I",
      "AI Governance Lead": "C",
      CISO: "C",
      "General Counsel": "A",
      "Function Lead": "R",
      "Individual Employee": "I",
      Council: "I",
    },
    escalation: "Escalates to Council if Counsel declines and function lead disputes.",
    frequency: "Case-by-case; documented in the Exception Log.",
  },
  {
    id: "D-04",
    decision: "Accept a P0 or P1 risk from the AI Risk Register",
    category: "Risk",
    marks: {
      "Executive Sponsor": "A",
      "AI Governance Lead": "R",
      CISO: "C",
      "General Counsel": "C",
      "Function Lead": "C",
      "Individual Employee": "—",
      Council: "C",
    },
    escalation:
      "Board notification required if accepted exposure exceeds the materiality threshold.",
    frequency: "At every Council review; ad hoc as risks emerge.",
  },
  {
    id: "D-05",
    decision: "Declare an AI-related incident",
    category: "Incident",
    marks: {
      "Executive Sponsor": "I",
      "AI Governance Lead": "C",
      CISO: "A",
      "General Counsel": "C",
      "Function Lead": "I",
      "Individual Employee": "R",
      Council: "I",
    },
    escalation:
      "Any employee may escalate directly to CISO; retaliation for good-faith reports is prohibited.",
    frequency: "On detection; severity level assigned within 2 hours.",
  },
  {
    id: "D-06",
    decision: "Ship a customer-facing AI feature",
    category: "Product",
    marks: {
      "Executive Sponsor": "A",
      "AI Governance Lead": "C",
      CISO: "C",
      "General Counsel": "C",
      "Function Lead": "R",
      "Individual Employee": "—",
      Council: "C",
    },
    escalation:
      "Pre-launch checklist must clear every Consulted role before go-live.",
    frequency: "Per launch; minimum two-week review window.",
  },
  {
    id: "D-07",
    decision: "Change the AI Acceptable Use Policy",
    category: "Policy",
    marks: {
      "Executive Sponsor": "A",
      "AI Governance Lead": "R",
      CISO: "C",
      "General Counsel": "C",
      "Function Lead": "I",
      "Individual Employee": "I",
      Council: "C",
    },
    escalation:
      "Material changes require a board note before the next board meeting.",
    frequency: "Quarterly review; annual full revision.",
  },
  {
    id: "D-08",
    decision: "Approve a vendor-side AI subprocessor change",
    category: "Vendor",
    marks: {
      "Executive Sponsor": "I",
      "AI Governance Lead": "C",
      CISO: "A",
      "General Counsel": "C",
      "Function Lead": "I",
      "Individual Employee": "—",
      Council: "I",
    },
    escalation:
      "Subprocessors that materially change data residency trigger Council review.",
    frequency: "On vendor notification; 15 business days to respond.",
  },
  {
    id: "D-09",
    decision: "Accept a Council exception that would deviate from policy",
    category: "Exception",
    marks: {
      "Executive Sponsor": "I",
      "AI Governance Lead": "R",
      CISO: "C",
      "General Counsel": "C",
      "Function Lead": "C",
      "Individual Employee": "—",
      Council: "A",
    },
    escalation: "Exceptions expire at the next Council meeting unless re-ratified.",
    frequency: "At every Council review.",
  },
  {
    id: "D-10",
    decision: "Revoke or suspend an employee's AI tool access",
    category: "Enforcement",
    marks: {
      "Executive Sponsor": "I",
      "AI Governance Lead": "C",
      CISO: "A",
      "General Counsel": "C",
      "Function Lead": "R",
      "Individual Employee": "I",
      Council: "I",
    },
    escalation:
      "Formal discipline follows HR protocol; appeals go to Executive Sponsor.",
    frequency: "On violation; standing review in the Exception Log.",
  },
  {
    id: "D-11",
    decision: "Approve a customer contract with a material AI clause",
    category: "Commercial",
    marks: {
      "Executive Sponsor": "C",
      "AI Governance Lead": "C",
      CISO: "C",
      "General Counsel": "A",
      "Function Lead": "R",
      "Individual Employee": "—",
      Council: "I",
    },
    escalation:
      "Non-standard clauses affecting model choice, data residency, or audit rights escalate to Council.",
    frequency: "Per deal; target five business days on standard clauses.",
  },
  {
    id: "D-12",
    decision: "Quarterly board-level AI posture reporting",
    category: "Reporting",
    marks: {
      "Executive Sponsor": "A",
      "AI Governance Lead": "R",
      CISO: "C",
      "General Counsel": "C",
      "Function Lead": "I",
      "Individual Employee": "—",
      Council: "C",
    },
    escalation:
      "Incidents above the materiality threshold trigger an out-of-cycle note to the board.",
    frequency: "Quarterly; aligned with board meeting cadence.",
  },
];

function MarkCell({ mark }: { mark: RaciMark }) {
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded border font-mono text-xs font-bold ${markStyle[mark]}`}
    >
      {mark}
    </span>
  );
}

export default function RaciForAIDecisions() {
  return (
    <ArtifactShell
      module="AEGIS Policy Core"
      moduleAccent="text-electric-400"
      artifactNumber="1.2"
      title="RACI for AI Decisions"
      subtitle="The decision-rights matrix for AI. Twelve recurring decisions, seven roles, four letters — so nothing stalls for lack of an owner and nothing ships without a namable accountable."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="1"
        title="Purpose"
        intent="Collapse ambiguity. Every AI decision that happens regularly in this organization has exactly one Accountable. Every Accountable has one Responsible. Consulted and Informed are specific people, not distribution lists."
      >
        <p className="text-sm text-slate-300">
          The most common governance failure is not policy absence — it is
          unclear decision rights. Employees stall because they cannot find
          the decision-maker; decision-makers say yes without the right
          Consulted voice; leadership learns about material AI decisions from
          incidents instead of from a rhythm. This matrix fixes that by
          naming, for each recurring AI decision, who is Responsible, who is
          Accountable, who must be Consulted before the decision, and who
          must be Informed after.
        </p>
        <GuidanceCallout>
          One Accountable per row. If two roles look equally Accountable, the
          matrix is wrong — resolve the ambiguity before the Council ratifies
          it. Shared accountability is no accountability.
        </GuidanceCallout>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.2, GOVERN-2.3" },
            { name: "ISO 42001", control: "Clause 5 · Leadership" },
            { name: "SOC 2", control: "CC1.3, CC1.4" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Legend"
        intent="The four letters, stated plainly, so there is no argument later about what 'Consulted' means."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              mark: "R" as RaciMark,
              label: "Responsible",
              def: "Does the work to bring the decision to a conclusion. There is exactly one R per decision, and the R writes the proposal that the A ratifies.",
            },
            {
              mark: "A" as RaciMark,
              label: "Accountable",
              def: "Owns the outcome and bears the consequence. There is exactly one A per decision. The A can override or redirect the R, but cannot do both the R and A for the same decision.",
            },
            {
              mark: "C" as RaciMark,
              label: "Consulted",
              def: "Must be asked and heard before the decision. Consulted is a two-way conversation. A decision made without consulting all Cs is not valid and must be redone.",
            },
            {
              mark: "I" as RaciMark,
              label: "Informed",
              def: "Must be told after the decision, within a named window. Informing is one-way and need not happen before action.",
            },
          ].map((l) => (
            <div
              key={l.label}
              className="flex gap-4 rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <MarkCell mark={l.mark} />
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {l.label}
                </p>
                <p className="mt-1 text-sm text-slate-300">{l.def}</p>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="The Seven Roles"
        intent="Roles, not names. Names are assigned in §5 and revised at each Council meeting. The role definitions below are durable."
      >
        <dl className="space-y-3">
          {[
            {
              role: "Executive Sponsor",
              scope:
                "The C-suite owner of the AI program. Holds final authority on policy, risk tolerance, and material investment decisions. Reports to the board on AI posture.",
            },
            {
              role: "AI Governance Lead",
              scope:
                "The operational owner of AEGIS inside the organization. Chairs the Council, maintains the artifacts, and runs the exception process day to day.",
            },
            {
              role: "CISO",
              scope:
                "Accountable for security, data classification enforcement, vendor risk assessments, and AI-related incident response.",
            },
            {
              role: "General Counsel",
              scope:
                "Accountable for regulatory alignment, privileged-material handling, contract language, and disclosure obligations.",
            },
            {
              role: "Function Lead",
              scope:
                "The manager or director of an operating unit (Sales, Engineering, HR, Ops, etc.). Responsible for local enforcement and first-line approval of routine use cases.",
            },
            {
              role: "Individual Employee",
              scope:
                "Every person with access to an approved AI tool. Responsible for reading the AUP, classifying data before prompting, and reporting violations or incidents.",
            },
            {
              role: "Council",
              scope:
                "The cross-functional AI Governance Council, meeting at least bi-weekly, composed of the roles above plus rotating operating-unit representation. The body of record for governance decisions.",
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
        title="Decision Matrix"
        intent="Twelve recurring AI decisions, mapped across the seven roles. Rows are decisions; columns are roles; cells are the letters that govern who does what."
        pageBreak
      >
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">ID</th>
                <th className="px-3 py-3 font-semibold">Decision</th>
                {roles.map((r) => (
                  <th
                    key={r}
                    className="px-3 py-3 text-center font-semibold"
                  >
                    {r.split(" ").map((word, i) => (
                      <span key={i} className="block">
                        {word}
                      </span>
                    ))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {decisions.map((d) => (
                <tr key={d.id} className="hover:bg-navy-900/30">
                  <td className="px-3 py-3 font-mono text-xs text-slate-500">
                    {d.id}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-200">
                      {d.decision}
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-500">
                      {d.category}
                    </div>
                  </td>
                  {roles.map((r) => (
                    <td key={r} className="px-3 py-3 text-center">
                      <MarkCell mark={d.marks[r]} />
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
        title="Named Assignments"
        intent="The RACI letters are durable; the names change. This table is revised at each Council meeting and travels with the matrix."
      >
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Named Person</th>
                <th className="px-4 py-3 font-semibold">Backup</th>
                <th className="px-4 py-3 font-semibold">Effective From</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {roles.map((r) => (
                <tr key={r}>
                  <td className="px-4 py-3 font-medium text-slate-200">{r}</td>
                  <td className="px-4 py-3">
                    <Placeholder>NAME + TITLE</Placeholder>
                  </td>
                  <td className="px-4 py-3">
                    <Placeholder>BACKUP NAME</Placeholder>
                  </td>
                  <td className="px-4 py-3">
                    <Placeholder>DATE</Placeholder>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GuidanceCallout>
          Every named person signs this table at Council ratification. A
          signature is the difference between a role on paper and an
          accountability someone will act on. No signatures, no RACI.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Escalation & Timing"
        intent="What to do when consensus fails, and how long each decision can sit before it must resolve. Ambiguity here kills programs."
      >
        <div className="space-y-3">
          {decisions.map((d) => (
            <div
              key={d.id}
              className="rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-xs text-slate-500">{d.id}</p>
                <p className="text-sm font-semibold text-slate-100">
                  {d.decision}
                </p>
              </div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-slate-400">
                    Escalation —{" "}
                  </span>
                  {d.escalation}
                </p>
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-slate-400">
                    Timing —{" "}
                  </span>
                  {d.frequency}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Operating Rules for the Matrix"
      >
        <SubSection title="Changes to the matrix">
          <p>
            A row in this matrix can be added, removed, or revised only by
            Council decision. Proposed changes are circulated 72 hours ahead
            of the Council meeting at which they are reviewed. Silent
            modification of the matrix is a governance incident.
          </p>
        </SubSection>
        <SubSection title="Decision records">
          <p>
            Every D-series decision in §4 produces a durable record: the
            request, the decision, the date, and the Accountable who ratified
            it. Records are stored in the engagement&apos;s governance system
            of record and are reviewable by internal audit.
          </p>
        </SubSection>
        <SubSection title="If the matrix is silent">
          <p>
            Any AI decision not on this matrix defaults to the AI Governance
            Lead as R and the Council as A. The Lead is responsible for
            proposing the correct mapping at the next Council meeting so that
            the gap does not recur.
          </p>
        </SubSection>
      </ArtifactSection>
    </ArtifactShell>
  );
}
