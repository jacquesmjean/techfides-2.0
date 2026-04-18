/**
 * TechFides AI 360 Readiness Assessment — 60 Questions
 *
 * 6 Domains × 10 Questions each
 * Each question uses a 1–5 Likert scale with domain-specific anchors.
 * Scoring: selectedOption (1–5) × weight → domain score → overall score.
 */

export type AI360DomainKey =
  | "STRATEGY_LEADERSHIP"
  | "DATA_INFRASTRUCTURE"
  | "TECHNOLOGY_ARCHITECTURE"
  | "OPERATIONS_PROCESSES"
  | "GOVERNANCE_RISK"
  | "PEOPLE_CULTURE";

export interface AI360Option {
  value: number; // 1–5
  label: string;
}

export interface AI360Question {
  id: string;          // e.g. "SL-01"
  domain: AI360DomainKey;
  text: string;
  helpText?: string;
  weight: number;      // 1.0 = normal, 1.5 = high-impact, 0.75 = supporting
  options: AI360Option[];
  evidenceHint?: string; // what evidence would validate this
}

export interface AI360DomainDef {
  key: AI360DomainKey;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  color: string;      // tailwind color class
  maxScore: number;    // computed from question weights
}

// ─── Standard 5-point scale ───────────────────────────────────────
const SCALE_5 = (labels: [string, string, string, string, string]): AI360Option[] => [
  { value: 1, label: labels[0] },
  { value: 2, label: labels[1] },
  { value: 3, label: labels[2] },
  { value: 4, label: labels[3] },
  { value: 5, label: labels[4] },
];

const MATURITY_SCALE = SCALE_5([
  "No capability exists",
  "Ad-hoc / informal",
  "Defined but inconsistent",
  "Standardized and measured",
  "Optimized and continuously improving",
]);

const AGREEMENT_SCALE = SCALE_5([
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
]);

const ADOPTION_SCALE = SCALE_5([
  "Not started",
  "Piloting / exploring",
  "Partially adopted",
  "Widely adopted",
  "Fully embedded in operations",
]);

const READINESS_SCALE = SCALE_5([
  "Not ready",
  "Minimal readiness",
  "Moderate readiness",
  "Substantially ready",
  "Fully ready",
]);

// ─── Domain Definitions ───────────────────────────────────────────
export const AI360_DOMAINS: AI360DomainDef[] = [
  {
    key: "STRATEGY_LEADERSHIP",
    label: "Strategy & Leadership",
    shortLabel: "Strategy",
    description: "AI vision, executive alignment, investment clarity, and strategic roadmap",
    icon: "compass",
    color: "blue",
    maxScore: 0, // computed below
  },
  {
    key: "DATA_INFRASTRUCTURE",
    label: "Data & Infrastructure",
    shortLabel: "Data",
    description: "Data quality, accessibility, integration readiness, and infrastructure maturity",
    icon: "database",
    color: "emerald",
    maxScore: 0,
  },
  {
    key: "TECHNOLOGY_ARCHITECTURE",
    label: "Technology & Architecture",
    shortLabel: "Technology",
    description: "Platform capabilities, scalability, security posture, and modernization state",
    icon: "cpu",
    color: "violet",
    maxScore: 0,
  },
  {
    key: "OPERATIONS_PROCESSES",
    label: "Operations & Processes",
    shortLabel: "Operations",
    description: "Workflow automation, process maturity, bottleneck identification, and efficiency",
    icon: "settings",
    color: "amber",
    maxScore: 0,
  },
  {
    key: "GOVERNANCE_RISK",
    label: "Governance & Risk",
    shortLabel: "Governance",
    description: "AI policies, compliance readiness, ethical safeguards, and risk mitigation",
    icon: "shield",
    color: "red",
    maxScore: 0,
  },
  {
    key: "PEOPLE_CULTURE",
    label: "People & Culture",
    shortLabel: "People",
    description: "Skills assessment, adoption readiness, change management, and cultural alignment",
    icon: "users",
    color: "cyan",
    maxScore: 0,
  },
];

