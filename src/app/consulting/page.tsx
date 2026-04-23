"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export default function ConsultingPage() {
  const { t } = useI18n();

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-600/30 bg-slate-600/10 px-4 py-1.5 text-sm text-slate-400">
            {t("consulting.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("consulting.pageTitle")}{" "}
            <span className="text-electric-400">{t("consulting.pageTitleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("consulting.pageSubtitle")}
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
              {t("consulting.ai360Title")}&trade;
            </h2>
            <p className="mt-1 text-xs font-semibold text-electric-400">
              {t("consulting.ai360Subtitle")}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {t("consulting.ai360Desc")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                t("consulting.ai360Badge1"),
                t("consulting.ai360Badge2"),
                t("consulting.ai360Badge3"),
                t("consulting.ai360Badge4"),
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
              {t("consulting.learnMore")} &rarr;
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
              {t("consulting.transformTitle")}
            </h2>
            <p className="mt-1 text-xs font-semibold text-accent-green">
              {t("consulting.transformSubtitle")}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {t("consulting.transformDesc")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                t("consulting.transformBadge1"),
                t("consulting.transformBadge2"),
                t("consulting.transformBadge3"),
                t("consulting.transformBadge4"),
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
              {t("consulting.learnMore")} &rarr;
            </div>
          </Link>

          {/* AEGIS */}
          <Link
            href="/consulting/aegis"
            className="group rounded-2xl border border-slate-800 bg-navy-900/50 p-8 transition-all hover:border-accent-amber/40 hover:bg-navy-800/50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-amber/10 text-2xl">
              &#9881;
            </div>
            <h2 className="mt-5 text-xl font-bold group-hover:text-accent-amber">
              {t("consulting.aegisTitle")}
            </h2>
            <p className="mt-1 text-xs font-semibold text-accent-amber">
              {t("consulting.aegisSubtitle")}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {t("consulting.aegisDesc")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                t("consulting.aegisBadge1"),
                t("consulting.aegisBadge2"),
                t("consulting.aegisBadge3"),
                t("consulting.aegisBadge4"),
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
              {t("consulting.learnMore")} &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* The Pedigree */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            {t("consulting.pedigreeTitle")} <span className="text-electric-400">{t("consulting.pedigreeTitleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-slate-400">
            {t("consulting.pedigreeSubtitle")}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "\u{1F3E2}", label: t("consulting.pedigree1Label"), detail: t("consulting.pedigree1Detail") },
              { icon: "\u{1F30D}", label: t("consulting.pedigree2Label"), detail: t("consulting.pedigree2Detail") },
              { icon: "\u{1F4F0}", label: t("consulting.pedigree3Label"), detail: t("consulting.pedigree3Detail") },
              { icon: "\u{1F3C6}", label: t("consulting.pedigree4Label"), detail: t("consulting.pedigree4Detail") },
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
          {t("consulting.ctaTitle")}{" "}
          <span className="text-electric-400">{t("consulting.ctaTitleHighlight")}</span>?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          {t("consulting.ctaSubtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            {t("consulting.ctaPricing")}
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            {t("consulting.ctaAbout")}
          </Link>
        </div>
      </section>
    </div>
  );
}
