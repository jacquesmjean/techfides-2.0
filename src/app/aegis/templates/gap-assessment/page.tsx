"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type MaturityLevel = {
  score: number;
  label: string;
  definition: string;
  color: string;
};

const maturityScale: MaturityLevel[] = [
  {
    score: 0,
    label: "Absent",
    definition:
      "No policy, no process, no ownership. AI activity is uncontrolled and undocumented.",
    color: "bg-rose-500/10 text-rose-300 border-rose-500/40",
  },
  {
    score: 1,
    label: "Ad hoc",
    definition:
      "Individual actors make individual choices. No shared standard exists. Outcomes depend on who is in the room.",
    color: "bg-accent-amber/10 text-accent-amber border-accent-amber/40",
  },
  {
    score: 2,
    label: "Defined",
    definition:
      "Written policy or process exists. Awareness is partial; enforcement is inconsistent.",
    color: "bg-electric-500/10 text-electric-400 border-electric-500/40",
  },
  {
    score: 3,
    label: "Operating",
    definition:
      "Policy is enforced, ownership is clear, logs or artifacts demonstrate active operation.",
    color: "bg-accent-green/10 text-accent-green border-accent-green/40",
  },
  {
    score: 4,
    label: "Managed",
    definition:
      "Metrics are reported, reviewed, and drive continuous improvement. Audit-ready.",
    color: "bg-purple-500/10 text-purple-300 border-purple-500/40",
  },
];

type Dimension = {
  code: string;
  dimension: string;
  question: string;
  evidence: string;
};

type Layer = {
  layer: string;
  module: string;
  accent: string;
  ringColor: string;
  dimensions: Dimension[];
};

