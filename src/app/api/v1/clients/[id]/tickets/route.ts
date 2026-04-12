import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const TicketSchema = z.object({
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).optional(),
  category: z.string().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const tickets = await db.supportTicket.findMany({
    where: { clientAccountId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ tickets });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = TicketSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const ticket = await db.supportTicket.create({
    data: { clientAccountId: params.id, ...parsed.data },
  });
  return NextResponse.json(ticket, { status: 201 });
}
