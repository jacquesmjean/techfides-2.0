"use client";

import { useState, useEffect } from "react";

/**
 * CloudTaxCounter — Real-time animated counter showing money draining
 * to cloud AI subscriptions since the user loaded the page.
 *
 * Based on the average SMB cloud AI spend of $5,000/mo ≈ $0.11/second.
 */
export function CloudTaxCounter() {
  const [elapsed, setElapsed] = useState(0);
  const ratePerSecond = 5000 / (30 * 24 * 60 * 60); // $5K/mo in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const leaked = (elapsed * ratePerSecond).toFixed(2);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/5 via-red-500/10 to-transparent p-8 md:p-12">
        {/* Animated background pulse */}
        <div className="absolute inset-0 animate-pulse opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
        </div>

        <div className="relative text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400/80">
            Since you loaded this page
          </p>

          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold text-red-400 md:text-7xl tabular-nums">
              ${leaked}
            </span>
          </div>

          <p className="mt-3 text-lg text-slate-300">
            leaked to the cloud by the average SMB
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:grid-cols-3">
            <CounterStat value="$60K" label="Average yearly cloud AI spend" color="text-red-400" />
            <CounterStat value="$0" label="You own at the end" color="text-red-400" />
            <CounterStat value="100%" label="Data sent to third parties" color="text-red-400" />
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/30" />
            <span className="text-sm font-medium text-slate-400">vs with TechFides</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-green/30" />
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-4 md:grid-cols-3">
            <CounterStat value="$500" label="Predictable monthly retainer" color="text-accent-green" />
            <CounterStat value="Forever" label="You own the hardware" color="text-accent-green" />
            <CounterStat value="0%" label="Data leaves your building" color="text-accent-green" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CounterStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-800/50 bg-slate-950/50 px-4 py-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
