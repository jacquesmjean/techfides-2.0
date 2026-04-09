"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="grid-pattern flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-red-400">Error</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-100">
          Something Went Wrong
        </h1>
        <p className="mt-4 max-w-md text-lg text-slate-400">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-electric-400"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
