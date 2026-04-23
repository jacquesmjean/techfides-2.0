"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const stackLayers = [
  {
    layer: "Hardware Layer",
    color: "from-slate-600 to-slate-700",
    description:
      "Enterprise-grade compute deployed on-premise. Mac Studio clusters, NVIDIA GPU servers, or custom-spec hardware matched to your workload.",
    components: [
      {
        name: "Compute",
        detail: "Apple Silicon (M-series) or NVIDIA A100/H100 GPU clusters sized to your model requirements and user concurrency.",
      },
      {
        name: "Storage",
        detail: "NVMe SSD arrays with RAID redundancy. Your data, your drives, your building. Encrypted at rest with hardware-backed keys.",
      },
      {
        name: "Network",
        detail: "Isolated VLAN deployment on your existing network. Zero internet dependency for inference. Air-gapped option available.",
      },
    ],
  },
  {
    layer: "Inference Engine",
    color: "from-navy-700 to-navy-800",
    description:
      "The core runtime that powers AI inference on your local hardware. Optimized for throughput and latency at enterprise scale.",
    components: [
      {
        name: "Model Runtime",
        detail: "llama.cpp, vLLM, or Ollama-based serving layer optimized for your specific hardware. Sub-second inference for most queries.",
      },
      {
        name: "Model Manager",
        detail: "Hot-swap between models without downtime. Run Llama 3, Mistral, CodeLlama, or domain-specific models simultaneously.",
      },
      {
        name: "Quantization Engine",
        detail: "Optimized model quantization (GGUF, GPTQ, AWQ) to maximize performance on your hardware without sacrificing output quality.",
      },
    ],
  },
  {
    layer: "Intelligence Layer",
    color: "from-electric-600/80 to-electric-700/80",
    description:
      "The brains of the stack. RAG pipelines, fine-tuning, and prompt engineering tailored to your industry and data.",
    components: [
      {
        name: "RAG Pipeline",
        detail: "Retrieval-Augmented Generation built on your documents, databases, and knowledge base. ChromaDB or Weaviate running locally.",
      },
      {
        name: "Fine-Tuning Engine",
        detail: "LoRA/QLoRA fine-tuning on your proprietary data. Models learn your terminology, workflows, and business logic over time.",
      },
      {
        name: "Prompt Engineering",
        detail: "Industry-specific system prompts and guardrails. Ensures outputs match your compliance requirements and brand voice.",
      },
    ],
  },
  {
    layer: "Application Layer",
    color: "from-electric-400/80 to-electric-500/80",
    description:
      "The interfaces your team actually uses. Web dashboards, API endpoints, and integrations with your existing tools.",
    components: [
      {
        name: "Web Interface",
        detail: "Clean, internal-facing chat and workflow UI. Role-based access control. No internet required after deployment.",
      },
      {
        name: "REST API",
        detail: "OpenAI-compatible API running on your network. Drop-in replacement for cloud AI in your existing scripts and tools.",
      },
      {
        name: "Integrations",
        detail: "Pre-built connectors for EHRs, DMS systems, CRMs, and industry tools. Custom webhook and automation support.",
      },
    ],
  },
  {
    layer: "Security & Compliance",
    color: "from-accent-green/60 to-accent-green/80",
    description:
      "Enterprise security at every layer. Audit trails, encryption, access control, and compliance reporting built in — not bolted on.",
    components: [
      {
        name: "Audit Logging",
        detail: "Every query, every response, every user action logged with timestamps. Export-ready for compliance audits and legal holds.",
      },
      {
        name: "Encryption",
        detail: "AES-256 at rest, TLS 1.3 in transit (on your LAN). Hardware security modules (HSM) available for key management.",
      },
      {
        name: "Access Control",
        detail: "RBAC with Active Directory / LDAP integration. SSO support. Granular permissions by model, function, and data scope.",
      },
    ],
  },
];

