/**
 * Revenue Intelligence Monitor
 *
 * Continuously analyzes the revenue pipeline to ensure no money
 * is left on the table. Provides recommendations to exceed goals.
 *
 * Checks:
 * 1. Pipeline leakage (leads falling through stages)
 * 2. Pricing optimization (deals closing below tier rates)
 * 3. Retainer utilization (clients not using their allocation)
 * 4. Upsell opportunities (clients ready for tier upgrade)
 * 5. Win rate trends and velocity changes
 */

import { db } from "@/lib/db";

export interface RevenueInsight {
  id: string;
  type: "leakage" | "upsell" | "pricing" | "velocity" | "goal";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedImpact: number; // $ value of the opportunity
  action: string;
}

export async function analyzeRevenue(): Promise<{
  insights: RevenueInsight[];
  totalOpportunity: number;
  metrics: {
    currentMRR: number;
    pipelineValue: number;
    avgDealSize: number;
    winRate: number;
    avgCycleTime: number;
    retainerUtilization: number;
  };
}> {
  const insights: RevenueInsight[] = [];

  try {
    // ---- CORE METRICS ----
    const activeClients = await db.clientAccount.findMany({ where: { status: "ACTIVE" } });
    const currentMRR = activeClients.reduce((s, c) => s + c.retainerAmount, 0);

    const activeLeads = await db.lead.findMany({
      where: { stage: { in: ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] } },
    });
    const pipelineValue = activeLeads.reduce((s, l) => s + l.dealValue, 0);

    const closedWon = await db.lead.findMany({ where: { stage: "CLOSED_WON" } });
    const closedLost = await db.lead.findMany({ where: { stage: "CLOSED_LOST" } });
    const winRate = closedWon.length + closedLost.length > 0
      ? (closedWon.length / (closedWon.length + closedLost.length)) * 100
      : 0;
    const avgDealSize = closedWon.length > 0
      ? closedWon.reduce((s, l) => s + l.dealValue, 0) / closedWon.length
      : 0;

    // Retainer utilization
    const clientsWithTickets = await db.clientAccount.findMany({
      where: { status: "ACTIVE" },
      include: { _count: { select: { tickets: true } } },
    });
    const utilizingClients = clientsWithTickets.filter((c) => c._count.tickets > 0).length;
    const retainerUtilization = clientsWithTickets.length > 0
      ? (utilizingClients / clientsWithTickets.length) * 100
      : 0;

    // ---- 1. PIPELINE LEAKAGE ----

    // Leads stuck in proposal/negotiation too long
    const stuckLeads = activeLeads.filter((l) =>
      (l.stage === "PROPOSAL" || l.stage === "NEGOTIATION") && l.staleDays >= 7
    );
    if (stuckLeads.length > 0) {
      const stuckValue = stuckLeads.reduce((s, l) => s + l.dealValue, 0);
      insights.push({
        id: "leakage-stuck-deals",
        type: "leakage",
        severity: "high",
        title: `${stuckLeads.length} deals stuck in late pipeline`,
        description: `$${stuckValue.toLocaleString()} in proposal/negotiation with no activity for 7+ days. These deals are cooling.`,
        estimatedImpact: stuckValue * 0.3, // 30% at risk
        action: "Schedule follow-up calls this week. Use urgency hooks from the Velocity Engine.",
      });
    }

    // Leads with high heat but low pipeline stage
    const understagedLeads = activeLeads.filter((l) =>
      l.heatScore >= 70 && (l.stage === "PROSPECT" || l.stage === "QUALIFIED")
    );
    if (understagedLeads.length > 0) {
      const underValue = understagedLeads.reduce((s, l) => s + l.dealValue, 0);
      insights.push({
        id: "leakage-understaged",
        type: "leakage",
        severity: "medium",
        title: `${understagedLeads.length} hot leads not advanced to proposal`,
        description: `Heat score 70+ but still in early stage. They're engaged — advance them before interest cools.`,
        estimatedImpact: underValue * 0.5,
        action: "Send proposals to these leads immediately. The buyer signals are strong.",
      });
    }

    // ---- 2. UPSELL OPPORTUNITIES ----

    // Active Silver clients who could upgrade
    const silverClients = activeClients.filter((c) => c.tier === "Silver");
    if (silverClients.length > 0) {
      const upgradeRevenue = silverClients.length * 500; // $500/mo upgrade per client
      insights.push({
        id: "upsell-silver-to-gold",
        type: "upsell",
        severity: "medium",
        title: `${silverClients.length} Silver clients eligible for Gold upgrade`,
        description: `Each upgrade adds $500/mo to MRR. Total opportunity: $${upgradeRevenue.toLocaleString()}/mo ($${(upgradeRevenue * 12).toLocaleString()}/yr).`,
        estimatedImpact: upgradeRevenue * 12,
        action: "Send ROI comparison: Silver vs Gold benefits. Highlight additional models and priority support.",
      });
    }

    // Clients with high ticket volume = might need higher tier
    const highTicketClients = clientsWithTickets.filter((c) => c._count.tickets >= 5);
    // TODO(schema-migration): client.tier values are still the old Silver/Gold/Platinum
    // strings in the DB. When the Prisma schema is updated to the new Starter/Growth/
    // Scale/Enterprise subscription tiers, update this upgrade path and the mapping
    // in the `action` string below. Tracked in Projects/TechFides-Site-Rebuild/Build-Decisions.md.
    for (const client of highTicketClients) {
      if (client.tier !== "Platinum") {
        const nextTier = client.tier === "Silver" ? "Growth" : "Scale";
        insights.push({
          id: `upsell-heavy-user-${client.id}`,
          type: "upsell",
          severity: "low",
          title: `${client.companyName} has ${client._count.tickets} tickets — consider tier upgrade`,
          description: `High support usage suggests growing AI dependency. Candidate for a higher-tier subscription with more agent-hours and priority support.`,
          estimatedImpact: 1000 * 12,
          action: `Propose ${nextTier} subscription with Priority Support add-on.`,
        });
      }
    }

    // ---- 3. PRICING OPTIMIZATION ----

    // Deals closing below standard tier pricing
    const belowRate = closedWon.filter((l) => {
      if (l.dealValue < 5000) return true; // below Silver SOW
      return false;
    });
    if (belowRate.length > 0) {
      insights.push({
        id: "pricing-below-rate",
        type: "pricing",
        severity: "medium",
        title: `${belowRate.length} deals closed below standard Silver pricing`,
        description: "Discounting erodes margins. Enforce minimum $5K SOW for all new deals.",
        estimatedImpact: belowRate.length * 2000,
        action: "Update sales playbook: no deals below Silver tier SOW ($5K). Use ROI calculator to justify value.",
      });
    }

    // ---- 4. VELOCITY OPTIMIZATION ----

    // Slow pipeline = money sitting idle
    if (activeLeads.length > 0) {
      const avgStale = activeLeads.reduce((s, l) => s + l.staleDays, 0) / activeLeads.length;
      if (avgStale > 5) {
        insights.push({
          id: "velocity-slow-pipeline",
          type: "velocity",
          severity: "high",
          title: `Pipeline moving slowly: ${avgStale.toFixed(1)} avg stale days`,
          description: `$${pipelineValue.toLocaleString()} sitting in pipeline. Each day of delay costs momentum.`,
          estimatedImpact: pipelineValue * 0.1,
          action: "Increase outreach cadence. Enable auto-follow-up for leads with no response after 3 days.",
        });
      }
    }

    // ---- 5. GOAL TRACKING ----

    // If MRR is low relative to pipeline
    if (pipelineValue > 0 && currentMRR < pipelineValue * 0.1) {
      insights.push({
        id: "goal-conversion-gap",
        type: "goal",
        severity: "high",
        title: "MRR is low relative to pipeline value",
        description: `$${currentMRR.toLocaleString()} MRR vs $${pipelineValue.toLocaleString()} pipeline. Conversion rate needs improvement.`,
        estimatedImpact: pipelineValue * 0.2,
        action: "Focus on closing existing proposals before adding more leads to the top of funnel.",
      });
    }

    // Retainer clients not utilizing = churn risk = revenue risk
    if (retainerUtilization < 60) {
      const atRiskRevenue = activeClients
        .filter((c) => !clientsWithTickets.find((ct) => ct.id === c.id && ct._count.tickets > 0))
        .reduce((s, c) => s + c.retainerAmount * 12, 0);

      insights.push({
        id: "goal-underutilized-retainers",
        type: "goal",
        severity: "high",
        title: `${Math.round(100 - retainerUtilization)}% of retainer clients are underutilizing`,
        description: `$${atRiskRevenue.toLocaleString()}/yr at churn risk. Clients who don't use the service will cancel.`,
        estimatedImpact: atRiskRevenue,
        action: "Launch proactive value check-ins. Show clients what their retainer covers and schedule quarterly reviews.",
      });
    }

    const totalOpportunity = insights.reduce((s, i) => s + i.estimatedImpact, 0);

    return {
      insights,
      totalOpportunity,
      metrics: {
        currentMRR,
        pipelineValue,
        avgDealSize,
        winRate,
        avgCycleTime: activeLeads.length > 0 ? Math.round(activeLeads.reduce((s, l) => s + l.staleDays, 0) / activeLeads.length) : 0,
        retainerUtilization,
      },
    };

  } catch (error) {
    return {
      insights: [{
        id: "error",
        type: "goal",
        severity: "high",
        title: "Revenue analysis error",
        description: error instanceof Error ? error.message : "Unknown error",
        estimatedImpact: 0,
        action: "Check database connection",
      }],
      totalOpportunity: 0,
      metrics: { currentMRR: 0, pipelineValue: 0, avgDealSize: 0, winRate: 0, avgCycleTime: 0, retainerUtilization: 0 },
    };
  }
}
