import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AEGIS — Intelligence Operating System | TechFides Consulting",
  description:
    "The Intelligence Operating System for the Hybrid Workforce Era. Govern, secure, and scale your human + AI + agent operations across six integrated layers.",
};

const sixLayers = [
  {
    name: "Governance",
    description:
      "Policy frameworks, decision rights, and accountability structures for AI adoption.",
    color: "from-electric-500/80 to-electric-600/80",
  },
  {
    name: "Security, Trust & Resilience",
    description:
      "Data protection, threat monitoring, and continuity planning for hybrid operations.",
    color: "from-purple-500/80 to-purple-600/80",
  },
  {
    name: "Intelligence",
    description:
      "Analytics, reporting, and predictive insights across human and AI workflows.",
    color: "from-indigo-500/80 to-indigo-600/80",
  },
  {
    name: "Execution",
    description:
      "Implementation methodology, change management, and deployment discipline.",
    color: "from-cyan-500/80 to-cyan-600/80",
  },
  {
    name: "Operations",
    description:
      "Workflow orchestration, process automation, and operational efficiency.",
    color: "from-accent-green/80 to-emerald-600/80",
  },
  {
    name: "Leadership",
    description:
      "Executive dashboards, adoption tracking, and strategic alignment.",
    color: "from-accent-amber/80 to-orange-600/80",
  },
];

const steps = [
  { step: "Diagnose", description: "We assess your AI readiness, operating model, and team capability across all six layers." },
  { step: "Design", description: "Custom AEGIS architecture mapped to your industry, compliance requirements, and growth goals." },
  { step: "Implement", description: "Phased deployment with defined milestones, training, and governance activation." },
  { step: "Operate", description: "Managed oversight, performance monitoring, and continuous optimization." },
  { step: "Evolve", description: "Quarterly reviews, capability expansion, and emerging technology integration." },
];

const enterpriseCapabilities = [
  "Operating model redesign for 500+ person organizations",
  "Board-level governance and risk reporting",
  "Multi-department AI orchestration",
  "Regulatory compliance (HIPAA, SOC 2, GDPR, FedRAMP)",
];

const smbCapabilities = [
  "Practical AI workflows that save 10+ hours per week",
  "Simple governance without the bureaucracy",
  "Scale operations without scaling headcount",
  "Affordable implementation with measurable ROI",
];

const complianceStandards = ["ISO 27001", "SOC 2 Type II", "GDPR Ready", "HIPAA Aligned"];

const pricingTiers = [
  {
    name: "Diagnostic",
    subtitle: "SMB & Growing Companies",
    price: "$15K\u2013$35K",
    priceNote: "one-time",
    features: [
      "AI readiness assessment across all 6 layers",
      "Gap analysis and priority roadmap",
      "Executive summary with ROI projections",
      "2-week delivery",
    ],
    cta: "Start with a Discovery Call",
  },
  {
    name: "Core Implementation",
    subtitle: "Mid-Market & Single-Site Enterprise",
    price: "$75K\u2013$150K",
    priceNote: "one-time + $5K/mo advisory",
    featured: true,
    features: [
      "Full AEGIS deployment across 1\u20132 departments",
      "Governance framework activation",
      "Team training and change management",
      "90-day implementation",
      "Monthly advisory retainer included",
    ],
    cta: "Request a Proposal",
  },
  {
    name: "Enterprise Execution",
    subtitle: "Multi-Site & Regulated Industries",
    price: "$150K\u2013$400K",
    priceNote: "one-time + $15K/mo managed",
    features: [
      "Organization-wide AEGIS deployment",
      "Board-level reporting and compliance integration",
      "Dedicated program manager",
      "Continuous optimization and quarterly reviews",
    ],
    cta: "Request a Proposal",
  },
  {
    name: "Government & Institutional",
    subtitle: "Federal, State & Multilateral",
    price: "Custom",
    priceNote: "",
    features: [
      "FedRAMP-aligned deployment",
      "Private data controls",
      "Multi-agency coordination",
      "Dedicated security team",
    ],
    cta: "Contact for Scoping",
  },
];

