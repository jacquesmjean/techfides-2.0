import fs from "node:fs/promises";
import path from "node:path";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

import type { ServiceDefinition } from "@/lib/services/catalog";
import { computeDepositAmount } from "@/lib/services/catalog";
import { getOpsRoot } from "@/lib/filesystem/config";
import { safeFolderName, assertWithin } from "@/lib/filesystem/safety";

/**
 * SOW Generator
 *
 * Produces a professional .docx Statement of Work for any service in the
 * catalog, populated with client and engagement specifics.
 *
 * Output: <opsRoot>/Clients/<Company>/02-Agreement/SOW — <Service>.docx
 *
 * The same generator is called from:
 *   - POST /api/v1/leads/[id]/create-deal-room (generates SOW for new deal)
 *   - POST /api/v1/leads/[id]/regenerate-sow (re-runs after price/scope edits)
 *
 * The output is intentionally clean and copy-editable in Word — your team
 * may want to redline before sending. The structure is fixed; the content
 * is generated.
 */

export interface SowInput {
  /** Client identification */
  companyName: string;
  contactName: string;
  contactTitle?: string;
  contactEmail: string;
  contactAddress?: string;

  /** The service being engaged */
  service: ServiceDefinition;

  /** Override default pricing if negotiated */
  sowPrice?: number;
  monthlyRetainer?: number;

  /** Engagement dates (YYYY-MM-DD or Date) */
  startDate?: Date;

  /** Optional custom scope additions / exclusions */
  customDeliverables?: string[];
  customExclusions?: string[];

  /** Reference number; if omitted, derived from date + service */
  sowNumber?: string;
}

export interface SowResult {
  filename: string;
  filePath: string;
  sowNumber: string;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  buffer: Buffer;
}

const fmtUSD = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function computeEndDate(start: Date, weeks: number): Date {
  const d = new Date(start);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function defaultSowNumber(service: ServiceDefinition, date: Date): string {
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const code = service.id.split("_")[0].slice(0, 4);
  return `TF-${code}-${yyyymmdd}`;
}

// Helpers for compact paragraph styling
const heading = (text: string, level: typeof HeadingLevel.HEADING_1 | typeof HeadingLevel.HEADING_2 | typeof HeadingLevel.HEADING_3) =>
  new Paragraph({ text, heading: level, spacing: { before: 280, after: 120 } });

const body = (text: string, opts: { bold?: boolean; italic?: boolean; size?: number; alignment?: typeof AlignmentType.LEFT | typeof AlignmentType.CENTER | typeof AlignmentType.RIGHT } = {}) =>
  new Paragraph({
    spacing: { after: 120 },
    alignment: opts.alignment,
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italic,
        size: opts.size ?? 22,
      }),
    ],
  });

const bullet = (text: string) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22 })],
  });

function buildPaymentScheduleTable(input: SowInput): Table {
  const total = input.sowPrice ?? input.service.baseSOW;
  const deposit = computeDepositAmount(input.service, total);
  const balance = total - deposit;

  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          children: [body("Milestone", { bold: true })],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [body("Trigger", { bold: true })],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [body("Amount", { bold: true })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [body("Deposit")] }),
        new TableCell({ children: [body("Upon SOW signing")] }),
        new TableCell({ children: [body(fmtUSD(deposit))] }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [body("Balance")] }),
        new TableCell({ children: [body(input.service.paymentTerms)] }),
        new TableCell({ children: [body(fmtUSD(balance))] }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [body("TOTAL", { bold: true })] }),
        new TableCell({ children: [body("")] }),
        new TableCell({ children: [body(fmtUSD(total), { bold: true })] }),
      ],
    }),
  ];

  if (input.monthlyRetainer ?? input.service.baseRetainer) {
    const monthly = input.monthlyRetainer ?? input.service.baseRetainer;
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [body("Ongoing retainer (post-engagement)")] }),
          new TableCell({ children: [body("Monthly, starting after final delivery")] }),
          new TableCell({ children: [body(`${fmtUSD(monthly)}/month`)] }),
        ],
      })
    );
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" },
    },
  });
}

function buildMilestoneTable(input: SowInput): Table {
  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          children: [body("Week", { bold: true })],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [body("Phase", { bold: true })],
        }),
        new TableCell({
          width: { size: 58, type: WidthType.PERCENTAGE },
          children: [body("Deliverables", { bold: true })],
        }),
      ],
    }),
    ...input.service.milestones.map(
      (m) =>
        new TableRow({
          children: [
            new TableCell({ children: [body(`Week ${m.week}`)] }),
            new TableCell({ children: [body(m.title)] }),
            new TableCell({
              children: m.deliverables.map((d) => bullet(d)),
            }),
          ],
        })
    ),
  ];

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" },
    },
  });
}

