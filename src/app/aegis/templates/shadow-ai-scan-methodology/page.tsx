"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type ScanVector = {
  vector: string;
  method: string;
  output: string;
  effort: string;
};

const scanVectors: ScanVector[] = [
  {
    vector: "Identity provider audit",
    method:
      "Enumerate OAuth and SSO grants for AI vendors across Okta, Microsoft Entra, Google Workspace. Export by user.",
    output: "Sanctioned-AI grant map",
    effort: "2h",
  },
  {
    vector: "Corporate card and expense review",
    method:
      "Query expense system for last 12 months of charges matching AI vendor merchant list. Filter by department and amount.",
    output: "Discretionary AI spend log",
    effort: "3h",
  },
  {
    vector: "DNS and egress telemetry",
    method:
      "Pull 30–90 days of DNS resolution and egress firewall logs for known AI vendor domains. Aggregate by user and volume.",
    output: "Unsanctioned AI traffic report",
    effort: "4h",
  },
  {
    vector: "Browser extension survey",
    method:
      "Endpoint management query for installed AI-related extensions (Copilot, Monica, Harpa, Claude for Chrome, etc.).",
    output: "Extension inventory by workstation",
    effort: "2h",
  },
  {
    vector: "SaaS discovery platform",
    method:
      "If client runs Zylo / Torii / Productiv / similar, export AI category view. If not, reconstruct via finance feed.",
    output: "Licensed SaaS AI list",
    effort: "1h",
  },
  {
    vector: "Voluntary self-report survey",
    method:
      "Ten-minute anonymous survey across knowledge-worker population: which AI tools do you use for work, how often, on what data class.",
    output: "Ground-truth usage signal",
    effort: "1h design + 3 days field",
  },
  {
    vector: "Stakeholder interview triangulation",
    method:
      "Cross-reference tools mentioned in Diagnostic interviews (Artifact D.1) against grants, spend, and DNS. Flag every mismatch.",
    output: "Shadow AI discrepancy register",
    effort: "2h",
  },
  {
    vector: "Document metadata inspection",
    method:
      "Sample 50 recent documents from shared drives. Inspect metadata for AI-generation signatures (tool, timestamp, model).",
    output: "Document provenance sample",
    effort: "2h",
  },
];

