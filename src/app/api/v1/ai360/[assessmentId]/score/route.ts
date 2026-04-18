import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeScores, ResponseInput } from "@/lib/ai360/scoring";

// GET /api/v1/ai360/:assessmentId/score — Compute and return scores
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;

  const assessment = await db.aI360Assessment.findUnique({
    where: { id: assessmentId },
  });

  if (!assessment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch all responses
  const responses = await db.aI360Response.findMany({
    where: { assessmentId },
  });

  if (responses.length === 0) {
    return NextResponse.json({
      score: 0,
      maturity: "NASCENT",
      domains: [],
      heatMap: [],
      riskProfile: [],
      opportunities: [],
      completionRate: 0,
    });
  }

  // Build input for scoring engine
  const inputs: ResponseInput[] = responses
    .filter((r) => r.selectedOption !== null)
    .map((r) => ({
      questionId: r.questionId,
      selectedOption: r.selectedOption!,
    }));

  const scores = computeScores(inputs);

  // If assessment is being analyzed, persist the scores
  if (assessment.status === "ANALYZING" || assessment.status === "PUBLISHED") {
    await db.aI360Assessment.update({
      where: { id: assessmentId },
      data: {
        overallScore: scores.score,
        maturityLevel: scores.maturity,
        scoringSnapshot: JSON.parse(JSON.stringify(scores)),
      },
    });
  }

  return NextResponse.json(scores);
}
