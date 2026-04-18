"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type Tier = "Baseline" | "Practitioner" | "Builder" | "Governance" | "Executive";

const tierStyle: Record<Tier, string> = {
  Baseline: "bg-slate-500/20 text-slate-200 border-slate-500/40",
  Practitioner: "bg-electric-500/20 text-electric-300 border-electric-500/40",
  Builder: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  Governance: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Executive: "bg-accent-amber/20 text-accent-amber border-accent-amber/40",
};

export default function RoleBasedTrainingPage() {
  return (
    <ArtifactShell
      module="Module 5 · Cadence"
      moduleAccent="text-accent-green"
      artifactNumber="5.3"
      title="Role-Based Training Curriculum"
      subtitle="Five tiers of required training matched to how each role actually touches AI — with competency checks, renewal cadence, and audit-grade completion records."
      classification="CONFIDENTIAL"
      version="v1.0"
    >
      <ArtifactSection number="1" title="Purpose">
        <p>
          This curriculum defines the minimum AI literacy and competency
          required for every role in the organization, matched to the level of
          exposure that role has to AI systems and AI-assisted work. It is the
          evidentiary backbone for EU AI Act Article 4 (AI literacy), NIST AI
          RMF GOVERN-1.6 (workforce competencies), ISO 42001 Clause 7.2, and
          the HR dimension of ISO 27001 A.6.3. Completion records are retained
          for audit and refreshed annually.
        </p>
        <GuidanceCallout>
          Training without a competency check is content delivery, not
          enablement. Every tier in this curriculum ends with a pass/fail
          check. Users who do not pass do not get production access to
          AI-assisted workflows.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Five Training Tiers"
        intent="Tiers are additive. A Builder completes Baseline + Practitioner + Builder. A Governance role completes Baseline + Practitioner + Governance. Executives complete Baseline + Executive."
      >
        <div className="space-y-4">
          {(
            [
              {
                tier: "Baseline" as Tier,
                audience: "Every employee, contractor, and long-term vendor staff with systems access.",
                duration: "45 minutes",
                format: "Self-paced LMS module + 10-question check",
                outcomes: [
                  "Can explain in one sentence what the Acceptable Use Policy permits and prohibits.",
                  "Knows the list of approved AI tools and where to check the current inventory.",
                  "Knows what data classes may never be pasted into a non-approved AI tool.",
                  "Knows how to report an AI-related incident or concern.",
                ],
              },
              {
                tier: "Practitioner" as Tier,
                audience: "Any employee whose daily workflow includes an AI-assisted task (per Artifact 4.1).",
                duration: "2 hours",
                format: "Instructor-led or cohort-based + scenario-based practical",
                outcomes: [
                  "Can identify which autonomy tier (T1–T4) a workflow operates under and what their review obligation is.",
                  "Can produce a high-quality prompt for a workflow using the approved template (Artifact 4.2).",
                  "Can recognize the top 3 failure modes for their workflow and knows when to escalate.",
                  "Can explain the human-in-the-loop role for the workflow they run most often.",
                ],
              },
              {
                tier: "Builder" as Tier,
                audience: "Anyone who authors prompts, designs workflows, integrates AI into systems, or configures agents.",
                duration: "1 day (6 hours)",
                format: "Workshop + portfolio exercise reviewed by AI Governance Lead",
                outcomes: [
                  "Can design a new workflow using the 11-field spec (Artifact 4.1) and route it through the approval path.",
                  "Can write an evaluation set + red-team prompt suite for a new workflow (Artifact 4.2).",
                  "Can map a new workflow to relevant frameworks and data classifications.",
                  "Can articulate the choice of autonomy tier and defend it at QGR.",
                ],
              },
              {
                tier: "Governance" as Tier,
                audience: "AI Governance Lead, CISO, General Counsel, Compliance, Privacy, Internal Audit, Data Protection Officer.",
                duration: "1 day (6 hours) + quarterly 60-min refreshers",
                format: "Seminar + case-law / incident review + tabletop exercise",
                outcomes: [
                  "Can run the full Risk Register review (Artifact 2.3) including scoring recalibration.",
                  "Can chair an AI incident (Artifact 2.6) from detection to post-mortem.",
                  "Can map a new workflow to NIST AI RMF, ISO 42001, EU AI Act, and surface gaps.",
                  "Can defend the program to an external auditor with evidence pulled in under 24 hours.",
                ],
              },
              {
                tier: "Executive" as Tier,
                audience: "Executive Sponsor, CEO, CFO, COO, Board AI Committee members.",
                duration: "90 minutes + pre-QGR briefing",
                format: "Executive briefing + simulated decision scenarios",
                outcomes: [
                  "Can explain the governance posture of the organization in one paragraph.",
                  "Can interrogate an AI business case against the Value & Spend Tracker (Artifact 3.3).",
                  "Can make Scale / Hold / Rework / Retire calls at QGR with confidence.",
                  "Can represent the program credibly to customers, regulators, and the board.",
                ],
              },
            ]
          ).map((t) => (
            <div
              key={t.tier}
              className="rounded-xl border border-navy-700 bg-navy-900/60 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tierStyle[t.tier]}`}
                >
                  {t.tier}
                </span>
                <span className="text-xs uppercase tracking-wide text-navy-300">
                  {t.duration} · {t.format}
                </span>
              </div>
              <p className="mt-3 text-sm text-navy-100">
                <span className="font-semibold text-white">Audience:</span>{" "}
                {t.audience}
              </p>
              <p className="mt-3 text-xs uppercase tracking-wide text-navy-300">
                Learner will be able to
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm text-navy-100 space-y-1">
                {t.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Role → Tier Assignment"
        intent="Every role in the org chart maps to one or more tiers. HR and the AI Governance Lead maintain this mapping jointly and review it quarterly."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Role / Function</th>
                <th className="py-2 pr-4">Required Tiers</th>
                <th className="py-2">Trigger</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["All staff + contractors", "Baseline", "On or before Day 1."],
                ["Sales, CS, Support, Ops, Finance, Marketing staff using AI", "Baseline + Practitioner", "Before first access to an AI-assisted workflow."],
                ["Engineering, Data, ML, Product using AI assistants or agents", "Baseline + Practitioner + Builder", "Before authoring any prompt, workflow, or integration."],
                ["AI Governance Lead, CISO, GC, Compliance, Privacy, DPO, Internal Audit", "Baseline + Practitioner + Governance", "Before taking the role; refresher quarterly."],
                ["Executive Sponsor, CEO, CFO, COO, Board AI Committee", "Baseline + Executive", "Before taking the role; refresher annually."],
                ["Third-party / vendor staff with tool access", "Baseline (attested by vendor)", "Before provisioning access. Re-attest annually."],
              ].map(([role, tiers, trigger], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{role}</td>
                  <td className="py-3 pr-4 text-navy-200">{tiers}</td>
                  <td className="py-3 text-navy-200">{trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Competency Checks"
        intent="Each tier ends with a check. Pass threshold is 80% unless noted. Failure pathway is the same across tiers: retake once, then instructor-led remediation before a second attempt."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              tier: "Baseline",
              method: "10-question multiple-choice, randomized",
              passRule: "8/10",
              evidence: "LMS completion record + score + timestamp. Retained 3 years.",
            },
            {
              tier: "Practitioner",
              method: "Scenario: classify 5 real (redacted) prompts against data-class + autonomy-tier rules. Short-answer: escalation path for named workflow.",
              passRule: "4/5 scenario + 3/3 short-answer",
              evidence: "LMS record + graded rubric + instructor sign-off.",
            },
            {
              tier: "Builder",
              method: "Portfolio piece: submit a full workflow spec (Artifact 4.1) + prompt (Artifact 4.2) for a fictional case. Reviewed by AI Governance Lead against rubric.",
              passRule: "Meets 10/12 rubric criteria; 2 attempts max before 30-day cool-off.",
              evidence: "Portfolio retained + reviewer signature + ADR-style rationale.",
            },
            {
              tier: "Governance",
              method: "Tabletop: chair a simulated incident + Risk Register recalibration. Observed by external coach.",
              passRule: "Pass/fail by coach rubric (8 criteria). Fail = 1:1 coaching + re-run within 60 days.",
              evidence: "Coach report + tabletop artifacts + HR file.",
            },
            {
              tier: "Executive",
              method: "Decision simulation: Scale / Hold / Rework / Retire call on 3 scripted cases with trap-doors (unclear metrics, conflicting value cases).",
              passRule: "Defensible rationale on all 3 per observer.",
              evidence: "Observer notes + HR file + re-run at annual refresh.",
            },
          ].map((c) => (
            <div
              key={c.tier}
              className="rounded-xl border border-electric-500/30 bg-navy-900/60 p-5"
            >
              <p className="text-sm font-semibold text-electric-300">{c.tier}</p>
              <p className="mt-2 text-sm text-navy-100">
                <span className="font-semibold text-white">Method:</span>{" "}
                {c.method}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Pass rule:</span>{" "}
                {c.passRule}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Evidence:</span>{" "}
                {c.evidence}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Renewal & Currency"
        intent="A trained workforce a year ago is not a trained workforce today. These cadences are the minimum."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Tier</th>
                <th className="py-2 pr-4">Full Renewal</th>
                <th className="py-2 pr-4">Mandatory Re-Run Triggers</th>
                <th className="py-2">Responsible</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["Baseline", "Annual", "New AUP version · after any material incident", "HR + AI Governance Lead"],
                ["Practitioner", "Annual + on-workflow-change", "New or materially changed workflow · autonomy-tier change", "Function Head + AI Governance Lead"],
                ["Builder", "Annual + on-model-change", "New foundation model · new data-class in scope · new integration pattern", "AI Governance Lead"],
                ["Governance", "Quarterly 60-min refresh + annual full", "New regulation · new framework version · cross-border expansion", "AI Governance Lead + GC"],
                ["Executive", "Annual + pre-QGR briefing", "New board member · material strategy change · material incident", "AI Governance Lead + Exec Sponsor"],
              ].map(([tier, renewal, triggers, resp], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{tier}</td>
                  <td className="py-3 pr-4 text-navy-200">{renewal}</td>
                  <td className="py-3 pr-4 text-navy-200">{triggers}</td>
                  <td className="py-3 text-navy-200">{resp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Module Inventory"
        intent="The modules that compose this curriculum. Numbered, owned, versioned. Stored in LMS with source-of-truth in the governance repo."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Module</th>
                <th className="py-2 pr-4">Tier</th>
                <th className="py-2 pr-4">Owner</th>
                <th className="py-2">Version</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["M-01 · AI at [Client]: What, Why, Guardrails", "Baseline", "AI Governance Lead", <Placeholder key="v1">v1.0</Placeholder>],
                ["M-02 · Acceptable Use in Practice", "Baseline", "AI Governance Lead + GC", <Placeholder key="v2">v1.0</Placeholder>],
                ["M-03 · Data Classes + What You May Never Paste", "Baseline", "CISO + DPO", <Placeholder key="v3">v1.0</Placeholder>],
                ["M-04 · Reporting a Concern", "Baseline", "AI Governance Lead", <Placeholder key="v4">v1.0</Placeholder>],
                ["M-05 · Prompting for Quality", "Practitioner", "AI Governance Lead", <Placeholder key="v5">v1.0</Placeholder>],
                ["M-06 · Autonomy Tiers + Human-in-the-Loop", "Practitioner", "AI Governance Lead", <Placeholder key="v6">v1.0</Placeholder>],
                ["M-07 · Escalation + Failure Modes", "Practitioner", "Function Heads", <Placeholder key="v7">v1.0</Placeholder>],
                ["M-08 · Workflow Design Workshop", "Builder", "AI Governance Lead", <Placeholder key="v8">v1.0</Placeholder>],
                ["M-09 · Evaluation + Red-Teaming", "Builder", "AI Governance Lead + ML Lead", <Placeholder key="v9">v1.0</Placeholder>],
                ["M-10 · Framework Mapping Seminar", "Governance", "AI Governance Lead + Compliance", <Placeholder key="v10">v1.0</Placeholder>],
                ["M-11 · Incident Tabletop", "Governance", "CISO + AI Governance Lead", <Placeholder key="v11">v1.0</Placeholder>],
                ["M-12 · Executive Decision Simulation", "Executive", "Executive Sponsor + AI Governance Lead", <Placeholder key="v12">v1.0</Placeholder>],
              ].map(([mod, tier, owner, ver], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{mod}</td>
                  <td className="py-3 pr-4 text-navy-200">{tier}</td>
                  <td className="py-3 pr-4 text-navy-200">{owner}</td>
                  <td className="py-3">{ver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Evidence & Audit"
        intent="What a regulator or auditor will ask for, and where we hold it."
      >
        <div className="space-y-3">
          {[
            {
              question: "Show that every employee completed AI literacy training this calendar year.",
              evidence: "LMS completion report, exportable per person and per cohort. Matches HRIS active-employee list with ≤2% drift.",
              owner: "HR + AI Governance Lead",
            },
            {
              question: "Show that every Practitioner passed the competency check before touching a workflow.",
              evidence: "Workflow access provisioning log tied to LMS pass record. Access is denied in IAM until LMS status = pass.",
              owner: "IT / IAM + AI Governance Lead",
            },
            {
              question: "Show that Builders cannot author a production prompt without Builder certification.",
              evidence: "Repo merge protection + code-owner rule. Only users in the AI-Builders group can merge to prompt library.",
              owner: "Engineering + AI Governance Lead",
            },
            {
              question: "Show that Governance roles practice incidents before a real one happens.",
              evidence: "Tabletop schedule + after-action reports for the last 4 quarters.",
              owner: "CISO + AI Governance Lead",
            },
            {
              question: "Show that Executives made decisions at QGR with up-to-date training.",
              evidence: "Annual Executive refresh sign-off matched to QGR attendance log (Artifact 5.1).",
              owner: "AI Governance Lead + Exec Sponsor",
            },
          ].map((e) => (
            <div
              key={e.question}
              className="rounded-xl border border-accent-amber/30 bg-navy-900/60 p-4"
            >
              <p className="text-sm font-semibold text-accent-amber">
                {e.question}
              </p>
              <p className="mt-2 text-sm text-navy-100">
                <span className="font-semibold text-white">Evidence:</span>{" "}
                {e.evidence}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Owner:</span>{" "}
                {e.owner}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="8"
        title="Regulatory & Framework Mapping"
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.6, GOVERN-4.1" },
            { name: "ISO 42001", control: "Cl. 7.2, 7.3" },
            { name: "ISO 27001", control: "A.6.3" },
            { name: "SOC 2", control: "CC1.4, CC2.2, CC5.3" },
            { name: "EU AI Act", control: "Art. 4, 26(2)" },
            { name: "HIPAA", control: "§164.308(a)(5) Security Awareness & Training" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
