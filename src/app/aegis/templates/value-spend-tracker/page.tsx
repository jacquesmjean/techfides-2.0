"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type SpendCategory = {
  category: string;
  examples: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  annual: string;
};

const spendByCategory: SpendCategory[] = [
  {
    category: "Model & platform licenses",
    examples: "ChatGPT Enterprise, Claude for Work, Copilot",
    q1: "$78,400",
    q2: "$81,200",
    q3: "$84,900",
    q4: "$89,500",
    annual: "$334,000",
  },
  {
    category: "API / usage",
    examples: "OpenAI API, Anthropic API, embeddings, image gen",
    q1: "$22,800",
    q2: "$31,400",
    q3: "$38,600",
    q4: "$46,200",
    annual: "$139,000",
  },
  {
    category: "Compute & inference infra",
    examples: "GPU capacity, vector DBs, caching layer",
    q1: "$14,200",
    q2: "$17,600",
    q3: "$19,100",
    q4: "$22,400",
    annual: "$73,300",
  },
  {
    category: "Integration & engineering labor",
    examples: "Internal build, contract dev, integration consulting",
    q1: "$44,000",
    q2: "$52,000",
    q3: "$38,000",
    q4: "$36,000",
    annual: "$170,000",
  },
  {
    category: "Governance & assurance",
    examples: "AEGIS retainer, legal review, external audit",
    q1: "$28,000",
    q2: "$28,000",
    q3: "$28,000",
    q4: "$32,000",
    annual: "$116,000",
  },
  {
    category: "Training & enablement",
    examples: "Role-based curricula, certifications, vendor training",
    q1: "$8,400",
    q2: "$6,200",
    q3: "$9,800",
    q4: "$5,100",
    annual: "$29,500",
  },
];

const valueCategories = [
  {
    name: "Productivity uplift",
    definition:
      "Hours reclaimed by AI-assisted work, measured against a baseline workflow time study.",
    measurement:
      "Workflow-level time samples before and after, held to a 20-tool baseline quarterly. Converted to $ at fully loaded labor cost.",
    example:
      "RFP response drafting: 14 hrs → 4.5 hrs (median). 38 RFPs / qtr × 9.5 hrs × $85/hr = $30,685 / qtr.",
    example$: "$122,740 / yr",
  },
  {
    name: "Throughput gain",
    definition:
      "Additional work produced without adding headcount — e.g. more sales touches, more support tickets resolved, more deals processed.",
    measurement:
      "Delta in output volume at constant FTE, valued at contribution margin or per-unit revenue.",
    example:
      "Support tickets: 420/wk → 580/wk at same FTE. Contribution ≈ $11/ticket × 160 × 50 wks.",
    example$: "$88,000 / yr",
  },
  {
    name: "Error & rework reduction",
    definition:
      "Defects, misstatements, or compliance misses avoided. Measured against the historical incidence rate.",
    measurement:
      "Count of issues caught pre-release × historical cost to remediate post-release.",
    example:
      "Contract review: 4 redlines missed per quarter → 0.6. Avoided avg. remediation cost $7,500.",
    example$: "$102,000 / yr",
  },
  {
    name: "Revenue acceleration",
    definition:
      "Shortened cycle times on revenue-linked work: proposals, contracts, customer research, pricing.",
    measurement:
      "Cycle-time delta × weighted average deal value × probability uplift.",
    example:
      "Proposal turnaround 8 days → 3 days. Close-rate lift +4 pts on $2.1M pipeline slice.",
    example$: "$84,000 / yr",
  },
  {
    name: "Customer experience",
    definition:
      "CSAT / NPS / resolution-time improvements tied directly to AI-assisted channels.",
    measurement:
      "Pre/post CSAT on identified channels, with segment controls. Not a dollar value on its own — reported alongside retention.",
    example: "Tier-1 CSAT 82 → 89 in 2 quarters on AI-assisted support desk.",
    example$: "Tracked qualitatively",
  },
  {
    name: "Risk avoidance",
    definition:
      "Estimated exposure removed by governance controls — data-leak incidents avoided, regulatory fines avoided.",
    measurement:
      "Incident-rate baseline × estimated loss per incident, inclusive of remediation and reputational cost.",
    example:
      "One P0 data exposure avoided via DLP + approved-tools enforcement — est. cost avoided $450K–$1.2M.",
    example$: "Modeled, not booked",
  },
];

