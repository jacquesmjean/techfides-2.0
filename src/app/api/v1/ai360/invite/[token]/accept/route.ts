import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/v1/ai360/invite/:token/accept — Accept invite
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Check assessment-level token
  const assessment = await db.aI360Assessment.findUnique({
    where: { accessToken: token },
  });

  if (assessment) {
    return NextResponse.json({ assessmentId: assessment.id });
  }

  // Check member-level token
  const member = await db.aI360Member.findUnique({
    where: { accessToken: token },
  });

  if (member) {
    if (!member.acceptedAt) {
      await db.aI360Member.update({
        where: { id: member.id },
        data: { acceptedAt: new Date() },
      });
    }
    return NextResponse.json({ assessmentId: member.assessmentId });
  }

  return NextResponse.json({ error: "Invalid token" }, { status: 404 });
}
