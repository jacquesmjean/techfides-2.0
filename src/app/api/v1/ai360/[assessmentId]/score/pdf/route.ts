import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeScores, ResponseInput } from "@/lib/ai360/scoring";
import { generateExecutiveReport } from "@/lib/ai360/pdf-report";
import { audit } from "@/lib/ai360/audit";

// GET /api/v1/ai360/:assessmentId/score/pdf — Generate and stream PDF report
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

  // Fetch responses
  const dbResponses = await db.aI360Response.findMany({
    where: { assessmentId },
  });

  // Build response map
  const responses: Record<string, { selectedOption: number; notes: string }> = {};
  for (const r of dbResponses) {
    if (r.selectedOption !== null) {
      responses[r.questionId] = { selectedOption: r.selectedOption, notes: r.notes || "" };
    }
  }

  // Compute scores
  const inputs: ResponseInput[] = dbResponses
    .filter((r) => r.selectedOption !== null)
    .map((r) => ({ questionId: r.questionId, selectedOption: r.selectedOption! }));

  const scores = computeScores(inputs);

  // Generate PDF
  const pdfDoc = generateExecutiveReport({
    assessmentName: assessment.name,
    orgName: assessment.orgName,
    orgIndustry: assessment.orgIndustry,
    scores,
    responses,
    executiveSummary: assessment.executiveSummary || undefined,
    narrativeSummary: assessment.narrativeSummary || undefined,
    publishedAt: assessment.publishedAt?.toISOString(),
    createdAt: assessment.createdAt.toISOString(),
  });

  // Collect PDF buffer
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    pdfDoc.on("data", (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on("end", resolve);
    pdfDoc.on("error", reject);
  });

  const pdfBuffer = Buffer.concat(chunks);
  await audit.reportDownloaded(assessmentId, "pdf");
  const fileName = `TechFides_AI360_${assessment.orgName.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
