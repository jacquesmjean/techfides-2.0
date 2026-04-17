import type { Metadata } from "next";

const PAGE_URL = "https://techfides.com/consulting/aegis";
const TITLE = "AEGIS | AI Governance Operating System for Mid-Market Companies";
const DESCRIPTION =
  "AEGIS installs a governed AI operating model in 90 days — 18 named artifacts, fixed-scope engagements from $15K, and a managed-governance retainer. Built for mid-market and professional firms in DFW and beyond.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "AEGIS",
    "AI governance",
    "AI governance consulting",
    "AI governance operating model",
    "AI readiness assessment",
    "AI acceptable use policy",
    "AI risk register",
    "shadow AI inventory",
    "NIST AI RMF consulting",
    "managed AI governance",
    "mid-market AI adoption",
    "AI governance Dallas Fort Worth",
    "AI governance for professional services",
    "hybrid workforce operating model",
    "AI governance framework",
    "enterprise AI operating system",
    "AI compliance consulting",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: PAGE_URL,
      es: PAGE_URL,
      fr: PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "TechFides",
    title: TITLE,
    description:
      "18 named artifacts. 90-day activation. Managed-governance retainer. AEGIS is the AI governance operating system for mid-market companies and professional firms.",
    images: [
      {
        url: "/images/techfides-logo.png",
        width: 1200,
        height: 630,
        alt: "AEGIS — AI Governance Operating System by TechFides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tech_fides",
    creator: "@tech_fides",
    title: TITLE,
    description:
      "18 named artifacts. 90-day activation. Managed-governance retainer. AI governance operating system for mid-market companies.",
    images: ["/images/techfides-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "AEGIS — AI Governance Operating System",
  alternateName: "AEGIS",
  serviceType: "AI governance and managed operating model",
  category: "Governed AI Operating Services",
  description:
    "A fixed-scope advisory and managed service that installs six governance and operating layers across a mid-market organization in 90 days, backed by a monthly managed-governance retainer.",
  url: PAGE_URL,
  provider: {
    "@type": "Organization",
    name: "TechFides",
    url: "https://techfides.com",
    areaServed: [
      { "@type": "City", name: "Dallas" },
      { "@type": "City", name: "Fort Worth" },
      { "@type": "City", name: "Frisco" },
      { "@type": "AdministrativeArea", name: "Texas" },
      { "@type": "Country", name: "United States" },
    ],
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType:
      "Mid-market companies (50–2,000 employees), professional services firms, regulated industries, multi-site enterprises",
  },
  brand: { "@type": "Brand", name: "AEGIS" },
  termsOfService: "https://techfides.com/terms",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AEGIS Engagement Tiers",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Diagnostic",
        description:
          "Two-week AI governance diagnostic across all six AEGIS layers, with shadow-AI inventory, prioritized 90-day roadmap, board-ready deck, and scoped proposal for Core Implementation.",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          minPrice: 15000,
          maxPrice: 35000,
        },
        eligibleDuration: {
          "@type": "QuantitativeValue",
          value: 2,
          unitText: "weeks",
        },
      },
      {
        "@type": "Offer",
        name: "Core Implementation",
        description:
          "Full 18-artifact AEGIS deployment in 90 days for mid-market and professional firms. Includes mandatory managed-governance retainer at $5K–$10K/month.",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          minPrice: 75000,
          maxPrice: 150000,
        },
        eligibleDuration: {
          "@type": "QuantitativeValue",
          value: 90,
          unitText: "days",
        },
      },
      {
        "@type": "Offer",
        name: "Enterprise Execution",
        description:
          "Organization-wide AEGIS deployment across business units or sites for regulated industries (HIPAA, SOC 2, NIST AI RMF). Includes mandatory $15K/month managed-governance retainer with named fractional CISO and dedicated program manager.",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          minPrice: 150000,
          maxPrice: 400000,
        },
      },
      {
        "@type": "Offer",
        name: "Government & Institutional",
        description:
          "FedRAMP-aligned deployment with private data controls, multi-agency coordination, dedicated security team, and custom retainer structure.",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
        },
      },
    ],
  },
  serviceOutput: [
    "AI Acceptable Use Policy",
    "RACI for AI Decisions",
    "AI Risk Register",
    "Data Classification & AI Data Map",
    "Vendor & Tool Risk Assessments",
    "AI Incident Response Runbook",
    "AI Inventory Dashboard",
    "Shadow AI Scan Report",
    "Value & Spend Tracker",
    "Governed Workflow Automations",
    "Prompt & Template Library",
    "SOP Updates for AI-Assisted Work",
    "Quarterly Governance Review Template",
    "Adoption Playbook",
    "Role-Based Training Curriculum",
    "Executive AI Dashboard",
    "Board Reporting Pack",
    "12-Month AI Roadmap",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AEGIS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AEGIS is a fixed-scope advisory and managed service that installs an AI governance operating model across six layers — Governance, Security/Trust/Resilience, Intelligence, Execution, Operations, and Leadership — in 90 days. It is delivered as a service, not a software product, and closes into a monthly managed-governance retainer.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AEGIS cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AEGIS engagements run from $15K–$35K for a two-week Diagnostic, $75K–$150K for Core Implementation, and $150K–$400K for Enterprise Execution. Core and Enterprise tiers require a managed-governance retainer ($5K–$15K per month) so the operating model we install continues to run after activation.",
      },
    },
    {
      "@type": "Question",
      name: "Who is AEGIS for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mid-market companies (50–2,000 employees), professional services firms (legal, accounting, engineering), regulated industries (healthcare, financial services), and multi-site enterprises whose leadership has been tasked with responsible AI adoption and needs a defensible governance operating model.",
      },
    },
    {
      "@type": "Question",
      name: "What deliverables do I get from AEGIS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every Core Implementation ships the same 18 named artifacts across six modules: AEGIS Policy Core (AI Acceptable Use Policy, RACI for AI Decisions, AI Risk Register), AEGIS Shield (Data Map, Vendor Risk Assessments, AI Incident Response Runbook), AEGIS Signal (AI Inventory Dashboard, Shadow AI Scan Report, Value & Spend Tracker), AEGIS Deploy (Governed Workflow Automations, Prompt Library, SOP Updates), AEGIS Cadence (Quarterly Review Template, Adoption Playbook, Training Curriculum), and AEGIS Brief (Executive Dashboard, Board Reporting Pack, 12-Month AI Roadmap).",
      },
    },
    {
      "@type": "Question",
      name: "How long does an AEGIS engagement take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Two weeks for a Diagnostic. 90 days for a Core Implementation to reach a fully activated operating state, at which point the engagement closes into an ongoing managed-governance retainer. No engagement runs longer than 90 days to first operating state.",
      },
    },
    {
      "@type": "Question",
      name: "Why is a retainer required for AEGIS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AEGIS installs a running governance operating model — policies, dashboards, risk registers, review cadences, and governed workflows — that requires maintenance, quarterly reviews, and annual re-diagnostics to stay valuable. Without a retainer, the artifacts degrade and the operating model stalls. The retainer is how the system keeps running, not an upsell.",
      },
    },
    {
      "@type": "Question",
      name: "How does AEGIS differ from an AI governance SaaS tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI governance SaaS tools provide software without the operating model; you still need consultants to install policies, train staff, and stand up review cadences. AEGIS is the managed service that installs that operating model and leaves a governance function behind. It is tool-agnostic and runs on top of your existing AI stack (Microsoft Copilot, ChatGPT Enterprise, Google Workspace, n8n, Zapier, Power Automate).",
      },
    },
    {
      "@type": "Question",
      name: "Which regulatory frameworks does AEGIS support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AEGIS artifacts map to NIST AI RMF, SOC 2 Type II, HIPAA, GDPR, ISO 27001, and FedRAMP-aligned controls so your auditors, insurers, and board can read them directly. Enterprise Execution engagements include explicit regulatory mapping for your industry.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://techfides.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Consulting",
      item: "https://techfides.com/consulting",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AEGIS",
      item: PAGE_URL,
    },
  ],
};

export default function AEGISLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
