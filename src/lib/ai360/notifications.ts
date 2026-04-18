/**
 * TechFides AI 360 — Email Notification System
 *
 * Sends branded emails for assessment lifecycle events.
 * Uses Nodemailer with configurable SMTP (supports SendGrid, SES, Outlook).
 */

import { db } from "@/lib/db";

// ─── Types ────────────────────────────────────────────────────────

type NotificationType =
  | "member_invited"
  | "assessment_submitted"
  | "analysis_started"
  | "results_published"
  | "assessment_reminder"
  | "results_ready";

interface NotificationPayload {
  type: NotificationType;
  assessmentId: string;
  recipientEmail: string;
  recipientName: string;
  data?: Record<string, string>;
}

// ─── Email Templates ──────────────────────────────────────────────

function getTemplate(type: NotificationType, data: Record<string, string>): { subject: string; html: string } {
  const baseUrl = process.env.TECHFIDES_PUBLIC_URL || "http://localhost:3000";
  const { orgName = "", assessmentName = "", inviteUrl = "", role = "", analystName = "" } = data;

  const templates: Record<NotificationType, { subject: string; html: string }> = {
    member_invited: {
      subject: `You've been invited to the ${orgName} AI Readiness Assessment`,
      html: emailWrapper(`
        <h2 style="color:#003F6B;font-family:'Montserrat',sans-serif;margin:0 0 16px">You're Invited</h2>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          You've been invited to participate in the <strong>${assessmentName}</strong> for <strong>${orgName}</strong> as a <strong>${role}</strong>.
        </p>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          TechFides AI 360 is a comprehensive readiness assessment that evaluates your organization across 6 critical dimensions: Strategy, Data, Technology, Operations, Governance, and People.
        </p>
        <div style="text-align:center;margin:32px 0">
          <a href="${inviteUrl}" style="background:#00AEEF;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
            Accept & Open Assessment
          </a>
        </div>
        <p style="color:#9CA3AF;font-size:12px">If you didn't expect this invitation, you can safely ignore this email.</p>
      `),
    },

    assessment_submitted: {
      subject: `${orgName} AI 360 Assessment Submitted for Analysis`,
      html: emailWrapper(`
        <h2 style="color:#003F6B;font-family:'Montserrat',sans-serif;margin:0 0 16px">Assessment Submitted</h2>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          The <strong>${assessmentName}</strong> for <strong>${orgName}</strong> has been submitted for analysis.
        </p>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          All responses are now locked. The TechFides analysis team will review the assessment and prepare the executive report.
        </p>
        <div style="background:#F5F7FA;border-radius:8px;padding:16px;margin:24px 0">
          <p style="color:#6B7280;font-size:12px;margin:0">Status: <strong style="color:#00AEEF">Submitted</strong></p>
          <p style="color:#6B7280;font-size:12px;margin:4px 0 0">Next: TechFides analysis and scoring</p>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="${baseUrl}/ai360/${data.assessmentId}" style="background:#00AEEF;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
            View Assessment
          </a>
        </div>
      `),
    },

    analysis_started: {
      subject: `Analysis in Progress: ${orgName} AI 360 Assessment`,
      html: emailWrapper(`
        <h2 style="color:#003F6B;font-family:'Montserrat',sans-serif;margin:0 0 16px">Analysis in Progress</h2>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          The TechFides team has begun analyzing the <strong>${assessmentName}</strong> for <strong>${orgName}</strong>.
        </p>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          Our analysts are reviewing responses, validating evidence, and preparing your executive readiness report. You'll be notified when results are published.
        </p>
      `),
    },

    results_published: {
      subject: `Results Published: ${orgName} AI Readiness Score`,
      html: emailWrapper(`
        <h2 style="color:#003F6B;font-family:'Montserrat',sans-serif;margin:0 0 16px">Your Results Are Ready</h2>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          The AI 360 Readiness Assessment for <strong>${orgName}</strong> has been published.
        </p>
        <div style="background:#003F6B;border-radius:12px;padding:24px;margin:24px 0;text-align:center">
          <p style="color:#00AEEF;font-size:12px;letter-spacing:1px;margin:0">AI READINESS SCORE</p>
          <p style="color:white;font-size:48px;font-weight:700;margin:8px 0">${data.score || "—"}%</p>
          <p style="color:#94A3B8;font-size:14px;margin:0">${data.maturity || "Assessment Complete"}</p>
        </div>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          Your full report includes executive summary, domain heat map, risk profile, and opportunity roadmap.
        </p>
        <div style="text-align:center;margin:32px 0">
          <a href="${baseUrl}/ai360/${data.assessmentId}/results" style="background:#00AEEF;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
            View Full Report
          </a>
        </div>
      `),
    },

    assessment_reminder: {
      subject: `Reminder: Complete your ${orgName} AI 360 Assessment`,
      html: emailWrapper(`
        <h2 style="color:#003F6B;font-family:'Montserrat',sans-serif;margin:0 0 16px">Assessment Reminder</h2>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          The <strong>${assessmentName}</strong> for <strong>${orgName}</strong> is still in progress. Your input is needed to complete the assessment.
        </p>
        <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:8px;padding:16px;margin:24px 0">
          <p style="color:#92400E;font-size:13px;margin:0">Completion: <strong>${data.completionRate || "0"}%</strong> — ${data.remaining || "0"} questions remaining</p>
        </div>
        <div style="text-align:center;margin:32px 0">
          <a href="${baseUrl}/ai360/${data.assessmentId}" style="background:#00AEEF;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
            Continue Assessment
          </a>
        </div>
      `),
    },

    results_ready: {
      subject: `${orgName} Assessment Ready for Review`,
      html: emailWrapper(`
        <h2 style="color:#003F6B;font-family:'Montserrat',sans-serif;margin:0 0 16px">Ready for Analyst Review</h2>
        <p style="color:#374151;font-size:14px;line-height:1.6">
          The <strong>${assessmentName}</strong> for <strong>${orgName}</strong> is ready for analyst review and narrative preparation.
        </p>
        <div style="text-align:center;margin:32px 0">
          <a href="${baseUrl}/ai360/${data.assessmentId}/analyze" style="background:#003F6B;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
            Open Analyst Workbench
          </a>
        </div>
      `),
    },
  };

  return templates[type];
}

