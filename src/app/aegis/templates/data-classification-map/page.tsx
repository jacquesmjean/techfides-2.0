"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type ClassificationTier = {
  code: string;
  label: string;
  headline: string;
  color: string;
  examples: string[];
  aiRule: string;
  storage: string;
  retention: string;
};

const tiers: ClassificationTier[] = [
  {
    code: "P0",
    label: "Regulated / Restricted",
    headline:
      "Data whose disclosure triggers regulatory, legal, or contractual consequence. The highest bar.",
    color: "border-rose-500/50 bg-rose-500/5",
    examples: [
      "Protected health information (PHI) under HIPAA.",
      "Full personally identifiable information (SSN, passport, financial account numbers).",
      "Payment card data in scope for PCI DSS.",
      "Client-privileged material, attorney work product, and matter-specific files.",
      "Trade secrets, proprietary algorithms, unreleased financials and forecasts.",
    ],
    aiRule:
      "Prohibited in any AI tool unless explicitly named on the approved-for-P0 list, bound by a signed BAA / DPA, with zero-retention settings verified in writing by the vendor.",
    storage: "Encrypted at rest (AES-256) and in transit (TLS 1.2+). Access keyed to named individuals, logged, and reviewed quarterly.",
    retention: "Per regulatory schedule or client contract — whichever is more restrictive.",
  },
  {
    code: "P1",
    label: "Confidential",
    headline:
      "Non-public information whose disclosure causes material harm but does not trigger specific regulatory action.",
    color: "border-accent-amber/50 bg-accent-amber/5",
    examples: [
      "Internal strategy documents, product roadmaps, board materials.",
      "Client names and engagement scope where disclosure violates NDA.",
      "Personnel records, performance reviews, compensation data.",
      "Vendor contracts, partnership terms, pricing details.",
    ],
    aiRule:
      "Permitted only in approved enterprise tenants with documented retention controls. Never in consumer or personal-account AI tools.",
    storage:
      "Encrypted at rest and in transit. Access by role, reviewed semi-annually.",
    retention: "7 years default; sensitive HR data per jurisdiction.",
  },
  {
    code: "P2",
    label: "Internal",
    headline:
      "Information intended for employees and contractors, not the public, but without material disclosure consequence.",
    color: "border-electric-500/50 bg-electric-500/5",
    examples: [
      "Internal process documentation without client identifiers.",
      "Non-confidential planning material and general operational notes.",
      "Draft marketing content prior to publication.",
    ],
    aiRule:
      "Permitted in approved enterprise AI tenants. Strongly discouraged in consumer tools; permitted only if the content is already destined for public release.",
    storage: "Access controls by role; logging for sensitive subsets only.",
    retention: "3 years default.",
  },
  {
    code: "P3",
    label: "Public",
    headline:
      "Material already published or intended for unrestricted release.",
    color: "border-accent-green/50 bg-accent-green/5",
    examples: [
      "Marketing copy already published.",
      "Publicly available research and regulatory filings.",
      "Press releases, publicly-shared case studies.",
    ],
    aiRule: "No restrictions beyond normal tool usage policies.",
    storage: "No encryption requirement beyond standard system controls.",
    retention: "Per marketing / communications schedule.",
  },
];

type DataType = {
  type: string;
  class: string;
  systems: string;
  owner: string;
  aiFlows: string;
};

const dataInventory: DataType[] = [
  {
    type: "Customer health records",
    class: "P0",
    systems: "EHR, billing system, claim processing",
    owner: "Chief Medical Officer",
    aiFlows:
      "AI summarization of intake notes (approved tenant only); prohibited in consumer tools",
  },
  {
    type: "Payment and billing data",
    class: "P0",
    systems: "Payment gateway, CRM billing module, accounting",
    owner: "CFO",
    aiFlows:
      "Prohibited in AI tools except for aggregated, tokenized analytics dashboards",
  },
  {
    type: "Matter files, legal hold, privileged correspondence",
    class: "P0",
    systems: "Document management system, email archive",
    owner: "General Counsel",
    aiFlows:
      "Prohibited except in AI tools on the approved-for-P0 list with explicit client consent",
  },
  {
    type: "Client engagement details and contract terms",
    class: "P1",
    systems: "CRM, contract management, engagement SharePoint",
    owner: "Chief Revenue Officer",
    aiFlows:
      "Approved enterprise AI for drafting, summarizing, meeting intelligence within the client tenant",
  },
  {
    type: "Employee PII and payroll",
    class: "P1",
    systems: "HRIS, payroll provider, benefits platform",
    owner: "CHRO",
    aiFlows:
      "Prohibited in consumer tools; conditional in enterprise tools with explicit HR sign-off",
  },
  {
    type: "Source code and proprietary algorithms",
    class: "P0/P1",
    systems: "Source control, internal wikis, architecture docs",
    owner: "CTO",
    aiFlows:
      "Approved AI coding assistant in enterprise tenant with zero-retention verified; algorithmic modules require CTO approval",
  },
  {
    type: "Internal strategy and board materials",
    class: "P1",
    systems: "Board portal, executive SharePoint",
    owner: "Executive Sponsor",
    aiFlows:
      "Approved enterprise tenant only; generative drafts reviewed before distribution",
  },
  {
    type: "Marketing content pre-publication",
    class: "P2",
    systems: "Marketing CMS, design tools, social scheduler",
    owner: "CMO",
    aiFlows: "Approved enterprise AI; consumer tools for P3-intended content only",
  },
];

