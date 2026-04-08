"use client";

import { useMemo, useState } from "react";
import { useGSE } from "@/lib/gse/store";
import type { NurtureStatus } from "@/lib/gse/types";

export default function NurturePage() {
  const { nurtureSequences, leads, updateNurtureSequence } = useGSE();
  const [expandedSequenceId, setExpandedSequenceId] = useState<string | null>(null);

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeCount = nurtureSequences.filter((s) => s.status === "active").length;
    const emailsSent = nurtureSequences.reduce((sum, seq) => {
      return (
        sum +
        seq.steps.filter((step) => step.type === "email" && step.completed).length
      );
    }, 0);
    const reEngagementRate = 34; // Placeholder
    return { activeCount, emailsSent, reEngagementRate };
  }, [nurtureSequences]);

  // Handle pause/resume
  const handleToggleSequence = (sequenceId: string, currentStatus: NurtureStatus) => {
    const newStatus: NurtureStatus = currentStatus === "active" ? "paused" : "active";
    updateNurtureSequence(sequenceId, { status: newStatus });
  };

  // Get lead info by ID
  const getLeadInfo = (leadId: string) => {
    return leads.find((l) => l.id === leadId);
  };

  // Status badge styling
  const getStatusBadgeStyle = (status: NurtureStatus) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "paused":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      case "completed":
        return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "scheduled":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusLabel = (status: NurtureStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Pipeline Self-Healing</h1>
        <p className="text-slate-400 mt-2">Automated nurture sequences keep leads warm 24/7</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-medium">Active Sequences</div>
          <div className="text-4xl font-bold text-emerald-400 mt-3">{metrics.activeCount}</div>
          <div className="text-xs text-slate-500 mt-2">Running now</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-medium">Emails Sent</div>
          <div className="text-4xl font-bold text-sky-400 mt-3">{metrics.emailsSent}</div>
          <div className="text-xs text-slate-500 mt-2">Completed email steps</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-medium">Re-engagement Rate</div>
          <div className="text-4xl font-bold text-cyan-400 mt-3">{metrics.reEngagementRate}%</div>
          <div className="text-xs text-slate-500 mt-2">Reply/engagement rate</div>
        </div>
      </div>

      {/* Sequence Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Active Nurture Sequences</h2>
        {nurtureSequences.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-400">No nurture sequences yet. Leads will auto-trigger sequences when stalled.</p>
          </div>
        ) : (
          nurtureSequences.map((sequence) => {
            const lead = getLeadInfo(sequence.leadId);
            const isExpanded = expandedSequenceId === sequence.id;
            const completedSteps = sequence.steps.filter((s) => s.completed).length;
            const completionPercentage = (completedSteps / sequence.steps.length) * 100;

            return (
              <div
                key={sequence.id}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all"
              >
                {/* Card Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() =>
                    setExpandedSequenceId(isExpanded ? null : sequence.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-slate-100">
                          {sequence.name}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeStyle(
                            sequence.status
                          )}`}
                        >
                          {getStatusLabel(sequence.status)}
                        </span>
                      </div>

                      {lead && (
                        <div className="text-sm text-slate-400 mb-3">
                          <span className="font-medium text-slate-300">
                            {lead.contact.firstName} {lead.contact.lastName}
                          </span>
                          {" • "}
                          <span>{lead.contact.company}</span>
                        </div>
                      )}

                      <div className="text-xs text-slate-500 mb-4">
                        Trigger: {sequence.triggerReason}
                      </div>

                      {/* Step Progress Dots */}
                      <div className="flex items-center gap-2">
                        {sequence.steps.map((step, idx) => {
                          let dotColor = "bg-slate-700";
                          let stepIcon = "•";

                          if (step.type === "email") stepIcon = "✉️";
                          else if (step.type === "wait") stepIcon = "⏳";
                          else if (step.type === "task") stepIcon = "✅";
                          else if (step.type === "condition") stepIcon = "🔀";

                          if (step.completed) {
                            dotColor = "bg-emerald-500";
                          } else if (idx === sequence.currentStep) {
                            dotColor = "bg-sky-500 animate-pulse";
                          }

                          return (
                            <div key={step.id} className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full ${dotColor} flex items-center justify-center text-xs font-bold text-slate-950 transition-all`}
                                title={`${step.type} - Step ${idx + 1}`}
                              >
                                {stepIcon}
                              </div>
                              {idx < sequence.steps.length - 1 && (
                                <div className="w-2 h-0.5 bg-slate-700 mx-1"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Completion Bar */}
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400">Progress</span>
                          <span className="text-xs font-bold text-sky-400">
                            {completedSteps} / {sequence.steps.length}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full transition-all"
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Controls */}
                    <div className="ml-6 flex flex-col items-end gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSequence(sequence.id, sequence.status);
                        }}
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                          sequence.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {sequence.status === "active" ? "Pause" : "Resume"}
                      </button>

                      <div className="text-right">
                        <div className="text-xs text-slate-500">Started</div>
                        <div className="text-sm font-medium text-slate-300">
                          {new Date(sequence.startedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </div>
                      </div>

                      {/* Expand Arrow */}
                      <div className="text-xl text-slate-500">
                        {isExpanded ? "▼" : "▶"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-800/30 p-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-300 mb-4">
                        Sequence Steps
                      </h4>
                      {sequence.steps.map((step, idx) => {
                        const isCompleted = step.completed;
                        const isCurrent = idx === sequence.currentStep;

                        let stepIcon = "•";
                        if (step.type === "email") stepIcon = "✉️";
                        else if (step.type === "wait") stepIcon = "⏳";
                        else if (step.type === "task") stepIcon = "✅";
                        else if (step.type === "condition") stepIcon = "🔀";

                        return (
                          <div
                            key={step.id}
                            className={`p-4 rounded border ${
                              isCompleted
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : isCurrent
                                  ? "bg-sky-500/10 border-sky-500/30"
                                  : "bg-slate-900 border-slate-700"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  isCompleted
                                    ? "bg-emerald-500 text-slate-950"
                                    : isCurrent
                                      ? "bg-sky-500 text-slate-950"
                                      : "bg-slate-700 text-slate-400"
                                }`}
                              >
                                {stepIcon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-slate-200">
                                    Step {idx + 1}: {step.subject || step.type}
                                  </span>
                                  {isCompleted && (
                                    <span className="text-xs text-emerald-400">
                                      ✓ Completed
                                    </span>
                                  )}
                                  {isCurrent && (
                                    <span className="text-xs text-sky-400">
                                      ● In Progress
                                    </span>
                                  )}
                                </div>

                                {step.body && (
                                  <p className="text-xs text-slate-400 mt-2">
                                    {step.body}
                                  </p>
                                )}

                                {step.type === "wait" && (
                                  <div className="text-xs text-slate-500 mt-2">
                                    Wait {step.waitDays} day{step.waitDays !== 1 ? "s" : ""}
                                  </div>
                                )}

                                {step.sentAt && (
                                  <div className="text-xs text-slate-500 mt-2">
                                    Sent:{" "}
                                    {new Date(step.sentAt).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* How It Works Panel */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
        <h2 className="text-lg font-bold text-slate-100 mb-8 text-center">
          How Pipeline Self-Healing Works
        </h2>

        <div className="grid grid-cols-4 gap-6">
          {/* Step 1: Trigger */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center mb-4 border border-sky-500/30">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">1. Detect Stall</h3>
            <p className="text-xs text-slate-400">
              Lead shows no activity for X days. System identifies dormant deal.
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-3xl text-sky-500">→</div>
          </div>

          {/* Step 2: Sequence */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 border border-cyan-500/30">
              <span className="text-3xl">📧</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">2. Launch Sequence</h3>
            <p className="text-xs text-slate-400">
              Auto-trigger personalized Value-Add email sequence for the vertical.
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-3xl text-cyan-500">→</div>
          </div>

          {/* Step 3: Response */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">3. Detect Response</h3>
            <p className="text-xs text-slate-400">
              Track opens, clicks, replies. Update lead sentiment and heat score.
            </p>
          </div>
        </div>

        {/* Bottom row for escalation */}
        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/30">
              <span className="text-3xl">📞</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">4. Escalate & Engage</h3>
            <p className="text-xs text-slate-400">
              If lead re-engages, notify sales. If no response after full sequence, escalate to manual follow-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
