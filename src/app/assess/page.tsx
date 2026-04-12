"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * AI Readiness Assessment — Free viral tool
 *
 * 8 questions across 4 dimensions → score 0-100 → shareable report card.
 * Each share brings new prospects to the site.
 */

interface Question {
  id: string;
  dimension: string;
  dimensionIcon: string;
  text: string;
  options: { label: string; value: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    dimension: "Data Readiness",
    dimensionIcon: "\uD83D\uDDC4\uFE0F",
    text: "How is your business data currently stored and organized?",
    options: [
      { label: "Scattered across spreadsheets and email", value: 10 },
      { label: "Centralized but not standardized", value: 40 },
      { label: "Structured in a CRM or database", value: 70 },
      { label: "Fully organized with APIs and automation", value: 100 },
    ],
  },
  {
    id: "q2",
    dimension: "Data Readiness",
    dimensionIcon: "\uD83D\uDDC4\uFE0F",
    text: "How sensitive is the data your AI would process?",
    options: [
      { label: "Public/non-sensitive data only", value: 30 },
      { label: "Some client info but nothing regulated", value: 50 },
      { label: "PII, financial, or health data (HIPAA/SOC 2)", value: 80 },
      { label: "Attorney-client privilege or classified data", value: 100 },
    ],
  },
  {
    id: "q3",
    dimension: "Infrastructure",
    dimensionIcon: "\uD83D\uDDA5\uFE0F",
    text: "What does your current IT infrastructure look like?",
    options: [
      { label: "No dedicated IT — using consumer tools", value: 10 },
      { label: "Basic server/NAS with managed services", value: 40 },
      { label: "On-premise servers with IT staff", value: 70 },
      { label: "Dedicated server room or data center", value: 100 },
    ],
  },
  {
    id: "q4",
    dimension: "Infrastructure",
    dimensionIcon: "\uD83D\uDDA5\uFE0F",
    text: "How much are you spending on cloud AI subscriptions monthly?",
    options: [
      { label: "Nothing yet — haven't adopted AI", value: 20 },
      { label: "$500 - $2,000/mo", value: 50 },
      { label: "$2,000 - $5,000/mo", value: 75 },
      { label: "$5,000+/mo", value: 100 },
    ],
  },
  {
    id: "q5",
    dimension: "Team Readiness",
    dimensionIcon: "\uD83D\uDC65",
    text: "Does your team have experience using AI tools?",
    options: [
      { label: "No one uses AI tools currently", value: 10 },
      { label: "A few people use ChatGPT for basic tasks", value: 40 },
      { label: "Team regularly uses AI for productivity", value: 70 },
      { label: "AI is embedded in daily workflows", value: 100 },
    ],
  },
  {
    id: "q6",
    dimension: "Team Readiness",
    dimensionIcon: "\uD83D\uDC65",
    text: "How does leadership view AI adoption?",
    options: [
      { label: "Skeptical or unaware", value: 10 },
      { label: "Curious but no budget allocated", value: 35 },
      { label: "Actively exploring with budget approved", value: 70 },
      { label: "AI is a strategic priority with executive sponsor", value: 100 },
    ],
  },
  {
    id: "q7",
    dimension: "Compliance & Governance",
    dimensionIcon: "\uD83D\uDEE1\uFE0F",
    text: "What compliance requirements does your industry have?",
    options: [
      { label: "Minimal — no specific regulations", value: 30 },
      { label: "Standard data protection (GDPR/CCPA)", value: 50 },
      { label: "Industry-specific (HIPAA, SOC 2, PCI)", value: 80 },
      { label: "Multiple overlapping regulations", value: 100 },
    ],
  },
  {
    id: "q8",
    dimension: "Compliance & Governance",
    dimensionIcon: "\uD83D\uDEE1\uFE0F",
    text: "Do you have concerns about sending data to cloud AI providers?",
    options: [
      { label: "No concerns — comfortable with cloud", value: 20 },
      { label: "Mild concern but using cloud anyway", value: 45 },
      { label: "Significant concern — limiting AI adoption", value: 75 },
      { label: "Cannot use cloud AI due to policy/regulation", value: 100 },
    ],
  },
];

const DIMENSIONS = ["Data Readiness", "Infrastructure", "Team Readiness", "Compliance & Governance"];

