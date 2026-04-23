"use client";

import { useI18n } from "@/i18n";
import { SolutionPage } from "@/components/SolutionPage";

export default function AutoPage() {
  const { t } = useI18n();

  return (
    <SolutionPage
      vertical={t("verticals.auto")}
      tagline={t("solutionAuto.tagline")}
      headline={t("solutionAuto.headline")}
      subheadline={t("solutionAuto.subheadline")}
      painPoints={[
        {
          icon: "\u{1F697}",
          title: t("solutionAuto.pain1Title"),
          description: t("solutionAuto.pain1Desc"),
        },
        {
          icon: "\u{1F4B0}",
          title: t("solutionAuto.pain2Title"),
          description: t("solutionAuto.pain2Desc"),
        },
        {
          icon: "\u{1F504}",
          title: t("solutionAuto.pain3Title"),
          description: t("solutionAuto.pain3Desc"),
        },
      ]}
      features={[
        { title: t("solutionAuto.feat1Title"), description: t("solutionAuto.feat1Desc") },
        { title: t("solutionAuto.feat2Title"), description: t("solutionAuto.feat2Desc") },
        { title: t("solutionAuto.feat3Title"), description: t("solutionAuto.feat3Desc") },
        { title: t("solutionAuto.feat4Title"), description: t("solutionAuto.feat4Desc") },
        { title: t("solutionAuto.feat5Title"), description: t("solutionAuto.feat5Desc") },
        { title: t("solutionAuto.feat6Title"), description: t("solutionAuto.feat6Desc") },
      ]}
      complianceBadges={[
        t("solutionAuto.badge1"),
        t("solutionAuto.badge2"),
        t("solutionAuto.badge3"),
        t("solutionAuto.badge4"),
        t("solutionAuto.badge5"),
      ]}
      ctaText={t("solutionAuto.ctaText")}
      testimonialQuote={t("solutionAuto.testimonialQuote")}
      testimonialAuthor={t("solutionAuto.testimonialAuthor")}
      testimonialRole={t("solutionAuto.testimonialRole")}
    />
  );
}
