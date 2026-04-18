"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type OverlayStep = {
  step: number;
  legacy: string;
  updated: string;
  aiRole: string;
  human: string;
};

const contractReviewOverlay: OverlayStep[] = [
  {
    step: 1,
    legacy: "Deal desk receives signed NDA and counterparty-drafted MSA.",
    updated: "Deal desk uploads MSA to CLM with tag `ai-review`. System confirms no P0 data present.",
    aiRole: "Pre-flight check by classifier — rejects upload if P0 / privileged markers detected.",
    human: "Deal desk (unchanged responsibility, new tooling).",
  },
  {
    step: 2,
    legacy: "Attorney schedules 4–6 hour clause-by-clause first pass.",
    updated: "Workflow WF-01 runs prompt PR-001 against the attached playbook. Produces a redline summary and risk flags within 8 minutes.",
    aiRole: "AI generates draft only — produces structured output per PR-001 spec.",
    human: "Attorney begins from the redline summary rather than blank page.",
  },
  {
    step: 3,
    legacy: "Attorney annotates findings in Word, emails to deal lead.",
    updated: "Attorney reviews AI redline in CLM. Accepts, edits, or rejects each flag. Accepted flags become the contract redline.",
    aiRole: "Suggestions only — nothing flows to counterparty without attorney commit.",
    human: "Attorney holds authorship of record (unchanged).",
  },
  {
    step: 4,
    legacy: "Deal lead negotiates with counterparty over email.",
    updated: "Deal lead negotiates with counterparty over email (unchanged).",
    aiRole: "Not involved.",
    human: "Deal lead owns negotiation (unchanged).",
  },
  {
    step: 5,
    legacy: "Final version routed for signature via DocuSign.",
    updated:
      "Final version routed for signature via DocuSign. Post-execution artifact packet auto-generated: AI redline summary, final contract, deviation log (for audit).",
    aiRole: "Auto-generates audit packet — no decisions made.",
    human: "GC approves audit packet retention. Retention schedule per Artifact 2.1.",
  },
];

const supportOverlay: OverlayStep[] = [
  {
    step: 1,
    legacy: "Ticket enters queue. Tier-1 agent picks next in line, reads, classifies by category.",
    updated: "Ticket enters queue. Workflow WF-03 classifies category, priority, and suggested team within 4 seconds. Regulated-account tag bypasses AI entirely.",
    aiRole: "Classification only (PR-003). Low-confidence cases route to human triage automatically.",
    human: "Agent sees AI-suggested classification and can override with one click.",
  },
  {
    step: 2,
    legacy: "Agent searches knowledge base for related cases, drafts response from templates.",
    updated: "Workflow WF-03 returns a suggested first response pulled from the approved response library. Agent reviews, edits, sends.",
    aiRole: "Retrieval-based response suggestion only — no free-form generation on customer-visible content.",
    human: "Agent is author of record for the outbound response.",
  },
  {
    step: 3,
    legacy: "Agent closes ticket, tags resolution code manually.",
    updated: "Agent closes ticket. AI-suggested resolution code pre-filled; agent confirms or overrides.",
    aiRole: "Resolution code suggestion from case content.",
    human: "Agent confirms resolution code — remains accountable for case disposition.",
  },
  {
    step: 4,
    legacy: "Team lead pulls weekly QA sample for review.",
    updated: "Team lead reviews AI-assisted weekly QA sample dashboard: misrouted tickets, low-confidence overrides, CSAT delta on AI-assisted cases.",
    aiRole: "Aggregate analytics only — no case-level decisions.",
    human: "Team lead drives corrective action + prompt refinement signal back to 4.2.",
  },
];

