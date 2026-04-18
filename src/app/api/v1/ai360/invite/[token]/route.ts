import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/ai360/invite/:token — Validate invite token
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Check if it's an assessment access token
  const assessment = await db.aI360Assessment.findUnique({
    where: { accessToken: token },
  });

  if (assessment) {
    return NextResponse.json({
      assessmentId: assessment.id,
      orgName: assessment.orgName,
      assessmentName: assessment.name,
      status: assessment.status,
      role: "CLIENT_ADMIN",
      memberName: "Client",
    });
  }

  // Check if it's a member access token
  const member = await db.aI360Member.findUnique({
    where: { accessToken: token },
    include: { assessment: true },
  });

  if (member) {
    return NextResponse.json({
      assessmentId: member.assessmentId,
      orgName: member.assessment.orgName,
      assessmentName: member.assessment.name,
      status: member.assessment.status,
      role: member.role,
      memberName: member.name,
    });
  }

  return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });
}
