import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AI360_QUESTIONS, AI360_DOMAINS } from "@/lib/ai360/questions";
import { computeScores, ResponseInput, MATURITY_LABELS } from "@/lib/ai360/scoring";
import { audit } from "@/lib/ai360/audit";

// GET /api/v1/ai360/:assessmentId/export?format=csv|json
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const format = req.nextUrl.searchParams.get("format") || "csv";

  const assessment = await db.aI360Assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const responses = await db.aI360Response.findMany({ where: { assessmentId } });

  // Build response lookup
  const responseMap = new Map<string, { selectedOption: number; notes: string; responderId: string; responderName: string; responderRole: string }>();
  for (const r of responses) {
    if (r.selectedOption !== null) {
      const key = `${r.questionId}:${r.responderId || "default"}`;
      responseMap.set(key, {
        selectedOption: r.selectedOption,
        notes: r.notes || "",
        responderId: r.responderId || "default",
        responderName: r.responderName || "Primary",
        responderRole: r.responderRole || "",
      });
    }
  }

  // Compute scores
  const inputs: ResponseInput[] = responses
    .filter((r) => r.selectedOption !== null)
    .map((r) => ({ questionId: r.questionId, selectedOption: r.selectedOption! }));
  const scores = computeScores(inputs);

  await audit.reportDownloaded(assessmentId, format);

  if (format === "json") {
    return NextResponse.json({
      assessment: {
        id: assessment.id,
        name: assessment.name,
        orgName: assessment.orgName,
        orgIndustry: assessment.orgIndustry,
        status: assessment.status,
        overallScore: scores.score,
        maturityLevel: scores.maturity,
        exportedAt: new Date().toISOString(),
      },
      domains: scores.domains.map((d) => ({
        domain: d.domain,
        label: d.label,
        score: d.percentage,
        maturity: MATURITY_LABELS[d.maturity],
        strengths: d.strengths,
        gaps: d.gaps,
      })),
      responses: AI360_QUESTIONS.map((q) => {
        const resp = responseMap.get(`${q.id}:default`);
        return {
          questionId: q.id,
          domain: q.domain,
          question: q.text,
          weight: q.weight,
          selectedOption: resp?.selectedOption || null,
          score: resp ? resp.selectedOption * q.weight : null,
          notes: resp?.notes || null,
        };
      }),
      risks: scores.riskProfile,
      opportunities: scores.opportunities,
    });
  }

  // CSV format
  const rows: string[][] = [];

  // Header
  rows.push(["Question ID", "Domain", "Question", "Weight", "Response (1-5)", "Weighted Score", "Response Label", "Notes", "Respondent", "Respondent Role"]);

  // Get unique respondent IDs
  const respondentIds = Array.from(new Set(responses.map((r) => r.responderId || "default")));

  for (const q of AI360_QUESTIONS) {
    for (const rid of respondentIds) {
      const resp = responseMap.get(`${q.id}:${rid}`);
      const domainDef = AI360_DOMAINS.find((d) => d.key === q.domain);
      const optLabel = resp ? q.options.find((o) => o.value === resp.selectedOption)?.label || "" : "";

      rows.push([
        q.id,
        domainDef?.label || q.domain,
        `"${q.text.replace(/"/g, '""')}"`,
        String(q.weight),
        resp ? String(resp.selectedOption) : "",
        resp ? String(Math.round(resp.selectedOption * q.weight * 100) / 100) : "",
        `"${optLabel}"`,
        resp?.notes ? `"${resp.notes.replace(/"/g, '""')}"` : "",
        resp?.responderName || "Primary",
        resp?.responderRole || "",
      ]);
    }
  }

  // Add summary sheet rows
  rows.push([]);
  rows.push(["--- DOMAIN SUMMARY ---"]);
  rows.push(["Domain", "Score (%)", "Maturity", "Strengths", "Gaps"]);
  for (const d of scores.domains) {
    rows.push([d.label, String(d.percentage), MATURITY_LABELS[d.maturity], String(d.strengths.length), String(d.gaps.length)]);
  }
  rows.push([]);
  rows.push(["Overall Score", String(scores.score)]);
  rows.push(["Maturity Level", MATURITY_LABELS[scores.maturity]]);
  rows.push(["Completion Rate", `${scores.completionRate}%`]);

  const csv = rows.map((r) => r.join(",")).join("\n");
  const fileName = `TechFides_AI360_${assessment.orgName.replace(/[^a-zA-Z0-9]/g, "_")}_export.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
