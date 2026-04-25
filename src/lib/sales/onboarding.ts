import path from "node:path";
import fs from "node:fs/promises";

import { db } from "@/lib/db";
import { transitionDealToProject } from "@/lib/velocity/transitions";
import { scaffoldClientFolder } from "@/lib/filesystem/scaffold";

/**
 * Sales-to-delivery onboarding chain.
 *
 * The full flow when a deal closes:
 *   Lead (CLOSED_WON) → ClientAccount → Project → On-disk folder → SOW copy
 *
 * Triggered from:
 *   - PATCH /api/v1/deals/status (when status="closed-won")
 *   - POST  /api/v1/deal-rooms/[id]/sign
 *   - POST  /api/v1/leads/[id]/onboard (manual)
 *
 * Idempotent: safe to call repeatedly. The function checks each step and
 * skips work that's already done.
 */

const TIER_BY_VALUE = (value: number): string => {
  if (value >= 15000) return "Platinum";
  if (value >= 10000) return "Gold";
  return "Silver";
};

export interface OnboardingResult {
  leadId: string;
  clientAccountId: string;
  projectId: string;
  folderPath: string | null;
  copiedDocuments: string[];
  steps: {
    leadStageUpdated: boolean;
    clientAccountCreated: boolean;
    projectCreated: boolean;
    folderScaffolded: boolean;
    docsCopied: number;
  };
}

/**
 * Run the full onboarding chain for a closed-won lead.
 *
 * If the lead isn't already CLOSED_WON, this updates it. Then creates a
 * ClientAccount (or reuses an existing one keyed on email), creates a
 * Project (or reuses by leadId), scaffolds the on-disk folder, and copies
 * any DealRoomDocuments with type "sow" or "contract" into the client's
 * 02-Agreement/ subfolder.
 */