// ─── 60 Questions ─────────────────────────────────────────────────

export const AI360_QUESTIONS: AI360Question[] = [
  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 1: Strategy & Leadership (SL-01 to SL-10)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "SL-01",
    domain: "STRATEGY_LEADERSHIP",
    text: "Our organization has a clearly articulated AI strategy aligned with business objectives.",
    weight: 1.5,
    options: AGREEMENT_SCALE,
    evidenceHint: "AI strategy document, board presentations, strategic plan references",
  },
  {
    id: "SL-02",
    domain: "STRATEGY_LEADERSHIP",
    text: "Executive leadership actively sponsors and champions AI initiatives.",
    weight: 1.5,
    options: AGREEMENT_SCALE,
    evidenceHint: "Executive communications, steering committee minutes, org chart",
  },
  {
    id: "SL-03",
    domain: "STRATEGY_LEADERSHIP",
    text: "AI investment has a dedicated budget with clear ROI expectations.",
    weight: 1.25,
    options: MATURITY_SCALE,
    evidenceHint: "Budget allocations, business case documents, ROI frameworks",
  },
  {
    id: "SL-04",
    domain: "STRATEGY_LEADERSHIP",
    text: "There is a defined roadmap for AI adoption with measurable milestones.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Roadmap documents, project timelines, milestone tracking",
  },
  {
    id: "SL-05",
    domain: "STRATEGY_LEADERSHIP",
    text: "Cross-functional alignment exists between business units on AI priorities.",
    weight: 1.0,
    options: AGREEMENT_SCALE,
    evidenceHint: "Cross-functional meeting notes, shared priority matrices",
  },
  {
    id: "SL-06",
    domain: "STRATEGY_LEADERSHIP",
    text: "AI initiatives are evaluated against competitive landscape and industry benchmarks.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Competitive analysis, industry benchmarking reports",
  },
  {
    id: "SL-07",
    domain: "STRATEGY_LEADERSHIP",
    text: "Decision-making authority for AI projects is clearly defined and delegated.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "RACI matrix, governance charter, decision authority documentation",
  },
  {
    id: "SL-08",
    domain: "STRATEGY_LEADERSHIP",
    text: "There are established criteria for prioritizing AI use cases.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Use case scoring frameworks, prioritization matrices",
  },
  {
    id: "SL-09",
    domain: "STRATEGY_LEADERSHIP",
    text: "The organization tracks and reports on AI initiative outcomes regularly.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Dashboard screenshots, quarterly review presentations",
  },
  {
    id: "SL-10",
    domain: "STRATEGY_LEADERSHIP",
    text: "External partnerships or advisory relationships support our AI strategy.",
    weight: 0.75,
    options: ADOPTION_SCALE,
    evidenceHint: "Partner agreements, advisory board roster, consulting engagements",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 2: Data & Infrastructure (DI-01 to DI-10)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "DI-01",
    domain: "DATA_INFRASTRUCTURE",
    text: "Our data is well-organized, cataloged, and discoverable across the organization.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "Data catalog screenshots, data dictionary, metadata management tools",
  },
  {
    id: "DI-02",
    domain: "DATA_INFRASTRUCTURE",
    text: "Data quality is actively monitored with defined metrics and remediation processes.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "Data quality dashboards, quality rules, remediation workflows",
  },
  {
    id: "DI-03",
    domain: "DATA_INFRASTRUCTURE",
    text: "Key business data is accessible to authorized users without excessive manual effort.",
    weight: 1.25,
    options: MATURITY_SCALE,
    evidenceHint: "Self-service analytics tools, data access request logs",
  },
  {
    id: "DI-04",
    domain: "DATA_INFRASTRUCTURE",
    text: "Data integration pipelines connect major systems (ERP, CRM, HRIS) reliably.",
    weight: 1.25,
    options: MATURITY_SCALE,
    evidenceHint: "Integration architecture diagrams, ETL/ELT pipeline documentation",
  },
  {
    id: "DI-05",
    domain: "DATA_INFRASTRUCTURE",
    text: "We have sufficient compute and storage infrastructure to support AI workloads.",
    weight: 1.0,
    options: READINESS_SCALE,
    evidenceHint: "Infrastructure specs, cloud resource inventory, capacity plans",
  },
  {
    id: "DI-06",
    domain: "DATA_INFRASTRUCTURE",
    text: "Data sensitivity classification is in place and enforced.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Classification policies, data labeling standards, DLP tool configs",
  },
  {
    id: "DI-07",
    domain: "DATA_INFRASTRUCTURE",
    text: "Historical data is retained and accessible for training and analysis purposes.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Data retention policies, archive access procedures",
  },
  {
    id: "DI-08",
    domain: "DATA_INFRASTRUCTURE",
    text: "Real-time or near-real-time data streaming capabilities are available.",
    weight: 0.75,
    options: ADOPTION_SCALE,
    evidenceHint: "Streaming architecture, event bus configuration, Kafka/Kinesis setup",
  },
  {
    id: "DI-09",
    domain: "DATA_INFRASTRUCTURE",
    text: "Master data management practices ensure consistent reference data across systems.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "MDM tool screenshots, golden record policies, deduplication reports",
  },
  {
    id: "DI-10",
    domain: "DATA_INFRASTRUCTURE",
    text: "Data lineage is tracked from source to consumption for critical datasets.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Data lineage diagrams, lineage tool exports",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 3: Technology & Architecture (TA-01 to TA-10)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "TA-01",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Our technology stack supports modern AI/ML frameworks and deployment patterns.",
    weight: 1.5,
    options: READINESS_SCALE,
    evidenceHint: "Tech stack inventory, architecture diagrams, platform capabilities",
  },
  {
    id: "TA-02",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "APIs and microservices enable modular integration of AI capabilities.",
    weight: 1.25,
    options: MATURITY_SCALE,
    evidenceHint: "API gateway config, microservices architecture, OpenAPI specs",
  },
  {
    id: "TA-03",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Cloud infrastructure (or hybrid) is provisioned for scalable AI workloads.",
    weight: 1.25,
    options: READINESS_SCALE,
    evidenceHint: "Cloud architecture diagrams, auto-scaling configs, cost reports",
  },
  {
    id: "TA-04",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Security architecture includes AI-specific threat models and controls.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "Threat models, security architecture reviews, pen test reports",
  },
  {
    id: "TA-05",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "CI/CD pipelines support automated testing and deployment of AI models.",
    weight: 1.0,
    options: ADOPTION_SCALE,
    evidenceHint: "Pipeline configurations, MLOps tool stack, deployment runbooks",
  },
  {
    id: "TA-06",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Legacy systems have been assessed for AI integration feasibility.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Legacy assessment reports, modernization plans, integration gaps",
  },
  {
    id: "TA-07",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Model versioning, experiment tracking, and reproducibility are supported.",
    weight: 0.75,
    options: ADOPTION_SCALE,
    evidenceHint: "MLflow/Weights&Biases screenshots, model registry",
  },
  {
    id: "TA-08",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Monitoring and observability cover AI model performance in production.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Monitoring dashboards, alerting rules, model drift detection",
  },
  {
    id: "TA-09",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Disaster recovery and business continuity plans account for AI dependencies.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "DR plans, RTO/RPO documentation, failover procedures",
  },
  {
    id: "TA-10",
    domain: "TECHNOLOGY_ARCHITECTURE",
    text: "Network and data sovereignty requirements are addressed in the architecture.",
    weight: 1.0,
    options: READINESS_SCALE,
    evidenceHint: "Data residency policies, network topology, sovereignty controls",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 4: Operations & Processes (OP-01 to OP-10)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "OP-01",
    domain: "OPERATIONS_PROCESSES",
    text: "Core business processes are documented and standardized.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "Process documentation, SOPs, workflow diagrams",
  },
  {
    id: "OP-02",
    domain: "OPERATIONS_PROCESSES",
    text: "We have identified specific processes with high automation potential.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "Automation opportunity assessment, process mining outputs",
  },
  {
    id: "OP-03",
    domain: "OPERATIONS_PROCESSES",
    text: "Current workflow automation (RPA, scripting, low-code) is actively used.",
    weight: 1.0,
    options: ADOPTION_SCALE,
    evidenceHint: "Automation inventory, RPA bot list, integration platform usage",
  },
  {
    id: "OP-04",
    domain: "OPERATIONS_PROCESSES",
    text: "Process performance metrics (cycle time, error rate, throughput) are tracked.",
    weight: 1.25,
    options: MATURITY_SCALE,
    evidenceHint: "KPI dashboards, process performance reports, SLA tracking",
  },
  {
    id: "OP-05",
    domain: "OPERATIONS_PROCESSES",
    text: "Bottlenecks and inefficiencies in key workflows have been identified.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Process mining results, bottleneck analysis, value stream maps",
  },
  {
    id: "OP-06",
    domain: "OPERATIONS_PROCESSES",
    text: "Change management processes exist for deploying new operational tools.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Change management framework, ITIL documentation, CAB records",
  },
  {
    id: "OP-07",
    domain: "OPERATIONS_PROCESSES",
    text: "Exception handling and escalation paths are clearly defined.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Escalation matrices, exception handling procedures",
  },
  {
    id: "OP-08",
    domain: "OPERATIONS_PROCESSES",
    text: "Vendor and third-party processes are integrated into operational workflows.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Vendor integration docs, SLAs, third-party workflow mappings",
  },
  {
    id: "OP-09",
    domain: "OPERATIONS_PROCESSES",
    text: "Customer-facing processes have been evaluated for AI enhancement opportunities.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Customer journey maps, CX assessment, AI opportunity scoring",
  },
  {
    id: "OP-10",
    domain: "OPERATIONS_PROCESSES",
    text: "Post-implementation reviews capture lessons learned from operational changes.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Retrospective documents, lessons learned repositories",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 5: Governance & Risk (GR-01 to GR-10)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "GR-01",
    domain: "GOVERNANCE_RISK",
    text: "An AI governance framework (policies, oversight, accountability) is in place.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "AI governance policy, oversight committee charter, RACI",
  },
  {
    id: "GR-02",
    domain: "GOVERNANCE_RISK",
    text: "Regulatory compliance requirements for AI are identified and tracked.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "Compliance register, regulatory mapping, audit reports",
  },
  {
    id: "GR-03",
    domain: "GOVERNANCE_RISK",
    text: "Data privacy and protection controls meet relevant regulations (GDPR, CCPA, HIPAA).",
    weight: 1.25,
    options: READINESS_SCALE,
    evidenceHint: "Privacy impact assessments, DPO reports, consent management",
  },
  {
    id: "GR-04",
    domain: "GOVERNANCE_RISK",
    text: "Ethical AI guidelines (bias detection, fairness, transparency) are defined.",
    weight: 1.25,
    options: MATURITY_SCALE,
    evidenceHint: "Ethics policy, bias testing results, model cards",
  },
  {
    id: "GR-05",
    domain: "GOVERNANCE_RISK",
    text: "A risk assessment process exists specifically for AI initiatives.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "AI risk register, risk assessment templates, mitigation plans",
  },
  {
    id: "GR-06",
    domain: "GOVERNANCE_RISK",
    text: "Third-party AI vendor risks are evaluated and managed.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Vendor risk assessments, third-party audits, contract terms",
  },
  {
    id: "GR-07",
    domain: "GOVERNANCE_RISK",
    text: "Intellectual property considerations for AI-generated outputs are addressed.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "IP policies, legal opinions, licensing agreements",
  },
  {
    id: "GR-08",
    domain: "GOVERNANCE_RISK",
    text: "Incident response plans include AI-specific failure scenarios.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Incident response playbooks, AI failure scenarios, tabletop exercises",
  },
  {
    id: "GR-09",
    domain: "GOVERNANCE_RISK",
    text: "Audit trails are maintained for AI model decisions and data usage.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Audit log configurations, model decision logs, access records",
  },
  {
    id: "GR-10",
    domain: "GOVERNANCE_RISK",
    text: "Board-level or C-suite reporting on AI risk and governance is established.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Board reports, risk committee presentations, governance dashboards",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 6: People & Culture (PC-01 to PC-10)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "PC-01",
    domain: "PEOPLE_CULTURE",
    text: "A skills gap analysis has been conducted to identify AI-related training needs.",
    weight: 1.5,
    options: MATURITY_SCALE,
    evidenceHint: "Skills assessment results, gap analysis reports, training plans",
  },
  {
    id: "PC-02",
    domain: "PEOPLE_CULTURE",
    text: "AI literacy programs are available across the organization (not just IT).",
    weight: 1.25,
    options: ADOPTION_SCALE,
    evidenceHint: "Training catalog, enrollment data, completion rates",
  },
  {
    id: "PC-03",
    domain: "PEOPLE_CULTURE",
    text: "Leadership demonstrates genuine enthusiasm and commitment to AI adoption.",
    weight: 1.5,
    options: AGREEMENT_SCALE,
    evidenceHint: "Leadership communications, town hall recordings, internal memos",
  },
  {
    id: "PC-04",
    domain: "PEOPLE_CULTURE",
    text: "Teams are receptive to AI-driven changes in their workflows.",
    weight: 1.0,
    options: AGREEMENT_SCALE,
    evidenceHint: "Employee surveys, sentiment analysis, focus group findings",
  },
  {
    id: "PC-05",
    domain: "PEOPLE_CULTURE",
    text: "Dedicated AI or data science talent exists within the organization.",
    weight: 1.0,
    options: ADOPTION_SCALE,
    evidenceHint: "Org chart, team rosters, hiring plans, contractor engagements",
  },
  {
    id: "PC-06",
    domain: "PEOPLE_CULTURE",
    text: "Change management support is provided for AI transformation initiatives.",
    weight: 1.25,
    options: MATURITY_SCALE,
    evidenceHint: "Change management plans, communication strategies, sponsor maps",
  },
  {
    id: "PC-07",
    domain: "PEOPLE_CULTURE",
    text: "Cross-functional collaboration between business and technical teams is effective.",
    weight: 1.0,
    options: AGREEMENT_SCALE,
    evidenceHint: "Cross-functional project records, collaboration tool usage",
  },
  {
    id: "PC-08",
    domain: "PEOPLE_CULTURE",
    text: "Innovation is encouraged and rewarded within the organizational culture.",
    weight: 0.75,
    options: AGREEMENT_SCALE,
    evidenceHint: "Innovation programs, hackathon records, recognition programs",
  },
  {
    id: "PC-09",
    domain: "PEOPLE_CULTURE",
    text: "Concerns about AI (job displacement, ethical issues) are openly addressed.",
    weight: 1.0,
    options: MATURITY_SCALE,
    evidenceHint: "Communication archives, FAQ documents, townhall Q&A records",
  },
  {
    id: "PC-10",
    domain: "PEOPLE_CULTURE",
    text: "Recruitment and retention strategies account for AI-era skill requirements.",
    weight: 0.75,
    options: MATURITY_SCALE,
    evidenceHint: "Job descriptions, hiring criteria, retention program documentation",
  },
];

// ─── Compute domain max scores ────────────────────────────────────
for (const domain of AI360_DOMAINS) {
  const domainQuestions = AI360_QUESTIONS.filter((q) => q.domain === domain.key);
  domain.maxScore = domainQuestions.reduce((sum, q) => sum + q.weight * 5, 0);
}

// ─── Helper: get questions by domain ──────────────────────────────
export function getQuestionsByDomain(domain: AI360DomainKey): AI360Question[] {
  return AI360_QUESTIONS.filter((q) => q.domain === domain);
}

// ─── Helper: get domain definition ────────────────────────────────
export function getDomainDef(domain: AI360DomainKey): AI360DomainDef {
  return AI360_DOMAINS.find((d) => d.key === domain)!;
}
