/**
 * Forecast Compute — Single Source of Truth for Revenue Projections
 *
 * One function. Called once daily by cron. Called on-demand via
 * /api/v1/forecast/compute. Writes a fresh ForecastRun row that the
 * Forecast page, CEO Cockpit, and Intelligence API all read from.
 *
 * Until this lives, the platform has three competing pipeline-value
 * calculations that disagree. After this, there is one number.
 */

import { db } from "@/lib/db";
import type { ForecastPeriod } from "@prisma/client";

// Win-rate-by-stage. Tunable. Based on industry SMB benchmarks; refine
// once we have 90+ days of close data flowing through Activity.
const STAGE_WIN_RATES: Record<string, number> = {
  PROSPECT: 0.05,
  QUALIFIED: 0.20,
  PROPOSAL: 0.40,
  NEGOTIATION: 0.65,
  CLOSED_WON: 1.0,
  CLOSED_LOST: 0,
};

/**
 * Defensive stage normalization.
 *
 * The seed data and historical Lead rows store stage values in lowercase
 * kebab-case ("qualified", "closed-won"). The Prisma enum and the
 * STAGE_WIN_RATES keys are uppercase ("QUALIFIED", "CLOSED_WON").
 *
 * Without this normalization, every leadwith a lowercase stage value gets
 * a win rate of 0 and contributes nothing to the projection — which is
 * what caused the forecast to under-report by ~95% on first compute.
 *
 * This function accepts any common variant and returns the canonical
 * uppercase enum form. Unknown values return null and are excluded from
 * the projection (logged for diagnosis).
 */
function normalizeStage(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).trim().toUpperCase().replace(/-/g, "_");
  if (s in STAGE_WIN_RATES) return s;
  return null;
}

// Default annual target — TODO: move to config table or env var
const DEFAULT_ANNUAL_TARGET_USD = 500_000;

interface StageBreakdownEntry {
  count: number;
  value: number;
  weighted: number;
}

export interface ComputeForecastOptions {
  period?: ForecastPeriod;
  annualTarget?: number;
  computedBy?: string;
  publish?: boolean; // false = save as DRAFT for review
}

