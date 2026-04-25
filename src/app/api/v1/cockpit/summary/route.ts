/**
 * GET /api/v1/cockpit/summary
 *
 * Returns the data for all 6 CEO Cockpit tiles in a single round-trip.
 * The cockpit page is the single screen Jacques opens every morning.
 * Six tiles. All live. Zero mock.
 *
 * Tiles:
 *   1. Revenue Pulse        — from ForecastRun
 *   2. Active Pipeline      — from Lead (active stages)
 *   3. Action Required      — from Lead + Activity (aging deals, fresh replies)
 *   4. Engine Health        — from EmailDraft + Activity (last 7 days)
 *   5. Red Flag Alerts      — from Lead (proxy until Alert table ships in Phase 3)
 *   6. Forecast Confidence  — from ForecastRun history
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentForecast } from "@/lib/forecast/compute";

const ACTIVE_STAGES = ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] as const;

export async function GET() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // ─── 1. Revenue Pulse — from ForecastRun ───────────────────────
    const yearlyForecast = await getCurrentForecast("YEARLY");
    const recurringAccounts = await db.clientAccount.findMany({
      where: { status: "ACTIVE" },
      select: { retainerAmount: true },
    });
    const mrr = recurringAccounts.reduce((s, a) => s + (a.retainerAmount ?? 0), 0);
    const arr = mrr * 12;

    const revenuePulse = {
      annualTarget: yearlyForecast?.annualTarget ?? 500_000,
      ytdClosed: yearlyForecast?.ytdClosed ?? 0,
      projected: yearlyForecast?.projectedRevenue ?? 0,
      gap: yearlyForecast?.gapToTarget ?? 0,
      mrr,
      arr,
      lastComputed: yearlyForecast?.computedAt?.toISOString() ?? null,
    };

    // ─── 2. Active Pipeline — top 3 deals + summary ────────────────
    const activeLeads = await db.lead.findMany({
      where: { stage: { in: ACTIVE_STAGES as unknown as string[] } as never },
      select: { id: true, firstName: true, lastName: true, company: true, dealValue: true, stage: true, heatScore: true, staleDays: true },
      orderBy: { dealValue: "desc" },
      take: 50,
    });
    const activePipelineValue = activeLeads.reduce((s, l) => s + (l.dealValue ?? 0), 0);
    const top3Deals = activeLeads.slice(0, 3).map((l) => ({
      id: l.id,
      name: `${l.firstName} ${l.lastName}`.trim(),
      company: l.company,
      value: l.dealValue,
      stage: l.stage,
      heatScore: l.heatScore,
      staleDays: l.staleDays,
    }));

    // Coverage = pipeline / remaining target
    const remainingTarget = Math.max(revenuePulse.annualTarget - revenuePulse.ytdClosed, 1);
    const coverage = activePipelineValue / remainingTarget;

    const activePipeline = {
      count: activeLeads.length,
      value: activePipelineValue,
      coverage,
      top3: top3Deals,
    };

    // ─── 3. Action Required — what needs Jacques today? ────────────
    // Heuristic: deals aging past stage threshold + leads with reply activity
    // in the last 24 hrs (proxy for "needs response").
    const STAGE_AGE_THRESHOLDS: Record<string, number> = {
      QUALIFIED: 14,
      PROPOSAL: 21,
      NEGOTIATION: 14,
    };
    const agingDeals = activeLeads.filter((l) => {
      const limit = STAGE_AGE_THRESHOLDS[l.stage as unknown as string];
      return limit && (l.staleDays ?? 0) > limit;
    });

    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentReplies = await db.activity.count({
      where: { type: "EMAIL_RECEIVED", createdAt: { gte: oneDayAgo } },
    });

    const actionRequired = {
      agingDeals: agingDeals.slice(0, 3).map((l) => ({
        id: l.id,
        name: `${l.firstName} ${l.lastName}`.trim(),
        company: l.company,
        stage: l.stage,
        days: l.staleDays,
        value: l.dealValue,
      })),
      agingCount: agingDeals.length,
      recentReplies,
      total: agingDeals.length + recentReplies,
    };

    // ─── 4. Engine Health — last 7 days outreach metrics ───────────
    const sentLast7 = await db.emailDraft.count({
      where: { status: "SENT", sentAt: { gte: sevenDaysAgo } },
    });
    const sentLast14To7 = await db.emailDraft.count({
      where: {
        status: "SENT",
        sentAt: {
          gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: sevenDaysAgo,
        },
      },
    });
    const opensLast7 = await db.activity.count({
      where: { type: "EMAIL_OPENED", createdAt: { gte: sevenDaysAgo } },
    });
    const repliesLast7 = await db.activity.count({
      where: { type: "EMAIL_RECEIVED", createdAt: { gte: sevenDaysAgo } },
    });
    const replyRate = sentLast7 > 0 ? repliesLast7 / sentLast7 : 0;
    const sentTrend = sentLast14To7 > 0 ? (sentLast7 - sentLast14To7) / sentLast14To7 : 0;

    const engineHealth = {
      sent7: sentLast7,
      opens7: opensLast7,
      replies7: repliesLast7,
      replyRate,
      sentTrend,
    };

    // ─── 5. Red Flag Alerts — proxy until Alert table ships ────────
    // Heuristic: high-heat leads stuck in same stage > 14 days = at risk
    // OR closed-lost deals in last 30 days.
    const highHeatStale = await db.lead.count({
      where: {
        heatScore: { gte: 60 },
        staleDays: { gte: 14 },
        stage: { in: ACTIVE_STAGES as unknown as string[] } as never,
      },
    });
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLosses = await db.lead.count({
      where: {
        stage: "CLOSED_LOST" as never,
        updatedAt: { gte: thirtyDaysAgo },
      },
    });

    const redFlagAlerts = {
      highSeverity: highHeatStale,
      mediumSeverity: recentLosses,
      total: highHeatStale + recentLosses,
    };

    // ─── 6. Forecast Confidence — variance over time ───────────────
    const recentForecasts = await db.forecastRun.findMany({
      where: { period: "YEARLY", status: "PUBLISHED" },
      orderBy: { computedAt: "desc" },
      take: 10,
      select: { projectedRevenue: true, computedAt: true, confidence: true },
    });
    const forecastConfidence = {
      current: yearlyForecast?.confidence ?? 50,
      runs: recentForecasts.length,
      trend: recentForecasts.slice(0, 5).map((r) => r.projectedRevenue).reverse(),
      latestComputed: yearlyForecast?.computedAt?.toISOString() ?? null,
    };

    return NextResponse.json({
      ok: true,
      cockpit: {
        revenuePulse,
        activePipeline,
        actionRequired,
        engineHealth,
        redFlagAlerts,
        forecastConfidence,
      },
      generatedAt: now.toISOString(),
    });
  } catch (err) {
    console.error("[cockpit/summary] failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
