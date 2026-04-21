"use client";

import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    target: "Solo practice, one site",
    monthly: "$1,299",
    annual: "$12,999",
    hours: "20",
    overage: "$65",
    features: [
      "1 deployment site",
      "1 AI model (Llama 3, Mistral, or equivalent)",
      "Fine-tuning on your documents",
      "Email support, next business day",
      "Monthly model refreshes",
      "Unlimited users in your organization",
    ],
  },
  {
    name: "Growth",
    target: "Small team, one site",
    monthly: "$2,299",
    annual: "$22,999",
    hours: "40",
    overage: "$60",
    featured: true,
    features: [
      "1 deployment site",
      "Up to 3 models running simultaneously",
      "Fine-tuning + RAG on your documents",
      "Priority support, same-business-day",
      "Bi-weekly model refreshes",
      "Unlimited users",
      "API access for custom integrations",
    ],
  },
  {
    name: "Scale",
    target: "Multi-department",
    monthly: "$3,999",
    annual: "$39,999",
    hours: "80",
    overage: "$55",
    features: [
      "Up to 2 deployment sites",
      "Unlimited models",
      "Custom model training on full dataset",
      "Dedicated support engineer",
      "Weekly model refreshes, on-demand tuning",
      "Unlimited users",
      "Full API + webhook integrations",
      "HIPAA / SOC 2 audit logging included",
    ],
  },
  {
    name: "Enterprise",
    target: "Multi-site or regulated",
    monthly: "$6,999",
    annual: "$69,999",
    hours: "160",
    overage: "$50",
    features: [
      "Multi-site deployment (priced per site)",
      "Unlimited models",
      "Custom training, RAG, agent frameworks",
      "Dedicated engineering team",
      "On-demand model updates",
      "Unlimited users",
      "Full API + governance dashboards",
      "HIPAA / SOC 2 / FedRAMP-aware patterns",
      "Disaster recovery + redundancy",
      "Quarterly strategy review",
    ],
  },
];

const addOns = [
  { name: "Custom fine-tuning on your data", price: "$750 / mo" },
  { name: "Compliance reporting pack (HIPAA / SOC 2 logs)", price: "$250 / mo" },
  { name: "Priority support (1-hour SLA)", price: "$500 / mo" },
  { name: "Additional deployment site", price: "Base tier × 0.75" },
  { name: "Model swap (e.g., Llama → Mistral)", price: "$500 flat" },
  { name: "Emergency on-site visit", price: "$2,500 + travel" },
];

const faqs = [
  {
    q: "What's an agent-hour?",
    a: "An agent-hour is 60 minutes of active AI processing time — the system actually working on a request. Idle time doesn't count. Your dashboard shows real-time usage, so you always know where you stand.",
  },
  {
    q: "What happens when I cancel?",
    a: "Submit a cancellation notice. Thirty days later, the subscription ends. We send a prepaid shipping box for the hardware. No early-termination fees.",
  },
  {
    q: "Can I change tiers?",
    a: "Yes. Upgrades take effect immediately. Downgrades take effect on your next billing cycle. No penalty for moving either direction.",
  },
  {
    q: "What if the hardware breaks?",
    a: "We replace it. Hardware is ours and we warrant it for the life of your subscription. Same-business-day shipment on standard tiers; priority shipment on Scale and Enterprise.",
  },
  {
    q: "What if I want to keep the hardware at the end?",
    a: "At the end of your subscription, we'll quote a buyout based on the remaining depreciated value. Most clients renew instead — the subscription is structured to be less expensive than owning hardware outright.",
  },
  {
    q: "What if I go over my included agent-hours?",
    a: "Overage is billed at your tier rate — no surprise charges, no shut-off. If you consistently run above your tier, we'll flag it and you can upgrade. Downgrade rules are the same.",
  },
  {
    q: "Does this replace my cloud AI tools?",
    a: "For work that involves sensitive data, yes. Many clients keep a general-purpose cloud tool for web research and non-sensitive tasks. Our system handles everything that touches client files, patient records, contracts, or financials.",
  },
  {
    q: "What's the difference between your subscription and your consulting services?",
    a: "The subscription delivers a working private AI deployment at your location. The consulting services (AI Readiness 360™, AI Transformation, AEGIS) are separate engagements for organizations needing strategy, execution, or governance at enterprise scale. You can subscribe without consulting. You can also engage consulting without subscribing.",
  },
  {
    q: "Is there a contract term?",
    a: "Annual plans (2 months free) have a 12-month minimum. Monthly plans are month-to-month with 30 days' notice to cancel. We earn your business every month.",
  },
];

