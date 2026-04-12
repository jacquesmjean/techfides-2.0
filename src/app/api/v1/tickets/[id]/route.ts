import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  const allowed = ["status", "priority", "assignedTo", "assignedEmail", "resolution", "hoursSpent", "clientRating", "category"];
  for (const f of allowed) {
    if (body[f] !== undefined) updateData[f] = body[f];
  }

  if (body.status === "RESOLVED" || body.status === "CLOSED") {
    updateData.resolvedAt = new Date();
  }

  const ticket = await db.supportTicket.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json(ticket);
}