const layers: Layer[] = [
  {
    layer: "Governance",
    module: "AEGIS Policy Core",
    accent: "text-electric-400",
    ringColor: "border-electric-500/40",
    dimensions: [
      {
        code: "G1",
        dimension: "Acceptable use policy",
        question:
          "Is there a current, published AI Acceptable Use Policy that covers generative, predictive, and agentic AI?",
        evidence:
          "Policy document with issuance date, applicability statement, and acknowledgment trail.",
      },
      {
        code: "G2",
        dimension: "Decision rights",
        question:
          "Is there a documented RACI for AI decisions — tool approval, data class authorization, model selection, incident response?",
        evidence:
          "RACI matrix reviewed by executive committee in last 12 months.",
      },
      {
        code: "G3",
        dimension: "Risk register inclusion",
        question:
          "Do AI-specific risks appear in the enterprise risk register with named owners and mitigation plans?",
        evidence:
          "Risk register with AI entries, last review date, owner sign-off.",
      },
      {
        code: "G4",
        dimension: "Board-level reporting",
        question:
          "Does the board receive a regular AI posture report? Quarterly minimum.",
        evidence:
          "Board deck excerpts from the last two reporting cycles.",
      },
      {
        code: "G5",
        dimension: "Policy enforcement",
        question:
          "When policy is breached, is there a documented enforcement path and at least one recorded enforcement action?",
        evidence:
          "Enforcement log or exception register with outcomes.",
      },
    ],
  },
  {
    layer: "Security, Trust & Resilience",
    module: "AEGIS Shield",
    accent: "text-purple-400",
    ringColor: "border-purple-500/40",
    dimensions: [
      {
        code: "S1",
        dimension: "Data classification coverage",
        question:
          "Is every data class (public, internal, confidential, regulated) mapped to permitted AI tools and prohibited AI tools?",
        evidence: "Data classification and AI permission matrix.",
      },
      {
        code: "S2",
        dimension: "Vendor risk assessment",
        question:
          "Does each sanctioned AI vendor have a completed risk assessment covering data handling, model training posture, sub-processors, and contractual protections?",
        evidence:
          "Vendor file with assessment, DPA, and annual review date.",
      },
      {
        code: "S3",
        dimension: "Identity and access",
        question:
          "Are AI tools integrated into identity management with SSO, MFA, and offboarding automation?",
        evidence: "IDP grant list for AI category.",
      },
      {
        code: "S4",
        dimension: "Incident response",
        question:
          "Is there an AI-specific incident response runbook, with defined incident types (prompt injection, data leakage, hallucination reliance, model outage)?",
        evidence: "Runbook with scenario walk-throughs and escalation tree.",
      },
      {
        code: "S5",
        dimension: "Logging and audit",
        question:
          "For sanctioned AI tools processing confidential or regulated data, are prompts, outputs, and access events logged and retained per policy?",
        evidence: "Sample log extract and retention statement.",
      },
    ],
  },
  {
    layer: "Intelligence",
    module: "AEGIS Signal",
    accent: "text-indigo-400",
    ringColor: "border-indigo-500/40",
    dimensions: [
      {
        code: "I1",
        dimension: "AI inventory accuracy",
        question:
          "Is there a current, comprehensive inventory of AI tools in use — sanctioned, discretionary, and discovered?",
        evidence:
          "Inventory with last-updated date, owner, data class, cost.",
      },
      {
        code: "I2",
        dimension: "Shadow AI visibility",
        question:
          "Does leadership have a defensible view of unsanctioned AI activity, updated at least quarterly?",
        evidence: "Most recent Shadow AI Scan Report.",
      },
      {
        code: "I3",
        dimension: "Value tracking",
        question:
          "For each material AI investment, is there a measured value outcome (hours saved, quality improvement, revenue impact)?",
        evidence: "Value & Spend Tracker populated for top 5 tools.",
      },
      {
        code: "I4",
        dimension: "Spend discipline",
        question:
          "Is AI spend consolidated under a single owner with budget authority, or is it scattered across cost centers?",
        evidence: "Spend roll-up by tool, department, and month.",
      },
      {
        code: "I5",
        dimension: "Executive dashboarding",
        question:
          "Does the executive team have a standing AI dashboard covering adoption, risk, spend, and value?",
        evidence:
          "Dashboard with current metrics and documented review cadence.",
      },
    ],
  },
  {
    layer: "Execution",
    module: "AEGIS Deploy",
    accent: "text-cyan-400",
    ringColor: "border-cyan-500/40",
    dimensions: [
      {
        code: "E1",
        dimension: "Workflow inventory",
        question:
          "Are the top AI-augmentable workflows identified, prioritized, and owned?",
        evidence: "Workflow catalog with owner, status, expected outcome.",
      },
      {
        code: "E2",
        dimension: "Governed automation patterns",
        question:
          "Do workflow automations that use AI have consistent governance wrappers (approvals, human-in-loop, logging, rollback)?",
        evidence:
          "Automation inventory with control checklist applied.",
      },
      {
        code: "E3",
        dimension: "Prompt and template standards",
        question:
          "Is there a centralized prompt and template library with versioning and review?",
        evidence:
          "Prompt library with at least one templated prompt per core workflow.",
      },
      {
        code: "E4",
        dimension: "SOP alignment",
        question:
          "For AI-augmented workflows, do Standard Operating Procedures reflect the AI role, its limits, and the human checkpoints?",
        evidence: "Revised SOPs for top 3 AI-augmented workflows.",
      },
      {
        code: "E5",
        dimension: "Quality controls",
        question:
          "Is there a defined quality check for AI-produced work before it reaches a client, customer, or regulator?",
        evidence:
          "QA protocol for AI-produced output in at least one material process.",
      },
    ],
  },
  {
    layer: "Operations",
    module: "AEGIS Cadence",
    accent: "text-accent-green",
    ringColor: "border-accent-green/40",
    dimensions: [
      {
        code: "O1",
        dimension: "Governance review cadence",
        question:
          "Is there a standing governance review at quarterly or faster cadence, with documented agenda and outcomes?",
        evidence:
          "Last two review meeting minutes with attendance and actions.",
      },
      {
        code: "O2",
        dimension: "Adoption metrics",
        question:
          "Is adoption of sanctioned AI tools measured at the team level, with reasons-for-non-adoption understood?",
        evidence:
          "Adoption dashboard with segmentation by team.",
      },
      {
        code: "O3",
        dimension: "Training program",
        question:
          "Is there a role-based AI literacy curriculum, with completion tracked and content refreshed on a known cadence?",
        evidence:
          "Training roster with completion rates and last-refreshed date.",
      },
      {
        code: "O4",
        dimension: "Change management",
        question:
          "Are AI-driven role and process changes managed through a change framework, with HR and employee-relations involvement?",
        evidence: "Change log for the last two AI-driven changes.",
      },
      {
        code: "O5",
        dimension: "Continuous improvement loop",
        question:
          "Are learnings, incidents, and near-misses captured and folded back into policy, training, and tooling?",
        evidence: "Closed-loop register with at least three cycles.",
      },
    ],
  },
  {
    layer: "Leadership",
    module: "AEGIS Brief",
    accent: "text-accent-amber",
    ringColor: "border-accent-amber/40",
    dimensions: [
      {
        code: "L1",
        dimension: "Strategic AI narrative",
        question:
          "Can the CEO articulate the company's AI posture, ambition, and guardrails in a three-minute board-level narrative?",
        evidence: "Most recent board communication on AI.",
      },
      {
        code: "L2",
        dimension: "Executive alignment",
        question:
          "Is there measurable alignment across the C-suite on AI priorities, risk appetite, and investment?",
        evidence:
          "Alignment assessment from interviews — CEO, COO, CIO, CFO, CISO.",
      },
      {
        code: "L3",
        dimension: "Customer-facing posture",
        question:
          "Does the company have a defensible public position on AI — how it is used, what data touches it, what protections exist?",
        evidence:
          "Customer-facing AI statement, website disclosure, or contract language.",
      },
      {
        code: "L4",
        dimension: "Roadmap discipline",
        question:
          "Is there a 12-month AI roadmap with named outcomes, owners, and investment levels?",
        evidence: "Current roadmap reviewed by executive committee.",
      },
      {
        code: "L5",
        dimension: "Board fluency",
        question:
          "Does the board have sufficient AI fluency to exercise oversight, or is education and briefing part of the operating rhythm?",
        evidence:
          "Board education plan, last briefing date, materials.",
      },
    ],
  },
];

