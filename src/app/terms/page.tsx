"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export default function TermsOfServicePage() {
  const { t } = useI18n();

  // Sections 1..17 rendered from i18n keys terms.sectionNTitle / terms.sectionNBody
  const sectionNumbers = Array.from({ length: 17 }, (_, i) => i + 1);

  return (
    <div className="grid-pattern">
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <div className="mb-4 inline-flex items-center rounded-full border border-slate-600/30 bg-slate-600/10 px-4 py-1.5 text-sm text-slate-400">
          {t("terms.badge")}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          {t("terms.title")} <span className="text-electric-400">{t("terms.titleHighlight")}</span>
        </h1>
        <p className="mt-4 text-sm text-slate-400">
          {t("terms.effectiveDate")} &middot; {t("terms.lastUpdated")}
        </p>

        <div className="mt-12 space-y-10 text-slate-300">
          {sectionNumbers.map((n) => (
            <div key={n}>
              <h2 className="text-xl font-bold text-white">
                {t(`terms.section${n}Title`)}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {t(`terms.section${n}Body`)}
              </p>
              {n === 17 && (
                <div className="mt-4 rounded-xl border border-slate-800 bg-navy-900/50 p-6">
                  <p className="text-sm font-semibold text-white">TechFides LLC</p>
                  <p className="mt-1 text-sm text-slate-400">Frisco, Texas, USA</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Email:{" "}
                    <a
                      href="mailto:legal@techfides.com"
                      className="text-electric-400 hover:text-electric-300"
                    >
                      legal@techfides.com
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8">
          <Link
            href="/"
            className="text-sm text-electric-400 hover:text-electric-300"
          >
            &larr; {t("terms.backToHome")}
          </Link>
        </div>
      </section>
    </div>
  );
}
