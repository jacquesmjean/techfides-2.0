import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TechFides",
  description:
    "TechFides terms of service — the terms and conditions governing use of our website and services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="grid-pattern">
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <div className="mb-4 inline-flex items-center rounded-full border border-slate-600/30 bg-slate-600/10 px-4 py-1.5 text-sm text-slate-400">
          Legal
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Terms of <span className="text-electric-400">Service</span>
        </h1>
        <p className="mt-4 text-sm text-slate-400">
          Effective Date: January 1, 2026 &middot; Last Updated: April 15, 2026
        </p>

        <div className="mt-12 space-y-10 text-slate-300">
          {/* 1 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              1. Acceptance of Terms
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally
              binding agreement between you (&ldquo;Client,&rdquo;
              &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and TechFides LLC
              (&ldquo;TechFides,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
              or &ldquo;our&rdquo;), a company registered in the State of
              Texas, United States. By accessing our website at techfides.com
              or engaging our services, you agree to be bound by these Terms.
              If you do not agree, you must not use our website or services.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              2. Services Overview
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              TechFides provides enterprise AI deployment, consulting, and
              technology transformation services, including but not limited to:
              sovereign AI infrastructure deployment on local hardware
              (&ldquo;TechFides Local Stack&rdquo;); AI Readiness 360&trade;
              assessment and risk evaluation; AI Transformation Management
              services; AEGIS Intelligence Operating System;
              and referral partner program management. Specific service
              deliverables, timelines, and pricing are defined in individual
              Statements of Work (SOW) or service agreements executed between
              TechFides and the Client.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              3. Eligibility
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Our services are intended for businesses and organizations. By
              engaging our services, you represent that you are at least 18
              years of age, have the legal authority to bind your organization
              to these Terms, and are not prohibited from receiving our services
              under applicable laws.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              4. Client Responsibilities
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              As a Client, you agree to: provide accurate and complete
              information as required for service delivery; ensure that
              necessary hardware, network infrastructure, and access
              credentials are available for on-premises deployments as
              specified in the SOW; designate authorized personnel to
              interface with TechFides during engagements; comply with all
              applicable laws and regulations related to data handling, AI
              usage, and industry-specific compliance requirements; and make
              timely payments as specified in the applicable SOW or invoice.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              5. Pricing &amp; Payment
            </h2>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              5.1 Fee Structure
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              All pricing is fixed-scope and defined in the applicable SOW.
              TechFides does not bill on an hourly basis unless explicitly
              stated. Published pricing on our website is indicative and
              subject to final SOW terms.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              5.2 Payment Terms
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Unless otherwise specified in the SOW: setup fees are due upon
              SOW execution; monthly retainers are billed on the first of each
              month; consulting engagement fees follow the payment schedule in
              the SOW; and all invoices are due within 30 days of issuance.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              5.3 Late Payments
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Late payments may incur a charge of 1.5% per month on the
              outstanding balance. TechFides reserves the right to suspend
              services if payment is overdue by more than 30 days.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              6. Data Sovereignty &amp; Ownership
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              TechFides&apos; fundamental principle is that your data belongs to
              you. All client data processed by TechFides-deployed AI systems
              remains the exclusive property of the Client. TechFides does not
              access, copy, transmit, or retain any client data processed by
              deployed systems unless explicitly authorized in writing. AI
              models deployed on your hardware operate locally — no data
              leaves your premises. Upon termination of services, all
              TechFides-provided configurations, credentials, and access are
              returned or securely destroyed at the Client&apos;s direction.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              7. Intellectual Property
            </h2>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              7.1 TechFides IP
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              All TechFides proprietary methodologies, frameworks, tools, and
              documentation — including AI Readiness 360&trade;, AEGIS,
              and the TechFides Local Stack architecture — remain the
              exclusive intellectual property of TechFides LLC. Clients are
              granted a non-exclusive, non-transferable license to use
              TechFides deliverables for their internal business operations.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              7.2 Client IP
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              All client data, business processes, and proprietary information
              shared during engagements remain the exclusive property of the
              Client. TechFides claims no ownership over client-generated
              content or AI outputs produced by deployed systems.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              7.3 Open-Source Models
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              AI models deployed as part of TechFides services (e.g., Llama,
              Mistral, CodeLlama) are subject to their respective open-source
              licenses. TechFides does not claim ownership of third-party AI
              models and will advise clients on applicable license obligations.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              8. Confidentiality
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Both parties agree to maintain the confidentiality of any
              proprietary or sensitive information disclosed during the
              engagement. Confidential information includes business strategies,
              technical architectures, financial information, client lists, and
              any information marked as confidential. This obligation survives
              termination of services for a period of three (3) years.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              9. Warranties &amp; Disclaimers
            </h2>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              9.1 Service Warranty
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              TechFides warrants that services will be performed in a
              professional and workmanlike manner consistent with industry
              standards. Deployed AI infrastructure will function as specified
              in the applicable SOW.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              9.2 Disclaimers
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              EXCEPT AS EXPRESSLY STATED HEREIN, TECHFIDES PROVIDES SERVICES
              &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER
              EXPRESS OR IMPLIED. TECHFIDES DOES NOT GUARANTEE SPECIFIC BUSINESS
              OUTCOMES, ROI PROJECTIONS, OR AI MODEL PERFORMANCE. ROI
              CALCULATIONS PROVIDED ON OUR WEBSITE ARE ESTIMATES BASED ON
              INDUSTRY AVERAGES AND MAY VARY.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              10. Limitation of Liability
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TECHFIDES&apos; TOTAL
              LIABILITY ARISING FROM OR RELATED TO THESE TERMS OR ANY SOW SHALL
              NOT EXCEED THE TOTAL FEES PAID BY THE CLIENT TO TECHFIDES DURING
              THE TWELVE (12) MONTHS PRECEDING THE CLAIM. IN NO EVENT SHALL
              TECHFIDES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL,
              SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA,
              OR BUSINESS INTERRUPTION.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              11. Indemnification
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              You agree to indemnify and hold harmless TechFides, its officers,
              directors, employees, and agents from any claims, damages,
              losses, or expenses (including reasonable attorneys&apos; fees)
              arising from: your breach of these Terms; your misuse of deployed
              AI systems; your violation of any applicable law or regulation;
              or any third-party claim related to your use of TechFides
              services.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              12. Term &amp; Termination
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              These Terms remain in effect as long as you use our website or
              services. Either party may terminate a service engagement as
              specified in the applicable SOW. TechFides may suspend or
              terminate access to the website or services immediately if you
              breach these Terms. Upon termination, all outstanding fees become
              immediately due and payable, and the provisions of Sections 6, 7,
              8, 9, 10, 11, and 14 shall survive.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              13. Partner Program Terms
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Participation in the TechFides Referral Partner Program is
              subject to application approval. Commission structures are as
              published on our Partner Portal and may be updated with 30
              days&apos; notice. Commissions are earned when a referred client
              executes a SOW and makes initial payment. TechFides reserves the
              right to modify, suspend, or terminate the Partner Program at any
              time with 30 days&apos; notice to active partners.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              14. Governing Law &amp; Dispute Resolution
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              These Terms are governed by the laws of the State of Texas,
              United States, without regard to conflict of law principles. Any
              dispute arising from these Terms shall first be subject to good
              faith negotiation for a period of 30 days. If unresolved,
              disputes shall be submitted to binding arbitration in Collin
              County, Texas, under the rules of the American Arbitration
              Association. Each party bears its own costs unless the arbitrator
              determines otherwise.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              15. Modifications
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              TechFides reserves the right to modify these Terms at any time.
              Changes will be posted on this page with an updated effective
              date. For material changes, we will provide notice via email or
              prominent website notification. Continued use of our website or
              services after modifications constitutes acceptance of the
              updated Terms.
            </p>
          </div>

          {/* 16 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              16. Miscellaneous
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions shall continue in full force and effect. No
              waiver of any term shall be deemed a further or continuing waiver.
              These Terms, together with the applicable SOW, constitute the
              entire agreement between the parties. Nothing in these Terms
              creates a partnership, joint venture, or agency relationship
              between TechFides and the Client.
            </p>
          </div>

          {/* 17 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              17. Contact Us
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-navy-900/50 p-6">
              <p className="text-sm font-semibold text-white">TechFides LLC</p>
              <p className="mt-1 text-sm text-slate-400">Frisco, Texas, USA</p>
              <p className="mt-1 text-sm text-slate-400">
                Email:{" "}
                <a
                  href="mailto:legal@techfides.com"
                  className="text-electric-400 hover:text-electric-300"
                >
                  legal@techfides.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8">
          <Link
            href="/"
            className="text-sm text-electric-400 hover:text-electric-300"
          >
            &larr; Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
