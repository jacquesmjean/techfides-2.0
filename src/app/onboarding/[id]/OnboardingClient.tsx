"use client";

import { useState } from "react";
import Link from "next/link";
import { StripePaymentForm } from "@/components/payments/StripePaymentForm";

/* ─── Types ─── */
interface SignatureData {
  name: string;
  title: string;
  company: string;
  date: string;
  agreed: boolean;
}

interface FeedbackData {
  rating: number;
  testimonial: string;
  allowPublish: boolean;
  allowLogo: boolean;
  allowSocial: boolean;
  allowVideo: boolean;
  allowPhotos: boolean;
  allowCaseStudy: boolean;
}

interface BillingInfo {
  contactName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  poNumber: string;
  preferredMethod: "wire" | "check" | "ach" | "";
}

type PaymentMethod = "stripe" | "invoice";

/* ─── Access Gate ─── */
function AccessGate({
  onAccess,
}: {
  onAccess: (referralCode?: string) => void;
}) {
  const [code, setCode] = useState("");
  const [referral, setReferral] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, validate against your backend
    if (code.trim().length >= 4) {
      onAccess(referral.trim() || undefined);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <img
            src="/images/techfides-logo-white.png"
            alt="TechFides"
            className="mx-auto h-10 w-auto sm:h-12"
          />
          <h1 className="mt-6 text-xl font-bold sm:mt-8 sm:text-2xl">
            Client Onboarding Portal
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your access code to begin the onboarding process.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
          <label className="block text-sm font-medium text-slate-300">
            Access Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            className={`mt-1 w-full rounded-lg border px-4 py-3.5 text-center text-lg font-mono tracking-widest text-white placeholder-slate-600 focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 bg-red-500/5 focus:ring-red-500"
                : "border-slate-700 bg-slate-900 focus:ring-electric-500"
            }`}
            placeholder="XXXX-XXXX"
            autoFocus
            autoComplete="off"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">
              Invalid access code. Please check your welcome email.
            </p>
          )}

          {/* Referral Code (optional) */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300">
              Referral Code{" "}
              <span className="text-xs font-normal text-slate-500">
                (optional)
              </span>
            </label>
            <input
              type="text"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-center text-sm text-white placeholder-slate-600 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
              placeholder="REF-XXXXXX"
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-slate-500">
              Were you referred by a TechFides partner or client? Enter their
              code and both of you earn credit.
            </p>
          </div>

          <button
            type="submit"
            className="glow-blue mt-6 w-full rounded-lg bg-electric-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-electric-400 active:scale-[0.98]"
          >
            Enter Portal
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Need help?{" "}
          <a
            href="mailto:support@techfides.com"
            className="text-electric-400 hover:text-electric-300"
          >
            support@techfides.com
          </a>
        </p>
      </div>
    </div>
  );
}

/* ─── Progress Bar ─── */
const steps = [
  { id: 1, label: "NDA" },
  { id: 2, label: "SOW" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Feedback" },
  { id: 5, label: "Complete" },
];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl sm:mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-10 sm:w-10 sm:text-sm ${
                  step.id < current
                    ? "bg-accent-green text-white"
                    : step.id === current
                    ? "bg-electric-500 text-white shadow-lg shadow-electric-500/30"
                    : "border border-slate-700 bg-slate-900 text-slate-500"
                }`}
              >
                {step.id < current ? "\u2713" : step.id}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-medium sm:mt-2 sm:text-xs ${
                  step.id <= current ? "text-white" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-1 h-px flex-1 sm:mx-2 ${
                  step.id < current ? "bg-accent-green" : "bg-slate-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── E-Signature Component ─── */
function ESignature({
  signature,
  setSignature,
}: {
  signature: SignatureData;
  setSignature: (s: SignatureData) => void;
}) {
  return (
    <div className="mt-8 rounded-xl border border-electric-500/30 bg-electric-500/5 p-6">
      <h3 className="text-lg font-bold text-electric-400">
        Electronic Signature
      </h3>
      <p className="mt-1 text-xs text-slate-400">
        By signing below, you acknowledge that your electronic signature is
        legally binding and equivalent to a handwritten signature.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Full Legal Name *
          </label>
          <input
            type="text"
            required
            value={signature.name}
            onChange={(e) =>
              setSignature({ ...signature, name: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Title / Role *
          </label>
          <input
            type="text"
            required
            value={signature.title}
            onChange={(e) =>
              setSignature({ ...signature, title: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
            placeholder="CEO, CTO, etc."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Company Name *
          </label>
          <input
            type="text"
            required
            value={signature.company}
            onChange={(e) =>
              setSignature({ ...signature, company: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
            placeholder="Your company"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Date
          </label>
          <input
            type="text"
            readOnly
            value={new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300"
          />
        </div>
      </div>
      {signature.name && (
        <div className="mt-4 rounded-lg border border-dashed border-electric-500/30 bg-slate-950 p-4 text-center">
          <p className="font-serif text-2xl italic text-electric-400">
            {signature.name}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {signature.title}
            {signature.company && `, ${signature.company}`}
          </p>
        </div>
      )}
      <label className="mt-4 flex items-start gap-3">
        <input
          type="checkbox"
          checked={signature.agreed}
          onChange={(e) =>
            setSignature({ ...signature, agreed: e.target.checked })
          }
          className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-electric-500 focus:ring-electric-500"
        />
        <span className="text-xs text-slate-400">
          I confirm that I am authorized to sign on behalf of the company named
          above and that this electronic signature is legally binding.
        </span>
      </label>
    </div>
  );
}

/* ─── Step 1: NDA ─── */
function StepNDA({
  onComplete,
}: {
  onComplete: (sig: SignatureData) => void;
}) {
  const [signature, setSignature] = useState<SignatureData>({
    name: "",
    title: "",
    company: "",
    date: new Date().toISOString(),
    agreed: false,
  });

  const canSubmit =
    signature.name && signature.title && signature.company && signature.agreed;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold">
        Mutual Non-Disclosure <span className="text-electric-400">Agreement</span>
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Please review and sign the NDA before we proceed.
      </p>

      <div className="mt-8 max-h-[50vh] overflow-y-auto rounded-xl border border-slate-800 bg-navy-900/30 p-6 text-sm leading-relaxed text-slate-300">
        <h3 className="text-base font-bold text-white">
          MUTUAL NON-DISCLOSURE AGREEMENT
        </h3>
        <p className="mt-3 text-slate-400">
          This Mutual Non-Disclosure Agreement (&ldquo;Agreement&rdquo;) is
          entered into by and between TechFides LLC, a Texas limited liability
          company (&ldquo;TechFides&rdquo;), and the undersigned party
          (&ldquo;Client&rdquo;), collectively referred to as the
          &ldquo;Parties.&rdquo;
        </p>

        <h4 className="mt-5 font-semibold text-white">
          1. Definition of Confidential Information
        </h4>
        <p className="mt-2 text-slate-400">
          &ldquo;Confidential Information&rdquo; means any non-public,
          proprietary, or trade secret information disclosed by either Party,
          including but not limited to: business strategies, financial data,
          technical architectures, AI model configurations, client lists,
          pricing structures, deployment methodologies, and any information
          marked as &ldquo;confidential&rdquo; or that a reasonable person would
          understand to be confidential.
        </p>

        <h4 className="mt-5 font-semibold text-white">
          2. Obligations of Receiving Party
        </h4>
        <p className="mt-2 text-slate-400">
          Each Party agrees to: (a) hold all Confidential Information in strict
          confidence; (b) not disclose Confidential Information to any third
          party without prior written consent; (c) use Confidential Information
          solely for the purpose of evaluating or performing services under the
          business relationship; (d) protect Confidential Information using no
          less than reasonable care; (e) limit access to Confidential
          Information to personnel with a need to know.
        </p>

        <h4 className="mt-5 font-semibold text-white">3. Exclusions</h4>
        <p className="mt-2 text-slate-400">
          Confidential Information does not include information that: (a) is or
          becomes publicly available through no fault of the receiving Party;
          (b) was already known to the receiving Party prior to disclosure; (c)
          is independently developed without use of Confidential Information;
          (d) is rightfully received from a third party without restriction.
        </p>

        <h4 className="mt-5 font-semibold text-white">4. Term</h4>
        <p className="mt-2 text-slate-400">
          This Agreement shall remain in effect for three (3) years from the
          date of execution. The obligation to protect Confidential Information
          disclosed during this term shall survive expiration or termination
          for an additional two (2) years.
        </p>

        <h4 className="mt-5 font-semibold text-white">
          5. Return of Materials
        </h4>
        <p className="mt-2 text-slate-400">
          Upon termination or written request, each Party shall promptly return
          or destroy all Confidential Information in its possession and certify
          such destruction in writing.
        </p>

        <h4 className="mt-5 font-semibold text-white">6. Governing Law</h4>
        <p className="mt-2 text-slate-400">
          This Agreement shall be governed by the laws of the State of Texas,
          without regard to conflict of law principles. Any disputes shall be
          resolved in Collin County, Texas.
        </p>

        <h4 className="mt-5 font-semibold text-white">7. Remedies</h4>
        <p className="mt-2 text-slate-400">
          Both Parties acknowledge that a breach of this Agreement may cause
          irreparable harm for which monetary damages are inadequate.
          Accordingly, either Party may seek injunctive relief in addition to
          any other available remedies.
        </p>
      </div>

      <ESignature signature={signature} setSignature={setSignature} />

      <button
        onClick={() => canSubmit && onComplete(signature)}
        disabled={!canSubmit}
        className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
          canSubmit
            ? "bg-electric-500 text-white hover:bg-electric-400 active:scale-[0.98]"
            : "cursor-not-allowed bg-slate-800 text-slate-500"
        }`}
      >
        Sign NDA &amp; Continue
      </button>
    </div>
  );
}

