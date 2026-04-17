import type { ReactNode } from "react";

type ArtifactSectionProps = {
  number: string;
  title: string;
  intent?: string;
  children: ReactNode;
  pageBreak?: boolean;
};

export function ArtifactSection({
  number,
  title,
  intent,
  children,
  pageBreak = false,
}: ArtifactSectionProps) {
  return (
    <section
      className={`artifact-section ${pageBreak ? "artifact-page-break" : ""}`}
    >
      <header className="mb-6 flex items-baseline gap-4 border-l-2 border-electric-500 pl-4">
        <span className="font-mono text-xs font-bold tracking-widest text-electric-400">
          {number}
        </span>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
      </header>
      {intent && (
        <p className="mb-6 max-w-3xl text-sm italic text-slate-400">
          <span className="font-semibold not-italic text-slate-300">
            Intent —
          </span>{" "}
          {intent}
        </p>
      )}
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function SubSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="artifact-subsection">
      <h3 className="mb-3 text-lg font-semibold text-slate-100">{title}</h3>
      <div className="space-y-3 text-sm text-slate-300">{children}</div>
    </div>
  );
}

export function GuidanceCallout({ children }: { children: ReactNode }) {
  return (
    <aside className="artifact-callout rounded-md border border-accent-amber/30 bg-accent-amber/5 p-4 text-sm text-slate-300">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent-amber">
        Consultant Guidance
      </p>
      {children}
    </aside>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="artifact-placeholder rounded-sm bg-electric-500/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-electric-400">
      [{children}]
    </span>
  );
}
