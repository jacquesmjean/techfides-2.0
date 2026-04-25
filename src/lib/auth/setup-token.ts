import { randomBytes } from "node:crypto";

import { db } from "@/lib/db";

/**
 * One-time setup token system for new-employee account activation.
 *
 * Flow:
 *   1. Admin clicks "Send Welcome Email" on /gse/hr
 *   2. Server calls issueSetupToken(userId) → URL with token
 *   3. Email sent containing https://app/auth/setup?token=<token>
 *   4. New employee clicks link → /auth/setup verifies token via verifySetupToken()
 *   5. They set password + scan TOTP → /api/v1/auth/setup/complete consumes the token
 *
 * Tokens are:
 *   - 24 chars (~144 bits of entropy) — base64url, URL-safe
 *   - Expire 72 hours after issue (re-issuable)
 *   - Single-use — consumeSetupToken() marks consumedAt and rejects future use
 *   - Bound to the user's email at issue time so a rename doesn't auto-grant access
 */

const TOKEN_BYTES = 18; // 24 base64url chars
const TOKEN_TTL_MS = 72 * 60 * 60 * 1000; // 72 hours

export interface IssueResult {
  token: string;
  expiresAt: Date;
  setupUrl: string;
}

export interface VerifyResult {
  ok: boolean;
  reason?: "not-found" | "expired" | "already-consumed";
  userId?: string;
  email?: string;
}

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
}

/**
 * Issue a fresh setup token for a User.
 * Invalidates any pending unconsumed tokens for the same user (last issued wins).
 */
export async function issueSetupToken(userId: string): Promise<IssueResult> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`User not found: ${userId}`);

  // Invalidate prior tokens — only the most recent should be live
  await db.userSetupToken.updateMany({
    where: { userId, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db.userSetupToken.create({
    data: {
      userId,
      token,
      email: user.email,
      expiresAt,
    },
  });

  const setupUrl = `${getAppUrl()}/auth/setup?token=${token}`;
  return { token, expiresAt, setupUrl };
}

/**
 * Read a token without consuming it. Used by the /auth/setup page to
 * show the user's name and validate before they enter a password.
 */
export async function verifySetupToken(token: string): Promise<VerifyResult> {
  if (!token || token.length < 16) return { ok: false, reason: "not-found" };

  const record = await db.userSetupToken.findUnique({ where: { token } });
  if (!record) return { ok: false, reason: "not-found" };

  if (record.consumedAt) return { ok: false, reason: "already-consumed" };

  if (record.expiresAt < new Date()) return { ok: false, reason: "expired" };

  return { ok: true, userId: record.userId, email: record.email };
}

/**
 * Consume a token — marks it used so it can't be replayed.
 * Throws if the token is invalid; callers should call verifySetupToken first.
 */
export async function consumeSetupToken(token: string): Promise<{ userId: string }> {
  const record = await db.userSetupToken.findUnique({ where: { token } });
  if (!record) throw new Error("Token not found");
  if (record.consumedAt) throw new Error("Token already consumed");
  if (record.expiresAt < new Date()) throw new Error("Token expired");

  await db.userSetupToken.update({
    where: { token },
    data: { consumedAt: new Date() },
  });

  return { userId: record.userId };
}
