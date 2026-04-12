import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  clientName: z.string().min(1),
  leadId: z.string().optional(),
  service: z.enum(["SOVEREIGN_AI", "AI_READINESS_360", "TRANSFORMATION_MANAGEMENT", "TEDOS"]),
  tier: z.string().optional(),
  plannedStart: z.string().optional(),
  plannedEnd: z.string().optional(),
  contractValue: z.number().optional(),
  description: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const projects = await db.project.findMany({
    where: status ? { status: status as "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED" } : {},
    include: {
      assignments: true,
      updates: { orderBy: { createdAt: "desc" }, take: 3 },
      _count: { select: { updates: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      clientName: parsed.data.clientName,
      leadId: parsed.data.leadId,
      service: parsed.data.service,
      tier: parsed.data.tier,
      plannedStart: parsed.data.plannedStart ? new Date(parsed.data.plannedStart) : null,
      plannedEnd: parsed.data.plannedEnd ? new Date(parsed.data.plannedEnd) : null,
      contractValue: parsed.data.contractValue || 0,
      description: parsed.data.description,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
