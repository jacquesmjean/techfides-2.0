/**
 * PATCH /api/v1/deals/status
 *
 * Updates a deal (lead) to closed-won or closed-lost.
 * When closed-won: auto-creates a Project in the delivery pipeline
 * and triggers the deal-to-project transition.
 * When closed-lost: logs the loss reason for Velocity Engine retraining.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { transitionDealToProject } from "@/lib/velocity/transitions";

const StatusSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(["closed-won", "closed-lost"]),
  dealValue: z.number().optional(),
  closeReason: z.string().optional(),
  notes: z.string().optional(),
});

export async function PATCH(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = StatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const { leadId, status, dealValue, closeReason, notes } = parsed.data;

  // Update lead in database
  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const stage = status === "closed-won" ? "CLOSED_WON" : "CLOSED_LOST";

  await db.lead.update({
    where: { id: leadId },
    data: {
      stage,
      dealValue: dealValue ?? lead.dealValue,
      probability: status === "closed-won" ? 100 : 0,
      lastActivity: new Date(),
      notes: notes
        ? `${lead.notes || ""}\n\n--- ${status.toUpperCase()} ${new Date().toISOString().split("T")[0]} ---\n${notes}${closeReason ? `\nReason: ${closeReason}` : ""}`
        : lead.notes,
    },
  });

  // Log activity
  await db.activity.create({
    data: {
      leadId,
      type: "STAGE_CHANGE",
      title: `Deal ${status}: ${lead.company}`,
      description: `${lead.firstName} ${lead.lastName} — $${(dealValue ?? lead.dealValue).toLocaleString()}${closeReason ? `. Reason: ${closeReason}` : ""}`,
      automated: false,
    },
  });

  let project = null;

  // CLOSED-WON: Auto-create project
  if (status === "closed-won") {
    const result = await transitionDealToProject({
      leadId,
      dealValue: dealValue ?? lead.dealValue,
      service: lead.service,
    });
    project = result.project;
  }

  // CLOSED-LOST: Log loss reason for retraining
  if (status === "closed-lost" && closeReason) {
    await db.lossReason.upsert({
      where: { id: closeReason },
      update: { count: { increment: 1 } },
      create: {
        id: closeReason,
        category: closeReason,
        description: notes || closeReason,
      },
    });
  }

  return NextResponse.json({
    success: true,
    leadId,
    status,
    projectCreated: !!project,
    projectId: project?.id || null,
  });
}
