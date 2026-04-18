"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

const metadataFields: Array<{ field: string; description: string }> = [
  { field: "Prompt ID", description: "PR-NNN stable identifier referenced by workflows and SOPs." },
  { field: "Name", description: "Short, descriptive, action-oriented." },
  {
    field: "Workflow ID",
    description: "The Artifact 4.1 workflow this prompt belongs to, or 'Library' for general-use.",
  },
  { field: "Owner", description: "Named accountable individual — same rule as workflow owners." },
  { field: "Function", description: "Legal · Sales · Engineering · Ops · Finance · Marketing · HR · Customer." },
  {
    field: "Model",
    description: "Approved model + minimum acceptable version. Reviewed when vendor releases new versions.",
  },
  {
    field: "Data Class",
    description: "Highest data classification permitted — per Artifact 2.1.",
  },
  {
    field: "Purpose",
    description: "One-sentence description of what this prompt produces and for whom.",
  },
  {
    field: "Inputs",
    description: "Required and optional inputs with format — anything outside this shape is rejected.",
  },
  {
    field: "Expected Output",
    description: "Structure and content of what the model should return. Informs validation.",
  },
  {
    field: "Caveats & Known Failure Modes",
    description: "What this prompt is known NOT to do well — and when to fall back to a human path.",
  },
  {
    field: "Evaluation",
    description: "How we test it: gold-standard set, sample cadence, tolerance threshold.",
  },
  {
    field: "Last Tested",
    description: "Date of the most recent evaluation pass.",
  },
];

type PromptEntry = {
  id: string;
  name: string;
  workflow: string;
  fn: string;
  model: string;
  dataClass: string;
  body: string;
  caveats: string;
};

const promptLibrary: PromptEntry[] = [
  {
    id: "PR-001",
    name: "Contract Clause Redline",
    workflow: "WF-01",
    fn: "Legal",
    model: "Claude Opus · enterprise tier",
    dataClass: "P1 · counterparty contract, non-privileged",
    body:
      `You are reviewing a counterparty contract against the attached playbook. For each clause that deviates from the playbook, produce: (1) the clause text verbatim, (2) the deviation type (material / minor / acceptable), (3) a suggested rewrite citing the playbook rule by rule-ID, and (4) a risk note of one sentence. Do not produce output for clauses that match the playbook. Return results as a JSON array keyed by clause location.`,
    caveats:
      "Weak on embedded tables and exhibits. Unreliable on choice-of-law nuance for civil-law jurisdictions. Attorney checkpoint mandatory.",
  },
  {
    id: "PR-002",
    name: "RFP Response Drafting",
    workflow: "WF-02",
    fn: "Sales",
    model: "ChatGPT Enterprise · gpt-5",
    dataClass: "P2 · internal proposal library + RFP prompt",
    body:
      `For each question in the attached RFP, retrieve the most relevant approved snippet from the proposal library using the passed context. Produce a draft answer that stitches the snippet into the client's language. If no snippet scores above 0.72 similarity, return "GAP — needs manual response" for that question. Never invent capabilities or SLAs. Cite snippet ID for every answer.`,
    caveats:
      "Pricing, SLA, and security questions excluded by guardrail — proposal manager handles those directly.",
  },
  {
    id: "PR-003",
    name: "Support Ticket Classification",
    workflow: "WF-03",
    fn: "Customer",
    model: "Claude Haiku · enterprise tier",
    dataClass: "P2 · customer ticket content, PII scrubbed at ingress",
    body:
      `Classify the attached support ticket into one of the 14 taxonomy categories and assign a priority (P1–P4) per the priority rubric. Output JSON with keys: category, priority, confidence, signals. If confidence < 0.6, set priority to P2 and mark for human triage.`,
    caveats:
      "Unusual product combinations trigger low confidence and route to human triage automatically. Regulated-account tag bypasses AI entirely.",
  },
  {
    id: "PR-004",
    name: "PR Description Generation",
    workflow: "WF-04",
    fn: "Engineering",
    model: "GitHub Copilot · Business",
    dataClass: "P2 · code and commit log",
    body:
      `Given the diff and commit messages for a pull request, produce a PR description with sections: Summary (1–3 bullets), Test plan (checklist), and Risks (bullets if any). Do not fabricate test results. Do not include TODOs. Do not exceed 200 words.`,
    caveats: "Silent on security implications — SecOps review is a separate checkpoint.",
  },
  {
    id: "PR-005",
    name: "Meeting Summary",
    workflow: "WF-05",
    fn: "Ops",
    model: "Claude Sonnet · enterprise tier",
    dataClass: "P2 · meeting transcript, non-privileged",
    body:
      `Produce a summary of the attached meeting transcript with sections: Decisions made, Action items (attributed to named attendees with due dates where stated), Open questions. Capture direct quotes only when the attendee is explicitly named. Do not infer sentiment. Output in markdown.`,
    caveats:
      "Attribution accuracy drops on calls with more than 6 participants. Explicit consent capture required.",
  },
  {
    id: "PR-006",
    name: "Pricing Draft Rationale",
    workflow: "WF-06",
    fn: "Finance",
    model: "Claude Opus · enterprise tier (tenant-isolated)",
    dataClass: "P1 · deal attributes + pricing rules",
    body:
      `Given the attached opportunity attributes and pricing ruleset, produce a draft price sheet and a rationale section explaining which rules applied, the resulting band, and any ambiguity. Do not suggest prices outside the computed band. If a required attribute is missing, return "PENDING — missing: <attribute list>" and stop.`,
    caveats:
      "Hard band limits enforced deterministically in code; prompt only generates rationale and presentation.",
  },
  {
    id: "PR-007",
    name: "Customer Research Brief",
    workflow: "Library",
    fn: "Marketing",
    model: "Perplexity Enterprise",
    dataClass: "P2 · public web + internal account dossier",
    body:
      `For the named account, produce a one-page research brief with sections: Company snapshot, Recent news (last 90 days, cited), Technology footprint, Likely objections, Suggested talk tracks. Cite every external claim with a link. Do not include contact data or personal information about employees.`,
    caveats:
      "Staleness risk — always check 'Last Tested' date. Do not use for regulated industries (finance/healthcare) without Compliance review.",
  },
];