/**
 * Build the variable list of addendum sections for industry-specific
 * clauses (hardware ownership, data residency, HIPAA, etc.) defined per
 * service in the catalog. Numbered starting at 13 since the standard
 * sections take 1–12.
 */
function buildComplianceAddendumSections(
  addenda?: Array<{ title: string; body: string }>
): Paragraph[] {
  if (!addenda || addenda.length === 0) return [];
  const sections: Paragraph[] = [];
  addenda.forEach((a, idx) => {
    sections.push(
      heading(`${13 + idx}. ${a.title}`, HeadingLevel.HEADING_2),
      body(a.body)
    );
  });
  return sections;
}

/**
 * Build the SOW document tree.
 */
function buildSowDocument(input: SowInput): Document {
  const total = input.sowPrice ?? input.service.baseSOW;
  const deposit = computeDepositAmount(input.service, total);
  const balance = total - deposit;
  const start = input.startDate ?? new Date();
  const end = computeEndDate(start, input.service.durationWeeks);
  const sowNumber = input.sowNumber ?? defaultSowNumber(input.service, new Date());

  const deliverables = input.customDeliverables
    ? [...input.service.deliverables, ...input.customDeliverables]
    : input.service.deliverables;

  const exclusions = input.customExclusions
    ? [...input.service.outOfScope, ...input.customExclusions]
    : input.service.outOfScope;

  const sections = [
    body("STATEMENT OF WORK", { bold: true, size: 32, alignment: AlignmentType.CENTER }),
    body(input.service.name, { size: 26, alignment: AlignmentType.CENTER }),
    body(`SOW Number: ${sowNumber}`, { italic: true, alignment: AlignmentType.CENTER }),
    body(`Effective Date: ${fmtDate(new Date())}`, { italic: true, alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [new TextRun({ text: " " })], spacing: { after: 200 } }),

    heading("1. Parties", HeadingLevel.HEADING_2),
    body(`This Statement of Work ("SOW") is entered into between TechFides LLC ("TechFides," "we," "our") and ${input.companyName} ("Client," "you").`),

    heading("Client", HeadingLevel.HEADING_3),
    body(`${input.companyName}`),
    body(`Attn: ${input.contactName}${input.contactTitle ? `, ${input.contactTitle}` : ""}`),
    body(input.contactEmail),
    ...(input.contactAddress ? [body(input.contactAddress)] : []),

    heading("TechFides", HeadingLevel.HEADING_3),
    body("TechFides LLC"),
    body("Frisco, Texas"),
    body("contact@techfides.com"),

    heading("2. Engagement Overview", HeadingLevel.HEADING_2),
    body(input.service.description),

    heading("3. Scope of Work", HeadingLevel.HEADING_2),
    body("TechFides will deliver the following:"),
    ...deliverables.map((d) => bullet(d)),

    heading("4. Timeline & Milestones", HeadingLevel.HEADING_2),
    body(`Engagement duration: ${input.service.durationWeeks} weeks. Planned start: ${fmtDate(start)}. Planned completion: ${fmtDate(end)}.`),
    new Paragraph({ children: [new TextRun({ text: " " })] }),
    buildMilestoneTable(input),

    heading("5. Out of Scope", HeadingLevel.HEADING_2),
    body("The following are explicitly out of scope for this SOW:"),
    ...exclusions.map((e) => bullet(e)),

    heading("6. Fees & Payment Schedule", HeadingLevel.HEADING_2),
    body(
      `Total fee: ${fmtUSD(total)}. Deposit ${fmtUSD(deposit)} due upon signing. Balance ${fmtUSD(balance)} per the schedule below.`
    ),
    new Paragraph({ children: [new TextRun({ text: " " })] }),
    buildPaymentScheduleTable(input),
    ...(input.service.retainerScope
      ? [
          body(`Monthly retainer scope: ${input.service.retainerScope}`, { italic: true }),
        ]
      : []),
    body(
      "For self-serve engagements signed through the TechFides onboarding portal, the deposit is collected via secure online checkout immediately upon SOW signature. For invoiced engagements, the deposit invoice is issued upon receipt of the signed SOW and is payable within five (5) business days."
    ),

    heading("7. Confidentiality", HeadingLevel.HEADING_2),
    body(
      "The parties' confidentiality obligations are governed by the Mutual Non-Disclosure Agreement executed at engagement initiation, which is incorporated by reference. In the event of any conflict between this SOW and the NDA on matters of confidentiality, the NDA controls."
    ),

    heading("8. Intellectual Property", HeadingLevel.HEADING_2),
    body(
      "Client owns all deliverables produced specifically for Client under this SOW upon full payment. TechFides retains ownership of its underlying methodology, frameworks, templates, and pre-existing IP. Client receives a perpetual, non-transferable, royalty-free license to use TechFides templates internally for Client's own business purposes."
    ),

    heading("9. Warranty & Limitation of Liability", HeadingLevel.HEADING_2),
    body(
      "TechFides warrants that services will be performed in a professional manner consistent with industry standards. TechFides' aggregate liability under this SOW is limited to the total fees paid by Client under this SOW. Neither party is liable for indirect, consequential, special, incidental, or punitive damages, even if advised of the possibility of such damages."
    ),

    heading("10. Term & Termination", HeadingLevel.HEADING_2),
    body(
      "This SOW is effective on the Effective Date and continues until the deliverables are accepted in writing or the parties agree in writing to terminate. Either party may terminate for material breach with fifteen (15) days' written notice and an opportunity to cure. Upon termination, Client pays for work completed through the termination date. Where the engagement involves Client-owned hardware or installed software, Client retains ownership of all such hardware, installed configurations, and trained models, regardless of the cause of termination."
    ),

    heading("11. Acceptance Criteria", HeadingLevel.HEADING_2),
    body(
      "Each deliverable is deemed accepted upon the earlier of (a) Client's written acceptance, or (b) ten (10) business days after delivery if Client has not provided written objection identifying specific failures to meet the deliverable's stated criteria. If Client provides timely written objection, TechFides will use commercially reasonable efforts to remedy the identified failures within ten (10) business days. Acceptance of a deliverable does not waive Client's rights under any applicable warranty in Section 9."
    ),

    heading("12. Change Orders", HeadingLevel.HEADING_2),
    body(
      "Any change in scope, deliverables, timeline, or fees requires a written change order signed by both parties. The change order shall reference this SOW, describe the change, identify any impact on price or schedule, and shall be deemed an amendment to this SOW upon execution. Work outside the scope of this SOW or any executed change order is not authorized and not billable."
    ),

    ...buildComplianceAddendumSections(input.service.complianceAddendum),

    heading("Acceptance", HeadingLevel.HEADING_2),
    body(
      "By signing below, both parties agree to the terms above and to any addenda incorporated herein."
    ),

    new Paragraph({ children: [new TextRun({ text: " " })], spacing: { before: 400 } }),
    body("__________________________________________", { size: 22 }),
    body("Jacques M. Jean, CEO", { bold: true }),
    body("TechFides LLC"),
    body(`Date: ${fmtDate(new Date())}`),

    new Paragraph({ children: [new TextRun({ text: " " })], spacing: { before: 400 } }),
    body("__________________________________________", { size: 22 }),
    body(`${input.contactName}${input.contactTitle ? `, ${input.contactTitle}` : ""}`, { bold: true }),
    body(input.companyName),
    body("Date: __________________________"),
  ];

  return new Document({
    creator: "TechFides",
    title: `${input.service.name} SOW — ${input.companyName}`,
    description: `Statement of Work for ${input.companyName}`,
    styles: {
      default: {
        document: {
          run: { font: "Calibri" },
        },
      },
    },
    sections: [{ children: sections }],
  });
}

