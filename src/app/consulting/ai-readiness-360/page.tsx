import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 360 Readiness Assessment | TechFides",
  description:
    "A 60-question distributed intelligence system that captures real organizational signals across 6 domains, identifies risks and opportunities, and delivers a clear, prioritized roadmap for AI execution.",
};

const domains = [
  {
    icon: "\uD83C\uDFAF",
    name: "Strategy & Leadership",
    question: "Is your AI vision aligned to business value?",
    color: "text-electric-400",
    borderColor: "border-electric-500/30",
    bgColor: "bg-electric-500/5",
    details: [
      "AI vision clarity and executive alignment",
      "Use case identification and prioritization",
      "Investment clarity and ROI projections",
      "Short-term wins vs. long-term transformation balance",
      "Competitive AI landscape positioning",
    ],
  },
  {
    icon: "\uD83D\uDDC4\uFE0F",
    name: "Data & Infrastructure",
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
    icon: "\uD83D\uDDA5\uFE0F",
    name: "Technology & Architecture",
    question: "Can your infrastructure support AI at scale?",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/5",
    details: [
      "Current compute capacity (CPU, GPU, memory)",
      "Cloud vs. on-premise infrastructure assessment",
      "Software stack compatibility and technical debt",
      "Security posture and vulnerability analysis",
      "Scalability and deployment architecture readiness",
    ],
  },
  {
    icon: "\u2699\uFE0F",
    name: "Operations & Processes",
    question: "Are your workflows ready for AI integration?",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bgColor: "bg-sky-500/5",
    details: [
      "Workflow automation potential and maturity",
      "Process documentation and standardization",
      "Operational bottleneck identification",
      "Cross-functional integration readiness",
      "Change management capacity",
    ],
  },
  {
    icon: "\uD83D\uDEE1\uFE0F",
    name: "Governance & Risk",
    question: "Are safety and compliance controls in place?",
    color: "text-accent-green",
    borderColor: "border-accent-green/30",
    bgColor: "bg-accent-green/5",
    details: [
      "AI policies and ethical guidelines",
      "Regulatory compliance framework (HIPAA, SOC 2, GDPR)",
      "Audit trail and explainability requirements",
      "Vendor and third-party risk assessment",
      "Decision lineage and accountability structures",
    ],
  },
  {
    icon: "\uD83D\uDC65",
    name: "People & Culture",
    question: "Is your team ready to adopt and scale AI?",
    color: "text-pink-400",
    borderColor: "border-pink-500/30",
    bgColor: "bg-pink-500/5",
    details: [
      "AI skills inventory and training gaps",
      "Leadership buy-in and change readiness",
      "Cultural resistance and adoption barriers",
      "Cross-functional collaboration maturity",
      "Talent acquisition and retention strategy for AI roles",
    ],
  },
];

const deliverables = [
  {
    name: "AI Readiness Score",
    icon: "\uD83D\uDCCA",
    description: "Quantitative scoring across all 6 domains with maturity level classification: Nascent, Emerging, Developing, Advancing, or Leading.",
  },
  {
    name: "Enterprise Heat Map",
    icon: "\uD83D\uDD25",
    description: "Visual truth across the organization. Green (ready), yellow (emerging), red (critical gaps). Instantly see where to invest and where to stop.",
  },
  {
    name: "Risk Exposure Profile",
    icon: "\u26A0\uFE0F",
    description: "Prioritized registry of compliance gaps, governance deficiencies, data integrity risks, and overstated readiness areas.",
  },
  {
    name: "Opportunity Pipeline",
    icon: "\uD83D\uDE80",
    description: "High-value automation areas, AI quick wins, efficiency gains, and strategic use cases mapped by impact, effort, and risk.",
  },
  {
    name: "Priority Roadmap",
    icon: "\uD83D\uDDFA\uFE0F",
    description: "Sequenced execution plan: fix critical risks first, unlock quick wins second, build foundations third, scale strategically fourth.",
  },
  {
    name: "Executive Briefing Package",
    icon: "\uD83D\uDCCB",
    description: "60-second snapshot, narrative summary, and downloadable PDF — everything leadership needs to make a confident Go/No-Go decision.",
  },
];

