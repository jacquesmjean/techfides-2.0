import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/ai360/:assessmentId/evidence
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;

  const evidence = await db.aI360Evidence.findMany({
    where: { assessmentId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    evidence: evidence.map((e) => ({
      id: e.id,
      questionId: e.questionId,
      domain: e.domain,
      title: e.title,
      description: e.description,
      sourceType: e.sourceType,
      sourceUrl: e.sourceUrl,
      verified: e.verified,
      verifiedBy: e.verifiedBy,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}

// POST /api/v1/ai360/:assessmentId/evidence
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const body = await req.json();

  const evidence = await db.aI360Evidence.create({
    data: {
      assessmentId,
      questionId: body.questionId || null,
      domain: body.domain,
      title: body.title,
      description: body.description,
      sourceType: body.sourceType,
      sourceUrl: body.sourceUrl || null,
    },
  });

  return NextResponse.json({
    id: evidence.id,
    questionId: evidence.questionId,
    domain: evidence.domain,
    title: evidence.title,
    description: evidence.description,
    sourceType: evidence.sourceType,
    sourceUrl: evidence.sourceUrl,
    verified: evidence.verified,
    verifiedBy: evidence.verifiedBy,
    createdAt: evidence.createdAt.toISOString(),
  }, { status: 201 });
}
