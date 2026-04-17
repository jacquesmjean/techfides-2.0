"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type RoleBlock = {
  role: string;
  focus: string;
  questions: string[];
};

const roleBlocks: RoleBlock[] = [
  {
    role: "Chief Executive Officer",
    focus: "Strategic intent, appetite for AI-driven change, board narrative",
    questions: [
      "How would you describe the company's AI posture today in one sentence, and how do you want it described in twelve months?",
      "What board-level questions about AI are you currently unable to answer with confidence?",
      "What is the worst outcome you are trying to avoid by adopting AI responsibly?",
      "Which peer or competitor's AI posture concerns you most, and why?",
      "How much organizational disruption is acceptable to achieve AI leverage in the next two quarters?",
    ],
  },
  {
    role: "Chief Operating Officer",
    focus: "Operational leverage, workflow redesign, cross-functional orchestration",
    questions: [
      "Which three workflows, if augmented with AI, would generate the highest operational leverage in the next ninety days?",
      "Where in the business are AI tools already in use — sanctioned or unsanctioned — and who owns them?",
      "What decisions today are bottlenecked by data access, approvals, or manual review?",
      "How do you measure productivity today, and which of those measures would move first if AI adoption succeeded?",
      "What is the single biggest barrier preventing you from deploying AI across operations right now?",
    ],
  },
  {
    role: "Chief Information Officer / CTO",
    focus: "Platform inventory, integration posture, technical governance",
    questions: [
      "What is your current AI tooling inventory, including enterprise licenses, department subscriptions, and individual-paid tools?",
      "Which AI systems currently touch customer data, employee data, or proprietary code?",
      "What is your integration posture — are AI tools federated into identity and access management, or standalone?",
      "Who owns AI tool selection and consolidation today, and what authority do they have?",
      "What technical debt would a governance operating model expose that you would rather not surface?",
    ],
  },
  {
    role: "Chief Information Security Officer",
    focus: "Risk posture, data protection, incident response readiness",
    questions: [
      "How are AI-specific risks currently represented in the enterprise risk register?",
      "What incident response playbooks exist for AI-driven incidents — data leakage via prompts, hallucinated outputs relied upon, model provider outages?",
      "Which AI tools are currently permitted to process regulated data categories (PHI, PII, PCI, privileged material)?",
      "What logging, audit trail, and retention exists across sanctioned AI systems today?",
      "What would a regulator, insurer, or acquirer most likely flag in an AI controls review today?",
    ],
  },
  {
    role: "Chief Financial Officer",
    focus: "Spend discipline, ROI measurement, procurement governance",
    questions: [
      "What is your total committed and discretionary AI spend this fiscal year across the organization?",
      "Is AI spend tracked at a cost-center level, and can you produce a unit-economics view by workflow or business unit?",
      "What would you need to see to approve doubling AI investment in the next twelve months?",
      "How are AI vendors evaluated against procurement and finance controls today?",
      "What is the ROI threshold a workflow automation needs to clear to justify continued investment?",
    ],
  },
  {
    role: "HR / Workforce Leader",
    focus: "Adoption, change management, role redesign",
    questions: [
      "How is AI literacy distributed across your workforce today — who are the early adopters, who is resistant, and why?",
      "Which roles will change materially in the next twelve months as AI adoption scales?",
      "What training, enablement, or certification is currently offered for AI-assisted work?",
      "How does your performance management system handle AI-assisted work product — attribution, quality, accountability?",
      "What employee relations or cultural risks do you anticipate from expanded AI adoption?",
    ],
  },
  {
    role: "Legal / Compliance",
    focus: "Regulatory exposure, contractual risk, policy enforcement",
    questions: [
      "Which regulatory frameworks does your AI adoption intersect — NIST AI RMF, EU AI Act, HIPAA, GLBA, state privacy laws, sector-specific regulation?",
      "What AI-specific language exists in your customer, vendor, and employment contracts today?",
      "Who has authority to approve use of generative AI tools on proprietary or client-confidential material?",
      "What records retention, discovery, and privilege considerations apply to AI-generated work product?",
      "What is your current position on AI-generated IP, model training on proprietary data, and output ownership?",
    ],
  },
  {
    role: "Business Unit Leader",
    focus: "Ground-truth usage, unmet need, friction",
    questions: [
      "Describe a concrete task your team does every week where AI would be obviously useful, but isn't being applied today — and why not.",
      "What AI tools have your team members asked for that were denied, delayed, or never answered?",
      "Where are people using personal accounts (ChatGPT, Claude, etc.) to do company work — and what data is flowing through those tools?",
      "If I could hand you one AI capability that was fully governed and safe to use tomorrow, what would it be?",
      "What would cause your team to refuse to adopt a new AI tool, even if leadership approved it?",
    ],
  },
];

