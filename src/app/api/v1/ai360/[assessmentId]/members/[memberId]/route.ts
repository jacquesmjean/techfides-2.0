import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/v1/ai360/:assessmentId/members/:memberId
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string; memberId: string }> }
) {
  const { memberId } = await params;

  await db.aI360Member.delete({ where: { id: memberId } });
  return NextResponse.json({ success: true });
}
