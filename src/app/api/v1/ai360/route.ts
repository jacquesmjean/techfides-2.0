import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AI360_QUESTIONS } from "@/lib/ai360/questions";
import { audit } from "@/lib/ai360/audit";

// GET /api/v1/ai360 — List all assessments
export async function GET() {
  const assessments = await db.aI360Assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          members: true,
          responses: true,
          documents: true,
        },
      },
    },
  });

  return NextResponse.json({
    assessments: assessments.map((a) => ({
      id: a.id,
      name: a.name,
      orgName: a.orgName,
      orgIndustry: a.orgIndustry,
      status: a.status,
      overallScore: a.overallScore,
      maturityLevel: a.maturityLevel,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      submittedAt: a.submittedAt?.toISOString() || null,
      publishedAt: a.publishedAt?.toISOString() || null,
      completionRate: Math.round((a._count.responses / AI360_QUESTIONS.length) * 100),
      memberCount: a._count.members,
      responseCount: a._count.responses,
      documentCount: a._count.documents,
    })),
  });
}

// POST /api/v1/ai360 — Create new assessment
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, orgName, orgIndustry } = body;

  if (!name || !orgName) {
    return NextResponse.json({ error: "name and orgName are required" }, { status: 400 });
  }

  const assessment = await db.aI360Assessment.create({
    data: {
      name,
      orgName,
      orgIndustry: orgIndustry || "OTHER",
    },
  });

  await audit.assessmentCreated(assessment.id, orgName);

  return NextResponse.json(assessment, { status: 201 });
}
