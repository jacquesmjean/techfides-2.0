import { SolutionPage } from "@/components/SolutionPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI for Law Firms | TechFides",
  description:
    "Privilege-protected AI deployed on your firm's hardware. Attorney-client confidentiality, legal research, document review, and drafting — with zero data leakage.",
};

export default function LegalPage() {
  return (
    <SolutionPage
      vertical="Legal"
      tagline="AI for Law Firms &amp; Legal Teams"
      headline={`Privilege-Protected\nAI for Legal`}
      subheadline="Attorney-client privilege isn't optional. Every cloud API call with case data is a potential breach of that privilege. TechFides deploys AI on your firm's own hardware — so confidential information never leaves your building."
      painPoints={[
        {
          icon: "\u{1F6A8}",
          title: "Privilege at Risk",
          description:
            "Sending case data to OpenAI, Google, or any cloud API means your client's privileged information now sits on someone else's server. One breach, one subpoena, and privilege is waived.",
        },
        {
          icon: "\u{1F4B8}",
          title: "The Cloud Tax",
          description:
            "Per-seat AI subscriptions across your firm add up to $5K-15K/month. That's $60K-180K/year for tools you don't own and data pipelines you don't control.",
        },
        {
          icon: "\u{1F512}",
          title: "Vendor Lock-In",
          description:
            "When your AI vendor changes pricing, shuts down a model, or gets acquired — your workflows break overnight. Your firm's productivity shouldn't depend on someone else's roadmap.",
        },
      ]}
      features={[
        {
          title: "Privileged Document Review",
          description:
            "AI-powered document review and analysis that runs entirely on your local network. Review contracts, case files, and discovery documents without any data leaving your firm's infrastructure.",
        },
        {
          title: "Legal Research Assistant",
          description:
            "A local AI research tool trained on legal databases and your firm's own precedent library. Get case law citations, statute summaries, and argument analysis — all on-premise.",
        },
        {
          title: "Contract Drafting & Analysis",
          description:
            "Generate first drafts, redline existing contracts, and flag non-standard clauses. The model learns your firm's preferred language and clause library over time.",
        },
        {
          title: "Client Communication AI",
          description:
            "Draft client updates, summarize case progress, and generate billing narratives. Trained on your firm's communication style and client relationship protocols.",
        },
        {
          title: "eDiscovery Acceleration",
          description:
            "Process and categorize thousands of documents for relevance, privilege, and responsiveness. Cut eDiscovery timelines by 60-80% without exposing a single document to the cloud.",
        },
        {
          title: "Compliance & Audit Trail",
          description:
            "Full logging of every AI interaction. Know exactly what was queried, by whom, and when. Complete audit trail for bar association compliance and malpractice protection.",
        },
      ]}
      complianceBadges={[
        "Attorney-Client Privilege",
        "ABA Model Rule 1.6",
        "SOC 2 Ready",
        "Work Product Doctrine",
        "Duty of Competence (1.1)",
      ]}
      ctaText="Get a Firm Assessment"
      testimonialQuote="We were spending $12,000/month on AI tools and sending client data to three different cloud providers. TechFides gave us a single local stack that's faster, cheaper, and doesn't keep me up at night worrying about privilege."
      testimonialAuthor="Managing Partner"
      testimonialRole="Mid-Size Litigation Firm, 45 Attorneys"
    />
  );
}