export default function AIReadiness360Page() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm font-semibold text-electric-400">
            ENTERPRISE AI INTELLIGENCE SYSTEM
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            AI 360 Readiness
            <br />
            <span className="text-electric-400">Assessment</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
            A 60-question distributed intelligence system that captures real
            organizational signals across{" "}
            <strong className="text-slate-100">6 domains</strong>, identifies
            risks and opportunities, and delivers a clear, prioritized roadmap
            for AI execution.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            This is not a survey. It is a network-level diagnostic engine
            deployed across your leadership, IT, operations, and compliance teams
            simultaneously.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              Request Your Assessment
            </Link>
            <Link
              href="/assess"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              Try the Free Quick Score
            </Link>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Why Organizations <span className="text-electric-400">Fail</span> at AI
            </h2>
            <p className="mt-4 text-slate-400">
              Most AI failures don&apos;t happen because of bad models. They
              happen because organizations attempt to scale on top of fractured
              data, immature governance, and undefined use cases.
            </p>

            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">&#9888;</span>
                <h3 className="font-bold text-red-400">The Pilot Trap</h3>
              </div>
              <p className="mt-2 text-sm text-red-300/80">
                70% of enterprise AI pilots never reach production because the
                underlying infrastructure and organizational readiness were
                never validated.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-accent-green text-lg">&#10003;</span>
                <h3 className="font-bold text-accent-green">Our Approach</h3>
              </div>
              <p className="mt-2 text-sm text-green-300/80">
                We deploy the assessment across multiple stakeholders,
                departments, and regions simultaneously &mdash; capturing a
                distributed intelligence signal, not a single biased perspective.
              </p>
            </div>
          </div>

          {/* How It Works — 4 Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200">The Client Experience</h3>
            {[
              { step: "01", icon: "\uD83D\uDCDD", title: "Assessment", desc: "60 structured questions across 6 domains. Designed for executives, not just engineers. No raw data ingestion." },
              { step: "02", icon: "\uD83D\uDD0D", title: "Systems Evidence", desc: "Validates responses with supporting inputs. Bridges the gap between perceived readiness and operational reality." },
              { step: "03", icon: "\uD83D\uDCC2", title: "Document Upload", desc: "Optional artifacts \u2014 policies, architecture diagrams, workflows \u2014 strengthen the credibility of the assessment." },
              { step: "04", icon: "\uD83D\uDCCA", title: "Review & Results", desc: "Scored readiness across all dimensions. Executive overview, opportunity map, risk profile, and priority roadmap." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-xl border border-slate-800 bg-navy-900/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-500/10 text-lg">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-electric-400">{s.step}</span>
                    <h4 className="text-sm font-bold text-slate-200">{s.title}</h4>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Assessment Domains */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          6 Assessment <span className="text-electric-400">Domains</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          A 360-degree evaluation across every critical layer that determines AI
          success or failure. 10 questions per domain, 60 total.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <div
              key={d.name}
              className={`rounded-2xl border ${d.borderColor} ${d.bgColor} p-6`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.icon}</span>
                <h3 className={`text-lg font-bold ${d.color}`}>{d.name}</h3>
              </div>
              <p className="mt-2 text-sm italic text-slate-400">{d.question}</p>
              <div className="mt-4 space-y-2">
                {d.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className={`mt-0.5 ${d.color}`}>&#9656;</span>
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Network Deployment — Key Differentiator */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-electric-500/20 bg-gradient-to-br from-electric-500/5 via-navy-900/50 to-transparent p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            Network-Level <span className="text-electric-400">Deployment</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            This is where we separate from 95% of the market. Instead of one
            person answering, we deploy the assessment across your entire
            organization simultaneously.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: "\uD83D\uDC65", title: "Multi-Stakeholder", desc: "CIO, CTO, COO, business unit leaders, IT teams, and operations all contribute their perspective." },
              { icon: "\uD83C\uDFE2", title: "Multi-Department", desc: "Cross-functional coverage reveals alignment gaps between strategy, technology, and operations." },
              { icon: "\uD83C\uDF0D", title: "Multi-Region", desc: "For global organizations, capture regional differences in readiness, compliance, and infrastructure." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5 text-center">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-slate-200">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-electric-400 font-medium">
            The result: a distributed intelligence capture that reveals executive
            vs. operational misalignment, departmental blind spots, and the real
            organizational truth about AI readiness.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          What You <span className="text-electric-400">Walk Away With</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Decision-grade intelligence. Not generic advice.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((d) => (
            <div key={d.name} className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
              <span className="text-2xl">{d.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-electric-400">{d.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{d.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery + Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <span className="text-3xl">\u23F1\uFE0F</span>
            <h3 className="mt-4 text-2xl font-bold">How We Deliver</h3>
            <p className="mt-2 text-slate-400">
              A structured engagement with a secure digital portal. Your team
              accesses the assessment via a private link &mdash; no software to
              install.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { phase: "Phase 1", label: "Portal setup & stakeholder onboarding", days: "Days 1-3" },
                { phase: "Phase 2", label: "Distributed assessment completion", days: "Days 4-10" },
                { phase: "Phase 3", label: "Systems evidence & document upload", days: "Days 8-12" },
                { phase: "Phase 4", label: "AI-powered analysis & scoring", days: "Days 10-14" },
                { phase: "Phase 5", label: "Executive briefing & roadmap delivery", days: "Day 15" },
              ].map((p) => (
                <div key={p.phase} className="flex items-center gap-4">
                  <span className="min-w-[80px] rounded-lg bg-electric-500/10 px-3 py-1 text-center text-xs font-bold text-electric-400">
                    {p.days}
                  </span>
                  <span className="text-sm text-slate-300">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
            <span className="text-3xl">\uD83D\uDCB0</span>
            <h3 className="mt-4 text-2xl font-bold">Transparent Pricing</h3>
            <p className="mt-2 text-slate-400">
              Fixed-price packages. No surprises. No open-ended consulting.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">SMB / Mid-Market</p>
                <p className="text-3xl font-bold text-electric-400">$45,000</p>
                <p className="text-sm text-slate-400">Up to 20 stakeholders, single region</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Enterprise</p>
                <p className="text-3xl font-bold text-electric-400">Up to $85,000</p>
                <p className="text-sm text-slate-400">Unlimited stakeholders, multi-region, multi-BU</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="mt-6 block rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-electric-600"
            >
              View Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Strategic Positioning */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            This Is Not an Assessment.
          </h2>
          <h3 className="mt-2 text-xl font-bold text-electric-400 md:text-2xl">
            It Is a System of Record for AI Transformation.
          </h3>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-400">What it is NOT</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                <li>&#10005; A questionnaire</li>
                <li>&#10005; A consulting intake form</li>
                <li>&#10005; A maturity checklist</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent-green">What it IS</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>&#10003; A distributed AI intelligence system</li>
                <li>&#10003; A network-level diagnostic engine</li>
                <li>&#10003; A decision support platform</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-electric-400">What it enables</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>&#10003; Repeatable transformation</li>
                <li>&#10003; Standardized AI adoption</li>
                <li>&#10003; Measurable progress over time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Frequently Asked <span className="text-electric-400">Questions</span>
        </h2>
        <div className="mt-12 space-y-6">
          {[
            { q: "How is this different from a typical AI maturity assessment?", a: "Most assessments capture one person's opinion. Ours deploys across your entire organization \u2014 leadership, IT, operations, compliance \u2014 simultaneously. The result is a distributed intelligence signal that reveals alignment gaps, departmental blind spots, and the actual truth about your readiness." },
            { q: "Do we need to share sensitive data or system access?", a: "No. The assessment uses structured questions and optional document uploads \u2014 no raw data ingestion, no system access required. This means low friction, high adoption, and zero security risk." },
            { q: "How much time does it require from our team?", a: "Each stakeholder spends approximately 45-60 minutes completing their section of the assessment. The portal is self-service \u2014 they access it via a private link on their own schedule." },
            { q: "Do we need TEDOS\u2122 OS to use this?", a: "No. This is a standalone engagement. The findings are yours to use with any toolset. However, the data captured is fully compatible with TEDOS\u2122 OS for organizations that want to move into governed AI execution." },
            { q: "What happens after the assessment?", a: "You receive the full executive package: AI Readiness Score, Enterprise Heat Map, Risk Profile, Opportunity Pipeline, and Prioritized Roadmap. We present findings in an executive briefing and provide a clear Go/No-Go recommendation." },
          ].map((faq) => (
            <div key={faq.q} className="rounded-xl border border-slate-800 bg-navy-900/30 p-6">
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
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Organizations don&apos;t fail at AI because of technology. They fail
          due to misalignment, poor data foundations, and lack of structured
          execution readiness. This system prevents that.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="glow-blue rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            Request Your Assessment
          </Link>
          <Link
            href="/assess"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Take the Free Quick Score
          </Link>
        </div>
      </section>
    </div>
  );
}
