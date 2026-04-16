import Link from "next/link";

interface PainPoint {
  icon: string;
  title: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
}

interface SolutionPageProps {
  vertical: string;
  tagline: string;
  headline: string;
  subheadline: string;
  painPoints: PainPoint[];
  features: Feature[];
  complianceBadges: string[];
  ctaText: string;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
}

export function SolutionPage({
  vertical,
  tagline,
  headline,
  subheadline,
  painPoints,
  features,
  complianceBadges,
  ctaText,
  testimonialQuote,
  testimonialAuthor,
  testimonialRole,
}: SolutionPageProps) {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm text-electric-400">
            {tagline}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {subheadline}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {complianceBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-accent-green/30 bg-accent-green/10 px-3 py-1 text-xs font-semibold text-accent-green"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/pricing"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              {ctaText}
            </Link>
            <Link
              href="/stack"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              See the Tech Stack
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          The <span className="text-red-400">Problem</span> for {vertical}{" "}
          Businesses
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6"
            >
              <div className="text-3xl">{point.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-red-400">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features / Solution */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          The TechFides{" "}
          <span className="text-electric-400">{vertical} Stack</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Purpose-built AI infrastructure for your industry. Deployed on your
          hardware. Under your control.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-electric-500/30"
            >
              <h3 className="text-lg font-semibold text-electric-400">
                {feature.title}
              </h3>
              <p className="mt-2 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      {testimonialQuote && (
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-10">
            <p className="text-xl italic text-slate-300">
              &ldquo;{testimonialQuote}&rdquo;
            </p>
            {testimonialAuthor && (
              <div className="mt-6">
                <p className="font-semibold">{testimonialAuthor}</p>
                {testimonialRole && (
                  <p className="text-sm text-slate-400">{testimonialRole}</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          How It <span className="text-electric-400">Works</span>
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Discovery & SOW",
              desc: "We audit your current workflows, data volume, and compliance requirements to design your custom stack.",
            },
            {
              step: "02",
              title: "Deploy & Configure",
              desc: "Hardware installed on-site. Models fine-tuned to your industry. Data stays in your building from day one.",
            },
            {
              step: "03",
              title: "Operate & Evolve",
              desc: "Monthly retainer covers monitoring, model updates, and scaling as your needs grow. No surprise bills.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-electric-500/30 bg-electric-500/10 text-xl font-bold text-electric-400">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          Ready to Own Your{" "}
          <span className="text-electric-400">{vertical} AI</span>?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Stop renting cloud AI. Deploy local infrastructure purpose-built
          for {vertical.toLowerCase()} businesses.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            See Pricing &amp; ROI
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
