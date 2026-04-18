/**
 * TechFides AI 360 Readiness Assessment — PDF Report Generator
 *
 * Generates branded executive reports using PDFKit.
 * Outputs: Executive Summary, Domain Breakdown, Risk & Exposure Report.
 */

import PDFDocument from "pdfkit";
import { OverallScore, DomainScore, RiskItem, OpportunityItem, MATURITY_LABELS } from "./scoring";
import { AI360_QUESTIONS, AI360_DOMAINS } from "./questions";

// ─── Brand Constants ──────────────────────────────────────────────
const BRAND = {
  primary: "#00AEEF",
  dark: "#003F6B",
  light: "#F5F7FA",
  black: "#000000",
  white: "#FFFFFF",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  gray: "#6B7280",
  grayLight: "#E5E7EB",
};

interface ReportData {
  assessmentName: string;
  orgName: string;
  orgIndustry: string;
  scores: OverallScore;
  responses: Record<string, { selectedOption: number; notes: string }>;
  executiveSummary?: string;
  narrativeSummary?: string;
  publishedAt?: string;
  createdAt: string;
}

// ─── Main PDF Generator ───────────────────────────────────────────

export function generateExecutiveReport(data: ReportData): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 60, bottom: 60, left: 50, right: 50 },
    info: {
      Title: `AI 360 Readiness Assessment - ${data.orgName}`,
      Author: "TechFides",
      Subject: "AI Readiness Assessment Report",
      Creator: "TechFides AI 360 Platform",
    },
  });

  // ── Cover Page ──────────────────────────────────────────────
  renderCoverPage(doc, data);

  // ── Executive Summary ───────────────────────────────────────
  doc.addPage();
  renderExecutiveSummary(doc, data);

  // ── Domain Breakdown ────────────────────────────────────────
  doc.addPage();
  renderDomainBreakdown(doc, data);

  // ── Heat Map ────────────────────────────────────────────────
  doc.addPage();
  renderHeatMap(doc, data);

  // ── Risk & Exposure ─────────────────────────────────────────
  doc.addPage();
  renderRiskProfile(doc, data);

  // ── Opportunity Map ─────────────────────────────────────────
  doc.addPage();
  renderOpportunities(doc, data);

  // ── Appendix: Full Responses ────────────────────────────────
  doc.addPage();
  renderResponseAppendix(doc, data);

  // ── Back Page ───────────────────────────────────────────────
  doc.addPage();
  renderBackPage(doc);

  doc.end();
  return doc;
}

// ─── Cover Page ───────────────────────────────────────────────────

