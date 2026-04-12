import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const AssignmentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  role: z.string().min(1),
  type: z.enum(["FTE", "Contractor"]),
  region: z.string().optional(),
  hourlyRate: z.number().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AssignmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const assignment = await db.projectAssignment.create({
    data: { projectId: params.id, ...parsed.data },
  });

  return NextResponse.json(assignment, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get("assignmentId");
  if (!assignmentId) return NextResponse.json({ error: "assignmentId required" }, { status: 400 });

  await db.projectAssignment.delete({ where: { id: assignmentId } });
  return NextResponse.json({ success: true });
}
