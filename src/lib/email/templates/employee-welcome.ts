/**
 * Welcome email for a new employee/contractor.
 *
 * Sent when an admin clicks "Send Welcome Email" on /gse/hr. Contains:
 *   - Personalized greeting
 *   - Their role + app access tier
 *   - One-time setup link (expires 72h)
 *   - MFA preview ("after password, you'll set up two-factor")
 *   - Onboarding tasks summary (count + first 3)
 *   - HR folder reference
 *   - Support contact
 *
 * Two versions: plain text (required for spam-score + accessibility) +
 * HTML (rendered nicely in modern clients). Both are returned together.
 */

export interface EmployeeWelcomeInput {
  /** First name or full name */
  name: string;
  /** Job title — "Chief Financial Officer", etc. */
  role: string;
  /** "FTE" or "Contractor" */
  type: "FTE" | "Contractor";
  /** App role: "ADMIN" | "CLOSER" | "VIEWER" */
  appRole: string;
  /** Magic link they click to set their password */
  setupUrl: string;
  /** When the setup link expires (display-formatted) */
  setupExpiresLabel: string;
  /** Total required onboarding tasks queued for them */
  totalTasks: number;
  /** First 3 task titles to preview (e.g. "Sign NDA", "Submit W-4", ...) */
  taskPreview: string[];
  /** Absolute path on host filesystem to their HR folder */
  folderPath: string;
}

export interface EmailBody {
  subject: string;
  text: string;
  html: string;
}

const APP_ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: "Full access to all systems — clients, sales pipeline, financials, employee records, system settings.",
  CLOSER: "Sales pipeline, leads, deal rooms, clients, and projects. No system settings or employee admin.",
  VIEWER: "Read-only access to dashboards and reports.",
};

