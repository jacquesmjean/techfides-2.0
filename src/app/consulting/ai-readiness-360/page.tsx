import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness & Risk Assessment | TechFides Consulting",
  description:
    "A forensic diagnostic of your organization's ability to execute, govern, and extract value from AI. Validate your strategy before you scale. 15-day structured engagement.",
};

const quadrants = [
  {
    icon: "\u2699",
    name: "Strategy",
    question: "Are your use cases aligned to business value?",
    color: "text-electric-400",
    borderColor: "border-electric-500/30",
    bgColor: "bg-electric-500/5",
    details: [
      "Use case identification and prioritization",
      "Business value mapping and ROI projections",
      "Competitive AI landscape analysis",
      "Executive vision alignment and consensus",
      "Short-term wins vs. long-term transformation balance",
    ],
  },
  {
    icon: "\u2713",
    name: "Governance",
    question: "Are safety and compliance controls in place?",
    color: "text-accent-green",
    borderColor: "border-accent-green/30",
    bgColor: "bg-accent-green/5",
    details: [
      "Regulatory and compliance framework review",
      "Ethical AI guidelines and bias considerations",
      "Risk management policies and AI applicability",
      "Audit trail and explainability requirements",
      "Vendor and third-party risk assessment",
    ],
  },
  {
    icon: "\u2593",
    name: "Data",
    question: "Is your data ready for algorithmic consumption?",
    color: "text-accent-amber",
    borderColor: "border-accent-amber/30",
    bgColor: "bg-accent-amber/5",
    details: [
      "Data quality scoring (accuracy, completeness, consistency)",
      "Data pipeline architecture and accessibility",
      "Data governance policies and enforcement",
      "Data silos and integration readiness",
      "Historical data depth and labeling maturity",
    ],
  },
  {
    icon: "\u26B2",
    name: "Tech",
    question: "Can your infrastructure support scale?",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/5",
    details: [
      "Current compute capacity (CPU, GPU, memory)",
      "Network architecture and bandwidth analysis",
      "Software stack compatibility and technical debt",
      "Cloud vs. on-premise infrastructure assessment",
      "Security posture and vulnerability analysis",
    ],
  },
];

const deliverables = [
  {
    name: "Maturity Scorecard",
    description:
      "A quantitative scoring of your organization across 5 dimensions and 25 sub-capabilities. Benchmarked against industry standards.",
    subItems: ["Current State Assessment", "Target State Definition"],
  },
  {
    name: "Risk Registry",
    description:
      "A prioritized log of operational, technical, and ethical risks that must be remediated before scaling.",
    subItems: ["Impact / Probability Matrix", "Mitigation Strategies"],
  },
  {
    name: "Strategic Roadmap",
    description:
      "A sequenced, actionable 6-12 month plan to close gaps and deliver specific use cases.",
    subItems: ["Resource Requirements", "Timeline & Dependencies"],
  },
];

const faqs = [
  {
    q: "Do we need to purchase TEDOS&trade; OS to use this?",
    a: "No. This is a standalone engagement. While the data collected is compatible with TEDOS&trade; OS, you are free to use the findings with any toolset.",
  },
  {
    q: "How much time is required from our team?",
    a: "We respect your time. Expect 2-3 hours for key stakeholders (interviews) and minimal support from IT for data access. We do the heavy lifting.",
  },
];

