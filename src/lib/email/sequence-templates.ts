/**
 * 5-Step Sequence Templates per Strategy Angle
 *
 * Voice reference: TechFides brand voice (Knowledge/Voice-and-Style/README.md in vault).
 * Initial cold-email vault templates live at Projects/drafts/2026-04-16-dfw-outreach-templates.md
 * — those define the voice the LLM must mirror: short, specific, plain-spoken, 15-minute ask.
 *
 * DFW focus (2026-04-16): Jacques based in Frisco. First 5 clients targeted in DFW metro.
 * All emails should reference local proximity where relevant (legal/medical/trades verticals).
 *
 * Each angle has 5 emails:
 * 1. Identify the Pain
 * 2. The Solution
 * 3. The Result
 * 4. The Proof
 * 5. Hard Bridge to Team
 *
 * Variables in {braces} are replaced by the LLM or enrichment data.
 *
 * LLM voice rules (enforce in every prompt):
 * - No em dashes. Use commas, semicolons, parentheses, or restructure.
 * - Banned words: delve, tapestry, pivotal, underscore, landscape, foster, crucial, enhance,
 *   leverage, seamless, robust, holistic, synergy, paradigm, realm, meticulous, journey, ecosystem.
 * - No "solutions" — say the specific thing. No "stakeholder" — name them.
 * - Short declarative sentences. Vary rhythm. Read it out loud test.
 * - Ask for 15 minutes, not 30. Low commitment drives reply rate.
 *
 * Signature + branding:
 * - NEVER add a plain-text signature block (Name, Title, Company, Email, Phone).
 * - Outlook auto-appends Jacques's branded HTML signature (logo, photo, Forbes badge, digital card).
 * - Close with "Jacques" only, no title or contact info.
 *
 * Assessment link:
 * - Offer `techfides.com/assess` as a self-serve AI Readiness Assessment in step 1 or 2.
 *   Free, 8 questions, 5 minutes, produces 0-100 score. Viral loop — shareable result.
 */

import type { StrategyAngle } from "@prisma/client";

export interface SequenceStep {
  step: number;
  label: string;
  subjectTemplate: string;
  bodyPrompt: string; // instructions for the LLM
  ctaText: string;
  ctaPath: string; // relative path on techfides.com
  delayDays: number; // days to wait before sending this step
}

