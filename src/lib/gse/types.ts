// ============================================================
// TechFides Global Sales Engine (GSE) — Type Definitions
// ============================================================

export type PipelineStage =
  | "prospect"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed-won"
  | "closed-lost";

export type LeadSource =
  | "website"
  | "referral"
  | "linkedin"
  | "cold-outreach"
  | "partner"
  | "event"
  | "inbound-call";

export type ServiceType =
  | "sovereign-ai"
  | "ai-readiness-360"
  | "transformation-management"
  | "tedos";

export type Vertical =
  | "legal"
  | "medical"
  | "auto"
  | "trades"
  | "property-management"
  | "other";

export type Region = "us" | "mx" | "cemac";
export type Currency = "USD" | "MXN" | "XAF";

export type SalesStatus =
  | "not-contacted"
  | "contacted"
  | "prospect"
  | "appointment-scheduled"
  | "proposal-sent"
  | "accepted"
  | "client"
  | "lost";

export interface GeoLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
  zip: string;
  address: string;
}

export interface SalesGoal {
  id: string;
  label: string;
  level: "organization" | "team" | "individual";
  assignedTo: string;
  period: "yearly" | "quarterly" | "monthly";
  periodLabel: string;
  target: number;
  actual: number;
  deals: number;
  pipelineValue: number;
}

export interface ForecastPoint {
  label: string;
  projected: number;
  actual: number;
  target: number;
}

export type ActivityType =
  | "email-sent"
  | "email-received"
  | "call"
  | "meeting"
  | "note"
  | "stage-change"
  | "deal-room-created"
  | "document-sent"
  | "document-signed"
  | "payment-received"
  | "task-completed"
  | "auto-nurture";

export type NurtureStatus = "active" | "paused" | "completed" | "scheduled";
export type DealRoomStatus = "draft" | "sent" | "viewed" | "signed" | "paid" | "completed";

// ---- Core Entities ----

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  avatar?: string;
}

export interface Lead {
  id: string;
  contact: Contact;
  vertical: Vertical;
  service: ServiceType;
  stage: PipelineStage;
  source: LeadSource;
  region: Region;
  currency: Currency;

  // Deal financials
  dealValue: number;
  sowCost: number;
  monthlyRetainer: number;
  probability: number; // 0-100
  grossMargin: number; // calculated

  // Dates
  createdAt: string;
  lastActivity: string;
  expectedCloseDate: string;
  staleDays: number;

  // Metadata
  tags: string[];
  notes: string;
  assignedTo: string;
  referralPartner?: string;

  // Deal Room
  dealRoomId?: string;
  dealRoomStatus?: DealRoomStatus;

  // Nurture
  nurtureSequenceId?: string;
  nurtureStatus?: NurtureStatus;

  // Sentiment
  heatScore: number; // 0-100 (ML-scored lead heat)

  // GPS / Territory
  salesStatus: SalesStatus;
  location: GeoLocation;
}

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  automated: boolean;
  metadata?: Record<string, string>;
}

export interface NurtureSequence {
  id: string;
  name: string;
  leadId: string;
  status: NurtureStatus;
  steps: NurtureStep[];
  currentStep: number;
  startedAt: string;
  triggerReason: string;
}

export interface NurtureStep {
  id: string;
  order: number;
  type: "email" | "wait" | "task" | "condition";
  subject?: string;
  body?: string;
  waitDays?: number;
  completed: boolean;
  sentAt?: string;
}

export interface DealRoom {
  id: string;
  leadId: string;
  status: DealRoomStatus;
  createdAt: string;
  expiresAt: string;
  accessCode: string;
  documents: DealRoomDocument[];
  payments: DealRoomPayment[];
}

export interface DealRoomDocument {
  id: string;
  name: string;
  type: "sow" | "contract" | "technical" | "nda" | "invoice";
  status: "draft" | "sent" | "viewed" | "signed";
  url?: string;
  signedAt?: string;
}

export interface DealRoomPayment {
  id: string;
  amount: number;
  currency: Currency;
  method: "stripe" | "wire" | "ach" | "check";
  status: "pending" | "processing" | "completed" | "failed";
  paidAt?: string;
  invoiceNumber: string;
}

// ---- Dashboard Metrics ----

export interface PipelineMetrics {
  totalLeads: number;
  totalValue: number;
  weightedValue: number;
  avgDealSize: number;
  conversionRate: number;
  avgCycleTime: number; // days
  stageBreakdown: Record<PipelineStage, { count: number; value: number }>;
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  sowRevenue: number;
  totalClosed: number;
  closedThisMonth: number;
  targetThisMonth: number;
  pipelineCoverage: number; // ratio of pipeline to target
}

// ---- Filter/Sort ----

export interface PipelineFilters {
  stages: PipelineStage[];
  verticals: Vertical[];
  services: ServiceType[];
  sources: LeadSource[];
  minValue: number;
  maxValue: number;
  assignedTo: string;
  search: string;
}

// ---- Constants ----

