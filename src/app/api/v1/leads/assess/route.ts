/**
 * POST /api/v1/leads/assess
 *
 * Ingests AI Readiness Assessment results into the GSE pipeline.
 * Creates a Lead record with assessment data pre-loaded so the
 * sales team sees the prospect's score, dimension breakdown,
 * and weak areas immediately in the GSE dashboard.
 *
 * Auto-assigns:
 * - heatScore based on assessment score
 * - tier based on cloud spend answer
 * - strategy angle for the Velocity Engine
 * - tags: ["assessment-lead", grade]
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const AssessmentSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  overallScore: z.number().min(0).max(100),
  grade: z.string(),
  gradeLabel: z.string(),
  dimensions: z.record(z.string(), z.number()),
  answers: z.record(z.string(), z.number()),
  recommendation: z.string().optional(),
});

function scoreTier(cloudSpendAnswer: number | undefined): "TIER_1" | "TIER_2" | "UNKNOWN" {
  if (!cloudSpendAnswer) return "UNKNOWN";
  // q4 options: 20 (nothing), 50 ($500-2K), 75 ($2K-5K), 100 ($5K+)
  if (cloudSpendAnswer >= 75) return "TIER_2";
  if (cloudSpendAnswer >= 50) return "TIER_1";
  return "UNKNOWN";
}

function scoreToHeat(overallScore: number): number {
  // Assessment score maps to heatScore:
  // High readiness = hot lead (they need this NOW)
  // Low readiness = warm lead (they need education first)
  if (overallScore >= 80) return 75; // A grade → very hot
  if (overallScore >= 60) return 60; // B grade → hot
  if (overallScore >= 40) return 45; // C grade → warm
  return 30; // D grade → cool but captured
}

function determineService(overallScore: number, tier: string): "SOVEREIGN_AI" | "AI_READINESS_360" | "TRANSFORMATION_MANAGEMENT" | "TEDOS" {
  if (overallScore >= 60 && tier === "TIER_2") return "SOVEREIGN_AI";
  if (overallScore >= 60) return "SOVEREIGN_AI";
  if (tier === "TIER_2") return "AI_READINESS_360";
  if (overallScore < 40) return "TRANSFORMATION_MANAGEMENT";
  return "AI_READINESS_360";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AssessmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check if lead already exists
  const existing = await db.lead.findUnique({
    where: { email: data.email },
  });

  const tier = scoreTier(data.answers.q4);
  const heatScore = scoreToHeat(data.overallScore);
  const service = determineService(data.overallScore, tier);

  const assessmentNotes = [
    `AI Readiness Score: ${data.overallScore}/100 (Grade ${data.grade} - ${data.gradeLabel})`,
    "",
    "Dimension Breakdown:",
    ...Object.entries(data.dimensions).map(([dim, score]) => `  ${dim}: ${score}/100`),
    "",
    `Recommendation: ${data.recommendation || "N/A"}`,
    "",
    `Strategy: ${data.overallScore >= 60 ? "Cost Recovery (ready for Sovereign AI)" : "Strategic Alignment (needs AI 360 Assessment first)"}`,
  ].join("\n");

  if (existing) {
    // Update existing lead with assessment data
    await db.lead.update({
      where: { id: existing.id },
      data: {
        heatScore: Math.max(existing.heatScore, heatScore),
        tier,
        tags: Array.from(new Set([...existing.tags, "assessment-lead", `grade-${data.grade.toLowerCase()}`])),
        notes: existing.notes
          ? `${existing.notes}\n\n--- Assessment ${new Date().toISOString().split("T")[0]} ---\n${assessmentNotes}`
          : assessmentNotes,
        enrichmentJson: {
          ...(existing.enrichmentJson as Record<string, unknown> || {}),
          assessment: {
            score: data.overallScore,
            grade: data.grade,
            gradeLabel: data.gradeLabel,
            dimensions: data.dimensions,
            takenAt: new Date().toISOString(),
          },
        },
        lastActivity: new Date(),
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        leadId: existing.id,
        type: "WEBSITE_VISIT",
        title: `AI Readiness Assessment: ${data.overallScore}/100 (Grade ${data.grade})`,
        description: assessmentNotes,
        automated: true,
        metadata: { source: "assessment", score: data.overallScore, grade: data.grade },
      },
    });

    return NextResponse.json({
      success: true,
      leadId: existing.id,
      isNew: false,
      heatScore: Math.max(existing.heatScore, heatScore),
      tier,
      service,
    });
  }

  // Create new lead
  const nameParts = (data.name || "Assessment").split(" ");
  const firstName = nameParts[0] || "Assessment";
  const lastName = nameParts.slice(1).join(" ") || "Lead";

  const lead = await db.lead.create({
    data: {
      firstName,
      lastName,
      email: data.email,
      company: "Unknown",
      vertical: "OTHER",
      service,
      stage: "PROSPECT",
      source: "WEBSITE",
      region: "US",
      currency: "USD",
      heatScore,
      tier,
      salesStatus: "NOT_CONTACTED",
      tags: ["assessment-lead", `grade-${data.grade.toLowerCase()}`],
      notes: assessmentNotes,
      enrichmentJson: {
        assessment: {
          score: data.overallScore,
          grade: data.grade,
          gradeLabel: data.gradeLabel,
          dimensions: data.dimensions,
          takenAt: new Date().toISOString(),
        },
      },
    },
  });

  // Log activity
  await db.activity.create({
    data: {
      leadId: lead.id,
      type: "WEBSITE_VISIT",
      title: `New lead from AI Readiness Assessment: ${data.overallScore}/100 (Grade ${data.grade})`,
      description: assessmentNotes,
      automated: true,
      metadata: { source: "assessment", score: data.overallScore, grade: data.grade },
    },
  });

  return NextResponse.json({
    success: true,
    leadId: lead.id,
    isNew: true,
    heatScore,
    tier,
    service,
  });
}
