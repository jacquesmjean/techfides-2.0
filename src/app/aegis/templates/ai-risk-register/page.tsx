"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type RiskCategory = {
  code: string;
  name: string;
  accent: string;
  examples: string[];
};

const categories: RiskCategory[] = [
  {
    code: "DS",
    name: "Data & Security",
    accent: "text-rose-400",
    examples: [
      "Regulated data (PHI, PII, PCI) sent to an AI tool without a BAA or DPA.",
      "Model provider retains prompts and outputs despite enterprise settings, exposing trade secrets.",
      "Vector database used for RAG contains restricted content that bypasses access controls.",
    ],
  },
  {
    code: "LG",
    name: "Legal & Regulatory",
    accent: "text-purple-400",
    examples: [
      "EU AI Act obligations apply to a deployed system and no conformity evidence exists.",
      "AI-generated communication with customers creates an implied contract or regulatory disclosure duty.",
      "Copyright or IP exposure from model training data or generated output that mirrors a protected work.",
    ],
  },
  {
    code: "OP",
    name: "Operational",
    accent: "text-electric-400",
    examples: [
      "Production workflow depends on a model that can silently change version without notice.",
      "Shadow AI creates parallel processes that bypass SOP review steps.",
      "Critical business knowledge concentrated in a prompt library with no backup or version control.",
    ],
  },
  {
    code: "FN",
    name: "Financial & Vendor",
    accent: "text-accent-amber",
    examples: [
      "AI spend growing 40%+ YoY with no cost owner or utilization data.",
      "Vendor lock-in on a model or tool with no defensible switching plan.",
      "License-per-seat spend on tools used by a small fraction of the license holders.",
    ],
  },
  {
    code: "RP",
    name: "Reputational & Ethical",
    accent: "text-indigo-400",
    examples: [
      "Hiring or performance decisions made with AI screening that has not been bias-audited.",
      "Customer-facing chat feature produces harmful, discriminatory, or defamatory output.",
      "Undisclosed AI use in professional services creates a trust breach when discovered.",
    ],
  },
  {
    code: "PR",
    name: "Personnel & Change",
    accent: "text-cyan-400",
    examples: [
      "Key employees quietly use unsanctioned AI, resigning with institutional knowledge embedded in external tools.",
      "Policy fatigue: staff stop reading updates and miss a material change.",
      "Training completion high but retention low — assessment scores drop in spot-checks.",
    ],
  },
];

type RiskRow = {
  id: string;
  title: string;
  category: string;
  likelihood: number;
  impact: number;
  exposure: string;
  owner: string;
  treatment: "Mitigate" | "Accept" | "Transfer" | "Avoid";
  due: string;
};

const exampleRisks: RiskRow[] = [
  {
    id: "R-001",
    title: "Shadow AI use of consumer tools on client material",
    category: "DS",
    likelihood: 4,
    impact: 5,
    exposure: "$250–$800K",
    owner: "CISO",
    treatment: "Mitigate",
    due: "Week 8",
  },
  {
    id: "R-002",
    title: "Model provider retention settings not verified in writing",
    category: "DS",
    likelihood: 3,
    impact: 4,
    exposure: "$100–$400K",
    owner: "CISO",
    treatment: "Mitigate",
    due: "Week 5",
  },
  {
    id: "R-003",
    title: "AI coding assistant produces insecure authentication flow",
    category: "OP",
    likelihood: 3,
    impact: 5,
    exposure: "$200–$1.2M",
    owner: "CTO",
    treatment: "Mitigate",
    due: "Ongoing",
  },
  {
    id: "R-004",
    title: "Customer-facing AI ships without disclosure notice",
    category: "LG",
    likelihood: 2,
    impact: 5,
    exposure: "$100–$500K",
    owner: "General Counsel",
    treatment: "Avoid",
    due: "Pre-launch gate",
  },
  {
    id: "R-005",
    title: "AI spend grows untracked across function budgets",
    category: "FN",
    likelihood: 5,
    impact: 3,
    exposure: "$50–$200K / yr",
    owner: "CFO",
    treatment: "Mitigate",
    due: "Week 8",
  },
  {
    id: "R-006",
    title: "Resume-screening AI lacks bias audit",
    category: "RP",
    likelihood: 3,
    impact: 4,
    exposure: "$150–$2M",
    owner: "CHRO",
    treatment: "Mitigate",
    due: "Week 10",
  },
  {
    id: "R-007",
    title: "Vendor subprocessor change unnoticed",
    category: "DS",
    likelihood: 3,
    impact: 4,
    exposure: "$75–$300K",
    owner: "CISO",
    treatment: "Mitigate",
    due: "Ongoing",
  },
  {
    id: "R-008",
    title: "Prompt library contains P1 data pasted into templates",
    category: "DS",
    likelihood: 4,
    impact: 3,
    exposure: "$50–$200K",
    owner: "Knowledge Ops",
    treatment: "Mitigate",
    due: "Week 10",
  },
];

