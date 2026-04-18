/**
 * TechFides AI 360 — Audit Trail
 *
 * Logs all assessment operations for compliance and traceability.
 * Uses the existing AuditLog model from the main schema.
 */

import { db } from "@/lib/db";

export type AI360AuditAction =
  | "ai360.assessment.created"
  | "ai360.assessment.updated"
  | "ai360.assessment.deleted"
  | "ai360.status.changed"
  | "ai360.responses.saved"
  | "ai360.evidence.added"
  | "ai360.evidence.verified"
  | "ai360.document.uploaded"
  | "ai360.document.deleted"
  | "ai360.member.invited"
  | "ai360.member.accepted"
  | "ai360.member.removed"
  | "ai360.narrative.updated"
  | "ai360.report.generated"
  | "ai360.report.downloaded";

interface AuditEntry {
  action: AI360AuditAction;
  assessmentId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: entry.userId || null,
        action: entry.action,
        resource: `ai360:${entry.assessmentId}`,
        metadata: {
          assessmentId: entry.assessmentId,
          ...entry.metadata,
        },
        ipAddress: entry.ipAddress || null,
      },
    });
  } catch (error) {
    console.error("[AI360 Audit] Failed to log:", error);
  }
}

// ─── Convenience functions ────────────────────────────────────────

export const audit = {
  assessmentCreated: (assessmentId: string, orgName: string, userId?: string) =>
    logAudit({ action: "ai360.assessment.created", assessmentId, userId, metadata: { orgName } }),

  assessmentUpdated: (assessmentId: string, fields: string[], userId?: string) =>
    logAudit({ action: "ai360.assessment.updated", assessmentId, userId, metadata: { fields } }),

  assessmentDeleted: (assessmentId: string, orgName: string, userId?: string) =>
    logAudit({ action: "ai360.assessment.deleted", assessmentId, userId, metadata: { orgName } }),

  statusChanged: (assessmentId: string, from: string, to: string, userId?: string) =>
    logAudit({ action: "ai360.status.changed", assessmentId, userId, metadata: { from, to } }),

  responsesSaved: (assessmentId: string, count: number, userId?: string) =>
    logAudit({ action: "ai360.responses.saved", assessmentId, userId, metadata: { count } }),

  evidenceAdded: (assessmentId: string, evidenceId: string, title: string, userId?: string) =>
    logAudit({ action: "ai360.evidence.added", assessmentId, userId, metadata: { evidenceId, title } }),

  evidenceVerified: (assessmentId: string, evidenceId: string, verifiedBy: string) =>
    logAudit({ action: "ai360.evidence.verified", assessmentId, metadata: { evidenceId, verifiedBy } }),

  documentUploaded: (assessmentId: string, fileName: string, fileSize: number, userId?: string) =>
    logAudit({ action: "ai360.document.uploaded", assessmentId, userId, metadata: { fileName, fileSize } }),

  documentDeleted: (assessmentId: string, fileName: string, userId?: string) =>
    logAudit({ action: "ai360.document.deleted", assessmentId, userId, metadata: { fileName } }),

  memberInvited: (assessmentId: string, email: string, role: string, userId?: string) =>
    logAudit({ action: "ai360.member.invited", assessmentId, userId, metadata: { email, role } }),

  memberAccepted: (assessmentId: string, email: string) =>
    logAudit({ action: "ai360.member.accepted", assessmentId, metadata: { email } }),

  memberRemoved: (assessmentId: string, email: string, userId?: string) =>
    logAudit({ action: "ai360.member.removed", assessmentId, userId, metadata: { email } }),

  narrativeUpdated: (assessmentId: string, fields: string[], userId?: string) =>
    logAudit({ action: "ai360.narrative.updated", assessmentId, userId, metadata: { fields } }),

  reportGenerated: (assessmentId: string, format: string, userId?: string) =>
    logAudit({ action: "ai360.report.generated", assessmentId, userId, metadata: { format } }),

  reportDownloaded: (assessmentId: string, format: string, userId?: string) =>
    logAudit({ action: "ai360.report.downloaded", assessmentId, userId, metadata: { format } }),
};