export async function onboardClientFromLead(leadId: string): Promise<OnboardingResult> {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      dealRooms: {
        include: { documents: true, payments: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  const result: OnboardingResult = {
    leadId,
    clientAccountId: "",
    projectId: "",
    folderPath: null,
    copiedDocuments: [],
    steps: {
      leadStageUpdated: false,
      clientAccountCreated: false,
      projectCreated: false,
      folderScaffolded: false,
      docsCopied: 0,
    },
  };

  // 1. Ensure lead is CLOSED_WON
  if (lead.stage !== "CLOSED_WON") {
    await db.lead.update({
      where: { id: leadId },
      data: {
        stage: "CLOSED_WON",
        salesStatus: "CLIENT",
        probability: 100,
        lastActivity: new Date(),
      },
    });
    result.steps.leadStageUpdated = true;
  }

  const dealValue = lead.dealValue || lead.sowCost || 0;
  const tier = TIER_BY_VALUE(dealValue);

  // 2. Create ClientAccount (idempotent on email)
  const existingClient = await db.clientAccount.findUnique({
    where: { email: lead.email },
  });

  let clientAccount;
  if (existingClient) {
    clientAccount = existingClient;
  } else {
    clientAccount = await db.clientAccount.create({
      data: {
        companyName: lead.company,
        contactName: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        tier,
        service: lead.service,
        status: "ACTIVE",
        retainerAmount: lead.monthlyRetainer || 0,
        retainerStart: new Date(),
        leadId: lead.id,
        notes: lead.notes,
      },
    });
    result.steps.clientAccountCreated = true;
  }
  result.clientAccountId = clientAccount.id;

  // 3. Create Project (idempotent on leadId)
  const existingProject = await db.project.findFirst({
    where: { leadId: lead.id },
  });

  let project;
  if (existingProject) {
    project = existingProject;
  } else {
    const transition = await transitionDealToProject({
      leadId: lead.id,
      dealValue,
      service: lead.service,
    });
    project = transition.project;
    result.steps.projectCreated = true;
  }
  result.projectId = project.id;

  // Link ClientAccount.projectId if not yet set
  if (!clientAccount.projectId) {
    await db.clientAccount.update({
      where: { id: clientAccount.id },
      data: { projectId: project.id },
    });
  }

  // 4. Scaffold on-disk folder (best-effort)
  let folderPath: string | null = null;
  try {
    const scaffold = await scaffoldClientFolder({
      companyName: lead.company,
      contactName: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      tier,
      service: lead.service,
      retainerAmount: lead.monthlyRetainer || 0,
      retainerStart: clientAccount.retainerStart,
      status: clientAccount.status,
      scaffoldedAt: new Date(),
    });
    folderPath = scaffold.rootPath;
    result.folderPath = folderPath;
    result.steps.folderScaffolded = !scaffold.alreadyExisted || scaffold.createdSubfolders.length > 0;

    // 5. Copy signed deal-room documents into 02-Agreement/
    const signedDocs = lead.dealRooms.flatMap((dr) => dr.documents).filter(
      (doc) => doc.url && doc.signedAt && (doc.type === "sow" || doc.type === "contract" || doc.type === "nda")
    );

    const agreementDir = path.join(folderPath, "02-Agreement");
    for (const doc of signedDocs) {
      try {
        if (!doc.url) continue;
        const exists = await fileExists(doc.url);
        if (!exists) continue;
        const filename = `${doc.type.toUpperCase()} — ${doc.name}${path.extname(doc.url) || ".pdf"}`;
        const target = path.join(agreementDir, filename);
        if (await fileExists(target)) continue; // idempotent — don't overwrite
        await fs.copyFile(doc.url, target);
        result.copiedDocuments.push(target);
      } catch {
        // Per-doc errors don't fail the whole chain
      }
    }
    result.steps.docsCopied = result.copiedDocuments.length;
  } catch (e) {
    // Folder scaffolding is best-effort. Surface error in audit but don't fail.
    await db.auditLog.create({
      data: {
        action: "onboard_client_folder_failed",
        resource: `Lead/${leadId}`,
        metadata: {
          error: e instanceof Error ? e.message : "unknown",
        },
      },
    });
  }

  // Audit log
  await db.auditLog.create({
    data: {
      action: "onboard_client_from_lead",
      resource: `Lead/${leadId}`,
      metadata: {
        clientAccountId: result.clientAccountId,
        projectId: result.projectId,
        folderPath: result.folderPath,
        steps: result.steps,
        copiedDocs: result.copiedDocuments.length,
      },
    },
  });

  return result;
}

/**
 * Sign a DealRoom and trigger the onboarding chain.
 *
 * Sets DealRoomStatus to SIGNED, marks all unsigned documents in the room
 * as signed (with current timestamp), then calls onboardClientFromLead.
 *
 * Idempotent: if the room is already SIGNED, just runs onboarding (which
 * is itself idempotent).
 */
export async function signDealRoom(dealRoomId: string): Promise<{
  dealRoomId: string;
  alreadySigned: boolean;
  onboarding: OnboardingResult;
}> {
  const dealRoom = await db.dealRoom.findUnique({ where: { id: dealRoomId } });
  if (!dealRoom) throw new Error(`DealRoom not found: ${dealRoomId}`);

  const alreadySigned = dealRoom.status === "SIGNED" || dealRoom.status === "PAID" || dealRoom.status === "COMPLETED";

  if (!alreadySigned) {
    await db.dealRoom.update({
      where: { id: dealRoomId },
      data: { status: "SIGNED" },
    });

    // Mark unsigned docs as signed
    await db.dealRoomDocument.updateMany({
      where: { dealRoomId, signedAt: null },
      data: { signedAt: new Date(), status: "signed" },
    });

    await db.activity.create({
      data: {
        leadId: dealRoom.leadId,
        type: "DOCUMENT_SIGNED",
        title: "Deal room signed",
        description: `DealRoom ${dealRoomId} marked SIGNED. Triggering client onboarding.`,
        automated: true,
        metadata: { dealRoomId },
      },
    });
  }

  const onboarding = await onboardClientFromLead(dealRoom.leadId);

  return { dealRoomId, alreadySigned, onboarding };
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
