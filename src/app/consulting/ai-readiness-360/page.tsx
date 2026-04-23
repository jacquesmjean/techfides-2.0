"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const domains = [
  {
    icon: "\uD83C\uDFAF",
    name: "Strategy & Leadership",
    question: "Is your AI vision aligned to business value?",
    color: "text-electric-400",
    borderColor: "border-electric-500/30",
    bgColor: "bg-electric-500/5",
    details: [
      "AI vision clarity and executive alignment",
      "Use case identification and prioritization",
      "Investment clarity and ROI projections",
      "Short-term wins vs. long-term transformation balance",
      "Competitive AI landscape positioning",
    ],
  },
  {
    icon: "\uD83D\uDDC4\uFE0F",
    name: "Data & Infrastructure",
    question: "Is your data ready for algorithmic consumption?",
    color: "text-accent-amber",
    borderColor: "border-accent-amber/30",
    bgColor: "bg-accent-amber/5",
    details: [
      "Data quality scoring (accuracy, completeness, consistency)",
      "Data pipeline architecture and accessibility",
      "Data governance policies and enforcement",
      "Data silos and integration readiness",
      "Historical data depth and labeling maturity",
    ],
  },
  {
    icon: "\uD83D\uDDA5\uFE0F",
    name: "Technology & Architecture",
    question: "Can your infrastructure support AI across all departments?",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/5",
    details: [
      "Current compute capacity (CPU, GPU, memory)",
      "Cloud vs. on-premise infrastructure assessment",
      "Software stack compatibility and technical debt",
      "Security posture and vulnerability analysis",
      "Scalability and deployment architecture readiness",
    ],
  },
  {
    icon: "\u2699\uFE0F",
    name: "Operations & Processes",
    question: "Are your workflows ready for AI integration?",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bgColor: "bg-sky-500/5",
    details: [
      "Workflow automation potential and maturity",
      "Process documentation and standardization",
      "Operational bottleneck identification",
      "Cross-functional integration readiness",
      "Change management capacity",
    ],
  },
  {
    icon: "\uD83D\uDEE1\uFE0F",
    name: "Governance & Risk",
    question: "Are safety and compliance controls in place?",
    color: "text-accent-green",
    borderColor: "border-accent-green/30",
    bgColor: "bg-accent-green/5",
    details: [
      "AI policies and ethical guidelines",
      "Regulatory compliance framework (HIPAA, SOC 2, GDPR)",
      "Audit trail and explainability requirements",
      "Vendor and third-party risk assessment",
      "Decision lineage and accountability structures",
    ],
  },
  {
    icon: "\uD83D\uDC65",
    name: "People & Culture",
    question: "Is your team ready to adopt and scale AI?",
    color: "text-pink-400",
    borderColor: "border-pink-500/30",
    bgColor: "bg-pink-500/5",
    details: [
      "AI skills inventory and training gaps",
      "Leadership buy-in and change readiness",
      "Cultural resistance and adoption barriers",
      "Cross-functional collaboration maturity",
      "Talent acquisition and retention strategy for AI roles",
    ],
  },
];

const deliverables = [
  {
    name: "AI Readiness Score",
    icon: "\uD83D\uDCCA",
    description: "Quantitative scoring across all 6 domains with maturity level classification: Nascent, Emerging, Developing, Advancing, or Leading.",
  },
  {
    name: "Enterprise Heat Map",
    icon: "\uD83D\uDD25",
    description: "Visual truth across the organization. Green (ready), yellow (emerging), red (critical gaps). Instantly see where to invest and where to stop.",
  },
  {
    name: "Risk Exposure Profile",
    icon: "\u26A0\uFE0F",
    description: "Prioritized registry of compliance gaps, governance deficiencies, data integrity risks, and overstated readiness areas.",
  },
  {
    name: "Opportunity Pipeline",
    icon: "\uD83D\uDE80",
    description: "High-value automation areas, AI quick wins, efficiency gains, and strategic use cases mapped by impact, effort, and risk.",
  },
  {
    name: "Priority Roadmap",
    icon: "\uD83D\uDDFA\uFE0F",
    description: "Sequenced execution plan: fix critical risks first, unlock quick wins second, build foundations third, scale strategically fourth.",
  },
  {
    name: "Executive Briefing Package",
    icon: "\uD83D\uDCCB",
    description: "60-second snapshot, narrative summary, and downloadable PDF — everything leadership needs to make a confident Go/No-Go decision.",
  },
];

