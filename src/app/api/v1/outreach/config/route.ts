import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let config = await db.outreachConfig.findFirst();
  if (!config) {
    config = await db.outreachConfig.create({ data: {} });
  }
  return NextResponse.json(config);
}

export async function PATCH(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let config = await db.outreachConfig.findFirst();
  if (!config) {
    config = await db.outreachConfig.create({ data: {} });
  }

  const allowedFields = [
    "dailyDraftLimit", "dailyTier2Split", "dailyTier1Split",
    "heatScoreThreshold", "pivotAfterStep", "scheduleHour",
    "scheduleMinute", "scheduleDays", "enabled",
  ];

  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  const updated = await db.outreachConfig.update({
    where: { id: config.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}
