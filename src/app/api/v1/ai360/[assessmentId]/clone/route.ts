import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/ai360/audit";

// POST /api/v1/ai360/:assessmentId/clone — Clone an assessment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const body = await req.json();

  const source = await db.aI360Assessment.findUnique({
    where: { id: assessmentId },
    include: { members: true, evidence: true },
  });

  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newName = body.name || `${source.name} (Copy)`;
  const newOrgName = body.orgName || source.orgName;
  const includeResponses = body.includeResponses === true;
  const includeEvidence = body.includeEvidence === true;
  const includeMembers = body.includeMembers === true;

  // Create new assessment
  const clone = await db.aI360Assessment.create({
    data: {
      name: newName,
      orgName: newOrgName,
      orgIndustry: source.orgIndustry,
      status: "DRAFT",
    },
  });

  // Clone responses if requested
  if (includeResponses) {
    const responses = await db.aI360Response.findMany({ where: { assessmentId } });
    if (responses.length > 0) {
      await db.aI360Response.createMany({
        data: responses.map((r) => ({
          assessmentId: clone.id,
          questionId: r.questionId,
          domain: r.domain,
          responderId: r.responderId,
          responderName: r.responderName,
          responderRole: r.responderRole,
          selectedOption: r.selectedOption,
          score: r.score,
          notes: r.notes,
        })),
      });
    }
  }

  // Clone evidence if requested
  if (includeEvidence && source.evidence.length > 0) {
    await db.aI360Evidence.createMany({
      data: source.evidence.map((e) => ({
        assessmentId: clone.id,
        questionId: e.questionId,
        domain: e.domain,
        title: e.title,
        description: e.description,
        sourceType: e.sourceType,
        sourceUrl: e.sourceUrl,
        verified: false,
      })),
    });
  }

  // Clone members if requested
  if (includeMembers && source.members.length > 0) {
    await db.aI360Member.createMany({
      data: source.members.map((m) => ({
        assessmentId: clone.id,
        email: m.email,
        name: m.name,
        role: m.role,
      })),
    });
  }

  await audit.assessmentCreated(clone.id, newOrgName);

  return NextResponse.json({
    id: clone.id,
    name: clone.name,
    orgName: clone.orgName,
    clonedFrom: assessmentId,
  }, { status: 201 });
}
