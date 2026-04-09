import { SolutionPage } from "@/components/SolutionPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HIPAA-Compliant AI for Healthcare | TechFides",
  description:
    "Deploy AI on your facility's hardware with full HIPAA compliance. Clinical documentation, coding assistance, and patient communication — without PHI ever leaving your network.",
};

export default function MedicalPage() {
  return (
    <SolutionPage
      vertical="Medical"
      tagline="AI for Healthcare &amp; Medical Practices"
      headline={`HIPAA-Compliant\nAI for Healthcare`}
      subheadline="Patient data is the most regulated information in America. Every cloud AI call with PHI is a compliance event. TechFides deploys healthcare AI on your facility's own hardware — so protected health information never crosses your network boundary."
      painPoints={[
        {
          icon: "\u{1F3E5}",
          title: "HIPAA Exposure",
          description:
            "Cloud AI providers require BAAs, but a BAA doesn't prevent breaches — it just assigns liability. Every API call with patient data is a potential violation point that grows your attack surface.",
        },
        {
          icon: "\u{1F4CB}",
          title: "Documentation Burnout",
          description:
            "Physicians spend 2 hours on documentation for every 1 hour of patient care. Cloud AI tools help but create new compliance headaches. Your staff needs AI assistance without the regulatory risk.",
        },
        {
          icon: "\u{1F4CA}",
          title: "Data Fragmentation",
          description:
            "Patient data lives in your EHR, billing system, lab interfaces, and imaging archives. Cloud AI sees fragments. Local AI can securely integrate across all systems on your network.",
        },
      ]}
      features={[
        {
          title: "Clinical Documentation AI",
          description:
            "AI-assisted note-taking, SOAP note generation, and discharge summaries — running on your local hardware. Integrates with your EHR (Epic, Cerner, Athena) without sending PHI to external servers.",
        },
        {
          title: "Medical Coding Assistant",
          description:
            "Automated ICD-10, CPT, and HCPCS code suggestions based on clinical documentation. Reduce coding errors and accelerate billing cycles with on-premise AI that learns your practice's patterns.",
        },
        {
          title: "Patient Communication Engine",
          description:
            "Generate appointment reminders, follow-up instructions, and patient education materials. Personalized to each patient's condition and literacy level, all processed locally.",
        },
        {
          title: "Prior Authorization Automation",
          description:
            "AI-powered prior auth letter generation with clinical justification pulled from the patient record. Cut auth turnaround from days to hours without exposing records to cloud services.",
        },
        {
          title: "Clinical Decision Support",
          description:
            "Drug interaction checking, differential diagnosis suggestions, and evidence-based treatment recommendations — all running against your local patient database and medical knowledge base.",
        },
        {
          title: "HIPAA Compliance Dashboard",
          description:
            "Real-time monitoring of every AI interaction. Complete audit trail showing data access patterns, user activity, and compliance status. Export-ready for OCR audits and attestation.",
        },
      ]}
      complianceBadges={[
        "HIPAA Aligned",
        "PHI On-Premise",
        "BAA Available",
        "HITECH Act Ready",
        "SOC 2 Type II",
        "42 CFR Part 2",
      ]}
      ctaText="Get a Practice Assessment"
      testimonialQuote="Our physicians were drowning in documentation. Cloud AI tools helped but our compliance officer was losing sleep. TechFides gave us the same AI power with zero PHI leaving our facility. Our docs save 90 minutes a day and compliance is airtight."
      testimonialAuthor="Chief Medical Officer"
      testimonialRole="Multi-Location Primary Care Group, 12 Providers"
    />
  );
}
