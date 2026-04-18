"use client";

import { ArtifactShell } from "@/components/aegis/ArtifactShell";
import {
  ArtifactSection,
  SubSection,
  GuidanceCallout,
  Placeholder,
} from "@/components/aegis/ArtifactSection";
import { RegulatoryTags } from "@/components/aegis/RegulatoryTags";

type AdoptionStage = "Awareness" | "Enablement" | "Activation" | "Embed" | "Scale";

const stageStyle: Record<AdoptionStage, string> = {
  Awareness: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  Enablement: "bg-electric-500/20 text-electric-300 border-electric-500/40",
  Activation: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  Embed: "bg-accent-green/20 text-accent-green border-accent-green/40",
  Scale: "bg-purple-500/20 text-purple-300 border-purple-500/40",
};

export default function AdoptionPlaybookPage() {
  return (
    <ArtifactShell
      module="Module 5 · Cadence"
      moduleAccent="text-accent-green"
      artifactNumber="5.2"
      title="Adoption Playbook"
      subtitle={"Move approved workflows from pilot to durable, measured usage without stalling in \u201ctraining complete, no one uses it.\u201d"}
      classification="CONFIDENTIAL"
      version="v1.0"
    >
      <ArtifactSection number="1" title="Purpose">
        <p>
          The Adoption Playbook is the operational plan for turning a
          governed workflow (per Artifact 4.1) into measured daily practice.
          It defines the stages, owners, communications, enablement assets,
          success thresholds, and drop-off triggers that move a workflow from
          <em> approved</em> to <em>embedded</em>. Without a playbook,
          workflows launch, training is delivered, and usage quietly flatlines
          within 6 weeks — a pattern we have seen in every AI program that
          skipped this step.
        </p>
        <GuidanceCallout>
          Adoption is not a training problem. It is a design-of-work problem.
          If a workflow does not win the first three times a user runs it, no
          amount of training will save it. Instrument early, tune fast.
        </GuidanceCallout>
      </ArtifactSection>

      <ArtifactSection
        number="2"
        title="Five Stages of Adoption"
        intent="A named stage lets every stakeholder speak the same language about where each workflow is and what they are waiting for."
      >
        <div className="space-y-3">
          {(
            [
              {
                stage: "Awareness" as AdoptionStage,
                duration: "Week -2 to 0",
                outcome: "Target users know the workflow is coming, why it exists, and what changes for them.",
                owner: "AI Governance Lead + Function Head",
                exitCriterion: "≥90% of in-scope users acknowledge pre-launch comms.",
              },
              {
                stage: "Enablement" as AdoptionStage,
                duration: "Week 0 to 2",
                outcome: "Users complete role-based training (per Artifact 5.3), pass the competency check, and have access in their tools.",
                owner: "AI Governance Lead + L&D",
                exitCriterion: "100% of in-scope users trained + credentialed; SSO and tool access confirmed.",
              },
              {
                stage: "Activation" as AdoptionStage,
                duration: "Week 2 to 6",
                outcome: "Users run the workflow at least 3 times with observable outcomes. Office hours + shadow support staffed.",
                owner: "Function Head + AEGIS Consultant",
                exitCriterion: "≥70% of in-scope users have 3+ successful runs logged.",
              },
              {
                stage: "Embed" as AdoptionStage,
                duration: "Week 6 to 12",
                outcome: "Workflow is referenced in SOPs (per Artifact 4.3), used without prompting, and measured against baseline.",
                owner: "Function Head",
                exitCriterion: "Median cycle-time improvement tracked for 4 consecutive weeks. Usage ≥ 80% of expected volume.",
              },
              {
                stage: "Scale" as AdoptionStage,
                duration: "Week 12+",
                outcome: "Workflow expands to adjacent teams, informs net-new workflows, feeds into the 12-Month Roadmap (Artifact 6.3).",
                owner: "Executive Sponsor",
                exitCriterion: "Scaled to ≥1 adjacent function OR decision to hold/retire documented at QGR.",
              },
            ]
          ).map((s) => (
            <div
              key={s.stage}
              className="rounded-xl border border-navy-700 bg-navy-900/60 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${stageStyle[s.stage]}`}
                >
                  {s.stage}
                </span>
                <span className="text-xs uppercase tracking-wide text-navy-300">
                  {s.duration}
                </span>
              </div>
              <p className="mt-3 text-sm text-navy-100">
                <span className="font-semibold text-white">Outcome:</span>{" "}
                {s.outcome}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Owner:</span>{" "}
                {s.owner}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Exit:</span>{" "}
                {s.exitCriterion}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="3"
        title="Per-Workflow Adoption Plan"
        intent="Every workflow launched under Module 4 gets its own instance of this plan. One page, one owner, one set of metrics."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Field</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2">Guidance</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["Workflow ID", <Placeholder key="wf">WF-00</Placeholder>, "Match the ID assigned in Artifact 4.1."],
                ["Workflow Name", <Placeholder key="name">[Workflow name]</Placeholder>, "Human-readable, matches SOP overlay in 4.3."],
                ["Function / Team", <Placeholder key="fn">[Function]</Placeholder>, "Primary team running the workflow."],
                ["In-Scope User Count", <Placeholder key="users">[N]</Placeholder>, "Total users expected to run this workflow at steady state."],
                ["Adoption Lead", <Placeholder key="lead">[Name]</Placeholder>, "Accountable for moving the workflow through all five stages."],
                ["Baseline Metric", <Placeholder key="base">[Metric + value]</Placeholder>, "Cycle time, error rate, throughput, etc. measured before launch."],
                ["Target Metric (Week 12)", <Placeholder key="target">[Metric + value]</Placeholder>, "What \u201cworking\u201d looks like at end of Embed."],
                ["Launch Date", <Placeholder key="launch">YYYY-MM-DD</Placeholder>, "Day 0. Awareness starts 2 weeks prior."],
                ["Current Stage", <Placeholder key="stage">[Stage]</Placeholder>, "Updated weekly by Adoption Lead."],
                ["Exit Criteria Met", <Placeholder key="exit">Yes / No</Placeholder>, "Current stage exit criterion — binary check."],
                ["Drop-off Triggers", <Placeholder key="drop">[Conditions]</Placeholder>, "If X happens, escalate to Function Head + AI Governance Lead within 24h."],
                ["Retire / Hold / Scale Decision", <Placeholder key="rhs">[Decision]</Placeholder>, "Made at QGR based on trajectory. Never left undecided past Week 12."],
              ].map(([field, value, guidance], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{field}</td>
                  <td className="py-3 pr-4">{value}</td>
                  <td className="py-3 text-navy-200">{guidance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="4"
        title="Communications Cadence"
        intent="Adoption fails silently when users are not hearing from leadership. This cadence is the minimum viable drumbeat — add channels, do not subtract."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wide text-navy-300">
                <th className="py-2 pr-4">Moment</th>
                <th className="py-2 pr-4">Audience</th>
                <th className="py-2 pr-4">Channel</th>
                <th className="py-2 pr-4">Sender</th>
                <th className="py-2">Message Core</th>
              </tr>
            </thead>
            <tbody className="text-navy-100">
              {[
                ["T-14 days", "All in-scope users", "Email + team meeting slot", "Executive Sponsor", "Why this workflow, what changes, what does not change, what is expected of you."],
                ["T-7 days", "All in-scope users", "Tool-native banner + Slack/Teams", "AI Governance Lead", "Training invitation, access date, office-hours schedule."],
                ["Launch Day (T+0)", "All in-scope users + leadership", "Short video from Sponsor + live demo", "Executive Sponsor + Function Head", "It is live. Here is the first output. Here is how to ask for help."],
                ["Week 1", "In-scope users", "Slack/Teams digest", "Adoption Lead", "3 usage tips, 2 wins, 1 known issue + fix."],
                ["Week 2", "In-scope users + managers", "Manager office hours", "Function Head", "Live walkthrough of real outputs. Address objections directly."],
                ["Week 4", "All staff", "Company all-hands slot", "Executive Sponsor", "Adoption numbers + one customer-visible result."],
                ["Week 8 + Week 12", "In-scope users", "Adoption Lead 1:1s for stragglers", "Adoption Lead", "Targeted help for users below 2 runs/week."],
                ["QGR", "Exec + Governance Board", "Standing review per Artifact 5.1", "AI Governance Lead", "Stage, metrics, decision."],
              ].map(([moment, audience, channel, sender, message], i) => (
                <tr key={i} className="border-b border-navy-800 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{moment}</td>
                  <td className="py-3 pr-4 text-navy-200">{audience}</td>
                  <td className="py-3 pr-4 text-navy-200">{channel}</td>
                  <td className="py-3 pr-4 text-navy-200">{sender}</td>
                  <td className="py-3 text-navy-100">{message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="5"
        title="Enablement Assets"
        intent="The assets below are required before Awareness opens. Missing assets are a launch-blocker, not a nice-to-have."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              name: "1-Page Workflow Brief",
              owner: "Adoption Lead",
              format: "PDF",
              contents: "Before/After picture of the work, who runs it, what decisions they still make, links to SOP overlay.",
            },
            {
              name: "3-Minute Demo Video",
              owner: "Adoption Lead + Subject-Matter User",
              format: "MP4 / Loom",
              contents: "Real screen-recording of a successful run. No marketing gloss. Captions required.",
            },
            {
              name: "Role-Based Training Module",
              owner: "L&D + AI Governance Lead",
              format: "LMS course",
              contents: "Per Artifact 5.3. Includes competency check with pass threshold.",
            },
            {
              name: "Quick-Reference Card",
              owner: "Adoption Lead",
              format: "PDF, 1 page both sides",
              contents: "Inputs, outputs, caveats, escalation path, the three most common failure modes.",
            },
            {
              name: "Office-Hours Schedule",
              owner: "Adoption Lead",
              format: "Calendar invite",
              contents: "2× 30-min slots / week for first 6 weeks. Drops to 1× / week in Embed.",
            },
            {
              name: "Drop-Off Playbook",
              owner: "AI Governance Lead",
              format: "Internal doc",
              contents: "If usage falls below threshold, what we do in week 1, week 2, week 4. Pre-decided.",
            },
            {
              name: "Success Story Template",
              owner: "Adoption Lead",
              format: "Slide + Slack post",
              contents: "Plug-and-play format to capture and broadcast wins within 24h of the moment they happen.",
            },
            {
              name: "Feedback Loop Channel",
              owner: "Adoption Lead",
              format: "Slack/Teams channel + form",
              contents: "Named channel per workflow, monitored daily, response SLA published."
            },
          ].map((a) => (
            <div
              key={a.name}
              className="rounded-xl border border-navy-700 bg-navy-900/60 p-4"
            >
              <p className="text-sm font-semibold text-white">{a.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-navy-300">
                {a.owner} · {a.format}
              </p>
              <p className="mt-2 text-sm text-navy-100">{a.contents}</p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="6"
        title="Adoption Metrics"
        intent="Four metrics. Reviewed weekly during Activation + Embed, monthly at Scale."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              metric: "Reach",
              definition: "Share of in-scope users who have run the workflow ≥1 time.",
              target: "≥95% by end of Activation.",
              watchFor: "Reach stalls below 70% → enablement gap or tool-access issue.",
            },
            {
              metric: "Frequency",
              definition: "Median runs per active user per week.",
              target: "Meets or exceeds the volume assumed in the Value case (Artifact 3.3).",
              watchFor: "High reach but low frequency → workflow is not winning on the job.",
            },
            {
              metric: "Outcome",
              definition: "Baseline-to-current delta on the target metric (cycle time, error rate, throughput, etc.).",
              target: "Per-workflow target set in Section 3 above.",
              watchFor: "No outcome movement by Week 8 → rework workflow design, do not just retrain users.",
            },
            {
              metric: "Sentiment",
              definition: "User Net-Promoter-style score + two open-ended prompts, sampled monthly.",
              target: "Positive net sentiment by end of Embed.",
              watchFor: "Negative sentiment alongside rising usage = mandated tool. Address trust, not just throughput.",
            },
          ].map((m) => (
            <div
              key={m.metric}
              className="rounded-xl border border-electric-500/30 bg-navy-900/60 p-5"
            >
              <p className="text-sm font-semibold text-electric-300">{m.metric}</p>
              <p className="mt-2 text-sm text-navy-100">
                <span className="font-semibold text-white">Definition:</span>{" "}
                {m.definition}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Target:</span>{" "}
                {m.target}
              </p>
              <p className="mt-1 text-sm text-navy-200">
                <span className="font-semibold text-navy-100">Watch for:</span>{" "}
                {m.watchFor}
              </p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="7"
        title="Drop-Off Response Protocol"
        intent="Pre-decided moves. When adoption slides, the plan runs itself — no waiting for the next steering committee."
      >
        <div className="space-y-3">
          {[
            {
              trigger: "Reach <70% by end of Week 2",
              response: "Adoption Lead + Function Head meet within 48h. Diagnose: access, training, or clarity. Re-run enablement for the affected cohort within 5 business days.",
            },
            {
              trigger: "Frequency drops >30% week-over-week after Week 6",
              response: "Adoption Lead surveys 5 active + 5 inactive users within 1 week. Findings presented at next QGR with a Hold / Rework / Retire recommendation.",
            },
            {
              trigger: "Outcome gap >50% vs target at Week 8",
              response: "Workflow owner (per 4.1) presents root-cause at QGR. Default posture is rework the workflow, not the training. 30-day improvement window.",
            },
            {
              trigger: "Sentiment net-negative at Week 4",
              response: "Executive Sponsor runs a listening session within 10 business days. Communications re-issued addressing named concerns.",
            },
            {
              trigger: "Incident tied to this workflow",
              response: "Invoke AI Incident Runbook (Artifact 2.6). Adoption pauses until incident is closed. No exceptions.",
            },
          ].map((d) => (
            <div
              key={d.trigger}
              className="rounded-xl border border-rose-500/30 bg-navy-900/60 p-4"
            >
              <p className="text-sm font-semibold text-rose-300">{d.trigger}</p>
              <p className="mt-2 text-sm text-navy-100">{d.response}</p>
            </div>
          ))}
        </div>
      </ArtifactSection>

      <ArtifactSection
        number="8"
        title="Regulatory & Framework Mapping"
        intent="Adoption is where governance becomes observable behavior. These frameworks all expect evidence that controls are used, not just documented."
      >
        <RegulatoryTags
          frameworks={[
            { name: "NIST AI RMF", control: "GOVERN-1.4, MANAGE-4.1" },
            { name: "ISO 42001", control: "Cl. 7.2, 7.3, 9.1" },
            { name: "ISO 27001", control: "A.6.3, A.7.2.2" },
            { name: "SOC 2", control: "CC1.4, CC2.2, CC5.3" },
            { name: "EU AI Act", control: "Art. 14, 17" },
          ]}
        />
      </ArtifactSection>
    </ArtifactShell>
  );
}
