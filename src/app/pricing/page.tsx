"use client";

import { useState } from "react";
import Link from "next/link";

type BillingCycle = "monthly" | "annual";

const tiers = [
  {
    name: "Starter",
    monthly: 1299,
    annual: 12999,
    agentHours: 20,
    overageRate: 65,
    description: "For small practices and offices just bringing AI in-house.",
  },
  {
    name: "Growth",
    monthly: 2299,
    annual: 22999,
    agentHours: 40,
    overageRate: 60,
    description: "For mid-size firms running AI across multiple teams.",
    featured: true,
  },
  {
    name: "Scale",
    monthly: 3999,
    annual: 39999,
    agentHours: 80,
    overageRate: 55,
    description: "For growing organizations with heavier, production workloads.",
  },
  {
    name: "Enterprise",
    monthly: 6999,
    annual: 69999,
    agentHours: 160,
    overageRate: 50,
    description: "For enterprises running AI as core infrastructure.",
  },
] as const;

const included = [
  "Hardware (loaned)",
  "Deployment",
  "Monitoring",
  "Updates",
  "Support",
  "Unlimited users",
];

const addOns = [
  { label: "Custom fine-tuning on your data", price: "$750 / mo" },
  { label: "Compliance reporting pack (HIPAA / SOC 2 logs)", price: "$250 / mo" },
  { label: "Priority support (1-hour SLA)", price: "$500 / mo" },
  { label: "Additional deployment site", price: "Base tier × 0.75" },
  { label: "Model swap (e.g., Llama → Mistral)", price: "$500 flat" },
  { label: "Emergency on-site visit", price: "$2,500 + travel" },
];

const faqs = [
  {
    q: "How does the subscription work?",
    a: "You pay monthly or annually. We deliver and install the hardware. You run your AI on it. Cancel anytime with 30 days' notice and we ship you a prepaid return box.",
  },
  {
    q: "What's an agent-hour?",
    a: "Sixty minutes of active AI processing time. Idle time doesn't count. You can see live usage in your dashboard.",
  },
  {
    q: "What happens if we go over our agent-hours?",
    a: "Overage is billed at the rate listed for your tier ($50–$65/hr). No surprise bills — you'll see usage climb in the dashboard and we'll flag it before you cross the line.",
  },
  {
    q: "Who owns the hardware?",
    a: "We do, while the subscription is active. It sits in your building, runs your workloads, and stays under your physical control. When you cancel, the hardware goes back to us in a prepaid box.",
  },
  {
    q: "Do you charge setup or installation fees?",
    a: "No. Deployment is included in the subscription.",
  },
  {
    q: "Can we run our own models?",
    a: "Yes. We ship with Llama, Mistral, or Phi by default. Model swaps are $500 flat. Custom fine-tuning on your data is available as an add-on.",
  },
  {
    q: "Is this HIPAA-compliant?",
    a: "The architecture is. Your data never leaves your building, which is the biggest structural advantage over cloud AI. Add the Compliance Reporting Pack for the HIPAA / SOC 2 logs your auditor wants.",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex items-center justify-center px-6 pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Private AI.{" "}
            <span className="text-electric-400">Monthly subscription. Hardware included.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Your hardware, your data, your building. One price. No setup fees. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-10 inline-flex rounded-lg border border-slate-700 bg-slate-900 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                billing === "monthly" ? "bg-electric-500 text-white" : "text-slate-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                billing === "annual" ? "bg-electric-500 text-white" : "text-slate-400"
              }`}
            >
              Annual <span className="ml-1 text-xs text-accent-green">(2 months free)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tier grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => {
            const price = billing === "monthly" ? tier.monthly : tier.annual;
            const period = billing === "monthly" ? "/mo" : "/yr";
            return (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  "featured" in tier && tier.featured
                    ? "border-electric-500/50 bg-electric-500/5 shadow-lg shadow-electric-500/10"
                    : "border-slate-800 bg-navy-900/50"
                }`}
              >
                {"featured" in tier && tier.featured && (
                  <div className="mb-4 inline-flex w-fit items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-electric-400">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{tier.description}</p>
                <div className="mt-6">
                  <p className="text-4xl font-bold">${price.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">{period}</p>
                </div>
                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Agent-hours / mo</dt>
                    <dd className="font-semibold text-slate-200">{tier.agentHours}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Overage</dt>
                    <dd className="font-semibold text-slate-200">${tier.overageRate}/hr</dd>
                  </div>
                </dl>
                <Link
                  href="/contact"
                  className="mt-auto block rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-electric-600"
                >
                  Start with {tier.name}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
          Cancel anytime with 30 days&apos; notice. Hardware returns in a prepaid shipping box.
        </p>
      </section>

      {/* Included in every plan */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Included in <span className="text-electric-400">every plan</span>
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {included.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3"
            >
              <span className="text-accent-green">✓</span>
              <span className="text-sm text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Agent-hour definition */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
          <h3 className="text-xl font-bold">What&apos;s an agent-hour?</h3>
          <p className="mt-3 text-slate-300">
            An agent-hour is 60 minutes of active AI processing time. Idle time
            doesn&apos;t count. Your dashboard shows real-time usage so you
            always know where you stand.
          </p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Add-ons</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                <th className="py-3 pr-4 font-semibold">Add-on</th>
                <th className="py-3 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {addOns.map((addon) => (
                <tr
                  key={addon.label}
                  className="border-b border-slate-800/60 text-sm"
                >
                  <td className="py-3 pr-4 text-slate-200">{addon.label}</td>
                  <td className="py-3 font-semibold text-electric-400">
                    {addon.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Frequently Asked <span className="text-electric-400">Questions</span>
        </h2>
        <dl className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <dt className="font-semibold text-slate-100">{faq.q}</dt>
              <dd className="mt-2 text-sm text-slate-300">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to run AI on your own hardware?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Take the free AI Readiness Assessment or book a technical consultation.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/assess"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            Free AI Readiness Score
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