export function renderEmployeeWelcomeEmail(input: EmployeeWelcomeInput): EmailBody {
  const firstName = input.name.split(/\s+/)[0];
  const accessSummary = APP_ROLE_DESCRIPTIONS[input.appRole] ?? "App access tier: " + input.appRole;
  const taskList = input.taskPreview.length
    ? input.taskPreview.map((t, i) => `  ${i + 1}. ${t}`).join("\n")
    : "  (no tasks queued yet)";
  const remainingCount = Math.max(0, input.totalTasks - input.taskPreview.length);
  const remainingNote = remainingCount > 0 ? `  ...and ${remainingCount} more once you log in` : "";

  // ─── Plain text ─────────────────────────────────────────────────────
  const text = `Welcome to TechFides, ${firstName}.

You've been added to the team as ${input.role} (${input.type}).
We're glad to have you on board.

Set up your account
───────────────────
Click the link below to create your password. It's good for 72 hours
(${input.setupExpiresLabel}):

  ${input.setupUrl}

After your password, you'll be prompted to enable two-factor
authentication using an authenticator app (Google Authenticator, Authy,
1Password, etc.). This is required for everyone — no exceptions.

Your access
───────────
${accessSummary}

What's queued for you
─────────────────────
${input.totalTasks} onboarding task${input.totalTasks === 1 ? "" : "s"} are waiting in the system. The first few:

${taskList}
${remainingNote}

You'll work through these in the GSE dashboard once you're signed in.

Your HR folder
──────────────
A folder has been scaffolded for your records at:
  ${input.folderPath}

It already contains 5 lifecycle subfolders (Hiring, Onboarding,
Compliance, Performance, Compensation) plus an auto-generated README.
Drop signed documents in the matching subfolder.

Questions
─────────
Reply to this email or write to engage@techfides.com.
For urgent issues, call Jacques M. Jean directly.

Welcome aboard,

— TechFides Team
TechFides LLC · Frisco, TX
techfides.com
`;

  // ─── HTML ───────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to TechFides</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e2e8f0;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">

    <div style="margin-bottom:32px;">
      <span style="font-size:22px;font-weight:700;color:#0ea5e9;letter-spacing:-0.02em;">TechFides</span>
    </div>

    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px 0;color:#f8fafc;letter-spacing:-0.02em;">
      Welcome to TechFides, ${firstName}.
    </h1>
    <p style="font-size:15px;line-height:1.6;color:#cbd5e1;margin:0 0 24px 0;">
      You've been added to the team as <strong style="color:#f8fafc;">${input.role}</strong>
      (${input.type}). We're glad to have you on board.
    </p>

    <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;margin:24px 0;">
      <h2 style="font-size:14px;font-weight:600;margin:0 0 8px 0;color:#0ea5e9;text-transform:uppercase;letter-spacing:0.06em;">Set up your account</h2>
      <p style="font-size:14px;line-height:1.5;color:#cbd5e1;margin:0 0 16px 0;">
        Click below to create your password. The link is good for 72 hours (${input.setupExpiresLabel}).
      </p>
      <a href="${input.setupUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:14px;">
        Set Your Password →
      </a>
      <p style="font-size:12px;line-height:1.5;color:#94a3b8;margin:16px 0 0 0;">
        After your password, you'll be prompted to enable two-factor authentication.
        This is required for everyone — no exceptions.
      </p>
    </div>

    <div style="margin:24px 0;">
      <h2 style="font-size:14px;font-weight:600;margin:0 0 8px 0;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">Your Access</h2>
      <p style="font-size:14px;line-height:1.6;color:#cbd5e1;margin:0;">
        <strong style="color:#f8fafc;">${input.appRole}</strong> &mdash; ${accessSummary}
      </p>
    </div>

    <div style="margin:24px 0;">
      <h2 style="font-size:14px;font-weight:600;margin:0 0 8px 0;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">What's Queued For You</h2>
      <p style="font-size:14px;line-height:1.6;color:#cbd5e1;margin:0 0 12px 0;">
        ${input.totalTasks} onboarding task${input.totalTasks === 1 ? "" : "s"} are waiting in the system. The first few:
      </p>
      <ol style="font-size:14px;line-height:1.7;color:#cbd5e1;margin:0;padding-left:20px;">
        ${input.taskPreview.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
      </ol>
      ${remainingCount > 0 ? `<p style="font-size:13px;color:#94a3b8;margin:12px 0 0 0;">...and ${remainingCount} more once you log in.</p>` : ""}
    </div>

    <div style="margin:24px 0;">
      <h2 style="font-size:14px;font-weight:600;margin:0 0 8px 0;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">Your HR Folder</h2>
      <p style="font-size:14px;line-height:1.6;color:#cbd5e1;margin:0 0 8px 0;">
        A folder has been scaffolded for your records:
      </p>
      <code style="display:block;font-size:12px;font-family:'SF Mono',Menlo,monospace;color:#0ea5e9;background:#0f172a;padding:10px 12px;border-radius:6px;border:1px solid #334155;word-break:break-all;">
        ${escapeHtml(input.folderPath)}
      </code>
      <p style="font-size:12px;line-height:1.5;color:#94a3b8;margin:8px 0 0 0;">
        Five subfolders (Hiring, Onboarding, Compliance, Performance, Compensation) plus an auto-generated README.
      </p>
    </div>

    <hr style="border:none;border-top:1px solid #334155;margin:32px 0;">

    <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:0 0 8px 0;">
      Questions? Reply to this email or write to
      <a href="mailto:engage@techfides.com" style="color:#0ea5e9;">engage@techfides.com</a>.
      For urgent issues, call Jacques directly.
    </p>

    <p style="font-size:13px;color:#cbd5e1;margin:24px 0 4px 0;">Welcome aboard,</p>
    <p style="font-size:13px;color:#f8fafc;font-weight:600;margin:0 0 24px 0;">— TechFides Team</p>

    <p style="font-size:11px;color:#64748b;margin:0;line-height:1.5;">
      TechFides LLC &middot; Frisco, TX &middot;
      <a href="https://techfides.com" style="color:#64748b;">techfides.com</a>
    </p>
  </div>
</body></html>`;

  return {
    subject: `Welcome to TechFides — set up your account`,
    text,
    html,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
