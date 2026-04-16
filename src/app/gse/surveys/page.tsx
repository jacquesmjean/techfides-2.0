"use client";

import React, { useState, useMemo } from "react";
import { useGSE } from "@/lib/gse/store";
import { SEED_SURVEYS } from "@/lib/gse/data";
import { SERVICE_CONFIG, VERTICAL_CONFIG, type SurveyStatus, type SurveyResponse } from "@/lib/gse/types";

// ============================================================
// UTILITIES
// ============================================================

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getNPSColor(nps: number): string {
  if (nps >= 9) return "text-green-400";
  if (nps >= 7) return "text-amber-400";
  return "text-red-400";
}

function getNPSBgColor(nps: number): string {
  if (nps >= 9) return "bg-green-500/20 border border-green-500/30";
  if (nps >= 7) return "bg-amber-500/20 border border-amber-500/30";
  return "bg-red-500/20 border border-red-500/30";
}

function getSurveyStatusBadgeColor(status: SurveyStatus): string {
  const colors: Record<SurveyStatus, string> = {
    pending: "bg-slate-600 text-slate-100",
    sent: "bg-sky-600 text-sky-100",
    started: "bg-amber-600 text-amber-100",
    completed: "bg-green-600 text-green-100",
    expired: "bg-red-600 text-red-100",
  };
  return colors[status];
}

function getSurveyStatusLabel(status: SurveyStatus): string {
  const labels: Record<SurveyStatus, string> = {
    pending: "Pending",
    sent: "Sent",
    started: "Started",
    completed: "Completed",
    expired: "Expired",
  };
  return labels[status];
}

// ============================================================
// KPI METRIC CARD
// ============================================================

function MetricCard({
  label,
  value,
  unit = "",
  color = "text-slate-100",
  trend,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  trend?: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
        {unit && <span className="text-slate-500 text-sm">{unit}</span>}
      </div>
      {trend && <p className="text-xs text-slate-500 mt-3">{trend}</p>}
    </div>
  );
}

// ============================================================
// NPS DISTRIBUTION CHART
// ============================================================

