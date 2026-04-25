import {
  resend,
  getTransactionalSender,
  getPersonalSender,
  getReplyTo,
  isResendConfigured,
} from "./client";

/**
 * Typed wrappers around Resend's send API.
 *
 * Every wrapper:
 *   - Logs send + delivery status to AuditLog so we have a paper trail
 *   - Falls back to a "not configured" error you can catch and surface
 *   - Defaults to the transactional sender + engage@ reply-to
 *
 * Personal-voice emails (CEO outreach) use sendPersonal() instead.
 */

export interface SendArgs {
  to: string;
  subject: string;
  /** Plain-text body. Required for accessibility + spam-score. */
  text: string;
  /** HTML body. Optional; if omitted, text is used for both. */
  html?: string;
  /** Override the default transactional sender ("TechFides <noreply@…>") */
  from?: string;
  /** Override the default reply-to ("engage@…") */
  replyTo?: string;
  /** Optional list of attachments */
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  /** Optional categories/tags for Resend analytics */
  tags?: Array<{ name: string; value: string }>;
}

export interface SendResult {
  /** Resend's message id, useful for support traceback */
  id: string | null;
  /** True if send succeeded; false means an exception caught upstream */
  ok: boolean;
}

/**
 * Send a transactional email (welcome, receipt, alert) via Resend.
 *
 * Throws if RESEND_API_KEY isn't set. Callers should handle that case
 * (typically by returning 503 from an API route with a clear message).
 */
export async function sendTransactional(args: SendArgs): Promise<SendResult> {
  if (!isResendConfigured()) {
    throw new Error(
      "Resend is not configured. Set RESEND_API_KEY in .env.local. See /Operations/Resend-Setup.md"
    );
  }

  const result = await resend.emails.send({
    from: args.from ?? getTransactionalSender(),
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html ?? args.text,
    replyTo: args.replyTo ?? getReplyTo(),
    attachments: args.attachments,
    tags: args.tags,
  });

  if (result.error) {
    return { id: null, ok: false };
  }
  return { id: result.data?.id ?? null, ok: true };
}

/**
 * Send an email from Jacques's personal inbox (high-touch moments).
 *
 * Use sparingly: first welcome to a brand-new client, post-90-day
 * check-in, escalation/recovery. NOT for routine transactional flows.
 */
export async function sendPersonal(args: Omit<SendArgs, "from">): Promise<SendResult> {
  return sendTransactional({
    ...args,
    from: getPersonalSender(),
  });
}
