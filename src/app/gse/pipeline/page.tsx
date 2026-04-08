"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGSE } from "@/lib/gse/store";
import {
  STAGE_CONFIG,
  SERVICE_CONFIG,
  VERTICAL_CONFIG,
  type PipelineStage,
  type Vertical,
  type ServiceType,
} from "@/lib/gse/types";

const ACTIVE_STAGES: PipelineStage[] = [
  "prospect",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
];

const VERTICALS_LIST: Vertical[] = [
  "legal",
  "medical",
  "auto",
  "trades",
  "property-management",
];

const SERVICES_LIST: ServiceType[] = [
  "sovereign-ai",
  "ai-readiness-360",
  "transformation-management",
  "tedos",
];

/**
 * Format currency value to readable format (e.g., $10,000)
 */
function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

/**
 * Calculate days between two ISO dates
 */
function daysSince(isoDate: string): number {
  const past = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - past.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Heat score color indicator
 */
function getHeatColor(score: number): string {
  if (score >= 75) return "bg-accent-green";
  if (score >= 50) return "bg-accent-amber";
  if (score >= 25) return "bg-electric-500";
  return "bg-slate-700";
}

/**
 * Get previous and next stages for navigation
 */
function getAdjacentStages(currentStage: PipelineStage): {
  prev?: PipelineStage;
  next?: PipelineStage;
} {
  const index = ACTIVE_STAGES.indexOf(currentStage);
  return {
    prev: index > 0 ? ACTIVE_STAGES[index - 1] : undefined,
    next: index < ACTIVE_STAGES.length - 1 ? ACTIVE_STAGES[index + 1] : undefined,
  };
}

/**
 * Lead Card Component
 */
function LeadCard({
  lead,
  onMove,
}: {
  lead: ReturnType<typeof useGSE>["leads"][0];
  onMove: (leadId: string, newStage: PipelineStage) => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const adjacent = getAdjacentStages(lead.stage);
  const daysSinceActivity = daysSince(lead.lastActivity);
  const serviceConfig = SERVICE_CONFIG[lead.service];
  const verticalConfig = VERTICAL_CONFIG[lead.vertical];
  const stageConfig = STAGE_CONFIG[lead.stage];

  const handleMove = (newStage: PipelineStage) => {
    setIsAnimating(true);
    onMove(lead.id, newStage);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Link href={`/gse/leads/${lead.id}`}>
      <div
        className={`group cursor-pointer rounded-lg border border-slate-800 bg-slate-900 p-4 transition-all hover:border-slate-700 hover:bg-slate-800 ${
          isAnimating ? "scale-95 opacity-75" : "scale-100 opacity-100"
        }`}
      >
        {/* Contact Name + Company */}
        <div className="mb-3">
          <h3 className="font-semibold text-white group-hover:text-electric-400">
            {lead.contact.firstName} {lead.contact.lastName}
          </h3>
          <p className="text-sm text-slate-400">{lead.contact.company}</p>
        </div>

        {/* Deal Value */}
        <div className="mb-3 text-xl font-bold text-accent-green">
          {formatCurrency(lead.dealValue)}
        </div>

        {/* Service Badge + Vertical Icon */}
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
            {serviceConfig.icon} {serviceConfig.label}
          </span>
          <span className="text-sm text-slate-500">{verticalConfig.icon}</span>
        </div>

        {/* Heat Score Indicator */}
        <div className="mb-2 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getHeatColor(lead.heatScore)}`} />
          <span className="text-xs text-slate-500">Heat: {lead.heatScore}</span>
        </div>

        {/* Days in Stage */}
        <div className="mb-2 text-xs text-slate-500">
          Days in stage: {daysSince(lead.createdAt)}
        </div>

        {/* Last Activity */}
        <div className="mb-3 text-xs text-slate-600">
          Last activity: {daysSinceActivity}d ago
        </div>

        {/* Stage Change Buttons */}
        <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
          {adjacent.prev && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleMove(adjacent.prev!);
              }}
              className="flex-1 rounded bg-slate-800 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
              title={`Move to ${STAGE_CONFIG[adjacent.prev].label}`}
            >
              ← Prev
            </button>
          )}
          {adjacent.next && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleMove(adjacent.next!);
              }}
              className="flex-1 rounded bg-slate-800 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
              title={`Move to ${STAGE_CONFIG[adjacent.next].label}`}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Kanban Column Component
 */