export async function computeForecast(options: ComputeForecastOptions = {}) {
  const period = options.period ?? "YEARLY";
  const annualTarget = options.annualTarget ?? DEFAULT_ANNUAL_TARGET_USD;
  const computedBy = options.computedBy ?? "cron";

  const now = new Date();
  const year = now.getFullYear();

  // Compute period bounds
  let periodStart: Date;
  let periodEnd: Date;
  if (period === "YEARLY") {
    periodStart = new Date(year, 0, 1);
    periodEnd = new Date(year, 11, 31, 23, 59, 59);
  } else if (period === "QUARTERLY") {
    const q = Math.floor(now.getMonth() / 3);
    periodStart = new Date(year, q * 3, 1);
    periodEnd = new Date(year, q * 3 + 3, 0, 23, 59, 59);
  } else {
    // MONTHLY
    periodStart = new Date(year, now.getMonth(), 1);
    periodEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);
  }

  // ─────────────────────────────────────────────────────────────────
  // Pull all leads with stage data
  // ─────────────────────────────────────────────────────────────────
  const leads = await db.lead.findMany({
    where: {
      tier: { not: "REJECTED" },
    },
    select: {
      id: true,
      stage: true,
      dealValue: true,
      assignedToId: true,
    },
  });

  // ─────────────────────────────────────────────────────────────────
  // Build stage-by-stage breakdown
  // ─────────────────────────────────────────────────────────────────
  const breakdown: Record<string, StageBreakdownEntry> = {};
  let projectedRevenue = 0;
  let ytdClosed = 0;

  for (const stage of Object.keys(STAGE_WIN_RATES)) {
    breakdown[stage] = { count: 0, value: 0, weighted: 0 };
  }

  let unrecognizedStageCount = 0;
  for (const lead of leads) {
    const stage = normalizeStage(lead.stage);
    const dealValue = lead.dealValue ?? 0;

    if (stage === null) {
      // Unknown stage value — log for diagnosis but don't pollute the
      // forecast. Common cause: a new stage was added to the enum but
      // not the win-rate map, or seed data has typos.
      unrecognizedStageCount += 1;
      continue;
    }

    const winRate = STAGE_WIN_RATES[stage] ?? 0;

    if (!breakdown[stage]) {
      breakdown[stage] = { count: 0, value: 0, weighted: 0 };
    }
    breakdown[stage].count += 1;
    breakdown[stage].value += dealValue;
    breakdown[stage].weighted += dealValue * winRate;

    if (stage === "CLOSED_WON") {
      ytdClosed += dealValue;
    } else if (stage !== "CLOSED_LOST") {
      // Active pipeline contributes to projection at win-rate
      projectedRevenue += dealValue * winRate;
    }
  }

  if (unrecognizedStageCount > 0) {
    console.warn(
      `[forecast] ${unrecognizedStageCount} lead(s) had unrecognized stage values and were excluded from projection`
    );
  }

  // Add YTD closed to projection (since closed is "in the bag")
  projectedRevenue += ytdClosed;

  // ─────────────────────────────────────────────────────────────────
  // MRR / ARR from ClientAccount (recurring revenue)
  // ─────────────────────────────────────────────────────────────────
  const accounts = await db.clientAccount.findMany({
    where: { status: "ACTIVE" },
    select: { retainerAmount: true },
  });
  const mrr = accounts.reduce((s, a) => s + (a.retainerAmount ?? 0), 0);
  const arr = mrr * 12;

  // For YEARLY forecasts, add ARR to projection (full year of MRR)
  if (period === "YEARLY") {
    projectedRevenue += arr;
  } else if (period === "QUARTERLY") {
    projectedRevenue += mrr * 3;
  } else {
    projectedRevenue += mrr;
  }

  // ─────────────────────────────────────────────────────────────────
  // Confidence — variance vs. last 3 published forecasts at same period
  // ─────────────────────────────────────────────────────────────────
  const recentForecasts = await db.forecastRun.findMany({
    where: { period, status: "PUBLISHED" },
    orderBy: { computedAt: "desc" },
    take: 3,
  });

  let confidence = 50; // default — no history
  if (recentForecasts.length > 0) {
    // Confidence = how stable have recent projections been?
    // High variance between recent runs = low confidence.
    const projections = recentForecasts.map((f) => f.projectedRevenue);
    const avg = projections.reduce((s, n) => s + n, 0) / projections.length;
    const maxDeviation = Math.max(...projections.map((p) => Math.abs(p - avg)));
    const variancePct = avg > 0 ? (maxDeviation / avg) * 100 : 0;

    if (variancePct < 5) confidence = 90;
    else if (variancePct < 15) confidence = 75;
    else if (variancePct < 30) confidence = 60;
    else if (variancePct < 50) confidence = 40;
    else confidence = 25;
  }

  // ─────────────────────────────────────────────────────────────────
  // Write the ForecastRun
  // ─────────────────────────────────────────────────────────────────
  const gapToTarget = annualTarget - Math.round(projectedRevenue);

  const run = await db.forecastRun.create({
    data: {
      period,
      periodStart,
      periodEnd,
      annualTarget,
      ytdClosed: Math.round(ytdClosed),
      projectedRevenue: Math.round(projectedRevenue),
      gapToTarget,
      breakdown: breakdown as never, // Prisma JSON
      mrr,
      arr,
      confidence,
      status: options.publish === false ? "DRAFT" : "PUBLISHED",
      computedBy,
    },
  });

  return run;
}

/**
 * Read the latest published ForecastRun for a given period.
 * This is what every consumer (Forecast page, CEO Cockpit,
 * Intelligence API) should call instead of computing pipeline value
 * locally.
 */
export async function getCurrentForecast(period: ForecastPeriod = "YEARLY") {
  return db.forecastRun.findFirst({
    where: { period, status: "PUBLISHED" },
    orderBy: { computedAt: "desc" },
  });
}
