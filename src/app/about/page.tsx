import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | TechFides",
  description:
    "25 years of Fortune 500 leadership. Three continents. One conviction: private AI infrastructure should be accessible to every business.",
};

const milestones = [
  {
    year: "2000\u20132015",
    title: "Fortune 500 Leadership",
    description:
      "25 years at Honeywell, Invensys, and Schneider Electric \u2014 managing multimillion-dollar technology operations, supporting all corporate functions, and delivering critical infrastructure across five continents.",
  },
  {
    year: "2016",
    title: "Forbes Technology Council",
    description:
      "Recognized for thought leadership in enterprise technology strategy and digital transformation.",
  },
  {
    year: "2017",
    title: "Goldman Sachs 10KSB",
    description:
      "Selected for the Goldman Sachs 10,000 Small Businesses program \u2014 bridging Fortune 500 discipline with SMB agility.",
  },
  {
    year: "2020",
    title: "TechFides Founded",
    description:
      "Launched with a singular mission: bring enterprise-grade technology governance to the underserved middle market.",
  },
  {
    year: "2024",
    title: "Private AI Pivot",
    description:
      "Recognized that SMBs were hemorrhaging to cloud AI costs and data leakage. Built the TechFides Local Stack \u2014 enterprise AI on local hardware.",
  },
  {
    year: "2025",
    title: "AEGIS Intelligence Operating System",
    description:
      "Launched the AEGIS Intelligence Operating System for the hybrid workforce era — governing, securing, and scaling human + AI + agent operations across six integrated layers.",
  },
];

const offices = [
  {
    country: "United States",
    city: "Frisco, Texas",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    role: "Global Headquarters",
    description: "Corporate strategy, product engineering, and North American client operations.",
  },
  {
    country: "Mexico",
    city: "Guadalajara, Jalisco",
    flag: "\uD83C\uDDF2\uD83C\uDDFD",
    role: "Latin America Operations",
    description: "Engineering delivery, Latin American market development, and bilingual support.",
  },
  {
    country: "Gabon",
    city: "Libreville, Estuaire",
    flag: "\uD83C\uDDEC\uD83C\uDDE6",
    role: "Africa Operations",
    description: "CEMAC regional expansion, francophone AI deployments, and emerging market strategy.",
  },
];

const values = [
  {
    icon: "\uD83D\uDEE1\uFE0F",
    title: "Data Ownership",
    description:
      "Your data belongs to you. We deploy AI on hardware you own, in buildings you control. Nothing leaves your premises.",
  },
  {
    icon: "\uD83D\uDCA1",
    title: "Model Agnosticism",
    description:
      "We don\u2019t lock you into one vendor. Deploy Llama, Mistral, Phi, or any open model. Switch freely as the landscape evolves.",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "Radical Transparency",
    description:
      "No hidden fees. No \u201Ccall for quote.\u201D Our pricing is published because enterprise clients deserve to plan without surprises.",
  },
  {
    icon: "\uD83C\uDF0D",
    title: "Global Perspective",
    description:
      "Built from 25 years of deploying technology across North America, Europe, Asia, Africa, and Latin America. We understand local nuance at global scale.",
  },
];

