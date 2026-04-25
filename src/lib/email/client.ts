import { Resend } from "resend";

/**
 * Resend SDK singleton.
 *
 * Reuse one instance across requests in dev to avoid HMR re-instantiation.
 * Reads RESEND_API_KEY from env. Throws clearly if not configured so we
 * fail fast at send time rather than silently dropping emails.
 *
 * Setup: see /Operations/Resend-Setup.md
 *
 * Env vars:
 *   RESEND_API_KEY        re_... — server-side, never expose to client
 *   EMAIL_FROM_TX         transactional sender, e.g. "TechFides <noreply@techfides.com>"
 *   EMAIL_FROM_PERSONAL   personal sender, e.g. "Jacques M. Jean <jacques.jean@techfides.com>"
 *   EMAIL_REPLY_TO        reply-to header, e.g. "engage@techfides.com"
 */

declare global {
  // eslint-disable-next-line no-var
  var resend: Resend | undefined;
}

function buildClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env.local (test mode) or Vercel env (production). See /Operations/Resend-Setup.md"
    );
  }
  return new Resend(key);
}

export const resend: Resend =
  global.resend ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  global.resend = resend;
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getTransactionalSender(): string {
  return process.env.EMAIL_FROM_TX ?? "TechFides <noreply@techfides.com>";
}

export function getPersonalSender(): string {
  return process.env.EMAIL_FROM_PERSONAL ?? "Jacques M. Jean <jacques.jean@techfides.com>";
}

export function getReplyTo(): string {
  return process.env.EMAIL_REPLY_TO ?? "engage@techfides.com";
}
