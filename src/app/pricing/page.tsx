"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const tiers = [
  {
    name: "Silver",
    target: "Solo / Boutique",
    employees: "1-10 employees",
    setup: 5000,
    monthly: 500,
    hardwareEstimate: "$1,500 – $3,000",
    plusPricing: false,
    idealCloudMin: 750,
    features: [
      "Single workstation or small server deployment",
      "1 AI model (Llama 3, Mistral, or equivalent)",
      "Basic fine-tuning on your data",
      "Email support (next business day)",
      "Monthly model updates",
      "Up to 5 users",
    ],
  },
  {
    name: "Gold",
    target: "Single-Site Mid",
    employees: "10-50 employees",
    setup: 10000,
    monthly: 1000,
    hardwareEstimate: "$5,000 – $12,000",
    plusPricing: false,
    idealCloudMin: 1500,
    featured: true,
    features: [
      "Dedicated server rack deployment",
      "2-3 AI models running simultaneously",
      "Advanced fine-tuning + RAG pipeline",
      "Priority support (same day)",
      "Bi-weekly model updates",
      "Up to 25 users",
      "API access for custom integrations",
      "Compliance audit trail & logging",
    ],
  },
  {
    name: "Platinum",
    target: "Multi-Site / Enterprise",
    employees: "50+ employees",
    setup: 15000,
    monthly: 2500,
    hardwareEstimate: "$15,000 – $40,000+",
    plusPricing: true,
    idealCloudMin: 4000,
    features: [
      "Multi-server / multi-site deployment",
      "Unlimited AI models",
      "Custom model training on your full dataset",
      "Dedicated support engineer",
      "Weekly model updates + on-demand",
      "Unlimited users",
      "Full API + webhook integrations",
      "Compliance dashboard + SOC 2 prep",
      "Disaster recovery & redundancy",
      "Quarterly strategy review",
    ],
  },
];

function getRecommendedTier(cloudSpend: number): number {
  if (cloudSpend >= 4000) return 2; // Platinum
  if (cloudSpend >= 1500) return 1; // Gold
  return 0; // Silver
}

const tierColors: Record<string, { ring: string; bg: string; text: string; badge: string }> = {
  Silver: {
    ring: "border-slate-400/50",
    bg: "bg-slate-400/5",
    text: "text-slate-300",
    badge: "bg-slate-400",
  },
  Gold: {
    ring: "border-amber-400/50",
    bg: "bg-amber-400/5",
    text: "text-amber-400",
    badge: "bg-amber-500",
  },
  Platinum: {
    ring: "border-electric-400/50",
    bg: "bg-electric-400/5",
    text: "text-electric-400",
    badge: "bg-electric-500",
  },
};

