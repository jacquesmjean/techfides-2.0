import { NextResponse } from "next/server";

import { signDealRoom } from "@/lib/sales/onboarding";

/**
 * POST /api/v1/deal-rooms/[id]/sign
 *
 * Marks a DealRoom as SIGNED and runs the full client onboarding chain:
 *   1. DealRoom.status -> SIGNED, all unsigned docs marked signed
 *   2. Lead.stage -> CLOSED_WON
 *   3. ClientAccount created (idempotent on email)
 *   4. Project created (idempotent on leadId)
 *   5. On-disk folder scaffolded under <opsRoot>/Clients/<Company>/
 *   6. Signed SOW / contract docs copied into 02-Agreement/
 *
 * Idempotent. Safe to retry.
 *
 * Returns 200 with the full onboarding result, or 500 if the chain fails
 * mid-way (DB writes already committed are not rolled back — the chain is
 * designed to be re-runnable).
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await signDealRoom(id);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
