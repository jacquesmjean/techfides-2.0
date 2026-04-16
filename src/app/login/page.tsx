"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/gse";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      mfaCode,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("login.error"));
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="grid-pattern flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-navy-900/50 p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="glow-text text-3xl font-bold text-electric-400">
              TechFides
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {t("login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                {t("login.emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-electric-500 focus:outline-none"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                {t("login.passwordLabel")}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="mfaCode"
                className="block text-sm font-medium text-slate-300"
              >
                {t("login.mfaLabel")} <span className="text-slate-500">{t("login.mfaHint")}</span>
              </label>
              <input
                id="mfaCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-electric-500 focus:outline-none"
                placeholder="000000"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glow-blue w-full rounded-lg bg-electric-500 py-3 text-sm font-semibold text-white transition-all hover:bg-electric-400 disabled:opacity-50"
            >
              {loading ? t("login.signingIn") : t("login.signIn")}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            {t("login.footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
