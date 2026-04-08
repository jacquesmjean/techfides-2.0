import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | TechFides",
  description:
    "25 years of Fortune 500 leadership from Honeywell, Invensys, and Schneider Electric — now delivering enterprise AI sovereignty to SMBs worldwide.",
};

const milestones = [
  {
    year: "2000–2015",
    title: "Fortune 500 Leadership",
    description:
      "25 years at Honeywell, Invensys, and Schneider Electric — leading global technology operations, supporting all corporate functions, and delivering multimillion-dollar projects across five continents.",
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
      "Selected for the Goldman Sachs 10,000 Small Businesses program — bridging Fortune 500 discipline with SMB agility.",
  },
  {
    year: "2020",
    title: "TechFides Founded",
    description:
      "Launched with a singular mission: bring enterprise-grade technology governance to the underserved middle market.",
  },
  {
    year: "2024",
    title: "Sovereign AI Pivot",
    description:
      "Recognized that SMBs were hemorrhaging to cloud AI costs and data leakage. Built the TechFides Local Stack — enterprise AI on local hardware.",
  },
  {
    year: "2025",
    title: "TEDOS\u2122 OS Platform",
    description:
      "Launched the TEDOS\u2122 OS Architecture & Deployment platform for enterprise execution intelligence across regulated industries.",
  },
];

const offices = [
  {
    country: "United States",
    city: "Frisco, Texas",
    flag: "\u{1F1FA}\u{1F1F8}",
    role: "Global Headquarters",
  },
  {
    country: "Mexico",
    city: "Guadalajara, Jalisco",
    flag: "\u{1F1F2}\u{1F1FD}",
    role: "Latin America Operations",
  },
  {
    country: "Gabon",
    city: "Libreville, Estuaire",
    flag: "\u{1F1EC}\u{1F1E6}",
    role: "Africa Operations",
  },
];

const values = [
  {
    icon: "\u{1F6E1}",
    title: "Data Sovereignty",
    description:
      "Your data belongs to you. We deploy AI on hardware you own, in buildings you control. Nothing leaves your premises.",
  },
  {
    icon: "\u{1F4A1}",
    title: "Model Agnosticism",
    description:
      "We don\u2019t lock you into one vendor. Deploy Llama, Mistral, Claude, or any model. Switch freely as the landscape evolves.",
  },
  {
    icon: "\u{1F4B0}",
    title: "Radical Transparency",
    description:
      "No hidden fees. No \u201Ccall for quote.\u201D Our pricing is published because enterprise clients deserve to plan without surprises.",
  },
  {
    icon: "\u{1F30D}",
    title: "Global Perspective",
    description:
      "Built from 25 years of deploying technology across North America, Europe, Asia, Africa, and Latin America. We understand local nuance at global scale.",
  },
];

export default function AboutPage() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-600/30 bg-slate-600/10 px-4 py-1.5 text-sm text-slate-400">
            About TechFides
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Fortune 500 Discipline.{" "}
            <span className="text-electric-400">SMB Agility.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            TechFides was built on a simple conviction: the technology governance
            that protects Fortune 500 enterprises should be accessible to every
            business — regardless of size, geography, or budget.
          </p>
        </div>
      </section>

      {/* The Founder */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-gradient-to-br from-electric-500/20 to-electric-500/5 text-6xl">
                JJ
              </div>
              <h2 className="mt-4 text-2xl font-bold">Jacques Jean</h2>
              <p className="text-sm text-electric-400">
                Founder &amp; CEO
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href="https://www.linkedin.com/in/jacquesjean/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-electric-500/50 hover:text-electric-400"
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:engage@techfides.com"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-electric-500/50 hover:text-electric-400"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold">
                25 Years of Global Technology Leadership
              </h3>
              <p className="mt-4 text-slate-400">
                Jacques Jean brings 25 years of corporate leadership experience
                from Honeywell, Invensys, and Schneider Electric — supporting
                all corporate functions and delivering multimillion-dollar
                projects across North America, Europe, Asia, Africa, and Latin
                America.
              </p>
              <p className="mt-4 text-slate-400">
                As a Forbes Technology Council member and Goldman Sachs 10,000
                Small Businesses alumnus, Jacques recognized that SMBs were
                being left behind in the AI revolution — forced to choose
                between expensive cloud APIs that leak their data, or no AI at
                all.
              </p>
              <p className="mt-4 text-slate-400">
                TechFides exists to close that gap. By deploying enterprise-grade
                AI on local infrastructure, we give every business the power to
                own their intelligence — not rent it.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { stat: "25+", label: "Years Experience" },
                  { stat: "5", label: "Continents" },
                  { stat: "3", label: "Global Offices" },
                  { stat: "F500", label: "Pedigree" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-3 text-center"
                  >
                    <p className="text-2xl font-bold text-electric-400">
                      {item.stat}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Our <span className="text-electric-400">Journey</span>
        </h2>
        <div className="mt-12 space-y-0">
          {milestones.map((m, i) => (
            <div key={m.year} className="relative flex gap-6 pb-10">
              {/* Timeline line */}
              {i < milestones.length - 1 && (
                <div className="absolute left-[19px] top-10 h-full w-px bg-gradient-to-b from-electric-500/40 to-slate-800" />
              )}
              {/* Dot */}
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-electric-500/30 bg-electric-500/10">
                <div className="h-3 w-3 rounded-full bg-electric-500" />
              </div>
              {/* Content */}
              <div>
                <p className="text-sm font-bold text-electric-400">{m.year}</p>
                <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Offices */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Global <span className="text-electric-400">Presence</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Three offices across three continents. Local expertise, global reach.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {offices.map((office) => (
            <div
              key={office.country}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 text-center transition-all hover:border-electric-500/30"
            >
              <div className="text-4xl">{office.flag}</div>
              <h3 className="mt-3 text-lg font-bold">{office.country}</h3>
              <p className="mt-1 text-electric-400">{office.city}</p>
              <p className="mt-2 text-xs text-slate-500">{office.role}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="mailto:engage@techfides.com"
            className="inline-flex items-center gap-2 text-sm text-electric-400 hover:text-electric-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            engage@techfides.com
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to Work with{" "}
          <span className="text-electric-400">TechFides</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Whether you need sovereign AI infrastructure, strategic consulting, or
          a referral partnership — we&apos;re ready to talk.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            See Pricing &amp; ROI
          </Link>
          <Link
            href="/partners#apply"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Become a Partner
          </Link>
          <a
            href="mailto:engage@techfides.com"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
