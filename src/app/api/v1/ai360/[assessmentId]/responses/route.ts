import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AI360_QUESTIONS } from "@/lib/ai360/questions";
import { audit } from "@/lib/ai360/audit";

// GET /api/v1/ai360/:assessmentId/responses?responderId=xxx
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const responderId = req.nextUrl.searchParams.get("responderId");

  const where: Record<string, unknown> = { assessmentId };
  if (responderId) where.responderId = responderId;

  const responses = await db.aI360Response.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ responses });
}

// PUT /api/v1/ai360/:assessmentId/responses — Bulk upsert responses
// Body: { responses: { [questionId]: { selectedOption, notes } }, responderId?, responderName?, responderRole? }
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const body = await req.json();

  const assessment = await db.aI360Assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (assessment.status !== "DRAFT") {
    return NextResponse.json({ error: "Assessment is not in DRAFT status" }, { status: 400 });
  }

  const responderId = body.responderId || "default";
  const responderName = body.responderName || null;
  const responderRole = body.responderRole || null;
  const responsesMap = body.responses as Record<string, { selectedOption: number; notes: string }>;
  const ops = [];

  for (const [questionId, data] of Object.entries(responsesMap)) {
    if (!data.selectedOption || data.selectedOption < 1 || data.selectedOption > 5) continue;

    const question = AI360_QUESTIONS.find((q) => q.id === questionId);
    if (!question) continue;

    const score = data.selectedOption * question.weight;

    ops.push(
      db.aI360Response.upsert({
        where: {
          assessmentId_questionId_responderId: {
            assessmentId,
            questionId,
            responderId,
          },
        },
        create: {
          assessmentId,
          questionId,
          domain: question.domain,
          responderId,
          responderName,
          responderRole,
          selectedOption: data.selectedOption,
          score,
          notes: data.notes || null,
        },
        update: {
          selectedOption: data.selectedOption,
          score,
          notes: data.notes || null,
          responderName,
          responderRole,
        },
      })
    );
  }

  await db.$transaction(ops);
  await audit.responsesSaved(assessmentId, ops.length);

  return NextResponse.json({ success: true, count: ops.length, responderId });
}