export default function GapAssessmentPage() {
  return (
    <ArtifactShell
      module="Diagnostic"
      moduleAccent="text-accent-green"
      artifactNumber="D.3"
      title="6-Layer Gap Assessment Framework"
      subtitle="Structured maturity scoring across thirty dimensions spanning all six AEGIS layers. Produces the prioritized gap register that drives the 90-Day Governance Roadmap."
      version="v1.0"
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="1"
        title="Purpose and Scope"
        intent="Convert Diagnostic inputs — interviews, Shadow AI scan, document review — into a defensible numeric posture. Scoring is the consultant's synthesis, not the client's self-assessment."
      >
        <p className="text-slate-300">
          The Gap Assessment scores the organization on thirty dimensions, five
          per AEGIS layer. Each dimension carries a maturity score from 0 to 4.
          Scores are evidence-backed; every dimension cites the source that
          justifies its score. The resulting posture picture is the backbone
          of the Diagnostic readout and the sequencing logic of the 90-Day
          Governance Roadmap.
        </p>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-6.2" },
            { name: "NIST AI RMF", control: "MAP-3.4" },
            { name: "ISO 42001", control: "6.1" },
            { name: "SOC 2", control: "CC3.1" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Maturity Scale"
        intent="The 0–4 scale is deliberately compressed. Most enterprises score between 1 and 3 on most dimensions. Avoid grade inflation."
      >
        <div className="space-y-3">
          {maturityScale.map((level) => (
            <div
              key={level.score}
              className="flex gap-4 rounded-md border border-slate-800 bg-navy-900/30 p-4"
            >
              <div
                className={`artifact-score-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-md border font-mono text-lg font-bold ${level.color}`}
              >
                {level.score}
              </div>
              <div>
                <p className="font-semibold text-slate-100">{level.label}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {level.definition}
                </p>
              </div>
            </div>
          ))}
        </div>
        <GuidanceCallout>
          A score of 4 requires recent audit evidence. In the absence of audit
          documentation, the maximum defensible score is 3. Resist client
          pressure to score higher; the credibility of the readout depends on
          it.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Scoring Procedure"
        intent="Four steps, applied to every dimension. No dimension is scored without evidence."
      >
        <ol className="ml-5 list-decimal space-y-2 text-sm text-slate-300">
          <li>
            <span className="font-semibold text-slate-100">Collect</span> —
            gather the required evidence from stakeholder interviews, document
            review, and the Shadow AI Scan. If evidence is absent, note the
            absence; do not imagine.
          </li>
          <li>
            <span className="font-semibold text-slate-100">Score</span> —
            apply the maturity scale. Default to the lower of two adjacent
            levels when uncertain.
          </li>
          <li>
            <span className="font-semibold text-slate-100">Cite</span> —
            record the evidence source(s). Every score must survive the
            question &quot;how do you know?&quot;
          </li>
          <li>
            <span className="font-semibold text-slate-100">Triangulate</span> —
            for any dimension scored 3 or 4, confirm with a second stakeholder
            or a document artifact. Self-reported high scores without
            triangulation drop one level.
          </li>
        </ol>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Dimensions by Layer"
        intent="Thirty dimensions across six layers. Every dimension is scored; no dimension is skipped. Omitted evidence is documented as such."
        pageBreak
      >
        <div className="space-y-10">
          {layers.map((layer) => (
            <div key={layer.layer}>
              <header className={`border-b pb-3 ${layer.ringColor}`}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Layer
                </p>
                <h3
                  className={`mt-1 text-xl font-bold ${layer.accent}`}
                >
                  {layer.layer} · {layer.module}
                </h3>
              </header>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="py-2 pr-3">Code</th>
                      <th className="py-2 pr-3">Dimension</th>
                      <th className="py-2 pr-3">Assessment Question</th>
                      <th className="py-2 pr-3">Required Evidence</th>
                      <th className="py-2 pr-3 text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {layer.dimensions.map((d) => (
                      <tr key={d.code}>
                        <td className="py-3 pr-3 align-top font-mono text-xs font-bold text-slate-400">
                          {d.code}
                        </td>
                        <td className="py-3 pr-3 align-top font-semibold text-slate-100">
                          {d.dimension}
                        </td>
                        <td className="py-3 pr-3 align-top">{d.question}</td>
                        <td className="py-3 pr-3 align-top text-xs italic text-slate-400">
                          {d.evidence}
                        </td>
                        <td className="py-3 pr-3 text-center align-top">
                          <span className="artifact-score-chip inline-flex h-8 w-14 items-center justify-center rounded border border-slate-700 bg-slate-800 font-mono text-sm font-bold text-slate-400">
                            <Placeholder>0-4</Placeholder>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Layer Posture Rollup"
        intent="Aggregate scores by layer to produce the six posture numbers that anchor the executive readout."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-4">Layer</th>
                <th className="py-2 pr-4 text-center">Dimensions Scored</th>
                <th className="py-2 pr-4 text-center">Average</th>
                <th className="py-2 pr-4">Posture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {layers.map((layer) => (
                <tr key={layer.layer}>
                  <td className="py-2 pr-4 font-semibold text-slate-100">
                    {layer.layer}
                  </td>
                  <td className="py-2 pr-4 text-center font-mono">5 / 5</td>
                  <td className="py-2 pr-4 text-center font-mono">
                    <Placeholder>score</Placeholder>
                  </td>
                  <td className="py-2 pr-4">
                    <Placeholder>Absent | Ad hoc | Defined | Operating | Managed</Placeholder>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-slate-600 bg-navy-900/40">
                <td className="py-2 pr-4 font-bold text-slate-100">
                  Composite posture
                </td>
                <td className="py-2 pr-4 text-center font-mono">30 / 30</td>
                <td className="py-2 pr-4 text-center font-mono font-bold text-electric-400">
                  <Placeholder>score</Placeholder>
                </td>
                <td className="py-2 pr-4 font-semibold">
                  <Placeholder>Posture label</Placeholder>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Gap Prioritization"
        intent="Not every gap is equal. Prioritize by lift — the distance to the next level — weighted by layer criticality for this client's industry and regulatory posture."
      >
        <SubSection title="Default layer criticality">
          <ul className="ml-5 list-disc space-y-1 text-sm text-slate-300">
            <li>
              <span className="font-semibold text-slate-100">
                Regulated industries (healthcare, financial services, legal):
              </span>{" "}
              Governance and Shield weighted 1.5×.
            </li>
            <li>
              <span className="font-semibold text-slate-100">
                Operationally complex (multi-site, multi-BU):
              </span>{" "}
              Execution and Operations weighted 1.5×.
            </li>
            <li>
              <span className="font-semibold text-slate-100">
                Board-sensitive (public, PE-backed, investor-scrutinized):
              </span>{" "}
              Leadership and Governance weighted 1.5×.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Prioritization formula">
          <p className="text-sm">
            For each dimension: Priority = (3 − current score) × layer
            weight. Dimensions with the top ten priorities become the input
            set for the 90-Day Governance Roadmap.
          </p>
        </SubSection>
        <GuidanceCallout>
          The goal of the 90 days is to bring every Layer to at least a
          &quot;Defined&quot; posture (score 2) and at least three dimensions
          across the organization to &quot;Operating&quot; (score 3). Avoid
          promising a 4 anywhere in the first 90 days.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Evidence Log"
        intent="Maintain a single evidence log that lists every source cited in scoring. This is the artifact an auditor asks to see."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-3">Dimension</th>
                <th className="py-2 pr-3">Evidence Source</th>
                <th className="py-2 pr-3">Date Collected</th>
                <th className="py-2 pr-3">Triangulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 pr-3 font-mono text-xs">
                  <Placeholder>G1, S2, etc.</Placeholder>
                </td>
                <td className="py-2 pr-3">
                  <Placeholder>Document, interview, scan result</Placeholder>
                </td>
                <td className="py-2 pr-3">
                  <Placeholder>YYYY-MM-DD</Placeholder>
                </td>
                <td className="py-2 pr-3">
                  <Placeholder>Second source confirmation</Placeholder>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArtifactSection>
    </ArtifactShell>
  );
}