export default function AEGISPage() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/8 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-accent-amber/30 bg-accent-amber/10 px-4 py-1.5 text-sm font-semibold text-accent-amber">
            AEGIS
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            The Intelligence Operating System
            <br />
            <span className="text-electric-400">
              for the Hybrid Workforce Era
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Every organization is becoming a hybrid workforce. AEGIS gives you
            the operating system to govern, secure, and scale how humans, AI,
            and agents work together &mdash; without the chaos.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              Request a Discovery Call
            </Link>
            <Link
              href="/consulting"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Six Layers */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Six Integrated Layers.{" "}
          <span className="text-electric-400">One Operating System.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          AEGIS integrates governance, security, intelligence, execution,
          operations, and leadership into a single cohesive framework.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {sixLayers.map((layer) => (
            <div
              key={layer.name}
              className={`rounded-2xl bg-gradient-to-b ${layer.color} p-6 transition-all hover:scale-[1.02]`}
            >
              <h3 className="text-lg font-bold text-white">{layer.name}</h3>
              <p className="mt-3 text-sm text-white/80">{layer.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          From Diagnosis to{" "}
          <span className="text-electric-400">Operating System</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          Five phases that take you from fragmented AI adoption to a governed,
          scalable hybrid workforce.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-electric-500/40 bg-navy-900/80 text-lg font-bold text-electric-400">
                {i + 1}
              </div>
              <h3 className="mt-3 font-bold">{s.step}</h3>
              <p className="mt-2 text-xs text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Two Markets */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Built for{" "}
          <span className="text-electric-400">Two Markets</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          Whether you run a 5,000-person enterprise or a 20-person professional
          firm, AEGIS scales to your reality.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Enterprise */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <h3 className="text-xl font-bold">Enterprise &amp; Government</h3>
            <ul className="mt-6 space-y-3">
              {enterpriseCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 text-accent-green">&#10003;</span>
                  {cap}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-slate-400">
              Entry: <strong className="text-electric-400">$75K+ diagnostic &amp; implementation</strong>
            </p>
          </div>
          {/* SMB */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <h3 className="text-xl font-bold">SMB &amp; Professional Firms</h3>
            <ul className="mt-6 space-y-3">
              {smbCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 text-accent-green">&#10003;</span>
                  {cap}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-slate-400">
              Entry: <strong className="text-electric-400">$15K diagnostic &amp; implementation</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Security, Trust & Resilience */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Security, Trust &amp; Resilience &mdash; Built In, Not Bolted On
            </h2>
            <p className="mt-4 text-slate-400">
              Every AEGIS deployment includes a resilience framework &mdash;
              continuity planning, threat monitoring, and incident response
              protocols designed for hybrid human + AI operations.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                "End-to-End Encryption",
                "Data Protection",
                "Threat Monitoring",
                "Incident Response",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-accent-green">&#128274;</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Compliance Standards</h3>
              <span className="rounded-full bg-electric-500 px-3 py-1 text-xs font-bold text-white">
                Enterprise Ready
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Designed to support organizations operating under strict
              regulatory frameworks.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {complianceStandards.map((std) => (
                <span
                  key={std}
                  className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200"
                >
                  {std}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          AEGIS &mdash;{" "}
          <span className="text-electric-400">Engagement Pricing</span>
        </h2>
        <p className="mx-auto mt-2 font-semibold text-electric-400 text-center">
          Clear Value. Governed Scale. Enterprise-Ready.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-400">
          AEGIS engagements are scoped to your organization&apos;s size,
          complexity, and regulatory requirements. Every engagement starts with
          a discovery call to determine the right fit.
        </p>

        {/* Tier Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 ${
                tier.featured
                  ? "border-electric-500/50 bg-electric-500/5 shadow-lg shadow-electric-500/10"
                  : "border-slate-800 bg-navy-900/50"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-500 px-4 py-1 text-xs font-bold text-white">
                  FEATURED
                </div>
              )}
              <h3 className="text-base font-bold">{tier.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{tier.subtitle}</p>

              <div className="mt-4">
                <p className="text-xl font-bold text-electric-400">
                  {tier.price}
                </p>
                {tier.priceNote && (
                  <p className="mt-1 text-xs text-slate-400">{tier.priceNote}</p>
                )}
              </div>

              <ul className="mt-4 space-y-1.5">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-slate-300"
                  >
                    <span className="mt-0.5 text-accent-green">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                  tier.featured
                    ? "bg-electric-500 text-white hover:bg-electric-600"
                    : "border border-slate-700 text-slate-300 hover:border-electric-500/50"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to See What AEGIS Looks Like for Your Organization?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          Start with a 30-minute discovery call. No pitch deck, no pressure
          &mdash; just a candid conversation about where your organization
          stands and whether AEGIS is the right fit.
        </p>
        <Link
          href="/contact"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          Request a Discovery Call
        </Link>
        <p className="mt-3 text-xs text-slate-400">
          Or{" "}
          <Link href="/assess" className="text-electric-400 underline hover:text-electric-300">
            take the free AI Readiness Assessment first
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
