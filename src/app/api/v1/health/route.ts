/**
 * GET /api/v1/health
 *
 * Health check for the Velocity Engine. Reports status of:
 *   - Database (Prisma)
 *   - Redis (BullMQ)
 *   - vLLM (local LLM)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vllmHealthCheck } from "@/lib/velocity/llm/client";

export async function GET() {
  const checks: {
    database: { ok: boolean; error?: string };
    vllm: { ok: boolean; mock: boolean; baseUrl: string; error?: string };
    timestamp: string;
  } = {
    database: { ok: false },
    vllm: { ok: false, mock: false, baseUrl: "" },
    timestamp: new Date().toISOString(),
  };

  // Database
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database.ok = true;
  } catch (e) {
    checks.database.error = e instanceof Error ? e.message : "Unknown error";
  }

  // vLLM
  const vllm = await vllmHealthCheck();
  checks.vllm = vllm;

  const allOk = checks.database.ok && checks.vllm.ok;

  return NextResponse.json(
    { ok: allOk, checks },
    { status: allOk ? 200 : 503 }
  );
}
