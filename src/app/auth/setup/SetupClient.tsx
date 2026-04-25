"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  name: string;
  email: string;
  role: string;
  mfaSecret: string;
  qrDataUrl: string;
}

/**
 * Two-step setup form:
 *   Step 1 — Set password (with strength check)
 *   Step 2 — Scan QR + verify first 6-digit MFA code
 *   Submit — POST /api/v1/auth/setup/complete with token + password +
 *            mfaSecret + mfaCode. Server hashes pw, saves secret, marks
 *            token consumed, returns 200.
 *
 * After success, redirects to /login with a success banner.
 */
export function SetupClient(props: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordOk = password.length >= 12 && password === confirm;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(mfaCode)) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/setup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: props.token,
          password,
          mfaSecret: props.mfaSecret,
          mfaCode,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      router.push("/login?setup=success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Setup failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
      <p className="text-xs uppercase tracking-wider text-slate-400">
        Step {step} of 2
      </p>
      <h1 className="mt-2 text-2xl font-bold text-white">
        Welcome, {props.name.split(/\s+/)[0]}
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Account: <span className="text-slate-300">{props.email}</span>{" · "}
        Role: <span className="text-slate-300">{props.role}</span>
      </p>

      {step === 1 && (
        <form onSubmit={handleNext} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Create a password (12+ characters)
            </label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
              placeholder="••••••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Confirm password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
              placeholder="••••••••••••"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Use a passphrase or password manager. Avoid reusing a password from another service.
          </p>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!passwordOk}
            className={`w-full rounded-lg py-3 text-sm font-semibold transition-all ${
              passwordOk
                ? "bg-electric-500 text-white hover:bg-electric-400 active:scale-[0.98]"
                : "cursor-not-allowed bg-slate-800 text-slate-500"
            }`}
          >
            Continue to two-factor setup →
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <p className="text-sm text-slate-300">
              Open your authenticator app (Google Authenticator, Authy, 1Password, etc.) and scan this QR code:
            </p>
            <div className="mt-4 flex justify-center">
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <img src={props.qrDataUrl} alt="MFA QR Code" width={200} height={200} />
              </div>
            </div>
            <details className="mt-3 text-[11px] text-slate-500">
              <summary className="cursor-pointer">Can't scan? Show secret as text</summary>
              <code className="mt-2 block break-all rounded bg-slate-950 p-2 text-electric-400">
                {props.mfaSecret}
              </code>
            </details>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400">
              Enter the 6-digit code from your app
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-center font-mono text-lg tracking-[0.4em] text-white focus:border-electric-500 focus:outline-none"
              placeholder="000000"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Codes refresh every 30 seconds. If yours just refreshed, wait for the next one.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-slate-700 py-3 text-sm font-semibold text-slate-300 hover:border-slate-600 hover:text-white"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={submitting || mfaCode.length !== 6}
              className={`flex-[2] rounded-lg py-3 text-sm font-semibold transition-all ${
                submitting || mfaCode.length !== 6
                  ? "cursor-not-allowed bg-slate-800 text-slate-500"
                  : "bg-electric-500 text-white hover:bg-electric-400 active:scale-[0.98]"
              }`}
            >
              {submitting ? "Finishing setup..." : "Complete setup"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