export default function AboutPage() {
  return (
    <div className="grid-pattern">
      {/* ============================================================
          SECTION 1: MISSION STATEMENT — "The TechFides Conviction"
          Sets the stage before the visitor gets to anything else.
          ============================================================ */}
      <section className="relative flex min-h-[75vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-600/30 bg-slate-600/10 px-4 py-1.5 text-sm text-slate-400">
            The TechFides Conviction
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Privacy Is Not a Luxury.{" "}
            <span className="text-electric-400">It Is a Requirement.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-300">
            For too long, the middle market has been forced to choose between
            expensive, data-leaking cloud APIs or being left behind entirely.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-400">
            TechFides was founded to break that cycle. By combining Fortune 500
            engineering discipline with the agility required by modern SMBs, we
            provide the infrastructure that allows businesses to{" "}
            <strong className="text-slate-200">own their intelligence</strong>,{" "}
            <strong className="text-slate-200">secure their data</strong>, and{" "}
            <strong className="text-slate-200">
              eliminate recurring cloud dependency
            </strong>
            .
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base text-electric-400 font-medium">
            We don&apos;t just deploy AI. We return digital autonomy to the enterprise.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: GLOBAL OPERATIONS — "Local Expertise. Global Reach."
          Explains how a founder-led company operates across 3 continents.
          ============================================================ */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Local Expertise.{" "}
          <span className="text-electric-400">Global Reach.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-slate-400 leading-relaxed">
          Headquartered in Frisco, Texas, TechFides operates as a distributed
          powerhouse with dedicated operations in Guadalajara, Mexico, and
          Libreville, Gabon. Our footprint allows us to support multi-national
          infrastructure projects and local AI deployments with equal precision.
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-center text-slate-400 leading-relaxed">
          By maintaining deep roots in North America, Latin America, and Africa,
          we bring a global perspective to solve local engineering challenges
          &mdash; ensuring that AEGIS and our Local Stack are
          resilient, compliant, and ready for scale in any regulatory environment.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {offices.map((office) => (
            <div
              key={office.country}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 text-center transition-all hover:border-electric-500/30"
            >
              <div className="text-4xl">{office.flag}</div>
              <h3 className="mt-3 text-lg font-bold">{office.country}</h3>
              <p className="mt-1 text-sm font-medium text-electric-400">
                {office.city}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {office.role}
              </p>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                {office.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 3: FOUNDER PROFILE — "A Legacy of Large-Scale Execution"
          Jacques Jean — the architect of the solution, not a consultant.
          ============================================================ */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-electric-500/20 bg-gradient-to-br from-electric-500/5 via-navy-900/50 to-transparent p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1 flex flex-col items-center md:items-start">
              <img
                src="/images/jacques-jean.png"
                alt="Jacques Jean \u2014 Founder & CEO of TechFides"
                className="h-56 w-56 rounded-2xl object-cover border-2 border-electric-500/30 shadow-lg shadow-electric-500/10"
              />
              <h2 className="mt-5 text-2xl font-bold">Jacques Jean</h2>
              <p className="text-sm font-medium text-electric-400">
                Founder &amp; Chief Executive Officer
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://www.linkedin.com/in/jacques-m-jean"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#004182]"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Connect on LinkedIn
                </a>
                <Link
                  href="/contact"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-electric-500/50 hover:text-electric-400"
                >
                  Contact
                </Link>
              </div>

              {/* Credentials badges */}
              <div className="mt-6 space-y-2">
                {[
                  { badge: "Forbes Technology Council", icon: "\uD83C\uDFC5" },
                  { badge: "Goldman Sachs 10KSB", icon: "\uD83C\uDFE6" },
                  { badge: "Carnegie Mellon University", icon: "\uD83C\uDF93" },
                ].map((c) => (
                  <div
                    key={c.badge}
                    className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-1.5 text-[11px] text-slate-400"
                  >
                    <span>{c.icon}</span>
                    {c.badge}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-electric-400">
                A Legacy of Large-Scale Execution
              </h3>
              <h4 className="mt-2 text-2xl font-bold text-slate-100">
                From the Corporate Boardroom to the Founder&apos;s Office
              </h4>
              <p className="mt-6 text-slate-300 leading-relaxed">
                Jacques Jean didn&apos;t build TechFides in a vacuum. His vision
                is forged from <strong>25 years of managing multimillion-dollar
                technology operations</strong> for global titans like Honeywell
                and Schneider Electric \u2014 spanning five continents, every
                corporate function, and some of the most complex regulated
                environments on earth.
              </p>
              <p className="mt-4 text-slate-400 leading-relaxed">
                After witnessing how enterprise-grade governance was consistently
                gated behind massive budgets, Jacques transitioned from the
                corporate boardroom to the founder&apos;s office. He saw a gap
                that no one was closing: the middle market was hemorrhaging money
                on cloud AI subscriptions, sending sensitive client data to third
                parties, and getting locked into vendors who controlled their
                pricing and their future.
              </p>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Today, he draws on his{" "}
                <strong className="text-slate-300">
                  Forbes Technology Council insights
                </strong>{" "}
                and deep infrastructure expertise to ensure TechFides 2.0
                provides SMBs with the same{" "}
                <em className="text-electric-400">
                  &ldquo;architectural armor&rdquo;
                </em>{" "}
                used by the Fortune 500 \u2014 at a fraction of the cost, deployed
                on hardware they own, with data that never leaves their building.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { stat: "25+", label: "Years Leading Global Tech" },
                  { stat: "5", label: "Continents Deployed" },
                  { stat: "3", label: "Global Offices" },
                  { stat: "26K+", label: "LinkedIn Followers" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-electric-500/20 bg-electric-500/5 p-3 text-center"
                  >
                    <p className="text-2xl font-extrabold text-electric-400">
                      {item.stat}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: VALUES — "What We Stand For"
          ============================================================ */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          What We <span className="text-electric-400">Stand For</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          These aren&apos;t marketing talking points. They&apos;re the
          engineering constraints we build every product around.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-electric-500/30"
            >
              <div className="text-3xl">{value.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 5: TIMELINE — "Our Journey"
          ============================================================ */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Our <span className="text-electric-400">Journey</span>
        </h2>
        <div className="mt-12 space-y-0">
          {milestones.map((m, i) => (
            <div key={m.year} className="relative flex gap-6 pb-10">
              {i < milestones.length - 1 && (
                <div className="absolute left-[19px] top-10 h-full w-px bg-gradient-to-b from-electric-500/40 to-slate-800" />
              )}
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-electric-500/30 bg-electric-500/10">
                <div className="h-3 w-3 rounded-full bg-electric-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-electric-400">{m.year}</p>
                <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 6: CTA
          ============================================================ */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to Work with{" "}
          <span className="text-electric-400">TechFides</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Whether you need private AI infrastructure, strategic consulting, or
          a referral partnership &mdash; we&apos;re ready to talk.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/assess"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            Take the AI Readiness Assessment
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