export default function PricingPage() {
  const searchParams = useSearchParams();
  const initialTier = Number(searchParams.get("tier") ?? 1);
  const [cloudSpend, setCloudSpend] = useState(3000);
  const [selectedTier, setSelectedTier] = useState(
    initialTier >= 0 && initialTier <= 2 ? initialTier : 1
  );

  const recommended = getRecommendedTier(cloudSpend);
  const tier = tiers[selectedTier];
  const monthlyCloudCost = cloudSpend;
  const monthlyTechFides = tier.monthly;
  const monthlySavings = monthlyCloudCost - monthlyTechFides;
  const savings36 = monthlySavings * 36 - tier.setup;
  const breakEvenMonths =
    monthlySavings > 0
      ? Math.ceil(tier.setup / monthlySavings)
      : Infinity;

  const isBadMatch = cloudSpend < tier.idealCloudMin;

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Transparent{" "}
            <span className="text-electric-400">Pricing</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            No &ldquo;Call for Quote.&rdquo; No hidden fees. Enterprise-grade AI
            infrastructure with pricing that respects your intelligence.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => {
            const colors = tierColors[t.name];
            const isRecommended = i === recommended;
            return (
              <div
                key={t.name}
                className={`relative rounded-2xl border p-8 transition-all ${
                  t.featured
                    ? `${colors.ring} ${colors.bg} shadow-lg shadow-electric-500/10`
                    : "border-slate-800 bg-navy-900/50"
                }`}
              >
                {t.featured && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full ${colors.badge} px-4 py-1 text-xs font-bold text-white`}>
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-bold ${colors.text}`}>{t.name}</h3>
                  {isRecommended && (
                    <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-green">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">{t.target}</p>
                <p className="text-xs text-slate-400">{t.employees}</p>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Setup (SOW)
                  </p>
                  <p className="text-3xl font-bold">
                    ${t.setup.toLocaleString()}
                    {t.plusPricing && <span className="text-lg">+</span>}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Monthly Retainer
                  </p>
                  <p className="text-3xl font-bold">
                    ${t.monthly.toLocaleString()}
                    {t.plusPricing && <span className="text-lg">+</span>}
                  </p>
                </div>

                <div className="mt-4 rounded-lg bg-accent-green/10 px-3 py-2 text-center text-sm font-bold text-accent-green">
                  Installation: $0
                </div>

                <div className="mt-3 rounded-lg bg-slate-800/50 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Est. Hardware</p>
                  <p className="text-sm font-semibold text-slate-300">{t.hardwareEstimate}</p>
                </div>

                <ul className="mt-6 space-y-2">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="mt-0.5 text-accent-green">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedTier(i)}
                  className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
                    selectedTier === i
                      ? `${colors.badge} text-white shadow-lg`
                      : "border border-slate-700 text-slate-300 hover:border-electric-500/50 hover:text-white"
                  }`}
                >
                  {selectedTier === i ? "Selected for Calculator ✓" : "Select for Calculator"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-2xl border border-electric-500/30 bg-navy-900/50 p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            Cloud Savings{" "}
            <span className="text-electric-400">Calculator</span>
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-slate-400">
            See how much you&apos;ll save over 36 months by switching from cloud
            AI subscriptions to the TechFides Local Stack.
          </p>

          {/* Cloud Spend Slider — FIRST so it drives tier recommendation */}
          <div className="mt-10">
            <label className="block text-sm font-medium text-slate-300">
              Your current monthly cloud AI spend
            </label>
            <div className="mt-2 flex items-center gap-4">
              <input
                type="range"
                min={750}
                max={15000}
                step={250}
                value={cloudSpend}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCloudSpend(val);
                  setSelectedTier(getRecommendedTier(val));
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-electric-500"
              />
              <span className="min-w-[100px] text-right text-2xl font-bold text-electric-400">
                ${cloudSpend.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>$750/mo</span>
              <span>$15,000/mo</span>
            </div>
          </div>

          {/* Tier Selector */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select your TechFides tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tiers.map((t, i) => {
                const colors = tierColors[t.name];
                const isRecommended = i === recommended;
                return (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTier(i)}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      selectedTier === i
                        ? `${colors.ring} ${colors.bg} shadow-lg`
                        : "border-slate-700 bg-slate-950/50 hover:border-slate-600"
                    }`}
                  >
                    {selectedTier === i && (
                      <div className={`absolute -top-2 -right-2 h-5 w-5 rounded-full ${colors.badge} flex items-center justify-center text-[10px] font-bold text-white`}>✓</div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <p className={`text-sm font-bold ${selectedTier === i ? colors.text : "text-slate-200"}`}>{t.name}</p>
                      {isRecommended && (
                        <span className="rounded bg-accent-green/20 px-1 py-0.5 text-[9px] font-bold text-accent-green">
                          REC
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{t.target}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800">
                      <p className="text-xs text-slate-400">Setup</p>
                      <p className="text-sm font-semibold text-slate-200">${t.setup.toLocaleString()}{t.plusPricing && "+"}</p>
                      <p className="text-xs text-slate-400 mt-1">Monthly</p>
                      <p className="text-sm font-semibold text-slate-200">${t.monthly.toLocaleString()}{t.plusPricing && "+"}/mo</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mismatch warning */}
          {isBadMatch && (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
              <span className="text-amber-400 text-lg leading-none mt-0.5">⚠</span>
              <div>
                <p className="text-sm font-semibold text-amber-400">
                  This tier may not be the best fit
                </p>
                <p className="mt-0.5 text-xs text-amber-400/80">
                  At ${cloudSpend.toLocaleString()}/mo cloud spend, the{" "}
                  <strong>{tiers[recommended].name}</strong> tier typically offers a better ROI.{" "}
                  <button
                    onClick={() => setSelectedTier(recommended)}
                    className="underline hover:text-amber-300 font-semibold"
                  >
                    Switch to {tiers[recommended].name} →
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Comparison Summary */}
          <div className="mt-6 rounded-xl border border-electric-500/20 bg-slate-950/50 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Comparing
              </p>
              <p className="text-sm text-slate-300 mt-1">
                <span className="text-red-400 font-semibold">${cloudSpend.toLocaleString()}/mo</span> cloud spend vs{" "}
                <span className={`font-semibold ${tierColors[tier.name].text}`}>{tier.name}</span>{" "}
                <span className="text-slate-400">({tier.target})</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">TechFides cost</p>
              <p className="text-sm font-semibold text-slate-200">${tier.monthly.toLocaleString()}/mo + ${tier.setup.toLocaleString()} setup</p>
            </div>
          </div>

          {/* Results */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Monthly Savings
              </p>
              <p
                className={`mt-2 text-3xl font-bold ${
                  monthlySavings > 0 ? "text-accent-green" : "text-red-400"
                }`}
              >
                {monthlySavings > 0 ? "+" : ""}$
                {Math.abs(monthlySavings).toLocaleString()}
              </p>
              {monthlySavings <= 0 && (
                <p className="mt-1 text-[10px] text-red-400/70">Consider a lower tier</p>
              )}
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                36-Month Net Savings
              </p>
              <p
                className={`mt-2 text-3xl font-bold ${
                  savings36 > 0 ? "text-accent-green" : "text-red-400"
                }`}
              >
                {savings36 > 0 ? "+" : "-"}${Math.abs(savings36).toLocaleString()}
              </p>
              <p className="mt-1 text-[10px] text-slate-400">Includes setup fee</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Break-Even
              </p>
              <p className={`mt-2 text-3xl font-bold ${breakEvenMonths <= 12 ? "text-accent-green" : breakEvenMonths <= 24 ? "text-electric-400" : "text-amber-400"}`}>
                {breakEvenMonths === Infinity
                  ? "N/A"
                  : `${breakEvenMonths} mo`}
              </p>
              {breakEvenMonths !== Infinity && breakEvenMonths <= 36 && (
                <p className="mt-1 text-[10px] text-slate-400">
                  {breakEvenMonths <= 6 ? "Excellent ROI" : breakEvenMonths <= 12 ? "Strong ROI" : breakEvenMonths <= 24 ? "Good ROI" : "Long payback"}
                </p>
              )}
              {(breakEvenMonths === Infinity || breakEvenMonths > 36) && (
                <p className="mt-1 text-[10px] text-red-400/70">Not cost-effective at this spend</p>
              )}
            </div>
          </div>

          {/* Savings bar visual */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Cloud AI (36 months)</span>
              <span className="font-semibold text-red-400">
                ${(monthlyCloudCost * 36).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-red-500/20">
              <div className="h-full rounded-full bg-red-500" style={{ width: "100%" }} />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">TechFides (36 months, incl. setup + est. hardware)</span>
              <span className="font-semibold text-accent-green">
                ${(monthlyTechFides * 36 + tier.setup).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-accent-green/20">
              <div
                className="h-full rounded-full bg-accent-green"
                style={{
                  width: `${Math.min(
                    100,
                    ((monthlyTechFides * 36 + tier.setup) /
                      (monthlyCloudCost * 36)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            * Calculations based on your inputs. Hardware costs are purchased by you separately (estimated ranges shown above).
            Actual savings depend on deployment scope and usage. Setup fee is one-time.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Frequently Asked <span className="text-electric-400">Questions</span>
        </h2>
        <div className="mt-12 space-y-6">
          {[
            {
              q: "What does the $0 installation cover?",
              a: "We handle all physical hardware installation, network configuration, and initial software deployment at no additional cost. The Setup (SOW) fee covers the discovery, design, customization, and fine-tuning work specific to your business.",
            },
            {
              q: "Do I own the hardware?",
              a: "Yes. The hardware is purchased by you (or we can source it on your behalf at cost). You own it outright. If you ever cancel TechFides service, the hardware remains yours.",
            },
            {
              q: "How much does the hardware cost?",
              a: "Hardware costs depend on your tier. Silver deployments typically run $1,500–$3,000 for a single workstation or mini server. Gold deployments use dedicated server hardware in the $5,000–$12,000 range. Platinum multi-site setups start around $15,000. We'll spec the exact hardware during your free assessment.",
            },
            {
              q: "What's included in the monthly retainer?",
              a: "Ongoing monitoring, model updates, performance optimization, technical support, and scaling adjustments. Think of it as a managed service for your AI infrastructure.",
            },
            {
              q: "Can I switch AI models later?",
              a: "Absolutely. The TechFides Agnostic Engine supports Llama 3, Mistral, Phi, and other open models. You can swap or run multiple models simultaneously as your needs evolve.",
            },
            {
              q: "What if I need more capacity later?",
              a: "We scale with you. Adding users, models, or hardware is handled through your monthly retainer relationship. No surprise fees — we'll scope any expansion before you commit.",
            },
            {
              q: "Is there a contract term?",
              a: "We recommend a 12-month initial term to fully realize ROI, but we offer month-to-month after the initial period. We earn your business every month.",
            },
            {
              q: "Which tier is right for me?",
              a: "Use the calculator above — enter your current cloud AI spend and we'll recommend the best tier. Generally: Silver for solo/boutique practices spending $750–$1,500/mo on cloud AI, Gold for mid-size firms spending $1,500–$4,000/mo, and Platinum for enterprises spending $4,000+/mo.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-slate-800 bg-navy-900/30 p-6"
            >
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">Ready to Stop Paying the Cloud Tax?</h2>
        <p className="mt-4 text-lg text-slate-400">
          Get a custom assessment for your business. We&apos;ll map your current
          AI spend and show you exactly what sovereignty looks like.
        </p>
        <Link
          href="/contact"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          Get Your Free Assessment
        </Link>
      </section>
    </div>
  );
}
