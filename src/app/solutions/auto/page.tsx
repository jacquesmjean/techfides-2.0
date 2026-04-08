import { SolutionPage } from "@/components/SolutionPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI for Auto Dealerships & Shops | TechFides",
  description:
    "Local AI infrastructure for auto dealerships and service centers. Diagnostics, inventory, customer engagement, and DMS integration — with FTC Safeguards compliance built in.",
};

export default function AutoPage() {
  return (
    <SolutionPage
      vertical="Auto"
      tagline="AI for Dealerships &amp; Service Centers"
      headline={`Sovereign AI for\nthe Auto Industry`}
      subheadline="Customer financial data, service histories, and deal jackets contain some of the most sensitive information in retail. The FTC Safeguards Rule now demands you protect it. TechFides deploys AI on your lot's own hardware — so customer data stays under your roof."
      painPoints={[
        {
          icon: "\u{1F697}",
          title: "FTC Safeguards Compliance",
          description:
            "The updated FTC Safeguards Rule requires auto dealers to implement comprehensive data security programs. Every cloud AI call with customer financial data increases your compliance exposure and audit risk.",
        },
        {
          icon: "\u{1F4B0}",
          title: "DMS Data Silos",
          description:
            "Your DMS, CRM, service scheduler, and parts inventory don't talk to each other — and cloud AI can only see what you upload. Local AI integrates directly with every system on your network.",
        },
        {
          icon: "\u{1F504}",
          title: "Customer Data Leakage",
          description:
            "Credit applications, trade-in appraisals, and service records flow through multiple cloud tools daily. Each one is a potential leak point for customer PII and financial information.",
        },
      ]}
      features={[
        {
          title: "Intelligent Inventory Management",
          description:
            "AI-powered demand forecasting, pricing optimization, and turn-rate analysis running against your DMS data in real-time. Know which units to stock, price, and promote — without sending your inventory strategy to the cloud.",
        },
        {
          title: "Service Department AI",
          description:
            "Diagnostic assistance, repair time estimates, and parts lookup powered by local AI. Technicians get instant recommendations while customer vehicle data stays on your network.",
        },
        {
          title: "Customer Engagement Engine",
          description:
            "Automated follow-ups, service reminders, and personalized offers generated from your CRM data. Every message is tailored to the customer's history — processed locally, sent from your systems.",
        },
        {
          title: "Deal Desk Assistant",
          description:
            "Real-time deal structuring, lender matching, and profit analysis. Your F&I team gets AI-powered recommendations without customer financial data leaving your dealership's network.",
        },
        {
          title: "Reputation & Review Management",
          description:
            "AI-generated review responses, sentiment analysis across platforms, and CSI prediction. Monitor and manage your online reputation with local AI that understands your brand voice.",
        },
        {
          title: "Multi-Rooftop Dashboard",
          description:
            "If you operate multiple locations, get a unified AI layer across all rooftops. Compare performance, share best practices, and maintain consistent operations — all on your private infrastructure.",
        },
      ]}
      complianceBadges={[
        "FTC Safeguards Rule",
        "GLBA Compliant",
        "DMS Integration",
        "PCI DSS Ready",
        "Multi-Rooftop Capable",
      ]}
      ctaText="Get a Dealership Assessment"
      testimonialQuote="We were using five different cloud tools across sales, service, and F&I. TechFides consolidated everything into one local AI stack. Our data is secure, our teams are faster, and we passed our FTC audit without a single finding."
      testimonialAuthor="General Manager"
      testimonialRole="Multi-Brand Auto Group, 4 Rooftops"
    />
  );
}
