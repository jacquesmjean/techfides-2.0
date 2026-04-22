"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export default function TransformationManagementPage() {
  const { t } = useI18n();

  const pillars = [
    {
      icon: "\u{1F3DB}",
      name: t("transformation.pillar1Name"),
      color: "text-electric-400",
      borderColor: "border-electric-500/30",
      bgColor: "bg-electric-500/5",
      description: t("transformation.pillar1Desc"),
      focusAreas: [
        t("transformation.pillar1Focus1"),
        t("transformation.pillar1Focus2"),
        t("transformation.pillar1Focus3"),
        t("transformation.pillar1Focus4"),
      ],
      outcome: t("transformation.pillar1Outcome"),
    },
    {
      icon: "\u26A1",
      name: t("transformation.pillar2Name"),
      color: "text-accent-amber",
      borderColor: "border-accent-amber/30",
      bgColor: "bg-accent-amber/5",
      description: t("transformation.pillar2Desc"),
      focusAreas: [
        t("transformation.pillar2Focus1"),
        t("transformation.pillar2Focus2"),
        t("transformation.pillar2Focus3"),
        t("transformation.pillar2Focus4"),
      ],
      outcome: t("transformation.pillar2Outcome"),
    },
    {
      icon: "\u{1F465}",
      name: t("transformation.pillar3Name"),
      color: "text-accent-green",
      borderColor: "border-accent-green/30",
      bgColor: "bg-accent-green/5",
      description: t("transformation.pillar3Desc"),
      focusAreas: [
        t("transformation.pillar3Focus1"),
        t("transformation.pillar3Focus2"),
        t("transformation.pillar3Focus3"),
        t("transformation.pillar3Focus4"),
      ],
      outcome: t("transformation.pillar3Outcome"),
    },
  ];

  const engagementModels = [
    {
      icon: "\u2699",
      name: t("transformation.model1Name"),
      description: t("transformation.model1Desc"),
      benefits: [t("transformation.model1Benefit1"), t("transformation.model1Benefit2"), t("transformation.model1Benefit3")],
    },
    {
      icon: "\u{1F465}",
      name: t("transformation.model2Name"),
      description: t("transformation.model2Desc"),
      benefits: [t("transformation.model2Benefit1"), t("transformation.model2Benefit2"), t("transformation.model2Benefit3")],
      featured: true,
    },
    {
      icon: "\u{1F393}",
      name: t("transformation.model3Name"),
      description: t("transformation.model3Desc"),
      benefits: [t("transformation.model3Benefit1"), t("transformation.model3Benefit2"), t("transformation.model3Benefit3")],
    },
    {
      icon: "\u2713",
      name: t("transformation.model4Name"),
      description: t("transformation.model4Desc"),
      benefits: [t("transformation.model4Benefit1"), t("transformation.model4Benefit2"), t("transformation.model4Benefit3")],
    },
  ];

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/8 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm font-semibold text-electric-400">
            {t("transformation.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("transformation.heroTitle")}
            <br />
            <span className="text-electric-400">{t("transformation.heroTitleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("transformation.heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              Request Transformation Roadmap
            </Link>
            <Link
              href="/consulting/ai-readiness-360"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              Start with Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* What you&apos;re buying */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">{t("transformation.buyingTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">{t("transformation.buyingBody")}</p>
        <p className="mt-4 font-semibold text-electric-400">{t("transformation.buyingTagline")}</p>
      </section>

      {/* Who you work with */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("transformation.whoTitle1")} <span className="text-electric-400">{t("transformation.whoTitle2")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">{t("transformation.whoSubtitle")}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-6">
            <div className="text-3xl">&#127891;</div>
            <h3 className="mt-4 text-xl font-bold text-electric-400">{t("transformation.expertise1Title")}</h3>
            <p className="mt-2 text-sm text-slate-400">{t("transformation.expertise1Desc")}</p>
          </div>
          <div className="rounded-2xl border border-accent-amber/30 bg-accent-amber/5 p-6">
            <div className="text-3xl">&#129504;</div>
            <h3 className="mt-4 text-xl font-bold text-accent-amber">{t("transformation.expertise2Title")}</h3>
            <p className="mt-2 text-sm text-slate-400">{t("transformation.expertise2Desc")}</p>
          </div>
          <div className="rounded-2xl border border-accent-green/30 bg-accent-green/5 p-6">
            <div className="text-3xl">&#128202;</div>
            <h3 className="mt-4 text-xl font-bold text-accent-green">{t("transformation.expertise3Title")}</h3>
            <p className="mt-2 text-sm text-slate-400">{t("transformation.expertise3Desc")}</p>
          </div>
        </div>
      </section>

      {/* Where they deploy */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8 md:p-10">
          <h2 className="text-2xl font-bold">{t("transformation.deployTitle")}</h2>
          <p className="mt-3 text-slate-300">{t("transformation.deployBody1")}</p>
          <p className="mt-4 text-sm text-slate-400">{t("transformation.deployBody2")}</p>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          The Three Pillars of{" "}
          <span className="text-electric-400">Transformation</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Consultants work across three layers at once, restructuring how value is created, delivered, and governed.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.name}
              className={`rounded-2xl border ${pillar.borderColor} ${pillar.bgColor} p-6 transition-all hover:scale-[1.02]`}
            >
              <div className="text-3xl">{pillar.icon}</div>
              <h3 className={`mt-4 text-xl font-bold ${pillar.color}`}>
                {pillar.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {pillar.description}
              </p>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Focus Areas
                </p>
                <ul className="mt-2 space-y-1">
                  {pillar.focusAreas.map((area) => (
                    <li
                      key={area}
                      className={`flex items-center gap-2 text-sm ${pillar.color}`}
                    >
                      <span>&#10003;</span>
                      <span className="text-slate-300">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 border-t border-slate-700/50 pt-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  {t("transformation.outcome")}
                </p>
                <p className={`mt-1 text-sm font-semibold ${pillar.color}`}>
                  {pillar.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flexible Engagement Models */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("transformation.modelsTitle1")}{" "}
          <span className="text-electric-400">{t("transformation.modelsTitle2")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("transformation.modelsSubtitle")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {engagementModels.map((model) => (
            <div
              key={model.name}
              className={`rounded-2xl border p-6 transition-all ${
                model.featured
                  ? "border-electric-500/40 bg-electric-500/5"
                  : "border-slate-800 bg-navy-900/50"
              }`}
            >
              <div className="text-3xl">{model.icon}</div>
              <h3
                className={`mt-4 text-xl font-bold ${
                  model.featured ? "text-electric-400" : "text-white"
                }`}
              >
                {model.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {model.description}
              </p>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  {t("transformation.keyBenefits")}
                </p>
                <ul className="mt-2 space-y-1">
                  {model.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <span className="text-electric-400">&#8226;</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Measurable Results */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-electric-500/30 bg-gradient-to-b from-electric-500/5 to-transparent p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold">{t("transformation.resultsTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            {t("transformation.resultsSubtitle")}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                icon: "\u2699",
                title: t("transformation.result1Title"),
                desc: t("transformation.result1Desc"),
              },
              {
                icon: "\u{1F6E1}",
                title: t("transformation.result2Title"),
                desc: t("transformation.result2Desc"),
              },
              {
                icon: "\u{1F4CA}",
                title: t("transformation.result3Title"),
                desc: t("transformation.result3Desc"),
              },
              {
                icon: "\u{1F4DA}",
                title: t("transformation.result4Title"),
                desc: t("transformation.result4Desc"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5 text-center"
              >
                <div className="text-2xl">{item.icon}</div>
                <h3 className="mt-3 font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400">{item.desc}</p>
                <div className="mt-3 text-accent-green">&#10003;</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Pricing */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          <span className="text-electric-400">Engagement</span> Pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          Transparent, fixed-scope pricing aligned to your transformation
          maturity. Every engagement includes executive briefing, stakeholder
          alignment, and a governed delivery framework.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {/* Strategic Advisory */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-electric-500/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tier 1
            </p>
            <h3 className="mt-2 text-lg font-bold">Strategic Advisory</h3>
            <p className="mt-1 text-xs text-slate-400">
              Ongoing executive guidance
            </p>
            <div className="mt-5">
              <p className="text-3xl font-bold text-electric-400">$50,000</p>
              <p className="mt-1 text-xs text-slate-400">Starting engagement</p>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Up to <span className="font-semibold text-slate-300">$95,000</span>
            </div>
            <ul className="mt-5 space-y-2">
              {[
                "Quarterly executive sessions",
                "AI strategy & governance review",
                "Investment portfolio optimization",
                "Board-ready deliverables",
                "6-month engagement cycle",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-400"
                >
                  <span className="mt-0.5 text-electric-400">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Transformation Management — Featured */}
          <div className="relative rounded-2xl border border-electric-500/40 bg-electric-500/5 p-6 transition-all hover:border-electric-500/60">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-500 px-3 py-0.5 text-xs font-bold text-white">
              MOST POPULAR
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-electric-400">
              Tier 2
            </p>
            <h3 className="mt-2 text-lg font-bold text-electric-400">
              Transformation Mgmt
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              End-to-end program leadership
            </p>
            <div className="mt-5">
              <p className="text-3xl font-bold text-electric-400">$125,000</p>
              <p className="mt-1 text-xs text-slate-400">Starting engagement</p>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Up to{" "}
              <span className="font-semibold text-slate-300">$250,000</span>
            </div>
            <ul className="mt-5 space-y-2">
              {[
                "Full program governance",
                "Stakeholder management",
                "Value assurance & delivery",
                "Change management framework",
                "Cross-functional PMO integration",
                "12-month engagement cycle",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-400"
                >
                  <span className="mt-0.5 text-electric-400">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Capability Building */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-electric-500/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tier 3
            </p>
            <h3 className="mt-2 text-lg font-bold">Capability Building</h3>
            <p className="mt-1 text-xs text-slate-400">
              Internal CoE development
            </p>
            <div className="mt-5">
              <p className="text-3xl font-bold text-electric-400">$175,000</p>
              <p className="mt-1 text-xs text-slate-400">Starting engagement</p>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Up to{" "}
              <span className="font-semibold text-slate-300">$350,000</span>
            </div>
            <ul className="mt-5 space-y-2">
              {[
                "AI Center of Excellence setup",
                "Talent development & mentoring",
                "Process standardization",
                "Knowledge transfer & IP retention",
                "Internal tooling & frameworks",
                "18-month engagement cycle",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-400"
                >
                  <span className="mt-0.5 text-electric-400">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Rescue & Turnaround */}
          <div className="rounded-2xl border border-accent-amber/30 bg-accent-amber/5 p-6 transition-all hover:border-accent-amber/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-amber">
              Emergency
            </p>
            <h3 className="mt-2 text-lg font-bold text-accent-amber">
              Rescue &amp; Turnaround
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Rapid intervention for stalled programs
            </p>
            <div className="mt-5">
              <p className="text-3xl font-bold text-accent-amber">$85,000</p>
              <p className="mt-1 text-xs text-slate-400">Starting engagement</p>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Up to{" "}
              <span className="font-semibold text-slate-300">$200,000</span>
            </div>
            <ul className="mt-5 space-y-2">
              {[
                "Root cause analysis (Week 1)",
                "Rapid remediation plan",
                "Momentum restoration",
                "Stakeholder realignment",
                "Governance reset",
                "90-day sprint engagement",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-400"
                >
                  <span className="mt-0.5 text-accent-amber">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            {t("transformation.pricingNote")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to Execute with{" "}
          <span className="text-electric-400">Discipline</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Stop managing transformation as a series of disconnected projects.
          Build an operating capability for governed AI execution that scales
          and endures.
        </p>
        <Link
          href="/contact"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          Start Your Transformation
        </Link>
      </section>
    </div>
  );
}
