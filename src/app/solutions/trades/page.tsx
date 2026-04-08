import { SolutionPage } from "@/components/SolutionPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI for Contractors & Trades | TechFides",
  description:
    "Local AI for contractors, HVAC, plumbing, electrical, and construction businesses. Estimating, scheduling, crew coordination, and client management — all on your own hardware.",
};

export default function TradesPage() {
  return (
    <SolutionPage
      vertical="Trades"
      tagline="AI for Contractors &amp; Skilled Trades"
      headline={`Operations AI for\nthe Trades`}
      subheadline="Estimating, scheduling, crew management, and client communication eat up hours every day. Cloud tools help — but they also mean your bid strategies, client lists, and operational data sit on someone else's server. TechFides puts AI to work on your hardware."
      painPoints={[
        {
          icon: "\u{1F4DD}",
          title: "Estimating Bottleneck",
          description:
            "Every bid takes hours of manual calculation. You lose jobs because you can't estimate fast enough — or worse, you win jobs with bad numbers because you rushed. Cloud AI sees your margins. Local AI protects them.",
        },
        {
          icon: "\u{1F4C5}",
          title: "Scheduling Chaos",
          description:
            "Crews, materials, inspections, and weather don't sync themselves. Your dispatcher juggles it all manually while cloud tools only see part of the picture. Local AI integrates everything on one system.",
        },
        {
          icon: "\u{1F4E1}",
          title: "Field Connectivity",
          description:
            "Job sites don't always have reliable internet. Cloud-dependent tools fail exactly when your crews need them most. TechFides local AI works on your network — with or without an internet connection.",
        },
      ]}
      features={[
        {
          title: "AI-Powered Estimating",
          description:
            "Generate accurate estimates in minutes, not hours. The AI learns from your historical bids, material costs, and labor rates to produce estimates that reflect your actual margins — not industry averages.",
        },
        {
          title: "Intelligent Scheduling",
          description:
            "Optimize crew assignments, material deliveries, and inspection windows automatically. The AI accounts for travel time, skill sets, equipment availability, and weather forecasts.",
        },
        {
          title: "Client Communication Hub",
          description:
            "Automated project updates, appointment confirmations, and follow-up sequences. Each message is personalized to the job scope and client history — generated locally from your CRM data.",
        },
        {
          title: "Job Costing & Profitability",
          description:
            "Real-time tracking of labor hours, material costs, and change orders against the original estimate. Know which jobs are profitable before they're done, not after.",
        },
        {
          title: "Document & Photo Management",
          description:
            "AI-organized job photos, permit documents, inspection reports, and warranty paperwork. Automatically categorized and linked to the right job — searchable in seconds.",
        },
        {
          title: "Crew Performance Analytics",
          description:
            "Track completion rates, quality metrics, and efficiency by crew, foreman, or individual. Identify training needs and top performers with data that stays in your office.",
        },
      ]}
      complianceBadges={[
        "Offline Capable",
        "Multi-Site Ready",
        "Field-Tested",
        "QuickBooks Integration",
        "ServiceTitan Compatible",
      ]}
      ctaText="Get a Contractor Assessment"
      testimonialQuote="Our estimator was spending 4 hours per bid. With TechFides, we generate accurate estimates in 30 minutes. We're bidding 3x more jobs with better margins — and our competitors have no idea how we got so fast."
      testimonialAuthor="Owner"
      testimonialRole="Commercial HVAC Contractor, 35 Employees"
    />
  );
}