/* ─── Service Definitions ─── */
// Tier shape: every service offers tier-based engagement options.
// `priceLabel` is the display text shown to the client; the actual amount
// charged for ranged engagements is `priceMin` (deposit basis). For
// subscription services (Private AI), `priceMin` is the monthly amount.
type ServiceTier = {
  id: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  priceMin: number;
  priceMax?: number;
  retainer?: string;
  duration: string;
  highlights: string[];
  badge?: "MOST POPULAR" | "FEATURED" | "EMERGENCY";
  cta?: "Sign & Pay" | "Request Proposal" | "Contact for Scoping" | "Start with Discovery";
};

const SERVICE_CATALOG = [
  {
    id: "sovereign-ai",
    name: "Private AI",
    subtitle: "Monthly subscription. Hardware included.",
    icon: "&#9889;",
    description:
      "Your hardware, your data, your building. One price. No setup fees. Cancel anytime. Hardware loaned, deployment, monitoring, updates, and support included in every plan.",
    scope: [
      "Hardware loaned and deployed on-site (returns in a prepaid shipping box on cancellation)",
      "On-premise LLM stack (Llama, Mistral, or equivalent) configured for your workflows",
      "Deployment + monitoring + updates + support included monthly",
      "Unlimited users on every plan",
      "Agent-hour allotment scales by tier; overage billed per hour at the tier rate",
      "30-day cancellation notice; no setup fees",
    ],
    deliverables: [
      "Hardware delivery and on-site provisioning",
      "Production-ready Private AI stack from day one",
      "Workflow configuration for your business",
      "Continuous monitoring + monthly updates",
      "Support inbox and quarterly check-ins",
    ],
    timeline: [
      { phase: "Order + Hardware Ship", duration: "Week 1", milestone: "Hardware Arrives" },
      { phase: "Install + Configure", duration: "Week 2", milestone: "Stack Deployed" },
      { phase: "Workflow Tuning", duration: "Week 3", milestone: "Production Use Begins" },
      { phase: "Ongoing", duration: "Monthly", milestone: "Updates + Monitoring + Support" },
    ],
    clientResponsibilities:
      "Client shall: (a) provide network and physical space for hardware; (b) designate a primary point of contact; (c) honor the 30-day cancellation notice if discontinuing; (d) return loaned hardware in the prepaid shipping box upon cancellation.",
    tiers: [
      { id: "starter", name: "Starter", subtitle: "Small practices & offices", priceLabel: "$1,299/mo", priceMin: 1299, duration: "Monthly \u00b7 20 agent-hours \u00b7 $65/hr overage", highlights: ["20 agent-hours/mo", "$65/hr overage", "Hardware loaned", "Deployment + monitoring + updates"], cta: "Sign & Pay" as const },
      { id: "growth", name: "Growth", subtitle: "Mid-size firms running AI across multiple teams", priceLabel: "$2,299/mo", priceMin: 2299, duration: "Monthly \u00b7 40 agent-hours \u00b7 $60/hr overage", highlights: ["40 agent-hours/mo", "$60/hr overage", "Hardware loaned", "Deployment + monitoring + updates"], badge: "MOST POPULAR" as const, cta: "Sign & Pay" as const },
      { id: "scale", name: "Scale", subtitle: "Production workloads", priceLabel: "$3,999/mo", priceMin: 3999, duration: "Monthly \u00b7 80 agent-hours \u00b7 $55/hr overage", highlights: ["80 agent-hours/mo", "$55/hr overage", "Hardware loaned", "Deployment + monitoring + updates"], cta: "Sign & Pay" as const },
      { id: "enterprise", name: "Enterprise", subtitle: "AI as core infrastructure", priceLabel: "$6,999/mo", priceMin: 6999, duration: "Monthly \u00b7 160 agent-hours \u00b7 $50/hr overage", highlights: ["160 agent-hours/mo", "$50/hr overage", "Hardware loaned", "Deployment + monitoring + updates"], cta: "Sign & Pay" as const },
    ] as ServiceTier[],
  },
  {
    id: "ai-readiness-360",
    name: "AI Readiness 360\u2122",
    subtitle: "A 14-day distributed AI intelligence system",
    icon: "&#128269;",
    description:
      "This is not an assessment. It is a system of record for AI Transformation. A structured 14-day engagement with a secure digital portal \u2014 your team accesses the assessment via a private link, no software to install. Final investment can be higher based on number of business locations.",
    scope: [
      "Portal setup and team onboarding (Days 1\u20133)",
      "Distributed assessment completion across stakeholders (Days 4\u201310)",
      "Systems evidence and document upload (Days 8\u201312)",
      "AI-powered analysis and scoring (Days 10\u201314)",
      "Executive briefing and roadmap delivery (Day 15)",
      "Multi-location and multi-region scoping for enterprise engagements",
    ],
    deliverables: [
      "Opportunity Pipeline \u2014 high-value automation areas, AI quick wins, and strategic use cases mapped by impact, effort, and risk",
      "Priority Roadmap \u2014 sequenced execution plan: fix critical risks first, unlock quick wins second, build foundations third, scale strategically fourth",
      "Executive Briefing Package \u2014 60-second snapshot, narrative summary, and downloadable PDF for Go/No-Go decisions",
      "Repeatable transformation framework",
      "Standardized AI adoption metrics",
      "Measurable progress over time",
    ],
    timeline: [
      { phase: "Portal Setup & Onboarding", duration: "Days 1\u20133", milestone: "Team Ready" },
      { phase: "Distributed Assessment", duration: "Days 4\u201310", milestone: "Assessment Complete" },
      { phase: "Systems Evidence", duration: "Days 8\u201312", milestone: "Evidence Uploaded" },
      { phase: "AI Analysis & Scoring", duration: "Days 10\u201314", milestone: "Scoring Complete" },
      { phase: "Executive Briefing", duration: "Day 15", milestone: "Roadmap Delivered" },
    ],
    clientResponsibilities:
      "Client shall: (a) designate a project champion and assessment participants; (b) ensure stakeholders complete the distributed assessment within the 7-day window; (c) provide systems evidence and supporting documentation by Day 12; (d) attend the Day 15 executive briefing; (e) confirm number of business locations at scoping for accurate pricing.",
    tiers: [
      { id: "smb", name: "SMB / Mid-Market", subtitle: "Up to 20 participants, single region", priceLabel: "$45,000", priceMin: 45000, duration: "15-day delivery", highlights: ["Up to 20 participants", "Single region", "All 3 deliverables", "AI-powered analysis"], cta: "Sign & Pay" as const },
      { id: "enterprise", name: "Enterprise", subtitle: "Unlimited participants, multi-region, multi-BU", priceLabel: "Up to $85,000", priceMin: 45000, priceMax: 85000, duration: "15-day delivery (extends with locations)", highlights: ["Unlimited participants", "Multi-region & multi-BU", "Final investment scales with locations", "Custom scoping available"], cta: "Request Proposal" as const },
    ] as ServiceTier[],
  },
  {
    id: "transformation-management",
    name: "AI Transformation Management",
    subtitle: "Resource-based program leadership (PM AI)",
    icon: "&#128640;",
    description:
      "Transparent, fixed-scope pricing aligned to your transformation maturity. Every engagement includes executive briefing, stakeholder alignment, and a governed delivery framework. All pricing is fixed-scope SOW based. No hourly billing. No scope creep. Final investment determined by organizational complexity and engagement duration.",
    scope: [
      "Executive briefing and program kickoff",
      "Stakeholder alignment and governance setup",
      "Fixed-scope SOW with governed delivery framework",
      "Resource-based program management aligned to selected tier",
      "Operational efficiency, risk reduction, accelerated time-to-value, and sustainable capability outcomes",
    ],
    deliverables: [
      "Streamlined processes and reduced manual effort through intelligent automation",
      "Comprehensive governance frameworks ensuring safety, compliance, and ethical use",
      "Faster deployment of AI solutions through rigorous program management",
      "Long-term internal capability built through knowledge transfer and training",
      "Tier-specific deliverables (see selected engagement tier below)",
    ],
    timeline: [
      { phase: "Executive Briefing & Alignment", duration: "Week 1", milestone: "Charter Approved" },
      { phase: "Governance Setup", duration: "Weeks 2\u20134", milestone: "PMO Operational" },
      { phase: "Execution", duration: "Tier-dependent", milestone: "Milestones per Tier" },
      { phase: "Knowledge Transfer & Closeout", duration: "Final 4 weeks", milestone: "Hand-off Complete" },
    ],
    clientResponsibilities:
      "Client shall: (a) provide executive sponsorship and active participation; (b) allocate internal resources as agreed; (c) make timely decisions per governance framework; (d) provide access to relevant systems and data; (e) confirm engagement complexity and duration at scoping.",
    tiers: [
      { id: "strategic-advisory", name: "Strategic Advisory", subtitle: "Ongoing executive guidance", priceLabel: "$50,000\u2013$95,000", priceMin: 50000, priceMax: 95000, duration: "6-month engagement cycle", highlights: ["Quarterly executive sessions", "AI strategy & governance review", "Investment portfolio optimization", "Board-ready deliverables"], cta: "Sign & Pay" as const },
      { id: "transformation-mgmt", name: "Transformation Mgmt", subtitle: "End-to-end program leadership", priceLabel: "$125,000\u2013$250,000", priceMin: 125000, priceMax: 250000, duration: "12-month engagement cycle", highlights: ["Full program governance", "Stakeholder management", "Value assurance & delivery", "Change management framework", "Cross-functional PMO integration"], badge: "MOST POPULAR" as const, cta: "Request Proposal" as const },
      { id: "capability-building", name: "Capability Building", subtitle: "Internal CoE development", priceLabel: "$175,000\u2013$350,000", priceMin: 175000, priceMax: 350000, duration: "18-month engagement cycle", highlights: ["AI Center of Excellence setup", "Talent development & mentoring", "Process standardization", "Knowledge transfer & IP retention", "Internal tooling & frameworks"], cta: "Request Proposal" as const },
      { id: "rescue-turnaround", name: "Rescue & Turnaround", subtitle: "Rapid intervention for stalled programs", priceLabel: "$85,000\u2013$200,000", priceMin: 85000, priceMax: 200000, duration: "90-day sprint engagement", highlights: ["Root cause analysis (Week 1)", "Rapid remediation plan", "Momentum restoration", "Stakeholder realignment", "Governance reset"], badge: "EMERGENCY" as const, cta: "Sign & Pay" as const },
    ] as ServiceTier[],
  },
  {
    id: "aegis",
    name: "AEGIS",
    subtitle: "Clear value. Governed scale. Retainer-backed.",
    icon: "&#9881;",
    description:
      "AEGIS engagements land your company in a running governance operating model \u2014 not a PDF, not a slide deck. Core and above require a managed retainer so the system we install continues to run. Diagnostic engagements touch all six layers at audit depth. Core and Enterprise engagements ship all 18 artifacts in their finished form, then hand them to a running managed-governance retainer.",
    scope: [
      "AI readiness scan across 6 layers",
      "Shadow AI inventory and spend audit",
      "Prioritized 90-day governance roadmap",
      "Governance operating model activated (not just documented)",
      "All 18 AEGIS artifacts shipped (Core and above)",
      "Monthly review + quarterly board pack (Core and above)",
      "Annual re-diagnostic included in retainer",
    ],
    deliverables: [
      "AI readiness scan deliverable",
      "Shadow AI inventory + spend audit",
      "90-day governance roadmap",
      "Executive summary + board-ready deck",
      "All 18 AEGIS artifacts (Core and above)",
      "Running governance operating model",
      "Vertical + regulatory mapping (HIPAA, SOC 2, NIST AI RMF \u2014 Enterprise)",
    ],
    timeline: [
      { phase: "Readiness Scan", duration: "Week 1", milestone: "6-Layer Audit Complete" },
      { phase: "Roadmap & Proposal", duration: "Week 2", milestone: "Diagnostic Deliverable" },
      { phase: "Implementation", duration: "Tier-dependent", milestone: "Artifacts Shipped" },
      { phase: "Retainer Live", duration: "Ongoing (Core+)", milestone: "Governance Operating" },
    ],
    clientResponsibilities:
      "Client shall: (a) provide access to systems and personnel for the readiness scan; (b) execute the managed retainer agreement before Core implementation begins; (c) participate in monthly review and quarterly board pack cadence; (d) ensure governance operating model adoption.",
    tiers: [
      { id: "diagnostic", name: "Diagnostic", subtitle: "Your on-ramp to Core", priceLabel: "$15,000\u2013$35,000", priceMin: 15000, priceMax: 35000, duration: "One-time \u00b7 2-week delivery", highlights: ["AI readiness scan across 6 layers", "Shadow AI inventory + spend audit", "Prioritized 90-day governance roadmap", "Executive summary + board-ready deck", "Scoped proposal for Core Implementation"], cta: "Start with Discovery" as const },
      { id: "core", name: "Core Implementation", subtitle: "Mid-market & professional firms", priceLabel: "$75,000\u2013$150,000", priceMin: 75000, priceMax: 150000, retainer: "+ $5K\u2013$10K/mo managed governance \u2014 required", duration: "90 days", highlights: ["All 18 artifacts shipped in 90 days", "Governance operating model activated", "Monthly review + quarterly board pack", "Annual re-diagnostic included in retainer", "Engagement closes only when retainer is live"], badge: "FEATURED" as const, cta: "Request Proposal" as const },
      { id: "enterprise", name: "Enterprise Execution", subtitle: "Multi-site & regulated industries", priceLabel: "$150,000\u2013$400,000", priceMin: 150000, priceMax: 400000, retainer: "+ $15K/mo managed governance \u2014 required", duration: "Multi-quarter", highlights: ["Organization-wide deployment across BUs or sites", "Vertical + regulatory mapping (HIPAA, SOC 2, NIST AI RMF)", "Named fractional CISO + dedicated program manager", "Board-level reporting + quarterly executive review", "Retainer scales with scope \u2014 not optional"], cta: "Request Proposal" as const },
      { id: "government", name: "Government & Institutional", subtitle: "Federal, state & multilateral", priceLabel: "Custom", priceMin: 150000, duration: "Scoped per engagement", highlights: ["FedRAMP-aligned deployment posture", "Private data controls + multi-agency coordination", "Dedicated security team", "Custom retainer structure"], cta: "Contact for Scoping" as const },
    ] as ServiceTier[],
  },
];

