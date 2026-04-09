import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TEDOS™ OS — Architecture & Deployment | TechFides",
  description:
    "A simplified, scalable, and secure execution infrastructure designed to transform how your enterprise manages AI governance. Built for enterprise scale.",
};

const corePillars = [
  {
    name: "Intelligent Processing",
    description:
      "Advanced algorithms process data streams in real-time, turning raw signals into actionable execution intelligence without manual intervention.",
    color: "from-electric-500/80 to-electric-600/80",
  },
  {
    name: "Secure Infrastructure",
    description:
      "Built with a security-first approach, ensuring end-to-end encryption and robust data protection for your most sensitive enterprise assets.",
    color: "from-purple-500/80 to-purple-600/80",
  },
  {
    name: "Scalable Deployment",
    description:
      "Architecture that grows with you. Seamlessly expand from a single department pilot to global enterprise-wide adoption with zero friction.",
    color: "from-indigo-500/80 to-indigo-600/80",
  },
  {
    name: "Reliable Performance",
    description:
      "Engineered for maximum uptime and resilience, ensuring your critical governance workflows are always operational and responsive.",
    color: "from-cyan-500/80 to-cyan-600/80",
  },
];

const pipeline = [
  { step: "Input", subtitle: "Data Ingestion", icon: "\u{1F4E5}" },
  { step: "Processing", subtitle: "Intelligent Analysis", icon: "\u2699" },
  { step: "Analysis", subtitle: "Pattern Recognition", icon: "\u{1F50D}" },
  { step: "Insights", subtitle: "Actionable Output", icon: "\u{1F4A1}" },
];

const capabilities = [
  {
    name: "Automated Processing",
    description: "Reduce manual overhead with intelligent automation that handles routine governance tasks.",
  },
  {
    name: "Real-time Insights",
    description: "Gain immediate visibility into your execution metrics without waiting for scheduled reports.",
  },
  {
    name: "Enterprise Security",
    description: "Bank-grade security protocols designed to protect your organization's most critical data.",
  },
  {
    name: "Global Deployment",
    description: "Infrastructure optimized for multi-region performance and low-latency access worldwide.",
  },
  {
    name: "Continuous Monitoring",
    description: "24/7 system oversight ensuring operational integrity and proactive issue resolution.",
  },
  {
    name: "Compliance Ready",
    description: "Built-in frameworks that align with major industry standards and regulatory requirements.",
  },
];

const stackLayers = [
  {
    name: "Processing Layer",
    description: "High-throughput data ingestion & normalization",
  },
  {
    name: "Security Layer",
    description: "Identity management & encryption protocols",
  },
  {
    name: "Analytics Layer",
    description: "Real-time reporting & predictive modeling",
  },
];

const complianceStandards = ["ISO 27001", "SOC 2 Type II", "GDPR Ready", "HIPAA Aligned"];

const platformTiers = [
  {
    name: "Tier 1: Executive Visibility",
    subtitle: "Foundational Insight & Monitoring",
    setup: "USD 75k - 150k",
    annual: "USD 30k+",
    description:
      "Best for organizations needing a centralized \"single pane of glass\" for AI initiatives without complex automation execution.",
    features: [
      "Executive Command Dashboard",
      "Basic Portfolio Tracking",
      "Standard ROI Reporting",
      "Up to 5 Read-Only Integrations",
    ],
  },
  {
    name: "Tier 2: Portfolio & PMO Control",
    subtitle: "Operational Management",
    setup: "USD 150k - 300k",
    annual: "USD 60k+",
    featured: true,
    description:
      "Designed for active PMOs managing multiple AI workstreams, resources, and vendor contracts.",
    features: [
      "Everything in Tier 1",
      "Resource & Capacity Planning",
      "Vendor & Contract Mgmt Module",
      "Risk & Compliance Logs",
    ],
  },
  {
    name: "Tier 3: Enterprise Execution Intelligence",
    subtitle: "Full Automation & Scale",
    setup: "USD 300k - 750k+",
    annual: "USD 120k+",
    description:
      "The complete operating system for global enterprises running complex, automated AI workflows.",
    features: [
      "Everything in Tier 2",
      "Active Execution Agents",
      "Advanced Custom Integrations (Write-Back)",
      "Dedicated Solution Architect",
    ],
  },
  {
    name: "Tier 4: Government & Regulated",
    subtitle: "Sovereign & Secure",
    setup: "From USD 400k+",
    annual: "Custom",
    description:
      "For defense, public sector, and critical infrastructure requiring air-gapped or private cloud environments.",
    features: [
      "Private Cloud / On-Premise",
      "Sovereign Data Controls",
      "FedRAMP/GovCloud Alignment",
      "Enhanced Security Support",
    ],
  },
];