export const STAGE_CONFIG: Record<
  PipelineStage,
  { label: string; color: string; bgColor: string; probability: number; icon: string }
> = {
  prospect: { label: "Prospect", color: "#94a3b8", bgColor: "#1e293b", probability: 10, icon: "🎯" },
  qualified: { label: "Qualified", color: "#38bdf8", bgColor: "#0c4a6e", probability: 25, icon: "✅" },
  proposal: { label: "Proposal", color: "#a78bfa", bgColor: "#4c1d95", probability: 50, icon: "📄" },
  negotiation: { label: "Negotiation", color: "#f59e0b", bgColor: "#78350f", probability: 75, icon: "🤝" },
  "closed-won": { label: "Closed Won", color: "#22c55e", bgColor: "#14532d", probability: 100, icon: "🏆" },
  "closed-lost": { label: "Closed Lost", color: "#ef4444", bgColor: "#7f1d1d", probability: 0, icon: "❌" },
};

export const SERVICE_CONFIG: Record<
  ServiceType,
  { label: string; icon: string; color: string; baseSOW: number; baseRetainer: number }
> = {
  "sovereign-ai": { label: "Sovereign AI", icon: "🖥️", color: "#0ea5e9", baseSOW: 10000, baseRetainer: 1000 },
  "ai-readiness-360": { label: "AI Readiness 360™", icon: "📊", color: "#a78bfa", baseSOW: 5000, baseRetainer: 500 },
  "transformation-management": { label: "Transformation Management", icon: "🔄", color: "#f59e0b", baseSOW: 15000, baseRetainer: 2500 },
  tedos: { label: "TEDOS™", icon: "⚙️", color: "#22c55e", baseSOW: 12000, baseRetainer: 1500 },
};

export const VERTICAL_CONFIG: Record<Vertical, { label: string; icon: string }> = {
  legal: { label: "Legal", icon: "⚖️" },
  medical: { label: "Medical", icon: "🏥" },
  auto: { label: "Auto", icon: "🚗" },
  trades: { label: "Trades", icon: "🔧" },
  "property-management": { label: "Property Mgmt", icon: "🏢" },
  other: { label: "Other", icon: "📋" },
};

export const SALES_STATUS_CONFIG: Record<
  SalesStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  "not-contacted": { label: "Not Contacted", color: "#64748b", bgColor: "#1e293b", icon: "⭘" },
  contacted: { label: "Contacted", color: "#38bdf8", bgColor: "#0c4a6e", icon: "📞" },
  prospect: { label: "Prospect", color: "#a78bfa", bgColor: "#4c1d95", icon: "🎯" },
  "appointment-scheduled": { label: "Appt Scheduled", color: "#f59e0b", bgColor: "#78350f", icon: "📅" },
  "proposal-sent": { label: "Proposal Sent", color: "#fb923c", bgColor: "#7c2d12", icon: "📄" },
  accepted: { label: "Accepted", color: "#22c55e", bgColor: "#14532d", icon: "✅" },
  client: { label: "Client", color: "#10b981", bgColor: "#064e3b", icon: "🏆" },
  lost: { label: "Lost", color: "#ef4444", bgColor: "#7f1d1d", icon: "❌" },
};

export const SOURCE_CONFIG: Record<LeadSource, { label: string; icon: string }> = {
  website: { label: "Website", icon: "🌐" },
  referral: { label: "Referral", icon: "🤝" },
  linkedin: { label: "LinkedIn", icon: "💼" },
  "cold-outreach": { label: "Cold Outreach", icon: "📧" },
  partner: { label: "Partner", icon: "🏢" },
  event: { label: "Event", icon: "🎤" },
  "inbound-call": { label: "Inbound Call", icon: "📞" },
};

// ---- Survey / Post-Closure Types ----

export type SurveyStatus = "pending" | "sent" | "started" | "completed" | "expired";

export interface SurveyResponse {
  id: string;
  leadId: string;
  status: SurveyStatus;
  sentAt: string;
  completedAt?: string;
  locale: "en" | "es" | "fr";

  // Performance & Velocity (1-10 scale)
  scores: {
    projectDelivery: number;
    technicalAccuracy: number;
    easeOfImplementation: number;
    communication: number;
    problemSolving: number;
    systemEasiness: number; // UI/UX feedback
  };

  // NPS (0-10)
  nps: number;
  npsCategory: "promoter" | "passive" | "detractor";

  // Experience Layer (qualitative)
  testimonial: string;
  improvementSuggestions: string;

  // Social Proof Consent
  consentTestimonial: boolean;
  consentLogo: boolean;
  consentSocial: boolean;
  consentVideo: boolean;
  consentCaseStudy: boolean;

  // Referral Trigger (NPS > 9)
  referralName?: string;
  referralEmail?: string;
  referralCompany?: string;

  // Incentive
  successCreditApplied: boolean;

  // Auto-generated outputs
  caseStudyDraft?: string;
  socialProofPublished: boolean;
  executiveAlertTriggered: boolean;
}
