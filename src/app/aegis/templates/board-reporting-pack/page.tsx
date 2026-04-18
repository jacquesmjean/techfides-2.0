"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

export default function BoardReportingPackPage() {
  return (
    <ArtifactShell
      module="Module 6 · Brief"
      moduleAccent="text-indigo-400"
      artifactNumber="6.2"
      title="Board Reporting Pack"
      subtitle="Quarterly board-grade summary of the AI program. Eight slides, one appendix, pre-cleared by General Counsel — the version the board sees."
      classification="BOARD"
      version="v1.0"
    >
      <ArtifactSection number="1" title="Purpose">
        <p>
          The Board Reporting Pack is the quarterly artifact delivered to the
          board (or the board committee with AI oversight, typically Audit or
          Risk). It is the externally-defensible companion to the Executive AI
          Dashboard: fewer signals, more narrative, cleared for redistribution
          to auditors and regulators on request. It is authored by the AI
          Governance Lead, reviewed by General Counsel, and approved by the
          Executive Sponsor at least 5 business days before the board meeting.
        </p>
        <GuidanceCallout>
          A board pack is an evidentiary document. Every claim must be
          traceable to an underlying AEGIS artifact with a date. Never promise
          outcomes the dashboard does not already show.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Eight-Slide Structure"
        intent="Standing structure. Same eight slides every quarter so the board reads trends, not new framings."
      >
        <div className="space-y-4">
          {[
            {
              slide: "1 · Cover + Reporting Period",
              contents: "Client, quarter, program stage, author, GC clearance line, classification badge.",
              sourceArtifacts: "Header from 6.1",
              doNot: "Do not add a subtitle that promises results. Cover is identification only.",
            },
            {
              slide: "2 · Program Posture (one chart, one sentence)",
              contents: "Overall signal (Green / Amber / Red) with the rule that produced it. One-sentence narrative.",
              sourceArtifacts: "6.1 · §2 Program Signal",
              doNot: "Do not soften Amber or Red with language. Report the color.",
            },
            {
              slide: "3 · What We Did This Quarter",
              contents: "5–7 bullets: workflows shipped, policies approved, incidents closed, audits passed, training delivered.",
              sourceArtifacts: "QGR minutes (5.1) · Inventory (3.1) · Incident log (2.6)",
              doNot: "Do not list activity with no outcome. Each bullet pairs action with observable change.",
            },
            {
              slide: "4 · Value Realized + In-Flight",
              contents: "Value realized trailing-90 with method + assumptions. Spend vs envelope. Top 3 initiatives by projected value with gate state.",
              sourceArtifacts: "3.3 Value & Spend Tracker",
              doNot: "Do not report value the Value Tracker has not already booked.",
            },
            {
              slide: "5 · Risk + Incidents",
              contents: "Open Very High / High count + top 3 by exposure with treatment. Incidents this quarter by severity, with root-cause category and closure state.",
              sourceArtifacts: "2.3 Risk Register · 2.6 Incident Runbook",
              doNot: "Do not combine incidents across severities into a single headline number.",
            },
            {
              slide: "6 · Compliance Posture",
              contents: "Framework mapping heatmap (NIST AI RMF, ISO 42001, ISO 27001, SOC 2, EU AI Act + any sector regs). Any opened/closed findings. Attestation currency.",
              sourceArtifacts: "Policy Core (Module 2) · Training currency (5.3)",
              doNot: "Do not conflate \u201cmapped\u201d with \u201ccertified\u201d. Be explicit about which controls are evidenced vs designed.",
            },
            {
              slide: "7 · Decisions Requested of the Board",
              contents: "1–3 explicit asks with recommendation, alternative, and consequence of no decision.",
              sourceArtifacts: "QGR open decisions (5.1) · Exec dashboard (6.1)",
              doNot: "Do not bring more than 3 decisions. Park the rest at Executive level.",
            },
            {
              slide: "8 · Forward 90 Days",
              contents: "Top 3 risks, top 3 value milestones, top 3 regulatory / external watch items. Named owners + dates.",
              sourceArtifacts: "2.3 Risk Register · 6.3 12-Month Roadmap",
              doNot: "Do not promise milestones that slip every quarter. Trim and be honest.",
            },
          ].map((s) => (
            <div
              key={s.slide}
              className="rounded-xl border border-navy-700 bg-navy-900/60 p-5"
            >
              <p className="text-sm font-semibold text-white">{s.slide}</p>
              <p className="mt-2 text-sm text-navy-100">
                <span className="font-semibold text-white">Contents:</span>{" "}
                {s.contents}
              </p>
              <p className="mt-1 text-xs text-navy-200">
                <span className="font-semibold text-navy-100">Source:</span>{" "}
                {s.sourceArtifacts}
              </p>
              <p className="mt-1 text-xs text-rose-300">
                <span className="font-semibold">Do not:</span> {s.doNot}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Standing Appendix"
        intent="Appendix rides along every quarter. Board members do not read it unless they need to — that is the point."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Appendix Section</th>
                <th className="py-2 pr-4">Contents</th>
                <th className="py-2">Source</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["A. Program Charter + RACI (current)", "One-page charter + RACI matrix. Updated only on change.", "2.2 RACI"],
                ["B. Active AI Inventory (summary)", "Count by status + list of tools at CLIENT-RESTRICTED or BOARD classification.", "3.1 AI Inventory"],
                ["C. Top 10 Risks (current)", "Full row per risk: description, inherent, treatment, residual, owner, aging.", "2.3 Risk Register"],
                ["D. Incident Log (quarter)", "All incidents opened or closed this quarter with severity + RCA tag.", "2.6 Incident Runbook"],
                ["E. Training Currency (snapshot)", "Percentage in-cycle by tier + named cohorts below 95%.", "5.3 Role-Based Training"],
                ["F. Regulatory Watch (90-day)", "External items entering the 90-day action window.", "AI Governance Lead scan"],
                ["G. Glossary", "One-page glossary of AEGIS terms + framework shorthand.", "Standing"],
              ].map(([sec, contents, src], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{sec}</td>
                  <td className="py-3 pr-4 text-navy-200">{contents}</td>
                  <td className="py-3 text-navy-200">{src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Authorship & Clearance"
        intent="Board packs that have not been cleared through the chain below are not board packs."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Step</th>
                <th className="py-2 pr-4">Owner</th>
                <th className="py-2 pr-4">Timing</th>
                <th className="py-2">Output</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["1. Assemble", "AI Governance Lead", "T-15 business days", "Draft 1, all numbers traced to source"],
                ["2. Numbers audit", "CFO delegate + CISO", "T-10", "Every claim verified against source artifact"],
                ["3. Legal clearance", "General Counsel", "T-8", "Red-line on language; disclosure review"],
                ["4. Exec Sponsor approval", "Exec Sponsor", "T-5", "Signed approval + one-line cover memo"],
                ["5. Distribution", "Board Secretary", "T-3", "Secure channel per charter; retention per records policy"],
                ["6. Minute the delivery", "Board Secretary", "Meeting + 5", "Minutes reference pack version + SHA"],
              ].map(([step, owner, timing, output], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{step}</td>
                  <td className="py-3 pr-4 text-navy-200">{owner}</td>
                  <td className="py-3 pr-4 text-navy-200">{timing}</td>
                  <td className="py-3 text-navy-200">{output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GuidanceCallout>
          The pack is versioned with a SHA stored in the governance repo. If
          anyone asks &ldquo;which pack did the board see?&rdquo;, the answer
          must be recoverable to the exact PDF.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Redistribution & Classification"
        intent="This document is classified BOARD. Distribution rules below are non-negotiable."
      >
        <div className="space-y-3">
          {[
            {
              rule: "No copy/paste into email bodies.",
              detail: "Reference the pack by name + version + SHA; link via secure channel.",
            },
            {
              rule: "No external distribution without GC-signed NDA or legal request.",
              detail: "Auditor, regulator, acquirer DD — all require a named clearance path.",
            },
            {
              rule: "Retention per records schedule.",
              detail: "Default 7 years unless sector regulation requires longer. Archive immutable.",
            },
            {
              rule: "Redaction rules are pre-defined.",
              detail: "If a redacted version is needed for a wider audience, GC has pre-approved mask patterns stored with the template.",
            },
            {
              rule: "Material incidents inside the quarter trigger a board-committee flash update.",
              detail: "Do not wait for the next quarterly pack. Flash is issued within 72 hours of incident classification.",
            },
          ].map((r) => (
            <div
              key={r.rule}
              className="rounded-xl border border-purple-500/30 bg-navy-900/60 p-4"
            >
              <p className="text-sm font-semibold text-purple-300">{r.rule}</p>
              <p className="mt-2 text-sm text-navy-100">{r.detail}</p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Regulatory & Framework Mapping"
        intent="Board oversight of AI is named specifically in the frameworks below. This pack is how the program evidences that oversight."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.1, GOVERN-4.1" },
            { name: "ISO 42001", control: "Cl. 5.1, 9.3" },
            { name: "ISO 27001", control: "Cl. 5.1, 9.3" },
            { name: "SOC 2", control: "CC1.1, CC1.2, CC2.3" },
            { name: "EU AI Act", control: "Art. 17, 26" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
