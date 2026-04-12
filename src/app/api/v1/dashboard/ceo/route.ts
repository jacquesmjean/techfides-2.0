/**
 * GET /api/v1/dashboard/ceo
 *
 * Aggregated metrics for the CEO Cockpit dashboard.
 * Pulls live data from PostgreSQL via Prisma.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Pipeline metrics
    const activeLeads = await db.lead.findMany({
      where: { stage: { in: ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] } },
    });

    const totalPipelineValue = activeLeads.reduce((s, l) => s + l.dealValue, 0);
    const weightedValue = activeLeads.reduce((s, l) => s + l.dealValue * (l.probability / 100), 0);
    const tier2Leads = activeLeads.filter((l) => l.dealValue >= 50000);
    const tier2Value = tier2Leads.reduce((s, l) => s + l.dealValue, 0);

    // Revenue
    const closedWon = await db.lead.findMany({ where: { stage: "CLOSED_WON" } });
    const closedThisMonth = closedWon.filter((l) => new Date(l.createdAt) >= monthStart);
    const mrr = closedWon.reduce((s, l) => s + l.monthlyRetainer, 0);

    // Hot leads
    const hotLeads = await db.lead.findMany({
      where: { heatScore: { gte: 70 }, stage: { in: ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] } },
      orderBy: { heatScore: "desc" },
      take: 5,
    });

    // Stale leads (alerts)
    const staleLeads = await db.lead.findMany({
      where: { staleDays: { gt: 3 }, stage: { in: ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] } },
      orderBy: { heatScore: "desc" },
      take: 10,
    });

    // Stage breakdown
    const stages = ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON"] as const;
    const stageBreakdown: Record<string, { count: number; value: number }> = {};
    for (const stage of stages) {
      const leads = activeLeads.filter((l) => l.stage === stage);
      stageBreakdown[stage] = {
        count: stage === "CLOSED_WON" ? closedWon.length : leads.length,
        value: stage === "CLOSED_WON" ? closedWon.reduce((s, l) => s + l.dealValue, 0) : leads.reduce((s, l) => s + l.dealValue, 0),
      };
    }

    // Projects
    const activeProjects = await db.project.count({ where: { status: "IN_PROGRESS" } });
    const overdueProjects = await db.project.count({
      where: { status: "IN_PROGRESS", plannedEnd: { lt: now } },
    });

    // Recent activities
    const recentActivities = await db.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { lead: { select: { company: true } } },
    });

    // Email drafts today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const draftsToday = await db.emailDraft.count({ where: { batchDate: { gte: todayStart } } });
    const sentToday = await db.emailDraft.count({ where: { batchDate: { gte: todayStart }, status: "SENT" } });

    // Machine health (from email drafts performance)
    const recentDrafts = await db.emailDraft.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { status: true },
    });
    const draftSuccessRate = recentDrafts.length > 0
      ? ((recentDrafts.filter((d) => d.status !== "FAILED").length / recentDrafts.length) * 100).toFixed(1)
      : "100";

    return NextResponse.json({
      pipeline: {
        totalValue: totalPipelineValue,
        weightedValue,
        activeLeadCount: activeLeads.length,
        tier2Value,
        tier2Count: tier2Leads.length,
        stageBreakdown,
      },
      revenue: {
        mrr,
        closedThisMonth: closedThisMonth.length,
        closedThisMonthValue: closedThisMonth.reduce((s, l) => s + l.dealValue, 0),
        totalClosedWon: closedWon.length,
      },
      hotLeads: hotLeads.map((l) => ({
        id: l.id,
        name: `${l.firstName} ${l.lastName}`,
        company: l.company,
        heatScore: l.heatScore,
        dealValue: l.dealValue,
        stage: l.stage,
      })),
      alerts: {
        staleCount: staleLeads.length,
        staleLeads: staleLeads.slice(0, 4).map((l) => ({
          id: l.id,
          name: `${l.firstName} ${l.lastName}`,
          company: l.company,
          heatScore: l.heatScore,
          dealValue: l.dealValue,
          staleDays: l.staleDays,
        })),
      },
      projects: {
        activeCount: activeProjects,
        overdueCount: overdueProjects,
      },
      outreach: {
        draftsToday,
        sentToday,
        successRate: draftSuccessRate,
      },
      recentActivities: recentActivities.map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        automated: a.automated,
        timestamp: a.createdAt.toISOString(),
        company: a.lead?.company || null,
      })),
    });
  } catch (error) {
    console.error("CEO dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