/* ─── Step 2: SOW ─── */
function StepSOW({
  clientName,
  onComplete,
}: {
  clientName: string;
  onComplete: (sig: SignatureData, serviceId: string, tierId: string) => void;
}) {
  const [selectedService, setSelectedService] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [signature, setSignature] = useState<SignatureData>({
    name: clientName,
    title: "",
    company: "",
    date: new Date().toISOString(),
    agreed: false,
  });

  const service = SERVICE_CATALOG.find((s) => s.id === selectedService);
  const tier = service?.tiers?.find((t) => t.id === selectedTier);

  // Reset tier when service changes
  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedTier("");
  };

  const canSubmit =
    selectedService &&
    selectedTier &&
    signature.name &&
    signature.title &&
    signature.company &&
    signature.agreed;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold">
        Statement of <span className="text-electric-400">Work</span>
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Select your service, then review the scope, deliverables, and timeline.
      </p>

      {/* Service Selection */}
      <div className="mt-8">
        <label className="text-sm font-semibold text-slate-300">
          1. Select Your Service *
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SERVICE_CATALOG.map((svc) => (
            <button
              key={svc.id}
              onClick={() => handleSelectService(svc.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selectedService === svc.id
                  ? "border-electric-500 bg-electric-500/10 ring-1 ring-electric-500"
                  : "border-slate-700 bg-slate-900 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-xl"
                  dangerouslySetInnerHTML={{ __html: svc.icon }}
                />
                <div>
                  <p className="text-sm font-bold text-white">{svc.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {svc.subtitle}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                {svc.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Tier Selection — appears after service is chosen */}
      {service && service.tiers && service.tiers.length > 0 && (
        <div className="mt-8">
          <label className="text-sm font-semibold text-slate-300">
            2. Select Engagement Tier *
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Pick the engagement level that fits your scope. Final price reflects
            organizational complexity at scoping.
          </p>
          <div className={`mt-3 grid gap-3 ${service.tiers.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : service.tiers.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {service.tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedTier === t.id
                    ? "border-electric-500 bg-electric-500/10 ring-1 ring-electric-500"
                    : "border-slate-700 bg-slate-900 hover:border-slate-600"
                }`}
              >
                {t.badge && (
                  <span
                    className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      t.badge === "MOST POPULAR"
                        ? "bg-electric-500/20 text-electric-300"
                        : t.badge === "FEATURED"
                        ? "bg-electric-500/20 text-electric-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{t.subtitle}</p>
                <p className="mt-3 text-lg font-bold text-electric-400">
                  {t.priceLabel}
                </p>
                {t.retainer && (
                  <p className="mt-0.5 text-[10px] text-amber-400">
                    {t.retainer}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-slate-500">{t.duration}</p>
                <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
                  {t.highlights.slice(0, 4).map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="mt-0.5 text-accent-green">&#10003;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic SOW Content */}
      {service && (
        <div className="mt-8 max-h-[50vh] overflow-y-auto rounded-xl border border-slate-800 bg-navy-900/30 p-5 text-sm leading-relaxed text-slate-300 sm:p-6">
          <h3 className="text-base font-bold text-white">
            STATEMENT OF WORK &mdash; {service.name.toUpperCase()}
          </h3>

          <h4 className="mt-5 font-semibold text-white">
            1. Scope of Services
          </h4>
          <p className="mt-2 text-slate-400">{service.description}</p>
          <div className="mt-3 text-slate-400">
            <p>TechFides shall provide the following:</p>
            {service.scope.map((item, i) => (
              <p key={i} className="mt-1">
                ({String.fromCharCode(97 + i)}) {item}
              </p>
            ))}
          </div>

          <h4 className="mt-5 font-semibold text-white">2. Deliverables</h4>
          <div className="mt-2 text-slate-400">
            <p>Upon completion, Client will receive:</p>
            {service.deliverables.map((item, i) => (
              <p key={i} className="mt-1">
                &bull; {item}
              </p>
            ))}
          </div>

          <h4 className="mt-5 font-semibold text-white">3. Timeline</h4>
          <div className="mt-2 overflow-hidden rounded-lg border border-slate-700">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-2 text-left text-slate-400">Phase</th>
                  <th className="p-2 text-left text-slate-400">Duration</th>
                  <th className="p-2 text-left text-slate-400">Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {service.timeline.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2">{row.phase}</td>
                    <td className="p-2">{row.duration}</td>
                    <td
                      className={`p-2 ${
                        i === service.timeline.length - 1
                          ? "text-accent-green"
                          : "text-electric-400"
                      }`}
                    >
                      {row.milestone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mt-5 font-semibold text-white">
            4. Pricing &amp; Payment
          </h4>
          {tier ? (
            <>
              <div className="mt-2 rounded-lg border border-electric-500/30 bg-electric-500/5 p-3 text-slate-300">
                <p className="text-xs uppercase tracking-wide text-electric-300">
                  Selected Tier
                </p>
                <p className="mt-1 text-base font-bold text-white">
                  {tier.name}
                  <span className="ml-2 text-sm text-slate-400">
                    &mdash; {tier.subtitle}
                  </span>
                </p>
                <p className="mt-1 text-lg font-bold text-electric-400">
                  {tier.priceLabel}
                </p>
                {tier.retainer && (
                  <p className="mt-0.5 text-xs text-amber-400">
                    {tier.retainer}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">{tier.duration}</p>
              </div>
              <p className="mt-3 text-slate-400">
                Fees are structured as a fixed-scope Statement of Work. No hourly
                billing. No scope creep. Final investment may scale based on
                organizational complexity, locations, and engagement duration.
                {service.id === "sovereign-ai"
                  ? " Monthly subscription begins upon hardware delivery; cancel anytime with 30 days' notice."
                  : " Deposit is due upon signature; balance per the schedule below."}
              </p>
            </>
          ) : (
            <p className="mt-2 italic text-slate-500">
              Select an engagement tier above to lock in pricing.
            </p>
          )}

          <h4 className="mt-5 font-semibold text-white">
            5. Client Responsibilities
          </h4>
          <p className="mt-2 text-slate-400">
            {service.clientResponsibilities}
          </p>

          <h4 className="mt-5 font-semibold text-white">6. Change Orders</h4>
          <p className="mt-2 text-slate-400">
            Any changes to the scope defined herein shall be documented in a
            written Change Order signed by both Parties, specifying the change,
            impact on timeline, and any additional fees.
          </p>

          <h4 className="mt-5 font-semibold text-white">
            7. Acceptance Criteria
          </h4>
          <p className="mt-2 text-slate-400">
            Deliverables shall be deemed accepted upon Client sign-off at each
            milestone or automatically after 10 business days of delivery
            without written objection.
          </p>
        </div>
      )}

      {!service && (
        <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
          <p className="text-sm text-slate-500">
            Select a service above to generate your Statement of Work.
          </p>
        </div>
      )}

      <ESignature signature={signature} setSignature={setSignature} />

      <button
        onClick={() => canSubmit && service && tier && onComplete(signature, service.id, tier.id)}
        disabled={!canSubmit}
        className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
          canSubmit
            ? "bg-electric-500 text-white hover:bg-electric-400 active:scale-[0.98]"
            : "cursor-not-allowed bg-slate-800 text-slate-500"
        }`}
      >
        {!selectedService
          ? "Select a Service to Continue"
          : !selectedTier
          ? "Select an Engagement Tier"
          : tier?.cta === "Request Proposal"
          ? "Sign SOW & Request Proposal"
          : tier?.cta === "Contact for Scoping"
          ? "Sign SOW & Schedule Scoping"
          : tier?.cta === "Start with Discovery"
          ? "Sign SOW & Start with Discovery"
          : "Sign SOW & Continue to Payment"}
      </button>
    </div>
  );
}

/* ─── Work Order Generator ─── */
function generateWorkOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WO-${y}${m}${d}-${rand}`;
}

/* ─── Step 3: Payment ─── */
function StepPayment({
  onComplete,
  clientName,
  clientCompany,
  serviceId,
  tierId,
}: {
  onComplete: (method: PaymentMethod, workOrder?: string) => void;
  clientName: string;
  clientCompany: string;
  serviceId: string;
  tierId: string;
}) {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [invoiceSubmitted, setInvoiceSubmitted] = useState(false);
  const [billing, setBilling] = useState<BillingInfo>({
    contactName: clientName,
    company: clientCompany,
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    poNumber: "",
    preferredMethod: "",
  });

  // Resolve the selected service + tier from the catalog
  const service = SERVICE_CATALOG.find((s) => s.id === serviceId);
  const tier = service?.tiers?.find((t) => t.id === tierId);

  // For subscription services (Private AI), the "due today" amount is the
  // first monthly. For fixed-scope engagements, the deposit is 50% of priceMin
  // (the floor of the engagement range).
  const isSubscription = serviceId === "sovereign-ai";
  const dueTodayCents = !tier
    ? 0
    : isSubscription
    ? tier.priceMin * 100
    : Math.round(tier.priceMin * 0.5) * 100;
  const dueTodayLabel = !tier
    ? "—"
    : isSubscription
    ? tier.priceLabel
    : `$${(dueTodayCents / 100).toLocaleString()} (50% deposit)`;
  // Gate: tiers that say "Request Proposal" or "Contact for Scoping" don't
  // accept a Stripe payment in-line. Show the tier as "talk to us" instead.
  const isInlinePayable =
    !!tier &&
    (tier.cta === "Sign & Pay" || tier.cta === undefined);

  // Stripe flow is handled by <StripePaymentForm /> which manages its own
  // loading state. The handler used to live here has been replaced by that
  // component plus the /api/v1/stripe/create-payment-intent + /webhook routes.

  const canSubmitInvoice =
    billing.contactName &&
    billing.company &&
    billing.email &&
    billing.phone &&
    billing.address &&
    billing.city &&
    billing.state &&
    billing.zip &&
    billing.preferredMethod;

  const handleInvoiceRequest = () => {
    if (!canSubmitInvoice) return;
    setProcessing(true);
    const workOrderNum = generateWorkOrderNumber();
    // In production: POST billing info + work order to your backend/CRM
    setTimeout(() => {
      setProcessing(false);
      setInvoiceSubmitted(true);
      // Short delay to show confirmation, then advance
      setTimeout(() => onComplete("invoice", workOrderNum), 1500);
    }, 1500);
  };

  // If the previous step didn't pass a service+tier, bail safely.
  if (!service || !tier) {
    return (
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">Setup <span className="text-electric-400">Payment</span></h2>
        <p className="mt-4 text-sm text-slate-400">
          No engagement tier was selected. Please return to the SOW step and choose
          your service and tier.
        </p>
      </div>
    );
  }

  // Proposal/Scoping tiers — surface a contact CTA instead of payment.
  if (!isInlinePayable) {
    return (
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">
          Next: <span className="text-electric-400">{tier.cta === "Contact for Scoping" ? "Scoping Call" : "Proposal"}</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          The {tier.name} tier is scoped per engagement. We don&apos;t collect payment
          here &mdash; your TechFides contact will reach out to schedule a call.
        </p>
        <div className="mt-8 rounded-xl border border-electric-500/30 bg-electric-500/5 p-6">
          <p className="text-xs uppercase tracking-wide text-electric-300">Selected Engagement</p>
          <p className="mt-1 text-lg font-bold text-white">{service.name} &mdash; {tier.name}</p>
          <p className="mt-1 text-2xl font-bold text-electric-400">{tier.priceLabel}</p>
          {tier.retainer && <p className="mt-0.5 text-xs text-amber-400">{tier.retainer}</p>}
          <p className="mt-2 text-xs text-slate-500">{tier.duration}</p>
        </div>
        <button
          onClick={() => onComplete("invoice", generateWorkOrderNumber())}
          className="mt-8 w-full rounded-lg bg-electric-500 py-3 text-sm font-semibold text-white transition-all hover:bg-electric-400 active:scale-[0.98]"
        >
          {tier.cta === "Contact for Scoping" ? "Confirm Scoping Request" : "Confirm Proposal Request"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold">
        Setup <span className="text-electric-400">Payment</span>
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        {isSubscription
          ? "Confirm your subscription and choose how you'd like to pay."
          : "Confirm the engagement and pay your deposit to lock the SOW."}
      </p>

      {/* Selected engagement summary (replaces the old Silver/Gold/Platinum tier picker) */}
      <div className="mt-8 rounded-xl border border-electric-500/30 bg-electric-500/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-electric-300">
              Selected Engagement
            </p>
            <p className="mt-1 text-base font-bold text-white">
              {service.name} &mdash; {tier.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{tier.subtitle}</p>
            <p className="mt-2 text-[11px] text-slate-500">{tier.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-electric-400">{tier.priceLabel}</p>
            {tier.retainer && (
              <p className="mt-0.5 text-xs text-amber-400">{tier.retainer}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Tabs */}
      <div className="mt-8">
        <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1">
          <button
            onClick={() => setPaymentMethod("stripe")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
              paymentMethod === "stripe"
                ? "bg-electric-500 text-white shadow-lg shadow-electric-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              Pay Online (Stripe)
            </span>
          </button>
          <button
            onClick={() => setPaymentMethod("invoice")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
              paymentMethod === "invoice"
                ? "bg-electric-500 text-white shadow-lg shadow-electric-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              Request Invoice
            </span>
          </button>
        </div>
      </div>

      {/* Payment summary */}
      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h3 className="text-sm font-semibold text-slate-300">
          Payment Summary
        </h3>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">
              {isSubscription ? "Monthly Subscription" : "Engagement Fee"} ({tier.name})
            </span>
            <span className="font-semibold">{tier.priceLabel}</span>
          </div>
          {!isSubscription && (
            <div className="flex justify-between">
              <span className="text-slate-400">Deposit (50%)</span>
              <span className="font-semibold text-accent-green">
                ${(dueTodayCents / 100).toLocaleString()}
              </span>
            </div>
          )}
          <div className="border-t border-slate-700 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold">
                {paymentMethod === "stripe" ? "Due Today" : "Invoice Amount"}
              </span>
              <span className="text-lg font-bold text-electric-400">
                {dueTodayLabel}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {isSubscription
            ? `Subscription of ${tier.priceLabel} continues monthly. Cancel anytime with 30 days' notice. Hardware returns in a prepaid shipping box.`
            : tier.retainer
            ? `Balance due per the SOW schedule. ${tier.retainer}.`
            : "Balance due per the SOW schedule. Final investment may scale with organizational complexity."}
          {paymentMethod === "stripe"
            ? " Processed securely via Stripe."
            : " Invoiced per your selected payment method."}
        </p>
      </div>

      {/* ── Stripe Payment ── */}
      {paymentMethod === "stripe" && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            Secured by Stripe &bull; PCI DSS Compliant &bull; 256-bit SSL
          </div>

          {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
            <StripePaymentForm
              serviceId={service.id === "sovereign-ai" ? "SOVEREIGN_AI" : service.id === "ai-readiness-360" ? "AI_READINESS_360" : service.id === "transformation-management" ? "TRANSFORMATION_MANAGEMENT" : "AEGIS"}
              tierId={tier.id}
              amountCents={dueTodayCents}
              customerName={billing.contactName || clientName}
              customerEmail={billing.email}
              customerCompany={billing.company || clientCompany}
              returnUrl={typeof window !== "undefined" ? `${window.location.origin}/onboarding/payment-complete` : "/onboarding/payment-complete"}
              onSuccess={() => onComplete("stripe")}
              onError={(msg) => console.error("Stripe error:", msg)}
            />
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
              <p className="font-semibold">Stripe is not configured yet</p>
              <p className="mt-1 text-xs">
                Add <code className="rounded bg-slate-900 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
                and <code className="rounded bg-slate-900 px-1">STRIPE_SECRET_KEY</code> to{" "}
                <code className="rounded bg-slate-900 px-1">.env.local</code> and restart the dev server.
                See <code className="rounded bg-slate-900 px-1">/Operations/Stripe-Setup.md</code> for steps.
              </p>
              <button
                onClick={() => onComplete("invoice", generateWorkOrderNumber())}
                className="mt-3 w-full rounded-lg bg-amber-500/20 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/30"
              >
                Use Invoice Method Instead
              </button>
            </div>
          )}

          <p className="mt-3 text-[11px] text-slate-500">
            We accept all major cards. Apple Pay and Google Pay surface
            automatically when supported by your browser.
          </p>
        </div>
      )}

      {/* ── Invoice / Alternative Payment ── */}
      {paymentMethod === "invoice" && !invoiceSubmitted && (
        <>
          <div className="mt-6 rounded-xl border border-slate-800 bg-navy-900/30 p-6">
            <h3 className="text-sm font-bold text-white">
              Billing Information &amp; Work Order
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              We&apos;ll generate a work order and send an invoice to the
              details below. Payment is due within 15 business days.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={billing.contactName}
                  onChange={(e) =>
                    setBilling({ ...billing, contactName: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={billing.company}
                  onChange={(e) =>
                    setBilling({ ...billing, company: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  Billing Email *
                </label>
                <input
                  type="email"
                  required
                  value={billing.email}
                  onChange={(e) =>
                    setBilling({ ...billing, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                  placeholder="accounts@yourcompany.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={billing.phone}
                  onChange={(e) =>
                    setBilling({ ...billing, phone: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400">
                  Billing Address *
                </label>
                <input
                  type="text"
                  required
                  value={billing.address}
                  onChange={(e) =>
                    setBilling({ ...billing, address: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={billing.city}
                  onChange={(e) =>
                    setBilling({ ...billing, city: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={billing.state}
                    onChange={(e) =>
                      setBilling({ ...billing, state: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">
                    ZIP *
                  </label>
                  <input
                    type="text"
                    required
                    value={billing.zip}
                    onChange={(e) =>
                      setBilling({ ...billing, zip: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  Country
                </label>
                <input
                  type="text"
                  value={billing.country}
                  onChange={(e) =>
                    setBilling({ ...billing, country: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  PO Number (if applicable)
                </label>
                <input
                  type="text"
                  value={billing.poNumber}
                  onChange={(e) =>
                    setBilling({ ...billing, poNumber: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-electric-500 focus:outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Preferred Payment Method */}
            <div className="mt-6">
              <label className="block text-xs font-medium text-slate-400">
                Preferred Payment Method *
              </label>
              <div className="mt-2 grid gap-3 md:grid-cols-3">
                {[
                  { id: "wire" as const, label: "Wire Transfer", icon: "&#9889;" },
                  { id: "check" as const, label: "Check / Mail", icon: "&#9993;" },
                  { id: "ach" as const, label: "ACH / Direct Deposit", icon: "&#9878;" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() =>
                      setBilling({ ...billing, preferredMethod: method.id })
                    }
                    className={`rounded-lg border p-3 text-center text-sm transition-all ${
                      billing.preferredMethod === method.id
                        ? "border-electric-500 bg-electric-500/10 text-white ring-1 ring-electric-500"
                        : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <span
                      className="text-lg"
                      dangerouslySetInnerHTML={{ __html: method.icon }}
                    />
                    <p className="mt-1 text-xs font-medium">{method.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
            A work order and invoice will be generated and emailed to you
          </div>

          <button
            onClick={handleInvoiceRequest}
            disabled={processing || !canSubmitInvoice}
            className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
              processing
                ? "bg-electric-600 text-white/70"
                : canSubmitInvoice
                ? "bg-electric-500 text-white hover:bg-electric-400"
                : "cursor-not-allowed bg-slate-800 text-slate-500"
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating Work Order...
              </span>
            ) : (
              "Generate Work Order & Request Invoice"
            )}
          </button>
        </>
      )}

      {/* Invoice Submitted Confirmation */}
      {paymentMethod === "invoice" && invoiceSubmitted && (
        <div className="mt-6 rounded-2xl border border-accent-green/30 bg-accent-green/5 p-8 text-center">
          <div className="text-4xl">&#10003;</div>
          <h3 className="mt-4 text-xl font-bold text-accent-green">
            Work Order Generated
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Your work order and invoice have been created and will be sent to{" "}
            <span className="font-medium text-white">{billing.email}</span>.
            Payment is due within 15 business days.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Feedback & Media Release ─── */
function StepFeedback({ onComplete }: { onComplete: (f: FeedbackData) => void }) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    testimonial: "",
    allowPublish: false,
    allowLogo: false,
    allowSocial: false,
    allowVideo: false,
    allowPhotos: false,
    allowCaseStudy: false,
  });

  const canSubmit = feedback.rating > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold">
        Testimonial &amp;{" "}
        <span className="text-electric-400">Media Release</span>
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        We&apos;d love to hear about your experience. Your feedback helps us
        improve and helps other businesses discover private AI.
      </p>

      {/* Star Rating */}
      <div className="mt-8">
        <label className="text-sm font-medium text-slate-300">
          How would you rate your onboarding experience?
        </label>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFeedback({ ...feedback, rating: star })}
              className={`text-3xl transition-colors ${
                star <= feedback.rating
                  ? "text-accent-amber"
                  : "text-slate-700 hover:text-slate-500"
              }`}
            >
              &#9733;
            </button>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="mt-6">
        <label className="text-sm font-medium text-slate-300">
          Your Testimonial (Optional)
        </label>
        <textarea
          rows={4}
          value={feedback.testimonial}
          onChange={(e) =>
            setFeedback({ ...feedback, testimonial: e.target.value })
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-electric-500 focus:outline-none"
          placeholder="Tell us about your experience with TechFides..."
        />
      </div>

      {/* Media Release Agreements */}
      <div className="mt-8 rounded-xl border border-slate-800 bg-navy-900/30 p-6">
        <h3 className="text-sm font-bold text-white">
          Media Release Authorization
        </h3>
        <p className="mt-2 text-xs text-slate-400">
          We respect your privacy. Please indicate which permissions you&apos;re
          comfortable granting. All are optional.
        </p>

        <div className="mt-4 space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={feedback.allowPublish}
              onChange={(e) =>
                setFeedback({ ...feedback, allowPublish: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-electric-500 focus:ring-electric-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-300">
                Publish Testimonial
              </p>
              <p className="text-xs text-slate-500">
                I authorize TechFides to publish my testimonial on their
                website, marketing materials, and proposals.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={feedback.allowLogo}
              onChange={(e) =>
                setFeedback({ ...feedback, allowLogo: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-electric-500 focus:ring-electric-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-300">
                Logo Usage
              </p>
              <p className="text-xs text-slate-500">
                I authorize TechFides to display our company logo on their
                website and marketing materials as a client reference.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={feedback.allowSocial}
              onChange={(e) =>
                setFeedback({ ...feedback, allowSocial: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-electric-500 focus:ring-electric-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-300">
                Social Media Sharing
              </p>
              <p className="text-xs text-slate-500">
                I authorize TechFides to share my testimonial, feedback, and
                our engagement results on their social media channels (LinkedIn,
                X, Facebook, YouTube, Instagram).
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={feedback.allowVideo}
              onChange={(e) =>
                setFeedback({ ...feedback, allowVideo: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-electric-500 focus:ring-electric-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-300">
                Video Testimonial
              </p>
              <p className="text-xs text-slate-500">
                I authorize TechFides to record, produce, and publish video
                testimonials featuring myself or company representatives for
                use on their website, YouTube channel, social media, and
                marketing campaigns.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={feedback.allowPhotos}
              onChange={(e) =>
                setFeedback({ ...feedback, allowPhotos: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-electric-500 focus:ring-electric-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-300">
                Photography &amp; Images
              </p>
              <p className="text-xs text-slate-500">
                I authorize TechFides to take and use photographs of our
                team, facilities, and deployment setup for use in marketing
                materials, website content, presentations, and social media.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={feedback.allowCaseStudy}
              onChange={(e) =>
                setFeedback({ ...feedback, allowCaseStudy: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-electric-500 focus:ring-electric-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-300">
                Case Study Publication
              </p>
              <p className="text-xs text-slate-500">
                I authorize TechFides to create and publish a detailed case
                study about our engagement, including project scope, results,
                metrics, and quotes, for use on their website, proposals, and
                marketing materials.
              </p>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={() => canSubmit && onComplete(feedback)}
        disabled={!canSubmit}
        className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
          canSubmit
            ? "bg-electric-500 text-white hover:bg-electric-400 active:scale-[0.98]"
            : "cursor-not-allowed bg-slate-800 text-slate-500"
        }`}
      >
        Submit Feedback &amp; Complete Onboarding
      </button>

      <button
        onClick={() =>
          onComplete({ ...feedback, rating: feedback.rating || 5 })
        }
        className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-400"
      >
        Skip for now
      </button>
    </div>
  );
}

/* ─── Step 5: Confirmation ─── */
function StepComplete({
  ndaSig,
  sowSig,
  payMethod,
  workOrderNumber,
  serviceId,
}: {
  ndaSig: SignatureData | null;
  sowSig: SignatureData | null;
  payMethod: PaymentMethod;
  workOrderNumber: string;
  serviceId: string;
}) {
  const service = SERVICE_CATALOG.find((s) => s.id === serviceId);

  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10 text-4xl text-accent-green">
        &#10003;
      </div>
      <h2 className="mt-6 text-3xl font-bold">
        Welcome to <span className="text-electric-400">TechFides</span>
      </h2>
      <p className="mt-3 text-slate-400">
        Your onboarding is complete. Here&apos;s a summary of everything
        you&apos;ve signed.
      </p>

      {/* Service Badge */}
      {service && (
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/5 px-4 py-2">
          <span dangerouslySetInnerHTML={{ __html: service.icon }} />
          <span className="text-sm font-semibold text-electric-400">
            {service.name}
          </span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mt-10 grid gap-4 text-left md:grid-cols-2">
        <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
          <div className="flex items-center gap-2">
            <span className="text-accent-green">&#10003;</span>
            <h3 className="font-semibold">NDA Signed</h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Signed by {ndaSig?.name} on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
          <div className="flex items-center gap-2">
            <span className="text-accent-green">&#10003;</span>
            <h3 className="font-semibold">SOW Signed</h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Signed by {sowSig?.name} on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
          <div className="flex items-center gap-2">
            <span className="text-accent-green">&#10003;</span>
            <h3 className="font-semibold">
              {payMethod === "stripe" ? "Payment Processed" : "Work Order Created"}
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {payMethod === "stripe"
              ? "Setup fee processed via Stripe. Receipt sent to your email."
              : `Work order ${workOrderNumber} generated. Invoice sent to your billing email — due within 15 business days.`}
          </p>
        </div>

        <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5">
          <div className="flex items-center gap-2">
            <span className="text-accent-green">&#10003;</span>
            <h3 className="font-semibold">Feedback Submitted</h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Thank you for your testimonial and media permissions.
          </p>
        </div>
      </div>

      {/* Invoice / Receipt */}
      <div className="mt-10 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {payMethod === "stripe" ? "Payment Receipt" : "Invoice"}
          </h3>
          <button
            onClick={() => {
              const el = document.getElementById("invoice-receipt");
              if (el) {
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                  printWindow.document.write(`
                    <html><head><title>${payMethod === "stripe" ? "Receipt" : "Invoice"} - TechFides</title>
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #1e293b; }
                      .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 24px; }
                      .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
                      .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
                      .paid { background: #dcfce7; color: #16a34a; }
                      .pending { background: #fef3c7; color: #d97706; }
                      .details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
                      .details div p:first-child { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
                      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                      th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; color: #64748b; }
                      td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                      .total-row td { font-weight: bold; font-size: 15px; border-top: 2px solid #0ea5e9; border-bottom: none; }
                      .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
                    </style></head><body>
                    ${el.innerHTML}
                    <div class="footer">
                      TechFides LLC &bull; Frisco, Texas &bull; support@techfides.com &bull; techfides.com
                    </div>
                    </body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }
              }
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white active:scale-[0.98]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
        <div
          id="invoice-receipt"
          className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
        >
          {/* Invoice Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-700 pb-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xl font-bold text-electric-400">TechFides</p>
              <p className="mt-1 text-xs text-slate-500">
                TechFides LLC &bull; Frisco, TX 75034
              </p>
              <p className="text-xs text-slate-500">support@techfides.com</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-lg font-bold text-white">
                {payMethod === "stripe" ? "RECEIPT" : "INVOICE"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {workOrderNumber
                  ? `#${workOrderNumber}`
                  : `#INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Date:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                  payMethod === "stripe"
                    ? "bg-accent-green/10 text-accent-green"
                    : "bg-accent-amber/10 text-accent-amber"
                }`}
              >
                {payMethod === "stripe" ? "PAID" : "PENDING"}
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Bill To
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {sowSig?.name || ndaSig?.name}
              </p>
              <p className="text-xs text-slate-400">
                {sowSig?.company || ndaSig?.company}
              </p>
              <p className="text-xs text-slate-400">{sowSig?.title}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Service
              </p>
              <p className="mt-1 text-sm font-semibold text-electric-400">
                {service?.name || "TechFides Service"}
              </p>
              <p className="text-xs text-slate-400">
                {service?.subtitle}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-700">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-3 text-left text-slate-400">Description</th>
                  <th className="p-3 text-right text-slate-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                <tr>
                  <td className="p-3">
                    <p className="font-medium text-white">
                      {service?.name || "TechFides Service"} &mdash; Setup Fee
                    </p>
                    <p className="mt-0.5 text-slate-500">
                      One-time deployment and configuration
                    </p>
                  </td>
                  <td className="p-3 text-right font-semibold text-white">
                    See SOW
                  </td>
                </tr>
                <tr>
                  <td className="p-3">
                    <p className="font-medium text-white">
                      Hardware Installation
                    </p>
                    <p className="mt-0.5 text-slate-500">
                      On-site setup and configuration
                    </p>
                  </td>
                  <td className="p-3 text-right font-semibold text-accent-green">
                    $0.00
                  </td>
                </tr>
                <tr>
                  <td className="p-3">
                    <p className="font-medium text-white">
                      Monthly Retainer
                    </p>
                    <p className="mt-0.5 text-slate-500">
                      Begins upon Go Live per SOW timeline
                    </p>
                  </td>
                  <td className="p-3 text-right text-slate-400">
                    Per SOW
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Info */}
          <div className="mt-5 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Payment Method</span>
              <span className="font-medium text-white">
                {payMethod === "stripe"
                  ? "Credit Card (Stripe)"
                  : "Invoice \u2014 Net 15 Days"}
              </span>
            </div>
            {payMethod === "stripe" && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Transaction Status</span>
                <span className="font-semibold text-accent-green">
                  Payment Complete
                </span>
              </div>
            )}
            {payMethod === "invoice" && (
              <>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Due Date</span>
                  <span className="font-medium text-accent-amber">
                    {new Date(
                      Date.now() + 15 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Work Order</span>
                  <span className="font-mono font-medium text-white">
                    {workOrderNumber}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Terms */}
          <p className="mt-4 text-[10px] text-slate-600">
            This {payMethod === "stripe" ? "receipt" : "invoice"} is issued by
            TechFides LLC. All fees are in USD. For questions, contact
            support@techfides.com. Terms subject to the signed Statement of Work.
          </p>
        </div>
      </div>

      {/* Referral Program */}
      <div className="mt-10 rounded-xl border border-accent-amber/30 bg-accent-amber/5 p-5 text-left sm:p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">&#127873;</span>
          <h3 className="text-lg font-bold">
            Refer &amp; <span className="text-accent-amber">Earn</span>
          </h3>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Know someone who could benefit from private AI? Share your unique
          referral code below. When they sign up, you both get credited:
        </p>
        <div className="mt-3 space-y-1 text-sm text-slate-300">
          <p>
            &bull; <strong className="text-accent-amber">You</strong> get a
            credit toward your next monthly retainer
          </p>
          <p>
            &bull; <strong className="text-accent-amber">They</strong> get a
            discount on their setup fee
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center rounded-lg border border-accent-amber/30 bg-slate-900 px-4 py-3">
            <span className="flex-1 font-mono text-sm font-bold tracking-wider text-accent-amber">
              REF-{(ndaSig?.company || "CLIENT").replace(/\s+/g, "").substring(0, 4).toUpperCase()}-
              {Math.random().toString(36).substring(2, 6).toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => {
              const codeEl = document.querySelector<HTMLElement>(".font-mono.text-accent-amber");
              if (codeEl?.textContent) {
                navigator.clipboard?.writeText(codeEl.textContent.trim());
              }
            }}
            className="rounded-lg bg-accent-amber/10 px-4 py-2.5 text-sm font-semibold text-accent-amber transition-all hover:bg-accent-amber/20 active:scale-[0.98]"
          >
            Copy Code
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Share this code or have them enter it when they start onboarding.
        </p>
      </div>

      {/* Next Steps */}
      {(() => {
        const resourceMap: Record<string, string> = {
          "sovereign-ai": "Technical Project Manager",
          "transformation-management": "AI Transformation Consultant",
          "ai-readiness-360": "AI Program Manager",
          "aegis": "AI Program Manager",
        };
        const resourceTitle = resourceMap[serviceId] || "dedicated project resource";
        const firstPhase = service?.timeline?.[0]?.phase || "Discovery & Assessment";
        const firstDuration = service?.timeline?.[0]?.duration || "Week 1";

        return (
          <div className="mt-8 rounded-xl border border-slate-800 bg-navy-900/30 p-5 text-left sm:p-6">
            <h3 className="text-lg font-bold">What Happens Next</h3>
            <div className="mt-4 space-y-3">
              {[
                {
                  step: "1",
                  text: "You\u2019ll receive a welcome email with copies of all signed documents within the hour.",
                },
                {
                  step: "2",
                  text: `Your ${resourceTitle} will be assigned to you one week before the implementation begins and will reach out to schedule the kickoff call.`,
                },
                {
                  step: "3",
                  text: `${firstPhase} begins in ${firstDuration} per the SOW timeline.`,
                },
                {
                  step: "4",
                  text: "Access your project dashboard at any time through this portal.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-electric-500/10 text-xs font-bold text-electric-400">
                    {item.step}
                  </div>
                  <p className="text-sm text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href="mailto:support@techfides.com"
          className="w-full rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white active:scale-[0.98] sm:w-auto sm:py-2.5"
        >
          Contact Your {(() => {
            const shortMap: Record<string, string> = {
              "sovereign-ai": "TPM",
              "transformation-management": "Consultant",
              "ai-readiness-360": "PM",
              "aegis": "PM",
            };
            return shortMap[serviceId] || "PM";
          })()}
        </a>
        <Link
          href="/"
          className="w-full rounded-lg bg-electric-500 px-6 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-electric-400 active:scale-[0.98] sm:w-auto sm:py-2.5"
        >
          Return to TechFides
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Onboarding Page ─── */
export default function OnboardingClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [ndaSignature, setNdaSignature] = useState<SignatureData | null>(null);
  const [sowSignature, setSowSignature] = useState<SignatureData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [workOrderNum, setWorkOrderNum] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedTierId, setSelectedTierId] = useState("");

  if (!authenticated) {
    return (
      <div className="grid-pattern min-h-screen bg-slate-950">
        <AccessGate
          onAccess={(ref) => {
            if (ref) setReferralCode(ref);
            setAuthenticated(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid-pattern min-h-screen bg-slate-950 px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <img
              src="/images/techfides-logo-white.png"
              alt="TechFides"
              className="h-8 w-auto"
            />
          </Link>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            Client Onboarding
          </span>
        </div>

        <ProgressBar current={currentStep} />

        {/* Step Content */}
        {currentStep === 1 && (
          <StepNDA
            onComplete={(sig) => {
              setNdaSignature(sig);
              setCurrentStep(2);
            }}
          />
        )}
        {currentStep === 2 && (
          <StepSOW
            clientName={ndaSignature?.name || ""}
            onComplete={(sig, serviceId, tierId) => {
              setSowSignature(sig);
              setSelectedServiceId(serviceId);
              setSelectedTierId(tierId);
              setCurrentStep(3);
            }}
          />
        )}
        {currentStep === 3 && (
          <StepPayment
            clientName={ndaSignature?.name || ""}
            clientCompany={ndaSignature?.company || sowSignature?.company || ""}
            serviceId={selectedServiceId}
            tierId={selectedTierId}
            onComplete={(method, wo) => {
              setPaymentMethod(method);
              if (wo) setWorkOrderNum(wo);
              setCurrentStep(4);
            }}
          />
        )}
        {currentStep === 4 && (
          <StepFeedback onComplete={() => setCurrentStep(5)} />
        )}
        {currentStep === 5 && (
          <StepComplete ndaSig={ndaSignature} sowSig={sowSignature} payMethod={paymentMethod} workOrderNumber={workOrderNum} serviceId={selectedServiceId} />
        )}
      </div>
    </div>
  );
}