export default function StakeholderInterviewGuidePage() {
  return (
    <ArtifactShell
      module="Diagnostic"
      moduleAccent="text-accent-green"
      artifactNumber="D.1"
      title="Stakeholder Interview Guide"
      subtitle="Standardized discovery script for the AEGIS Diagnostic. Produces the primary input dataset for the 6-Layer Gap Assessment and the 90-Day Governance Roadmap."
      version="v1.0"
      classification="CONFIDENTIAL"
    >
      <ArtifactSection
        number="1"
        title="Purpose and Scope"
        intent="Orient the interviewer. Establish what this guide does, what it does not do, and how its output feeds the rest of the engagement."
      >
        <p className="text-slate-300">
          This guide structures 60- to 75-minute executive interviews across
          the eight stakeholder archetypes whose input is required to produce a
          defensible AEGIS Diagnostic. The engagement is scoped to complete all
          interviews within the first ten business days of the Diagnostic.
        </p>
        <SubSection title="What this guide produces">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Stakeholder-level transcripts (recorded with consent or
              consultant notes) that inform the 6-Layer Gap Assessment.
            </li>
            <li>
              A decision-rights map showing who currently owns what across AI
              adoption, risk, and investment.
            </li>
            <li>
              A red-flag register of unspoken or under-managed risks surfaced
              through probing.
            </li>
            <li>
              Direct quotes for the Executive Summary deck — used sparingly and
              always with attribution approval.
            </li>
          </ul>
        </SubSection>
        <SubSection title="What this guide does not do">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Replace the Shadow AI Scan (see Artifact{" "}
              <Placeholder>D.2 link</Placeholder>) — interviews surface
              self-reported tools; the scan surfaces actual usage.
            </li>
            <li>
              Produce the Gap Assessment scores directly — scoring happens in
              consultant synthesis after all interviews complete.
            </li>
            <li>
              Substitute for technical review of identity, logging, or data
              controls — those belong to the AEGIS Shield module.
            </li>
          </ul>
        </SubSection>
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.1" },
            { name: "NIST AI RMF", control: "MAP-2.1" },
            { name: "SOC 2", control: "CC1.3" },
            { name: "ISO 42001", control: "5.2" },
          ]}
        />
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Interview Methodology"
        intent="Every interview follows the same three-act structure. Deviate only when the stakeholder is time-constrained; in that case, drop Act 3, never Act 2."
      >
        <SubSection title="Act 1 — Framing (5 minutes)">
          <p>
            Open with the engagement framing, not with questions. Confirm
            recording posture, confidentiality, and that this interview
            contributes to a steering committee readout — not a public
            document. Anchor the conversation in business outcomes, never in
            technology.
          </p>
          <p className="rounded bg-navy-900/60 p-3 font-mono text-xs text-slate-400">
            &quot;We&apos;re here to build a defensible picture of where{" "}
            <Placeholder>client</Placeholder> stands on AI — what&apos;s
            working, what&apos;s exposed, and what&apos;s next. This
            isn&apos;t a tools audit. We want your view on where AI creates
            leverage, where it creates risk, and what a governed path forward
            looks like from your seat.&quot;
          </p>
        </SubSection>
        <SubSection title="Act 2 — Structured questions (35 minutes)">
          <p>
            Ask every core question from the relevant role block in Section 4.
            Adapt language, never content. If a stakeholder pivots to a
            tangent, note it, return to the script.
          </p>
        </SubSection>
        <SubSection title="Act 3 — Probes and quiet space (15 minutes)">
          <p>
            Reserve the final third for follow-up probes (Section 5) and
            deliberate silence. The most important admissions come after the
            interviewee believes the interview is over — close your notebook
            on camera, then ask the final probes.
          </p>
        </SubSection>
        <GuidanceCallout>
          Do not run two senior stakeholders in the same room unless the
          engagement sponsor insists. Misalignment between the CEO/COO and the
          CIO/CISO is a signal you want to capture; joint interviews suppress
          it.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Coverage Matrix"
        intent="Confirm that every one of the six AEGIS layers is touched by at least two stakeholder types. Leave no layer underrepresented in the primary interview set."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-4">Layer</th>
                <th className="py-2 pr-4">Primary Stakeholder</th>
                <th className="py-2 pr-4">Secondary Stakeholder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 pr-4 font-semibold text-electric-400">
                  Governance
                </td>
                <td className="py-2 pr-4">CEO</td>
                <td className="py-2 pr-4">Legal / Compliance</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold text-purple-400">
                  Security, Trust & Resilience
                </td>
                <td className="py-2 pr-4">CISO</td>
                <td className="py-2 pr-4">CIO / CTO</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold text-indigo-400">
                  Intelligence
                </td>
                <td className="py-2 pr-4">CIO / CTO</td>
                <td className="py-2 pr-4">CFO</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold text-cyan-400">
                  Execution
                </td>
                <td className="py-2 pr-4">COO</td>
                <td className="py-2 pr-4">Business Unit Leader</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold text-accent-green">
                  Operations
                </td>
                <td className="py-2 pr-4">COO</td>
                <td className="py-2 pr-4">HR / Workforce Leader</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold text-accent-amber">
                  Leadership
                </td>
                <td className="py-2 pr-4">CEO</td>
                <td className="py-2 pr-4">CFO</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Role-by-Role Question Sets"
        intent="Ask every core question in the relevant role block. Questions are sequenced from strategic to specific; do not reorder."
        pageBreak
      >
        <div className="space-y-10">
          {roleBlocks.map((block) => (
            <div
              key={block.role}
              className="border-l-2 border-slate-700 pl-6"
            >
              <h3 className="text-xl font-semibold text-slate-100">
                {block.role}
              </h3>
              <p className="mt-1 text-sm italic text-slate-400">
                Focus — {block.focus}
              </p>
              <ol className="mt-4 space-y-3 text-sm text-slate-300">
                {block.questions.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-xs text-slate-500">
                      Q{i + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Follow-Up Probes"
        intent="Use these when a stakeholder gives a short, evasive, or unusually confident answer. Probes are always open-ended."
      >
        <ul className="space-y-2 text-sm text-slate-300">
          <li>
            <span className="font-semibold text-slate-100">When pressed:</span>{" "}
            &quot;Walk me through the last time that actually happened.&quot;
          </li>
          <li>
            <span className="font-semibold text-slate-100">When confident:</span>{" "}
            &quot;What would prove you wrong?&quot;
          </li>
          <li>
            <span className="font-semibold text-slate-100">When evasive:</span>{" "}
            &quot;If a board member asked you this tomorrow, how would you
            answer?&quot;
          </li>
          <li>
            <span className="font-semibold text-slate-100">When generic:</span>{" "}
            &quot;Who specifically? When specifically? What did it cost?&quot;
          </li>
          <li>
            <span className="font-semibold text-slate-100">
              When defensive:
            </span>{" "}
            &quot;Setting aside how it got here — where are we today?&quot;
          </li>
        </ul>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Red Flags to Log"
        intent="Some statements are signals, not information. Capture them verbatim in the red-flag register."
      >
        <ul className="ml-5 list-disc space-y-2 text-sm text-slate-300">
          <li>
            &quot;We have a policy, but I&apos;m not sure anyone reads it.&quot;
          </li>
          <li>&quot;That&apos;s a great question for legal.&quot;</li>
          <li>&quot;I assume IT handles that.&quot;</li>
          <li>
            &quot;We don&apos;t use ChatGPT for anything sensitive&quot; —
            without describing how that&apos;s enforced.
          </li>
          <li>&quot;We&apos;ll figure it out when we get there.&quot;</li>
          <li>
            Any mention of an AI-related near-miss, breach, or client complaint
            that has not been formally documented.
          </li>
          <li>
            Unexplained variance between what the CEO says the company does
            with AI and what a business unit leader says happens in practice.
          </li>
        </ul>
        <GuidanceCallout>
          A red flag alone is not a finding. Triangulate every flag with a
          second stakeholder before it enters the Gap Assessment. Single-source
          red flags go in the appendix, not the executive summary.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Synthesis Template"
        intent="Convert interview output into structured input for the Gap Assessment. Complete one entry per stakeholder immediately after the interview, before memory decays."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-4">Field</th>
                <th className="py-2 pr-4">Content</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 pr-4 font-semibold">Stakeholder</td>
                <td className="py-2 pr-4">
                  <Placeholder>Name, role, tenure</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Date and format</td>
                <td className="py-2 pr-4">
                  <Placeholder>Date, in-person / remote, duration</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Primary layer</td>
                <td className="py-2 pr-4">
                  <Placeholder>Which AEGIS layer this stakeholder informs most</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Three strongest signals</td>
                <td className="py-2 pr-4">
                  <Placeholder>Bullet points, verbatim where possible</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Red flags logged</td>
                <td className="py-2 pr-4">
                  <Placeholder>Verbatim quote + layer mapping</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Quotable moments</td>
                <td className="py-2 pr-4">
                  <Placeholder>Quotes cleared for executive summary use</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Follow-ups needed</td>
                <td className="py-2 pr-4">
                  <Placeholder>Data requests, artifacts to collect, second interviews</Placeholder>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="8"
        title="Logistics and Tracking"
        intent="Keep the engagement on the 10-business-day clock. Interview slippage is the most common cause of Diagnostic timeline overruns."
      >
        <SubSection title="Scheduling">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Target all eight stakeholder interviews within the first 10
              business days.
            </li>
            <li>
              Book CEO and board-facing interviews first; everything else
              arranges around their availability.
            </li>
            <li>
              Prefer 60 minutes with a hard stop at 75. Over-runs compound
              across the week.
            </li>
            <li>
              Back-to-back interviews are fine; interviews across different
              time zones on the same day are not.
            </li>
          </ul>
        </SubSection>
        <SubSection title="Recording posture">
          <p>
            Default to consented recording for transcription. If declined,
            assign a note-taker separate from the lead interviewer. Never rely
            on memory alone.
          </p>
        </SubSection>
        <SubSection title="Tracking sheet">
          <p>
            Maintain a single tracking sheet in the engagement workspace with
            stakeholder, scheduled date, completed date, synthesis status, and
            follow-up status. This sheet is reviewed in the daily engagement
            stand-up.
          </p>
        </SubSection>
      </ArtifactSection>
    </ArtifactShell>
  );
}
