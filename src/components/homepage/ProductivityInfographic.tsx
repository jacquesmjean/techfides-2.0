"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/i18n";

/**
 * ProductivityInfographic — Visual split showing hours lost vs recovered.
 * Animated progress bars that fill on scroll into view.
 */

export function ProductivityInfographic() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const lostTasks = [
    { task: "Manual data entry & reports", hours: 4, icon: "\uD83D\uDCCB" },
    { task: "Waiting on AI vendor support", hours: 3, icon: "\u231B" },
    { task: "Compliance documentation", hours: 3, icon: "\uD83D\uDCC4" },
    { task: "Context-switching between tools", hours: 3, icon: "\uD83D\uDD04" },
    { task: "Fixing AI hallucinations", hours: 2, icon: "\u26A0\uFE0F" },
  ];

  const recoveredTasks = [
    { task: "AI automates data processing", hours: 4, icon: "\u26A1" },
    { task: "On-site support, instant response", hours: 3, icon: "\uD83D\uDE80" },
    { task: "Compliance built into the stack", hours: 3, icon: "\u2705" },
    { task: "One unified local AI platform", hours: 3, icon: "\uD83C\uDFAF" },
    { task: "Private models, your data", hours: 2, icon: "\uD83D\uDEE1\uFE0F" },
  ];

  const totalHours = lostTasks.reduce((s, t) => s + t.hours, 0);

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

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-center text-3xl font-bold md:text-4xl">
        <span className="text-red-400">{totalHours} {t("productivity.hoursLost")}</span> {t("productivity.everyWeek")}
        <br />
        <span className="text-accent-green">{totalHours} {t("productivity.hoursRecovered")}</span> {t("productivity.withTechFides")}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
        {t("productivity.subtitle").replace("{hours}", String(totalHours))}
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Lost Hours */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-bold text-red-400">{t("productivity.withoutTechFides")}</h3>
          </div>
          <div className="space-y-4">
            {lostTasks.map((task, i) => (
              <div key={task.task}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <span>{task.icon}</span>
                    {task.task}
                  </span>
                  <span className="text-sm font-bold text-red-400">{task.hours}h</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-red-500/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000 ease-out"
                    style={{
                      width: visible ? `${(task.hours / 5) * 100}%` : "0%",
                      transitionDelay: `${i * 150}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-red-400">{totalHours} {t("productivity.hrsWeekWasted")}</p>
            <p className="text-xs text-red-400/70">= {totalHours * 52} hours/year = ${(totalHours * 52 * 75).toLocaleString()} {t("productivity.lostProductivity")}</p>
          </div>
        </div>

        {/* Recovered Hours */}
        <div className="rounded-2xl border border-accent-green/20 bg-accent-green/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 rounded-full bg-accent-green" />
            <h3 className="text-lg font-bold text-accent-green">{t("productivity.withTechFides")}</h3>
          </div>
          <div className="space-y-4">
            {recoveredTasks.map((task, i) => (
              <div key={task.task}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <span>{task.icon}</span>
                    {task.task}
                  </span>
                  <span className="text-sm font-bold text-accent-green">{task.hours}{t("productivity.hSaved")}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-accent-green/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-1000 ease-out"
                    style={{
                      width: visible ? `${(task.hours / 5) * 100}%` : "0%",
                      transitionDelay: `${i * 150 + 400}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-accent-green/10 px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-accent-green">{totalHours} {t("productivity.hrsWeekRecovered")}</p>
            <p className="text-xs text-accent-green/70">= ${(totalHours * 52 * 75).toLocaleString()}{t("productivity.backOnBottomLine")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