export default function TEDOSPage() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/8 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-accent-amber/30 bg-accent-amber/10 px-4 py-1.5 text-sm font-semibold text-accent-amber">
            TEDOS&trade; OS PLATFORM
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            TEDOS&trade; OS
            <br />
            <span className="text-electric-400">
              Architecture &amp; Deployment
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            A simplified, scalable, and secure execution infrastructure designed
            to transform how your enterprise manages AI governance.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/pricing"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              Request Technical Documentation
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

      {/* Built for Enterprise Scale */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Built for <span className="text-electric-400">Enterprise Scale</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          A high-level look at the core pillars powering the TEDOS&trade;
          Operating System.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {corePillars.map((pillar) => (
            <div
              key={pillar.name}
              className={`rounded-2xl bg-gradient-to-b ${pillar.color} p-6 transition-all hover:scale-[1.02]`}
            >
              <h3 className="text-lg font-bold text-white">{pillar.name}</h3>
              <p className="mt-3 text-sm text-white/80">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works — Pipeline */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          How It <span className="text-electric-400">Works</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          A simplified view of the TEDOS&trade; OS processing pipeline.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {pipeline.map((step, i) => (
            <div key={step.step} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-electric-500/40 bg-navy-900/80 text-3xl">
                  {step.icon}
                </div>
                <h3 className="mt-3 font-bold">{step.step}</h3>
                <p className="text-xs text-slate-400">{step.subtitle}</p>
              </div>
              {i < pipeline.length - 1 && (
                <span className="text-2xl text-slate-600">&rarr;</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm italic text-electric-400">
          Detailed technical architecture available upon request.
        </p>
      </section>

      {/* Key Capabilities */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Key <span className="text-electric-400">Capabilities</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          Everything you need to govern AI execution at scale.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {capabilities.map((cap) => (
            <div
              key={cap.name}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-electric-500/30"
            >
              <h3 className="text-lg font-bold">{cap.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Technology <span className="text-electric-400">Stack</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          Built on enterprise-grade, industry-standard technologies ensuring
          robustness and longevity.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stackLayers.map((layer) => (
            <div
              key={layer.name}
              className="rounded-2xl border-2 border-dashed border-electric-500/30 bg-navy-900/30 p-6 text-center"
            >
              <h3 className="font-bold text-electric-400">{layer.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{layer.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Uncompromising Security */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Uncompromising Security</h2>
            <p className="mt-4 text-slate-400">
              We understand that your data is your most valuable asset.
              That&apos;s why security isn&apos;t an addon — it&apos;s the
              foundation of our architecture. From ingestion to analysis, every
              byte is protected by industry-leading standards.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                "End-to-End Encryption",
                "Data Protection",
                "Threat Monitoring",
                "Audit Trails",
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

      {/* Platform Pricing */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          TEDOS&trade; OS &mdash;{" "}
          <span className="text-electric-400">Platform Pricing</span>
        </h2>
        <p className="mx-auto mt-2 font-semibold text-electric-400 text-center">
          Clear Value. Governed Scale. Enterprise-Ready.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-400">
          TEDOS&trade; OS is licensed not as a simple SaaS tool, but as a
          governed execution intelligence platform. Pricing is structured to
          align with value delivered, based on four primary factors: Deployment
          Scope, Organizational Complexity, Governance Requirements, and
          Operational Responsibility.
        </p>

        {/* Pricing Factors */}
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { name: "Deployment Scope", desc: "Single dept vs. Global enterprise" },
            { name: "Complexity", desc: "System integrations & data volume" },
            { name: "Governance", desc: "Compliance & audit depth" },
            { name: "Responsibility", desc: "Self-managed vs. Fully managed" },
          ].map((f) => (
            <div
              key={f.name}
              className="rounded-xl border border-slate-800 bg-navy-900/30 p-4 text-center"
            >
              <h4 className="font-bold text-white">{f.name}</h4>
              <p className="mt-1 text-xs text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Tier Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {platformTiers.map((tier) => (
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
                  POPULAR
                </div>
              )}
              <h3 className="text-base font-bold">{tier.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{tier.subtitle}</p>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Initial Deployment / Setup
                </p>
                <p className="text-xl font-bold text-electric-400">
                  {tier.setup}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Annual Platform License: <strong>{tier.annual}</strong>
              </p>

              <p className="mt-4 text-xs text-slate-400">{tier.description}</p>

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
                href="/pricing"
                className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                  tier.featured
                    ? "bg-electric-500 text-white hover:bg-electric-600"
                    : "border border-slate-700 text-slate-300 hover:border-electric-500/50"
                }`}
              >
                Request Quote
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Need the Full Specs?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          Request our detailed technical documentation package, including
          security whitepapers, API references, and deployment guides.
        </p>
        <Link
          href="/pricing"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          Request Documentation Package
        </Link>
        <p className="mt-3 text-xs text-slate-400">
          Available to qualified enterprise teams.
        </p>
      </section>
    </div>
  );
}