export default function AIReadiness360Page() {
  const { t } = useI18n();

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm font-semibold text-electric-400">
            {t("ai360.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("ai360.heroTitle")}
            <br />
            <span className="text-electric-400">{t("ai360.heroTitleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
            A 60-question distributed intelligence system that captures real
            organizational signals across{" "}
            <strong className="text-slate-100">6 domains</strong>, identifies
            risks and opportunities, and delivers a clear, prioritized roadmap
            for AI execution.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            This is not a survey. It is a network-level diagnostic engine
            deployed across your leadership, IT, operations, and compliance teams
            simultaneously.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
            >
              Request Your Assessment
            </Link>
            <Link
              href="/assess"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              Try the Free Quick Score
            </Link>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Why Organizations <span className="text-electric-400">Fail</span> at AI
            </h2>
            <p className="mt-4 text-slate-400">
              Most AI failures don&apos;t happen because of bad models. They
              happen because organizations attempt to scale on top of fractured
              data, immature governance, and undefined use cases.
            </p>

            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">&#9888;</span>
                <h3 className="font-bold text-red-400">The Pilot Trap</h3>
              </div>
              <p className="mt-2 text-sm text-red-300/80">
                70% of enterprise AI pilots never reach production because the
                underlying infrastructure and organizational readiness were
                never validated.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-accent-green text-lg">&#10003;</span>
                <h3 className="font-bold text-accent-green">Our Approach</h3>
              </div>
              <p className="mt-2 text-sm text-green-300/80">
                We deploy the assessment across your leadership team, IT, operations, and compliance leads
                departments, and regions simultaneously &mdash; capturing a
                distributed intelligence signal, not a single biased perspective.
              </p>
            </div>
          </div>

          {/* How It Works — 4 Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200">The Client Experience</h3>
            {[
              { step: "01", icon: "\uD83D\uDCDD", title: "Assessment", desc: "60 structured questions across 6 domains. Designed for executives, not just engineers. No raw data ingestion." },
              { step: "02", icon: "\uD83D\uDD0D", title: "Systems Evidence", desc: "Validates responses with supporting inputs. Bridges the gap between perceived readiness and operational reality." },
              { step: "03", icon: "\uD83D\uDCC2", title: "Document Upload", desc: "Optional artifacts \u2014 policies, architecture diagrams, workflows \u2014 strengthen the credibility of the assessment." },
              { step: "04", icon: "\uD83D\uDCCA", title: "Review & Results", desc: "Scored readiness across all dimensions. Executive overview, opportunity map, risk profile, and priority roadmap." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-xl border border-slate-800 bg-navy-900/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-500/10 text-lg">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-electric-400">{s.step}</span>
                    <h4 className="text-sm font-bold text-slate-200">{s.title}</h4>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Assessment Domains */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          6 Assessment <span className="text-electric-400">Domains</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          A 360-degree evaluation across every critical layer that determines AI
          success or failure. 10 questions per domain, 60 total.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <div
              key={d.name}
              className={`rounded-2xl border ${d.borderColor} ${d.bgColor} p-6`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.icon}</span>
                <h3 className={`text-lg font-bold ${d.color}`}>{d.name}</h3>
              </div>
              <p className="mt-2 text-sm italic text-slate-400">{d.question}</p>
              <div className="mt-4 space-y-2">
                {d.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className={`mt-0.5 ${d.color}`}>&#9656;</span>
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual: Sample Heat Map + Executive Output */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          What the <span className="text-electric-400">Output Looks Like</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Real intelligence, not generic slides. Here&apos;s a sample of what your leadership team receives.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Enterprise Heat Map */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Enterprise AI Readiness Heat Map</h3>
            <div className="space-y-3">
              {[
                { domain: "Strategy & Leadership", score: 72, level: "Advancing" },
                { domain: "Data & Infrastructure", score: 45, level: "Developing" },
                { domain: "Technology & Architecture", score: 61, level: "Advancing" },
                { domain: "Operations & Processes", score: 38, level: "Emerging" },
                { domain: "Governance & Risk", score: 28, level: "Emerging" },
                { domain: "People & Culture", score: 55, level: "Developing" },
              ].map((d) => {
                const color = d.score >= 70 ? "#22c55e" : d.score >= 50 ? "#f59e0b" : d.score >= 30 ? "#f97316" : "#ef4444";
                const bgColor = d.score >= 70 ? "bg-green-500/10" : d.score >= 50 ? "bg-amber-500/10" : d.score >= 30 ? "bg-orange-500/10" : "bg-red-500/10";
                return (
                  <div key={d.domain}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">{d.domain}</span>
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${bgColor}`} style={{ color }}>{d.level}</span>
                        <span className="text-xs font-bold" style={{ color }}>{d.score}</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-slate-800">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.score}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-xs text-slate-400">Overall Score</span>
              <span className="text-xl font-extrabold text-amber-400">50/100</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">Maturity Level: Developing &mdash; Foundation needed before AI scale</p>
          </div>

          {/* Risk & Opportunity Matrix */}
          <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Risk &amp; Opportunity Matrix</h3>

            {/* Risk Quadrant */}
            <div className="grid grid-cols-5 gap-1 mb-4">
              <div className="col-span-5 text-center text-[9px] text-slate-500 mb-1">Impact &rarr;</div>
              {[
                ["bg-green-500/20", "bg-green-500/30", "bg-amber-500/20", "bg-amber-500/30", "bg-red-500/20"],
                ["bg-green-500/10", "bg-green-500/20", "bg-amber-500/20", "bg-amber-500/30", "bg-red-500/30"],
                ["bg-slate-800/50", "bg-green-500/10", "bg-amber-500/10", "bg-red-500/20", "bg-red-500/30"],
                ["bg-slate-800/50", "bg-slate-800/50", "bg-amber-500/10", "bg-amber-500/20", "bg-red-500/20"],
                ["bg-slate-800/50", "bg-slate-800/50", "bg-slate-800/50", "bg-amber-500/10", "bg-amber-500/20"],
              ].map((row, ri) => (
                row.map((cell, ci) => {
                  const dots: Record<string, string> = { "1-3": "\uD83D\uDD35", "2-4": "\uD83D\uDD34", "0-2": "\uD83D\uDFE2", "3-1": "\uD83D\uDFE1", "1-1": "\uD83D\uDFE2" };
                  const key = `${ri}-${ci}`;
                  return (
                    <div key={key} className={`h-8 rounded ${cell} flex items-center justify-center text-[10px]`}>
                      {dots[key] || ""}
                    </div>
                  );
                })
              ))}
              <div className="col-span-5 flex items-center justify-between text-[9px] text-slate-500 mt-1">
                <span>&uarr; Likelihood</span>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" />Low</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />Medium</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />High</span>
                </div>
              </div>
            </div>

            {/* Key Risks */}
            <div className="space-y-2 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Top Identified Risks</p>
              {[
                { risk: "AI without governance framework", severity: "Critical", color: "text-red-400" },
                { risk: "Fragmented data across 4+ silos", severity: "High", color: "text-amber-400" },
                { risk: "No compliance audit trail for AI decisions", severity: "High", color: "text-amber-400" },
                { risk: "Shadow AI initiatives in 2 departments", severity: "Medium", color: "text-sky-400" },
              ].map((r) => (
                <div key={r.risk} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-1.5">
                  <span className="text-[11px] text-slate-300">{r.risk}</span>
                  <span className={`text-[9px] font-bold ${r.color}`}>{r.severity}</span>
                </div>
              ))}
            </div>

            {/* Quick Opportunities */}
            <div className="space-y-2 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent-green">Top Opportunities</p>
              {[
                { opp: "Document processing automation", impact: "$420K/yr savings" },
                { opp: "Customer service AI deployment", impact: "40% faster response" },
              ].map((o) => (
                <div key={o.opp} className="flex items-center justify-between rounded-lg border border-accent-green/20 bg-accent-green/5 px-3 py-1.5">
                  <span className="text-[11px] text-slate-300">{o.opp}</span>
                  <span className="text-[9px] font-bold text-accent-green">{o.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Architecture Flow */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-navy-900/30 p-8">
          <h3 className="text-center text-sm font-bold text-slate-200 mb-6">Assessment Intelligence Pipeline</h3>
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            {[
              { step: "I", label: "Distributed Input", desc: "60 questions across department heads", icon: "\uD83D\uDCDD", color: "border-electric-500/30 bg-electric-500/5" },
              { step: "II", label: "Intelligence Engine", desc: "Normalize, score, weight, aggregate", icon: "\uD83E\uDDE0", color: "border-purple-500/30 bg-purple-500/5" },
              { step: "III", label: "Analytics Layer", desc: "Heat map, risks, opportunities", icon: "\uD83D\uDCC8", color: "border-amber-500/30 bg-amber-500/5" },
              { step: "IV", label: "Executive Output", desc: "Decision-ready intelligence package", icon: "\uD83C\uDFC6", color: "border-accent-green/30 bg-accent-green/5" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <div className={`flex flex-col items-center rounded-xl border ${s.color} p-4 w-40 text-center`}>
                  <span className="text-2xl">{s.icon}</span>
                  <span className="mt-2 text-[9px] font-bold text-slate-500">{s.step}</span>
                  <p className="text-xs font-bold text-slate-200">{s.label}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{s.desc}</p>
                </div>
                {i < 3 && <span className="hidden text-2xl text-slate-600 md:block">&rarr;</span>}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-500 italic">
          Sample output from a mid-market assessment. Actual scores and findings are unique to each organization.
        </p>
      </section>

      {/* Network Deployment — Key Differentiator */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-electric-500/20 bg-gradient-to-br from-electric-500/5 via-navy-900/50 to-transparent p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            Network-Level <span className="text-electric-400">Deployment</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            This is where we separate from 95% of the market. Instead of one
            person answering, we deploy the assessment across your entire
            organization simultaneously.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: "\uD83D\uDC65", title: "Multi-Stakeholder", desc: "CIO, CTO, COO, business unit leaders, IT teams, and operations all contribute their perspective." },
              { icon: "\uD83C\uDFE2", title: "Multi-Department", desc: "Cross-functional coverage reveals alignment gaps between strategy, technology, and operations." },
              { icon: "\uD83C\uDF0D", title: "Multi-Region", desc: "For global organizations, capture regional differences in readiness, compliance, and infrastructure." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5 text-center">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-slate-200">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-electric-400 font-medium">
            The result: a distributed intelligence capture that reveals executive
            vs. operational misalignment, departmental blind spots, and the real
            organizational truth about AI readiness.
          </p>
        </div>
      </section>

      {/* Security & Data Privacy */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-2xl border border-accent-green/20 bg-gradient-to-br from-accent-green/5 via-navy-900/50 to-transparent p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold">
            Enterprise-Grade <span className="text-accent-green">Security &amp; Privacy</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Government agencies and regulated enterprises trust the AI 360 platform because
            your data never leaves your control. Every assessment runs under a zero-trust
            architecture with full privacy guarantees.
          </p>

          {/* Security Pillars */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-center">
              <span className="text-2xl">\uD83D\uDD12</span>
              <h3 className="mt-2 text-sm font-bold text-accent-green">End-to-End Encryption</h3>
              <p className="mt-1 text-xs text-slate-400">All data encrypted in transit (TLS 1.3) and at rest (AES-256). Zero plaintext exposure at any layer.</p>
            </div>
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-center">
              <span className="text-2xl">\uD83C\uDFE2</span>
              <h3 className="mt-2 text-sm font-bold text-accent-green">Data Privacy Boundary</h3>
              <p className="mt-1 text-xs text-slate-400">Assessment data stays within your specified geographic and corporate boundaries. US, LATAM, and CEMAC compliance built in.</p>
            </div>
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-center">
              <span className="text-2xl">\uD83D\uDEE1\uFE0F</span>
              <h3 className="mt-2 text-sm font-bold text-accent-green">Zero-Trust Architecture</h3>
              <p className="mt-1 text-xs text-slate-400">Every integration uses zero-trust authentication. No implicit trust, no standing access, every request verified.</p>
            </div>
          </div>

          {/* Detailed Security Features */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Data Minimization */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <h4 className="text-sm font-bold text-slate-200">Data Minimization Protocol</h4>
              <p className="mt-2 text-xs text-slate-400">
                The assessment analyzes metadata and structured responses only &mdash; private payloads
                are discarded at the edge. No raw datasets, system logs, or PII are ingested.
              </p>
              <div className="mt-4 flex gap-4">
                <div className="rounded-lg bg-electric-500/10 px-4 py-3 text-center flex-1">
                  <p className="text-lg font-bold text-electric-400">60</p>
                  <p className="text-[9px] text-slate-400">Structured Questions</p>
                  <p className="text-[8px] text-slate-500">Metadata only</p>
                </div>
                <div className="rounded-lg bg-slate-800/50 px-4 py-3 text-center flex-1">
                  <p className="text-lg font-bold text-slate-400">0</p>
                  <p className="text-[9px] text-slate-400">Raw Data Ingested</p>
                  <p className="text-[8px] text-slate-500">Private payloads discarded</p>
                </div>
              </div>
            </div>

            {/* Privacy Compliance */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <h4 className="text-sm font-bold text-slate-200">Privacy Boundary Compliance</h4>
              <p className="mt-2 text-xs text-slate-400">
                Assessment data remains within specified geographic and corporate boundaries.
                Verified across all TechFides operating regions.
              </p>
              <div className="mt-4 space-y-2">
                {[
                  { region: "\uD83C\uDDFA\uD83C\uDDF8 North America (US)", status: "Compliant" },
                  { region: "\uD83C\uDDF2\uD83C\uDDFD Latin America (MX)", status: "Compliant" },
                  { region: "\uD83C\uDDEC\uD83C\uDDE6 Central Africa (CEMAC)", status: "Compliant" },
                ].map((r) => (
                  <div key={r.region} className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-900/30 px-3 py-2">
                    <span className="text-xs text-slate-300">{r.region}</span>
                    <span className="text-[10px] font-bold text-accent-green">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scanning Architecture */}
          <div className="mt-8 rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
            <h4 className="text-sm font-bold text-slate-200 mb-3">Network Assessment Architecture</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-green" />
                  <span className="text-xs font-bold text-accent-green">Passive Sniffing (Default)</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Port mirroring / TAP &mdash; zero network interference. Preferred by enterprise IT
                  departments to ensure zero downtime. No packets are modified, injected, or redirected.
                </p>
              </div>
              <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  <span className="text-xs font-bold text-slate-400">Active Scanning (Available)</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Endpoint probing &mdash; available on request for deep infrastructure audits.
                  Requires explicit client authorization and scheduled maintenance window.
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              "HIPAA Aligned", "SOC 2 Ready", "GDPR Compatible", "FedRAMP Aware",
              "Zero Data Leakage", "AES-256 Encryption", "Zero-Trust Auth", "Immutable Audit Trail",
            ].map((badge) => (
              <span key={badge} className="rounded-full border border-accent-green/30 bg-accent-green/5 px-3 py-1 text-[10px] font-medium text-accent-green">
                {badge}
              </span>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-accent-green">
            &ldquo;Your data never leaves your building. Your assessment runs on private infrastructure.
            This is the security posture that earns government trust.&rdquo;
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          What You <span className="text-electric-400">Walk Away With</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          Decision-grade intelligence. Not generic advice.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((d) => (
            <div key={d.name} className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6">
              <span className="text-2xl">{d.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-electric-400">{d.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{d.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery + Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8">
            <span className="text-3xl">\u23F1\uFE0F</span>
            <h3 className="mt-4 text-2xl font-bold">How We Deliver</h3>
            <p className="mt-2 text-slate-400">
              A structured engagement with a secure digital portal. Your team
              accesses the assessment via a private link &mdash; no software to
              install.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { phase: "Phase 1", label: "Portal setup & team onboarding", days: "Days 1-3" },
                { phase: "Phase 2", label: "Distributed assessment completion", days: "Days 4-10" },
                { phase: "Phase 3", label: "Systems evidence & document upload", days: "Days 8-12" },
                { phase: "Phase 4", label: "AI-powered analysis & scoring", days: "Days 10-14" },
                { phase: "Phase 5", label: "Executive briefing & roadmap delivery", days: "Day 15" },
              ].map((p) => (
                <div key={p.phase} className="flex items-center gap-4">
                  <span className="min-w-[80px] rounded-lg bg-electric-500/10 px-3 py-1 text-center text-xs font-bold text-electric-400">
                    {p.days}
                  </span>
                  <span className="text-sm text-slate-300">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
            <span className="text-3xl">\uD83D\uDCB0</span>
            <h3 className="mt-4 text-2xl font-bold">Fixed-Price Engagements</h3>
            <p className="mt-2 text-slate-400">
              Each package has a defined scope, deliverables, and price on the page. No open-ended consulting.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">SMB / Mid-Market</p>
                <p className="text-3xl font-bold text-electric-400">$45,000</p>
                <p className="text-sm text-slate-400">Up to 20 participants, single region</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Enterprise</p>
                <p className="text-3xl font-bold text-electric-400">Up to $85,000</p>
                <p className="text-sm text-slate-400">Unlimited participants, multi-region, multi-BU</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="mt-6 block rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-electric-600"
            >
              View Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Strategic Positioning */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/30 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            This Is Not an Assessment.
          </h2>
          <h3 className="mt-2 text-xl font-bold text-electric-400 md:text-2xl">
            It Is a System of Record for AI Transformation.
          </h3>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-400">What it is NOT</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                <li>&#10005; A questionnaire</li>
                <li>&#10005; A consulting intake form</li>
                <li>&#10005; A maturity checklist</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent-green">What it IS</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>&#10003; A distributed AI intelligence system</li>
                <li>&#10003; A network-level diagnostic engine</li>
                <li>&#10003; A decision support platform</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-electric-400">What it enables</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>&#10003; Repeatable transformation</li>
                <li>&#10003; Standardized AI adoption</li>
                <li>&#10003; Measurable progress over time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Frequently Asked <span className="text-electric-400">Questions</span>
        </h2>
        <div className="mt-12 space-y-6">
          {[
            { q: "How is this different from a typical AI maturity assessment?", a: "Most assessments capture one person's opinion. Ours deploys across your entire organization \u2014 leadership, IT, operations, compliance \u2014 simultaneously. The result is a distributed intelligence signal that reveals alignment gaps, departmental blind spots, and the actual truth about your readiness." },
            { q: "Do we need to share sensitive data or system access?", a: "No. The assessment uses structured questions and optional document uploads \u2014 no raw data ingestion, no system access required. This means low friction, high adoption, and zero security risk." },
            { q: "How much time does it require from our team?", a: "Each participant spends approximately 45-60 minutes completing their section of the assessment. The portal is self-service \u2014 they access it via a private link on their own schedule." },
            { q: "Do we need AEGIS to use this?", a: "No. This is a standalone engagement. The findings are yours to use with any toolset. However, the data captured is fully compatible with AEGIS for organizations that want to move into governed AI execution." },
            { q: "What happens after the assessment?", a: "You receive the full executive package: AI Readiness Score, Enterprise Heat Map, Risk Profile, Opportunity Pipeline, and Prioritized Roadmap. We present findings in an executive briefing and provide a clear Go/No-Go recommendation." },
          ].map((faq) => (
            <div key={faq.q} className="rounded-xl border border-slate-800 bg-navy-900/30 p-6">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Stop Guessing. Start Executing.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Organizations don&apos;t fail at AI because of technology. They fail
          due to misalignment, poor data foundations, and lack of structured
          execution readiness. This system prevents that.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="glow-blue rounded-xl bg-electric-500 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            Request Your Assessment
          </Link>
          <Link
            href="/assess"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Take the Free Quick Score
          </Link>
        </div>
      </section>
    </div>
  );
}
