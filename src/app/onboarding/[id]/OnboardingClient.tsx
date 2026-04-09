"use client";

import { useState } from "react";
import Link from "next/link";

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
            href="mailto:engage@techfides.com"
            className="text-electric-400 hover:text-electric-300"
          >
            engage@techfides.com
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
const SERVICE_CATALOG = [
  {
    id: "sovereign-ai",
    name: "Sovereign AI Deployment",
    subtitle: "The TechFides Local Stack",
    icon: "&#9889;",
    description:
      "End-to-end deployment of enterprise AI on your local infrastructure. Full data sovereignty with no cloud dependency.",
    scope: [
      "Assessment of current IT infrastructure and AI readiness",
      "Selection and configuration of AI models (Llama 3, Mistral, Phi, etc.) based on client requirements",
      "Deployment of the TechFides Local Stack on client-owned hardware",
      "Integration with existing business workflows and applications",
      "Staff training and comprehensive documentation",
      "Ongoing support and optimization during the retainer period",
    ],
    deliverables: [
      "Fully deployed and configured AI infrastructure on local hardware",
      "Custom model fine-tuning for client-specific use cases",
      "Integration documentation and API reference",
      "Staff training sessions (recorded for future reference)",
      "90-day post-deployment support plan",
    ],
    timeline: [
      { phase: "Discovery & Assessment", duration: "Week 1\u20132", milestone: "Infrastructure Report" },
      { phase: "Configuration & Setup", duration: "Week 3\u20134", milestone: "Stack Deployed" },
      { phase: "Integration & Testing", duration: "Week 5\u20136", milestone: "UAT Complete" },
      { phase: "Training & Handoff", duration: "Week 7\u20138", milestone: "Go Live" },
    ],
    clientResponsibilities:
      "Client shall: (a) provide timely access to hardware, network, and personnel; (b) designate a primary point of contact; (c) ensure hardware meets minimum specifications as outlined; (d) complete review cycles within 5 business days to maintain the timeline.",
  },
  {
    id: "ai-readiness-360",
    name: "AI Readiness 360\u2122",
    subtitle: "Strategic Assessment",
    icon: "&#128269;",
    description:
      "Comprehensive 360-degree assessment of your organization\u2019s AI readiness across technology, people, process, and data.",
    scope: [
      "Executive interviews and stakeholder alignment sessions",
      "Technology infrastructure audit and gap analysis",
      "Data maturity and governance assessment",
      "Workforce readiness and skills gap evaluation",
      "Process optimization opportunity mapping",
      "Competitive AI landscape analysis for your vertical",
    ],
    deliverables: [
      "AI Readiness Scorecard with detailed ratings across 8 dimensions",
      "Executive summary and board-ready presentation",
      "Technology roadmap with prioritized recommendations",
      "Data governance framework and action plan",
      "Training needs assessment and upskilling roadmap",
      "ROI projections and business case for AI investment",
    ],
    timeline: [
      { phase: "Kickoff & Stakeholder Interviews", duration: "Week 1", milestone: "Kickoff Complete" },
      { phase: "Infrastructure & Data Audit", duration: "Week 2\u20133", milestone: "Audit Report" },
      { phase: "Analysis & Scoring", duration: "Week 4", milestone: "Scorecard Draft" },
      { phase: "Roadmap & Recommendations", duration: "Week 5", milestone: "Final Deliverable" },
      { phase: "Executive Presentation", duration: "Week 6", milestone: "Board Presentation" },
    ],
    clientResponsibilities:
      "Client shall: (a) provide access to key stakeholders for interviews; (b) grant access to IT infrastructure documentation; (c) share relevant data governance policies; (d) designate an internal champion to coordinate schedules and access.",
  },
  {
    id: "transformation-management",
    name: "AI Transformation Management",
    subtitle: "Enterprise Change Leadership",
    icon: "&#128640;",
    description:
      "End-to-end transformation management for organizations implementing AI at scale. From strategy through execution.",
    scope: [
      "Transformation strategy development and executive alignment",
      "Change management framework design and implementation",
      "Program management office (PMO) setup and governance",
      "Multi-workstream coordination and dependency management",
      "Organizational change management and communication planning",
      "KPI framework design and performance tracking",
      "Risk management and mitigation planning",
    ],
    deliverables: [
      "Transformation roadmap with phased implementation plan",
      "Change management playbook customized to your organization",
      "PMO governance framework and decision-making matrices",
      "Stakeholder communication plan and executive dashboards",
      "Training curriculum and organizational readiness assessment",
      "Monthly progress reports with KPI tracking",
      "Risk register with mitigation strategies",
    ],
    timeline: [
      { phase: "Strategy & Planning", duration: "Month 1", milestone: "Transformation Charter" },
      { phase: "Foundation & Governance", duration: "Month 2", milestone: "PMO Operational" },
      { phase: "Wave 1 Execution", duration: "Month 3\u20134", milestone: "First Wins Delivered" },
      { phase: "Wave 2 Execution", duration: "Month 5\u20136", milestone: "Scale Achieved" },
      { phase: "Optimization & Transition", duration: "Month 7\u20138", milestone: "Handoff Complete" },
    ],
    clientResponsibilities:
      "Client shall: (a) provide executive sponsorship and active participation; (b) allocate internal resources as agreed; (c) make timely decisions per governance framework; (d) fund and support required organizational changes; (e) provide access to all relevant systems and data.",
  },
  {
    id: "tedos",
    name: "TEDOS\u2122 OS Platform",
    subtitle: "Technology-Enabled Digital Operating System",
    icon: "&#9881;",
    description:
      "Implementation of the TechFides proprietary digital operating system \u2014 a comprehensive framework for digitizing and optimizing enterprise operations.",
    scope: [
      "Current-state operational assessment and process mapping",
      "TEDOS\u2122 platform configuration and customization",
      "Digital workflow design and automation implementation",
      "Integration with existing enterprise systems (ERP, CRM, HRIS, etc.)",
      "AI-powered analytics and decision-support layer deployment",
      "User training and adoption management",
      "Ongoing platform optimization and feature releases",
    ],
    deliverables: [
      "Fully configured TEDOS\u2122 OS platform on client infrastructure",
      "Digital process maps for all in-scope operational workflows",
      "Custom automation rules and AI decision-support models",
      "Enterprise system integration (APIs and data pipelines)",
      "Operations dashboard with real-time KPI tracking",
      "User training program and certification for key personnel",
      "12-month platform optimization and support plan",
    ],
    timeline: [
      { phase: "Assessment & Design", duration: "Month 1\u20132", milestone: "Blueprint Approved" },
      { phase: "Platform Build & Config", duration: "Month 3\u20134", milestone: "Platform Ready" },
      { phase: "Integration & Migration", duration: "Month 5\u20136", milestone: "Systems Connected" },
      { phase: "UAT & Training", duration: "Month 7\u20138", milestone: "UAT Sign-off" },
      { phase: "Go Live & Stabilization", duration: "Month 9\u201310", milestone: "Go Live" },
      { phase: "Optimization", duration: "Month 11\u201312", milestone: "Optimization Report" },
    ],
    clientResponsibilities:
      "Client shall: (a) provide dedicated project team with decision-making authority; (b) grant access to all in-scope systems and data; (c) allocate internal IT resources for integration support; (d) participate in weekly status meetings; (e) complete UAT within agreed timelines; (f) fund required infrastructure upgrades.",
  },
];

