"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";

const industries = [
  { value: "", label: "Select your industry" },
  { value: "legal", label: "Legal" },
  { value: "medical", label: "Medical" },
  { value: "auto", label: "Auto" },
  { value: "trades", label: "Trades" },
  { value: "other", label: "Other" },
];

const services = [
  { value: "", label: "Select a service" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
  { value: "ai-readiness-360", label: "AI Readiness 360" },
  { value: "aegis", label: "AEGIS" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

const offices = [
  {
    flag: "\u{1F1FA}\u{1F1F8}",
    city: "Frisco, Texas",
    label: "Global Headquarters",
  },
  {
    flag: "\u{1F1F2}\u{1F1FD}",
    city: "Guadalajara, Mexico",
    label: "Latin America Operations",
  },
  {
    flag: "\u{1F1EC}\u{1F1E6}",
    city: "Libreville, Gabon",
    label: "Africa Operations",
  },
];

export default function ContactPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    industry: "",
    service: "",
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
        body: JSON.stringify({ form: "contact", data: formData }),
      });
      setSubmitted(true);
    } catch {
      alert("Failed to send. Please try again or email info@techfides.com directly.");
    }
    setSending(false);
  };

  const inputClasses =
    "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500";

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm font-semibold text-electric-400">
            {t("contact.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("contact.heroTitle")} <span className="text-electric-400">{t("contact.heroTitleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("contact.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold">
              {t("contact.formTitle")} <span className="text-electric-400">{t("contact.formTitleHighlight")}</span>
            </h2>
            <p className="mt-2 text-slate-400">
              {t("contact.formSubtitle")}
            </p>

            {submitted ? (
              <div className="mt-8 rounded-2xl border border-accent-green/30 bg-accent-green/5 p-8 text-center">
                <div className="text-4xl">&#10003;</div>
                <h3 className="mt-4 text-xl font-bold text-accent-green">
                  Message Sent!
                </h3>
                <p className="mt-2 text-slate-400">
                  Thank you for reaching out. We typically respond within one
                  business day. A member of our team will be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Name <span className="text-electric-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputClasses}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Email <span className="text-electric-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputClasses}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-company"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Company <span className="text-electric-400">*</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className={inputClasses}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Phone{" "}
                      <span className="text-slate-500 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={inputClasses}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-industry"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Industry <span className="text-electric-400">*</span>
                    </label>
                    <select
                      id="contact-industry"
                      required
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      className={inputClasses}
                    >
                      {industries.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="contact-service"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Service Interest{" "}
                      <span className="text-electric-400">*</span>
                    </label>
                    <select
                      id="contact-service"
                      required
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className={inputClasses}
                    >
                      {services.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Message <span className="text-electric-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="Tell us about your project, challenges, or questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="glow-blue w-full rounded-lg bg-electric-500 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
                >
                  Send Message
                </button>

                <p className="text-center text-xs text-slate-500">
                  We typically respond within one business day.
                </p>
              </form>
            )}
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {/* Email */}
            <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
              <h3 className="text-lg font-semibold">Email</h3>
              <a
                href="mailto:info@techfides.com"
                className="mt-2 block text-electric-400 transition-colors hover:text-electric-300"
              >
                info@techfides.com
              </a>
              <p className="mt-1 text-sm text-slate-500">
                For general inquiries and service questions.
              </p>
            </div>

            {/* Offices */}
            <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
              <h3 className="text-lg font-semibold">Our Offices</h3>
              <div className="mt-4 space-y-4">
                {offices.map((office) => (
                  <div key={office.city} className="flex items-start gap-3">
                    <span className="mt-0.5 text-xl">{office.flag}</span>
                    <div>
                      <p className="font-medium text-slate-200">
                        {office.city}
                      </p>
                      <p className="text-sm text-slate-500">{office.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
              <h3 className="text-lg font-semibold">Response Time</h3>
              <p className="mt-2 text-sm text-slate-400">
                We typically respond within one business day. For urgent
                deployment needs, mention it in your message and we&apos;ll
                prioritize accordingly.
              </p>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
              <h3 className="text-lg font-semibold">Explore</h3>
              <div className="mt-4 space-y-2">
                <a
                  href="/pricing"
                  className="block text-sm text-slate-400 transition-colors hover:text-electric-400"
                >
                  View Pricing Plans &rarr;
                </a>
                <a
                  href="/solutions"
                  className="block text-sm text-slate-400 transition-colors hover:text-electric-400"
                >
                  Industry Solutions &rarr;
                </a>
                <a
                  href="/consulting/ai-readiness-360"
                  className="block text-sm text-slate-400 transition-colors hover:text-electric-400"
                >
                  AI Readiness Assessment &rarr;
                </a>
                <a
                  href="/partners"
                  className="block text-sm text-slate-400 transition-colors hover:text-electric-400"
                >
                  Partner Program &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