export default function AIReadiness360Page() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm font-semibold text-electric-400">
            PROFESSIONAL ENGAGEMENT
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            AI Readiness &amp;
            <br />
            <span className="text-electric-400">Risk Assessment</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Validate your strategy before you scale. A forensic diagnostic of
            your organization&apos;s ability to execute, govern, and extract
            value from AI.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/pricing"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              Request Executive Briefing
            </Link>
            <Link
              href="/stack"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              View Delivery Model
            </Link>
          </div>
        </div>
      </section>

      {/* Why Start Here */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Why Start Here?</h2>
            <p className="mt-4 text-slate-400">
              Most AI failures don&apos;t happen because of bad models. They
              happen because organizations attempt to scale on top of fractured
              data, immature governance, and undefined use cases.
            </p>

            {/* The Pilot Trap */}
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">&#9888;</span>
                <h3 className="font-bold text-red-400">
                  The &ldquo;Pilot Trap&rdquo;
                </h3>
              </div>
              <p className="mt-2 text-sm text-red-300/80">
                70% of enterprise AI pilots never reach production because the
                underlying infrastructure and organizational readiness were
                never validated.
              </p>
            </div>

            <p className="mt-6 text-slate-400">
              Our Assessment provides the &ldquo;Go / No-Go&rdquo; confidence
              you need before committing millions in CAPEX.
            </p>
          </div>

          {/* Four Quadrants */}
          <div className="grid grid-cols-2 gap-4">
            {quadrants.map((q) => (
              <div
                key={q.name}
                className={`rounded-2xl border ${q.borderColor} ${q.bgColor} p-5 text-center transition-all hover:scale-105`}
              >
                <div className={`text-3xl ${q.color}`}>{q.icon}</div>
                <h3 className={`mt-2 text-lg font-bold ${q.color}`}>
                  {q.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{q.question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive: Four Quadrants */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          The Four <span className="text-electric-400">Assessment Quadrants</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          A 360-degree evaluation across the four pillars that determine AI
          success or failure.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {quadrants.map((q) => (
            <div
              key={q.name}
              className={`rounded-2xl border ${q.borderColor} ${q.bgColor} p-6`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${q.color}`}>{q.icon}</span>
                <h3 className={`text-xl font-bold ${q.color}`}>{q.name}</h3>
              </div>
              <p className="mt-2 text-sm italic text-slate-400">
                {q.question}
              </p>
              <div className="mt-4 space-y-2">
                {q.details.map((d) => (
                  <div
                    key={d}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span className={`mt-0.5 ${q.color}`}>&#9656;</span>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tangible Deliverables */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Tangible <span className="text-electric-400">Deliverables</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          We don&apos;t deliver generic advice. We deliver evidence-based
          artifacts that you can take to the board.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {deliverables.map((d) => (
            <div
              key={d.name}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6"
            >
              <h3 className="text-lg font-bold text-electric-400">{d.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{d.description}</p>
              <ul className="mt-4 space-y-1">
                {d.subItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-accent-green"
                  >
                    <span>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How We Deliver + Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Delivery Model */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <div className="text-3xl">&#9201;</div>
            <h3 className="mt-4 text-2xl font-bold">How We Deliver</h3>
            <p className="mt-2 text-slate-400">
              A structured 15-day engagement model designed for speed and
              clarity. No open-ended consulting.
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  day: "Days 1-3",
                  label: "Discovery & Stakeholder Interviews",
                },
                { day: "Days 4-8", label: "Data, Tech & Governance Audit" },
                { day: "Days 9-12", label: "Analysis & Scoring" },
                {
                  day: "Days 13-15",
                  label: "Deliverable Compilation & Executive Briefing",
                },
              ].map((phase) => (
                <div key={phase.day} className="flex items-center gap-4">
                  <span className="min-w-[80px] rounded-lg bg-electric-500/10 px-3 py-1 text-center text-xs font-bold text-electric-400">
                    {phase.day}
                  </span>
                  <span className="text-sm text-slate-300">{phase.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Pricing */}
          <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
            <div className="text-3xl">&#128176;</div>
            <h3 className="mt-4 text-2xl font-bold">Transparent Pricing</h3>
            <p className="mt-2 text-slate-400">
              Fixed-price packages depending on organizational size and
              complexity. No surprises.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Starting from
                </p>
                <p className="text-3xl font-bold text-electric-400">$45,000</p>
                <p className="text-sm text-slate-400">
                  Small to mid-size organizations
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Enterprise
                </p>
                <p className="text-3xl font-bold text-electric-400">
                  Up to $85,000
                </p>
                <p className="text-sm text-slate-400">
                  Large or complex organizations
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="mt-6 block rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-electric-600"
            >
              View Full Pricing Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Frequently Asked{" "}
          <span className="text-electric-400">Questions</span>
        </h2>
        <div className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-slate-800 bg-navy-900/30 p-6"
            >
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Stop Guessing. Start Executing.
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Get the clarity you need to move forward with confidence.
        </p>
        <Link
          href="/pricing"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          Request Executive Briefing
        </Link>
      </section>
    </div>
  );
}