export default function PricingPage() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Private AI. Monthly{" "}
            <span className="text-electric-400">subscription.</span> Hardware included.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Your hardware, your data, your building. One price. No setup fees. Cancel anytime.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-400">
            <span>Hardware loaned</span>
            <span className="text-slate-700">·</span>
            <span>Deployment + support included</span>
            <span className="text-slate-700">·</span>
            <span>Unlimited users</span>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-electric-500/20 bg-electric-500/5 p-8 md:p-12">
          <h2 className="text-center text-2xl font-bold text-electric-400">
            Every plan includes everything.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            One monthly price covers the full stack. No add-ons required to operate. No surprise bills.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Hardware loaned for the life of your subscription — sized for your workload",
              "Deployment and installation at your location, typically within 14 days",
              "Continuous monitoring of uptime, performance, and security",
              "Updates, patches, and model refreshes as they ship",
              "Tiered support with defined response SLAs",
              "Unlimited users inside your organization",
              "Cancel anytime with 30 days' notice",
              "Prepaid shipping box for hardware return",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 text-electric-400">&#10003;</span>
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-center text-3xl font-bold">
          Pick the plan that matches your usage.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Annual plans include two months free. Overage is billed at your tier rate when you exceed included agent-hours.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-6 transition-all ${
                t.featured
                  ? "border-electric-500/50 bg-electric-500/5 shadow-lg shadow-electric-500/10"
                  : "border-slate-800 bg-navy-900/50"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-500 px-4 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold">{t.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{t.target}</p>

              <div className="mt-6">
                <p className="text-4xl font-bold">
                  {t.monthly}
                  <span className="text-base font-normal text-slate-400"> / mo</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  or {t.annual} / year (2 months free)
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-slate-800/50 px-3 py-2">
                <p className="text-sm text-slate-200">
                  <span className="font-semibold text-electric-400">{t.hours}</span> agent-hours / mo
                </p>
                <p className="text-xs text-slate-400">Overage: {t.overage} / hr</p>
              </div>

              <ul className="mt-6 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 text-accent-green">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={t.name === "Enterprise" ? "/contact" : "/contact"}
                className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                  t.featured
                    ? "bg-electric-500 text-white hover:bg-electric-400"
                    : "border border-slate-700 text-slate-200 hover:border-electric-500/50 hover:text-white"
                }`}
              >
                {t.name === "Enterprise" ? "Talk to sales" : `Start ${t.name}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Agent-hour definition */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8 md:p-10">
          <h2 className="text-2xl font-bold">What&apos;s an agent-hour?</h2>
          <p className="mt-4 text-slate-300">
            An agent-hour is 60 minutes of active AI processing time — the system actually working on a request. Idle time doesn&apos;t count. Your dashboard shows real-time usage, so you always know where you stand.
          </p>
          <p className="mt-4 text-slate-300">
            <span className="font-semibold text-electric-400">For example:</span> a Growth-tier law firm drafting and redlining contracts typically spends one to two agent-hours per attorney per day. Forty agent-hours covers a four-attorney practice running the system actively across the workday.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            If you consistently run above your tier, we&apos;ll flag it and you can upgrade (or not). Downgrade rules are the same.
          </p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Add-ons, when you need them.</h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full">
            <thead>
              <tr className="bg-electric-500/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-electric-400">Add-on</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-electric-400">Price</th>
              </tr>
            </thead>
            <tbody>
              {addOns.map((a, i) => (
                <tr
                  key={a.name}
                  className={`border-t border-slate-800 ${
                    i % 2 === 0 ? "bg-navy-900/30" : "bg-navy-900/10"
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-slate-300">{a.name}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-200">
                    {a.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Enterprise consulting strip */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8 md:p-10">
          <h2 className="text-2xl font-bold">Running AI across a bigger organization? We do that separately.</h2>
          <p className="mt-4 text-slate-300">
            Mid-market and enterprise teams need strategy, execution discipline, and governance across multiple business units. TechFides delivers three fixed-scope consulting engagements — priced independently from the subscription.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-electric-400">&#10003;</span>
              <span><span className="font-semibold">AI Readiness 360™</span> — 15-day diagnostic from $45K fixed.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-electric-400">&#10003;</span>
              <span><span className="font-semibold">AI Transformation</span> — scoped engagements from $50K to $350K.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-electric-400">&#10003;</span>
              <span><span className="font-semibold">AEGIS</span> — governance operating system from $15K diagnostic to $400K enterprise execution.</span>
            </li>
          </ul>
          <Link
            href="/consulting"
            className="mt-8 inline-block rounded-lg border border-electric-500/50 px-6 py-2.5 text-sm font-semibold text-electric-400 transition-all hover:bg-electric-500/10"
          >
            Explore enterprise services &rarr;
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">
          Common <span className="text-electric-400">questions</span>
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
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
        <h2 className="text-3xl font-bold">Start with the free readiness score.</h2>
        <p className="mt-4 text-lg text-slate-400">
          The 60-question assessment across your team shows you whether private AI fits your business. Then pick a plan — or don&apos;t.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/consulting/ai-readiness-360"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            Take the Free AI Readiness Score
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Talk to sales
          </Link>
        </div>
      </section>
    </div>
  );
}
