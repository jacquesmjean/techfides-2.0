import type { ServiceType } from "@prisma/client";

/**
 * TechFides Service Catalog
 *
 * Single source of truth for what we sell, how it's priced, and what we ship.
 * SOW generation, deal rooms, pricing pages, and onboarding all read from here.
 *
 * Edit this file to adjust scope, price, or deliverables for any service.
 * Every change should be reviewed — this file IS the contract.
 */

export interface Milestone {
  /** Week number from kickoff (e.g., 2 = end of week 2) */
  week: number;
  title: string;
  deliverables: string[];
}

export interface ServiceDefinition {
  /** Prisma enum value */
  id: ServiceType;
  /** Display name for SOWs and pricing pages */
  name: string;
  /** One-line description */
  tagline: string;
  /** Longer description for SOW preamble */
  description: string;
  /** Default SOW price in USD (one-time) */
  baseSOW: number;
  /** Default monthly retainer in USD (recurring after SOW completes) */
  baseRetainer: number;
  /** Estimated engagement length in weeks (sets project timeline) */
  durationWeeks: number;
  /** Deposit required at signing, as decimal (0.5 = 50%) */
  depositPercent: number;
  /** Payment terms for the balance (Net 15, Net 30, etc.) */
  paymentTerms: string;
  /** What the client gets — used in SOW and deal room */
  deliverables: string[];
  /** Week-by-week breakdown for SOW timeline */
  milestones: Milestone[];
  /** Out-of-scope clarifications, used in SOW exclusions section */
  outOfScope: string[];
  /** Folder subpath inside Templates/ where this service's docs live */
  templateFolder: string;
  /**
   * One-paragraph description of what the monthly retainer buys after the
   * SOW concludes. Surfaced in SOW Section 6 so the client knows what they
   * are paying for ongoing. If omitted, the SOW falls back to a generic line.
   */
  retainerScope?: string;
  /**
   * Optional industry-specific clauses to append after standard SOW sections.
   * Use this for verticals that need extra contractual language (HIPAA,
   * attorney-client privilege, hardware ownership specifics, etc.).
   * Each entry becomes its own numbered section in the generated SOW.
   */
  complianceAddendum?: Array<{ title: string; body: string }>;
}

const AI_READINESS_360: ServiceDefinition = {
  id: "AI_READINESS_360",
  name: "AI Readiness 360",
  tagline: "A 21-day diagnostic that tells you exactly where your business stands on AI — and the next three moves that will actually move the needle.",
  description:
    "AI Readiness 360 is a structured assessment of your organization's AI readiness across five domains: Strategy & Vision, Data & Infrastructure, Tools & Operations, Talent & Skills, and Risk & Governance. We benchmark you against your industry, surface the gaps that matter, and hand you a 90-day roadmap with the three highest-ROI moves to make first.",
  baseSOW: 5000,
  baseRetainer: 500,
  durationWeeks: 3,
  depositPercent: 0.5,
  paymentTerms: "Balance due Net 15 from final report delivery",
  deliverables: [
    "Executive readiness scorecard across 5 domains (Strategy, Data, Tools, Talent, Risk)",
    "Industry benchmark report comparing your scores to peer firms",
    "Gap assessment with prioritized findings",
    "90-day roadmap with three highest-ROI moves and exact next steps",
    "Executive summary deck for board / leadership presentation",
    "1-hour readout call with your leadership team",
  ],
  milestones: [
    {
      week: 1,
      title: "Discovery + stakeholder interviews",
      deliverables: ["Kickoff call", "Stakeholder interviews (5–8 leaders)", "Tech stack inventory", "Document review"],
    },
    {
      week: 2,
      title: "Analysis + scoring",
      deliverables: ["Domain scoring across 5 areas", "Industry benchmarking", "Gap identification"],
    },
    {
      week: 3,
      title: "Roadmap + delivery",
      deliverables: ["Final scorecard", "90-day roadmap", "Executive readout call", "Hand-off package"],
    },
  ],
  outOfScope: [
    "Implementation of the recommendations (separate engagement)",
    "Software development or AI tool deployment",
    "Vendor selection or procurement support",
    "Ongoing managed services beyond the readout call",
  ],
  templateFolder: "AI Readiness 360",
  retainerScope:
    "The monthly retainer covers a 30-minute monthly check-in with a TechFides advisor, quarterly re-scoring against the original scorecard, and email support for roadmap-related questions. It does not include implementation work or net-new assessments.",
};

