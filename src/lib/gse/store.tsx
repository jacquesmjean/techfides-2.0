"use client";
// ============================================================
// TechFides GSE — State Management (React Context)
// ============================================================

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type {
  Lead, Activity, NurtureSequence, PipelineStage, PipelineMetrics, RevenueMetrics,
} from "./types";
import { STAGE_CONFIG } from "./types";
import { SEED_LEADS, SEED_ACTIVITIES, SEED_NURTURE_SEQUENCES } from "./data";

interface GSEState {
  leads: Lead[];
  activities: Activity[];
  nurtureSequences: NurtureSequence[];
}

interface GSEActions {
  // Lead CRUD
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  moveLead: (id: string, stage: PipelineStage) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;

  // Activities
  addActivity: (activity: Activity) => void;
  getActivitiesForLead: (leadId: string) => Activity[];

  // Nurture
  addNurtureSequence: (seq: NurtureSequence) => void;
  updateNurtureSequence: (id: string, updates: Partial<NurtureSequence>) => void;

  // Metrics
  getPipelineMetrics: () => PipelineMetrics;
  getRevenueMetrics: () => RevenueMetrics;

  // Pipeline helpers
  getLeadsByStage: (stage: PipelineStage) => Lead[];
}

type GSEContextType = GSEState & GSEActions;

const GSEContext = createContext<GSEContextType | null>(null);

export function GSEProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [nurtureSequences, setNurtureSequences] = useState<NurtureSequence[]>(SEED_NURTURE_SEQUENCES);

  const addLead = useCallback((lead: Lead) => {
    setLeads((prev) => [...prev, lead]);
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const moveLead = useCallback((id: string, stage: PipelineStage) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage, lastActivity: new Date().toISOString() } : l)));
    // Auto-add stage change activity
    const lead = leads.find((l) => l.id === id);
    if (lead) {
      const newActivity: Activity = {
        id: `a-${Date.now()}`,
        leadId: id,
        type: "stage-change",
        title: `Stage: ${STAGE_CONFIG[lead.stage].label} → ${STAGE_CONFIG[stage].label}`,
        description: `Lead moved to ${STAGE_CONFIG[stage].label} stage.`,
        timestamp: new Date().toISOString(),
        automated: false,
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  }, [leads]);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const getLeadById = useCallback((id: string) => {
    return leads.find((l) => l.id === id);
  }, [leads]);

  const addActivity = useCallback((activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  }, []);

  const getActivitiesForLead = useCallback((leadId: string) => {
    return activities
      .filter((a) => a.leadId === leadId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activities]);

  const addNurtureSequence = useCallback((seq: NurtureSequence) => {
    setNurtureSequences((prev) => [...prev, seq]);
  }, []);

  const updateNurtureSequence = useCallback((id: string, updates: Partial<NurtureSequence>) => {
    setNurtureSequences((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const getLeadsByStage = useCallback((stage: PipelineStage) => {
    return leads.filter((l) => l.stage === stage);
  }, [leads]);

  const getPipelineMetrics = useCallback((): PipelineMetrics => {
    const activeLeads = leads.filter((l) => l.stage !== "closed-won" && l.stage !== "closed-lost");
    const totalValue = activeLeads.reduce((sum, l) => sum + l.dealValue, 0);
    const weightedValue = activeLeads.reduce((sum, l) => sum + l.dealValue * (l.probability / 100), 0);
    const wonLeads = leads.filter((l) => l.stage === "closed-won");
    const allDecided = leads.filter((l) => l.stage === "closed-won" || l.stage === "closed-lost");
    const conversionRate = allDecided.length > 0 ? (wonLeads.length / allDecided.length) * 100 : 0;

    const stageBreakdown = {} as Record<PipelineStage, { count: number; value: number }>;
    (Object.keys(STAGE_CONFIG) as PipelineStage[]).forEach((stage) => {
      const stageLeads = leads.filter((l) => l.stage === stage);
      stageBreakdown[stage] = {
        count: stageLeads.length,
        value: stageLeads.reduce((s, l) => s + l.dealValue, 0),
      };
    });

    return {
      totalLeads: activeLeads.length,
      totalValue,
      weightedValue,
      avgDealSize: activeLeads.length > 0 ? totalValue / activeLeads.length : 0,
      conversionRate,
      avgCycleTime: 35,
      stageBreakdown,
    };
  }, [leads]);

  const getRevenueMetrics = useCallback((): RevenueMetrics => {
    const wonLeads = leads.filter((l) => l.stage === "closed-won");
    const mrr = wonLeads.reduce((sum, l) => sum + l.monthlyRetainer, 0);
    const sowRevenue = wonLeads.reduce((sum, l) => sum + l.sowCost, 0);
    return {
      mrr,
      arr: mrr * 12,
      sowRevenue,
      totalClosed: wonLeads.length,
      closedThisMonth: 1,
      targetThisMonth: 50000,
      pipelineCoverage: 3.2,
    };
  }, [leads]);

  const value = useMemo<GSEContextType>(() => ({
    leads, activities, nurtureSequences,
    addLead, updateLead, moveLead, deleteLead, getLeadById,
    addActivity, getActivitiesForLead,
    addNurtureSequence, updateNurtureSequence,
    getPipelineMetrics, getRevenueMetrics, getLeadsByStage,
  }), [leads, activities, nurtureSequences, addLead, updateLead, moveLead, deleteLead, getLeadById, addActivity, getActivitiesForLead, addNurtureSequence, updateNurtureSequence, getPipelineMetrics, getRevenueMetrics, getLeadsByStage]);

  return <GSEContext.Provider value={value}>{children}</GSEContext.Provider>;
}

export function useGSE(): GSEContextType {
  const ctx = useContext(GSEContext);
  if (!ctx) throw new Error("useGSE must be used within a GSEProvider");
  return ctx;
}
