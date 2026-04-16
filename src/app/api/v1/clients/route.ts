import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const CreateClientSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  tier: z.string(),
  service: z.enum(["SOVEREIGN_AI", "AI_READINESS_360", "TRANSFORMATION_MANAGEMENT", "AEGIS"]),
  retainerAmount: z.number(),
  retainerStart: z.string().optional(),
  leadId: z.string().optional(),
  projectId: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const clients = await db.clientAccount.findMany({
    where: status ? { status: status as "ACTIVE" | "PAUSED" | "DEACTIVATED" | "CHURNED" } : {},
    include: { _count: { select: { tickets: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const metrics = {
    active: await db.clientAccount.count({ where: { status: "ACTIVE" } }),
    paused: await db.clientAccount.count({ where: { status: "PAUSED" } }),
    totalMRR: (await db.clientAccount.findMany({ where: { status: "ACTIVE" } })).reduce((s, c) => s + c.retainerAmount, 0),
    openTickets: await db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
  };

  return NextResponse.json({ clients, metrics });
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = CreateClientSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const client = await db.clientAccount.create({
    data: {
      ...parsed.data,
      retainerStart: parsed.data.retainerStart ? new Date(parsed.data.retainerStart) : new Date(),
    },
  });
  return NextResponse.json(client, { status: 201 });
}
