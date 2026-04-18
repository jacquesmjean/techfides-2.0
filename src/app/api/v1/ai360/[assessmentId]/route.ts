import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AI360_QUESTIONS } from "@/lib/ai360/questions";

// GET /api/v1/ai360/:assessmentId — Get assessment details
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;

  const assessment = await db.aI360Assessment.findUnique({
    where: { id: assessmentId },
    include: {
      _count: {
        select: { members: true, responses: true, documents: true, evidence: true },
      },
    },
  });

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...assessment,
    createdAt: assessment.createdAt.toISOString(),
    updatedAt: assessment.updatedAt.toISOString(),
    submittedAt: assessment.submittedAt?.toISOString() || null,
    publishedAt: assessment.publishedAt?.toISOString() || null,
    analyzedAt: assessment.analyzedAt?.toISOString() || null,
    completionRate: Math.round((assessment._count.responses / AI360_QUESTIONS.length) * 100),
    memberCount: assessment._count.members,
    responseCount: assessment._count.responses,
    documentCount: assessment._count.documents,
    evidenceCount: assessment._count.evidence,
  });
}

// PUT /api/v1/ai360/:assessmentId — Update assessment metadata
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const body = await req.json();

  const updated = await db.aI360Assessment.update({
    where: { id: assessmentId },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.orgName && { orgName: body.orgName }),
      ...(body.orgIndustry && { orgIndustry: body.orgIndustry }),
      ...(body.executiveSummary !== undefined && { executiveSummary: body.executiveSummary }),
      ...(body.narrativeSummary !== undefined && { narrativeSummary: body.narrativeSummary }),
      ...(body.opportunityMap !== undefined && { opportunityMap: body.opportunityMap }),
      ...(body.keyRisks !== undefined && { keyRisks: body.keyRisks }),
      ...(body.priorityMatrix !== undefined && { priorityMatrix: body.priorityMatrix }),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/v1/ai360/:assessmentId
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  await db.aI360Assessment.delete({ where: { id: assessmentId } });
  return NextResponse.json({ success: true });
}
