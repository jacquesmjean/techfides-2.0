import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  if (body.status !== undefined) {
    updateData.status = body.status;
    if (body.status === "DEACTIVATED" || body.status === "CHURNED") {
      updateData.deactivatedAt = new Date();
    }
    if (body.status === "ACTIVE") {
      updateData.deactivatedAt = null;
    }
  }

  const allowedFields = ["companyName", "contactName", "email", "phone", "tier", "retainerAmount", "notes"];
  for (const f of allowedFields) {
    if (body[f] !== undefined) updateData[f] = body[f];
  }

  const client = await db.clientAccount.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(client);
}
