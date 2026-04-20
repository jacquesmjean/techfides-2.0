"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";

const benefits = [
  {
    icon: "\u{1F4B0}",
    title: "Generous Commissions",
    description:
      "Commission on the first 12 months of MRR (monthly recurring revenue) per deal closed. No commission on one-time fees, because there aren't any.",
  },
  {
    icon: "\u{1F4E6}",
    title: "Marketing Collateral",
    description:
      "Access branded pitch decks, one-pagers, case studies, and ROI calculators. Everything you need to have the conversation with confidence.",
  },
  {
    icon: "\u{1F4CA}",
    title: "Lead Tracking Dashboard",
    description:
      "Real-time visibility into your referrals. See where each lead stands in the pipeline, from introduction to deployment.",
  },
  {
    icon: "\u{1F91D}",
    title: "Co-Selling Support",
    description:
      "Bring us into the conversation when you need technical depth. We'll join calls, run demos, and help close — you keep the full commission.",
  },
  {
    icon: "\u{1F393}",
    title: "Partner Training",
    description:
      "Monthly webinars on AI trends, product updates, and sales techniques. Become the AI expert in your network.",
  },
  {
    icon: "\u{1F680}",
    title: "Priority Access",
    description:
      "Partners get first look at new verticals, features, and pricing tiers. Your referrals also get priority onboarding.",
  },
];

const partnerTypes = [
  {
    type: "IT Consultants & MSPs",
    description:
      "You already manage their infrastructure. Now offer AI as a service. TechFides deploys, you earn recurring revenue on a client you already own.",
  },
  {
    type: "Business Consultants",
    description:
      "Your clients trust your strategic advice. Recommending private AI infrastructure makes you the advisor who brought real cost savings to the table -- and earns you a commission on every deal.",
  },
  {
    type: "Industry Specialists",
    description:
      "If you serve legal, medical, auto, or trades verticals, you know the pain points. Connect your clients with the solution and get paid for it.",
  },
  {
    type: "Accountants & Financial Advisors",
    description:
      "You see the cloud spend on their P&L. Show them a better way. The ROI calculator practically sells itself.",
  },
];

