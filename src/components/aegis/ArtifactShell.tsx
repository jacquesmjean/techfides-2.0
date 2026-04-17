import Link from "next/link";
import type { ReactNode } from "react";

type Classification = "DRAFT" | "CONFIDENTIAL" | "CLIENT-RESTRICTED" | "BOARD";

type ArtifactShellProps = {
  module: string;
  moduleAccent?: string;
  artifactNumber: string;
  title: string;
  subtitle: string;
  version?: string;
  classification?: Classification;
  client?: string;
  engagementId?: string;
  children: ReactNode;
};

const classificationStyle: Record<Classification, string> = {
  DRAFT: "border-slate-600 text-slate-300 bg-slate-800/60",
  CONFIDENTIAL: "border-accent-amber/50 text-accent-amber bg-accent-amber/10",
  "CLIENT-RESTRICTED": "border-purple-500/50 text-purple-300 bg-purple-500/10",
  BOARD: "border-electric-500/50 text-electric-400 bg-electric-500/10",
};

export function ArtifactShell({
  module,
  moduleAccent = "text-electric-400",
  artifactNumber,
  title,
  subtitle,
  version = "v1.0",
  classification = "DRAFT",
  client = "[CLIENT NAME]",
  engagementId = "[ENGAGEMENT ID]",
  children,
}: ArtifactShellProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="artifact-shell min-h-screen bg-slate-950 text-slate-100">
      {/* Toolbar — hidden in print */}
      <div className="artifact-toolbar sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link
            href="/aegis/templates"
            className="text-xs font-medium text-slate-400 transition hover:text-electric-400"
          >
            ← Back to templates
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {engagementId} · {today}
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md border border-electric-500/40 bg-electric-500/10 px-3 py-1.5 text-xs font-semibold text-electric-400 transition hover:bg-electric-500/20"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Document */}
      <article className="artifact-document mx-auto max-w-5xl px-6 py-16">
        {/* Cover */}
        <header className="artifact-cover mb-16 border-b border-slate-800 pb-12">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                AEGIS · {module}
              </p>
              <p
                className={`mt-1 text-xs font-semibold uppercase tracking-[0.2em] ${moduleAccent}`}
              >
                Artifact {artifactNumber}
              </p>
            </div>
            <span
              className={`rounded-sm border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${classificationStyle[classification]}`}
            >
              {classification}
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-400">{subtitle}</p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-slate-800 pt-8 text-sm md:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Client
              </dt>
              <dd className="mt-1 font-semibold text-slate-200">{client}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Engagement
              </dt>
              <dd className="mt-1 font-semibold text-slate-200">
                {engagementId}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Version
              </dt>
              <dd className="mt-1 font-semibold text-slate-200">{version}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Issued
              </dt>
              <dd className="mt-1 font-semibold text-slate-200">{today}</dd>
            </div>
          </dl>

          <p className="mt-6 text-xs text-slate-500">
            Delivered by <span className="font-semibold text-slate-300">TechFides</span> under
            the AEGIS Governance Operating Services engagement. This document
            is proprietary to the client named above. Redistribution beyond the
            engagement steering committee requires written consent.
          </p>
        </header>

        {/* Body */}
        <div className="artifact-body space-y-16">{children}</div>

        {/* Footer */}
        <footer className="artifact-footer mt-24 border-t border-slate-800 pt-8 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span>
              AEGIS {module} · Artifact {artifactNumber} · {version}
            </span>
            <span>© TechFides · techfides.com</span>
          </div>
        </footer>
      </article>
    </div>
  );
}
