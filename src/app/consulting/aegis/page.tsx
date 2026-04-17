"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export default function AEGISPage() {
  const { t } = useI18n();

  const sixLayers = [
    {
      name: t("aegis.layerGovernance"),
      description: t("aegis.layerGovernanceDesc"),
      color: "from-electric-500/80 to-electric-600/80",
    },
    {
      name: t("aegis.layerSecurity"),
      description: t("aegis.layerSecurityDesc"),
      color: "from-purple-500/80 to-purple-600/80",
    },
    {
      name: t("aegis.layerIntelligence"),
      description: t("aegis.layerIntelligenceDesc"),
      color: "from-indigo-500/80 to-indigo-600/80",
    },
    {
      name: t("aegis.layerExecution"),
      description: t("aegis.layerExecutionDesc"),
      color: "from-cyan-500/80 to-cyan-600/80",
    },
    {
      name: t("aegis.layerOperations"),
      description: t("aegis.layerOperationsDesc"),
      color: "from-accent-green/80 to-emerald-600/80",
    },
    {
      name: t("aegis.layerLeadership"),
      description: t("aegis.layerLeadershipDesc"),
      color: "from-accent-amber/80 to-orange-600/80",
    },
  ];

  const steps = [
    { step: t("aegis.stepDiagnose"), description: t("aegis.stepDiagnoseDesc") },
    { step: t("aegis.stepDesign"), description: t("aegis.stepDesignDesc") },
    { step: t("aegis.stepImplement"), description: t("aegis.stepImplementDesc") },
    { step: t("aegis.stepOperate"), description: t("aegis.stepOperateDesc") },
    { step: t("aegis.stepEvolve"), description: t("aegis.stepEvolveDesc") },
  ];

  const enterpriseCapabilities = [
    t("aegis.enterpriseCap1"),
    t("aegis.enterpriseCap2"),
    t("aegis.enterpriseCap3"),
    t("aegis.enterpriseCap4"),
  ];

  const smbCapabilities = [
    t("aegis.smbCap1"),
    t("aegis.smbCap2"),
    t("aegis.smbCap3"),
    t("aegis.smbCap4"),
  ];

  const securityItems = [
    t("aegis.secItem1"),
    t("aegis.secItem2"),
    t("aegis.secItem3"),
    t("aegis.secItem4"),
  ];

  const complianceStandards = [
    t("aegis.compStd1"),
    t("aegis.compStd2"),
    t("aegis.compStd3"),
    t("aegis.compStd4"),
  ];

  const artifactModules = [
    {
      layer: t("aegis.layerGovernance"),
      module: t("aegis.modPolicyCoreName"),
      accentClass: "text-electric-400",
      artifacts: [
        t("aegis.modPolicyCoreArt1"),
        t("aegis.modPolicyCoreArt2"),
        t("aegis.modPolicyCoreArt3"),
      ],
    },
    {
      layer: t("aegis.layerSecurity"),
      module: t("aegis.modShieldName"),
      accentClass: "text-purple-400",
      artifacts: [
        t("aegis.modShieldArt1"),
        t("aegis.modShieldArt2"),
        t("aegis.modShieldArt3"),
      ],
    },
    {
      layer: t("aegis.layerIntelligence"),
      module: t("aegis.modSignalName"),
      accentClass: "text-indigo-400",
      artifacts: [
        t("aegis.modSignalArt1"),
        t("aegis.modSignalArt2"),
        t("aegis.modSignalArt3"),
      ],
    },
    {
      layer: t("aegis.layerExecution"),
      module: t("aegis.modDeployName"),
      accentClass: "text-cyan-400",
      artifacts: [
        t("aegis.modDeployArt1"),
        t("aegis.modDeployArt2"),
        t("aegis.modDeployArt3"),
      ],
    },
    {
      layer: t("aegis.layerOperations"),
      module: t("aegis.modCadenceName"),
      accentClass: "text-accent-green",
      artifacts: [
        t("aegis.modCadenceArt1"),
        t("aegis.modCadenceArt2"),
        t("aegis.modCadenceArt3"),
      ],
    },
    {
      layer: t("aegis.layerLeadership"),
      module: t("aegis.modBriefName"),
      accentClass: "text-accent-amber",
      artifacts: [
        t("aegis.modBriefArt1"),
        t("aegis.modBriefArt2"),
        t("aegis.modBriefArt3"),
      ],
    },
  ];

  const pricingTiers = [
    {
      name: t("aegis.tierDiagName"),
      subtitle: t("aegis.tierDiagSubtitle"),
      price: t("aegis.tierDiagPrice"),
      priceNote: t("aegis.tierDiagPriceNote"),
      features: [
        t("aegis.tierDiagFeat1"),
        t("aegis.tierDiagFeat2"),
        t("aegis.tierDiagFeat3"),
        t("aegis.tierDiagFeat4"),
        t("aegis.tierDiagFeat5"),
      ],
      cta: t("aegis.tierDiagCta"),
      source: "aegis-diagnostic",
    },
    {
      name: t("aegis.tierCoreName"),
      subtitle: t("aegis.tierCoreSubtitle"),
      price: t("aegis.tierCorePrice"),
      priceNote: t("aegis.tierCorePriceNote"),
      featured: true,
      features: [
        t("aegis.tierCoreFeat1"),
        t("aegis.tierCoreFeat2"),
        t("aegis.tierCoreFeat3"),
        t("aegis.tierCoreFeat4"),
        t("aegis.tierCoreFeat5"),
      ],
      cta: t("aegis.tierCoreCta"),
      source: "aegis-core",
    },
    {
      name: t("aegis.tierEntName"),
      subtitle: t("aegis.tierEntSubtitle"),
      price: t("aegis.tierEntPrice"),
      priceNote: t("aegis.tierEntPriceNote"),
      features: [
        t("aegis.tierEntFeat1"),
        t("aegis.tierEntFeat2"),
        t("aegis.tierEntFeat3"),
        t("aegis.tierEntFeat4"),
        t("aegis.tierEntFeat5"),
      ],
      cta: t("aegis.tierEntCta"),
      source: "aegis-enterprise",
    },
    {
      name: t("aegis.tierGovName"),
      subtitle: t("aegis.tierGovSubtitle"),
      price: t("aegis.tierGovPrice"),
      priceNote: t("aegis.tierGovPriceNote"),
      features: [
        t("aegis.tierGovFeat1"),
        t("aegis.tierGovFeat2"),
        t("aegis.tierGovFeat3"),
        t("aegis.tierGovFeat4"),
      ],
      cta: t("aegis.tierGovCta"),
      source: "aegis-government",
    },
  ];

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/8 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-accent-amber/30 bg-accent-amber/10 px-4 py-1.5 text-sm font-semibold text-accent-amber">
            {t("aegis.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("aegis.heroTitle")}
            <br />
            <span className="text-electric-400">
              {t("aegis.heroTitleHighlight")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("aegis.heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact?service=aegis&source=aegis-hero"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              {t("aegis.ctaDiscovery")}
            </Link>
            <Link
              href="/consulting"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              {t("aegis.ctaServices")}
            </Link>
          </div>
        </div>
      </section>

      {/* Six Layers */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("aegis.layersTitle")}{" "}
          <span className="text-electric-400">
            {t("aegis.layersTitleHighlight")}
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("aegis.layersSubtitle")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {sixLayers.map((layer) => (
            <div
              key={layer.name}
              className={`rounded-2xl bg-gradient-to-b ${layer.color} p-6 transition-all hover:scale-[1.02]`}
            >
              <h3 className="text-lg font-bold text-white">{layer.name}</h3>
              <p className="mt-3 text-sm text-white/80">{layer.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("aegis.howItWorksTitle")}{" "}
          <span className="text-electric-400">
            {t("aegis.howItWorksTitleHighlight")}
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          {t("aegis.howItWorksSubtitle")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-electric-500/40 bg-navy-900/80 text-lg font-bold text-electric-400">
                {i + 1}
              </div>
              <h3 className="mt-3 font-bold">{s.step}</h3>
              <p className="mt-2 text-xs text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Two Markets */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("aegis.marketsTitle")}{" "}
          <span className="text-electric-400">
            {t("aegis.marketsTitleHighlight")}
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          {t("aegis.marketsSubtitle")}
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Enterprise */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <h3 className="text-xl font-bold">{t("aegis.enterpriseTitle")}</h3>
            <ul className="mt-6 space-y-3">
              {enterpriseCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 text-accent-green">&#10003;</span>
                  {cap}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-slate-400">
              {t("aegis.enterpriseEntry")}{" "}
              <strong className="text-electric-400">
                {t("aegis.enterpriseEntryValue")}
              </strong>
            </p>
          </div>
          {/* SMB */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <h3 className="text-xl font-bold">{t("aegis.smbTitle")}</h3>
            <ul className="mt-6 space-y-3">
              {smbCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 text-accent-green">&#10003;</span>
                  {cap}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-slate-400">
              {t("aegis.enterpriseEntry")}{" "}
              <strong className="text-electric-400">
                {t("aegis.smbEntryValue")}
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* Security, Trust & Resilience */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">{t("aegis.securityTitle")}</h2>
            <p className="mt-4 text-slate-400">{t("aegis.securitySubtitle")}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {securityItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-accent-green">&#128274;</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{t("aegis.complianceTitle")}</h3>
              <span className="rounded-full bg-electric-500 px-3 py-1 text-xs font-bold text-white">
                {t("aegis.enterpriseReady")}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {t("aegis.complianceSubtitle")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {complianceStandards.map((std) => (
                <span
                  key={std}
                  className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200"
                >
                  {std}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Get — 18 Named Artifacts */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("aegis.artifactsTitle")}{" "}
          <span className="text-electric-400">
            {t("aegis.artifactsTitleHighlight")}
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          {t("aegis.artifactsSubtitle")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artifactModules.map((mod) => (
            <div
              key={mod.module}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-slate-700"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {mod.layer}
              </p>
              <h3 className={`mt-1 text-lg font-bold ${mod.accentClass}`}>
                {mod.module}
              </h3>
              <ul className="mt-4 space-y-2">
                {mod.artifacts.map((a) => (
                  <li
                    key={a}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span className="mt-0.5 text-accent-green">&#10003;</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-400">
          {t("aegis.artifactsFooter")}
        </p>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("aegis.pricingTitle")}
        </h2>
        <p className="mx-auto mt-2 font-semibold text-electric-400 text-center">
          {t("aegis.pricingTagline")}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-400">
          {t("aegis.pricingSubtitlePart1")}
          <span className="text-slate-200">
            {t("aegis.pricingSubtitleEmphasis")}
          </span>
          {t("aegis.pricingSubtitlePart2")}
        </p>

        {/* Tier Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 ${
                tier.featured
                  ? "border-electric-500/50 bg-electric-500/5 shadow-lg shadow-electric-500/10"
                  : "border-slate-800 bg-navy-900/50"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-500 px-4 py-1 text-xs font-bold text-white">
                  {t("aegis.featured")}
                </div>
              )}
              <h3 className="text-base font-bold">{tier.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{tier.subtitle}</p>

              <div className="mt-4">
                <p className="text-xl font-bold text-electric-400">
                  {tier.price}
                </p>
                {tier.priceNote && (
                  <p className="mt-1 text-xs text-slate-400">{tier.priceNote}</p>
                )}
              </div>

              <ul className="mt-4 space-y-1.5">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-slate-300"
                  >
                    <span className="mt-0.5 text-accent-green">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?service=aegis&source=${tier.source}`}
                className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                  tier.featured
                    ? "bg-electric-500 text-white hover:bg-electric-600"
                    : "border border-slate-700 text-slate-300 hover:border-electric-500/50"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t("aegis.ctaTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          {t("aegis.ctaSubtitle")}
        </p>
        <Link
          href="/contact?service=aegis&source=aegis-final"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          {t("aegis.ctaDiscovery")}
        </Link>
        <p className="mt-3 text-xs text-slate-400">
          {t("aegis.orText")}{" "}
          <Link href="/assess" className="text-electric-400 underline hover:text-electric-300">
            {t("aegis.ctaAssessLink")}
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
