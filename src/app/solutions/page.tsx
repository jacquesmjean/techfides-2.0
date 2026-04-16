"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export default function SolutionsPage() {
  const { t } = useI18n();

  const verticals = [
  {
    name: "Legal",
    href: "/solutions/legal",
    icon: "\u2696",
    headline: "Privilege-Protected AI",
    description:
      "Attorney-client privilege demands that sensitive case data never touches a third-party cloud. TechFides deploys AI on your firm's hardware so privileged information stays under your roof — while giving your team the power of modern language models for research, drafting, and document review.",
    badges: ["Attorney-Client Privilege", "SOC 2 Ready", "ABA Compliance"],
  },
  {
    name: "Medical",
    href: "/solutions/medical",
    icon: "\u2695",
    headline: "HIPAA-Compliant AI",
    description:
      "Patient data is sacred. Every cloud API call is a potential HIPAA violation waiting to happen. TechFides keeps PHI on-premise while enabling AI-powered clinical documentation, coding assistance, and patient communication — without the compliance risk.",
    badges: ["HIPAA Aligned", "PHI Protection", "BAA Available"],
  },
  {
    name: "Auto",
    href: "/solutions/auto",
    icon: "\u2699",
    headline: "Dealership & Shop Intelligence",
    description:
      "From diagnostics to customer follow-ups, the auto industry runs on data that shouldn't live in someone else's cloud. TechFides delivers AI-powered inventory management, service scheduling, and customer engagement — all running locally.",
    badges: ["FTC Safeguards", "DMS Integration", "Local-First"],
  },
  {
    name: "Trades",
    href: "/solutions/trades",
    icon: "\u2692",
    headline: "Contractor Operations AI",
    description:
      "Estimating, scheduling, crew coordination, and client communication — trades businesses generate mountains of operational data. TechFides puts AI to work on your terms, with models trained on your workflows and data that never leaves your office.",
    badges: ["Offline Capable", "Multi-Site Ready", "Field-Tested"],
  },
];

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("solutions.pageTitle")}{" "}
            <span className="text-electric-400">{t("solutions.pageTitleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("solutions.pageSubtitle")}
          </p>
        </div>
      </section>

      {/* Vertical Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8">
          {verticals.map((v, i) => (
            <Link
              key={v.name}
              href={v.href}
              className="group grid items-center gap-8 rounded-2xl border border-slate-800 bg-navy-900/50 p-8 transition-all hover:border-electric-500/40 hover:bg-navy-800/50 md:grid-cols-3"
            >
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{v.icon}</span>
                  <h2 className="text-2xl font-bold group-hover:text-electric-400">
                    {v.name}
                  </h2>
                </div>
                <p className="mt-1 text-sm font-semibold text-electric-400">
                  {v.headline}
                </p>
                <p className="mt-4 text-slate-400">{v.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-accent-green/30 bg-accent-green/10 px-3 py-1 text-xs font-semibold text-accent-green"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <span className="rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-all group-hover:border-electric-500 group-hover:bg-electric-500 group-hover:text-white">
                  {t("solutions.explore")} {v.name} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          {t("solutions.dontSeeTitle")}
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          {t("solutions.dontSeeSubtitle")}
        </p>
        <Link
          href="/contact"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          {t("solutions.talkToUs")}
        </Link>
      </section>
    </div>
  );
}
