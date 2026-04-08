import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strategic Consulting | TechFides",
  description:
    "TechFides strategic consulting services. AI Readiness 360™ assessment, AI Transformation Management, and TEDOS™ OS platform — Fortune 500 expertise at SMB-accessible pricing.",
};

export default function ConsultingPage() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-600/30 bg-slate-600/10 px-4 py-1.5 text-sm text-slate-400">
            Strategic Consulting
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Enterprise-Grade{" "}
            <span className="text-electric-400">Strategy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Before deploying sovereign AI, some organizations need strategic
            groundwork. TechFides&apos; consulting frameworks — built from
            decades of Fortune 500 leadership — prepare your business for
            transformation.
          </p>
        </div>
      </section>

      {/* Three Frameworks */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {/* AI Readiness 360 */}
          <Link
            href="/consulting/ai-readiness-360"
            className="group rounded-2xl border border-slate-800 bg-navy-900/50 p-8 transition-all hover:border-electric-500/40 hover:bg-navy-800/50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-500/10 text-2xl">
              &#9678;
            </div>
            <h2 className="mt-5 text-xl font-bold group-hover:text-electric-400">
              AI Readiness 360&trade;
            </h2>
            <p className="mt-1 text-xs font-semibold text-electric-400">
              Assessment &amp; Risk Framework
            </p>
            <p className="mt-3 text-sm text-slate-400">
              A forensic diagnostic of your organization&apos;s ability to
              execute, govern, and extract value from AI. Validate your strategy
              before you scale.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Strategy",
                "Governance",
                "Data",
                "Tech",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-electric-500/20 bg-electric-500/5 px-3 py-1 text-xs text-electric-400"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-5 text-sm font-semibold text-slate-300 group-hover:text-electric-400">
              Learn More &rarr;
            </div>
          </Link>

          {/* AI Transformation Management */}
          <Link
            href="/consulting/transformation-management"
            className="group rounded-2xl border border-slate-800 bg-navy-900/50 p-8 transition-all hover:border-accent-green/40 hover:bg-navy-800/50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-green/10 text-2xl">
              &#9889;
            </div>
            <h2 className="mt-5 text-xl font-bold group-hover:text-accent-green">
              AI Transformation
            </h2>
            <p className="mt-1 text-xs font-semibold text-accent-green">
              Managed Execution &amp; Governance
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Governed execution support that turns strategic ambition into
              operational capability. We replace &lsquo;innovation
              theater&rsquo; with rigorous program discipline.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Business Model",
                "Operations",
                "Governance",
                "Scale",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-accent-green/20 bg-accent-green/5 px-3 py-1 text-xs text-accent-green"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-5 text-sm font-semibold text-slate-300 group-hover:text-accent-green">
              Learn More &rarr;
            </div>
          </Link>

          {/* TEDOS */}
          <Link
            href="/consulting/tedos"
            className="group rounded-2xl border border-slate-800 bg-navy-900/50 p-8 transition-all hover:border-accent-amber/40 hover:bg-navy-800/50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-amber/10 text-2xl">
              &#9881;
            </div>
            <h2 className="mt-5 text-xl font-bold group-hover:text-accent-amber">
              TEDOS&trade; OS
            </h2>
            <p className="mt-1 text-xs font-semibold text-accent-amber">
              Architecture &amp; Deployment Platform
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Enterprise-grade architecture and deployment platform with
              intelligent processing, secure infrastructure, and scalable
              performance for regulated industries.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Architecture",
                "Security",
                "Analytics",
                "Compliance",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-accent-amber/20 bg-accent-amber/5 px-3 py-1 text-xs text-accent-amber"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-5 text-sm font-semibold text-slate-300 group-hover:text-accent-amber">
              Learn More &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* The Pedigree */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            The <span className="text-electric-400">Pedigree</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-slate-400">
            25 years of corporate leadership experience from Honeywell, Invensys,
            and Schneider Electric — supporting all corporate functions and
            delivering multimillion-dollar projects across North America, Europe,
            Asia, Africa, and Latin America.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "\u{1F3E2}",
                label: "Fortune 500 Leadership",
                detail:
                  "25 years across Honeywell, Invensys, and Schneider Electric — enterprise operations at global scale.",
              },
              {
                icon: "\u{1F30D}",
                label: "Global Delivery",
                detail:
                  "Multimillion-dollar projects implemented across 5 continents — North America, Europe, Asia, Africa, and Latin America.",
              },
              {
                icon: "\u{1F4F0}",
                label: "Forbes Technology Council",
                detail:
                  "Recognized thought leadership in enterprise technology strategy and AI adoption.",
              },
              {
                icon: "\u{1F3C6}",
                label: "Goldman Sachs 10KSB",
                detail:
                  "Alumni of the Goldman Sachs 10,000 Small Businesses program — bridging enterprise and SMB.",
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="mx-auto mb-3 text-2xl">{item.icon}</div>
                <h3 className="font-semibold text-electric-400">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          Need Strategy Before{" "}
          <span className="text-electric-400">Deployment</span>?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Most businesses are ready for sovereign AI today. But if you need
          strategic groundwork first, our consulting frameworks get you there
          faster.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            See AI Deployment Pricing
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            About Jacques Jean
          </Link>
        </div>
      </section>
    </div>
  );
}
