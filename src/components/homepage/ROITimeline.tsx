"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/i18n";

/**
 * ROITimeline — Animated savings curve showing break-even and 36-month ROI.
 * Visualizes Cloud cost vs TechFides cost over time.
 */

export function ROITimeline() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Gold tier example: $10K setup, $1K/mo vs $3K/mo cloud
  const cloudMonthly = 3000;
  const tfSetup = 10000;
  const tfMonthly = 1000;
  const months = 36;
  const breakEven = Math.ceil(tfSetup / (cloudMonthly - tfMonthly)); // 5 months

  const milestones = [
    { month: 0, label: t("roi.day1"), detail: t("roi.day1Detail"), icon: "\uD83D\uDE80" },
    { month: breakEven, label: `Month ${breakEven}`, detail: t("roi.breakEvenLabel"), icon: "\u2705" },
    { month: 12, label: t("roi.year1"), detail: `$${((cloudMonthly - tfMonthly) * 12 - tfSetup).toLocaleString()} ${t("roi.netSavings")}`, icon: "\uD83D\uDCB0" },
    { month: 24, label: t("roi.year2"), detail: `$${((cloudMonthly - tfMonthly) * 24 - tfSetup).toLocaleString()} ${t("roi.cumulativeSavings")}`, icon: "\uD83D\uDCC8" },
    { month: 36, label: t("roi.year3"), detail: `$${((cloudMonthly - tfMonthly) * 36 - tfSetup).toLocaleString()} ${t("roi.totalSavings")}`, icon: "\uD83C\uDFC6" },
  ];

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="text-center text-3xl font-bold md:text-4xl">
        {t("roi.title")} <span className="text-electric-400">{t("roi.titleHighlight")}</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
        {t("roi.subtitle").replace("{months}", String(breakEven)).replace("${savings}", ((cloudMonthly - tfMonthly) * 36 - tfSetup).toLocaleString())}
      </p>

      {/* Cost comparison bars */}
      <div className="mt-12 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">{t("roi.cloudAi36")}</span>
            <span className="text-sm font-bold text-red-400">${(cloudMonthly * months).toLocaleString()}</span>
          </div>
          <div className="h-6 overflow-hidden rounded-full bg-red-500/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1500 ease-out"
              style={{ width: visible ? "100%" : "0%" }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">{t("roi.techfides36")}</span>
            <span className="text-sm font-bold text-accent-green">${(tfMonthly * months + tfSetup).toLocaleString()}</span>
          </div>
          <div className="h-6 overflow-hidden rounded-full bg-accent-green/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-1500 ease-out"
              style={{
                width: visible ? `${((tfMonthly * months + tfSetup) / (cloudMonthly * months)) * 100}%` : "0%",
                transitionDelay: "300ms",
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-electric-500/30" />
          <span className="rounded-full bg-electric-500/10 px-4 py-1.5 text-sm font-bold text-electric-400">
            {t("roi.youSave")} ${((cloudMonthly - tfMonthly) * months - tfSetup).toLocaleString()}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-electric-500/30" />
        </div>
      </div>

      {/* Timeline milestones */}
      <div className="mt-16 relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-electric-500 via-accent-green to-accent-green/30 md:left-1/2 md:-translate-x-px" />

        <div className="space-y-8">
          {milestones.map((m, i) => (
            <div
              key={m.month}
              className={`relative flex items-start gap-4 md:gap-8 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.6s ease-out ${i * 200 + 500}ms`,
              }}
            >
              {/* Dot */}
              <div className="absolute left-6 -translate-x-1/2 md:left-1/2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-electric-500 bg-slate-950 text-lg">
                  {m.icon}
                </div>
              </div>

              {/* Content */}
              <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"}`}>
                <p className="text-sm font-bold text-electric-400">{m.label}</p>
                <p className="mt-1 text-sm text-slate-300">{m.detail}</p>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-[calc(50%-2rem)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
