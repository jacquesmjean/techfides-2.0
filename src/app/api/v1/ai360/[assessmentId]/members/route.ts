import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/ai360/audit";
import { notifyMemberInvited } from "@/lib/ai360/notifications";

// GET /api/v1/ai360/:assessmentId/members
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;

  const members = await db.aI360Member.findMany({
    where: { assessmentId },
    orderBy: { invitedAt: "asc" },
  });

  return NextResponse.json({
    members: members.map((m) => ({
      id: m.id,
      email: m.email,
      name: m.name,
      role: m.role,
      invitedAt: m.invitedAt.toISOString(),
      acceptedAt: m.acceptedAt?.toISOString() || null,
    })),
  });
}

// POST /api/v1/ai360/:assessmentId/members — Invite member
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const body = await req.json();

  if (!body.email || !body.name || !body.role) {
    return NextResponse.json({ error: "email, name, and role are required" }, { status: 400 });
  }

  const member = await db.aI360Member.create({
    data: {
      assessmentId,
      email: body.email,
      name: body.name,
      role: body.role,
    },
  });

  // Audit & notify
  await audit.memberInvited(assessmentId, body.email, body.role);
  notifyMemberInvited(assessmentId, member.id).catch(() => {});

  return NextResponse.json({
    id: member.id,
    email: member.email,
    name: member.name,
    role: member.role,
    invitedAt: member.invitedAt.toISOString(),
    acceptedAt: null,
  }, { status: 201 });
}