export default function ShadowAIScanMethodologyPage() {
  return (
    <ArtifactShell
      module="Diagnostic"
      moduleAccent="text-accent-green"
      artifactNumber="D.2"
      title="Shadow AI Scan Methodology"
      subtitle="Eight-vector scanning protocol to produce a defensible inventory of sanctioned, discretionary, and unsanctioned AI usage across the enterprise in five business days."
      version="v1.0"
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="1"
        title="Purpose and Scope"
        intent="Set expectations. Shadow AI is not a tools list — it is the gap between what leadership believes is in use and what is actually running."
      >
        <p className="text-slate-300">
          The Shadow AI Scan produces three overlapping views of AI activity
          inside the client environment: what the company pays for, what
          employees are using (paid by anyone), and what is being done with
          company data across either channel. The scan runs in parallel with
          Stakeholder Interviews and feeds the AI Inventory Dashboard, the
          Value & Spend Tracker, and the risk posture sections of the Gap
          Assessment.
        </p>
        <SubSection title="In scope">
          <ul className="ml-5 list-disc space-y-1">
            <li>Enterprise-licensed AI platforms and features.</li>
            <li>
              Department- and individual-paid AI subscriptions (including
              personal accounts reimbursed via expense).
            </li>
            <li>Free-tier AI tools used on corporate devices or networks.</li>
            <li>
              AI capabilities embedded in non-AI-primary SaaS (e.g., CRM
              copilots, design-tool AI, code assistants).
            </li>
            <li>
              Browser-resident AI (extensions, bookmarklets, pasted prompts to
              personal accounts).
            </li>
          </ul>
        </SubSection>
        <SubSection title="Out of scope">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              AI activity on personally-owned devices on personal networks
              (covered in policy, not in scan).
            </li>
            <li>
              Deep technical penetration testing (belongs to a security
              engagement, not a governance Diagnostic).
            </li>
            <li>
              Employee performance evaluation — the scan is a systems audit,
              not an employee audit.
            </li>
          </ul>
        </SubSection>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "MAP-1.1" },
            { name: "NIST AI RMF", control: "MAP-3.1" },
            { name: "SOC 2", control: "CC6.1" },
            { name: "ISO 27001", control: "A.5.9" },
            { name: "ISO 42001", control: "6.1.2" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Ethical and Legal Posture"
        intent="The scan is not surveillance. Brief the client, brief employees, and stay inside the boundary."
      >
        <ul className="ml-5 list-disc space-y-2 text-slate-300">
          <li>
            The scan operates on systems data the employer already has
            lawful access to — identity logs, network telemetry, expense
            records, endpoint inventory. No new monitoring is installed.
          </li>
          <li>
            The voluntary survey must be anonymous and voluntary. If it cannot
            be, omit it; do not make it mandatory and call it voluntary.
          </li>
          <li>
            Findings are reported at the aggregate level. Individual
            identification is used only for remediation (e.g., rotating an
            exposed credential) and only with HR/legal involvement.
          </li>
          <li>
            Works-council, union, and jurisdictional obligations (EU employee
            monitoring, California CCPA, etc.) are confirmed with client legal
            before the scan starts, not after.
          </li>
        </ul>
        <GuidanceCallout>
          A Shadow AI Scan that damages employee trust is worse than no scan.
          If the client is unwilling to brief employees that the scan is
          running, recommend a narrower scope and document the decision.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Scan Vectors"
        intent="Eight overlapping vectors. Each is imperfect alone; together they triangulate the shadow surface."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-4">Vector</th>
                <th className="py-2 pr-4">Method</th>
                <th className="py-2 pr-4">Output</th>
                <th className="py-2 pr-4">Consultant Effort</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {scanVectors.map((v) => (
                <tr key={v.vector}>
                  <td className="py-3 pr-4 align-top font-semibold text-slate-100">
                    {v.vector}
                  </td>
                  <td className="py-3 pr-4 align-top">{v.method}</td>
                  <td className="py-3 pr-4 align-top text-electric-400">
                    {v.output}
                  </td>
                  <td className="py-3 pr-4 align-top font-mono text-xs">
                    {v.effort}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Day-by-Day Execution"
        intent="The scan runs across the first five business days of the Diagnostic. Slippage here delays every downstream artifact."
        pageBreak
      >
        <ol className="space-y-4 text-sm text-slate-300">
          <li className="flex gap-4">
            <span className="mt-0.5 rounded-sm border border-slate-700 px-2 py-0.5 font-mono text-xs font-bold text-electric-400">
              Day 1
            </span>
            <div>
              <p className="font-semibold text-slate-100">
                Access and consent
              </p>
              <p className="mt-1">
                Obtain read access to IDP, expense system, endpoint management,
                and egress telemetry. Confirm HR/legal sign-off on the scan
                scope. Brief the employee population (engagement sponsor
                drafts, consultant reviews).
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="mt-0.5 rounded-sm border border-slate-700 px-2 py-0.5 font-mono text-xs font-bold text-electric-400">
              Day 2
            </span>
            <div>
              <p className="font-semibold text-slate-100">
                Sanctioned + discretionary pass
              </p>
              <p className="mt-1">
                Run IDP grant extraction, expense query, SaaS discovery
                platform export. Produce the preliminary AI Inventory — every
                paid tool, every grant.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="mt-0.5 rounded-sm border border-slate-700 px-2 py-0.5 font-mono text-xs font-bold text-electric-400">
              Day 3
            </span>
            <div>
              <p className="font-semibold text-slate-100">
                Telemetry and endpoint
              </p>
              <p className="mt-1">
                Pull DNS and egress logs. Query endpoint management for
                AI-related extensions and local apps. Inspect document
                metadata sample.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="mt-0.5 rounded-sm border border-slate-700 px-2 py-0.5 font-mono text-xs font-bold text-electric-400">
              Day 4
            </span>
            <div>
              <p className="font-semibold text-slate-100">
                Survey in field + triangulation
              </p>
              <p className="mt-1">
                Launch anonymous self-report survey (24-hour window). Begin
                triangulating stakeholder interview claims against telemetry.
                Build the discrepancy register.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="mt-0.5 rounded-sm border border-slate-700 px-2 py-0.5 font-mono text-xs font-bold text-electric-400">
              Day 5
            </span>
            <div>
              <p className="font-semibold text-slate-100">
                Synthesis and report
              </p>
              <p className="mt-1">
                Close survey. Merge all vectors. Produce Shadow AI Scan Report
                with sanctioned inventory, discretionary inventory, unsanctioned
                usage findings, and prioritized risk flags.
              </p>
            </div>
          </li>
        </ol>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Classification of Findings"
        intent="Every finding is classified by both exposure type and data sensitivity. This drives prioritization in the 90-Day Roadmap."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-4">Class</th>
                <th className="py-2 pr-4">Definition</th>
                <th className="py-2 pr-4">Default Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3 pr-4 align-top font-semibold text-rose-400">
                  P0 — Regulated data exposure
                </td>
                <td className="py-3 pr-4 align-top">
                  Unsanctioned AI processing PHI, PII, PCI, privileged
                  material, or source code classified as confidential.
                </td>
                <td className="py-3 pr-4 align-top">
                  Remediate within 5 business days.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 align-top font-semibold text-accent-amber">
                  P1 — Contractual exposure
                </td>
                <td className="py-3 pr-4 align-top">
                  AI tool processing client-confidential material outside the
                  permissions of a client data processing agreement.
                </td>
                <td className="py-3 pr-4 align-top">
                  Remediate within 15 business days.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 align-top font-semibold text-electric-400">
                  P2 — Policy gap
                </td>
                <td className="py-3 pr-4 align-top">
                  Tool in use without an applicable policy, but no active data
                  exposure today.
                </td>
                <td className="py-3 pr-4 align-top">
                  Close within 30 business days (policy issuance).
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 align-top font-semibold text-accent-green">
                  P3 — Consolidation opportunity
                </td>
                <td className="py-3 pr-4 align-top">
                  Duplicate or overlapping sanctioned tools; candidate for
                  consolidation and spend reduction.
                </td>
                <td className="py-3 pr-4 align-top">
                  Address in Core Implementation phase.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Output: Shadow AI Scan Report Structure"
        intent="The scan feeds a standardized report. Structure does not vary by client — only content does."
      >
        <ol className="ml-5 list-decimal space-y-2 text-sm text-slate-300">
          <li>
            <span className="font-semibold text-slate-100">
              Executive summary (1 page).
            </span>{" "}
            Headline count of tools discovered, P0/P1/P2/P3 distribution, total
            AI spend, top three findings.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Sanctioned inventory.
            </span>{" "}
            Every tool the organization pays for, with owner, data class,
            current controls.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Discretionary inventory.
            </span>{" "}
            Department and individual paid tools, with reimbursement trail and
            approval posture.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Unsanctioned usage findings.
            </span>{" "}
            Telemetry-sourced observations: which AI services are reached, by
            how many users, at what volume. No individual attribution in the
            report body.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Discrepancy register.
            </span>{" "}
            Mismatches between stakeholder claims and observed activity.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Prioritized risk flags (P0–P3).
            </span>{" "}
            With recommended remediation path and owner.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Appendix A — Methodology and consent trail.
            </span>
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Appendix B — Individual findings (restricted).
            </span>{" "}
            Shared only with engagement sponsor + HR/legal; not distributed in
            the main report.
          </li>
        </ol>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Common Failure Modes"
        intent="Anticipate these. Each has defeated an otherwise-solid scan."
      >
        <ul className="ml-5 list-disc space-y-2 text-sm text-slate-300">
          <li>
            <span className="font-semibold text-slate-100">
              IT refuses telemetry access mid-scan.
            </span>{" "}
            Mitigation: obtain explicit written access scope on Day 1, signed
            by CIO or CISO. Do not start the scan on verbal assent.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Survey return rate below 25%.
            </span>{" "}
            Mitigation: have the CEO send the survey, not the consultant.
            Target 48-hour window with one reminder. Below 25% = report as
            directional, not representative.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Egress logs retained under 30 days.
            </span>{" "}
            Mitigation: start the telemetry pull on Day 1 of the overall
            engagement, even before formal scan kickoff, to capture maximum
            window.
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              Stakeholder attempts to suppress a P0 finding.
            </span>{" "}
            Mitigation: P0 findings route to the engagement sponsor and client
            legal simultaneously. Suppression is not a consultant decision.
          </li>
        </ul>
      </ArtifactSection>

      <ArtifactSection
        number="8"
        title="Engagement Record"
        intent="Keep the scan auditable."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-4">Field</th>
                <th className="py-2 pr-4">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 pr-4 font-semibold">Scan window</td>
                <td className="py-2 pr-4">
                  <Placeholder>Start date</Placeholder> to{" "}
                  <Placeholder>End date</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Access scope signed by</td>
                <td className="py-2 pr-4">
                  <Placeholder>CIO / CISO name, signature date</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">HR/legal briefed</td>
                <td className="py-2 pr-4">
                  <Placeholder>Names, date</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Employee notice issued</td>
                <td className="py-2 pr-4">
                  <Placeholder>Date, channel, copy reference</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Vectors executed</td>
                <td className="py-2 pr-4">
                  <Placeholder>List of vectors, note omissions and rationale</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Report issued to</td>
                <td className="py-2 pr-4">
                  <Placeholder>Recipient list, date</Placeholder>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArtifactSection>
    </ArtifactShell>
  );
}
