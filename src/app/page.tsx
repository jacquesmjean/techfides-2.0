"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { CloudTaxCounter } from "@/components/homepage/CloudTaxCounter";
import { ProductivityInfographic } from "@/components/homepage/ProductivityInfographic";
import { ROITimeline } from "@/components/homepage/ROITimeline";
import { IndustryImpactCards } from "@/components/homepage/IndustryImpactCards";
import { TrustBar } from "@/components/homepage/TrustBar";

export default function Home() {
  const { t } = useI18n();

  const tiers = [
    {
      name: t("pricing.sovereignS"),
      target: t("pricing.sovereignSDesc"),
      setup: "$5,000",
      monthly: "$500",
    },
    {
      name: t("pricing.sovereignM"),
      target: t("pricing.sovereignMDesc"),
      setup: "$10,000",
      monthly: "$1,000",
      featured: true,
    },
    {
      name: t("pricing.sovereignL"),
      target: t("pricing.sovereignLDesc"),
      setup: "$15,000+",
      monthly: "$2,500+",
    },
  ];

  return (
    <div className="grid-pattern">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm text-electric-400">
            {t("hero.badgeFull")}
          </div>
          <h1 className="glow-text text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            {t("hero.title1")}
            <br />
            <span className="text-electric-400">{t("hero.title2")}</span>
            <br />
            {t("hero.title3")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl">
            {t("hero.subtitleRich")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/assess"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              {t("hero.ctaAssess")}
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              {t("hero.ctaPricing")}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Cloud Tax Counter — real-time money drain animation */}
      <CloudTaxCounter />

      {/* Problem / Solution */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
            <h2 className="text-2xl font-bold text-red-400">{t("problem.title")}</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-red-400">&#10005;</span>
                {t("problem.item1")}
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">&#10005;</span>
                {t("problem.item2")}
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">&#10005;</span>
                {t("problem.item3")}
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-accent-green/20 bg-accent-green/5 p-8">
            <h2 className="text-2xl font-bold text-accent-green">
              {t("solution.solutionTitle")}
            </h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-accent-green">&#10003;</span>
                {t("solution.item1")}
              </li>
              <li className="flex gap-3">
                <span className="text-accent-green">&#10003;</span>
                {t("solution.item2")}
              </li>
              <li className="flex gap-3">
                <span className="text-accent-green">&#10003;</span>
                {t("solution.item3")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Productivity Infographic — hours lost vs recovered */}
      <ProductivityInfographic />

      {/* Industry Impact Cards — animated stat rings */}
      <IndustryImpactCards />

      {/* ROI Timeline — break-even and savings curve */}
      <ROITimeline />

      {/* Pricing Preview */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          {t("pricing.title")} <span className="text-electric-400">{t("pricing.titleHighlight")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("pricing.subtitleAlt")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
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
                <p className="text-sm text-slate-400">{t("pricing.setup")}</p>
                <p className="text-2xl font-bold">{tier.setup}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-400">{t("pricing.monthly")}</p>
                <p className="text-2xl font-bold">{tier.monthly}</p>
              </div>
              <div className="mt-4 rounded-lg bg-accent-green/10 px-3 py-1.5 text-center text-sm font-semibold text-accent-green">
                {t("pricing.installation")}
              </div>
              <Link
                href={`/pricing?tier=${i}`}
                className="mt-6 block rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-electric-600"
              >
                {t("pricing.cta")}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t("cta.titleAlt")}
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          {t("cta.subtitleAlt")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            {t("cta.ctaAssess")}
          </Link>
          <Link
            href="/partners"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            {t("cta.ctaPartner")}
          </Link>
        </div>
      </section>
    </div>
  );
}
