"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type Slide = {
  number: string;
  title: string;
  purpose: string;
  accent: string;
  speakingTime: string;
  keyMoves: string[];
  content: React.ReactNode;
  talkTrack?: string;
  pitfalls?: string[];
};

const StatBlock = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: React.ReactNode;
  trend?: string;
}) => (
  <div className="rounded-md border border-slate-800 bg-navy-900/40 p-4">
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
      {label}
    </p>
    <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    {trend && <p className="mt-1 text-xs text-slate-400">{trend}</p>}
  </div>
);

const slides: Slide[] = [
  {
    number: "1",
    title: "Where We Are Today",
    purpose:
      "Ground the board in the objective posture before any recommendation. No prescription without diagnosis.",
    accent: "text-electric-400",
    speakingTime: "3 min",
    keyMoves: [
      "Lead with the overall maturity score, not the inventory count.",
      "Name the one layer that is farthest behind before covering any strengths.",
      "State the single biggest regulatory exposure as a number, not a category.",
    ],
    content: (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <StatBlock
            label="Overall Maturity"
            value={<Placeholder>1.X / 4.0</Placeholder>}
            trend="Industry benchmark: 2.3"
          />
          <StatBlock
            label="AI Systems Discovered"
            value={<Placeholder>XX</Placeholder>}
            trend={
              <>
                of which <Placeholder>YY</Placeholder> were unsanctioned
              </>
            }
          />
          <StatBlock
            label="P0 Risks Open"
            value={<Placeholder>X</Placeholder>}
            trend="Dollar exposure stated in Slide 2"
          />
          <StatBlock
            label="Policy Coverage"
            value={<Placeholder>X%</Placeholder>}
            trend="Target at day 90: 100%"
          />
        </div>
        <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Headline Finding
          </p>
          <p className="mt-2 text-sm text-slate-200">
            <Placeholder>
              ONE SENTENCE: THE POSTURE REALITY IN PLAIN ENGLISH
            </Placeholder>
          </p>
        </div>
      </div>
    ),
    talkTrack:
      "Do not pretend findings are better than they are. A board that learns the real story from a later incident never trusts the program again.",
    pitfalls: [
      "Leading with the inventory count — it looks like progress but says nothing about control.",
      "Burying the worst layer inside a balanced summary.",
      "Using AI jargon a non-technical director cannot decode in five seconds.",
    ],
  },
  {
    number: "2",
    title: "The Quantified Risk",
    purpose:
      "Translate posture into dollars, hours, or reputational exposure. The board must see what is at stake before they see the plan.",
    accent: "text-rose-400",
    speakingTime: "4 min",
    keyMoves: [
      "State the three largest risks with quantified exposure and a confidence range.",
      "Name the regulatory regimes most likely to apply if a risk lands.",
      "Call out the one risk that has already become real inside the organization.",
    ],
    content: (
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-navy-900/40 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
                <th className="px-4 py-3 font-semibold">Exposure</th>
                <th className="px-4 py-3 font-semibold">Likely Trigger</th>
                <th className="px-4 py-3 font-semibold">Regulatory Nexus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="px-4 py-3 font-mono text-xs text-rose-400">
                  R-01
                </td>
                <td className="px-4 py-3">
                  <Placeholder>RISK 1 SUMMARY</Placeholder>
                </td>
                <td className="px-4 py-3">
                  <Placeholder>$ RANGE</Placeholder>
                </td>
                <td className="px-4 py-3">
                  <Placeholder>TRIGGER</Placeholder>
                </td>
                <td className="px-4 py-3 text-xs">
                  <Placeholder>FRAMEWORK</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs text-rose-400">
                  R-02
                </td>
                <td className="px-4 py-3">
                  <Placeholder>RISK 2 SUMMARY</Placeholder>
                </td>
                <td className="px-4 py-3">
                  <Placeholder>$ RANGE</Placeholder>
                </td>
                <td className="px-4 py-3">
                  <Placeholder>TRIGGER</Placeholder>
                </td>
                <td className="px-4 py-3 text-xs">
                  <Placeholder>FRAMEWORK</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs text-rose-400">
                  R-03
                </td>
                <td className="px-4 py-3">
                  <Placeholder>RISK 3 SUMMARY</Placeholder>
                </td>
                <td className="px-4 py-3">
                  <Placeholder>$ RANGE</Placeholder>
                </td>
                <td className="px-4 py-3">
                  <Placeholder>TRIGGER</Placeholder>
                </td>
                <td className="px-4 py-3 text-xs">
                  <Placeholder>FRAMEWORK</Placeholder>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-md border border-accent-amber/30 bg-accent-amber/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent-amber">
            Already Realized
          </p>
          <p className="mt-2 text-sm text-slate-200">
            <Placeholder>
              THE INCIDENT OR NEAR-MISS THAT HAS ALREADY HAPPENED INTERNALLY
            </Placeholder>
          </p>
        </div>
      </div>
    ),
    talkTrack:
      "Boards respond to quantified exposure, not adjectives. Every risk must have a dollar estimate, even if stated as a range.",
    pitfalls: [
      "Listing ten risks. Three is defensible; ten is theater.",
      "Using 'high/medium/low' without a dollar anchor — executives read color codes as wallpaper.",
    ],
  },
  {
    number: "3",
    title: "Why This, Why Now",
    purpose:
      "Connect the findings to external pressure — regulatory, competitive, customer — that makes action non-optional.",
    accent: "text-purple-400",
    speakingTime: "3 min",
    keyMoves: [
      "Cite the specific regulation or customer requirement that sets the deadline.",
      "Reference competitor posture if a defensible data point exists.",
      "Close with the cost of a 12-month delay, stated concretely.",
    ],
    content: (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Regulatory
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              <Placeholder>PRIMARY REGULATORY DRIVER</Placeholder>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              <Placeholder>EFFECTIVE DATE + WHAT IT REQUIRES</Placeholder>
            </p>
          </div>
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Customer / Market
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              <Placeholder>CUSTOMER PRESSURE</Placeholder>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              <Placeholder>EXAMPLE: TOP 3 CLIENTS NOW ASK ABOUT AI GOVERNANCE IN RFPS</Placeholder>
            </p>
          </div>
          <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Competitive
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              <Placeholder>COMPETITIVE POSTURE</Placeholder>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              <Placeholder>WHAT PEERS ARE ALREADY DOING</Placeholder>
            </p>
          </div>
        </div>
        <div className="rounded-md border border-electric-500/30 bg-electric-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
            Cost of 12-Month Delay
          </p>
          <p className="mt-2 text-sm text-slate-200">
            <Placeholder>
              QUANTIFIED COST — LOST DEALS, REGULATORY FINES, OR PRODUCTIVITY
              LEFT ON THE TABLE
            </Placeholder>
          </p>
        </div>
      </div>
    ),
  },
  {
    number: "4",
    title: "The AEGIS Response",
    purpose:
      "Name the operating model the board is being asked to endorse. Six layers, eighteen artifacts, one cadence.",
    accent: "text-accent-green",
    speakingTime: "4 min",
    keyMoves: [
      "Show the six-layer model once, then stop explaining it — boards don't need the mechanics.",
      "Make explicit that the output is an operating model, not a policy binder.",
      "State that TechFides leaves behind artifacts, an internal owner, and a quarterly cadence.",
    ],
    content: (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { layer: "Governance", module: "Policy Core", accent: "text-electric-400" },
            { layer: "Security & Trust", module: "Shield", accent: "text-purple-400" },
            { layer: "Intelligence", module: "Signal", accent: "text-indigo-400" },
            { layer: "Execution", module: "Deploy", accent: "text-cyan-400" },
            { layer: "Operations", module: "Cadence", accent: "text-accent-green" },
            { layer: "Leadership", module: "Brief", accent: "text-accent-amber" },
          ].map((m) => (
            <div
              key={m.module}
              className="rounded-md border border-slate-800 bg-navy-900/30 p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {m.layer}
              </p>
              <p className={`mt-1 text-base font-bold ${m.accent}`}>
                AEGIS {m.module}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-300">
          Eighteen artifacts — three per layer — executed over ninety days,
          handed to a named internal owner, and reviewed quarterly by the AI
          Governance Council. This is the operating model. Everything else
          supports it.
        </p>
      </div>
    ),
  },
  {
    number: "5",
    title: "90-Day Plan on One Page",
    purpose:
      "Compress the roadmap into a single slide the board can hold TechFides accountable to.",
    accent: "text-electric-400",
    speakingTime: "4 min",
    keyMoves: [
      "Name the four phases and the gate that closes each.",
      "Point to the five gates as the board's check-in schedule.",
      "Commit to the handover date explicitly.",
    ],
    content: (
      <div className="space-y-3">
        {[
          {
            phase: "Phase A · Stand Up",
            window: "Weeks 1–5",
            gate: "Gate B — Risk Surface Mapped",
            focus:
              "Authority, policy, inventory, data classification, vendor assessments, risk register.",
          },
          {
            phase: "Phase B · Harden",
            window: "Weeks 6–8",
            gate: "Gate C — Incident-Ready",
            focus:
              "Incident runbook, shadow AI close-out, value and spend instrumentation.",
          },
          {
            phase: "Phase C · Scale",
            window: "Weeks 9–10",
            gate: "Gate D — Production Workflows",
            focus:
              "Governed workflow automations, prompt and template library, SOP rewires.",
          },
          {
            phase: "Phase D · Handover",
            window: "Weeks 11–12",
            gate: "Gate E — Handover Certified",
            focus:
              "Quarterly cadence, role-based training, executive dashboard, board pack, 12-month roadmap.",
          },
        ].map((p) => (
          <div
            key={p.phase}
            className="rounded-md border border-slate-800 bg-navy-900/20 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-100">
                {p.phase}
              </h3>
              <span className="text-xs font-medium text-electric-400">
                {p.window}
              </span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
              {p.gate}
            </p>
            <p className="mt-2 text-sm text-slate-300">{p.focus}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "6",
    title: "What Good Looks Like at Day 90",
    purpose:
      "State the success criteria the board will use to judge the engagement. Stated up front so they cannot be renegotiated later.",
    accent: "text-accent-green",
    speakingTime: "3 min",
    keyMoves: [
      "Use quantitative criteria wherever possible — adoption rate, training completion, artifact coverage.",
      "Explicitly name the internal owner receiving the handover.",
      "Commit to what the next board pack will contain.",
    ],
    content: (
      <div className="grid gap-3 md:grid-cols-2">
        {[
          {
            bar: "Governance",
            items: [
              "Council has met six times; acknowledgment coverage at 100%.",
              "Risk Register: ≥25 quantified risks, named owners, review dates.",
            ],
          },
          {
            bar: "Security",
            items: [
              "P0 Shadow AI findings closed or formally accepted.",
              "Incident runbook exercised; after-action report on file.",
            ],
          },
          {
            bar: "Adoption",
            items: [
              "Three governed workflows in production with before/after metrics.",
              "Training completion ≥90%; pass rate ≥80%.",
            ],
          },
          {
            bar: "Board-Readiness",
            items: [
              "Board pack delivered with incident, inventory, ROI, and risk sections.",
              "12-Month Roadmap ratified with budget envelope.",
            ],
          },
        ].map((g) => (
          <div
            key={g.bar}
            className="rounded-md border border-accent-green/30 bg-accent-green/5 p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-green">
              {g.bar}
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "7",
    title: "Investment & Return",
    purpose:
      "Present the cost, the return case, and the retainer decision. No hedging.",
    accent: "text-accent-amber",
    speakingTime: "4 min",
    keyMoves: [
      "Show total engagement cost next to a conservative ROI range with assumptions.",
      "State the retainer price and what it covers — and what happens without it.",
      "Request the specific decision you want from the board today.",
    ],
    content: (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-slate-800 bg-navy-900/40 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Diagnostic
            </p>
            <p className="mt-2 text-xl font-bold text-slate-100">
              <Placeholder>$ PRICE</Placeholder>
            </p>
            <p className="mt-1 text-xs text-slate-400">2-week fixed scope</p>
          </div>
          <div className="rounded-md border border-electric-500/40 bg-electric-500/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
              Core Implementation
            </p>
            <p className="mt-2 text-xl font-bold text-slate-100">
              <Placeholder>$ PRICE</Placeholder>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              12-week delivery · 18 artifacts
            </p>
          </div>
          <div className="rounded-md border border-accent-amber/40 bg-accent-amber/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-amber">
              Governance Retainer
            </p>
            <p className="mt-2 text-xl font-bold text-slate-100">
              <Placeholder>$ PRICE / mo</Placeholder>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Quarterly reviews · on-call advisory
            </p>
          </div>
        </div>
        <div className="rounded-md border border-slate-800 bg-navy-900/20 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Conservative Return Case
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Productivity recapture of{" "}
            <Placeholder>X HOURS PER EMPLOYEE / MONTH</Placeholder> across{" "}
            <Placeholder>Y EMPLOYEES</Placeholder> equates to{" "}
            <Placeholder>$ RANGE / YEAR</Placeholder>. Avoided incident /
            regulatory exposure separately estimated at{" "}
            <Placeholder>$ RANGE</Placeholder>.
          </p>
        </div>
        <div className="rounded-md border border-rose-500/30 bg-rose-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
            Cost of Not Retaining
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Governance programs typically decay 4–6 months post-handover
            without an active cadence. Without the retainer, the client
            absorbs that risk; TechFides cannot guarantee sustained posture.
          </p>
        </div>
      </div>
    ),
    talkTrack:
      "Present the retainer as optional but stated. If a client declines both the retainer and naming an internal owner, state on record that the program is at high risk of decay.",
  },
  {
    number: "8",
    title: "Decisions Requested Today",
    purpose:
      "Close with explicit asks so the board meeting produces commitments — not vague encouragement.",
    accent: "text-electric-400",
    speakingTime: "3 min",
    keyMoves: [
      "State each ask as a named decision with a voting question.",
      "Identify the named internal owner being proposed.",
      "Commit to the date of the first Council meeting.",
    ],
    content: (
      <ol className="space-y-4">
        <li className="rounded-md border border-electric-500/30 bg-electric-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
            Decision 1 · Core Implementation
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Approve the 12-week Core Implementation engagement at the stated
            price, scope, and gate structure. Vote: Approve / Modify / Decline.
          </p>
        </li>
        <li className="rounded-md border border-electric-500/30 bg-electric-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
            Decision 2 · Internal Owner
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Confirm <Placeholder>INTERNAL OWNER NAME + TITLE</Placeholder> as
            the program owner receiving handover on day 90. This person
            chairs the Council from that date forward.
          </p>
        </li>
        <li className="rounded-md border border-electric-500/30 bg-electric-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
            Decision 3 · Retainer
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Approve the Governance Retainer at the stated monthly rate, to
            begin on day 91. Vote: Approve / Defer to Q+1 Review.
          </p>
        </li>
        <li className="rounded-md border border-electric-500/30 bg-electric-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">
            Decision 4 · Council Kickoff
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Schedule the first AI Governance Council meeting on{" "}
            <Placeholder>DATE</Placeholder>, chaired by{" "}
            <Placeholder>SPONSOR</Placeholder>.
          </p>
        </li>
      </ol>
    ),
  },
];

export default function ExecutiveSummaryDeck() {
  return (
    <ArtifactShell
      module="Diagnostic Engagement"
      moduleAccent="text-accent-green"
      artifactNumber="D.4"
      title="Executive Summary & Board Deck"
      subtitle="An eight-slide narrative that converts diagnostic findings into a board-level decision. Designed to be spoken in 25 minutes and produce explicit commitments."
      classification="BOARD"
    >
      <ArtifactSection
        number="1"
        title="Purpose & Audience"
        intent="This is the close of the diagnostic. Its only job is to produce four decisions from the board: approve the engagement, name an internal owner, approve the retainer, and schedule the Council kickoff."
      >
        <p className="text-sm text-slate-300">
          The deck is built around the way boards actually listen: posture
          first, risk in dollars, external pressure, the response, the plan,
          success criteria, investment, and decisions. Each slide carries a
          defined purpose, a speaking time budget, and the specific moves the
          presenter must land. If the slide cannot land its move inside its
          speaking window, the slide is cut — not the window extended.
        </p>
        <GuidanceCallout>
          Never walk a board through &quot;the six-layer AEGIS model&quot; for
          more than 60 seconds. Boards buy outcomes, not architecture. Use the
          model diagram once, on slide 4, and move on.
        </GuidanceCallout>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.1" },
            { name: "ISO 42001", control: "Clause 5 · Leadership" },
            { name: "SOC 2", control: "CC2.3" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Narrative Arc"
        intent="The eight slides form one argument. Every slide must advance it; any slide that does not is cut."
      >
        <ol className="space-y-2 text-sm text-slate-300">
          <li>
            <span className="font-mono text-xs text-slate-500">1 →</span>{" "}
            Where we are (posture)
          </li>
          <li>
            <span className="font-mono text-xs text-slate-500">2 →</span>{" "}
            What it costs if unresolved (quantified risk)
          </li>
          <li>
            <span className="font-mono text-xs text-slate-500">3 →</span>{" "}
            Why now (external pressure)
          </li>
          <li>
            <span className="font-mono text-xs text-slate-500">4 →</span> The
            response (AEGIS operating model)
          </li>
          <li>
            <span className="font-mono text-xs text-slate-500">5 →</span> The
            plan (90 days on one page)
          </li>
          <li>
            <span className="font-mono text-xs text-slate-500">6 →</span>{" "}
            What good looks like (success criteria)
          </li>
          <li>
            <span className="font-mono text-xs text-slate-500">7 →</span>{" "}
            Investment and return
          </li>
          <li>
            <span className="font-mono text-xs text-slate-500">8 →</span>{" "}
            Decisions requested today
          </li>
        </ol>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Slide Library"
        intent="Each slide below is delivery-ready. Placeholders mark the client-specific fields that must be populated from the diagnostic findings."
        pageBreak
      >
        <div className="space-y-10">
          {slides.map((s) => (
            <div
              key={s.number}
              className="rounded-lg border border-slate-800 bg-navy-900/20 p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${s.accent}`}
                  >
                    Slide {s.number}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-100">
                    {s.title}
                  </h3>
                </div>
                <span className="rounded-sm border border-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {s.speakingTime}
                </span>
              </div>

              <p className="mt-4 text-sm italic text-slate-400">
                <span className="not-italic font-semibold text-slate-300">
                  Purpose —
                </span>{" "}
                {s.purpose}
              </p>

              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Key Moves
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {s.keyMoves.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-md border border-slate-800 bg-slate-950/40 p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Slide Content
                </p>
                {s.content}
              </div>

              {s.talkTrack && (
                <div className="mt-5 rounded-md border border-accent-amber/30 bg-accent-amber/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-amber">
                    Presenter Talk Track
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{s.talkTrack}</p>
                </div>
              )}

              {s.pitfalls && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    Avoid
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {s.pitfalls.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Pre-Read & Appendix"
        intent="What travels with the deck. The deck is the spoken artifact; the appendix is what the board reads afterward when they need the receipts."
      >
        <SubSection title="Pre-Read Packet (sent 48 hours ahead)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Two-page executive summary echoing slides 1–2 in prose form.
            </li>
            <li>
              Shadow AI Scan Executive Summary (redacted of tool names if
              legally advised).
            </li>
            <li>
              Gap Assessment Layer Rollup — the one-page scorecard, not the
              full 30-dimension detail.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Appendix (brought to the room, not presented)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Full Gap Assessment (30 dimensions, scored and cited).</li>
            <li>
              Full AI Risk Register with exposure calculations and owners.
            </li>
            <li>Full AI Inventory export as of the presentation date.</li>
            <li>
              The 12-week Master Artifact Schedule from the 90-Day Roadmap
              (D.3).
            </li>
            <li>
              Counsel-reviewed summary of regulatory nexus and anticipated
              obligations.
            </li>
          </ul>
        </SubSection>
        <GuidanceCallout>
          If a board member asks for a data point during the presentation and
          it is in the appendix, open the appendix and show it. Do not
          paraphrase. Showing the receipt is what converts a briefing into a
          decision.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Logistics & Delivery Notes"
      >
        <SubSection title="Format">
          <p>
            Deliver as a slide deck paired with a 2-page written executive
            summary. The deck is 8 content slides plus a title and a closing
            &quot;Decisions&quot; slide — 10 slides in total. No transitional
            or agenda slides.
          </p>
        </SubSection>
        <SubSection title="Timebox">
          <p>
            25 minutes of spoken content; 20 minutes reserved for discussion
            and decisions. If the meeting slot is less than 45 minutes, cut
            slides 3 and 6 and fold their content into slides 2 and 5
            respectively.
          </p>
        </SubSection>
        <SubSection title="Who Presents">
          <p>
            The Executive Sponsor opens (slides 1–2 and the decisions slide);
            TechFides presents slides 3–7. The handshake on ownership matters
            — it signals to the board that this is a joint commitment, not a
            vendor pitch.
          </p>
        </SubSection>
        <SubSection title="Distribution After">
          <p>
            The approved deck and written summary are filed in the
            client&apos;s board portal under the engagement record. TechFides
            retains no copy beyond what is specified in the data retention
            rider. Any revisions after the meeting are controlled through the
            engagement&apos;s change request process.
          </p>
        </SubSection>
      </ArtifactSection>
    </ArtifactShell>
  );
}
