/**
 * POST /api/v1/forecast/compute
 *   Trigger a fresh forecast computation. Writes a ForecastRun row.
 *
 * GET  /api/v1/forecast/compute
 *   Return the most recent published ForecastRun for the given period.
 *
 * Query params (both methods):
 *   period: MONTHLY | QUARTERLY | YEARLY  (default YEARLY)
 *   target: number   (annual target in dollars; only respected on POST)
 *   publish: 'true' | 'false'  (default true; set false to save as DRAFT)
 */

import { NextResponse } from "next/server";
import { computeForecast, getCurrentForecast } from "@/lib/forecast/compute";
import type { ForecastPeriod } from "@prisma/client";

const VALID_PERIODS: ForecastPeriod[] = ["MONTHLY", "QUARTERLY", "YEARLY"];

function parsePeriod(input: string | null): ForecastPeriod {
  const upper = (input || "YEARLY").toUpperCase() as ForecastPeriod;
  return VALID_PERIODS.includes(upper) ? upper : "YEARLY";
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const period = parsePeriod(url.searchParams.get("period"));
  const target = url.searchParams.get("target");
  const publish = url.searchParams.get("publish") !== "false";

  try {
    const run = await computeForecast({
      period,
      annualTarget: target ? parseInt(target, 10) : undefined,
      computedBy: url.searchParams.get("by") || "manual",
      publish,
    });
    return NextResponse.json(
      {
        ok: true,
        forecast: run,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[forecast/compute] failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const period = parsePeriod(url.searchParams.get("period"));

  try {
    const run = await getCurrentForecast(period);
    if (!run) {
      return NextResponse.json(
        {
          ok: false,
          error: `No published forecast for period ${period}. Run POST first.`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, forecast: run });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
