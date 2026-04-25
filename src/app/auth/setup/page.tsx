import { redirect } from "next/navigation";

import { verifySetupToken } from "@/lib/auth/setup-token";
import { db } from "@/lib/db";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

import { SetupClient } from "./SetupClient";

/**
 * /auth/setup?token=xxxxx
 *
 * Server component that:
 *   1. Reads the token from the query string
 *   2. Verifies it against the database (without consuming)
 *   3. If valid, generates a fresh TOTP secret + QR code for MFA
 *   4. Renders the SetupClient with the user's data and the QR
 *
 * Token is consumed by SetupClient when it POSTs to /api/v1/auth/setup/complete.
 */

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <ErrorScreen title="Missing setup link" body="The link in your welcome email is incomplete. Check that you copied the full URL from the email." />;
  }

  const verify = await verifySetupToken(token);
  if (!verify.ok) {
    const message =
      verify.reason === "expired"
        ? "This setup link has expired. Ask an admin to re-send your welcome email."
        : verify.reason === "already-consumed"
        ? "This setup link has already been used. If you didn't complete setup, ask an admin to re-send your welcome email."
        : "This setup link is not valid.";
    return <ErrorScreen title="Setup link unavailable" body={message} />;
  }

  // Look up the user so we can show their name + role on the page
  const user = await db.user.findUnique({
    where: { id: verify.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return <ErrorScreen title="Account not found" body="This setup link points to a user that no longer exists. Contact engage@techfides.com." />;
  }

  // Generate a fresh TOTP secret + QR each page load. The user shouldn't
  // refresh halfway through setup (that would invalidate the QR they
  // already scanned), but if they do, the new QR overwrites the old one.
  const mfaSecret = generateSecret();
  const otpauthUrl = generateURI({
    secret: mfaSecret,
    label: user.email,
    issuer: "TechFides",
  });
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
    margin: 1,
    width: 200,
    color: { dark: "#0ea5e9", light: "#0f172a" },
  });

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-200">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-tight text-electric-400">TechFides</p>
        </div>
        <SetupClient
          token={token}
          name={user.name ?? user.email}
          email={user.email}
          role={user.role}
          mfaSecret={mfaSecret}
          qrDataUrl={qrDataUrl}
        />
      </div>
    </div>
  );
}

function ErrorScreen({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <p className="text-2xl font-bold tracking-tight text-electric-400">TechFides</p>
        <h1 className="mt-6 text-xl font-bold text-white">{title}</h1>
        <p className="mt-3 text-sm text-slate-400">{body}</p>
        <a
          href="mailto:engage@techfides.com"
          className="mt-6 inline-block rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-600 hover:text-white"
        >
          Contact engage@techfides.com
        </a>
      </div>
    </div>
  );
}