/**
 * Generate the SOW .docx and save it under the client's 02-Agreement folder.
 *
 * Returns a buffer too — useful for streaming as a download or attaching
 * to an email without re-reading from disk.
 */
export async function generateSowForClient(input: SowInput): Promise<SowResult> {
  const doc = buildSowDocument(input);
  const buffer = await Packer.toBuffer(doc);

  const opsRoot = getOpsRoot();
  const safeName = safeFolderName(input.companyName);
  const clientDir = path.join(opsRoot, "Clients", safeName);
  const agreementDir = path.join(clientDir, "02-Agreement");
  assertWithin(opsRoot, agreementDir);

  // Make sure the parent path exists; the scaffolder usually has run already
  // but generating an SOW before scaffolding shouldn't fail silently.
  await fs.mkdir(agreementDir, { recursive: true });

  const sowNumber = input.sowNumber ?? defaultSowNumber(input.service, new Date());
  const filename = `SOW — ${input.service.name} (${sowNumber}).docx`;
  const filePath = path.join(agreementDir, filename);
  await fs.writeFile(filePath, buffer);

  const total = input.sowPrice ?? input.service.baseSOW;
  const deposit = computeDepositAmount(input.service, total);

  return {
    filename,
    filePath,
    sowNumber,
    totalAmount: total,
    depositAmount: deposit,
    balanceAmount: total - deposit,
    buffer,
  };
}