function getGrade(score: number): { grade: string; color: string; label: string; recommendation: string } {
  if (score >= 80) return { grade: "A", color: "#22c55e", label: "Highly Ready", recommendation: "You're an ideal candidate for a Sovereign AI deployment. Your data maturity, infrastructure, and compliance needs align perfectly with on-premise AI." };
  if (score >= 60) return { grade: "B", color: "#38bdf8", label: "Ready with Guidance", recommendation: "Your organization is ready for AI with some preparation. An AI 360 Assessment would identify the optimal deployment path and quick wins." };
  if (score >= 40) return { grade: "C", color: "#f59e0b", label: "Foundation Needed", recommendation: "You have the right instincts but need infrastructure and governance foundations first. TEDOS can bring order to your current stack before AI deployment." };
  return { grade: "D", color: "#ef4444", label: "Early Stage", recommendation: "Start with data organization and team education. A Transformation Management engagement would build the foundation you need before AI makes sense." };
}

function generateLinkedInPost(score: number, grade: { grade: string; label: string }): string {
  return `Just took the TechFides AI Readiness Assessment and scored ${score}/100 (Grade: ${grade.grade} - ${grade.label}).

${score >= 60
    ? "Turns out we're ready to own our AI infrastructure instead of renting it from the cloud. The data sovereignty angle is real."
    : "Eye-opening to see where the gaps are. Data readiness and governance are bigger blockers than the technology itself."
}

If you're an SMB leader wondering whether local AI makes sense for your business, try it yourself (takes 2 minutes):

https://techfides.com/assess

#AI #DataSovereignty #SMB #EnterpriseAI #TechFides`;
}

