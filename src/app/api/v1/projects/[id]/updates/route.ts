import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const UpdateSchema = z.object({
  authorName: z.string().min(1),
  authorRole: z.string().optional(),
  type: z.enum(["STATUS_UPDATE", "MILESTONE_REACHED", "BLOCKER_REPORTED", "HOURS_LOGGED", "COMPLETED", "CLIENT_FEEDBACK"]),
  title: z.string().min(1),
  body: z.string().min(1),
  hoursSpent: z.number().optional(),
  blockers: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const update = await db.projectUpdate.create({
    data: { projectId: id, ...parsed.data },
  });

  // If update type is COMPLETED, mark project as completed
  if (parsed.data.type === "COMPLETED") {
    await db.project.update({
      where: { id },
      data: { status: "COMPLETED", actualEnd: new Date() },
    });
  }

  // If update type is HOURS_LOGGED, increment logged hours on assignment
  if (parsed.data.type === "HOURS_LOGGED" && parsed.data.hoursSpent) {
    const assignments = await db.projectAssignment.findMany({
      where: { projectId: id, name: parsed.data.authorName },
    });
    if (assignments.length > 0) {
      await db.projectAssignment.update({
        where: { id: assignments[0].id },
        data: { hoursLogged: { increment: parsed.data.hoursSpent } },
      });
    }
  }

  return NextResponse.json(update, { status: 201 });
}