const models = [
  {
    name: "Llama 3",
    provider: "Meta",
    strength: "General-purpose excellence. Strong reasoning, coding, and instruction-following.",
    sizes: "8B, 70B, 405B",
  },
  {
    name: "Mistral / Mixtral",
    provider: "Mistral AI",
    strength: "Exceptional efficiency. High performance at smaller model sizes. Great for constrained hardware.",
    sizes: "7B, 8x7B, 8x22B",
  },
  {
    name: "CodeLlama",
    provider: "Meta",
    strength: "Purpose-built for code generation, review, and technical documentation.",
    sizes: "7B, 13B, 34B, 70B",
  },
  {
    name: "Domain-Specific",
    provider: "Various / Custom",
    strength: "Medical (BioMistral), Legal (SaulLM), Financial models fine-tuned for your vertical.",
    sizes: "Varies",
  },
];

export default function StackPage() {
  const { t } = useI18n();

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-sm font-mono text-electric-400">
            {t("stack.badge")}
          </div>
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("stack.heroTitle1")}{" "}
            <span className="text-electric-400">{t("stack.heroTitle2")}</span>
            <br />
            {t("stack.heroTitle3")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            {t("stack.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Stack Diagram */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("stack.fullStackTitle")} <span className="text-electric-400">{t("stack.fullStackTitleHighlight")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("stack.fullStackSubtitle")}
        </p>

        <div className="mt-12 space-y-4">
          {stackLayers.map((layer, i) => (
            <div key={layer.layer}>
              <div
                className={`rounded-2xl border border-slate-700/50 bg-gradient-to-r ${layer.color} p-6 md:p-8`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-mono text-sm font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-bold">{layer.layer}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-200/70">
                  {layer.description}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {layer.components.map((comp) => (
                    <div
                      key={comp.name}
                      className="rounded-xl bg-black/20 p-4 backdrop-blur-sm"
                    >
                      <h4 className="font-semibold text-white">
                        {comp.name}
                      </h4>
                      <p className="mt-1 text-xs text-slate-300/70">
                        {comp.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Models */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("stack.modelTitle")} <span className="text-electric-400">{t("stack.modelTitleHighlight")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          {t("stack.modelSubtitle")}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {models.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-slate-800 bg-navy-900/50 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{model.name}</h3>
                <span className="rounded-full border border-slate-700 px-3 py-0.5 text-xs text-slate-400">
                  {model.provider}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{model.strength}</p>
              <p className="mt-2 font-mono text-xs text-electric-400">
                Sizes: {model.sizes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Local */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          {t("stack.cloudVsLocal")} <span className="text-electric-400">{t("stack.cloudVsLocalHighlight")}</span>
        </h2>
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-navy-900/80">
                <th className="p-4 font-semibold text-slate-400">Factor</th>
                <th className="p-4 font-semibold text-red-400">Cloud AI</th>
                <th className="p-4 font-semibold text-electric-400">
                  TechFides Local
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Data Location", "Vendor's servers", "Your building"],
                ["Pricing Model", "Per-token / per-seat", "Flat monthly subscription"],
                ["Compliance", "Shared responsibility", "Full control"],
                ["Internet Required", "Always", "Never (for inference)"],
                ["Model Lock-In", "Vendor's model only", "Any open model"],
                ["Latency", "50-500ms (network)", "<50ms (local)"],
                ["Long-Term Cost", "Escalating", "Predictable & declining"],
                ["Data Ownership", "Licensed back to you", "100% yours"],
              ].map(([factor, cloud, local]) => (
                <tr key={factor} className="bg-slate-950/50">
                  <td className="p-4 font-medium">{factor}</td>
                  <td className="p-4 text-slate-400">{cloud}</td>
                  <td className="p-4 text-slate-200">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          {t("stack.ctaTitle")} <span className="text-electric-400">{t("stack.ctaTitleHighlight")}</span>
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          {t("stack.ctaSubtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="glow-blue rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
          >
            {t("stack.ctaPricing")}
          </Link>
          <Link
            href="/solutions"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            {t("stack.ctaSolutions")}
          </Link>
        </div>
      </section>
    </div>
  );
}
