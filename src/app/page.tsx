import Link from "next/link";

const verticals = [
  {
    name: "Legal",
    href: "/solutions/legal",
    description: "Client privilege. Attorney-client confidentiality. Zero data leakage.",
    icon: "&#9878;", // scales of justice
  },
  {
    name: "Medical",
    href: "/solutions/medical",
    description: "HIPAA-compliant AI. Patient data never leaves your facility.",
    icon: "&#9764;", // caduceus-like
  },
  {
    name: "Auto",
    href: "/solutions/auto",
    description: "Diagnostics, inventory, and customer service AI — on your terms.",
    icon: "&#9881;", // gear
  },
  {
    name: "Trades",
    href: "/solutions/trades",
    description: "Estimating, scheduling, and ops intelligence for contractors.",
    icon: "&#9874;", // hammer
  },
];

const tiers = [
  {
    name: "Silver",
    target: "Solo / Boutique",
    setup: "$5,000",
    monthly: "$500",
  },
  {
    name: "Gold",
    target: "Single-Site Mid",
    setup: "$10,000",
    monthly: "$1,000",
    featured: true,
  },
  {
    name: "Platinum",
    target: "Multi-Site / Enterprise",
    setup: "$15,000+",
    monthly: "$2,500+",
  },
];

export default function Home() {
  return (
    <div className="grid-pattern">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm text-electric-400">
            Installation: $0 &mdash; Your hardware, your data, your AI
          </div>
          <h1 className="glow-text text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Enterprise AI.
            <br />
            <span className="text-electric-400">Local Infrastructure.</span>
            <br />
            Total Sovereignty.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl">
            Stop paying the <strong className="text-slate-200">Cloud Tax</strong>.
            Eliminate <strong className="text-slate-200">Data Leakage</strong>.
            Deploy Llama, Mistral, or Claude on{" "}
            <em>your</em> hardware with the TechFides Local Stack.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/pricing"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              See Pricing &amp; ROI
            </Link>
            <Link
              href="/stack"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              Explore the Stack
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
            <h2 className="text-2xl font-bold text-red-400">The Problem</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-red-400">&#10005;</span>
                Cloud AI subscriptions drain $2K-10K/month with zero ownership
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">&#10005;</span>
                Sensitive client data leaves your network on every API call
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">&#10005;</span>
                Vendor lock-in means you&apos;re at mercy of pricing changes
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-accent-green/20 bg-accent-green/5 p-8">
            <h2 className="text-2xl font-bold text-accent-green">
              The TechFides Solution
            </h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-accent-green">&#10003;</span>
                One-time setup. Predictable monthly retainer. You own the hardware.
              </li>
              <li className="flex gap-3">
                <span className="text-accent-green">&#10003;</span>
                Data never leaves your building — HIPAA, privilege, and compliance built-in.
              </li>
              <li className="flex gap-3">
                <span className="text-accent-green">&#10003;</span>
                Model-agnostic: swap Llama, Mistral, or Claude as your needs evolve.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solutions by Vertical */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Built for <span className="text-electric-400">Your Industry</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Sovereign AI deployments tailored to the compliance and workflow
          demands of your vertical.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {verticals.map((v) => (
            <Link
              key={v.name}
              href={v.href}
              className="group rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-electric-500/40 hover:bg-navy-800/50"
            >
              <div
                className="text-3xl"
                dangerouslySetInnerHTML={{ __html: v.icon }}
              />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-electric-400">
                {v.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{v.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Transparent <span className="text-electric-400">Pricing</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          No &ldquo;Call for Quote.&rdquo; Enterprise-grade transparency for
          SMB owners.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 ${
                tier.featured
                  ? "border-electric-500/50 bg-electric-500/5 shadow-lg shadow-electric-500/10"
                  : "border-slate-800 bg-navy-900/50"
              }`}
            >
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{tier.target}</p>
              <div className="mt-6">
                <p className="text-sm text-slate-400">Setup (SOW)</p>
                <p className="text-2xl font-bold">{tier.setup}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-400">Monthly Retainer</p>
                <p className="text-2xl font-bold">{tier.monthly}</p>
              </div>
              <div className="mt-4 rounded-lg bg-accent-green/10 px-3 py-1.5 text-center text-sm font-semibold text-accent-green">
                Installation: $0
              </div>
              <Link
                href="/pricing"
                className="mt-6 block rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-electric-600"
              >
                Calculate Your ROI
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to Own Your AI?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Join the businesses that stopped renting AI and started owning it.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            Get Started
          </Link>
          <Link
            href="/partners"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Become a Referral Partner
          </Link>
        </div>
      </section>
    </div>
  );
}
