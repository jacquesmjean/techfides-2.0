import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aggregateResponses, RespondentResponse } from "@/lib/ai360/aggregation";

// GET /api/v1/ai360/:assessmentId/aggregate — Multi-respondent aggregation
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;

  const responses = await db.aI360Response.findMany({
    where: { assessmentId },
  });

  if (responses.length === 0) {
    return NextResponse.json({ respondentCount: 0, domains: [], respondents: [] });
  }

  const mapped: RespondentResponse[] = responses
    .filter((r) => r.selectedOption !== null)
    .map((r) => ({
      questionId: r.questionId,
      responderId: r.responderId || "default",
      responderName: r.responderName,
      responderRole: r.responderRole,
      selectedOption: r.selectedOption!,
      notes: r.notes,
    }));

  const aggregation = aggregateResponses(mapped);

  return NextResponse.json(aggregation);
}