const functionCategories = [
  { fn: "Legal", count: 14 },
  { fn: "Sales", count: 22 },
  { fn: "Customer", count: 18 },
  { fn: "Engineering", count: 31 },
  { fn: "Marketing", count: 12 },
  { fn: "Finance", count: 9 },
  { fn: "Ops", count: 16 },
  { fn: "HR", count: 5 },
];

export default function PromptTemplateLibraryPage() {
  return (
    <ArtifactShell
      module="Module 4 · Deploy"
      moduleAccent="text-cyan-400"
      artifactNumber="4.2"
      title="Prompt & Template Library"
      subtitle="Curated, version-controlled prompts for sanctioned workflows — with metadata, caveats, and evaluation evidence behind every one."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="01"
        title="Purpose"
        intent="Untracked prompts are the shadow-AI of the AI-governed enterprise. This library makes prompts first-class assets — owned, tested, and versioned like code."
      >
        <SubSection title="Why this matters">
          <p>
            A prompt is not a private preference — it is an operating
            instruction that affects output quality, data handling, and
            regulatory posture. If workflow WF-03 classifies support tickets,
            the prompt that does the classification is a compliance control,
            not a Slack copy-paste.
          </p>
        </SubSection>

        <SubSection title="What this library replaces">
          <ul className="list-disc space-y-1 pl-5">
            <li>Slack-shared &ldquo;this prompt works well&rdquo; copy-pastes.</li>
            <li>Private docs where individual employees keep their favorite prompts.</li>
            <li>Vendor-supplied prompt suggestions that are not evaluated against client data.</li>
            <li>Undocumented prompt changes made inside workflow automations.</li>
          </ul>
        </SubSection>

        <GuidanceCallout>
          Prompt hoarding is a cultural issue, not a technical one. Spend the
          first engagement cycle surfacing existing prompts from across the
          business and importing them into this library. Attribute every
          prompt to its author — recognition matters, and the library&rsquo;s
          credibility depends on it.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="02"
        title="Library Composition"
        intent="Snapshot of how the current library is distributed across functions. Rebalance if one function dominates — signals the library is being written for them, not the enterprise."
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {functionCategories.map((f) => (
            <div
              key={f.fn}
              className="rounded-md border border-slate-800 bg-navy-900/30 p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {f.fn}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-100">{f.count}</p>
              <p className="mt-1 text-xs text-slate-400">prompts</p>
            </div>
          ))}
        </div>

        <GuidanceCallout>
          These counts are illustrative for <Placeholder>CLIENT</Placeholder>
          . Replace with the actual distribution after intake is complete — a
          real library typically grows to 80–150 prompts across the first
          year of a mature program.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="03"
        title="Metadata Schema"
        intent="Every prompt in the library carries this envelope. The prompt text is only one field of thirteen."
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
              </tr>
            </thead>
            <tbody>
              {metadataFields.map((f) => (
                <tr key={f.field} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-4 py-3 align-top font-semibold text-slate-200">{f.field}</td>
                  <td className="px-4 py-3 align-top text-slate-400">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="04"
        title="Prompt Entries"
        intent="Seven example entries covering the workflows in Artifact 4.1 plus one general-library prompt. Full library in client engagement typically runs to 80–150 entries."
        pageBreak
      >
        <div className="space-y-6">
          {promptLibrary.map((p) => (
            <div
              key={p.id}
              className="rounded-md border border-slate-800 bg-navy-900/20 p-5"
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs font-bold text-cyan-400">{p.id}</span>
                <h4 className="text-base font-bold text-slate-100">{p.name}</h4>
                <span className="rounded-sm border border-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {p.fn}
                </span>
                <span className="text-xs text-slate-500">
                  Workflow · <span className="font-mono">{p.workflow}</span>
                </span>
              </div>

              <dl className="mb-3 grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Model</dt>
                  <dd className="mt-0.5 text-slate-300">{p.model}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Data Class</dt>
                  <dd className="mt-0.5 text-slate-300">{p.dataClass}</dd>
                </div>
              </dl>

              <div className="mb-3">
                <dt className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Prompt body
                </dt>
                <pre className="whitespace-pre-wrap rounded-sm border border-slate-800 bg-slate-950 p-3 text-xs leading-relaxed text-slate-300">
                  {p.body}
                </pre>
              </div>

              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Caveats
                </dt>
                <dd className="mt-0.5 text-sm text-slate-400">{p.caveats}</dd>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="05"
        title="Evaluation"
        intent="Prompts are tested like code. An untested prompt in a governed workflow is a latent incident."
      >
        <SubSection title="Gold-standard sets">
          <p>
            Every prompt that drives a governed workflow has a held-out
            gold-standard evaluation set — real-but-scrubbed inputs with
            correct outputs. Typical size: 30–100 cases per prompt. Sets are
            owned by the prompt owner and versioned.
          </p>
        </SubSection>

        <SubSection title="Evaluation cadence">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Quarterly</strong> — every prompt run against its gold
              set. Accuracy regression &gt; 5% vs. baseline triggers rework.
            </li>
            <li>
              <strong>On model change</strong> — vendor version bump or tier
              migration forces a full re-evaluation before the new model is
              enabled.
            </li>
            <li>
              <strong>On incident</strong> — any workflow incident involving a
              prompt triggers immediate re-evaluation plus prompt revision or
              retirement.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Red-team prompts">
          <p>
            A portion of each gold set is adversarial — inputs designed to
            probe failure modes (ambiguity, edge cases, prompt injection,
            policy-violating requests). Red-team performance is tracked
            separately and reported to the governance committee.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="06"
        title="Change Control"
        intent="Prompts change. So do model versions. Version control is the mechanism that lets you roll back when a change degrades the output."
      >
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Prompts live in a Git-backed store with clear ownership per prompt.</li>
          <li>Every change is a PR reviewed by Owner + one peer from the same function.</li>
          <li>Evaluation results must be attached to any change PR — no change merges without a before/after score.</li>
          <li>Rollback is the default on any regression — fix forward only after root cause is understood.</li>
          <li>Retirement is flagged 30 days ahead; workflows and SOPs referencing the prompt are updated in the same release.</li>
        </ul>
      </ArtifactSection>

      <ArtifactSection
        number="07"
        title="Regulatory Mapping"
        intent="Prompt libraries aren't named in most regulations, but the evidentiary role they play in model risk, bias testing, and incident RCA is explicit."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "MEASURE-2.3 / MEASURE-2.7" },
            { name: "ISO 42001", control: "Clause 8 / Annex A.6.2" },
            { name: "SOC 2", control: "CC7.1 / CC8.1" },
            { name: "EU AI Act", control: "Art. 15 (accuracy, robustness)" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
