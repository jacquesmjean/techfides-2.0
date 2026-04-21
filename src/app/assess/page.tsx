"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";

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

function buildQuestions(t: (key: string) => string): Question[] {
  return [
    {
      id: "q1",
      dimension: t("assess.dimData"),
      dimensionIcon: "\uD83D\uDDC4\uFE0F",
      text: t("assess.q1Text"),
      options: [
        { label: t("assess.q1Opt1"), value: 10 },
        { label: t("assess.q1Opt2"), value: 40 },
        { label: t("assess.q1Opt3"), value: 70 },
        { label: t("assess.q1Opt4"), value: 100 },
      ],
    },
    {
      id: "q2",
      dimension: t("assess.dimData"),
      dimensionIcon: "\uD83D\uDDC4\uFE0F",
      text: t("assess.q2Text"),
      options: [
        { label: t("assess.q2Opt1"), value: 30 },
        { label: t("assess.q2Opt2"), value: 50 },
        { label: t("assess.q2Opt3"), value: 80 },
        { label: t("assess.q2Opt4"), value: 100 },
      ],
    },
    {
      id: "q3",
      dimension: t("assess.dimInfra"),
      dimensionIcon: "\uD83D\uDDA5\uFE0F",
      text: t("assess.q3Text"),
      options: [
        { label: t("assess.q3Opt1"), value: 10 },
        { label: t("assess.q3Opt2"), value: 40 },
        { label: t("assess.q3Opt3"), value: 70 },
        { label: t("assess.q3Opt4"), value: 100 },
      ],
    },
    {
      id: "q4",
      dimension: t("assess.dimInfra"),
      dimensionIcon: "\uD83D\uDDA5\uFE0F",
      text: t("assess.q4Text"),
      options: [
        { label: t("assess.q4Opt1"), value: 20 },
        { label: t("assess.q4Opt2"), value: 50 },
        { label: t("assess.q4Opt3"), value: 75 },
        { label: t("assess.q4Opt4"), value: 100 },
      ],
    },
    {
      id: "q5",
      dimension: t("assess.dimTeam"),
      dimensionIcon: "\uD83D\uDC65",
      text: t("assess.q5Text"),
      options: [
        { label: t("assess.q5Opt1"), value: 10 },
        { label: t("assess.q5Opt2"), value: 40 },
        { label: t("assess.q5Opt3"), value: 70 },
        { label: t("assess.q5Opt4"), value: 100 },
      ],
    },
    {
      id: "q6",
      dimension: t("assess.dimTeam"),
      dimensionIcon: "\uD83D\uDC65",
      text: t("assess.q6Text"),
      options: [
        { label: t("assess.q6Opt1"), value: 10 },
        { label: t("assess.q6Opt2"), value: 35 },
        { label: t("assess.q6Opt3"), value: 70 },
        { label: t("assess.q6Opt4"), value: 100 },
      ],
    },
    {
      id: "q7",
      dimension: t("assess.dimCompliance"),
      dimensionIcon: "\uD83D\uDEE1\uFE0F",
      text: t("assess.q7Text"),
      options: [
        { label: t("assess.q7Opt1"), value: 30 },
        { label: t("assess.q7Opt2"), value: 50 },
        { label: t("assess.q7Opt3"), value: 80 },
        { label: t("assess.q7Opt4"), value: 100 },
      ],
    },
    {
      id: "q8",
      dimension: t("assess.dimCompliance"),
      dimensionIcon: "\uD83D\uDEE1\uFE0F",
      text: t("assess.q8Text"),
      options: [
        { label: t("assess.q8Opt1"), value: 20 },
        { label: t("assess.q8Opt2"), value: 45 },
        { label: t("assess.q8Opt3"), value: 75 },
        { label: t("assess.q8Opt4"), value: 100 },
      ],
    },
  ];
}

