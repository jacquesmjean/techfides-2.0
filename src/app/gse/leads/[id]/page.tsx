"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGSE } from "@/lib/gse/store";
import type { PipelineStage, ActivityType } from "@/lib/gse/types";
import {
  STAGE_CONFIG, SERVICE_CONFIG, VERTICAL_CONFIG, SOURCE_CONFIG,
} from "@/lib/gse/types";

const ACTIVITY_CONFIG: Record<ActivityType, { icon: string; color: string; bgColor: string }> = {
  "email-sent": { icon: "📧", color: "#60a5fa", bgColor: "#0c4a6e" },
  "email-received": { icon: "📬", color: "#60a5fa", bgColor: "#0c4a6e" },
  call: { icon: "☎️", color: "#f59e0b", bgColor: "#78350f" },
  meeting: { icon: "🤝", color: "#f59e0b", bgColor: "#78350f" },
  note: { icon: "📝", color: "#94a3b8", bgColor: "#1e293b" },
  "stage-change": { icon: "📊", color: "#a78bfa", bgColor: "#4c1d95" },
  "deal-room-created": { icon: "🔐", color: "#06b6d4", bgColor: "#164e63" },
  "document-sent": { icon: "📄", color: "#06b6d4", bgColor: "#164e63" },
  "document-signed": { icon: "✍️", color: "#22c55e", bgColor: "#14532d" },
  "payment-received": { icon: "💳", color: "#22c55e", bgColor: "#14532d" },
  "task-completed": { icon: "✅", color: "#22c55e", bgColor: "#14532d" },
  "auto-nurture": { icon: "🌱", color: "#8b5cf6", bgColor: "#3730a3" },
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getLeadById, getActivitiesForLead, moveLead } = useGSE();

  const leadId = params.id as string;
  const lead = getLeadById(leadId);
  const activities = getActivitiesForLead(leadId);

  if (!lead) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-screen">
        <p className="text-slate-400 text-lg font-medium">Lead not found</p>
        <Link href="/gse/leads" className="text-sky-400 hover:text-sky-300 mt-4">
          Back to Leads
        </Link>
      </div>
    );
  }

  const handleStageChange = (stage: PipelineStage) => {
    moveLead(lead.id, stage);
  };

  const relativeDate = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "just now";
    if (diffHours < 1) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const heatColor = () => {
    if (lead.heatScore >= 75) return "from-green-500 to-emerald-500";
    if (lead.heatScore >= 50) return "from-yellow-500 to-amber-500";
    return "from-red-500 to-orange-500";
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-sky-400 hover:text-sky-300 font-medium text-sm flex items-center gap-1 transition"
      >
        ← Back
      </button>

      {/* Lead Header */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-100">
              {lead.contact.firstName} {lead.contact.lastName}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {lead.contact.title} at {lead.contact.company}
            </p>
          </div>

          {/* Action Buttons - Top Right */}
          <div className="flex gap-2">
            <Link
              href="/gse/deal-room/new"
              className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/50 rounded-lg font-medium text-sm transition"
            >
              Create Deal Room
            </Link>
            <button
              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/50 rounded-lg font-medium text-sm transition"
            >
              Start Nurture
            </button>
            <div className="relative group">
              <button
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm transition border border-slate-700"
              >
                Change Stage ▼
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {(Object.keys(STAGE_CONFIG) as PipelineStage[]).map((stage) => (
                  <button
                    key={stage}
                    onClick={() => handleStageChange(stage)}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-700 text-sm flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
                      lead.stage === stage ? "bg-sky-600 text-sky-100" : "text-slate-300"
                    }`}
                  >
                    <span>{STAGE_CONFIG[stage].icon}</span>
                    {STAGE_CONFIG[stage].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info & Badges */}
        <div className="pt-4 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase">Email</p>
              <a
                href={`mailto:${lead.contact.email}`}
                className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
              >
                {lead.contact.email}
              </a>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Phone</p>
              <a
                href={`tel:${lead.contact.phone}`}
                className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
              >
                {lead.contact.phone}
              </a>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 items-center">
            <span
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: STAGE_CONFIG[lead.stage].bgColor,
                color: STAGE_CONFIG[lead.stage].color,
              }}
            >
              {STAGE_CONFIG[lead.stage].label}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300">
              {VERTICAL_CONFIG[lead.vertical].icon} {VERTICAL_CONFIG[lead.vertical].label}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300">
              {SERVICE_CONFIG[lead.service].icon} {SERVICE_CONFIG[lead.service].label}
            </span>

            {/* Heat Score Gauge */}
            <div className="ml-auto flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase">Heat Score</p>
                <p className="text-lg font-bold text-slate-100">{lead.heatScore}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center relative overflow-hidden">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${heatColor()} opacity-20`}
                  style={{
                    clipPath: `polygon(0 ${100 - lead.heatScore}%, 100% ${100 - lead.heatScore}%, 100% 100%, 0 100%)`,
                  }}
                />
                <div className="absolute inset-1 rounded-full bg-slate-900" />
                <span className="relative text-sm font-bold text-slate-100">{lead.heatScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase mb-1">Deal Value</p>
          <p className="text-2xl font-bold text-slate-100">
            ${lead.dealValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase mb-1">SOW Cost</p>
          <p className="text-2xl font-bold text-slate-100">
            ${lead.sowCost.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase mb-1">Monthly Retainer</p>
          <p className="text-2xl font-bold text-slate-100">
            ${lead.monthlyRetainer.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase mb-1">Gross Margin</p>
          <p className="text-2xl font-bold text-emerald-400">{lead.grossMargin}%</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Activity Timeline (2 cols) */}
        <div className="col-span-2">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Activity Timeline</h2>

            {activities.length === 0 ? (
              <p className="text-slate-400 text-sm py-8">No activities yet</p>
            ) : (
              <div className="space-y-6">
                {activities.map((activity, idx) => {
                  const cfg = ACTIVITY_CONFIG[activity.type];
                  return (
                    <div key={activity.id} className="flex gap-4">
                      {/* Timeline Dot & Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                          style={{
                            backgroundColor: cfg.bgColor,
                            color: cfg.color,
                          }}
                        >
                          {cfg.icon}
                        </div>
                        {idx < activities.length - 1 && (
                          <div
                            className="w-0.5 h-8 mt-2"
                            style={{ backgroundColor: cfg.color }}
                          />
                        )}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-100">{activity.title}</h3>
                          {activity.automated && (
                            <span className="px-2 py-0.5 bg-purple-600/30 text-purple-300 text-xs rounded-full font-medium">
                              Automated
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Deal Info Panel */}
        <div className="col-span-1 space-y-4">
          {/* Tags */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase">Tags</h3>
            {lead.tags.length === 0 ? (
              <p className="text-slate-500 text-xs">No tags</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Source */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase">Source</h3>
            <p className="text-sm text-slate-300">
              {SOURCE_CONFIG[lead.source].icon} {SOURCE_CONFIG[lead.source].label}
            </p>
          </div>

          {/* Assigned To */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase">Assigned To</h3>
            <p className="text-sm text-slate-300">{lead.assignedTo}</p>
          </div>

          {/* Referral Partner */}
          {lead.referralPartner && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase">Referral Partner</h3>
              <p className="text-sm text-slate-300">{lead.referralPartner}</p>
            </div>
          )}

          {/* Deal Room Status */}
          {lead.dealRoomId && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase">Deal Room</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded">
                  {lead.dealRoomStatus || "Draft"}
                </span>
              </div>
              <Link
                href={`/gse/deal-room/${lead.dealRoomId}`}
                className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
              >
                View Deal Room →
              </Link>
            </div>
          )}

          {/* Nurture Status */}
          {lead.nurtureSequenceId && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase">Nurture Status</h3>
              <span className="text-xs font-medium bg-purple-600/30 text-purple-300 px-2 py-1 rounded">
                {lead.nurtureStatus || "Active"}
              </span>
            </div>
          )}

          {/* Key Dates */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase">Key Dates</h3>
            <div className="text-xs space-y-2">
              <div>
                <p className="text-slate-500">Created</p>
                <p className="text-slate-300 font-medium">{formatDate(lead.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-500">Last Activity</p>
                <p className="text-slate-300 font-medium">{relativeDate(lead.lastActivity)}</p>
              </div>
              <div>
                <p className="text-slate-500">Expected Close</p>
                <p className="text-slate-300 font-medium">{formatDate(lead.expectedCloseDate)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase">Notes</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{lead.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
