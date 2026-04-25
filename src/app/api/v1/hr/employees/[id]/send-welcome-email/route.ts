import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { issueSetupToken } from "@/lib/auth/setup-token";
import { sendTransactional } from "@/lib/email/send";
import { isResendConfigured } from "@/lib/email/client";
import { renderEmployeeWelcomeEmail } from "@/lib/email/templates/employee-welcome";

/**
 * POST /api/v1/hr/employees/[id]/send-welcome-email
 *
 * Sends (or re-sends) the welcome email to an employee. The email
 * contains a one-time setup link they click to set their password and
 * enable MFA.
 *
 * Returns:
 *   200  { ok: true, messageId, expiresAt, sentAt }
 *   404  Employee not found
 *   409  Employee has no linked User account (run the team seed first)
 *   503  Resend not configured (RESEND_API_KEY missing)
 *   500  Email send failed
 *
 * Re-sends are allowed and explicit — useful when the original link expired
 * or the employee never received it. Each send issues a fresh token and
 * invalidates any prior unconsumed tokens.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isResendConfigured()) {
    return NextResponse.json(
      {
        error:
          "Email is not configured yet. Add RESEND_API_KEY to .env.local (test mode) or Vercel env (production). See /Operations/Resend-Setup.md.",
      },
      { status: 503 }
    );
  }

  const { id } = await params;

  const employee = await db.employee.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { order: "asc" }, where: { required: true }, take: 3 },
      _count: { select: { tasks: { where: { required: true } } } },
    },
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  if (!employee.userId) {
    return NextResponse.json(
      {
        error:
          "Employee has no linked User account. Re-run scripts/seed-techfides-team.ts to provision the User row.",
      },
      { status: 409 }
    );
  }

  const user = await db.user.findUnique({ where: { id: employee.userId } });
  if (!user) {
    return NextResponse.json({ error: "Linked User not found" }, { status: 409 });
  }

  // Issue a fresh setup token (invalidates prior unconsumed)
  const { setupUrl, expiresAt } = await issueSetupToken(user.id);

  const emailBody = renderEmployeeWelcomeEmail({
    name: employee.name,
    role: employee.role,
    type: employee.type === "FTE" ? "FTE" : "Contractor",
    appRole: user.role,
    setupUrl,
    setupExpiresLabel: expiresAt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }),
    totalTasks: employee._count.tasks,
    taskPreview: employee.tasks.map((t) => t.title),
    folderPath: employee.folderPath ?? "(folder not yet scaffolded)",
  });

  const sendResult = await sendTransactional({
    to: employee.email,
    subject: emailBody.subject,
    text: emailBody.text,
    html: emailBody.html,
    tags: [
      { name: "category", value: "employee_welcome" },
      { name: "employeeId", value: employee.id },
    ],
  });

  if (!sendResult.ok) {
    return NextResponse.json(
      { error: "Email send failed at the Resend API. Check Resend dashboard logs." },
      { status: 500 }
    );
  }

  // Track lifecycle on the User
  await db.user.update({
    where: { id: user.id },
    data: { welcomeEmailSentAt: new Date() },
  });

  await db.auditLog.create({
    data: {
      action: "send_welcome_email",
      resource: `Employee/${employee.id}`,
      metadata: {
        userId: user.id,
        email: employee.email,
        messageId: sendResult.id,
        expiresAt: expiresAt.toISOString(),
      },
    },
  });

  return NextResponse.json({
    ok: true,
    messageId: sendResult.id,
    expiresAt: expiresAt.toISOString(),
    sentAt: new Date().toISOString(),
  });
}
