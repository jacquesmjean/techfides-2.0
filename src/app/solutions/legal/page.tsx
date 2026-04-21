"use client";

import { useI18n } from "@/i18n";
import { SolutionPage } from "@/components/SolutionPage";

export default function LegalPage() {
  const { t } = useI18n();

  return (
    <SolutionPage
      vertical={t("verticals.legal")}
      tagline={t("solutionLegal.tagline")}
      headline={t("solutionLegal.headline")}
      subheadline={t("solutionLegal.subheadline")}
      painPoints={[
        {
          icon: "\u{1F6A8}",
          title: t("solutionLegal.pain1Title"),
          description: t("solutionLegal.pain1Desc"),
        },
        {
          icon: "\u{1F4B8}",
          title: t("solutionLegal.pain2Title"),
          description: t("solutionLegal.pain2Desc"),
        },
        {
          icon: "\u{1F512}",
          title: t("solutionLegal.pain3Title"),
          description: t("solutionLegal.pain3Desc"),
        },
      ]}
      features={[
        { title: t("solutionLegal.feat1Title"), description: t("solutionLegal.feat1Desc") },
        { title: t("solutionLegal.feat2Title"), description: t("solutionLegal.feat2Desc") },
        { title: t("solutionLegal.feat3Title"), description: t("solutionLegal.feat3Desc") },
        { title: t("solutionLegal.feat4Title"), description: t("solutionLegal.feat4Desc") },
        { title: t("solutionLegal.feat5Title"), description: t("solutionLegal.feat5Desc") },
        { title: t("solutionLegal.feat6Title"), description: t("solutionLegal.feat6Desc") },
      ]}
      complianceBadges={[
        t("solutionLegal.badge1"),
        t("solutionLegal.badge2"),
        t("solutionLegal.badge3"),
        t("solutionLegal.badge4"),
        t("solutionLegal.badge5"),
      ]}
      ctaText={t("solutionLegal.ctaText")}
      testimonialQuote={t("solutionLegal.testimonialQuote")}
      testimonialAuthor={t("solutionLegal.testimonialAuthor")}
      testimonialRole={t("solutionLegal.testimonialRole")}
    />
  );
}
