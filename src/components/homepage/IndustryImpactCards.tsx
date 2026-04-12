"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/**
 * IndustryImpactCards — Animated stat rings per vertical showing
 * specific productivity improvements.
 */

const industries = [
  {
    name: "Legal",
    href: "/solutions/legal",
    icon: "\u2696\uFE0F",
    stat: 90,
    unit: "min",
    label: "saved per attorney per day",
    description: "AI-powered document review, case research, and contract analysis",
    color: "#38bdf8",
  },
  {
    name: "Medical",
    href: "/solutions/medical",
    icon: "\uD83C\uDFE5",
    stat: 40,
    unit: "%",
    label: "faster clinical documentation",
    description: "HIPAA-aligned AI for patient notes, coding, and pre-auth",
    color: "#22c55e",
  },
  {
    name: "Auto",
    href: "/solutions/auto",
    icon: "\uD83D\uDE97",
    stat: 82,
    unit: "%",
    label: "reduction in cloud AI costs",
    description: "Diagnostics, inventory management, and customer service AI",
    color: "#f59e0b",
  },
  {
    name: "Trades",
    href: "/solutions/trades",
    icon: "\uD83D\uDD27",
    stat: 3,
    unit: "x",
    label: "faster estimating speed",
    description: "AI-powered estimating, scheduling, and operations intelligence",
    color: "#a78bfa",
  },
];

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
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        Real Impact. <span className="text-electric-400">Your Industry.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
        Sovereign AI deployments delivering measurable results across every vertical we serve.
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
                percent={ind.stat}
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
