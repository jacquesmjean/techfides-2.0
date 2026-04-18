"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type Status = "Approved" | "Conditional" | "Under Review" | "Prohibited" | "Retired";

const statusStyle: Record<Status, string> = {
  Approved: "border-accent-green/50 bg-accent-green/10 text-accent-green",
  Conditional: "border-accent-amber/50 bg-accent-amber/10 text-accent-amber",
  "Under Review": "border-indigo-500/50 bg-indigo-500/10 text-indigo-300",
  Prohibited: "border-rose-500/50 bg-rose-500/10 text-rose-300",
  Retired: "border-slate-600 bg-slate-800/60 text-slate-400",
};

const taxonomy: Array<{
  status: Status;
  meaning: string;
  dataOk: string;
  review: string;
}> = [
  {
    status: "Approved",
    meaning:
      "Cleared for production use by the listed roles against the listed data classifications.",
    dataOk: "Per tool — see 'Data Classes' column on the inventory row.",
    review: "Annual, plus on any material change by the vendor.",
  },
  {
    status: "Conditional",
    meaning:
      "Permitted only under named conditions: specific users, specific data classes, or specific workflows. Outside those bounds the tool is prohibited.",
    dataOk: "Only as named in the 'Conditions' column.",
    review: "Semiannual. Conditions are re-validated at each review.",
  },
  {
    status: "Under Review",
    meaning:
      "In active diligence (Artifact 2.2). Not yet permitted for production work. Pilot access may be granted in a sandbox.",
    dataOk: "Synthetic / non-production only.",
    review: "Diligence completes within 30 days or the tool is retired.",
  },
  {
    status: "Prohibited",
    meaning:
      "Explicitly disallowed. Discovery of prohibited-tool use is an incident (Artifact 2.3).",
    dataOk: "None.",
    review: "Re-evaluated only if the vendor or the risk materially changes.",
  },
  {
    status: "Retired",
    meaning:
      "Formerly in use. Access has been revoked, data exported or deleted, contract terminated.",
    dataOk: "None.",
    review: "Retained in the register for audit lineage for two years.",
  },
];

const schemaFields: Array<{ field: string; description: string; required: boolean }> = [
  { field: "Tool ID", description: "Stable internal identifier (e.g., T-0041).", required: true },
  { field: "Tool Name", description: "Commercial name as it appears to users.", required: true },
  { field: "Vendor", description: "Legal vendor entity on the order form.", required: true },
  {
    field: "Category",
    description:
      "Chat assistant · Code assistant · Meeting notetaker · Image/video · Embeddings/search · Agent platform · Model API · Other.",
    required: true,
  },
  {
    field: "Status",
    description: "Approved · Conditional · Under Review · Prohibited · Retired.",
    required: true,
  },
  {
    field: "Data Classes",
    description: "P0/P1/P2/P3 allowed (references Artifact 2.1).",
    required: true,
  },
  {
    field: "Approved Uses",
    description: "Narrative of sanctioned workflows. Anything unlisted is not approved.",
    required: true,
  },
  {
    field: "Owner",
    description: "Named accountable individual — not a team or mailing list.",
    required: true,
  },
  {
    field: "Users / Seats",
    description: "Count of active seats in the last 30 days.",
    required: true,
  },
  {
    field: "Annualized Cost",
    description: "Fully loaded: license + usage + integration labor.",
    required: true,
  },
  {
    field: "Vendor Assessment",
    description: "Link to the completed 2.2 Vendor Risk Assessment.",
    required: true,
  },
  {
    field: "Contract Term",
    description: "Start / end / auto-renew flag. Drives the renewal dashboard.",
    required: true,
  },
  {
    field: "Last Reviewed",
    description: "Date of the most recent governance review.",
    required: true,
  },
  {
    field: "Next Review Due",
    description: "Computed from review cadence by status.",
    required: true,
  },
  {
    field: "Data Residency",
    description: "Processing and storage regions.",
    required: false,
  },
  {
    field: "Notes",
    description: "Material constraints, open risks, or dependencies.",
    required: false,
  },
];

