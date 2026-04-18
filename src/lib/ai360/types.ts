/**
 * TechFides AI 360 — Shared types for the assessment platform
 */

export type AI360StatusType = "DRAFT" | "SUBMITTED" | "ANALYZING" | "PUBLISHED";
export type AI360RoleType = "CLIENT_ADMIN" | "CONTRIBUTOR" | "ANALYST" | "REVIEWER";

export interface AI360AssessmentSummary {
  id: string;
  name: string;
  orgName: string;
  orgIndustry: string;
  status: AI360StatusType;
  overallScore: number | null;
  maturityLevel: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  completionRate: number;
  memberCount: number;
  responseCount: number;
  documentCount: number;
}

export interface AI360MemberInfo {
  id: string;
  email: string;
  name: string;
  role: AI360RoleType;
  invitedAt: string;
  acceptedAt: string | null;
}

export interface AI360DocumentInfo {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: string;
  description: string | null;
  uploaderName: string | null;
  createdAt: string;
}

export interface AI360EvidenceInfo {
  id: string;
  questionId: string | null;
  domain: string;
  title: string;
  description: string;
  sourceType: string;
  sourceUrl: string | null;
  verified: boolean;
  verifiedBy: string | null;
  createdAt: string;
}

// Tab definitions for navigation
export const AI360_TABS = [
  { key: "assessment", label: "Assessment", href: "" },
  { key: "evidence", label: "Systems Evidence", href: "/evidence" },
  { key: "uploads", label: "Uploads", href: "/uploads" },
  { key: "analyze", label: "Analyze", href: "/analyze" },
  { key: "variance", label: "Variance", href: "/variance" },
  { key: "results", label: "Review & Results", href: "/results" },
  { key: "activity", label: "Activity", href: "/activity" },
  { key: "admin", label: "Admin", href: "/admin" },
] as const;

export type AI360TabKey = (typeof AI360_TABS)[number]["key"];

// Status display config
export const AI360_STATUS_CONFIG: Record<AI360StatusType, { label: string; color: string; bgColor: string }> = {
  DRAFT: { label: "Draft", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  SUBMITTED: { label: "Submitted", color: "text-brand-primary", bgColor: "bg-blue-50 border-blue-200" },
  ANALYZING: { label: "Analyzing", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
  PUBLISHED: { label: "Published", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" },
};
