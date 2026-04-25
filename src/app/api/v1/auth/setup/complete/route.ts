import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { verifySync } from "otplib";

import { db } from "@/lib/db";
import { verifySetupToken, consumeSetupToken } from "@/lib/auth/setup-token";

/**
 * POST /api/v1/auth/setup/complete
 *
 * Completes a new-employee account setup. Called from /auth/setup after
 * the user enters their password and verifies their first MFA code.
 *
 * Body:
 *   {
 *     token:     string  — the one-time setup token from the email link
 *     password:  string  — min 12 chars (we want strong defaults)
 *     mfaSecret: string  — base32 TOTP secret generated client-side and
 *                          shown via QR; we verify mfaCode against it
 *     mfaCode:   string  — first 6-digit TOTP code, proves the user has
 *                          actually scanned the QR successfully
 *   }
 *
 * Returns: 200 { ok: true } and the user is ready to log in.
 *          400 if the token is invalid, password too weak, or MFA code wrong.
 */

const Schema = z.object({
  token: z.string().min(16).max(128),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(200),
  mfaSecret: z.string().min(16).max(64), // base32 TOTP secret
  mfaCode: z.string().regex(/^\d{6}$/, "MFA code must be 6 digits"),
});

const BCRYPT_ROUNDS = 12;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { token, password, mfaSecret, mfaCode } = parsed.data;

  // 1. Verify the token (no consume yet)
  const verify = await verifySetupToken(token);
  if (!verify.ok) {
    const reason = verify.reason ?? "invalid";
    const message =
      reason === "expired"
        ? "This setup link has expired. Ask an admin to re-send your welcome email."
        : reason === "already-consumed"
        ? "This setup link has already been used. If you didn't complete setup, ask an admin to re-send."
        : "This setup link is not valid.";
    return NextResponse.json({ error: message, reason }, { status: 400 });
  }

  // 2. Verify the MFA code matches the secret BEFORE we save anything
  // — proves the user has actually scanned the QR and isn't locked out.
  const verifyResult = verifySync({
    token: mfaCode,
    secret: mfaSecret,
    strategy: "totp",
  });
  if (!verifyResult.valid) {
    return NextResponse.json(
      {
        error:
          "MFA code didn't match. Make sure your authenticator app is showing the current 6-digit code, then try again.",
      },
      { status: 400 }
    );
  }

  // 3. Hash the password
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // 4. Update the user, mark email verified, save MFA, consume the token
  // (a transaction would be cleaner but Prisma's $transaction with token
  // consume is verbose — we do it sequentially and audit the result.)
  await db.user.update({
    where: { id: verify.userId },
    data: {
      passwordHash,
      passwordSetAt: new Date(),
      mfaSecret,
      mfaEnabled: true,
      emailVerified: new Date(), // setup link click counts as email verification
    },
  });

  await consumeSetupToken(token);

  await db.auditLog.create({
    data: {
      userId: verify.userId,
      action: "complete_account_setup",
      resource: `User/${verify.userId}`,
      metadata: {
        email: verify.email,
        mfaEnabled: true,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