function renderCoverPage(doc: PDFKit.PDFDocument, data: ReportData) {
  const w = doc.page.width;
  const h = doc.page.height;

  // Blue header bar
  doc.rect(0, 0, w, 180).fill(BRAND.dark);

  // TechFides branding
  doc.fontSize(12).fillColor(BRAND.primary).text("TECHFIDES", 50, 40);
  doc.fontSize(9).fillColor(BRAND.white).text("Enterprise AI. Local Infrastructure. Total Sovereignty.", 50, 56);

  // Title
  doc.fontSize(28).fillColor(BRAND.white).text("AI 360 Readiness", 50, 90, { width: w - 100 });
  doc.fontSize(28).fillColor(BRAND.primary).text("Assessment Report", 50, 122, { width: w - 100 });

  // Organization info
  doc.fontSize(18).fillColor(BRAND.dark).text(data.orgName, 50, 220);
  doc.fontSize(11).fillColor(BRAND.gray).text(data.assessmentName, 50, 245);
  doc.fontSize(10).fillColor(BRAND.gray).text(`Industry: ${data.orgIndustry}`, 50, 265);

  // Score circle area
  const scoreY = 340;
  const scoreColor = data.scores.score >= 80 ? BRAND.green : data.scores.score >= 60 ? BRAND.primary : data.scores.score >= 40 ? BRAND.amber : BRAND.red;

  doc.circle(130, scoreY + 50, 60).lineWidth(6).strokeColor(scoreColor).stroke();
  doc.fontSize(36).fillColor(scoreColor).text(`${data.scores.score}`, 95, scoreY + 28, { width: 70, align: "center" });
  doc.fontSize(9).fillColor(BRAND.gray).text("/ 100", 110, scoreY + 68, { width: 40, align: "center" });
  doc.fontSize(12).fillColor(BRAND.dark).text(MATURITY_LABELS[data.scores.maturity], 50, scoreY + 130, { width: 160, align: "center" });

  // Quick stats
  const statsX = 260;
  doc.fontSize(10).fillColor(BRAND.gray).text("QUICK STATS", statsX, scoreY);
  const stats = [
    { label: "Overall Score", value: `${data.scores.score}%` },
    { label: "Maturity Level", value: MATURITY_LABELS[data.scores.maturity] },
    { label: "Completion Rate", value: `${data.scores.completionRate}%` },
    { label: "Domains Assessed", value: "6" },
    { label: "Questions Answered", value: `${Object.keys(data.responses).length} / 60` },
    { label: "High/Critical Risks", value: `${data.scores.riskProfile.filter((r) => r.severity === "critical" || r.severity === "high").length}` },
    { label: "Opportunities", value: `${data.scores.opportunities.length}` },
  ];

  stats.forEach((s, i) => {
    const y = scoreY + 20 + i * 22;
    doc.fontSize(9).fillColor(BRAND.gray).text(s.label, statsX, y);
    doc.fontSize(10).fillColor(BRAND.dark).text(s.value, statsX + 160, y, { width: 80, align: "right" });
    if (i < stats.length - 1) {
      doc.moveTo(statsX, y + 16).lineTo(statsX + 240, y + 16).strokeColor(BRAND.grayLight).lineWidth(0.5).stroke();
    }
  });

  // Date
  const dateStr = data.publishedAt ? new Date(data.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.fontSize(9).fillColor(BRAND.gray).text(`Published: ${dateStr}`, 50, h - 100);

  // Confidentiality
  doc.fontSize(8).fillColor(BRAND.gray).text("CONFIDENTIAL — Prepared exclusively for " + data.orgName, 50, h - 80);
  doc.fontSize(7).fillColor(BRAND.grayLight).text("This document contains proprietary assessment results. Do not distribute without authorization.", 50, h - 68);

  renderFooter(doc, "");
}

// ─── Executive Summary ────────────────────────────────────────────

function renderExecutiveSummary(doc: PDFKit.PDFDocument, data: ReportData) {
  renderHeader(doc, "Executive Summary");

  let y = 110;

  // 60-Second Snapshot
  doc.fontSize(13).fillColor(BRAND.dark).text("60-Second Snapshot", 50, y);
  y += 25;

  const summary = data.executiveSummary || generateAutoSummary(data);
  doc.fontSize(10).fillColor(BRAND.black).text(summary, 50, y, { width: 495, lineGap: 4 });
  y = doc.y + 25;

  // Narrative
  if (data.narrativeSummary) {
    doc.fontSize(13).fillColor(BRAND.dark).text("Detailed Narrative", 50, y);
    y += 25;
    doc.fontSize(10).fillColor(BRAND.black).text(data.narrativeSummary, 50, y, { width: 495, lineGap: 4 });
    y = doc.y + 25;
  }

  // Domain scores summary table
  doc.fontSize(13).fillColor(BRAND.dark).text("Domain Scores", 50, y);
  y += 25;

  // Table header
  doc.fontSize(8).fillColor(BRAND.gray);
  doc.text("DOMAIN", 50, y);
  doc.text("SCORE", 320, y, { width: 60, align: "center" });
  doc.text("MATURITY", 390, y, { width: 80, align: "center" });
  doc.text("STATUS", 480, y, { width: 60, align: "center" });
  y += 15;
  doc.moveTo(50, y).lineTo(545, y).strokeColor(BRAND.grayLight).lineWidth(0.5).stroke();
  y += 8;

  for (const ds of data.scores.domains) {
    const color = ds.color === "green" ? BRAND.green : ds.color === "yellow" ? BRAND.amber : BRAND.red;

    doc.fontSize(9).fillColor(BRAND.dark).text(ds.label, 50, y);
    doc.fontSize(10).fillColor(color).text(`${ds.percentage}%`, 320, y, { width: 60, align: "center" });
    doc.fontSize(8).fillColor(BRAND.gray).text(MATURITY_LABELS[ds.maturity], 390, y, { width: 80, align: "center" });

    // Status dot
    doc.circle(510, y + 5, 4).fill(color);

    y += 22;
  }

  renderFooter(doc, "Executive Summary");
}

// ─── Domain Breakdown ─────────────────────────────────────────────

function renderDomainBreakdown(doc: PDFKit.PDFDocument, data: ReportData) {
  renderHeader(doc, "Domain Breakdown");

  let y = 110;

  for (const ds of data.scores.domains) {
    if (y > 700) {
      doc.addPage();
      renderHeader(doc, "Domain Breakdown (continued)");
      y = 110;
    }

    const domainDef = AI360_DOMAINS.find((d) => d.key === ds.domain)!;
    const color = ds.color === "green" ? BRAND.green : ds.color === "yellow" ? BRAND.amber : BRAND.red;

    // Domain header
    doc.rect(50, y, 495, 28).fill(BRAND.light);
    doc.fontSize(11).fillColor(BRAND.dark).text(ds.label, 60, y + 7);
    doc.fontSize(11).fillColor(color).text(`${ds.percentage}%`, 480, y + 7, { width: 60, align: "right" });
    y += 35;

    // Progress bar
    doc.rect(50, y, 495, 6).fill(BRAND.grayLight);
    doc.rect(50, y, Math.max(2, (ds.percentage / 100) * 495), 6).fill(color);
    y += 14;

    // Description
    doc.fontSize(8).fillColor(BRAND.gray).text(domainDef.description, 50, y, { width: 495 });
    y += 18;

    // Strengths & gaps
    if (ds.strengths.length > 0) {
      doc.fontSize(8).fillColor(BRAND.green).text(`Strengths (${ds.strengths.length}): ${ds.strengths.join(", ")}`, 50, y, { width: 495 });
      y += 14;
    }
    if (ds.gaps.length > 0) {
      doc.fontSize(8).fillColor(BRAND.red).text(`Gaps (${ds.gaps.length}): ${ds.gaps.join(", ")}`, 50, y, { width: 495 });
      y += 14;
    }

    y += 12;
  }

  renderFooter(doc, "Domain Breakdown");
}

// ─── Heat Map Page ────────────────────────────────────────────────

function renderHeatMap(doc: PDFKit.PDFDocument, data: ReportData) {
  renderHeader(doc, "Enterprise Heat Map");

  let y = 120;
  doc.fontSize(10).fillColor(BRAND.gray).text(
    "Visual maturity assessment across all six domains. Green indicates readiness, yellow indicates emerging capability, and red indicates critical gaps requiring attention.",
    50, y, { width: 495, lineGap: 3 }
  );
  y += 50;

  const cellW = 240;
  const cellH = 80;
  const gap = 15;

  data.scores.domains.forEach((ds, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 50 + col * (cellW + gap);
    const cy = y + row * (cellH + gap);

    const bgColor = ds.color === "green" ? "#D1FAE5" : ds.color === "yellow" ? "#FEF3C7" : "#FEE2E2";
    const fgColor = ds.color === "green" ? BRAND.green : ds.color === "yellow" ? BRAND.amber : BRAND.red;

    doc.roundedRect(x, cy, cellW, cellH, 6).fill(bgColor);

    doc.fontSize(11).fillColor(BRAND.dark).text(ds.label, x + 12, cy + 12, { width: cellW - 24 });
    doc.fontSize(24).fillColor(fgColor).text(`${ds.percentage}%`, x + 12, cy + 32, { width: cellW - 24 });
    doc.fontSize(8).fillColor(BRAND.gray).text(MATURITY_LABELS[ds.maturity], x + 12, cy + 60, { width: cellW - 24 });

    // Progress bar
    doc.rect(x + 120, cy + 40, 108, 5).fill("#ffffff80");
    doc.rect(x + 120, cy + 40, Math.max(2, (ds.percentage / 100) * 108), 5).fill(fgColor);
  });

  // Legend
  const legendY = y + 3 * (cellH + gap) + 20;
  doc.fontSize(9).fillColor(BRAND.gray).text("Legend:", 50, legendY);
  [
    { color: "#D1FAE5", label: "Ready (60%+)" },
    { color: "#FEF3C7", label: "Emerging (40-59%)" },
    { color: "#FEE2E2", label: "Critical (<40%)" },
  ].forEach((item, i) => {
    const lx = 100 + i * 140;
    doc.rect(lx, legendY, 10, 10).fill(item.color);
    doc.fontSize(8).fillColor(BRAND.gray).text(item.label, lx + 14, legendY + 1);
  });

  renderFooter(doc, "Enterprise Heat Map");
}

// ─── Risk Profile ─────────────────────────────────────────────────

function renderRiskProfile(doc: PDFKit.PDFDocument, data: ReportData) {
  renderHeader(doc, "Risk & Exposure Report");

  let y = 110;

  if (data.scores.riskProfile.length === 0) {
    doc.fontSize(11).fillColor(BRAND.green).text("No significant risks identified.", 50, y);
    renderFooter(doc, "Risk & Exposure Report");
    return;
  }

  doc.fontSize(10).fillColor(BRAND.gray).text(
    "Risks are identified from gap analysis across all domains and ranked by severity.",
    50, y, { width: 495, lineGap: 3 }
  );
  y += 30;

  for (const risk of data.scores.riskProfile) {
    if (y > 720) {
      doc.addPage();
      renderHeader(doc, "Risk & Exposure Report (continued)");
      y = 110;
    }

    const severityColor = risk.severity === "critical" ? BRAND.red : risk.severity === "high" ? "#F97316" : risk.severity === "medium" ? BRAND.amber : BRAND.gray;
    const bgColor = risk.severity === "critical" ? "#FEE2E2" : risk.severity === "high" ? "#FFEDD5" : risk.severity === "medium" ? "#FEF3C7" : BRAND.light;

    doc.roundedRect(50, y, 495, 55, 4).fill(bgColor);

    // Severity badge
    doc.roundedRect(60, y + 8, 60, 16, 3).fill(severityColor);
    doc.fontSize(7).fillColor(BRAND.white).text(risk.severity.toUpperCase(), 62, y + 11, { width: 56, align: "center" });

    // Domain label
    const domainLabel = AI360_DOMAINS.find((d) => d.key === risk.domain)?.shortLabel || "";
    doc.fontSize(7).fillColor(BRAND.gray).text(domainLabel, 130, y + 11);

    // Title & description
    doc.fontSize(9).fillColor(BRAND.dark).text(risk.title, 60, y + 28, { width: 475 });
    doc.fontSize(8).fillColor(BRAND.gray).text(risk.description, 60, y + 40, { width: 475 });

    y += 62;
  }

  renderFooter(doc, "Risk & Exposure Report");
}

// ─── Opportunities ────────────────────────────────────────────────

function renderOpportunities(doc: PDFKit.PDFDocument, data: ReportData) {
  renderHeader(doc, "Opportunity Landscape");

  let y = 110;

  const categories = [
    { key: "quick_win", label: "Quick Wins", color: BRAND.green },
    { key: "strategic", label: "Strategic Investments", color: BRAND.primary },
    { key: "foundational", label: "Foundation Building", color: BRAND.amber },
    { key: "scale", label: "Scale & Replicate", color: "#8B5CF6" },
  ];

  for (const cat of categories) {
    const items = data.scores.opportunities.filter((o) => o.category === cat.key);
    if (items.length === 0) continue;

    if (y > 700) {
      doc.addPage();
      renderHeader(doc, "Opportunity Landscape (continued)");
      y = 110;
    }

    doc.fontSize(10).fillColor(cat.color).text(cat.label.toUpperCase(), 50, y);
    y += 18;

    for (const item of items) {
      doc.fontSize(9).fillColor(BRAND.dark).text(item.title, 60, y, { width: 350 });
      doc.fontSize(7).fillColor(BRAND.gray).text(`Effort: ${item.effort} | Impact: ${item.impact}`, 420, y);
      y += 14;
      doc.fontSize(8).fillColor(BRAND.gray).text(item.description, 60, y, { width: 475 });
      y = doc.y + 10;
    }
    y += 8;
  }

  renderFooter(doc, "Opportunity Landscape");
}

// ─── Response Appendix ────────────────────────────────────────────

function renderResponseAppendix(doc: PDFKit.PDFDocument, data: ReportData) {
  renderHeader(doc, "Appendix: Full Response Data");

  let y = 110;

  for (const domain of AI360_DOMAINS) {
    if (y > 700) {
      doc.addPage();
      renderHeader(doc, "Appendix (continued)");
      y = 110;
    }

    doc.fontSize(10).fillColor(BRAND.dark).text(domain.label, 50, y);
    y += 16;

    const questions = AI360_QUESTIONS.filter((q) => q.domain === domain.key);
    for (const q of questions) {
      if (y > 740) {
        doc.addPage();
        renderHeader(doc, "Appendix (continued)");
        y = 110;
      }

      const resp = data.responses[q.id];
      const score = resp?.selectedOption || 0;
      const label = score > 0 ? q.options.find((o) => o.value === score)?.label || "" : "Not answered";

      doc.fontSize(7).fillColor(BRAND.gray).text(q.id, 50, y, { width: 30 });
      doc.fontSize(8).fillColor(BRAND.black).text(q.text, 82, y, { width: 320 });
      doc.fontSize(8).fillColor(score >= 4 ? BRAND.green : score <= 2 && score > 0 ? BRAND.red : BRAND.gray).text(
        score > 0 ? `${score}/5` : "—", 410, y, { width: 30, align: "center" }
      );
      doc.fontSize(7).fillColor(BRAND.gray).text(label, 445, y, { width: 100 });

      y = Math.max(y + 14, doc.y + 4);
    }
    y += 10;
  }

  renderFooter(doc, "Appendix: Full Response Data");
}

// ─── Back Page ────────────────────────────────────────────────────

function renderBackPage(doc: PDFKit.PDFDocument) {
  const w = doc.page.width;
  const h = doc.page.height;

  doc.rect(0, 0, w, h).fill(BRAND.dark);

  doc.fontSize(14).fillColor(BRAND.primary).text("TECHFIDES", 50, h / 2 - 60, { width: w - 100, align: "center" });
  doc.fontSize(10).fillColor(BRAND.white).text("Enterprise AI. Local Infrastructure. Total Sovereignty.", 50, h / 2 - 35, { width: w - 100, align: "center" });
  doc.moveDown(2);
  doc.fontSize(9).fillColor("#94A3B8").text("Frisco, TX  |  Guadalajara, MX  |  Libreville, GA", 50, h / 2, { width: w - 100, align: "center" });
  doc.fontSize(9).fillColor(BRAND.primary).text("techfides.com  |  engage@techfides.com", 50, h / 2 + 20, { width: w - 100, align: "center" });

  doc.fontSize(7).fillColor("#475569").text(
    "This document is confidential and proprietary. It may not be reproduced or distributed without written consent from TechFides.",
    50, h - 80, { width: w - 100, align: "center" }
  );
}

// ─── Shared Helpers ───────────────────────────────────────────────

function renderHeader(doc: PDFKit.PDFDocument, title: string) {
  const w = doc.page.width;
  doc.rect(0, 0, w, 80).fill(BRAND.light);
  doc.moveTo(0, 80).lineTo(w, 80).strokeColor(BRAND.primary).lineWidth(2).stroke();

  doc.fontSize(8).fillColor(BRAND.primary).text("TECHFIDES", 50, 20);
  doc.fontSize(7).fillColor(BRAND.gray).text("AI 360 Readiness Assessment", 50, 32);
  doc.fontSize(16).fillColor(BRAND.dark).text(title, 50, 50);
}

function renderFooter(doc: PDFKit.PDFDocument, section: string) {
  const w = doc.page.width;
  const h = doc.page.height;
  doc.fontSize(7).fillColor(BRAND.grayLight).text(
    `TechFides AI 360  |  ${section}  |  Confidential`,
    50, h - 40, { width: w - 100, align: "center" }
  );
}

function generateAutoSummary(data: ReportData): string {
  const { scores } = data;
  const strongDomains = scores.domains.filter((d) => d.color === "green").map((d) => d.label);
  const weakDomains = scores.domains.filter((d) => d.color === "red").map((d) => d.label);
  const riskCount = scores.riskProfile.filter((r) => r.severity === "critical" || r.severity === "high").length;

  let summary = `${data.orgName} demonstrates ${MATURITY_LABELS[scores.maturity].toLowerCase()} AI readiness with an overall score of ${scores.score}% across 6 domains and ${Object.keys(data.responses).length} assessment questions.`;

  if (strongDomains.length > 0) {
    summary += ` Key strengths include ${strongDomains.join(" and ")}, which show maturity levels ready for advanced AI deployment.`;
  }

  if (weakDomains.length > 0) {
    summary += ` Critical attention is needed in ${weakDomains.join(" and ")}, where significant gaps indicate foundational work is required before AI initiatives can succeed.`;
  }

  if (riskCount > 0) {
    summary += ` The assessment identified ${riskCount} high-priority risk(s) that should be addressed in the immediate term.`;
  }

  summary += ` ${scores.opportunities.length} strategic opportunities have been identified to accelerate the organization's AI transformation journey.`;

  return summary;
}
