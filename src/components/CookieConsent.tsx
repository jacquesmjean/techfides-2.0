"use client";

import { useState, useEffect } from "react";

/**
 * GDPR Cookie Consent Banner
 *
 * Shows on first visit. Stores preference in localStorage.
 * TechFides only uses essential cookies (locale preference) and
 * optional analytics. This banner satisfies GDPR active consent.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("techfides-cookie-consent");
    if (!consent) {
      // Show after a short delay to avoid layout shift
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("techfides-cookie-consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("techfides-cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-300">
            We use essential cookies to remember your language preference.
            Optional analytics cookies help us improve the site.{" "}
            <a
              href="/privacy"
              className="text-electric-400 underline hover:text-electric-300"
            >
              Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-electric-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-electric-400"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
