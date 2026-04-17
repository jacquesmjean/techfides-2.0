type Framework =
  | "NIST AI RMF"
  | "SOC 2"
  | "HIPAA"
  | "GDPR"
  | "ISO 27001"
  | "ISO 42001"
  | "EU AI Act"
  | "FedRAMP"
  | "PCI DSS";

const frameworkColor: Record<Framework, string> = {
  "NIST AI RMF": "border-electric-500/40 text-electric-400 bg-electric-500/5",
  "SOC 2": "border-purple-500/40 text-purple-300 bg-purple-500/5",
  HIPAA: "border-accent-green/40 text-accent-green bg-accent-green/5",
  GDPR: "border-cyan-500/40 text-cyan-300 bg-cyan-500/5",
  "ISO 27001": "border-indigo-500/40 text-indigo-300 bg-indigo-500/5",
  "ISO 42001": "border-indigo-500/40 text-indigo-300 bg-indigo-500/5",
  "EU AI Act": "border-rose-500/40 text-rose-300 bg-rose-500/5",
  FedRAMP: "border-accent-amber/40 text-accent-amber bg-accent-amber/5",
  "PCI DSS": "border-slate-500/40 text-slate-300 bg-slate-500/5",
};

type RegulatoryTagsProps = {
  frameworks: Array<{ name: Framework; control?: string }>;
};

export function RegulatoryTags({ frameworks }: RegulatoryTagsProps) {
  return (
    <div className="artifact-regulatory-tags">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Maps To
      </p>
      <div className="flex flex-wrap gap-2">
        {frameworks.map((f) => (
          <span
            key={`${f.name}-${f.control ?? ""}`}
            className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-semibold ${frameworkColor[f.name]}`}
          >
            {f.name}
            {f.control && (
              <span className="font-mono text-[10px] opacity-75">
                {f.control}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