const TRANSFORMATION_MANAGEMENT: ServiceDefinition = {
  id: "TRANSFORMATION_MANAGEMENT",
  name: "AI Transformation Management",
  tagline: "Embedded transformation leadership for the 90 days that decide whether your AI initiative ships or stalls.",
  description:
    "AI Transformation Management is a 12-week embedded engagement where TechFides serves as the operational backbone of your AI initiative. We don't just advise — we run the program. Three pillars: Governance & Operating Model, Velocity & Delivery, and Change & Adoption. You ship the initiative, your team gets the playbook, and the next initiative runs faster.",
  baseSOW: 15000,
  baseRetainer: 2500,
  durationWeeks: 12,
  depositPercent: 0.4,
  paymentTerms: "Three milestone payments: 40% at signing, 30% at week 6, 30% at week 12",
  deliverables: [
    "Embedded transformation lead (8–10 hrs/week) for 12 weeks",
    "Governance operating model (RACI, decision rights, AI council charter)",
    "Velocity playbook (intake → triage → build → measure cadence)",
    "Change management plan with stakeholder map and comms cadence",
    "Weekly executive standup + monthly board update",
    "Final 90-day report with measurable outcomes and next-quarter plan",
    "All AEGIS templates included as part of the engagement",
  ],
  milestones: [
    {
      week: 2,
      title: "Operating model in place",
      deliverables: ["AI council formed and chartered", "RACI signed by execs", "Intake process documented"],
    },
    {
      week: 4,
      title: "First initiative shipped",
      deliverables: ["First AI use case live in production", "Adoption metrics baselined", "Velocity cadence in flight"],
    },
    {
      week: 8,
      title: "Mid-engagement review",
      deliverables: ["Mid-engagement scorecard", "Roadmap revision", "Change management touchpoint"],
    },
    {
      week: 12,
      title: "Hand-off + sustainability",
      deliverables: ["Final 90-day report", "Internal team trained on cadence", "Q+1 plan", "Board readout"],
    },
  ],
  outOfScope: [
    "Direct software development or model training",
    "Hiring or firing decisions",
    "Vendor contract negotiation (we advise, you sign)",
    "Custom integration work beyond the included use case",
  ],
  templateFolder: "Transformation Management",
  retainerScope:
    "The monthly retainer covers continued embedded leadership at a reduced cadence (4 hours per week), monthly executive readouts, AEGIS template upkeep, and on-call advisory for AI council escalations. It does not cover net-new initiative scoping, which is contracted separately.",
};

const AEGIS: ServiceDefinition = {
  id: "AEGIS",
  name: "AEGIS",
  tagline: "The complete AI governance template pack and 6-week implementation engagement, calibrated to your industry.",
  description:
    "AEGIS is TechFides' codified AI governance system. You get the full template library — 22 documents covering policy, risk, deployment, signal, brief, and cadence — plus a 6-week guided implementation where we calibrate every template to your specific industry, regulatory environment, and risk profile. Walk away with a complete AI operating system you actually use.",
  baseSOW: 12000,
  baseRetainer: 1500,
  durationWeeks: 6,
  depositPercent: 0.5,
  paymentTerms: "Two milestone payments: 50% at signing, 50% at week 6 hand-off",
  deliverables: [
    "Full AEGIS template library (22 templates: AI Risk Register, Acceptable Use Policy, AI Incident Runbook, Vendor Risk Assessment, RACI for AI Decisions, etc.)",
    "Industry-specific calibration (Legal / Medical / Auto / Trades / Property Mgmt or custom)",
    "Implementation workshop (4 sessions × 2 hours each)",
    "AI risk register populated with your top 10 risks",
    "Acceptable Use Policy ratified by your leadership",
    "AI Council charter and first quarterly review meeting facilitated",
    "Six-week deployment plan with checkpoints",
  ],
  milestones: [
    {
      week: 1,
      title: "Templates delivered + calibration kickoff",
      deliverables: ["Full AEGIS template library handed over", "Discovery session", "Industry calibration plan"],
    },
    {
      week: 3,
      title: "Policy core in place",
      deliverables: ["Acceptable Use Policy ratified", "AI Risk Register populated", "Data Classification Map signed off"],
    },
    {
      week: 5,
      title: "Operating cadence live",
      deliverables: ["AI Council formed", "First Quarterly Governance Review run", "Incident Runbook tested"],
    },
    {
      week: 6,
      title: "Hand-off + sustainability",
      deliverables: ["Implementation plan complete", "All templates calibrated and ratified", "Hand-off training session", "60-day check-in scheduled"],
    },
  ],
  outOfScope: [
    "Ongoing managed governance (covered separately by retainer)",
    "Tool implementation or AI software deployment",
    "Litigation or regulatory legal advice",
    "Custom template creation beyond the included 22",
  ],
  templateFolder: "AEGIS",
  retainerScope:
    "The monthly retainer covers managed governance: quarterly AI risk register refresh, AI council meeting facilitation, template version maintenance against regulatory changes, and incident-response advisory. It does not include legal advice or litigation support.",
};

