import Link from "next/link";

type ArtifactEntry = {
  number: string;
  title: string;
  slug?: string;
  phase: 1 | 2 | 3;
};

type ModuleEntry = {
  layer: string;
  name: string;
  accent: string;
  artifacts: ArtifactEntry[];
};

const modules: ModuleEntry[] = [
  {
    layer: "Governance",
    name: "AEGIS Policy Core",
    accent: "text-electric-400",
    artifacts: [
      {
        number: "1.1",
        title: "AI Acceptable Use Policy",
        phase: 2,
      },
      {
        number: "1.2",
        title: "RACI for AI Decisions",
        phase: 2,
      },
      {
        number: "1.3",
        title: "AI Risk Register",
        phase: 2,
      },
    ],
  },
  {
    layer: "Security, Trust & Resilience",
    name: "AEGIS Shield",
    accent: "text-purple-400",
    artifacts: [
      {
        number: "2.1",
        title: "Data Classification & AI Data Map",
        phase: 2,
      },
      {
        number: "2.2",
        title: "Vendor & Tool Risk Assessments",
        phase: 2,
      },
      {
        number: "2.3",
        title: "AI Incident Response Runbook",
        phase: 2,
      },
    ],
  },
  {
    layer: "Intelligence",
    name: "AEGIS Signal",
    accent: "text-indigo-400",
    artifacts: [
      {
        number: "3.1",
        title: "AI Inventory Dashboard",
        phase: 3,
      },
      {
        number: "3.2",
        title: "Shadow AI Scan Report",
        slug: "shadow-ai-scan-methodology",
        phase: 1,
      },
      {
        number: "3.3",
        title: "Value & Spend Tracker",
        phase: 3,
      },
    ],
  },
  {
    layer: "Execution",
    name: "AEGIS Deploy",
    accent: "text-cyan-400",
    artifacts: [
      {
        number: "4.1",
        title: "Governed Workflow Automations",
        phase: 3,
      },
      {
        number: "4.2",
        title: "Prompt & Template Library",
        phase: 3,
      },
      {
        number: "4.3",
        title: "SOP Updates for AI-Assisted Work",
        phase: 3,
      },
    ],
  },
  {
    layer: "Operations",
    name: "AEGIS Cadence",
    accent: "text-accent-green",
    artifacts: [
      {
        number: "5.1",
        title: "Quarterly Governance Review Template",
        phase: 3,
      },
      {
        number: "5.2",
        title: "Adoption Playbook",
        phase: 3,
      },
      {
        number: "5.3",
        title: "Role-Based Training Curriculum",
        phase: 3,
      },
    ],
  },
  {
    layer: "Leadership",
    name: "AEGIS Brief",
    accent: "text-accent-amber",
    artifacts: [
      {
        number: "6.1",
        title: "Executive AI Dashboard",
        phase: 3,
      },
      {
        number: "6.2",
        title: "Board Reporting Pack",
        phase: 3,
      },
      {
        number: "6.3",
        title: "12-Month AI Roadmap",
        phase: 3,
      },
    ],
  },
];

const diagnosticArtifacts: ArtifactEntry[] = [
  {
    number: "D.1",
    title: "Stakeholder Interview Guide",
    slug: "stakeholder-interview-guide",
    phase: 1,
  },
  {
    number: "D.2",
    title: "6-Layer Gap Assessment Framework",
    slug: "gap-assessment",
    phase: 1,
  },
  {
    number: "D.3",
    title: "90-Day Governance Roadmap",
    slug: "ninety-day-roadmap",
    phase: 1,
  },
  {
    number: "D.4",
    title: "Executive Summary & Board Deck",
    slug: "executive-summary-deck",
    phase: 1,
  },
];

const phaseLabels: Record<1 | 2 | 3, { label: string; style: string }> = {
  1: {
    label: "READY",
    style: "border-accent-green/50 text-accent-green bg-accent-green/5",
  },
  2: {
    label: "PHASE 2",
    style: "border-slate-600 text-slate-400 bg-slate-800/50",
  },
  3: {
    label: "PHASE 3",
    style: "border-slate-700 text-slate-500 bg-slate-900/50",
  },
};

function ArtifactRow({ artifact }: { artifact: ArtifactEntry }) {
  const phase = phaseLabels[artifact.phase];
  const row = (
    <>
      <span className="font-mono text-xs text-slate-500">{artifact.number}</span>
      <span className="flex-1 text-sm text-slate-200">{artifact.title}</span>
      <span
        className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${phase.style}`}
      >
        {phase.label}
      </span>
    </>
  );
  if (artifact.slug) {
    return (
      <Link
        href={`/aegis/templates/${artifact.slug}`}
        className="flex items-center gap-4 rounded-md border border-slate-800 bg-navy-900/30 px-4 py-3 transition hover:border-electric-500/50 hover:bg-navy-900/60"
      >
        {row}
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-4 rounded-md border border-slate-800/60 bg-navy-900/10 px-4 py-3 opacity-60">
      {row}
    </div>
  );
}

export default function AegisTemplatesIndex() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="border-b border-slate-800 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-400">
            AEGIS · Delivery Workspace
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Artifact Templates
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Source-of-truth templates for every engagement. Diagnostic
            artifacts deliver the 2-week assessment; modules 1 through 6
            deliver the 90-day Core Implementation.
          </p>
        </div>

        {/* Diagnostic */}
        <section className="mt-12">
          <header className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Diagnostic Engagement · 2 weeks
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                Diagnostic Artifacts
              </h2>
            </div>
            <span className="rounded-sm border border-accent-green/50 bg-accent-green/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-green">
              4 Ready
            </span>
          </header>
          <div className="space-y-2">
            {diagnosticArtifacts.map((a) => (
              <ArtifactRow key={a.number} artifact={a} />
            ))}
          </div>
        </section>

        {/* 6 Modules */}
        <section className="mt-16">
          <header className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Core Implementation · 90 days
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              18 Artifacts across 6 Modules
            </h2>
          </header>
          <div className="grid gap-8 md:grid-cols-2">
            {modules.map((mod) => (
              <div
                key={mod.name}
                className="rounded-lg border border-slate-800 bg-navy-900/30 p-5"
              >
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {mod.layer}
                    </p>
                    <h3 className={`mt-1 text-base font-bold ${mod.accent}`}>
                      {mod.name}
                    </h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {mod.artifacts.map((a) => (
                    <ArtifactRow key={a.number} artifact={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-slate-800 pt-8 text-xs text-slate-500">
          <p>
            Templates are version-controlled in the TechFides repo under
            <code className="mx-1 rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
              src/app/aegis/templates/
            </code>
            . Client engagements receive a copied workspace; source templates
            evolve centrally.
          </p>
        </footer>
      </div>
    </div>
  );
}
