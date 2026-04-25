/**
 * Folder structure templates for client and employee scaffolding.
 *
 * Numbered prefixes (01-, 02-, ...) keep the order stable in Finder.
 */

export const CLIENT_SUBFOLDERS = [
  "01-Discovery",   // intake notes, signed NDAs, kickoff materials
  "02-Agreement",   // SOW, MSA, signed contracts
  "03-Deployment",  // hardware specs, AI configs, install runbooks
  "04-Training",    // client-facing training docs and recordings
  "05-Support",     // tickets, change requests, ongoing notes
] as const;

export const EMPLOYEE_SUBFOLDERS = [
  "01-Hiring",        // offer letter, IC contract or employment agreement
  "02-Onboarding",    // onboarding checklist, training docs
  "03-Compliance",    // NDA, W9/W4, IP assignment, background check
  "04-Performance",   // reviews, 1:1 notes, KPI tracking
  "05-Compensation",  // pay records, commission tracking
] as const;

export interface ClientReadmeMeta {
  companyName: string;
  contactName: string;
  email: string;
  tier: string;
  service: string;
  retainerAmount: number;
  retainerStart?: Date | null;
  status: string;
  scaffoldedAt: Date;
}

export interface EmployeeReadmeMeta {
  name: string;
  email: string;
  role: string;
  type: string; // "FTE" | "Contractor"
  startDate?: Date | null;
  status: string;
  scaffoldedAt: Date;
}

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "TBD";
  return d.toISOString().split("T")[0];
}

function fmtCurrency(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function renderClientReadme(meta: ClientReadmeMeta): string {
  return `# ${meta.companyName}

**Tier:** ${meta.tier}
**Service:** ${meta.service}
**Status:** ${meta.status}
**Primary contact:** ${meta.contactName} <${meta.email}>
**Monthly retainer:** ${fmtCurrency(meta.retainerAmount)}
**Retainer start:** ${fmtDate(meta.retainerStart)}

---

## Folder structure

- \`01-Discovery/\` — intake notes, signed NDAs, kickoff materials
- \`02-Agreement/\` — SOW, MSA, signed contracts
- \`03-Deployment/\` — hardware specs, AI configs, install runbooks
- \`04-Training/\` — client training docs and recordings
- \`05-Support/\` — tickets, change requests, ongoing notes

---

*Folder scaffolded ${fmtDate(meta.scaffoldedAt)} by TechFides Ops integration.*
*This README is regenerated on every scaffold call — edit anything inside the subfolders, but don't edit this file directly.*
`;
}

export function renderEmployeeReadme(meta: EmployeeReadmeMeta): string {
  return `# ${meta.name}

**Role:** ${meta.role}
**Type:** ${meta.type}
**Status:** ${meta.status}
**Email:** ${meta.email}
**Start date:** ${fmtDate(meta.startDate)}

---

## Folder structure

- \`01-Hiring/\` — offer letter, IC contract or employment agreement
- \`02-Onboarding/\` — onboarding checklist, training docs
- \`03-Compliance/\` — NDA, W9/W4, IP assignment, background check
- \`04-Performance/\` — reviews, 1:1 notes, KPI tracking
- \`05-Compensation/\` — pay records, commission tracking

---

*Folder scaffolded ${fmtDate(meta.scaffoldedAt)} by TechFides Ops integration.*
`;
}
