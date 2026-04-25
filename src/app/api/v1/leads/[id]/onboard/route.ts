import { NextResponse } from "next/server";

import { onboardClientFromLead } from "@/lib/sales/onboarding";

/**
 * POST /api/v1/leads/[id]/onboard
 *
 * Manually run the client onboarding chain for a Lead. Useful when:
 *   - A deal closed via a path that didn't trigger automation
 *   - You want to re-run after fixing a folder mount or template
 *   - Backfill onboarding for legacy CLOSED_WON leads
 *
 * Idempotent: matches existing ClientAccount by email, existing Project
 * by leadId, and folder by name. Won't duplicate.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await onboardClientFromLead(id);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