export const SEQUENCE_TEMPLATES: Record<StrategyAngle, SequenceStep[]> = {
  STRATEGIC_ALIGNMENT: [
    {
      step: 1,
      label: "Identify the Pain",
      subjectTemplate: "Question about how {company} handles AI",
      bodyPrompt:
        "Write a cold email in TechFides voice — short (under 100 words), direct, plain-spoken. Open with a specific question about how their team uses AI tools. Name the real problem: client/patient data going to servers they don't control. If DFW-based, reference Frisco proximity. Ask for 15 minutes, not a longer commitment. No fluff, no LLM tells (no em dashes, no 'solutions', no 'leverage'). Sign as 'Jacques' only.",
      ctaText: "Book 15 Minutes",
      ctaPath: "/contact",
      delayDays: 0,
    },
    {
      step: 2,
      label: "The Solution",
      subjectTemplate: "The diagnostic {firstName} didn't know {company} needed",
      bodyPrompt:
        "Write a follow-up email introducing the AI 360 Assessment as a diagnostic tool that reveals misaligned IT before it becomes expensive. Reference the specific gap identified in step 1. Include a specific metric about AI pilot failure rates. Tone: authoritative, helpful. Max 150 words.",
      ctaText: "Learn About AI 360 Assessment",
      ctaPath: "/consulting/ai-readiness-360",
      delayDays: 3,
    },
    {
      step: 3,
      label: "The Result",
      subjectTemplate: "How a {vertical} firm saved $X by aligning before scaling",
      bodyPrompt:
        "Write a results-focused email showing how a company in the same vertical saved money and time by doing an AI readiness assessment before deploying AI. Use the prospect's enrichment data to make comparisons. Emphasize time-to-value and revenue growth. Max 150 words.",
      ctaText: "Calculate Your Potential Savings",
      ctaPath: "/pricing",
      delayDays: 4,
    },
    {
      step: 4,
      label: "The Proof",
      subjectTemplate: "Case study: {vertical} transformation without the chaos",
      bodyPrompt:
        "Write a proof email with a brief case study or social proof from a similar vertical. Focus on governance and alignment outcomes, not technology features. Include a specific before/after metric. Max 120 words.",
      ctaText: "Read the Full Case Study",
      ctaPath: "/solutions",
      delayDays: 5,
    },
    {
      step: 5,
      label: "Hard Bridge to Team",
      subjectTemplate: "Quick question for {firstName}",
      bodyPrompt:
        "Write the final email in TechFides voice. Under 60 words. Direct, human. Reference the previous emails briefly. Ask for 15 minutes this week or next. Specific time suggestion. No fluff, no LLM tells. Sign as 'Jacques' only.",
      ctaText: "Book 15 Minutes",
      ctaPath: "/contact",
      delayDays: 7,
    },
  ],

  COST_RECOVERY: [
    {
      step: 1,
      label: "Identify the Pain",
      subjectTemplate: "{company} is renting AI it could own",
      bodyPrompt:
        "Write a cold email in TechFides voice. Short (under 100 words), plain-spoken on money — say the actual dollar amount if enrichment gives it. Open with the cloud AI spend, then the alternative: a one-time setup on their own hardware. If DFW-based, mention we're in Frisco and can meet in person. Ask for 15 minutes. No em dashes, no 'leverage', no 'solutions'. Sign as 'Jacques' only.",
      ctaText: "Book 15 Minutes",
      ctaPath: "/contact",
      delayDays: 0,
    },
    {
      step: 2,
      label: "The Solution",
      subjectTemplate: "Own your AI forever — here's how",
      bodyPrompt:
        "Write a follow-up email introducing Private AI as an alternative to cloud subscriptions. Focus on: one-time setup, predictable monthly retainer, hardware ownership. Reference the Silver/Gold/Platinum tiers. Tone: practical, financial clarity. Max 150 words.",
      ctaText: "See Transparent Pricing",
      ctaPath: "/pricing",
      delayDays: 3,
    },
    {
      step: 3,
      label: "The Result",
      subjectTemplate: "Get {hours} hours back per week at {company}",
      bodyPrompt:
        "Write a results email about time savings and cost recovery. Use the prospect's estimated monthly cloud spend to calculate 36-month savings. Emphasize getting time back for the team. Reference the break-even timeline. Max 150 words.",
      ctaText: "See Your 36-Month Savings",
      ctaPath: "/pricing",
      delayDays: 4,
    },
    {
      step: 4,
      label: "The Proof",
      subjectTemplate: "The math: {company} cloud vs local AI",
      bodyPrompt:
        "Write a proof email with a specific cost comparison. Show the ROI calculation: current cloud spend x 36 months vs TechFides setup + retainer x 36. Include the break-even month. Make it scannable with bullet points. Max 120 words.",
      ctaText: "Run Your Own ROI Calculator",
      ctaPath: "/pricing",
      delayDays: 5,
    },
    {
      step: 5,
      label: "Hard Bridge to Team",
      subjectTemplate: "15 minutes to show {firstName} the exact savings",
      bodyPrompt:
        "Write a direct, short final email (max 80 words) offering a 15-minute cost-benefit demo. Be human. Mention that the demo is free and no obligation. Include a specific time suggestion.",
      ctaText: "Book a Free Cost-Benefit Demo",
      ctaPath: "/contact",
      delayDays: 7,
    },
  ],

  AEGIS_GOVERNANCE: [
    {
      step: 1,
      label: "Identify the Pain",
      subjectTemplate: "Legacy apps are fragmenting {company}'s operations",
      bodyPrompt:
        "Write a pivot email acknowledging that the prospect may not be ready for AI, but their bigger problem is legacy app fragmentation. Reference detected legacy tech from enrichment. Position AEGIS as governance-first, AI-second. Tone: empathetic, strategic. Max 150 words.",
      ctaText: "See How AEGIS Brings Order",
      ctaPath: "/consulting/aegis",
      delayDays: 0,
    },
    {
      step: 2,
      label: "The Solution",
      subjectTemplate: "AEGIS sits on top — no replacement needed",
      bodyPrompt:
        "Write a follow-up explaining that AEGIS doesn't replace their existing stack but sits on top as a governance layer. Emphasize: no rip-and-replace, no disruption, just order from chaos. Max 150 words.",
      ctaText: "Explore AEGIS Architecture",
      ctaPath: "/consulting/aegis",
      delayDays: 3,
    },
    {
      step: 3,
      label: "The Result",
      subjectTemplate: "Governance first, AI second — the order that works",
      bodyPrompt:
        "Write a results email about how governance-first approach leads to better AI outcomes. Reference the 70% AI pilot failure stat. Show how AEGIS prevents this. Max 150 words.",
      ctaText: "Read the AEGIS Playbook",
      ctaPath: "/consulting/aegis",
      delayDays: 4,
    },
    {
      step: 4,
      label: "The Proof",
      subjectTemplate: "How {vertical} firms tamed legacy chaos with AEGIS",
      bodyPrompt:
        "Write a proof email with a case study of governance transformation. Focus on reduced complexity, faster decision-making, and readiness for future AI adoption. Max 120 words.",
      ctaText: "See AEGIS in Action",
      ctaPath: "/consulting/aegis",
      delayDays: 5,
    },
    {
      step: 5,
      label: "Hard Bridge to Team",
      subjectTemplate: "Executive briefing: bringing order to {company}'s legacy chaos",
      bodyPrompt:
        "Write a direct, short final email (max 80 words) inviting to an executive briefing on AEGIS governance. Be strategic, not salesy. This is C-suite language.",
      ctaText: "Request Executive Briefing",
      ctaPath: "/contact",
      delayDays: 7,
    },
  ],

  SUBSCRIPTION_REDUCTION: [
    {
      step: 1,
      label: "Identify the Pain",
      subjectTemplate: "{company} is spending ${saasTotal} across {toolCount} tools monthly",
      bodyPrompt:
        "Write a pivot email with specific numbers: how many SaaS tools were detected in their stack and estimated monthly cost. Position TechFides as consolidation, not just AI. Tone: practical, empathetic. Max 150 words.",
      ctaText: "See What You Could Consolidate",
      ctaPath: "/pricing",
      delayDays: 0,
    },
    {
      step: 2,
      label: "The Solution",
      subjectTemplate: "Replace {topTools} with one system you own",
      bodyPrompt:
        "Write a follow-up naming their specific high-cost tools (from enrichment) and showing how a local AI system replaces them. Focus on consolidation and ownership. Max 150 words.",
      ctaText: "Compare Tool Costs",
      ctaPath: "/pricing",
      delayDays: 3,
    },
    {
      step: 3,
      label: "The Result",
      subjectTemplate: "Stop renting, start owning — the math for {company}",
      bodyPrompt:
        "Write a results email with balance-sheet language. Show how subscription costs are liabilities but owned infrastructure is an asset. Calculate total annual SaaS spend vs one-time TechFides investment. Max 150 words.",
      ctaText: "Run Your Savings Calculator",
      ctaPath: "/pricing",
      delayDays: 4,
    },
    {
      step: 4,
      label: "The Proof",
      subjectTemplate: "How a {vertical} firm cut tool spend by 60%",
      bodyPrompt:
        "Write a proof email with a specific tool replacement breakdown. Show before (5+ tools, $X/mo) vs after (TechFides local, $Y/mo). Make it visual with bullet points. Max 120 words.",
      ctaText: "See the Full Breakdown",
      ctaPath: "/pricing",
      delayDays: 5,
    },
    {
      step: 5,
      label: "Hard Bridge to Team",
      subjectTemplate: "Free cost-benefit demo — 15 minutes, no obligation",
      bodyPrompt:
        "Write a direct, short final email (max 80 words) offering a free, no-obligation cost-benefit demo. Be human and friendly. Include a specific time suggestion.",
      ctaText: "Book Your Free Demo",
      ctaPath: "/contact",
      delayDays: 7,
    },
  ],
};
