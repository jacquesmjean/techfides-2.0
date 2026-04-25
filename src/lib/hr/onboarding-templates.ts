import type {
  EmployeeType,
  TaskCategory,
  TaskOwner,
  DocumentType,
} from "@prisma/client";

/**
 * Default onboarding task templates for new employees.
 *
 * Each template produces a set of tasks (and required documents) tailored to
 * the employee's type (FTE vs Contractor). The list is opinionated for
 * TechFides — adjust as the team grows.
 */

export interface TaskTemplate {
  order: number;
  title: string;
  description?: string;
  category: TaskCategory;
  owner: TaskOwner;
  required: boolean;
  /** Days from start date when this task is due. Negative = before start. */
  dueOffsetDays?: number;
}

export interface DocumentTemplate {
  type: DocumentType;
  name: string;
  required: boolean;
}

const COMMON_TASKS: TaskTemplate[] = [
  {
    order: 1,
    title: "Sign NDA",
    description: "Confidentiality agreement covering client and proprietary information.",
    category: "COMPLIANCE",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: -3,
  },
  {
    order: 2,
    title: "Sign IP Assignment Agreement",
    description: "Assigns rights to work product created during engagement.",
    category: "COMPLIANCE",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: 0,
  },
  {
    order: 10,
    title: "Read TechFides Operating Principles",
    description: "Mission, values, and how we work. Located in /Operations.",
    category: "ONBOARDING",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: 7,
  },
  {
    order: 11,
    title: "Set up GSE access",
    description: "Provision NextAuth user, assign role (CLOSER or VIEWER), enable MFA.",
    category: "TECH_SETUP",
    owner: "IT",
    required: true,
    dueOffsetDays: 0,
  },
  {
    order: 20,
    title: "Complete TechFides AI tools training",
    description: "Local AI deployment basics, AEGIS templates, deal-room workflow.",
    category: "TRAINING",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: 14,
  },
  {
    order: 30,
    title: "Schedule 30-day check-in",
    description: "First formal review with Jacques M. Jean.",
    category: "ONBOARDING",
    owner: "MANAGER",
    required: true,
    dueOffsetDays: 30,
  },
];

const FTE_TASKS: TaskTemplate[] = [
  {
    order: 3,
    title: "Sign Offer Letter",
    description: "Formal employment offer.",
    category: "HIRING",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: -7,
  },
  {
    order: 4,
    title: "Submit W-4",
    description: "Federal tax withholding form.",
    category: "COMPLIANCE",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: 0,
  },
  {
    order: 5,
    title: "Complete I-9",
    description: "Employment eligibility verification.",
    category: "COMPLIANCE",
    owner: "HR",
    required: true,
    dueOffsetDays: 3,
  },
  {
    order: 6,
    title: "Direct deposit setup",
    description: "Submit bank info for payroll.",
    category: "COMPENSATION",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: 5,
  },
];

const CONTRACTOR_TASKS: TaskTemplate[] = [
  {
    order: 3,
    title: "Sign Independent Contractor Agreement",
    description: "Defines scope, payment terms, and independence.",
    category: "HIRING",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: -7,
  },
  {
    order: 4,
    title: "Submit W-9",
    description: "Required for 1099 reporting.",
    category: "COMPLIANCE",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: 0,
  },
  {
    order: 6,
    title: "Set up invoice routing",
    description: "Confirm invoice schedule, payment method, and routing email.",
    category: "COMPENSATION",
    owner: "EMPLOYEE",
    required: true,
    dueOffsetDays: 5,
  },
];

const COMMON_DOCS: DocumentTemplate[] = [
  { type: "NDA", name: "Non-Disclosure Agreement", required: true },
  { type: "IP_ASSIGNMENT", name: "IP Assignment Agreement", required: true },
];

const FTE_DOCS: DocumentTemplate[] = [
  { type: "OFFER_LETTER", name: "Offer Letter", required: true },
  { type: "W4", name: "W-4 Tax Form", required: true },
  { type: "I9", name: "I-9 Eligibility Verification", required: true },
  { type: "DIRECT_DEPOSIT", name: "Direct Deposit Authorization", required: true },
];

const CONTRACTOR_DOCS: DocumentTemplate[] = [
  { type: "IC_AGREEMENT", name: "Independent Contractor Agreement", required: true },
  { type: "W9", name: "W-9 Tax Form", required: true },
];

/**
 * Get the default task list for an employee, sorted by `order`.
 */
export function getDefaultTasks(type: EmployeeType): TaskTemplate[] {
  const base = type === "FTE" ? FTE_TASKS : CONTRACTOR_TASKS;
  return [...COMMON_TASKS, ...base].sort((a, b) => a.order - b.order);
}

/**
 * Get the default document list for an employee.
 */
export function getDefaultDocuments(type: EmployeeType): DocumentTemplate[] {
  const base = type === "FTE" ? FTE_DOCS : CONTRACTOR_DOCS;
  return [...COMMON_DOCS, ...base];
}

/**
 * Compute the absolute due date for a task given the employee start date.
 */
export function computeDueDate(
  startDate: Date | null,
  offsetDays?: number
): Date | null {
  if (!startDate || offsetDays === undefined) return null;
  const d = new Date(startDate);
  d.setDate(d.getDate() + offsetDays);
  return d;
}