function KanbanColumn({
  stage,
  leads,
  onMoveLead,
}: {
  stage: PipelineStage;
  leads: ReturnType<typeof useGSE>["leads"];
  onMoveLead: (leadId: string, newStage: PipelineStage) => void;
}) {
  const stageLeads = leads.filter((l) => l.stage === stage);
  const config = STAGE_CONFIG[stage];
  const totalValue = stageLeads.reduce((sum, l) => sum + l.dealValue, 0);

  return (
    <div className="flex min-w-[380px] flex-col rounded-lg border border-slate-800 bg-slate-900/50">
      {/* Column Header */}
      <div
        className="border-b border-slate-800 p-4"
        style={{
          backgroundColor: config.bgColor,
          borderTopColor: config.color,
          borderTopWidth: "3px",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{config.icon}</span>
          <h2 className="font-semibold text-white">{config.label}</h2>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{stageLeads.length} leads</span>
          <span className="font-medium text-slate-300">
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {stageLeads.length > 0 ? (
            stageLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onMove={onMoveLead} />
            ))
          ) : (
            <div className="rounded bg-slate-800/30 py-8 text-center text-sm text-slate-500">
              No leads
            </div>
          )}
        </div>
      </div>

      {/* Column Footer */}
      {stage === "prospect" && (
        <div className="border-t border-slate-800 p-4">
          <button className="w-full rounded-lg border border-dashed border-slate-700 py-2 text-sm font-medium text-slate-400 transition hover:border-electric-500/50 hover:text-electric-400">
            + Add Lead
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Main Pipeline Page
 */
export default function PipelinePage() {
  const { leads, moveLead, getPipelineMetrics } = useGSE();
  const [viewMode] = useState<"kanban" | "list">("kanban");
  const [selectedVertical, setSelectedVertical] = useState<Vertical | "all">("all");
  const [selectedService, setSelectedService] = useState<ServiceType | "all">("all");

  const metrics = getPipelineMetrics();

  // Filter leads based on selections
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedVertical !== "all" && lead.vertical !== selectedVertical) {
        return false;
      }
      if (selectedService !== "all" && lead.service !== selectedService) {
        return false;
      }
      return true;
    });
  }, [leads, selectedVertical, selectedService]);

  // Calculate total value of filtered leads
  const totalPipelineValue = useMemo(() => {
    const activeLeads = filteredLeads.filter(
      (l) => l.stage !== "closed-won" && l.stage !== "closed-lost"
    );
    return activeLeads.reduce((sum, l) => sum + l.dealValue, 0);
  }, [filteredLeads]);

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto max-w-full">
          {/* Title and Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-white">Pipeline</h1>

            {/* View Toggle and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              {/* View Toggle */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
                <button
                  onClick={() => {
                    /* kanban mode - already selected */
                  }}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                    viewMode === "kanban"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => {
                    /* list mode - placeholder */
                  }}
                  className="rounded px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition"
                  disabled
                >
                  List
                </button>
              </div>

              {/* Vertical Filter */}
              <select
                value={selectedVertical}
                onChange={(e) =>
                  setSelectedVertical(e.target.value as Vertical | "all")
                }
                className="rounded border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-700"
              >
                <option value="all">All Verticals</option>
                {VERTICALS_LIST.map((v) => (
                  <option key={v} value={v}>
                    {VERTICAL_CONFIG[v].label}
                  </option>
                ))}
              </select>

              {/* Service Filter */}
              <select
                value={selectedService}
                onChange={(e) =>
                  setSelectedService(e.target.value as ServiceType | "all")
                }
                className="rounded border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-700"
              >
                <option value="all">All Services</option>
                {SERVICES_LIST.map((s) => (
                  <option key={s} value={s}>
                    {SERVICE_CONFIG[s].label}
                  </option>
                ))}
              </select>

              {/* Total Pipeline Value */}
              <div className="rounded bg-slate-900/50 px-4 py-1.5 text-sm text-slate-300">
                Pipeline: <span className="font-semibold text-accent-green">{formatCurrency(totalPipelineValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-6 py-6">
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-min pb-4">
            {ACTIVE_STAGES.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                leads={filteredLeads}
                onMoveLead={moveLead}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