export default function SOPUpdatesPage() {
  return (
    <ArtifactShell
      module="Module 4 · Deploy"
      moduleAccent="text-cyan-400"
      artifactNumber="4.3"
      title="SOP Updates for AI-Assisted Work"
      subtitle="How to rewrite standard operating procedures when AI joins the team — with overlay format, role changes, and audit-ready decision trails."
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="01"
        title="Purpose"
        intent="If SOPs don't change when AI enters the workflow, the workflow and the documentation diverge — and the audit, incident, and training problems that follow are all downstream of that gap."
      >
        <SubSection title="Why SOPs are the forgotten artifact">
          <p>
            Most organizations deploy AI into existing workflows without
            updating the SOP that describes the workflow. The first consequence
            is training — new hires learn a process that doesn&rsquo;t match what
            actually happens. The second is audit — when an incident occurs,
            the documented process does not describe the failed system. The
            third is risk — nobody has consciously decided which steps the AI
            is allowed to change.
          </p>
        </SubSection>

        <SubSection title="What this artifact provides">
          <ul className="list-disc space-y-1 pl-5">
            <li>A standard overlay format for updating any existing SOP with AI-assisted steps.</li>
            <li>Rules for what must be captured at each changed step.</li>
            <li>Two worked examples — contract review and support triage — that mirror workflows 4.1 WF-01 and WF-03.</li>
            <li>Role-change guidance: where the human role has changed, shifted, or disappeared.</li>
          </ul>
        </SubSection>

        <GuidanceCallout>
          The overlay is deliberately conservative. Clients who want to ship
          faster will be tempted to skip the &ldquo;unchanged&rdquo; rows — don&rsquo;t. Auditors
          read the &ldquo;unchanged&rdquo; rows to confirm that critical controls are still
          present. Completeness is the product, not brevity.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="02"
        title="Overlay Format"
        intent="A single consistent format across every SOP update. Every step shows five columns: step number, legacy description, updated description, AI role, human role."
      >
        <SubSection title="Required columns">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Step #</strong> — sequential, stable across the legacy and updated versions.
            </li>
            <li>
              <strong>Legacy step</strong> — the original, pre-AI step description. Never deleted, even when the step is fully replaced.
            </li>
            <li>
              <strong>Updated step</strong> — the step as it runs now. Must explicitly name the workflow (WF-NN) and prompt (PR-NNN) where applicable.
            </li>
            <li>
              <strong>AI role</strong> — precisely what the AI contributes at this step. &ldquo;None&rdquo; if unchanged.
            </li>
            <li>
              <strong>Human role</strong> — who remains accountable at this step and what changed, if anything, about their role.
            </li>
          </ol>
        </SubSection>

        <SubSection title="Rules for the overlay">
          <ul className="list-disc space-y-1 pl-5">
            <li>Never delete a legacy step — if it is fully replaced, the cell reads &ldquo;replaced by step N&rdquo; with rationale in notes.</li>
            <li>Every AI role references a governed workflow (4.1) and a prompt (4.2). Unreferenced AI use is not sanctioned.</li>
            <li>If a step changes human accountability, it is flagged in the changelog and RACI (1.2) is updated in the same release.</li>
            <li>Every updated SOP has a version + effective date + named approver.</li>
          </ul>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="03"
        title="Example 1 — Contract Review SOP Overlay"
        intent="Overlays the legacy contract review SOP with the AI-assisted workflow WF-01. Total cycle time dropped 60% while attorney accountability increased, not decreased."
        pageBreak
      >
        <div className="overflow-x-auto rounded-md border border-slate-800">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                {["#", "Legacy Step", "Updated Step", "AI Role", "Human Role"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-slate-800 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contractReviewOverlay.map((s) => (
                <tr key={s.step} className="border-b border-slate-800/60 last:border-0 align-top">
                  <td className="px-3 py-3 font-mono text-xs text-slate-500">{s.step}</td>
                  <td className="px-3 py-3 text-slate-400">{s.legacy}</td>
                  <td className="px-3 py-3 text-slate-200">{s.updated}</td>
                  <td className="px-3 py-3 text-cyan-300">{s.aiRole}</td>
                  <td className="px-3 py-3 text-slate-300">{s.human}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="04"
        title="Example 2 — Support Triage SOP Overlay"
        intent="Illustrates a higher-autonomy (T3) workflow. Note that the human is off the per-case hot path but on the aggregate oversight path — a different shape of accountability, not less of it."
      >
        <div className="overflow-x-auto rounded-md border border-slate-800">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                {["#", "Legacy Step", "Updated Step", "AI Role", "Human Role"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-slate-800 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supportOverlay.map((s) => (
                <tr key={s.step} className="border-b border-slate-800/60 last:border-0 align-top">
                  <td className="px-3 py-3 font-mono text-xs text-slate-500">{s.step}</td>
                  <td className="px-3 py-3 text-slate-400">{s.legacy}</td>
                  <td className="px-3 py-3 text-slate-200">{s.updated}</td>
                  <td className="px-3 py-3 text-cyan-300">{s.aiRole}</td>
                  <td className="px-3 py-3 text-slate-300">{s.human}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="05"
        title="Role Change Patterns"
        intent="Four recurring patterns across clients. Name the pattern explicitly in the SOP so the training, RACI, and performance reviews all match."
      >
        <SubSection title="A · Role unchanged">
          <p>
            Same role, same accountability, same measure of success. AI is a
            tool the role now uses. Typical for T1 workflows (drafting, notes).
          </p>
        </SubSection>

        <SubSection title="B · Role reshaped">
          <p>
            Same role, same accountability, different day-to-day activity.
            Example: attorney now starts from AI-generated redline, not blank
            page. Capability requirements shift toward judgment and away from
            first-pass throughput.
          </p>
        </SubSection>

        <SubSection title="C · Role elevated">
          <p>
            Role moves off the per-case hot path and onto aggregate oversight.
            Typical for T3 workflows. Measurement shifts from case throughput
            to system health — misroute rate, override rate, drift detection.
          </p>
        </SubSection>

        <SubSection title="D · Role retired">
          <p>
            Role no longer needed in its previous form. Rare and sensitive.
            Explicitly named in the SOP. HR (Artifact 5.3) owns the redeployment
            path — do not let SOP updates be the first place impacted employees
            learn about the change.
          </p>
        </SubSection>

        <GuidanceCallout>
          Every changed SOP must name the pattern (A / B / C / D) per role.
          Pattern D triggers a mandatory HR and Comms review before the SOP
          update is released.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="06"
        title="Governance & Release"
        intent="SOP updates are a release event. Treating them that way is what prevents documentation drift from becoming audit exposure."
      >
        <SubSection title="Release bundle">
          <p>An SOP update ships as a bundle including:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Updated SOP document (this overlay).</li>
            <li>Updated RACI entries (1.2) if role changes occurred.</li>
            <li>Updated training materials (5.3) for affected roles.</li>
            <li>Release note published to the affected function.</li>
            <li>Effective date with a minimum 5-business-day notice for non-emergency changes.</li>
          </ul>
        </SubSection>

        <SubSection title="Approvers">
          <ul className="list-disc space-y-1 pl-5">
            <li>Workflow Owner (Artifact 4.1).</li>
            <li>Function Head affected by the SOP.</li>
            <li>AI Governance Lead.</li>
            <li>HR + Comms if any role pattern is D, or pattern C for more than 5 FTE.</li>
          </ul>
        </SubSection>

        <SubSection title="Audit trail">
          <p>
            Every SOP change is versioned. Effective date, approver list, and
            rationale are captured at release. Prior versions remain retrievable
            for the retention period defined in Artifact 2.1.
          </p>
        </SubSection>
      </ArtifactSection>

      <ArtifactSection
        number="07"
        title="Anti-Patterns"
        intent="Six SOP update mistakes that recur across engagements. Flag any of these and push back."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li><strong>&ldquo;Inserted by AI&rdquo; footer.</strong> A single boilerplate footer on the old SOP does not update the SOP. Every affected step must be rewritten.</li>
          <li><strong>Unnamed AI.</strong> &ldquo;AI may assist with this step&rdquo; is not a workflow reference. Every AI contribution names a WF-NN and PR-NNN.</li>
          <li><strong>Silent role elevation.</strong> Quietly moving a role off the hot path without naming the pattern, updating the RACI, or retraining the role.</li>
          <li><strong>Optimistic checkpoints.</strong> Describing a human checkpoint that nobody has time to actually perform. The SOP will be right; the practice will drift.</li>
          <li><strong>No effective date.</strong> A change that &ldquo;takes effect when approved&rdquo; is a change no one can point to in an incident review.</li>
          <li><strong>Undocumented rollback.</strong> If the AI step fails or the tool is retired, the legacy path must still be executable. If not, the SOP is single-vendor risk disguised as a process.</li>
        </ul>
      </ArtifactSection>

      <ArtifactSection
        number="08"
        title="Regulatory Mapping"
        intent="SOP coverage of AI-assisted work is a standard line-item in ISO 42001 audits and increasingly in customer security reviews."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.4 / MANAGE-1.1" },
            { name: "ISO 42001", control: "Clause 7.5 (documented info) / 8" },
            { name: "ISO 27001", control: "A.5.37 (documented procedures)" },
            { name: "SOC 2", control: "CC2.2 / CC5.3 / CC8.1" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