const initiativeScorecards = [
  {
    name: "Contract Review Assistant",
    sponsor: "General Counsel",
    invested: "$78,200",
    value: "$186,400",
    net: "+$108,200",
    roi: "2.4×",
    status: "Active · quarterly review",
  },
  {
    name: "Proposal Response Copilot",
    sponsor: "VP Sales",
    invested: "$54,000",
    value: "$206,700",
    net: "+$152,700",
    roi: "3.8×",
    status: "Active · scaling to EU segment",
  },
  {
    name: "Tier-1 Support Assistant",
    sponsor: "VP Customer",
    invested: "$96,000",
    value: "$148,000",
    net: "+$52,000",
    roi: "1.5×",
    status: "Active · CSAT uplift tracked",
  },
  {
    name: "Engineering Copilot Rollout",
    sponsor: "VP Engineering",
    invested: "$122,400",
    value: "$210,000 (est.)",
    net: "+$87,600",
    roi: "1.7×",
    status: "Active · model in revision",
  },
  {
    name: "Meeting Notes Automation",
    sponsor: "Chief of Staff",
    invested: "$28,000",
    value: "$41,200",
    net: "+$13,200",
    roi: "1.5×",
    status: "Conditional · legal/privacy review",
  },
  {
    name: "Marketing Imagery Pilot",
    sponsor: "Head of Marketing",
    invested: "$14,400",
    value: "—",
    net: "—",
    roi: "—",
    status: "Under Review · synthetic-data only",
  },
];