// ─── Email Wrapper ────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Inter',system-ui,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <!-- Header -->
    <div style="background:#003F6B;border-radius:12px 12px 0 0;padding:24px 32px">
      <p style="color:#00AEEF;font-size:16px;font-weight:700;margin:0;letter-spacing:0.5px">TECHFIDES</p>
      <p style="color:#94A3B8;font-size:11px;margin:4px 0 0">AI 360 Readiness Assessment</p>
    </div>

    <!-- Body -->
    <div style="background:white;padding:32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB">
      ${content}
    </div>

    <!-- Footer -->
    <div style="background:#F9FAFB;border-radius:0 0 12px 12px;padding:20px 32px;border:1px solid #E5E7EB;border-top:none">
      <p style="color:#9CA3AF;font-size:11px;margin:0;text-align:center">
        TechFides | Enterprise AI. Local Infrastructure. Total Sovereignty.
      </p>
      <p style="color:#D1D5DB;font-size:10px;margin:8px 0 0;text-align:center">
        Frisco, TX &bull; Guadalajara, MX &bull; Libreville, GA &bull; techfides.com
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Send Email ───────────────────────────────────────────────────

export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  const assessment = await db.aI360Assessment.findUnique({ where: { id: payload.assessmentId } });
  if (!assessment) return false;

  const templateData: Record<string, string> = {
    orgName: assessment.orgName,
    assessmentName: assessment.name,
    assessmentId: assessment.id,
    ...payload.data,
  };

  const { subject, html } = getTemplate(payload.type, templateData);

  // In development, log to console instead of sending
  if (process.env.NODE_ENV !== "production" || !process.env.EMAIL_SERVER_HOST) {
    console.log(`[AI360 Email] To: ${payload.recipientEmail}`);
    console.log(`[AI360 Email] Subject: ${subject}`);
    console.log(`[AI360 Email] Type: ${payload.type}`);
    return true;
  }

  // Production: send via SMTP
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false,
      auth: process.env.EMAIL_SERVER_USER ? {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASS,
      } : undefined,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "TechFides AI 360 <ai360@techfides.com>",
      to: payload.recipientEmail,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error("[AI360 Email] Failed to send:", error);
    return false;
  }
}

// ─── Lifecycle Notification Helpers ───────────────────────────────

export async function notifyMemberInvited(assessmentId: string, memberId: string) {
  const member = await db.aI360Member.findUnique({ where: { id: memberId }, include: { assessment: true } });
  if (!member) return;

  const baseUrl = process.env.TECHFIDES_PUBLIC_URL || "http://localhost:3000";
  await sendNotification({
    type: "member_invited",
    assessmentId,
    recipientEmail: member.email,
    recipientName: member.name,
    data: {
      role: member.role.replace("_", " "),
      inviteUrl: `${baseUrl}/ai360/invite/${member.accessToken}`,
    },
  });
}

export async function notifyStatusChange(assessmentId: string, newStatus: string) {
  const assessment = await db.aI360Assessment.findUnique({
    where: { id: assessmentId },
    include: { members: true },
  });
  if (!assessment) return;

  const typeMap: Record<string, NotificationType> = {
    SUBMITTED: "assessment_submitted",
    ANALYZING: "analysis_started",
    PUBLISHED: "results_published",
  };

  const type = typeMap[newStatus];
  if (!type) return;

  const data: Record<string, string> = {};
  if (newStatus === "PUBLISHED" && assessment.overallScore !== null) {
    data.score = String(assessment.overallScore);
    data.maturity = assessment.maturityLevel || "";
  }

  for (const member of assessment.members) {
    await sendNotification({
      type,
      assessmentId,
      recipientEmail: member.email,
      recipientName: member.name,
      data,
    });
  }
}
