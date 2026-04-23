"use client";

import Link from "next/link";

type BillingCycle = "monthly" | "annual";

export default function PricingPage() {
  const { t } = useI18n();

  const tiers = [
    {
      name: t("pricingV2.tier1Name"),
      target: t("pricingV2.tier1Target"),
      monthly: "$1,299",
      annual: "$12,999",
      hours: "20",
      overage: "$65",
      features: [
        t("pricingV2.tier1Feat1"),
        t("pricingV2.tier1Feat2"),
        t("pricingV2.tier1Feat3"),
        t("pricingV2.tier1Feat4"),
        t("pricingV2.tier1Feat5"),
        t("pricingV2.tier1Feat6"),
      ],
    },
    {
      name: t("pricingV2.tier2Name"),
      target: t("pricingV2.tier2Target"),
      monthly: "$2,299",
      annual: "$22,999",
      hours: "40",
      overage: "$60",
      featured: true,
      features: [
        t("pricingV2.tier2Feat1"),
        t("pricingV2.tier2Feat2"),
        t("pricingV2.tier2Feat3"),
        t("pricingV2.tier2Feat4"),
        t("pricingV2.tier2Feat5"),
        t("pricingV2.tier2Feat6"),
        t("pricingV2.tier2Feat7"),
      ],
    },
    {
      name: t("pricingV2.tier3Name"),
      target: t("pricingV2.tier3Target"),
      monthly: "$3,999",
      annual: "$39,999",
      hours: "80",
      overage: "$55",
      features: [
        t("pricingV2.tier3Feat1"),
        t("pricingV2.tier3Feat2"),
        t("pricingV2.tier3Feat3"),
        t("pricingV2.tier3Feat4"),
        t("pricingV2.tier3Feat5"),
        t("pricingV2.tier3Feat6"),
        t("pricingV2.tier3Feat7"),
        t("pricingV2.tier3Feat8"),
      ],
    },
    {
      name: t("pricingV2.tier4Name"),
      target: t("pricingV2.tier4Target"),
      monthly: "$6,999",
      annual: "$69,999",
      hours: "160",
      overage: "$50",
      features: [
        t("pricingV2.tier4Feat1"),
        t("pricingV2.tier4Feat2"),
        t("pricingV2.tier4Feat3"),
        t("pricingV2.tier4Feat4"),
        t("pricingV2.tier4Feat5"),
        t("pricingV2.tier4Feat6"),
        t("pricingV2.tier4Feat7"),
        t("pricingV2.tier4Feat8"),
        t("pricingV2.tier4Feat9"),
        t("pricingV2.tier4Feat10"),
      ],
    },
  ];

  const addOns = [
    { name: t("pricingV2.addon1Name"), price: "$750 / mo" },
    { name: t("pricingV2.addon2Name"), price: "$250 / mo" },
    { name: t("pricingV2.addon3Name"), price: "$500 / mo" },
    { name: t("pricingV2.addon4Name"), price: t("pricingV2.addon4Price") },
    { name: t("pricingV2.addon5Name"), price: "$500 " + t("pricingV2.flat") },
    { name: t("pricingV2.addon6Name"), price: "$2,500 + " + t("pricingV2.travel") },
  ];

  const faqs = [
    { q: t("pricingV2.faq1Q"), a: t("pricingV2.faq1A") },
    { q: t("pricingV2.faq2Q"), a: t("pricingV2.faq2A") },
    { q: t("pricingV2.faq3Q"), a: t("pricingV2.faq3A") },
    { q: t("pricingV2.faq4Q"), a: t("pricingV2.faq4A") },
    { q: t("pricingV2.faq5Q"), a: t("pricingV2.faq5A") },
    { q: t("pricingV2.faq6Q"), a: t("pricingV2.faq6A") },
    { q: t("pricingV2.faq7Q"), a: t("pricingV2.faq7A") },
    { q: t("pricingV2.faq8Q"), a: t("pricingV2.faq8A") },
    { q: t("pricingV2.faq9Q"), a: t("pricingV2.faq9A") },
  ];

  const includedLines = [
    t("pricingV2.included1"),
    t("pricingV2.included2"),
    t("pricingV2.included3"),
    t("pricingV2.included4"),
    t("pricingV2.included5"),
    t("pricingV2.included6"),
    t("pricingV2.included7"),
    t("pricingV2.included8"),
  ];

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex items-center justify-center px-6 pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("pricingV2.heroTitle1")}{" "}
            <span className="text-electric-400">{t("pricingV2.heroTitle2")}</span>{" "}
            {t("pricingV2.heroTitle3")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("pricingV2.heroSubtitle")}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-400">
            <span>{t("pricingV2.heroPill1")}</span>
            <span className="text-slate-700">·</span>
            <span>{t("pricingV2.heroPill2")}</span>
            <span className="text-slate-700">·</span>
            <span>{t("pricingV2.heroPill3")}</span>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-electric-500/20 bg-electric-500/5 p-8 md:p-12">
          <h2 className="text-center text-2xl font-bold text-electric-400">
            {t("pricingV2.includedTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            {t("pricingV2.includedSubtitle")}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {includedLines.map((line) => (
              <div key={line} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 text-electric-400">&#10003;</span>
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-center text-3xl font-bold">
          {t("pricingV2.tiersTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          {t("pricingV2.tiersSubtitle")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 transition-all ${
                tier.featured
                  ? "border-electric-500/50 bg-electric-500/5 shadow-lg shadow-electric-500/10"
                  : "border-slate-800 bg-navy-900/50"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-500 px-4 py-1 text-xs font-bold text-white">
                  {t("pricingV2.mostPopular")}
                </div>
              )}
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{tier.target}</p>

              <div className="mt-6">
                <p className="text-4xl font-bold">
                  {tier.monthly}
                  <span className="text-base font-normal text-slate-400"> {t("pricingV2.perMo")}</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {t("pricingV2.or")} {tier.annual} {t("pricingV2.perYrFree")}
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-slate-800/50 px-3 py-2">
                <p className="text-sm text-slate-200">
                  <span className="font-semibold text-electric-400">{tier.hours}</span>{" "}
                  {t("pricingV2.agentHoursPerMo")}
                </p>
                <p className="text-xs text-slate-400">
                  {t("pricingV2.overage")}: {tier.overage} {t("pricingV2.perHr")}
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 text-accent-green">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                  tier.featured
                    ? "bg-electric-500 text-white hover:bg-electric-400"
                    : "border border-slate-700 text-slate-200 hover:border-electric-500/50 hover:text-white"
                }`}
              >
                {tier.name === t("pricingV2.tier4Name") ? t("pricingV2.talkToSales") : `${t("pricingV2.start")} ${tier.name}`}
              </Link>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
          Cancel anytime with 30 days&apos; notice. Hardware returns in a prepaid shipping box.
        </p>
      </section>

      {/* Agent-hour definition */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8 md:p-10">
          <h2 className="text-2xl font-bold">{t("pricingV2.agentHourTitle")}</h2>
          <p className="mt-4 text-slate-300">{t("pricingV2.agentHourBody1")}</p>
          <p className="mt-4 text-slate-300">
            <span className="font-semibold text-electric-400">{t("pricingV2.forExample")}:</span>{" "}
            {t("pricingV2.agentHourBody2")}
          </p>
          <p className="mt-4 text-sm text-slate-400">{t("pricingV2.agentHourBody3")}</p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">{t("pricingV2.addonsTitle")}</h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full">
            <thead>
              <tr className="bg-electric-500/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-electric-400">
                  {t("pricingV2.addonCol1")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-electric-400">
                  {t("pricingV2.addonCol2")}
                </th>
              </tr>
            </thead>
            <tbody>
              {addOns.map((a, i) => (
                <tr
                  key={a.name}
                  className={`border-t border-slate-800 ${
                    i % 2 === 0 ? "bg-navy-900/30" : "bg-navy-900/10"
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-slate-300">{a.name}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-200">
                    {a.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Enterprise consulting strip */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8 md:p-10">
          <h2 className="text-2xl font-bold">{t("pricingV2.entStripTitle")}</h2>
          <p className="mt-4 text-slate-300">{t("pricingV2.entStripBody")}</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-electric-400">&#10003;</span>
              <span>
                <span className="font-semibold">AI Readiness 360&trade;</span> &mdash; {t("pricingV2.entServ1")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-electric-400">&#10003;</span>
              <span>
                <span className="font-semibold">AI Transformation</span> &mdash; {t("pricingV2.entServ2")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-electric-400">&#10003;</span>
              <span>
                <span className="font-semibold">AEGIS</span> &mdash; {t("pricingV2.entServ3")}
              </span>
            </li>
          </ul>
          <Link
            href="/consulting"
            className="mt-8 inline-block rounded-lg border border-electric-500/50 px-6 py-2.5 text-sm font-semibold text-electric-400 transition-all hover:bg-electric-500/10"
          >
            {t("pricingV2.exploreEnt")} &rarr;
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">
          {t("pricingV2.faqTitle1")} <span className="text-electric-400">{t("pricingV2.faqTitle2")}</span>
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3"
            >
              <span className="text-accent-green">✓</span>
              <span className="text-sm text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Agent-hour definition */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
          <h3 className="text-xl font-bold">What&apos;s an agent-hour?</h3>
          <p className="mt-3 text-slate-300">
            An agent-hour is 60 minutes of active AI processing time. Idle time
            doesn&apos;t count. Your dashboard shows real-time usage so you
            always know where you stand.
          </p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Add-ons</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                <th className="py-3 pr-4 font-semibold">Add-on</th>
                <th className="py-3 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {addOns.map((addon) => (
                <tr
                  key={addon.label}
                  className="border-b border-slate-800/60 text-sm"
                >
                  <td className="py-3 pr-4 text-slate-200">{addon.label}</td>
                  <td className="py-3 font-semibold text-electric-400">
                    {addon.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Frequently Asked <span className="text-electric-400">Questions</span>
        </h2>
        <dl className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <dt className="font-semibold text-slate-100">{faq.q}</dt>
              <dd className="mt-2 text-sm text-slate-300">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">{t("pricingV2.finalCtaTitle")}</h2>
        <p className="mt-4 text-lg text-slate-400">{t("pricingV2.finalCtaSubtitle")}</p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/consulting/ai-readiness-360"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            {t("pricingV2.takeScore")}
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            {t("pricingV2.talkToSales")}
          </Link>
        </div>
      </section>
    </div>
  );
}
