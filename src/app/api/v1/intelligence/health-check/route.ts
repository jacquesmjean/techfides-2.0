/**
 * GET /api/v1/intelligence/health-check
 *
 * Runs a comprehensive system health check. Detects broken links,
 * stale data, lifecycle gaps, and performance issues.
 * Auto-fixes what it can, returns recommendations for the rest.
 *
 * Called by: CEO Cockpit (on load), scheduled cron (daily), manual trigger.
 */

import { NextResponse } from "next/server";
import { runHealthCheck } from "@/lib/velocity/intelligence/self-healing";

export async function GET() {
  const result = await runHealthCheck();

  return NextResponse.json({
    ...result,
    checkedAt: new Date().toISOString(),
    issueCount: result.issues.length,
    criticalCount: result.issues.filter((i) => i.severity === "critical").length,
    highCount: result.issues.filter((i) => i.severity === "high").length,
  });
}