export default function PartnersPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    partnerType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/v1/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "partner",
          data: {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            type: formData.partnerType,
            message: formData.message,
          },
        }),
      });
      setSubmitted(true);
    } catch {
      alert("Failed to send. Please try again or email partners@techfides.com directly.");
    }
    setSending(false);
  };

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-accent-amber/30 bg-accent-amber/10 px-4 py-1.5 text-sm font-semibold text-accent-amber">
            {t("partners.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("partners.heroTitle")}{" "}
            <span className="text-electric-400">{t("partners.heroTitleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("partners.heroSubtitle")}
          </p>
          <a
            href="#apply"
            className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            {t("partners.ctaApply")}
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          How the Program <span className="text-electric-400">Works</span>
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {[
            {
              step: "01",
              title: "Apply",
              desc: "Fill out the form below. We'll review and onboard you within 48 hours.",
            },
            {
              step: "02",
              title: "Refer",
              desc: "Introduce TechFides to businesses in your network who need local AI.",
            },
            {
              step: "03",
              title: "We Close",
              desc: "Our team handles the technical sale, demo, and deployment. You stay informed.",
            },
            {
              step: "04",
              title: "Get Paid",
              desc: "Earn commission on the first 12 months of MRR per closed deal.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-electric-500/30 bg-electric-500/10 text-xl font-bold text-electric-400">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Partner <span className="text-electric-400">Benefits</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6 transition-all hover:border-electric-500/30"
            >
              <div className="text-3xl">{b.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ideal Partners */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Ideal <span className="text-electric-400">Partners</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {partnerTypes.map((p) => (
            <div
              key={p.type}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6"
            >
              <h3 className="text-lg font-bold text-electric-400">{p.type}</h3>
              <p className="mt-2 text-sm text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission Structure */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Commission <span className="text-electric-400">Structure</span>
        </h2>
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-navy-900/80">
                <th className="p-4 font-semibold text-slate-400">Tier</th>
                <th className="p-4 font-semibold text-slate-400">Monthly</th>
                <th className="p-4 font-semibold text-slate-400">
                  Commission (first 12 months of MRR)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr className="bg-slate-950/50">
                <td className="p-4 font-medium">Starter</td>
                <td className="p-4 text-slate-300">$1,299 / mo</td>
                <td className="p-4 text-accent-green">$1,559 – $3,118</td>
              </tr>
              <tr className="bg-slate-950/50">
                <td className="p-4 font-medium">Growth</td>
                <td className="p-4 text-slate-300">$2,299 / mo</td>
                <td className="p-4 text-accent-green">$2,759 – $5,518</td>
              </tr>
              <tr className="bg-slate-950/50">
                <td className="p-4 font-medium">Scale</td>
                <td className="p-4 text-slate-300">$3,999 / mo</td>
                <td className="p-4 text-accent-green">$4,799 – $9,598</td>
              </tr>
              <tr className="bg-slate-950/50">
                <td className="p-4 font-medium">Enterprise</td>
                <td className="p-4 text-slate-300">$6,999 / mo</td>
                <td className="p-4 text-accent-green">$8,399 – $16,798</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Commission is 10–20% of the first 12 months of MRR per deal closed. Rate scales with partner volume. No commission on one-time fees, because there aren&apos;t any.
        </p>
      </section>

      {/* Client Referral Program */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-2xl border border-accent-green/30 bg-accent-green/5 p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            Already a <span className="text-accent-green">TechFides Client?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
            Refer a business and earn credit on your subscription. Simple.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
              <p className="text-3xl font-bold text-accent-green">$650</p>
              <p className="mt-1 text-sm text-slate-400">Credit per Starter referral</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
              <p className="text-3xl font-bold text-accent-green">$1,150</p>
              <p className="mt-1 text-sm text-slate-400">Credit per Growth referral</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
              <p className="text-3xl font-bold text-accent-green">$2,000</p>
              <p className="mt-1 text-sm text-slate-400">Credit per Scale referral</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
              <p className="text-3xl font-bold text-accent-green">$3,500</p>
              <p className="mt-1 text-sm text-slate-400">Credit per Enterprise referral</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-300">
              Credits applied directly to your monthly subscription once the referred client signs.
              No limits on referrals. Stack credits month over month.
            </p>
            <a
              href="mailto:referrals@techfides.com?subject=Client Referral&body=I'd like to refer a business to TechFides.%0A%0AReferred Business:%0AContact Name:%0AContact Email:%0AIndustry:"
              className="glow-blue mt-6 inline-block rounded-xl bg-accent-green px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-green-600"
            >
              Submit a Referral
            </a>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="mx-auto max-w-2xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Apply to <span className="text-electric-400">Partner</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-slate-400">
          Fill out the form below and we&apos;ll get you onboarded within 48
          hours.
        </p>

        {submitted ? (
          <div className="mt-12 rounded-2xl border border-accent-green/30 bg-accent-green/5 p-8 text-center">
            <div className="text-4xl">&#10003;</div>
            <h3 className="mt-4 text-xl font-bold text-accent-green">
              Application Received!
            </h3>
            <p className="mt-2 text-slate-400">
              We&apos;ll review your application and reach out within 48 hours.
              Welcome to the TechFides partner network.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Company / Organization
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                placeholder="Your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Partner Type
              </label>
              <select
                required
                value={formData.partnerType}
                onChange={(e) =>
                  setFormData({ ...formData, partnerType: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
              >
                <option value="">Select your type</option>
                <option value="it-consultant">IT Consultant / MSP</option>
                <option value="business-consultant">
                  Business Consultant
                </option>
                <option value="industry-specialist">
                  Industry Specialist
                </option>
                <option value="accountant">
                  Accountant / Financial Advisor
                </option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Tell us about your network
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                placeholder="How many potential clients could you refer? What industries do they serve?"
              />
            </div>
            <button
              type="submit"
              className="glow-blue w-full rounded-lg bg-electric-500 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              Submit Application
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