export default function AssessPage() {
  const [step, setStep] = useState(0); // 0 = intro, 1-8 = questions, 9 = results
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[step - 1];

  // Calculate scores
  const dimensionScores: Record<string, { total: number; count: number }> = {};
  for (const q of QUESTIONS) {
    if (!dimensionScores[q.dimension]) dimensionScores[q.dimension] = { total: 0, count: 0 };
    dimensionScores[q.dimension].count++;
    if (answers[q.id] !== undefined) {
      dimensionScores[q.dimension].total += answers[q.id];
    }
  }

  const overallScore = Math.round(
    Object.values(answers).reduce((s, v) => s + v, 0) / totalQuestions
  );
  const grade = getGrade(overallScore);
  const linkedInPost = generateLinkedInPost(overallScore, grade);

  function handleAnswer(value: number) {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    setStep(step + 1);
  }

  function handleCopyLinkedIn() {
    navigator.clipboard.writeText(linkedInPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareTwitter() {
    const text = encodeURIComponent(`Just scored ${overallScore}/100 on the TechFides AI Readiness Assessment. ${overallScore >= 60 ? "Ready to own our AI." : "Eye-opening gaps to fix."} Try it: https://techfides.com/assess #AI #DataSovereignty`);
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  }

  // Intro
  if (step === 0) {
    return (
      <div className="grid-pattern">
        <section className="relative flex min-h-[85vh] items-center justify-center px-6 pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm text-electric-400">
              Free Assessment &mdash; 2 minutes &mdash; No email required
            </div>
            <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Is Your Business{" "}
              <span className="text-electric-400">AI Ready?</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Answer 8 questions to get your AI Readiness Score. Find out if
              you&apos;re leaving money on the table with cloud AI subscriptions
              — or if you&apos;re ready to own your infrastructure.
            </p>
            <div className="mt-8 grid grid-cols-4 gap-3">
              {DIMENSIONS.map((d) => (
                <div key={d} className="rounded-xl border border-slate-800 bg-navy-900/50 p-3 text-center">
                  <p className="text-xs font-medium text-slate-400">{d}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="glow-blue mt-10 rounded-xl bg-electric-500 px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-electric-400"
            >
              Start Assessment
            </button>
            <p className="mt-4 text-xs text-slate-500">
              No signup required. Get your score instantly.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Results
  if (step > totalQuestions) {
    return (
      <div className="grid-pattern">
        <section className="mx-auto max-w-4xl px-6 pt-32 pb-24">
          {/* Score Card */}
          <div className="rounded-2xl border border-slate-700 bg-navy-900/50 p-8 md:p-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Your AI Readiness Score
            </p>

            {/* Big Score */}
            <div className="mt-6 flex items-center justify-center">
              <div className="relative">
                <svg width="200" height="200" className="mx-auto">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke={grade.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 85}
                    strokeDashoffset={2 * Math.PI * 85 * (1 - overallScore / 100)}
                    transform="rotate(-90 100 100)"
                    style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold" style={{ color: grade.color }}>
                    {overallScore}
                  </span>
                  <span className="text-sm text-slate-400">/100</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-sm font-bold"
                style={{ color: grade.color, backgroundColor: `${grade.color}15` }}
              >
                Grade {grade.grade} — {grade.label}
              </span>
            </div>

            <p className="mx-auto mt-6 max-w-lg text-sm text-slate-300">
              {grade.recommendation}
            </p>

            {/* Dimension Breakdown */}
            <div className="mt-8 grid gap-3 md:grid-cols-4">
              {DIMENSIONS.map((d) => {
                const ds = dimensionScores[d];
                const dimScore = ds ? Math.round(ds.total / ds.count) : 0;
                const dimGrade = getGrade(dimScore);
                return (
                  <div key={d} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs font-medium text-slate-400">{d}</p>
                    <p className="mt-1 text-2xl font-bold" style={{ color: dimGrade.color }}>
                      {dimScore}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: dimGrade.color }}>
                      {dimGrade.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-8 rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
            <h3 className="text-center text-xl font-bold text-slate-100">
              Share Your Score
            </h3>
            <p className="mt-2 text-center text-sm text-slate-400">
              Challenge your network — how AI-ready are they?
            </p>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleCopyLinkedIn}
                className="flex items-center gap-2 rounded-lg bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#004182]"
              >
                {copied ? "Copied!" : "Copy LinkedIn Post"}
              </button>
              <button
                onClick={handleShareTwitter}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700"
              >
                Share on X
              </button>
            </div>

            {/* LinkedIn Post Preview */}
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/50 p-4">
              <p className="text-xs font-medium text-slate-400 mb-2">LinkedIn Post Preview:</p>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {linkedInPost}
              </p>
            </div>
          </div>

          {/* Email Capture → GSE Pipeline */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-navy-900/50 p-8 text-center">
            <h3 className="text-lg font-bold text-slate-100">
              Get Your Detailed Report
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Enter your email to receive a branded PDF report with personalized recommendations.
            </p>
            <div className="mx-auto mt-4 flex max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-electric-500 focus:outline-none"
              />
              <button
                onClick={async () => {
                  if (!email) return;
                  const dimScores = Object.fromEntries(
                    DIMENSIONS.map((d) => [
                      d,
                      dimensionScores[d]
                        ? Math.round(dimensionScores[d].total / dimensionScores[d].count)
                        : 0,
                    ])
                  );
                  try {
                    const res = await fetch("/api/v1/leads/assess", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email,
                        overallScore,
                        grade: grade.grade,
                        gradeLabel: grade.label,
                        dimensions: dimScores,
                        answers,
                        recommendation: grade.recommendation,
                      }),
                    });
                    const result = await res.json();
                    if (result.success) {
                      setEmail("");
                      alert(
                        result.isNew
                          ? "Report sent! Our team will reach out with your personalized recommendations."
                          : "Your assessment has been updated. We will follow up shortly."
                      );
                    }
                  } catch {
                    alert("Something went wrong. Please email engage@techfides.com with your score.");
                  }
                }}
                className="rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-white hover:bg-electric-400"
              >
                Send Report
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Your assessment data helps us give you a personalized recommendation. No spam, ever.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-400"
            >
              {overallScore >= 60 ? "Get Your Free AI Deployment Plan" : "Book Your AI 360 Assessment"}
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              See Pricing &amp; ROI
            </Link>
          </div>

          {/* Retake */}
          <div className="mt-8 text-center">
            <button
              onClick={() => { setStep(0); setAnswers({}); setEmail(""); }}
              className="text-sm text-slate-500 hover:text-electric-400"
            >
              Retake Assessment
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Question Step
  const progress = (step / totalQuestions) * 100;

  return (
    <div className="grid-pattern">
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">
              Question {step} of {totalQuestions}
            </span>
            <span className="text-xs text-slate-400">
              {currentQuestion.dimensionIcon} {currentQuestion.dimension}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-electric-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8 md:p-12">
          <h2 className="text-xl font-bold text-slate-100 md:text-2xl">
            {currentQuestion.text}
          </h2>

          <div className="mt-8 space-y-3">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.value)}
                className="group flex w-full items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-left transition-all hover:border-electric-500/50 hover:bg-electric-500/5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-600 text-sm text-slate-400 group-hover:border-electric-500 group-hover:text-electric-400">
                  {currentQuestion.options.indexOf(opt) + 1}
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 text-sm text-slate-500 hover:text-electric-400"
            >
              &larr; Previous
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
