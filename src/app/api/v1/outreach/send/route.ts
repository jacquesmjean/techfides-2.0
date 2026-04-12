import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendOutlookDraft, getOutlookAccessToken } from "@/lib/email/outlook-client";

const SendSchema = z.object({
  draftId: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "draftId required" }, { status: 400 });
  }

  const draft = await db.emailDraft.findUnique({
    where: { id: parsed.data.draftId },
    include: { lead: true },
  });

  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  if (draft.status !== "DRAFT") {
    return NextResponse.json({ error: `Draft status is ${draft.status}, not DRAFT` }, { status: 400 });
  }

  try {
    const accessToken = await getOutlookAccessToken();

    if (draft.outlookMessageId) {
      await sendOutlookDraft(accessToken, draft.outlookMessageId);
    }

    const now = new Date();

    await db.emailDraft.update({
      where: { id: draft.id },
      data: { status: "SENT", sentAt: now },
    });

    await db.activity.create({
      data: {
        leadId: draft.leadId,
        type: "EMAIL_SENT",
        title: `Email sent: ${draft.subject}`,
        description: `Strategy: ${draft.strategyAngle}, Step: ${draft.sequenceStep}`,
        automated: false,
      },
    });

    await db.lead.update({
      where: { id: draft.leadId },
      data: { lastActivity: now },
    });

    return NextResponse.json({ success: true, sentAt: now.toISOString() });
  } catch (err) {
    await db.emailDraft.update({
      where: { id: draft.id },
      data: { status: "FAILED", errorMessage: err instanceof Error ? err.message : "Unknown" },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Send failed" },
      { status: 500 }
    );
  }
}