export default function ValueAndSpendTrackerPage() {
  return (
    <ArtifactShell
      module="Module 3 · Signal"
      moduleAccent="text-indigo-400"
      artifactNumber="3.3"
      title="AI Value & Spend Tracker"
      subtitle="Quarterly accounting of where AI investment is going and what it returns — so governance decisions are made on data, not vendor pitches."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="01"
        title="Purpose"
        intent="Every AI governance program is asked the same two questions at the board: how much are we spending, and what are we getting back? This tracker answers both with evidence."
      >
        <SubSection title="The discipline this enforces">
          <p>
            Spend is observable — licenses, API bills, labor charges, renewal
            dates. Value is only observable if someone has set up the
            measurement before the work starts. Half of this artifact exists
            to force that conversation: no new initiative goes into production
            without a value hypothesis and a measurement method.
          </p>
        </SubSection>

        <SubSection title="Two ledgers, one view">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Spend ledger</strong> — fully loaded AI cost, sourced
              from finance + the inventory (Artifact 3.1).
            </li>
            <li>
              <strong>Value ledger</strong> — claimed and measured value
              across six categories, with the evidence method named for each.
            </li>
          </ul>
          <p className="mt-2">
            Neither ledger is useful alone. Spend without value is a budget
            line item; value without spend is marketing.
          </p>
        </SubSection>

        <GuidanceCallout>
          Do not let clients report value on anecdote. The moment one number
          in this artifact is unsupported by a named measurement method, the
          whole document loses authority. If an initiative does not yet have
          measured value, list it in the scorecards with value marked &ldquo;—&rdquo; and
          status &ldquo;Under Review&rdquo; — honest beats flattering.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="02"
        title="Spend Ledger"
        intent="Six categories, quarterly cadence, sourced from finance and the inventory. Totals drive the executive dashboard and the board pack."
      >
        <div className="overflow-x-auto rounded-md border border-slate-800">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Typical items
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Q1
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Q2
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Q3
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Q4
                </th>
                <th className="border-b border-slate-800 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Annualized
                </th>
              </tr>
            </thead>
            <tbody>
              {spendByCategory.map((r) => (
                <tr key={r.category} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-4 py-3 align-top font-semibold text-slate-100">{r.category}</td>
                  <td className="px-4 py-3 align-top text-slate-400">{r.examples}</td>
                  <td className="px-4 py-3 text-right align-top text-slate-300">{r.q1}</td>
                  <td className="px-4 py-3 text-right align-top text-slate-300">{r.q2}</td>
                  <td className="px-4 py-3 text-right align-top text-slate-300">{r.q3}</td>
                  <td className="px-4 py-3 text-right align-top text-slate-300">{r.q4}</td>
                  <td className="px-4 py-3 text-right align-top font-semibold text-slate-100">
                    {r.annual}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-slate-100" colSpan={2}>
                  Total
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-100">$195,800</td>
                <td className="px-4 py-3 text-right font-bold text-slate-100">$216,400</td>
                <td className="px-4 py-3 text-right font-bold text-slate-100">$218,400</td>
                <td className="px-4 py-3 text-right font-bold text-slate-100">$231,200</td>
                <td className="px-4 py-3 text-right font-bold text-electric-400">$861,800</td>
              </tr>
            </tbody>
          </table>
        </div>

        <GuidanceCallout>
          Always include labor. The single biggest distortion in client AI
          accounting is treating integration effort as free because it&rsquo;s
          staffed internally. Book it at fully loaded rate or the ROI math
          flatters itself.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="03"
        title="Value Framework"
        intent="Six value categories, each with a definition, a measurement method, and an illustrative example. Anything claimed must fit one of these six and cite its method."
        pageBreak
      >
        <div className="space-y-4">
          {valueCategories.map((v) => (
            <div
              key={v.name}
              className="rounded-md border border-slate-800 bg-navy-900/30 p-5"
            >
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <h4 className="text-base font-bold text-slate-100">{v.name}</h4>
                <span className="text-xs font-semibold text-accent-green">{v.example$}</span>
              </div>
              <p className="mb-2 text-sm text-slate-300">{v.definition}</p>
              <p className="mb-2 text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-widest text-slate-500">
                  Method ·{" "}
                </span>
                {v.measurement}
              </p>
              <p className="text-xs italic text-slate-500">Example — {v.example}</p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="04"
        title="Per-Initiative Scorecards"
        intent="One row per live AI initiative. Net value and ROI are the summary — but the status column is what drives decisions."
      >
        <div className="overflow-x-auto rounded-md border border-slate-800">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                {[
                  "Initiative",
                  "Sponsor",
                  "Invested",
                  "Measured Value",
                  "Net",
                  "ROI",
                  "Status",
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
              {initiativeScorecards.map((r) => (
                <tr key={r.name} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-3 py-2 font-semibold text-slate-100">{r.name}</td>
                  <td className="px-3 py-2 text-slate-400">{r.sponsor}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{r.invested}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{r.value}</td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-100">{r.net}</td>
                  <td className="px-3 py-2 text-right font-semibold text-electric-400">{r.roi}</td>
                  <td className="px-3 py-2 text-slate-400">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="05"
        title="Decision Thresholds"
        intent="Thresholds turn the ledger into decisions. The governance committee reviews these against the scorecards every quarter."
      >
        <SubSection title="Scale — 2.0× ROI sustained for two quarters">
          <p>
            Expand seats, extend to adjacent use cases, request budget uplift.
            The initiative has proven the model; invest in throughput.
          </p>
        </SubSection>

        <SubSection title="Hold — between 1.2× and 2.0×, or too new to score">
          <p>
            Keep running, invest in measurement, review in 90 days. Do not
            expand scope or seats. If still below 2.0× at two-quarter mark,
            move to Rework.
          </p>
        </SubSection>

        <SubSection title="Rework — below 1.2× with identified cause">
          <p>
            Owner submits a rework plan: usually model choice, prompt
            library, or workflow redesign (Artifact 4.1). 60-day window. New
            scorecard at the end.
          </p>
        </SubSection>

        <SubSection title="Retire — below 1.0× after one rework, or value unmeasurable">
          <p>
            Sunset the initiative, retire the tool in the inventory (3.1),
            reallocate budget. Retirement is not failure — it is evidence the
            governance process works.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="06"
        title="Cadence"
        intent="The tracker is a discipline, not a document. These cadences keep it honest."
      >
        <SubSection title="Monthly">
          <ul className="list-disc space-y-1 pl-5">
            <li>Spend ledger reconciled against finance close + vendor bills.</li>
            <li>New initiatives registered with value hypothesis + method.</li>
          </ul>
        </SubSection>

        <SubSection title="Quarterly">
          <ul className="list-disc space-y-1 pl-5">
            <li>Full scorecard refresh. Decisions at every threshold applied.</li>
            <li>Value categories re-tested against measurement method integrity.</li>
            <li>Spend vs. budget, with forward-looking quarter forecast.</li>
          </ul>
        </SubSection>

        <SubSection title="Annually">
          <ul className="list-disc space-y-1 pl-5">
            <li>Full-year ROI report to the board (Artifact 6.2).</li>
            <li>Refresh the value framework — categories that produced no signal get retired.</li>
            <li>Budget plan for the next year based on measured returns.</li>
          </ul>
        </SubSection>

        <GuidanceCallout>
          Feed aggregate totals directly into the Executive AI Dashboard (6.1)
          and the Board Reporting Pack (6.2). The executive asks have to read
          the same numbers the governance committee sees — consistency across
          audiences is itself a form of credibility.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="07"
        title="Regulatory & Audit Notes"
        intent="The tracker is not itself a compliance control, but the evidence it produces is what SOC 2 / ISO / board auditors increasingly ask for when testing AI oversight."
      >
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            Demonstrates financial accountability for AI investments under
            SOX / SOC 2 governance tests.
          </li>
          <li>
            Satisfies ISO 42001 Clause 9 (performance evaluation) and Clause
            10 (improvement) with measurable outcomes.
          </li>
          <li>
            Supports board-level oversight expectations for material
            technology spend and strategic initiatives.
          </li>
        </ul>

        <Placeholder>CLIENT</Placeholder>: if external audit or customer
        assurance reviews will reference this artifact, capture the reviewing
        auditor name and engagement scope in the version history before
        publishing.

        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-5.1 / MEASURE-3.3" },
            { name: "ISO 42001", control: "Clause 9 / 10" },
            { name: "SOC 2", control: "CC4.1 / CC5.2" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
