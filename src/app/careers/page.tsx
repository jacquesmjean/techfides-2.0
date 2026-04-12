"use client";

import { useState } from "react";
import Link from "next/link";

type JobType = "full-time" | "internship";
type Department = "engineering" | "ai-research" | "consulting" | "operations";

interface JobListing {
  id: string;
  title: string;
  department: Department;
  type: JobType;
  location: string;
  remote: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  salary?: string;
}

const DEPARTMENT_LABELS: Record<Department, { label: string; icon: string; color: string }> = {
  engineering: { label: "Engineering", icon: "\uD83D\uDCBB", color: "#38bdf8" },
  "ai-research": { label: "AI Research", icon: "\uD83E\uDDE0", color: "#a78bfa" },
  consulting: { label: "Consulting", icon: "\uD83D\uDCC8", color: "#22c55e" },
  operations: { label: "Operations", icon: "\u2699\uFE0F", color: "#f59e0b" },
};

const TYPE_BADGES: Record<JobType, { label: string; color: string; bg: string }> = {
  "full-time": { label: "Full-Time", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  internship: { label: "Internship", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
};

const JOBS: JobListing[] = [
  {
    id: "ai-engineer-sr",
    title: "Senior AI/ML Engineer",
    department: "engineering",
    type: "full-time",
    location: "Frisco, TX",
    remote: true,
    salary: "$140K \u2013 $185K",
    description:
      "Design, deploy, and optimize self-hosted LLM inference pipelines on client hardware. You will work directly with vLLM, Llama 3, Mistral, and Phi models to deliver sovereign AI solutions for enterprise clients across legal, medical, auto, and trades verticals.",
    responsibilities: [
      "Deploy and optimize local LLM inference via vLLM on GPU infrastructure (A100/H100)",
      "Build RAG pipelines with vector databases (Qdrant, Milvus) for client-specific knowledge retrieval",
      "Fine-tune open-source models (LoRA/QLoRA) on domain-specific datasets",
      "Architect multi-model serving strategies for concurrent workloads",
      "Collaborate with consulting team to translate client requirements into AI solutions",
      "Contribute to the TEDOS OS governance platform",
    ],
    requirements: [
      "5+ years in ML engineering or AI infrastructure",
      "Production experience with LLM serving (vLLM, TGI, or Triton)",
      "Strong Python + PyTorch/JAX skills",
      "Experience with quantization (AWQ, GPTQ, FP8) and model optimization",
      "Familiarity with PostgreSQL, Redis, and container orchestration",
      "Understanding of data privacy regulations (HIPAA, SOC 2, GDPR)",
    ],
    niceToHave: [
      "Experience with Next.js/TypeScript for full-stack contributions",
      "Prior work in legal tech, health tech, or vertical SaaS",
      "Contributions to open-source AI projects",
      "GPU cluster management experience",
    ],
  },
  {
    id: "ai-engineer-mid",
    title: "AI Engineer",
    department: "engineering",
    type: "full-time",
    location: "Frisco, TX or Guadalajara, MX",
    remote: true,
    salary: "$100K \u2013 $140K",
    description:
      "Build and maintain AI-powered features for the TechFides Local Stack. Work across the full stack from LLM integration to Next.js frontend components, helping SMBs deploy sovereign AI on their own hardware.",
    responsibilities: [
      "Develop API endpoints for the Velocity Engine (lead enrichment, outreach generation)",
      "Integrate local LLM responses into client-facing applications",
      "Build and test BullMQ background workers for automated workflows",
      "Implement branded email template rendering and delivery via Microsoft Graph",
      "Write Prisma migrations and maintain database schema",
      "Participate in code reviews and technical documentation",
    ],
    requirements: [
      "3+ years in software engineering with AI/ML integration experience",
      "Proficiency in TypeScript and Next.js (App Router)",
      "Experience with REST API design and Zod validation",
      "Familiarity with PostgreSQL and Prisma ORM",
      "Understanding of prompt engineering and LLM capabilities",
      "Strong problem-solving and communication skills",
    ],
    niceToHave: [
      "Experience with BullMQ or similar job queue systems",
      "Knowledge of email deliverability and Microsoft Graph API",
      "Experience with Tailwind CSS and React component design",
      "Spanish or French language skills",
    ],
  },
  {
    id: "ai-research-intern",
    title: "AI Research Intern",
    department: "ai-research",
    type: "internship",
    location: "Frisco, TX",
    remote: true,
    salary: "$25 \u2013 $35/hr",
    description:
      "Join the TechFides AI team for a 12-week immersion in applied AI research. You will work on real client problems including model evaluation, fine-tuning experiments, and RAG pipeline optimization. This is hands-on engineering, not paper writing.",
    responsibilities: [
      "Benchmark open-source LLMs (Llama, Mistral, Phi) on domain-specific tasks",
      "Experiment with fine-tuning techniques (LoRA, QLoRA) on client datasets",
      "Build evaluation frameworks for model accuracy, latency, and cost",
      "Contribute to the enrichment pipeline for the Velocity Engine",
      "Document findings and present to the engineering team weekly",
      "Shadow client deployments to understand real-world AI infrastructure",
    ],
    requirements: [
      "Currently pursuing BS/MS/PhD in Computer Science, AI/ML, or related field",
      "Hands-on experience with Python and PyTorch",
      "Understanding of transformer architecture and attention mechanisms",
      "Familiarity with HuggingFace ecosystem",
      "Strong analytical and communication skills",
      "Available for 12 weeks (flexible start date)",
    ],
    niceToHave: [
      "Experience with vLLM or other inference serving frameworks",
      "Published research or notable class projects in NLP/LLMs",
      "Familiarity with TypeScript or web development",
      "Interest in data privacy and on-premise AI deployment",
    ],
  },
  {
    id: "fullstack-intern",
    title: "Full-Stack Engineering Intern",
    department: "engineering",
    type: "internship",
    location: "Frisco, TX or Guadalajara, MX",
    remote: true,
    salary: "$22 \u2013 $30/hr",
    description:
      "Build real features for the TechFides platform during a 12-week internship. You will work on Next.js pages, API routes, and database integrations that ship to production. Great for students who want to see their code in a real enterprise product.",
    responsibilities: [
      "Build and enhance GSE dashboard pages (React + Tailwind CSS)",
      "Create API routes with Zod validation and Prisma queries",
      "Implement UI components for the outreach and nurture systems",
      "Write database migrations and seed scripts",
      "Fix bugs, improve accessibility, and write tests",
      "Participate in daily standups and sprint planning",
    ],
    requirements: [
      "Currently pursuing BS/MS in Computer Science or related field",
      "Proficiency in React and TypeScript",
      "Basic understanding of REST APIs and databases",
      "Familiarity with Git and collaborative development workflows",
      "Eagerness to learn and ship production code",
      "Available for 12 weeks (flexible start date)",
    ],
    niceToHave: [
      "Experience with Next.js App Router",
      "Familiarity with Tailwind CSS",
      "Knowledge of PostgreSQL or any relational database",
      "Portfolio or GitHub with personal projects",
    ],
  },
  {
    id: "ai-consultant",
    title: "AI Transformation Consultant",
    department: "consulting",
    type: "full-time",
    location: "Frisco, TX",
    remote: false,
    salary: "$120K \u2013 $160K",
    description:
      "Lead AI readiness assessments and transformation engagements for mid-market and enterprise clients. You will be the strategic bridge between TechFides technology and client business outcomes, running AI 360 Assessments and TEDOS implementations.",
    responsibilities: [
      "Conduct AI Readiness 360 assessments for prospective clients",
      "Design transformation roadmaps aligned with client business goals",
      "Lead TEDOS OS governance implementations",
      "Present findings and recommendations to C-suite executives",
      "Develop industry-specific playbooks for legal, medical, auto, and trades verticals",
      "Collaborate with engineering on solution architecture and deployment planning",
    ],
    requirements: [
      "5+ years in management consulting, IT strategy, or digital transformation",
      "Strong understanding of AI/ML capabilities and limitations",
      "Experience with enterprise IT governance frameworks (ITIL, COBIT, or similar)",
      "Excellent presentation and executive communication skills",
      "Ability to travel to client sites (25-40%)",
      "Understanding of compliance frameworks (HIPAA, SOC 2, GDPR)",
    ],
    niceToHave: [
      "Prior experience at Big 4, Accenture, or boutique consulting firm",
      "PMP, Six Sigma, or TOGAF certification",
      "Industry expertise in healthcare, legal, or automotive",
      "Spanish or French language skills (for LATAM/Africa operations)",
    ],
  },
];

export default function CareersPage() {
  const [filter, setFilter] = useState<"all" | JobType>("all");
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [applying, setApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = filter === "all" ? JOBS : JOBS.filter((j) => j.type === filter);

  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="glow-text text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Build the Future of{" "}
            <span className="text-electric-400">Sovereign AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Join TechFides and help businesses own their AI infrastructure.
            We&apos;re hiring engineers, researchers, and consultants who believe
            data sovereignty is a right, not a feature.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-green" />
              {JOBS.filter((j) => j.type === "full-time").length} Full-Time Roles
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-electric-400" />
              {JOBS.filter((j) => j.type === "internship").length} Internships
            </span>
          </div>
        </div>
      </section>

      {/* Why TechFides */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: "\uD83C\uDFE2", title: "3 Offices", desc: "Frisco TX, Guadalajara MX, Libreville GA" },
            { icon: "\uD83C\uDF0D", title: "Remote-First", desc: "Work from anywhere with async-first culture" },
            { icon: "\uD83D\uDE80", title: "Ship Real AI", desc: "Deploy models on real hardware for real clients" },
            { icon: "\uD83D\uDCB0", title: "Competitive Pay", desc: "Market-rate salary + equity for full-time roles" },
          ].map((perk) => (
            <div
              key={perk.title}
              className="rounded-xl border border-slate-800 bg-navy-900/50 p-5 text-center"
            >
              <span className="text-2xl">{perk.icon}</span>
              <h3 className="mt-2 text-sm font-bold text-slate-200">{perk.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-400">Filter:</span>
          {(["all", "full-time", "internship"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-electric-500 text-white"
                  : "border border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              {f === "all" ? "All Positions" : f === "full-time" ? "Full-Time" : "Internships"}
            </button>
          ))}
        </div>
      </section>

      {/* Job Listings */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-4">
          {filtered.map((job) => {
            const dept = DEPARTMENT_LABELS[job.department];
            const typeBadge = TYPE_BADGES[job.type];
            const isExpanded = selectedJob?.id === job.id;

            return (
              <div
                key={job.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? "border-electric-500/40 bg-electric-500/5"
                    : "border-slate-800 bg-navy-900/50 hover:border-slate-700"
                }`}
              >
                {/* Job Header */}
                <button
                  onClick={() => setSelectedJob(isExpanded ? null : job)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg">{dept.icon}</span>
                      <h3 className="text-lg font-bold text-slate-100">
                        {job.title}
                      </h3>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                        style={{ color: typeBadge.color, backgroundColor: typeBadge.bg }}
                      >
                        {typeBadge.label}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span style={{ color: dept.color }}>{dept.label}</span>
                      <span>{job.location}</span>
                      {job.remote && (
                        <span className="rounded bg-accent-green/10 px-1.5 py-0.5 text-[10px] text-accent-green">
                          Remote OK
                        </span>
                      )}
                      {job.salary && <span className="font-medium text-slate-300">{job.salary}</span>}
                    </div>
                  </div>
                  <span className="text-slate-500 text-xl">
                    {isExpanded ? "\u2212" : "+"}
                  </span>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800 px-6 pb-6 pt-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-electric-400">
                          Responsibilities
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {job.responsibilities.map((r) => (
                            <li key={r} className="flex gap-2 text-xs text-slate-400">
                              <span className="mt-0.5 text-accent-green">&#10003;</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-electric-400">
                          Requirements
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {job.requirements.map((r) => (
                            <li key={r} className="flex gap-2 text-xs text-slate-400">
                              <span className="mt-0.5 text-slate-500">&#8226;</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-electric-400">
                          Nice to Have
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {job.niceToHave.map((r) => (
                            <li key={r} className="flex gap-2 text-xs text-slate-400">
                              <span className="mt-0.5 text-slate-500">&#9734;</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setApplying(true);
                        }}
                        className="glow-blue rounded-lg bg-electric-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-electric-400"
                      >
                        Apply Now
                      </button>
                      <a
                        href={`mailto:careers@techfides.com?subject=Application: ${job.title}`}
                        className="rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
                      >
                        Email Resume
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          Don&apos;t See Your Role?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          We&apos;re always looking for exceptional people. Send us your resume
          and tell us how you&apos;d contribute to sovereign AI.
        </p>
        <a
          href="mailto:careers@techfides.com?subject=General Application"
          className="glow-blue mt-8 inline-block rounded-xl bg-electric-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-electric-600"
        >
          Send General Application
        </a>
      </section>

      {/* Application Modal */}
      {applying && !submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <button
              onClick={() => setApplying(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              &#x2715;
            </button>
            <h3 className="text-xl font-bold text-electric-400">
              Apply: {selectedJob?.title}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {selectedJob?.department && DEPARTMENT_LABELS[selectedJob.department].label} &middot; {selectedJob?.location}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // In production, POST to API
                setSubmitted(true);
              }}
              className="mt-6 space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="app-name" className="block text-sm font-medium text-slate-300">
                    Full Name *
                  </label>
                  <input
                    id="app-name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-electric-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="app-email" className="block text-sm font-medium text-slate-300">
                    Email *
                  </label>
                  <input
                    id="app-email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="app-phone" className="block text-sm font-medium text-slate-300">
                  Phone
                </label>
                <input
                  id="app-phone"
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="app-linkedin" className="block text-sm font-medium text-slate-300">
                  LinkedIn Profile
                </label>
                <input
                  id="app-linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="app-why" className="block text-sm font-medium text-slate-300">
                  Why TechFides? *
                </label>
                <textarea
                  id="app-why"
                  required
                  rows={3}
                  placeholder="Tell us what excites you about sovereign AI and this role..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-electric-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-500">
                Also email your resume to{" "}
                <a href="mailto:careers@techfides.com" className="text-electric-400">
                  careers@techfides.com
                </a>
              </p>
              <button
                type="submit"
                className="glow-blue w-full rounded-lg bg-electric-500 py-3 text-sm font-semibold text-white transition-all hover:bg-electric-400"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-accent-green/30 bg-slate-900 p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10 text-3xl">
              &#10003;
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-100">
              Application Received
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              We&apos;ll review your application and get back to you within 5 business days.
              Check your email for a confirmation.
            </p>
            <button
              onClick={() => {
                setApplying(false);
                setSubmitted(false);
              }}
              className="mt-6 rounded-lg bg-electric-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-electric-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