type InventoryRow = {
  id: string;
  tool: string;
  vendor: string;
  category: string;
  status: Status;
  dataClasses: string;
  owner: string;
  seats: string;
  cost: string;
  nextReview: string;
};

const inventoryRows: InventoryRow[] = [
  {
    id: "T-0001",
    tool: "ChatGPT Enterprise",
    vendor: "OpenAI",
    category: "Chat assistant",
    status: "Approved",
    dataClasses: "P1, P2, P3",
    owner: "Head of IT",
    seats: "240",
    cost: "$172,800",
    nextReview: "2026-11-01",
  },
  {
    id: "T-0002",
    tool: "Claude for Work",
    vendor: "Anthropic",
    category: "Chat assistant",
    status: "Approved",
    dataClasses: "P1, P2, P3",
    owner: "Head of IT",
    seats: "210",
    cost: "$126,000",
    nextReview: "2026-11-01",
  },
  {
    id: "T-0003",
    tool: "GitHub Copilot Business",
    vendor: "GitHub",
    category: "Code assistant",
    status: "Approved",
    dataClasses: "P2, P3 (no P1 unless repo is private & flagged)",
    owner: "VP Engineering",
    seats: "48",
    cost: "$22,800",
    nextReview: "2026-09-15",
  },
  {
    id: "T-0004",
    tool: "Otter.ai Business",
    vendor: "Otter",
    category: "Meeting notetaker",
    status: "Conditional",
    dataClasses: "P2, P3 only — never customer calls, never privileged.",
    owner: "Chief of Staff",
    seats: "18",
    cost: "$6,480",
    nextReview: "2026-06-30",
  },
  {
    id: "T-0005",
    tool: "Perplexity Enterprise",
    vendor: "Perplexity",
    category: "Embeddings/search",
    status: "Conditional",
    dataClasses: "P2, P3 — prompt content only, no document upload.",
    owner: "Head of Research",
    seats: "35",
    cost: "$16,800",
    nextReview: "2026-07-15",
  },
  {
    id: "T-0006",
    tool: "Midjourney Pro",
    vendor: "Midjourney",
    category: "Image/video",
    status: "Under Review",
    dataClasses: "Synthetic only — pilot sandbox.",
    owner: "Head of Marketing",
    seats: "4",
    cost: "$1,440",
    nextReview: "2026-05-10",
  },
  {
    id: "T-0007",
    tool: "DeepSeek Chat (public)",
    vendor: "DeepSeek",
    category: "Chat assistant",
    status: "Prohibited",
    dataClasses: "None.",
    owner: "CISO",
    seats: "0",
    cost: "$0",
    nextReview: "—",
  },
  {
    id: "T-0008",
    tool: "Glean",
    vendor: "Glean",
    category: "Embeddings/search",
    status: "Under Review",
    dataClasses: "Pilot — P2 only, scoped to Engineering docs.",
    owner: "VP Engineering",
    seats: "25",
    cost: "$60,000 (pending)",
    nextReview: "2026-05-01",
  },
  {
    id: "T-0009",
    tool: "Grammarly (free)",
    vendor: "Grammarly",
    category: "Other",
    status: "Retired",
    dataClasses: "None.",
    owner: "—",
    seats: "0",
    cost: "$0",
    nextReview: "—",
  },
];

const dashboardMetrics = [
  { label: "Approved tools", value: "12", trend: "+2 QoQ" },
  { label: "Conditional tools", value: "5", trend: "+1 QoQ" },
  { label: "Under review", value: "3", trend: "2 past 30-day SLA" },
  { label: "Prohibited tools", value: "6", trend: "1 new this quarter" },
  { label: "Active seats", value: "548", trend: "+73 QoQ" },
  { label: "Annualized AI spend", value: "$612,400", trend: "+18% QoQ" },
  { label: "Renewals next 90 days", value: "4", trend: "$294,000" },
  { label: "Reviews overdue", value: "2", trend: "remediate by quarter-end" },
];

