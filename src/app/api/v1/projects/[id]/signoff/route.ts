import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const SignoffSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  satisfaction: z.number().min(1).max(5).optional(),
  feedback: z.string().optional(),
  signature: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SignoffSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  const signoff = await db.clientSignoff.create({
    data: {
      projectId: params.id,
      ...parsed.data,
      ipAddress: ip,
    },
  });

  // Mark project as completed with client sign-off
  await db.project.update({
    where: { id: params.id },
    data: {
      status: "COMPLETED",
      actualEnd: new Date(),
      clientNps: parsed.data.satisfaction ? parsed.data.satisfaction * 2 : null, // scale 1-5 to NPS-like
      clientFeedback: parsed.data.feedback,
    },
  });

  // Log as project update
  await db.projectUpdate.create({
    data: {
      projectId: params.id,
      authorName: parsed.data.clientName,
      authorRole: "Client",
      type: "CLIENT_SIGNOFF",
      title: "Client signed off on completed project",
      body: `Satisfaction: ${parsed.data.satisfaction || "N/A"}/5. ${parsed.data.feedback || "No additional feedback."}`,
    },
  });

  return NextResponse.json({ success: true, signoff });
}
