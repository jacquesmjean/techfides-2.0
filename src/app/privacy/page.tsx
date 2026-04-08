import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TechFides",
  description:
    "TechFides privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="grid-pattern">
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <div className="mb-4 inline-flex items-center rounded-full border border-slate-600/30 bg-slate-600/10 px-4 py-1.5 text-sm text-slate-400">
          Legal
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Privacy <span className="text-electric-400">Policy</span>
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          Effective Date: January 1, 2026 &middot; Last Updated: January 1, 2026
        </p>

        <div className="mt-12 space-y-10 text-slate-300">
          {/* 1 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              1. Introduction
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              TechFides LLC (&ldquo;TechFides,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
              protecting the privacy and security of your personal information.
              This Privacy Policy describes how we collect, use, disclose, and
              safeguard information when you visit our website at
              techfides.com, use our services, or engage with us in any
              capacity.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              By accessing our website or using our services, you acknowledge
              that you have read and understand this Privacy Policy. If you do
              not agree with this policy, please do not use our website or
              services.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              2. Information We Collect
            </h2>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              2.1 Information You Provide Directly
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              We collect information you voluntarily provide, including: contact
              information (name, email address, phone number, company name) when
              you fill out forms, request a consultation, or apply to our
              Partner Program; business information relevant to assessing your
              AI readiness or deployment needs; and any communications you send
              to us via email, forms, or other channels.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              2.2 Information Collected Automatically
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              When you visit our website, we may automatically collect: device
              and browser information, IP address, pages visited and time spent,
              referring URL and search terms, and cookies and similar tracking
              technologies as described in Section 6 below.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-300">
              2.3 Information from Third Parties
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              We may receive information from business partners, referral
              partners, and publicly available sources to supplement the
              information we collect directly.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              3. How We Use Your Information
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              We use the information we collect to: provide, maintain, and
              improve our services and website; respond to your inquiries and
              fulfill your requests; process Partner Program applications;
              send you relevant updates about our services (with your consent);
              analyze website usage to improve user experience; comply with
              legal obligations and enforce our terms; and protect against
              fraud, unauthorized access, and other security threats.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              4. How We Share Your Information
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              We do not sell, rent, or trade your personal information. We may
              share your information with: service providers who assist us in
              operating our website and delivering services (under strict
              confidentiality agreements); professional advisors such as
              lawyers, accountants, and auditors; law enforcement or regulatory
              authorities when required by law; and in connection with a
              business transaction such as a merger or acquisition.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              5. Data Sovereignty &amp; Client Data
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              TechFides&apos; core mission is data sovereignty. When we deploy
              AI infrastructure on your premises, your operational data remains
              entirely within your control. We do not access, store, process,
              or transmit any client data processed by our deployed AI systems
              unless explicitly authorized in writing by the client. Our
              local deployment model means your proprietary data, client
              records, and AI-processed information never leave your premises.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              6. Cookies &amp; Tracking Technologies
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Our website uses cookies and similar technologies to enhance your
              experience. These include essential cookies required for website
              functionality, analytics cookies to understand how visitors use
              our site, and preference cookies to remember your settings (such
              as language preference). You can control cookie preferences
              through your browser settings. Disabling certain cookies may
              limit your ability to use some features of our website.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              7. Data Security
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              We implement industry-standard technical and organizational
              measures to protect your personal information, including
              encryption in transit (TLS/SSL) and at rest, access controls and
              authentication, regular security assessments, and employee
              training on data protection. While we strive to protect your
              information, no method of electronic transmission or storage is
              100% secure.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              8. Data Retention
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              We retain personal information only as long as necessary to
              fulfill the purposes for which it was collected, comply with
              legal obligations, resolve disputes, and enforce our agreements.
              When information is no longer needed, we securely delete or
              anonymize it.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              9. Your Rights
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Depending on your jurisdiction, you may have the right to: access
              the personal information we hold about you; request correction of
              inaccurate information; request deletion of your personal
              information; object to or restrict processing of your
              information; data portability; and withdraw consent where
              processing is based on consent. To exercise these rights, contact
              us at{" "}
              <a
                href="mailto:engage@techfides.com"
                className="text-electric-400 hover:text-electric-300"
              >
                engage@techfides.com
              </a>
              . We will respond within 30 days.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              10. International Transfers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              TechFides operates from the United States, Mexico, and Gabon.
              If you access our website from outside these countries, your
              information may be transferred to and processed in the United
              States. We take appropriate safeguards to ensure your information
              is protected in accordance with this Privacy Policy regardless of
              where it is processed.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              11. Children&apos;s Privacy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Our services are not directed to individuals under 18 years of
              age. We do not knowingly collect personal information from
              children. If you believe we have collected information from a
              child, please contact us immediately.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              12. Changes to This Policy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated effective date. We
              encourage you to review this policy periodically. Continued use of
              our website or services after changes constitutes acceptance of
              the updated policy.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              13. Contact Us
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              If you have questions or concerns about this Privacy Policy or our
              data practices, please contact us:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-navy-900/50 p-6">
              <p className="text-sm font-semibold text-white">TechFides LLC</p>
              <p className="mt-1 text-sm text-slate-400">Frisco, Texas, USA</p>
              <p className="mt-1 text-sm text-slate-400">
                Email:{" "}
                <a
                  href="mailto:engage@techfides.com"
                  className="text-electric-400 hover:text-electric-300"
                >
                  engage@techfides.com
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
