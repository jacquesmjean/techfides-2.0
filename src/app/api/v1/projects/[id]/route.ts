import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: {
      assignments: true,
      updates: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowedFields = [
    "name", "clientName", "status", "service", "tier",
    "plannedStart", "plannedEnd", "actualStart", "actualEnd",
    "contractValue", "billedAmount", "clientNps", "clientFeedback",
    "description", "notes",
  ];

  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (["plannedStart", "plannedEnd", "actualStart", "actualEnd"].includes(field) && typeof body[field] === "string") {
        updateData[field] = new Date(body[field] as string);
      } else {
        updateData[field] = body[field];
      }
    }
  }

  const project = await db.project.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(project);
}
