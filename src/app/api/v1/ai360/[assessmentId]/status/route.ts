import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeScores, ResponseInput } from "@/lib/ai360/scoring";
import { audit } from "@/lib/ai360/audit";
import { notifyStatusChange } from "@/lib/ai360/notifications";

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["ANALYZING", "DRAFT"],
  ANALYZING: ["PUBLISHED", "SUBMITTED"],
  PUBLISHED: ["DRAFT"],
};

// PUT /api/v1/ai360/:assessmentId/status — Transition status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const body = await req.json();
  const newStatus = body.status;

  const assessment = await db.aI360Assessment.findUnique({
    where: { id: assessmentId },
  });

  if (!assessment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Validate transition
  const allowed = VALID_TRANSITIONS[assessment.status] || [];
  if (!allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Invalid transition from ${assessment.status} to ${newStatus}` },
      { status: 400 }
    );
  }

  // Build update data
  const updateData: Record<string, unknown> = { status: newStatus };

  if (newStatus === "SUBMITTED") {
    updateData.submittedAt = new Date();
  }

  if (newStatus === "ANALYZING") {
    updateData.analyzedAt = new Date();

    // Compute scores on transition to ANALYZING
    const responses = await db.aI360Response.findMany({ where: { assessmentId } });
    const inputs: ResponseInput[] = responses
      .filter((r) => r.selectedOption !== null)
      .map((r) => ({ questionId: r.questionId, selectedOption: r.selectedOption! }));

    const scores = computeScores(inputs);
    updateData.overallScore = scores.score;
    updateData.maturityLevel = scores.maturity;
    updateData.scoringSnapshot = JSON.parse(JSON.stringify(scores));
  }

  if (newStatus === "PUBLISHED") {
    updateData.publishedAt = new Date();
  }

  if (newStatus === "DRAFT") {
    // Reset timestamps when reopening
    updateData.submittedAt = null;
    updateData.analyzedAt = null;
    updateData.publishedAt = null;
  }

  const updated = await db.aI360Assessment.update({
    where: { id: assessmentId },
    data: updateData,
  });

  // Audit & notifications
  await audit.statusChanged(assessmentId, assessment.status, newStatus);
  notifyStatusChange(assessmentId, newStatus).catch(() => {});

  return NextResponse.json({
    id: updated.id,
    status: updated.status,
    overallScore: updated.overallScore,
    maturityLevel: updated.maturityLevel,
  });
}
