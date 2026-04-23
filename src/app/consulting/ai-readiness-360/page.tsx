"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export default function AIReadiness360Page() {
  const { t } = useI18n();

  const domains = [
    {
      icon: "\uD83C\uDFAF",
      name: t("ai360.dom1Name"),
      question: t("ai360.dom1Question"),
      color: "text-electric-400",
      borderColor: "border-electric-500/30",
      bgColor: "bg-electric-500/5",
      details: [
        t("ai360.dom1Detail1"),
        t("ai360.dom1Detail2"),
        t("ai360.dom1Detail3"),
        t("ai360.dom1Detail4"),
        t("ai360.dom1Detail5"),
      ],
    },
    {
      icon: "\uD83D\uDDC4\uFE0F",
      name: t("ai360.dom2Name"),
      question: t("ai360.dom2Question"),
      color: "text-accent-amber",
      borderColor: "border-accent-amber/30",
      bgColor: "bg-accent-amber/5",
      details: [
        t("ai360.dom2Detail1"),
        t("ai360.dom2Detail2"),
        t("ai360.dom2Detail3"),
        t("ai360.dom2Detail4"),
        t("ai360.dom2Detail5"),
      ],
    },
    {
      icon: "\uD83D\uDDA5\uFE0F",
      name: t("ai360.dom3Name"),
      question: t("ai360.dom3Question"),
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      details: [
        t("ai360.dom3Detail1"),
        t("ai360.dom3Detail2"),
        t("ai360.dom3Detail3"),
        t("ai360.dom3Detail4"),
        t("ai360.dom3Detail5"),
      ],
    },
    {
      icon: "\u2699\uFE0F",
      name: t("ai360.dom4Name"),
      question: t("ai360.dom4Question"),
      color: "text-sky-400",
      borderColor: "border-sky-500/30",
      bgColor: "bg-sky-500/5",
      details: [
        t("ai360.dom4Detail1"),
        t("ai360.dom4Detail2"),
        t("ai360.dom4Detail3"),
        t("ai360.dom4Detail4"),
        t("ai360.dom4Detail5"),
      ],
    },
    {
      icon: "\uD83D\uDEE1\uFE0F",
      name: t("ai360.dom5Name"),
      question: t("ai360.dom5Question"),
      color: "text-accent-green",
      borderColor: "border-accent-green/30",
      bgColor: "bg-accent-green/5",
      details: [
        t("ai360.dom5Detail1"),
        t("ai360.dom5Detail2"),
        t("ai360.dom5Detail3"),
        t("ai360.dom5Detail4"),
        t("ai360.dom5Detail5"),
      ],
    },
    {
      icon: "\uD83D\uDC65",
      name: t("ai360.dom6Name"),
      question: t("ai360.dom6Question"),
      color: "text-pink-400",
      borderColor: "border-pink-500/30",
      bgColor: "bg-pink-500/5",
      details: [
        t("ai360.dom6Detail1"),
        t("ai360.dom6Detail2"),
        t("ai360.dom6Detail3"),
        t("ai360.dom6Detail4"),
        t("ai360.dom6Detail5"),
      ],
    },
  ];

  const deliverables = [
    { name: t("ai360.del1Name"), icon: "\uD83D\uDCCA", description: t("ai360.del1Desc") },
    { name: t("ai360.del2Name"), icon: "\uD83D\uDD25", description: t("ai360.del2Desc") },
    { name: t("ai360.del3Name"), icon: "\u26A0\uFE0F", description: t("ai360.del3Desc") },
    { name: t("ai360.del4Name"), icon: "\uD83D\uDE80", description: t("ai360.del4Desc") },
    { name: t("ai360.del5Name"), icon: "\uD83D\uDDFA\uFE0F", description: t("ai360.del5Desc") },
    { name: t("ai360.del6Name"), icon: "\uD83D\uDCCB", description: t("ai360.del6Desc") },
  ];

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm font-semibold text-electric-400">
            {t("ai360.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("ai360.heroTitle")}
            <br />
            <span className="text-electric-400">{t("ai360.heroTitleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
            {t("ai360.heroDesc1")}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            {t("ai360.heroDesc2")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              {t("ai360.ctaRequest")}
            </Link>
            <Link
              href="/assess"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              {t("ai360.ctaFreeScore")}
            </Link>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              {t("ai360.whyFailTitle")} <span className="text-electric-400">{t("ai360.whyFailHighlight")}</span> {t("ai360.whyFailSuffix")}
            </h2>
            <p className="mt-4 text-slate-400">
              {t("ai360.whyFailDesc")}
            </p>

            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">&#9888;</span>
                <h3 className="font-bold text-red-400">{t("ai360.pilotTrap")}</h3>
              </div>
              <p className="mt-2 text-sm text-red-300/80">
                {t("ai360.pilotTrapDesc")}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-accent-green text-lg">&#10003;</span>
                <h3 className="font-bold text-accent-green">{t("ai360.ourApproach")}</h3>
              </div>
              <p className="mt-2 text-sm text-green-300/80">
                {t("ai360.ourApproachDesc")}
              </p>
            </div>
          </div>

          {/* How It Works — 4 Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200">{t("ai360.clientExperience")}</h3>
            {[
              { step: "01", icon: "\uD83D\uDCDD", title: t("ai360.step1Title"), desc: t("ai360.step1Desc") },
              { step: "02", icon: "\uD83D\uDD0D", title: t("ai360.step2Title"), desc: t("ai360.step2Desc") },
              { step: "03", icon: "\uD83D\uDCC2", title: t("ai360.step3Title"), desc: t("ai360.step3Desc") },
              { step: "04", icon: "\uD83D\uDCCA", title: t("ai360.step4Title"), desc: t("ai360.step4Desc") },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-xl border border-slate-800 bg-navy-900/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-500/10 text-lg">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-electric-400">{s.step}</span>
                    <h4 className="text-sm font-bold text-slate-200">{s.title}</h4>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Assessment Domains */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          6 Assessment <span className="text-electric-400">Domains</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          {t("ai360.domainsSubtitle2")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <div
              key={d.name}
              className={`rounded-2xl border ${d.borderColor} ${d.bgColor} p-6`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.icon}</span>
                <h3 className={`text-lg font-bold ${d.color}`}>{d.name}</h3>
              </div>
              <p className="mt-2 text-sm italic text-slate-400">{d.question}</p>
              <div className="mt-4 space-y-2">
                {d.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className={`mt-0.5 ${d.color}`}>&#9656;</span>
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual: Sample Heat Map + Executive Output */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("ai360.outputTitle")} <span className="text-electric-400">{t("ai360.outputTitleHighlight")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("ai360.outputSubtitle")}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Enterprise Heat Map */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4">{t("ai360.heatMapTitle")}</h3>
            <div className="space-y-3">
              {[
                { domain: t("ai360.dom1Name"), score: 72, level: t("ai360.levelAdvancing") },
                { domain: t("ai360.dom2Name"), score: 45, level: t("ai360.levelDeveloping") },
                { domain: t("ai360.dom3Name"), score: 61, level: t("ai360.levelAdvancing") },
                { domain: t("ai360.dom4Name"), score: 38, level: t("ai360.levelEmerging") },
                { domain: t("ai360.dom5Name"), score: 28, level: t("ai360.levelEmerging") },
                { domain: t("ai360.dom6Name"), score: 55, level: t("ai360.levelDeveloping") },
              ].map((d) => {
                const color = d.score >= 70 ? "#22c55e" : d.score >= 50 ? "#f59e0b" : d.score >= 30 ? "#f97316" : "#ef4444";
                const bgColor = d.score >= 70 ? "bg-green-500/10" : d.score >= 50 ? "bg-amber-500/10" : d.score >= 30 ? "bg-orange-500/10" : "bg-red-500/10";
                return (
                  <div key={d.domain}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">{d.domain}</span>
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${bgColor}`} style={{ color }}>{d.level}</span>
                        <span className="text-xs font-bold" style={{ color }}>{d.score}</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-slate-800">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.score}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-xs text-slate-400">{t("ai360.overallScore")}</span>
              <span className="text-xl font-extrabold text-amber-400">50/100</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">{t("ai360.maturityLine")}</p>
          </div>

          {/* Risk & Opportunity Matrix */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4">{t("ai360.riskMatrixTitle")}</h3>

            {/* Risk Quadrant */}
            <div className="grid grid-cols-5 gap-1 mb-4">
              <div className="col-span-5 text-center text-[9px] text-slate-500 mb-1">{t("ai360.impact")} &rarr;</div>
              {[
                ["bg-green-500/20", "bg-green-500/30", "bg-amber-500/20", "bg-amber-500/30", "bg-red-500/20"],
                ["bg-green-500/10", "bg-green-500/20", "bg-amber-500/20", "bg-amber-500/30", "bg-red-500/30"],
                ["bg-slate-800/50", "bg-green-500/10", "bg-amber-500/10", "bg-red-500/20", "bg-red-500/30"],
                ["bg-slate-800/50", "bg-slate-800/50", "bg-amber-500/10", "bg-amber-500/20", "bg-red-500/20"],
                ["bg-slate-800/50", "bg-slate-800/50", "bg-slate-800/50", "bg-amber-500/10", "bg-amber-500/20"],
              ].map((row, ri) => (
                row.map((cell, ci) => {
                  const dots: Record<string, string> = { "1-3": "\uD83D\uDD35", "2-4": "\uD83D\uDD34", "0-2": "\uD83D\uDFE2", "3-1": "\uD83D\uDFE1", "1-1": "\uD83D\uDFE2" };
                  const key = `${ri}-${ci}`;
                  return (
                    <div key={key} className={`h-8 rounded ${cell} flex items-center justify-center text-[10px]`}>
                      {dots[key] || ""}
                    </div>
                  );
                })
              ))}
              <div className="col-span-5 flex items-center justify-between text-[9px] text-slate-500 mt-1">
                <span>&uarr; {t("ai360.likelihood")}</span>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" />{t("ai360.sevLow")}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />{t("ai360.sevMedium")}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />{t("ai360.sevHigh")}</span>
                </div>
              </div>
            </div>

            {/* Key Risks */}
            <div className="space-y-2 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("ai360.topRisks")}</p>
              {[
                { risk: t("ai360.risk1"), severity: t("ai360.sevCritical"), color: "text-red-400" },
                { risk: t("ai360.risk2"), severity: t("ai360.sevHigh"), color: "text-amber-400" },
                { risk: t("ai360.risk3"), severity: t("ai360.sevHigh"), color: "text-amber-400" },
                { risk: t("ai360.risk4"), severity: t("ai360.sevMedium"), color: "text-sky-400" },
              ].map((r) => (
                <div key={r.risk} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-1.5">
                  <span className="text-[11px] text-slate-300">{r.risk}</span>
                  <span className={`text-[9px] font-bold ${r.color}`}>{r.severity}</span>
                </div>
              ))}
            </div>

            {/* Quick Opportunities */}
            <div className="space-y-2 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent-green">{t("ai360.topOpps")}</p>
              {[
                { opp: t("ai360.opp1"), impact: t("ai360.opp1Impact") },
                { opp: t("ai360.opp2"), impact: t("ai360.opp2Impact") },
              ].map((o) => (
                <div key={o.opp} className="flex items-center justify-between rounded-lg border border-accent-green/20 bg-accent-green/5 px-3 py-1.5">
                  <span className="text-[11px] text-slate-300">{o.opp}</span>
                  <span className="text-[9px] font-bold text-accent-green">{o.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Architecture Flow */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-navy-900/30 p-8">
          <h3 className="text-center text-sm font-bold text-slate-200 mb-6">{t("ai360.pipelineTitle")}</h3>
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            {[
              { step: "I", label: t("ai360.pipe1Label"), desc: t("ai360.pipe1Desc"), icon: "\uD83D\uDCDD", color: "border-electric-500/30 bg-electric-500/5" },
              { step: "II", label: t("ai360.pipe2Label"), desc: t("ai360.pipe2Desc"), icon: "\uD83E\uDDE0", color: "border-purple-500/30 bg-purple-500/5" },
              { step: "III", label: t("ai360.pipe3Label"), desc: t("ai360.pipe3Desc"), icon: "\uD83D\uDCC8", color: "border-amber-500/30 bg-amber-500/5" },
              { step: "IV", label: t("ai360.pipe4Label"), desc: t("ai360.pipe4Desc"), icon: "\uD83C\uDFC6", color: "border-accent-green/30 bg-accent-green/5" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <div className={`flex flex-col items-center rounded-xl border ${s.color} p-4 w-40 text-center`}>
                  <span className="text-2xl">{s.icon}</span>
                  <span className="mt-2 text-[9px] font-bold text-slate-500">{s.step}</span>
                  <p className="text-xs font-bold text-slate-200">{s.label}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{s.desc}</p>
                </div>
                {i < 3 && <span className="hidden text-2xl text-slate-600 md:block">&rarr;</span>}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-500 italic">
          {t("ai360.sampleNote")}
        </p>
      </section>

      {/* Network Deployment — Key Differentiator */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-electric-500/20 bg-gradient-to-br from-electric-500/5 via-navy-900/50 to-transparent p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            {t("ai360.networkTitle")} <span className="text-electric-400">{t("ai360.networkTitleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            {t("ai360.networkSubtitle")}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: "\uD83D\uDC65", title: t("ai360.netStakeholderTitle"), desc: t("ai360.netStakeholderDesc") },
              { icon: "\uD83C\uDFE2", title: t("ai360.netDepartmentTitle"), desc: t("ai360.netDepartmentDesc") },
              { icon: "\uD83C\uDF0D", title: t("ai360.netRegionTitle"), desc: t("ai360.netRegionDesc") },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5 text-center">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-slate-200">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-electric-400 font-medium">
            {t("ai360.networkResult")}
          </p>
        </div>
      </section>

      {/* Security & Data Privacy */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-2xl border border-accent-green/20 bg-gradient-to-br from-accent-green/5 via-navy-900/50 to-transparent p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            {t("ai360.securityTitle")} <span className="text-accent-green">{t("ai360.securityTitleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            {t("ai360.securitySubtitle")}
          </p>

          {/* Security Pillars */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-center">
              <span className="text-2xl">&#128274;</span>
              <h3 className="mt-2 text-sm font-bold text-accent-green">{t("ai360.pillarEncryption")}</h3>
              <p className="mt-1 text-xs text-slate-400">{t("ai360.pillarEncryptionDesc")}</p>
            </div>
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-center">
              <span className="text-2xl">&#127970;</span>
              <h3 className="mt-2 text-sm font-bold text-accent-green">{t("ai360.pillarBoundary")}</h3>
              <p className="mt-1 text-xs text-slate-400">{t("ai360.pillarBoundaryDesc")}</p>
            </div>
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-center">
              <span className="text-2xl">&#128737;</span>
              <h3 className="mt-2 text-sm font-bold text-accent-green">{t("ai360.pillarZeroTrust")}</h3>
              <p className="mt-1 text-xs text-slate-400">{t("ai360.pillarZeroTrustDesc")}</p>
            </div>
          </div>

          {/* Detailed Security Features */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Data Minimization */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <h4 className="text-sm font-bold text-slate-200">{t("ai360.minimizationTitle")}</h4>
              <p className="mt-2 text-xs text-slate-400">
                {t("ai360.minimizationBody")}
              </p>
              <div className="mt-4 flex gap-4">
                <div className="rounded-lg bg-electric-500/10 px-4 py-3 text-center flex-1">
                  <p className="text-lg font-bold text-electric-400">60</p>
                  <p className="text-[9px] text-slate-400">{t("ai360.structuredQuestions")}</p>
                  <p className="text-[8px] text-slate-500">{t("ai360.metadataOnly")}</p>
                </div>
                <div className="rounded-lg bg-slate-800/50 px-4 py-3 text-center flex-1">
                  <p className="text-lg font-bold text-slate-400">0</p>
                  <p className="text-[9px] text-slate-400">{t("ai360.rawDataIngested")}</p>
                  <p className="text-[8px] text-slate-500">{t("ai360.payloadsDiscarded")}</p>
                </div>
              </div>
            </div>

            {/* Privacy Compliance */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <h4 className="text-sm font-bold text-slate-200">{t("ai360.boundaryComplianceTitle")}</h4>
              <p className="mt-2 text-xs text-slate-400">
                {t("ai360.boundaryComplianceBody")}
              </p>
              <div className="mt-4 space-y-2">
                {[
                  { region: "\uD83C\uDDFA\uD83C\uDDF8 " + t("ai360.regionNA"), status: t("ai360.compliant") },
                  { region: "\uD83C\uDDF2\uD83C\uDDFD " + t("ai360.regionLATAM"), status: t("ai360.compliant") },
                  { region: "\uD83C\uDDEC\uD83C\uDDE6 " + t("ai360.regionCEMAC"), status: t("ai360.compliant") },
                ].map((r) => (
                  <div key={r.region} className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-900/30 px-3 py-2">
                    <span className="text-xs text-slate-300">{r.region}</span>
                    <span className="text-[10px] font-bold text-accent-green">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scanning Architecture */}
          <div className="mt-8 rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
            <h4 className="text-sm font-bold text-slate-200 mb-3">{t("ai360.scanArchTitle")}</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-green" />
                  <span className="text-xs font-bold text-accent-green">{t("ai360.passiveTitle")}</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  {t("ai360.passiveDesc")}
                </p>
              </div>
              <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  <span className="text-xs font-bold text-slate-400">{t("ai360.activeTitle")}</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  {t("ai360.activeDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              t("ai360.badge1"), t("ai360.badge2"), t("ai360.badge3"), t("ai360.badge4"),
              t("ai360.badge5"), t("ai360.badge6"), t("ai360.badge7"), t("ai360.badge8"),
            ].map((badge) => (
              <span key={badge} className="rounded-full border border-accent-green/30 bg-accent-green/5 px-3 py-1 text-[10px] font-medium text-accent-green">
                {badge}
              </span>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-accent-green">
            &ldquo;{t("ai360.securityQuote")}&rdquo;
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("ai360.deliverablesTitle")} <span className="text-electric-400">{t("ai360.deliverablesTitleHighlight")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("ai360.deliverablesSubtitle")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((d) => (
            <div key={d.name} className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
              <span className="text-2xl">{d.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-electric-400">{d.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{d.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery + Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <span className="text-3xl">\u23F1\uFE0F</span>
            <h3 className="mt-4 text-2xl font-bold">{t("ai360.deliveryTitle")}</h3>
            <p className="mt-2 text-slate-400">
              {t("ai360.deliveryDesc")}
            </p>
            <div className="mt-6 space-y-4">
              {[
                { phase: "Phase 1", label: t("ai360.phase1Label"), days: t("ai360.phase1Days") },
                { phase: "Phase 2", label: t("ai360.phase2Label"), days: t("ai360.phase2Days") },
                { phase: "Phase 3", label: t("ai360.phase3Label"), days: t("ai360.phase3Days") },
                { phase: "Phase 4", label: t("ai360.phase4Label"), days: t("ai360.phase4Days") },
                { phase: "Phase 5", label: t("ai360.phase5Label"), days: t("ai360.phase5Days") },
              ].map((p) => (
                <div key={p.phase} className="flex items-center gap-4">
                  <span className="min-w-[80px] rounded-lg bg-electric-500/10 px-3 py-1 text-center text-xs font-bold text-electric-400">
                    {p.days}
                  </span>
                  <span className="text-sm text-slate-300">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
            <span className="text-3xl">\uD83D\uDCB0</span>
            <h3 className="mt-4 text-2xl font-bold">{t("ai360.pricingTitle")}</h3>
            <p className="mt-2 text-slate-400">
              {t("ai360.pricingDesc")}
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">{t("ai360.pricingSMB")}</p>
                <p className="text-3xl font-bold text-electric-400">{t("ai360.pricingSMBPrice")}</p>
                <p className="text-sm text-slate-400">{t("ai360.pricingSMBDetail")}</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">{t("ai360.pricingEnterprise")}</p>
                <p className="text-3xl font-bold text-electric-400">{t("ai360.pricingEnterprisePrice")}</p>
                <p className="text-sm text-slate-400">{t("ai360.pricingEnterpriseDetail")}</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="mt-6 block rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-electric-600"
            >
              {t("ai360.viewPricing")}
            </Link>
          </div>
        </div>
      </section>

      {/* Strategic Positioning */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            {t("ai360.positionTitle")}
          </h2>
          <h3 className="mt-2 text-xl font-bold text-electric-400 md:text-2xl">
            {t("ai360.positionSubtitle")}
          </h3>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-400">{t("ai360.whatItIsNot")}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                <li>&#10005; {t("ai360.notItem1")}</li>
                <li>&#10005; {t("ai360.notItem2")}</li>
                <li>&#10005; {t("ai360.notItem3")}</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent-green">{t("ai360.whatItIs")}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>&#10003; {t("ai360.isItem1")}</li>
                <li>&#10003; {t("ai360.isItem2")}</li>
                <li>&#10003; {t("ai360.isItem3")}</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-electric-400">{t("ai360.whatItEnables")}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>&#10003; {t("ai360.enablesItem1")}</li>
                <li>&#10003; {t("ai360.enablesItem2")}</li>
                <li>&#10003; {t("ai360.enablesItem3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("ai360.faqTitle")} <span className="text-electric-400">{t("ai360.faqTitleHighlight")}</span>
        </h2>
        <div className="mt-12 space-y-6">
          {[
            { q: t("ai360.faq1Q"), a: t("ai360.faq1A") },
            { q: t("ai360.faq2Q"), a: t("ai360.faq2A") },
            { q: t("ai360.faq3Q"), a: t("ai360.faq3A") },
            { q: t("ai360.faq4Q"), a: t("ai360.faq4A") },
            { q: t("ai360.faq5Q"), a: t("ai360.faq5A") },
          ].map((faq) => (
            <div key={faq.q} className="rounded-xl border border-slate-800 bg-navy-900/30 p-6">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t("ai360.finalCtaTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          {t("ai360.finalCtaSubtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="glow-blue rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            {t("ai360.ctaRequest")}
          </Link>
          <Link
            href="/assess"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            {t("ai360.ctaFreeScoreShort")}
          </Link>
        </div>
      </section>
    </div>
  );
}