/* ─── Step 2: SOW ─── */
function StepSOW({
  clientName,
  onComplete,
}: {
  clientName: string;
  onComplete: (sig: SignatureData, serviceId: string) => void;
}) {
  const [selectedService, setSelectedService] = useState("");
  const [signature, setSignature] = useState<SignatureData>({
    name: clientName,
    title: "",
    company: "",
    date: new Date().toISOString(),
    agreed: false,
  });

  const service = SERVICE_CATALOG.find((s) => s.id === selectedService);

  const canSubmit =
    selectedService &&
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
          Select Your Service *
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SERVICE_CATALOG.map((svc) => (
            <button
              key={svc.id}
              onClick={() => setSelectedService(svc.id)}
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
          <p className="mt-2 text-slate-400">
            As agreed in the proposal, fees are structured as a fixed-scope
            Statement of Work. No hourly billing. The setup fee is due upon
            signature; the monthly retainer begins upon Go Live.
          </p>

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
        onClick={() => canSubmit && service && onComplete(signature, service.id)}
        disabled={!canSubmit}
        className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
          canSubmit
            ? "bg-electric-500 text-white hover:bg-electric-400 active:scale-[0.98]"
            : "cursor-not-allowed bg-slate-800 text-slate-500"
        }`}
      >
        {selectedService
          ? "Sign SOW & Continue to Payment"
          : "Select a Service to Continue"}
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
}: {
  onComplete: (method: PaymentMethod, workOrder?: string) => void;
  clientName: string;
  clientCompany: string;
}) {
  const [processing, setProcessing] = useState(false);
  const [selectedTier, setSelectedTier] = useState("sovereign-m");
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

  const tiers = [
    {
      id: "silver",
      name: "Silver",
      desc: "Solo / Boutique",
      setup: "$5,000",
      monthly: "$500/mo",
    },
    {
      id: "gold",
      name: "Gold",
      desc: "Single-Site Mid",
      setup: "$10,000",
      monthly: "$1,000/mo",
    },
    {
      id: "platinum",
      name: "Platinum",
      desc: "Multi-Site / Enterprise",
      setup: "$15,000+",
      monthly: "$2,500+/mo",
    },
  ];

  const selectedTierData = tiers.find((t) => t.id === selectedTier);

  const handleStripePayment = () => {
    setProcessing(true);
    // In production: redirect to Stripe Checkout or use Stripe Elements
    // window.location.href = `/api/stripe/checkout?tier=${selectedTier}`;
    setTimeout(() => {
      setProcessing(false);
      onComplete("stripe");
    }, 2000);
  };

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

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold">
        Setup <span className="text-electric-400">Payment</span>
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Select your tier and choose how you&apos;d like to pay.
      </p>

      {/* Tier Selection */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`rounded-xl border p-5 text-left transition-all ${
              selectedTier === tier.id
                ? "border-electric-500 bg-electric-500/10 ring-1 ring-electric-500"
                : "border-slate-700 bg-slate-900 hover:border-slate-600"
            }`}
          >
            <p className="text-sm font-bold">{tier.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{tier.desc}</p>
            <p className="mt-3 text-xl font-bold text-electric-400">
              {tier.setup}
            </p>
            <p className="text-xs text-slate-400">Setup fee (one-time)</p>
            <p className="mt-2 text-sm font-semibold text-slate-300">
              {tier.monthly}
            </p>
            <p className="text-xs text-slate-400">Monthly retainer</p>
          </button>
        ))}
      </div>

      {/* Installation badge */}
      <div className="mt-6 rounded-lg border border-accent-green/30 bg-accent-green/5 p-4 text-center">
        <p className="text-sm font-bold text-accent-green">
          Installation: $0
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Hardware installation and on-site setup is included at no additional
          cost.
        </p>
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
              Setup Fee ({selectedTierData?.name})
            </span>
            <span className="font-semibold">{selectedTierData?.setup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Installation</span>
            <span className="font-semibold text-accent-green">$0</span>
          </div>
          <div className="border-t border-slate-700 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold">
                {paymentMethod === "stripe" ? "Due Today" : "Invoice Amount"}
              </span>
              <span className="text-lg font-bold text-electric-400">
                {selectedTierData?.setup}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Monthly retainer of {selectedTierData?.monthly} begins upon Go Live.
          {paymentMethod === "stripe"
            ? " Processed securely via Stripe."
            : " Invoiced per your selected payment method."}
        </p>
      </div>

      {/* ── Stripe Payment ── */}
      {paymentMethod === "stripe" && (
        <>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            Secured by Stripe &bull; PCI DSS Compliant &bull; 256-bit SSL
          </div>

          <button
            onClick={handleStripePayment}
            disabled={processing}
            className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
              processing
                ? "bg-electric-600 text-white/70"
                : "bg-electric-500 text-white hover:bg-electric-400"
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
                Processing Payment...
              </span>
            ) : (
              "Pay Setup Fee via Stripe"
            )}
          </button>
        </>
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
        improve and helps other businesses discover sovereign AI.
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
                      TechFides LLC &bull; Frisco, Texas &bull; engage@techfides.com &bull; techfides.com
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
              <p className="text-xs text-slate-500">engage@techfides.com</p>
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
            engage@techfides.com. Terms subject to the signed Statement of Work.
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
          Know someone who could benefit from sovereign AI? Share your unique
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
          "tedos": "AI Program Manager",
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
          href="mailto:engage@techfides.com"
          className="w-full rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white active:scale-[0.98] sm:w-auto sm:py-2.5"
        >
          Contact Your {(() => {
            const shortMap: Record<string, string> = {
              "sovereign-ai": "TPM",
              "transformation-management": "Consultant",
              "ai-readiness-360": "PM",
              "tedos": "PM",
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
            onComplete={(sig, serviceId) => {
              setSowSignature(sig);
              setSelectedServiceId(serviceId);
              setCurrentStep(3);
            }}
          />
        )}
        {currentStep === 3 && (
          <StepPayment
            clientName={ndaSignature?.name || ""}
            clientCompany={ndaSignature?.company || sowSignature?.company || ""}
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