const SOVEREIGN_AI: ServiceDefinition = {
  id: "SOVEREIGN_AI",
  name: "Private AI",
  tagline: "Local AI deployment on hardware you own. No cloud lock-in, no recurring API bills, no data leaving the building.",
  description:
    "Private AI is a complete on-premise AI deployment. We install LLM and supporting infrastructure on hardware you own (server, workstation, or edge device), configured for your specific workflows. Your data stays in your building. Your AI runs whether or not the cloud is up. You own it.",
  baseSOW: 10000,
  baseRetainer: 1000,
  durationWeeks: 4,
  depositPercent: 0.5,
  paymentTerms: "Balance due Net 15 from go-live",
  deliverables: [
    "Hardware specification and procurement support",
    "On-premise LLM deployment (Llama, Mistral, or equivalent)",
    "Custom workflow configuration for your business",
    "User training (up to 5 staff)",
    "30-day go-live support",
    "Maintenance handbook and monitoring setup",
  ],
  milestones: [
    { week: 1, title: "Discovery + hardware spec", deliverables: ["Use case workshop", "Hardware sizing", "Procurement plan"] },
    { week: 2, title: "Install + configure", deliverables: ["Hardware delivered and racked", "LLM installed", "Workflows configured"] },
    { week: 3, title: "Training + UAT", deliverables: ["User training sessions", "Acceptance testing", "Documentation"] },
    { week: 4, title: "Go-live + handoff", deliverables: ["Production cutover", "30-day support window opens", "Monitoring active"] },
  ],
  outOfScope: [
    "Hardware costs (passed through at cost)",
    "Custom model fine-tuning beyond included workflows",
    "Integration with cloud SaaS beyond the included scope",
  ],
  templateFolder: "Private AI",
  retainerScope:
    "The monthly retainer covers remote system monitoring, monthly model and security updates, quarterly performance review, and unlimited break-fix support during business hours. Hardware replacement parts are passed through at cost.",
  complianceAddendum: [
    {
      title: "Hardware Title and Ownership",
      body:
        "All hardware procured for Client under this SOW is purchased at cost on Client's behalf. Title to and ownership of all such hardware passes to Client upon Client's full payment of the hardware portion of the engagement fees. Hardware is delivered to Client's premises and remains Client's property after engagement close. TechFides claims no security interest, lien, or right of repossession in Client-owned hardware.",
    },
    {
      title: "Data Residency and Non-Egress",
      body:
        "All Client data processed by the Private AI deployment shall remain on Client-owned hardware located at Client's premises. TechFides shall not transmit, copy, store, or otherwise transfer Client data to any cloud service, third-party service, or location outside Client's premises without Client's prior written consent. Telemetry transmitted to TechFides for monitoring or maintenance purposes shall be limited to system health metrics and shall not include Client business data, prompts, model outputs, or personally identifiable information.",
    },
    {
      title: "Post-Engagement Ownership of Software and Models",
      body:
        "Upon completion of the engagement and full payment of all fees, Client retains a perpetual, irrevocable, royalty-free right to continue using all installed software, configurations, fine-tuned models, prompt libraries, and workflows deployed under this SOW on Client-owned hardware, regardless of whether Client elects to continue the monthly retainer. Termination of the retainer ends TechFides's support obligations but does not terminate Client's ownership or right of use.",
    },
  ],
};

export const SERVICE_CATALOG: Record<ServiceType, ServiceDefinition> = {
  AI_READINESS_360,
  TRANSFORMATION_MANAGEMENT,
  AEGIS,
  SOVEREIGN_AI,
};

export function getService(id: ServiceType): ServiceDefinition {
  return SERVICE_CATALOG[id];
}

/** Useful for the deposit invoice number that gets created at sign time. */
export function computeDepositAmount(service: ServiceDefinition, sowPrice?: number): number {
  const total = sowPrice ?? service.baseSOW;
  return Math.round(total * service.depositPercent);
}
