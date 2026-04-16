"use client";

import { useI18n } from "@/i18n";
import { SolutionPage } from "@/components/SolutionPage";

export default function MedicalPage() {
  const { t } = useI18n();

  return (
    <SolutionPage
      vertical={t("verticals.medical")}
      tagline={t("solutionMedical.tagline")}
      headline={t("solutionMedical.headline")}
      subheadline={t("solutionMedical.subheadline")}
      painPoints={[
        {
          icon: "\u{1F3E5}",
          title: t("solutionMedical.pain1Title"),
          description: t("solutionMedical.pain1Desc"),
        },
        {
          icon: "\u{1F4CB}",
          title: t("solutionMedical.pain2Title"),
          description: t("solutionMedical.pain2Desc"),
        },
        {
          icon: "\u{1F4CA}",
          title: t("solutionMedical.pain3Title"),
          description: t("solutionMedical.pain3Desc"),
        },
      ]}
      features={[
        { title: t("solutionMedical.feat1Title"), description: t("solutionMedical.feat1Desc") },
        { title: t("solutionMedical.feat2Title"), description: t("solutionMedical.feat2Desc") },
        { title: t("solutionMedical.feat3Title"), description: t("solutionMedical.feat3Desc") },
        { title: t("solutionMedical.feat4Title"), description: t("solutionMedical.feat4Desc") },
        { title: t("solutionMedical.feat5Title"), description: t("solutionMedical.feat5Desc") },
        { title: t("solutionMedical.feat6Title"), description: t("solutionMedical.feat6Desc") },
      ]}
      complianceBadges={[
        "HIPAA Aligned",
        "PHI On-Premise",
        "BAA Available",
        "HITECH Act Ready",
        "SOC 2 Type II",
        "42 CFR Part 2",
      ]}
      ctaText={t("solutionMedical.ctaText")}
      testimonialQuote={t("solutionMedical.testimonialQuote")}
      testimonialAuthor={t("solutionMedical.testimonialAuthor")}
      testimonialRole={t("solutionMedical.testimonialRole")}
    />
  );
}
