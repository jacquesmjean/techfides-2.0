import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/ai360/audit";

// PUT /api/v1/ai360/:assessmentId/evidence/:evidenceId — Update/verify evidence
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string; evidenceId: string }> }
) {
  const { assessmentId, evidenceId } = await params;
  const body = await req.json();

  const evidence = await db.aI360Evidence.findFirst({
    where: { id: evidenceId, assessmentId },
  });
  if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.aI360Evidence.update({
    where: { id: evidenceId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.verified !== undefined && { verified: body.verified }),
      ...(body.verifiedBy !== undefined && { verifiedBy: body.verifiedBy }),
      ...(body.sourceType !== undefined && { sourceType: body.sourceType }),
      ...(body.sourceUrl !== undefined && { sourceUrl: body.sourceUrl }),
    },
  });

  if (body.verified !== undefined) {
    await audit.evidenceVerified(assessmentId, evidenceId, body.verifiedBy || "analyst");
  }

  return NextResponse.json(updated);
}

// DELETE /api/v1/ai360/:assessmentId/evidence/:evidenceId
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string; evidenceId: string }> }
) {
  const { evidenceId } = await params;
  await db.aI360Evidence.delete({ where: { id: evidenceId } });
  return NextResponse.json({ success: true });
}