function NPSDistributionChart({
  surveys,
}: {
  surveys: SurveyResponse[];
}) {
  const completed = surveys.filter((s) => s.status === "completed");

  const promoters = completed.filter((s) => s.nps >= 9).length;
  const passives = completed.filter((s) => s.nps >= 7 && s.nps < 9).length;
  const detractors = completed.filter((s) => s.nps < 7).length;
  const total = completed.length;

  const promotersPct = total > 0 ? Math.round((promoters / total) * 100) : 0;
  const passivesPct = total > 0 ? Math.round((passives / total) * 100) : 0;
  const detractorsPct = total > 0 ? Math.round((detractors / total) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">NPS Distribution</h3>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-8 bg-slate-800 rounded-full overflow-hidden flex">
          {promoters > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-xs font-bold text-slate-900"
              style={{ width: `${promotersPct}%` }}
            >
              {promotersPct > 15 && `${promotersPct}%`}
            </div>
          )}
          {passives > 0 && (
            <div
              className="bg-amber-500 flex items-center justify-center text-xs font-bold text-slate-900"
              style={{ width: `${passivesPct}%` }}
            >
              {passivesPct > 15 && `${passivesPct}%`}
            </div>
          )}
          {detractors > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-xs font-bold text-slate-900"
              style={{ width: `${detractorsPct}%` }}
            >
              {detractorsPct > 15 && `${detractorsPct}%`}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-green-400 font-semibold">{promoters}</p>
          <p className="text-slate-500">Promoters (9-10)</p>
        </div>
        <div>
          <p className="text-amber-400 font-semibold">{passives}</p>
          <p className="text-slate-500">Passives (7-8)</p>
        </div>
        <div>
          <p className="text-red-400 font-semibold">{detractors}</p>
          <p className="text-slate-500">Detractors (0-6)</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PERFORMANCE SCORECARD
// ============================================================

function PerformanceScorecard({
  surveys,
}: {
  surveys: SurveyResponse[];
}) {
  const completed = surveys.filter((s) => s.status === "completed");

  const avgScores = {
    projectDelivery: completed.length > 0 ? completed.reduce((sum, s) => sum + s.scores.projectDelivery, 0) / completed.length : 0,
    technicalAccuracy: completed.length > 0 ? completed.reduce((sum, s) => sum + s.scores.technicalAccuracy, 0) / completed.length : 0,
    easeOfImplementation: completed.length > 0 ? completed.reduce((sum, s) => sum + s.scores.easeOfImplementation, 0) / completed.length : 0,
    communication: completed.length > 0 ? completed.reduce((sum, s) => sum + s.scores.communication, 0) / completed.length : 0,
    problemSolving: completed.length > 0 ? completed.reduce((sum, s) => sum + s.scores.problemSolving, 0) / completed.length : 0,
    systemEasiness: completed.length > 0 ? completed.reduce((sum, s) => sum + s.scores.systemEasiness, 0) / completed.length : 0,
  };

  const scoreLabels = [
    { key: "projectDelivery", label: "Project Delivery" },
    { key: "technicalAccuracy", label: "Technical Accuracy" },
    { key: "easeOfImplementation", label: "Ease of Implementation" },
    { key: "communication", label: "Communication" },
    { key: "problemSolving", label: "Problem Solving" },
    { key: "systemEasiness", label: "System Easiness" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 5) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-6">Performance Scorecard</h3>
      <div className="space-y-4">
        {scoreLabels.map(({ key, label }) => {
          const score = avgScores[key as keyof typeof avgScores];
          const percentage = (score / 10) * 100;
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-slate-400">{label}</p>
                <p className={`text-sm font-bold ${score >= 8 ? "text-green-400" : score >= 5 ? "text-amber-400" : "text-red-400"}`}>
                  {score.toFixed(1)}/10
                </p>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreColor(score)} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SURVEY TABLE
// ============================================================

function SurveyTable({
  surveys,
  leads,
}: {
  surveys: SurveyResponse[];
  leads: ReturnType<typeof useGSE>["leads"];
}) {
  const getLeadInfo = (leadId: string) => {
    return leads.find((l) => l.id === leadId);
  };

  const getConsentIcons = (survey: SurveyResponse): string => {
    let icons = "";
    if (survey.consentTestimonial) icons += "📝";
    if (survey.consentLogo) icons += "✅";
    if (survey.consentSocial) icons += "📱";
    if (survey.consentVideo) icons += "🎥";
    if (survey.consentCaseStudy) icons += "📋";
    return icons || "—";
  };

  const getAvgScore = (survey: SurveyResponse): number => {
    const scores = Object.values(survey.scores);
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Service</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">NPS Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Avg Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Consents</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Referral</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Completed</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {surveys.map((survey) => {
              const lead = getLeadInfo(survey.leadId);
              const avgScore = getAvgScore(survey);
              return (
                <tr key={survey.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        {lead?.contact.firstName} {lead?.contact.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{lead?.contact.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-100">{SERVICE_CONFIG[lead?.service || "aegis"].label}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getSurveyStatusBadgeColor(
                        survey.status
                      )}`}
                    >
                      {getSurveyStatusLabel(survey.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${getNPSColor(survey.nps)}`}>{survey.nps}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-300">{avgScore.toFixed(1)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg">{getConsentIcons(survey)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300">
                      {survey.referralName || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-400">
                      {survey.completedAt ? formatDate(survey.completedAt) : "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-sky-100 rounded transition-colors">
                        View
                      </button>
                      {(survey.status === "pending" || survey.status === "expired") && (
                        <button className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors">
                          Resend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// SOCIAL PROOF ENGINE PANEL
// ============================================================

function SocialProofPanel({
  surveys,
  leads,
}: {
  surveys: SurveyResponse[];
  leads: ReturnType<typeof useGSE>["leads"];
}) {
  const surveysWithConsent = surveys.filter(
    (s) => s.consentTestimonial || s.consentLogo || s.consentSocial || s.consentVideo || s.consentCaseStudy
  );

  const getLeadName = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    return lead ? `${lead.contact.firstName} ${lead.contact.lastName}` : "Unknown";
  };

  const getConsentList = (survey: SurveyResponse): string[] => {
    const consents = [];
    if (survey.consentTestimonial) consents.push("Testimonial");
    if (survey.consentLogo) consents.push("Logo Usage");
    if (survey.consentSocial) consents.push("Social Media");
    if (survey.consentVideo) consents.push("Video");
    if (survey.consentCaseStudy) consents.push("Case Study");
    return consents;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Social Proof Pipeline</h3>
      {surveysWithConsent.length === 0 ? (
        <p className="text-slate-400 text-sm">No surveys with social proof consent yet.</p>
      ) : (
        <div className="space-y-4">
          {surveysWithConsent.map((survey) => {
            const consents = getConsentList(survey);
            const leadName = getLeadName(survey.leadId);
            return (
              <div key={survey.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{leadName}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {consents.map((consent) => (
                        <span key={consent} className="inline-block text-xs bg-sky-500/20 text-sky-300 px-2 py-1 rounded">
                          {consent}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    {survey.socialProofPublished ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400">
                        ✅ Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                </div>

                {survey.caseStudyDraft && (
                  <div className="bg-slate-900/50 border border-slate-700 rounded p-3 mb-3">
                    <p className="text-xs font-semibold text-slate-300 mb-2">Case Study Preview:</p>
                    <p className="text-xs text-slate-400 line-clamp-3">{survey.caseStudyDraft}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {!survey.socialProofPublished && (
                    <button className="flex-1 px-3 py-2 text-xs bg-green-600 hover:bg-green-700 text-green-100 rounded transition-colors font-semibold">
                      Approve & Publish
                    </button>
                  )}
                  {survey.caseStudyDraft && (
                    <button className="flex-1 px-3 py-2 text-xs bg-sky-600 hover:bg-sky-700 text-sky-100 rounded transition-colors font-semibold">
                      Edit & Publish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// REFERRAL PIPELINE PANEL
// ============================================================

function ReferralPanel({
  surveys,
}: {
  surveys: SurveyResponse[];
}) {
  const surveysWithReferrals = surveys.filter((s) => s.referralName && s.referralEmail);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Auto-Generated Referrals</h3>
      {surveysWithReferrals.length === 0 ? (
        <p className="text-slate-400 text-sm">No referrals generated yet.</p>
      ) : (
        <div className="space-y-4">
          {surveysWithReferrals.map((survey) => (
            <div key={survey.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-100">{survey.referralName}</p>
                <p className="text-xs text-slate-500">{survey.referralCompany}</p>
              </div>

              <div className="mb-3 space-y-1">
                <p className="text-xs text-slate-400">
                  <span className="font-medium">Email:</span> {survey.referralEmail}
                </p>
                <p className="text-xs text-slate-400">
                  <span className="font-medium">Source:</span> Referred by {survey.referralName === "Marcus Johnson" ? "David Ramirez" : "Client"}
                </p>
              </div>

              <div className="mb-3">
                <span className="inline-block text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-semibold">
                  New Lead
                </span>
              </div>

              <button className="w-full px-3 py-2 text-xs bg-sky-600 hover:bg-sky-700 text-sky-100 rounded transition-colors font-semibold">
                Create Lead in Pipeline
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXECUTIVE ALERTS PANEL
// ============================================================

function ExecutiveAlertsPanel({
  surveys,
  leads,
}: {
  surveys: SurveyResponse[];
  leads: ReturnType<typeof useGSE>["leads"];
}) {
  const completed = surveys.filter((s) => s.status === "completed");
  const alertedSurveys = completed.filter((s) => s.nps < 7);

  const getLeadName = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    return lead ? `${lead.contact.firstName} ${lead.contact.lastName}` : "Unknown";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Service Recovery Alerts</h3>

      {alertedSurveys.length === 0 ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-semibold">✅ No alerts — all clients satisfied</p>
          <p className="text-xs text-green-300/80 mt-1">All completed surveys have NPS ≥ 7</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {alertedSurveys.map((survey) => (
              <div key={survey.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-red-300">{getLeadName(survey.leadId)}</p>
                  <span className={`text-lg font-bold ${getNPSColor(survey.nps)}`}>{survey.nps}</span>
                </div>
                <p className="text-xs text-red-300/80 mb-2">
                  {survey.improvementSuggestions}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-red-100 rounded-lg transition-colors font-semibold">
            Trigger Executive Review
          </button>
        </>
      )}
    </div>
  );
}

// ============================================================
// AUTOMATION EXPLANATION PANEL
// ============================================================

function AutomationExplanation() {
  const automations = [
    {
      icon: "⚙️",
      title: "Auto-trigger on Closed-Won",
      description: "Surveys auto-trigger when a deal is marked Closed-Won",
    },
    {
      icon: "⭐",
      title: "Promoter Auto-Referral",
      description: "NPS > 9 → Auto-referral prompt in survey",
    },
    {
      icon: "🚨",
      title: "Low NPS Alert",
      description: "NPS < 7 → Executive alert for service recovery",
    },
    {
      icon: "🎯",
      title: "Consent-Triggered Publishing",
      description: "Consent given → Social proof published automatically",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">Automated Triggers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((auto, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-lg mb-1">{auto.icon}</p>
            <p className="text-xs font-semibold text-slate-200">{auto.title}</p>
            <p className="text-xs text-slate-500 mt-1">{auto.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function SurveysPage() {
  const { leads } = useGSE();
  const [surveys] = useState<SurveyResponse[]>(SEED_SURVEYS);

  const metrics = useMemo(() => {
    const sent = surveys.filter((s) => s.status !== "pending").length;
    const completed = surveys.filter((s) => s.status === "completed").length;
    const responseRate = sent > 0 ? ((completed / sent) * 100).toFixed(1) : "0";
    const avgNPS =
      completed > 0
        ? (surveys.filter((s) => s.status === "completed").reduce((sum, s) => sum + s.nps, 0) / completed).toFixed(1)
        : "—";
    const promoters = surveys.filter((s) => s.status === "completed" && s.nps >= 9).length;
    const referrals = surveys.filter((s) => s.referralName).length;
    const caseStudies = surveys.filter((s) => s.caseStudyDraft).length;

    return { sent, completed, responseRate, avgNPS, promoters, referrals, caseStudies };
  }, [surveys]);

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Post-Closure Reputation Engine</h1>
            <p className="text-slate-400">Automated surveys, social proof, and referral generation</p>
          </div>
          <button className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors">
            Send Survey
          </button>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard label="Surveys Sent" value={metrics.sent} color="text-sky-400" />
          <MetricCard
            label="Response Rate"
            value={metrics.responseRate}
            unit="%"
            color="text-sky-400"
          />
          <MetricCard
            label="Avg NPS Score"
            value={metrics.avgNPS}
            color={metrics.avgNPS === "—" ? "text-slate-400" : parseFloat(metrics.avgNPS as string) > 8 ? "text-green-400" : parseFloat(metrics.avgNPS as string) > 6 ? "text-amber-400" : "text-red-400"}
          />
          <MetricCard label="Promoters" value={metrics.promoters} color="text-green-400" />
          <MetricCard label="Referrals Generated" value={metrics.referrals} color="text-sky-400" />
          <MetricCard label="Case Studies" value={metrics.caseStudies} color="text-sky-400" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NPSDistributionChart surveys={surveys} />
          <PerformanceScorecard surveys={surveys} />
        </div>

        {/* Survey Table */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Survey Responses</h2>
          <SurveyTable surveys={surveys} leads={leads} />
        </div>

        {/* Social Proof & Referral Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SocialProofPanel surveys={surveys} leads={leads} />
          <ReferralPanel surveys={surveys} />
        </div>

        {/* Executive Alerts */}
        <div className="mb-8">
          <ExecutiveAlertsPanel surveys={surveys} leads={leads} />
        </div>

        {/* Automation Explanation */}
        <AutomationExplanation />
      </div>
    </div>
  );
}