export default function AIInventoryDashboardPage() {
  return (
    <ArtifactShell
      module="Module 3 · Signal"
      moduleAccent="text-indigo-400"
      artifactNumber="3.1"
      title="AI Inventory Dashboard"
      subtitle="Single source of truth for every AI tool the enterprise uses, is evaluating, or has prohibited — with ownership, cost, data scope, and review cadence."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="01"
        title="Purpose"
        intent="Without an inventory, governance is theoretical. The Inventory Dashboard is the operating record — what is in use, by whom, against which data — that every other AEGIS artifact references."
      >
        <SubSection title="What this artifact is">
          <p>
            The AI Inventory is a live register of every AI tool in the
            enterprise. Every record has a named owner, a status, a data-class
            scope, and a next-review date. Nothing runs in production that is
            not on this register.
          </p>
        </SubSection>

        <SubSection title="How it connects to the other modules">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Policy Core (1.1):</strong> the Acceptable Use Policy
              defines what a user may do — the Inventory says which tools
              enable those uses.
            </li>
            <li>
              <strong>Shield (2.1, 2.2):</strong> every Approved record must
              link to a completed Data Classification scope and Vendor Risk
              Assessment.
            </li>
            <li>
              <strong>Deploy (4.x):</strong> workflows, prompts, and SOPs
              reference the Tool ID directly — renaming, retiring, or
              reclassifying a tool cascades into those artifacts.
            </li>
            <li>
              <strong>Brief (6.x):</strong> the Executive Dashboard and Board
              Pack read aggregate metrics straight off this inventory.
            </li>
          </ul>
        </SubSection>

        <GuidanceCallout>
          The single most common failure mode for client AI governance is a
          drifted inventory — items that were approved once, never reviewed,
          and whose original conditions are long forgotten. The owner field
          and Next Review Due date exist to prevent this. If both are blank,
          the row is invalid.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="02"
        title="Status Taxonomy"
        intent="Five statuses, five meanings. No tool sits in a sixth category."
      >
        <div className="overflow-hidden rounded-md border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Meaning
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Data Allowed
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Review Cadence
                </th>
              </tr>
            </thead>
            <tbody>
              {taxonomy.map((t) => (
                <tr key={t.status} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-block rounded-sm border px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest ${statusStyle[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-300">{t.meaning}</td>
                  <td className="px-4 py-3 align-top text-slate-300">{t.dataOk}</td>
                  <td className="px-4 py-3 align-top text-slate-300">{t.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="03"
        title="Record Schema"
        intent="Every row in the inventory carries these fields. The required fields are non-negotiable — a row missing any one of them is invalid and must be either completed or removed."
      >
        <div className="overflow-hidden rounded-md border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Field
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Required
                </th>
              </tr>
            </thead>
            <tbody>
              {schemaFields.map((f) => (
                <tr key={f.field} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-4 py-3 align-top font-semibold text-slate-200">{f.field}</td>
                  <td className="px-4 py-3 align-top text-slate-400">{f.description}</td>
                  <td className="px-4 py-3 text-center align-top">
                    {f.required ? (
                      <span className="text-accent-green">●</span>
                    ) : (
                      <span className="text-slate-600">○</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="04"
        title="Operating Dashboard"
        intent="The eight metrics a governance owner watches at every review."
        pageBreak
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {dashboardMetrics.map((m) => (
            <div
              key={m.label}
              className="rounded-md border border-slate-800 bg-navy-900/30 p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {m.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-100">{m.value}</p>
              <p className="mt-1 text-xs text-slate-400">{m.trend}</p>
            </div>
          ))}
        </div>

        <GuidanceCallout>
          These numbers are illustrative for <Placeholder>CLIENT NAME</Placeholder>.
          Replace them during the Diagnostic engagement — they are derived, not
          authored. The value of this dashboard is that it is generated from
          the inventory, not hand-typed into a slide.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="05"
        title="Current Inventory"
        intent="The live register. Rows here are examples that the Diagnostic will replace with the client's real environment."
      >
        <div className="overflow-x-auto rounded-md border border-slate-800">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                {[
                  "ID",
                  "Tool",
                  "Vendor",
                  "Category",
                  "Status",
                  "Data Classes",
                  "Owner",
                  "Seats",
                  "Annualized Cost",
                  "Next Review",
                ].map((h) => (
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
              {inventoryRows.map((r) => (
                <tr key={r.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-3 py-2 font-semibold text-slate-100">{r.tool}</td>
                  <td className="px-3 py-2 text-slate-400">{r.vendor}</td>
                  <td className="px-3 py-2 text-slate-400">{r.category}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block rounded-sm border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${statusStyle[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-300">{r.dataClasses}</td>
                  <td className="px-3 py-2 text-slate-300">{r.owner}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{r.seats}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{r.cost}</td>
                  <td className="px-3 py-2 text-slate-400">{r.nextReview}</td>
                </tr>
              ))}
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-600">T-0010</td>
                <td className="px-3 py-2">
                  <Placeholder>NEW TOOL</Placeholder>
                </td>
                <td className="px-3 py-2 text-slate-500" colSpan={8}>
                  <Placeholder>VENDOR</Placeholder> · fill remaining fields during intake
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="06"
        title="Intake, Change, and Retirement Workflows"
        intent="Three lightweight workflows that keep the inventory honest — anything else lets drift creep in."
      >
        <SubSection title="Intake: new tool request">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Requester files an intake form naming the business use, data classes, and preferred tool.</li>
            <li>AI Governance Lead creates the record with status <strong>Under Review</strong>.</li>
            <li>Vendor Risk Assessment (2.2) and Data Map update (2.1) are initiated.</li>
            <li>Decision within 30 days: Approved, Conditional, or Prohibited. No decision in 30 days → default Prohibited.</li>
            <li>Policy update (1.1) and RACI entry (1.2) published alongside the approval.</li>
          </ol>
        </SubSection>

        <SubSection title="Change: reclassification, expansion, ownership transfer">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Change owner submits a change note to the Governance Lead.</li>
            <li>Impact assessed against affected workflows (4.1), prompts (4.2), and SOPs (4.3).</li>
            <li>Record updated; affected artifacts are regenerated or flagged for review.</li>
            <li>Change logged with effective date and reviewer.</li>
          </ol>
        </SubSection>

        <SubSection title="Retirement: planned and unplanned">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Announce retirement date; freeze new seats.</li>
            <li>Export data, revoke access, confirm vendor deletion under contract terms.</li>
            <li>Record flipped to <strong>Retired</strong>; retained in the register for two years for audit.</li>
            <li>Unplanned retirement (vendor failure, incident) follows Artifact 2.3 incident runbook.</li>
          </ol>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="07"
        title="Governance Metrics"
        intent="What the steering committee reviews — inventory is an operating asset, not a document."
      >
        <SubSection title="Monthly">
          <ul className="list-disc space-y-1 pl-5">
            <li>New records added · status changes · retirements.</li>
            <li>Reviews overdue — count and named owners.</li>
            <li>Shadow AI findings (Artifact 3.2) folded into intake queue.</li>
          </ul>
        </SubSection>

        <SubSection title="Quarterly">
          <ul className="list-disc space-y-1 pl-5">
            <li>Total annualized AI spend vs. budget.</li>
            <li>Seats utilization — approved tools with sub-30% active seat rate are candidates for retirement.</li>
            <li>Renewal pipeline for the next 90 days with commercial and security posture.</li>
            <li>Concentration risk — vendors representing &gt;30% of AI spend or data.</li>
          </ul>
        </SubSection>

        <SubSection title="Annually">
          <ul className="list-disc space-y-1 pl-5">
            <li>Full re-attestation: every owner confirms every record they hold.</li>
            <li>Taxonomy review — statuses and categories still fit the tool landscape.</li>
            <li>Data-residency and sovereignty posture vs. regulatory footprint.</li>
          </ul>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="08"
        title="Regulatory Mapping"
        intent="A current, owned AI inventory is the evidentiary foundation auditors, customers, and regulators are increasingly asking for."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-4.1" },
            { name: "NIST AI RMF", control: "MAP-1.1" },
            { name: "ISO 42001", control: "Clause 8.1" },
            { name: "ISO 27001", control: "A.5.9 / A.8.8" },
            { name: "SOC 2", control: "CC2.1 / CC7.1" },
            { name: "EU AI Act", control: "Art. 16 / 26" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