function Dot({ n, label }: { n: number; label: string }) {
  const color =
    n >= 4
      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
      : n === 3
      ? "bg-accent-amber/15 border-accent-amber/40 text-accent-amber"
      : "bg-electric-500/15 border-electric-500/40 text-electric-300";
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded border font-mono text-xs font-bold ${color}`}
      title={label}
    >
      {n}
    </span>
  );
}

function treatmentStyle(t: RiskRow["treatment"]) {
  const map = {
    Mitigate: "bg-electric-500/15 text-electric-300 border-electric-500/40",
    Accept: "bg-accent-amber/15 text-accent-amber border-accent-amber/40",
    Transfer: "bg-purple-500/15 text-purple-300 border-purple-500/40",
    Avoid: "bg-rose-500/15 text-rose-300 border-rose-500/40",
  } as const;
  return map[t];
}

function severityColor(score: number) {
  if (score >= 20) return "bg-rose-500/20 text-rose-300 border-rose-500/50";
  if (score >= 12)
    return "bg-accent-amber/20 text-accent-amber border-accent-amber/50";
  if (score >= 6)
    return "bg-electric-500/20 text-electric-300 border-electric-500/50";
  return "bg-slate-700/30 text-slate-300 border-slate-600/50";
}

export default function AIRiskRegister() {
  return (
    <ArtifactShell
      module="AEGIS Policy Core"
      moduleAccent="text-electric-400"
      artifactNumber="1.3"
      title="AI Risk Register"
      subtitle="The live inventory of AI risks — quantified, owned, and reviewed. Risks that are not on this register cannot be addressed; risks on this register cannot be ignored."
      classification="CLIENT-RESTRICTED"
    >
      <ArtifactSection
        number="1"
        title="Purpose"
        intent="A risk register is a living document, not a deliverable. Its value is in what it forces the organization to do — name risks, assign owners, quantify exposure, and return to the decisions quarterly."
      >
        <p className="text-sm text-slate-300">
          This register is the system of record for AI risks at{" "}
          <Placeholder>CLIENT NAME</Placeholder>. It is owned by the AI
          Governance Lead, ratified by the Council, and reviewed in full
          every quarter. Any risk discussed outside the register — in a
          meeting, an email, or an incident debrief — must be recorded here
          within five business days or it does not exist for governance
          purposes.
        </p>
        <GuidanceCallout>
          Registers fail when they become tidy. Resist the urge to close
          risks that are merely dormant. A risk is closed when the condition
          that produced it is structurally eliminated — not when people stop
          discussing it.
        </GuidanceCallout>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "MAP-1, MEASURE-1, MANAGE-1" },
            { name: "ISO 42001", control: "Clause 6.1 · Risk & opportunity" },
            { name: "SOC 2", control: "CC3.1, CC3.2, CC3.3" },
            { name: "EU AI Act", control: "Art. 9 · Risk management system" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Risk Categories"
        intent="Six buckets covering the territory. Every risk in the register is tagged to one primary category; secondary categories are noted in the detail row."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {categories.map((c) => (
            <div
              key={c.code}
              className="rounded-lg border border-slate-800 bg-navy-900/20 p-4"
            >
              <div className="flex items-baseline gap-3">
                <span
                  className={`font-mono text-xs font-bold tracking-widest ${c.accent}`}
                >
                  {c.code}
                </span>
                <h3 className={`text-base font-semibold ${c.accent}`}>
                  {c.name}
                </h3>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {c.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Scoring Method"
        intent="Quantified exposure, not adjectives. Every risk gets a likelihood, an impact, and a dollar band."
      >
        <SubSection title="Likelihood scale (1–5)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>1 — Rare.</strong> Would require an unlikely combination
              of failures; no realistic scenario in the next 12 months.
            </li>
            <li>
              <strong>2 — Unlikely.</strong> Could occur but no evidence it
              has or is trending up.
            </li>
            <li>
              <strong>3 — Possible.</strong> Has occurred at peers, or there
              is indirect evidence inside the organization.
            </li>
            <li>
              <strong>4 — Likely.</strong> Near-misses already observed; the
              condition for occurrence is present.
            </li>
            <li>
              <strong>5 — Near certain.</strong> Expected to occur in the
              next 12 months without intervention.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Impact scale (1–5)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>1 — Negligible.</strong> Cost or disruption absorbed
              without material effect.
            </li>
            <li>
              <strong>2 — Minor.</strong> Addressable within a function; no
              board or regulator attention.
            </li>
            <li>
              <strong>3 — Moderate.</strong> Cross-functional response
              required; may trigger client notification.
            </li>
            <li>
              <strong>4 — Major.</strong> Executive attention; material
              financial cost; reputational exposure.
            </li>
            <li>
              <strong>5 — Severe.</strong> Board-level incident; regulatory
              action plausible; existential for a product or line of business.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Severity = Likelihood × Impact">
          <p>
            A risk&apos;s severity is the product. Score ≥20 is P0 and is
            reviewed at every Council meeting. 12–19 is P1 and is reviewed
            quarterly. 6–11 is P2, reviewed annually. Below 6 is tracked but
            not actively managed unless re-scored.
          </p>
        </SubSection>
        <SubSection title="Dollar exposure">
          <p>
            Every scored risk carries a dollar band (range, with stated
            assumptions). Dollar bands are the currency of board conversations
            and force a discipline that adjective-based risk assessments do
            not. Bands can be wide, but they cannot be absent.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Active Register"
        intent="The live inventory. Populated from the diagnostic and maintained continuously. The rows below are illustrative starting risks that appear in most engagements."
        pageBreak
      >
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">ID</th>
                <th className="px-3 py-3 font-semibold">Risk</th>
                <th className="px-3 py-3 font-semibold">Cat</th>
                <th className="px-3 py-3 text-center font-semibold">L</th>
                <th className="px-3 py-3 text-center font-semibold">I</th>
                <th className="px-3 py-3 text-center font-semibold">Sev</th>
                <th className="px-3 py-3 font-semibold">Exposure</th>
                <th className="px-3 py-3 font-semibold">Owner</th>
                <th className="px-3 py-3 font-semibold">Treatment</th>
                <th className="px-3 py-3 font-semibold">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {exampleRisks.map((r) => {
                const sev = r.likelihood * r.impact;
                return (
                  <tr key={r.id} className="hover:bg-navy-900/30">
                    <td className="px-3 py-3 font-mono text-xs text-slate-500">
                      {r.id}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-200">
                      {r.title}
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded border border-slate-700 bg-slate-800/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-300">
                        {r.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Dot n={r.likelihood} label="Likelihood" />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Dot n={r.impact} label="Impact" />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex h-7 w-10 items-center justify-center rounded border font-mono text-xs font-bold ${severityColor(sev)}`}
                      >
                        {sev}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-400">
                      {r.exposure}
                    </td>
                    <td className="px-3 py-3 text-slate-400">{r.owner}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-semibold ${treatmentStyle(r.treatment)}`}
                      >
                        {r.treatment}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{r.due}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <GuidanceCallout>
          Replace the illustrative rows with risks specific to the engagement
          before the first Council meeting. A diagnostic typically surfaces
          15–25 risks before treatments; 60+ after a full Gap Assessment.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Risk Detail Template"
        intent="The format every entry in §4 expands to. One page per risk when the row is clicked through, or on a standalone sheet for P0 risks."
      >
        <div className="rounded-lg border border-slate-800 bg-navy-900/20 p-5">
          <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
            <div>
              <p className="font-mono text-xs text-slate-500">
                <Placeholder>R-XXX</Placeholder>
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-100">
                <Placeholder>RISK TITLE</Placeholder>
              </h3>
            </div>
            <span className="rounded border border-slate-700 bg-slate-800/40 px-2 py-1 font-mono text-[10px] font-bold text-slate-300">
              <Placeholder>CAT</Placeholder>
            </span>
          </div>
          <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Condition
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>
                  THE STATE OR PATTERN THAT MAKES THE RISK POSSIBLE
                </Placeholder>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Consequence
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>
                  WHAT HAPPENS IF THE RISK LANDS, STATED CONCRETELY
                </Placeholder>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Likelihood · Impact · Severity
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>L=X, I=Y, SEV=XY</Placeholder>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Exposure
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>$ LOW–$ HIGH · WITH STATED ASSUMPTIONS</Placeholder>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Owner · Backup
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>NAME + TITLE · BACKUP NAME</Placeholder>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Treatment
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>MITIGATE / ACCEPT / TRANSFER / AVOID</Placeholder>
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Treatment Plan
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>
                  CONCRETE ACTIONS, WITH DATES, THAT WILL CHANGE L OR I
                </Placeholder>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Review cadence
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>NEXT REVIEW DATE</Placeholder>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Related artifacts
              </dt>
              <dd className="mt-1 text-slate-300">
                <Placeholder>
                  VRA #, INCIDENT #, POLICY SECTION, ETC.
                </Placeholder>
              </dd>
            </div>
          </dl>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Treatment Decisions"
        intent="Four paths, chosen explicitly. The register is not a to-do list — it is a record of decisions made about exposure."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              name: "Mitigate",
              body: "Reduce likelihood, impact, or both through controls, process changes, or engineering. Default treatment for risks at P0/P1. A mitigate decision comes with a treatment plan and a due date.",
            },
            {
              name: "Accept",
              body: "Choose to carry the risk at its current level because treatment is disproportionate to exposure. Acceptance requires an accountable decision-maker named in the register and a scheduled re-review date.",
            },
            {
              name: "Transfer",
              body: "Shift the exposure to a third party — insurance, a vendor contract, or a client assumption. Transfer is never total; the residual risk stays on the register.",
            },
            {
              name: "Avoid",
              body: "Change the activity so the risk condition no longer applies. Avoid is the strongest treatment but is not always available — use it when the risk is intolerable and the activity is optional.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-md border border-slate-800 bg-navy-900/20 p-4"
            >
              <h3 className="text-sm font-semibold text-slate-100">{t.name}</h3>
              <p className="mt-1 text-sm text-slate-300">{t.body}</p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Review Cadence & Governance"
        intent="The operating rhythm. Without cadence the register rots; with cadence it becomes the heartbeat of the program."
      >
        <div className="space-y-3">
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-sm font-semibold text-slate-100">
              At every Council meeting (bi-weekly)
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Every P0 risk reviewed with owner present.</li>
              <li>New risks added in the preceding two weeks ratified.</li>
              <li>Closed risks removed with a closure statement on file.</li>
            </ul>
          </div>
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-sm font-semibold text-slate-100">
              Quarterly
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Full register reviewed; P1 risks re-scored.</li>
              <li>
                Exposure totals rolled up and reported to the Executive Sponsor.
              </li>
              <li>Materiality threshold re-confirmed.</li>
            </ul>
          </div>
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-sm font-semibold text-slate-100">Annually</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Categories reviewed; new categories added as needed.</li>
              <li>
                Scoring scales recalibrated against incident history and peer
                benchmarks.
              </li>
              <li>Register reported to the board with rollup and trend.</li>
            </ul>
          </div>
        </div>
      </ArtifactSection>
    </ArtifactShell>
  );
}
