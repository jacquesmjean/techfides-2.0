"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";

/**
 * IndustryImpactCards — Animated stat rings per vertical showing
 * specific productivity improvements.
 */

function AnimatedRing({
  percent,
  color,
  visible,
  delay,
}: {
  percent: number;
  color: string;
  visible: boolean;
  delay: number;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="100" height="100" className="mx-auto">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="6"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={visible ? offset : circumference}
        transform="rotate(-90 50 50)"
        style={{
          transition: `stroke-dashoffset 1.5s ease-out ${delay}ms`,
        }}
      />
    </svg>
  );
}

export function IndustryImpactCards() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const industries = [
    {
      name: t("verticals.legal"),
      href: "/solutions/legal",
      icon: "\u2696\uFE0F",
      stat: 100,
      unit: "%",
      label: "on-premise for privileged work",
      description: "Document review, case research, and contract analysis \u2014 all on your firm's hardware",
      color: "#38bdf8",
    },
    {
      name: t("verticals.medical"),
      href: "/solutions/medical",
      icon: "\uD83C\uDFE5",
      stat: 100,
      unit: "%",
      label: "HIPAA-aligned deployment",
      description: "Clinical documentation, coding, and pre-auth \u2014 on-premise AI that keeps PHI in the building",
      color: "#22c55e",
    },
    {
      name: t("verticals.auto"),
      href: "/solutions/auto",
      icon: "\uD83D\uDE97",
      stat: 100,
      unit: "%",
      label: "customer data stays on your lot",
      description: "Deal desk, inventory, and service workflows \u2014 all processed on your dealership's hardware",
      color: "#f59e0b",
    },
    {
      name: t("verticals.trades"),
      href: "/solutions/trades",
      icon: "\uD83D\uDD27",
      stat: 24,
      unit: "/7",
      label: "works on the job site, internet or not",
      description: "Estimating, scheduling, and project docs \u2014 runs offline when cell service drops",
      color: "#a78bfa",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-center text-3xl font-bold md:text-4xl">
        {t("impact.title")} <span className="text-electric-400">{t("impact.titleHighlight")}</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
        {t("impact.subtitle")}
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((ind, i) => (
          <Link
            key={ind.name}
            href={ind.href}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-navy-900/50 p-6 text-center transition-all hover:border-electric-500/40 hover:shadow-lg hover:shadow-electric-500/5"
          >
            <div className="relative">
              <AnimatedRing
                percent={100}
                color={ind.color}
                visible={visible}
                delay={i * 200}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">{ind.icon}</span>
              </div>
            </div>

            <div className="mt-4">
              <p
                className="text-3xl font-extrabold"
                style={{
                  color: ind.color,
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.6s ease-out ${i * 200 + 300}ms`,
                }}
              >
                {ind.stat}{ind.unit}
              </p>
              <p className="mt-1 text-xs text-slate-400">{ind.label}</p>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-200 group-hover:text-electric-400">
              {ind.name}
            </h3>
            <p className="mt-2 text-xs text-slate-400">{ind.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
