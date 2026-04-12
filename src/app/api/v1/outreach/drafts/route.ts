import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const status = searchParams.get("status");

  const today = dateStr ? new Date(dateStr) : new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const drafts = await db.emailDraft.findMany({
    where: {
      batchDate: { gte: today, lt: tomorrow },
      ...(status ? { status: status as "DRAFT" | "SENT" | "FAILED" | "DELETED" } : {}),
    },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company: true,
          vertical: true,
          tier: true,
          heatScore: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalToday = await db.emailDraft.count({
    where: { batchDate: { gte: today, lt: tomorrow } },
  });

  const sentToday = await db.emailDraft.count({
    where: { batchDate: { gte: today, lt: tomorrow }, status: "SENT" },
  });

  return NextResponse.json({
    drafts,
    metrics: {
      totalToday,
      sentToday,
      pendingToday: totalToday - sentToday,
      dailyLimit: 50,
    },
  });
}