type FlowStep = {
  name: string;
  detail: string;
};

const intakeExample: FlowStep[] = [
  {
    name: "Source",
    detail:
      "Customer uploads an intake document via the secure portal (P0 data: health history, identifiers).",
  },
  {
    name: "Storage",
    detail:
      "Portal writes to the EHR with field-level encryption. Access is keyed to named care-team members.",
  },
  {
    name: "AI processing",
    detail:
      "Approved clinical-grade AI tenant summarizes intake into a structured note. Prompt, output, and model ID logged to the audit store. Retention verified zero beyond 24-hour processing window.",
  },
  {
    name: "Derived output",
    detail:
      "Summarized intake saved back to the EHR, tagged as AI-assisted, reviewed and countersigned by a licensed clinician before it enters the care record.",
  },
  {
    name: "Retention / deletion",
    detail:
      "Intake record retained per jurisdictional EHR schedule. AI prompt and output purged after the retention window with a deletion receipt logged.",
  },
];

export default function DataClassificationMap() {
  return (
    <ArtifactShell
      module="AEGIS Shield"
      moduleAccent="text-purple-400"
      artifactNumber="2.1"
      title="Data Classification & AI Data Map"
      subtitle="The four-tier data standard and the map of where data of each class lives, flows, and is touched by AI — the foundation every other Shield artifact rests on."
      classification="CLIENT-RESTRICTED"
    >
      <ArtifactSection
        number="1"
        title="Purpose"
        intent="A classification scheme is the spine of security. Without one, policy is opinion. With one, every other rule in AEGIS has a specific target to protect."
      >
        <p className="text-sm text-slate-300">
          This artifact does two things. First, it defines the four-tier
          classification used across AEGIS — P0 Regulated, P1 Confidential,
          P2 Internal, P3 Public. Second, it maps the organization&apos;s
          actual data types to those tiers and records where AI interacts
          with each flow. The AUP (§1.1), VRA process (§2.2), and Incident
          Response (§2.3) all reference this document. If this document is
          vague, those downstream artifacts inherit the vagueness.
        </p>
        <GuidanceCallout>
          The temptation is to keep P0 small and make everything else P2.
          Resist. Under-classification is the most common cause of AI data
          incidents — people misread &quot;internal&quot; as
          &quot;shareable.&quot; If in doubt, classify up; re-classify down
          only with Council approval.
        </GuidanceCallout>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "MAP-2, MEASURE-2" },
            { name: "ISO 27001", control: "A.5.12, A.5.13 · Classification" },
            { name: "ISO 42001", control: "Clause 8 · Operation" },
            { name: "SOC 2", control: "CC6.1, CC6.6" },
            { name: "HIPAA", control: "§164.312 · Access controls" },
            { name: "GDPR", control: "Art. 32 · Security of processing" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Four-Tier Classification"
        intent="The standard, in full. Copy this into every downstream artifact by reference — never paraphrase."
        pageBreak
      >
        <div className="space-y-5">
          {tiers.map((t) => (
            <div key={t.code} className={`rounded-lg border p-5 ${t.color}`}>
              <div className="flex items-baseline justify-between border-b border-slate-700/50 pb-3">
                <div>
                  <p className="font-mono text-xs font-bold tracking-widest text-slate-400">
                    {t.code}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-100">
                    {t.label}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm italic text-slate-300">
                {t.headline}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Examples
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {t.examples.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      AI rule
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{t.aiRule}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Storage
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{t.storage}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Retention
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{t.retention}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Data Inventory"
        intent="The map from data types the organization actually handles to their classification tier, system of record, and AI flow exposure."
        pageBreak
      >
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">Data Type</th>
                <th className="px-3 py-3 font-semibold">Class</th>
                <th className="px-3 py-3 font-semibold">System(s) of Record</th>
                <th className="px-3 py-3 font-semibold">Owner</th>
                <th className="px-3 py-3 font-semibold">AI Flows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {dataInventory.map((d) => (
                <tr key={d.type} className="hover:bg-navy-900/30">
                  <td className="px-3 py-3 font-medium text-slate-200">
                    {d.type}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded border border-slate-700 bg-slate-800/40 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-200">
                      {d.class}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-400">{d.systems}</td>
                  <td className="px-3 py-3 text-slate-400">{d.owner}</td>
                  <td className="px-3 py-3 text-xs text-slate-300">
                    {d.aiFlows}
                  </td>
                </tr>
              ))}
              <tr className="bg-navy-900/10">
                <td className="px-3 py-3">
                  <Placeholder>DATA TYPE</Placeholder>
                </td>
                <td className="px-3 py-3">
                  <Placeholder>TIER</Placeholder>
                </td>
                <td className="px-3 py-3">
                  <Placeholder>SYSTEMS</Placeholder>
                </td>
                <td className="px-3 py-3">
                  <Placeholder>OWNER</Placeholder>
                </td>
                <td className="px-3 py-3">
                  <Placeholder>AI FLOW NOTES</Placeholder>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <GuidanceCallout>
          Replace the illustrative rows with types drawn from the
          organization&apos;s actual systems. Typical engagements end with
          20–40 rows. Anything under 15 is almost always an under-counted
          inventory.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="AI Data Flow Example"
        intent="Show the flow end-to-end for one representative P0 flow. The discipline of tracing every step is what separates a classification scheme from a data map."
      >
        <p className="text-sm italic text-slate-400">
          Example flow: Customer intake in a regulated services context.
          Replace with the client&apos;s highest-risk AI flow for the real
          deliverable.
        </p>
        <div className="space-y-2">
          {intakeExample.map((step, i) => (
            <div
              key={step.name}
              className="flex gap-4 rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-electric-500/40 bg-electric-500/10 font-mono text-xs font-bold text-electric-400">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {step.name}
                </p>
                <p className="mt-1 text-sm text-slate-300">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Handling Rules by Interaction"
        intent="The common operations — prompting, training, storing, sharing — stated as explicit rules per tier."
      >
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">Operation</th>
                <th className="px-3 py-3 font-semibold">P0</th>
                <th className="px-3 py-3 font-semibold">P1</th>
                <th className="px-3 py-3 font-semibold">P2</th>
                <th className="px-3 py-3 font-semibold">P3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {[
                {
                  op: "Paste into an AI prompt",
                  p0: "Approved-for-P0 tools only",
                  p1: "Approved enterprise tools",
                  p2: "Approved tools",
                  p3: "Any tool",
                },
                {
                  op: "Use for fine-tuning or embeddings",
                  p0: "Never",
                  p1: "Only with DPA + Council approval",
                  p2: "Approved tenants",
                  p3: "Any tool",
                },
                {
                  op: "Store in vector database",
                  p0: "Never",
                  p1: "Enterprise VDB with ACLs enforced",
                  p2: "Enterprise VDB",
                  p3: "Any VDB",
                },
                {
                  op: "Share inside organization",
                  p0: "Named access only",
                  p1: "Need-to-know",
                  p2: "Internal general",
                  p3: "Public",
                },
                {
                  op: "Share outside organization",
                  p0: "Contract + counsel",
                  p1: "NDA + business need",
                  p2: "Business need",
                  p3: "Public",
                },
                {
                  op: "Retain long-term",
                  p0: "Per regulation",
                  p1: "7 years default",
                  p2: "3 years",
                  p3: "Marketing schedule",
                },
              ].map((row) => (
                <tr key={row.op} className="hover:bg-navy-900/30">
                  <td className="px-3 py-3 font-medium text-slate-200">
                    {row.op}
                  </td>
                  <td className="px-3 py-3 text-slate-300">{row.p0}</td>
                  <td className="px-3 py-3 text-slate-300">{row.p1}</td>
                  <td className="px-3 py-3 text-slate-300">{row.p2}</td>
                  <td className="px-3 py-3 text-slate-300">{row.p3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Maintenance"
        intent="A data map is a living artifact. Stating the maintenance rhythm up front is the only defense against drift."
      >
        <SubSection title="Inventory refresh">
          <p>
            The inventory in §3 is refreshed at each quarterly Council review
            and any time a new system goes live or an existing system
            materially changes its data scope. Refreshes are led by the
            function owner for each data type.
          </p>
        </SubSection>
        <SubSection title="Re-classification">
          <p>
            Any request to re-classify a data type down a tier (e.g., P0 →
            P1) is a Council decision with General Counsel consulted. The
            proposer must state the rationale and the countervailing
            evidence considered. Approved re-classifications are dated and
            logged; rationale is retained for audit.
          </p>
        </SubSection>
        <SubSection title="Reconciliation with downstream artifacts">
          <p>
            Within 10 business days of an approved change to this artifact,
            the AUP (§1.1), the Vendor Risk Assessment checklist (§2.2), and
            the Incident Response runbook (§2.3) must be reviewed for
            alignment. Inconsistencies are tracked as governance risks until
            resolved.
          </p>
        </SubSection>
      </ArtifactSection>
    </ArtifactShell>
  );
}