function getGrade(score: number, t: (key: string) => string): { grade: string; color: string; label: string; recommendation: string } {
  if (score >= 80) return { grade: "A", color: "#22c55e", label: t("assess.gradeALabel"), recommendation: t("assess.gradeARec") };
  if (score >= 60) return { grade: "B", color: "#38bdf8", label: t("assess.gradeBLabel"), recommendation: t("assess.gradeBRec") };
  if (score >= 40) return { grade: "C", color: "#f59e0b", label: t("assess.gradeCLabel"), recommendation: t("assess.gradeCRec") };
  return { grade: "D", color: "#ef4444", label: t("assess.gradeDLabel"), recommendation: t("assess.gradeDRec") };
}

function generateLinkedInPost(score: number, grade: { grade: string; label: string }): string {
  return `Just took the TechFides AI Readiness Assessment and scored ${score}/100 (Grade: ${grade.grade} - ${grade.label}).

${score >= 60
    ? "Turns out we're ready to own our AI infrastructure instead of renting it from the cloud. The data privacy angle is real."
    : "Eye-opening to see where the gaps are. Data readiness and governance are bigger blockers than the technology itself."
}

If you're an SMB leader wondering whether local AI makes sense for your business, try it yourself (takes 2 minutes):

https://techfides.com/assess

#AI #DataPrivacy #SMB #EnterpriseAI #TechFides`;
}

export default function AssessPage() {
  const { t } = useI18n();
  const [step, setStep] = useState(0); // 0 = intro, 1-8 = questions, 9 = results
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const QUESTIONS = buildQuestions(t);
  const DIMENSIONS = [t("assess.dimData"), t("assess.dimInfra"), t("assess.dimTeam"), t("assess.dimCompliance")];

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
  const grade = getGrade(overallScore, t);
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
    const text = encodeURIComponent(`Just scored ${overallScore}/100 on the TechFides AI Readiness Assessment. ${overallScore >= 60 ? "Ready to own our AI." : "Eye-opening gaps to fix."} Try it: https://techfides.com/assess #AI #DataPrivacy`);
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
              {t("assess.badge")}
            </div>
            <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              {t("assess.heroTitle")}{" "}
              <span className="text-electric-400">{t("assess.heroTitleHighlight")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              {t("assess.introBody")}
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
              {t("assess.startButton")}
            </button>
            <p className="mt-4 text-xs text-slate-500">
              {t("assess.noSignup")}
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
              {t("assess.yourScoreLabel")}
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
                {t("assess.gradeLabel")} {grade.grade} &mdash; {grade.label}
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
              {t("assess.shareTitle")}
            </h3>
            <p className="mt-2 text-center text-sm text-slate-400">
              {t("assess.shareSubtitle")}
            </p>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleCopyLinkedIn}
                className="flex items-center gap-2 rounded-lg bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#004182]"
              >
                {copied ? t("assess.copied") : t("assess.copyLinkedIn")}
              </button>
              <button
                onClick={handleShareTwitter}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700"
              >
                {t("assess.shareOnX")}
              </button>
            </div>

            {/* LinkedIn Post Preview */}
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/50 p-4">
              <p className="text-xs font-medium text-slate-400 mb-2">{t("assess.linkedInPreview")}</p>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {linkedInPost}
              </p>
            </div>
          </div>

          {/* Email Capture → GSE Pipeline */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-navy-900/50 p-8 text-center">
            <h3 className="text-lg font-bold text-slate-100">
              {t("assess.reportTitle")}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {t("assess.reportSubtitle")}
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
                          ? t("assess.reportSentNew")
                          : t("assess.reportSentUpdate")
                      );
                    }
                  } catch {
                    alert(t("assess.reportError"));
                  }
                }}
                className="rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-white hover:bg-electric-400"
              >
                {t("assess.sendReport")}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {t("assess.privacyNote")}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-400"
            >
              {overallScore >= 60 ? t("assess.ctaHighScore") : t("assess.ctaLowScore")}
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
            >
              {t("assess.seePricing")}
            </Link>
          </div>

          {/* Retake */}
          <div className="mt-8 text-center">
            <button
              onClick={() => { setStep(0); setAnswers({}); setEmail(""); }}
              className="text-sm text-slate-500 hover:text-electric-400"
            >
              {t("assess.retake")}
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
              {t("assess.questionOf").replace("{current}", String(step)).replace("{total}", String(totalQuestions))}
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
              &larr; {t("assess.previous")}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
