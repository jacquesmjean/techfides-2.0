"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

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
  const { t } = useI18n();

  const steps = [
    {
      step: "01",
      title: t("solutionShared.step1Title"),
      desc: t("solutionShared.step1Desc"),
    },
    {
      step: "02",
      title: t("solutionShared.step2Title"),
      desc: t("solutionShared.step2Desc"),
    },
    {
      step: "03",
      title: t("solutionShared.step3Title"),
      desc: t("solutionShared.step3Desc"),
    },
  ];

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
              {t("solutionShared.seeStack")}
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("solutionShared.problemTitle")} {vertical}{" "}
          {t("solutionShared.businesses")}
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
          {t("solutionShared.stackTitle")}{" "}
          <span className="text-electric-400">{vertical}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("solutionShared.stackSubtitle")}
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
          {t("solutionShared.howItWorks")} <span className="text-electric-400">{t("solutionShared.howItWorksHighlight")}</span>
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
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
          {t("solutionShared.bottomCtaTitle")}{" "}
          <span className="text-electric-400">{vertical}</span>?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          {t("solutionShared.bottomCtaSubtitle")}{" "}
          {vertical.toLowerCase()}.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            {t("solutionShared.seePricing")}
          </Link>
          <Link
            href="/partners"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            {t("solutionShared.becomePartner")}
          </Link>
        </div>
      </section>
    </div>
  );
}
