"use client";

import { useI18n } from "@/i18n";
import { SolutionPage } from "@/components/SolutionPage";

export default function TradesPage() {
  const { t } = useI18n();

  return (
    <SolutionPage
      vertical={t("verticals.trades")}
      tagline={t("solutionTrades.tagline")}
      headline={t("solutionTrades.headline")}
      subheadline={t("solutionTrades.subheadline")}
      painPoints={[
        {
          icon: "\u{1F4DD}",
          title: t("solutionTrades.pain1Title"),
          description: t("solutionTrades.pain1Desc"),
        },
        {
          icon: "\u{1F4C5}",
          title: t("solutionTrades.pain2Title"),
          description: t("solutionTrades.pain2Desc"),
        },
        {
          icon: "\u{1F4E1}",
          title: t("solutionTrades.pain3Title"),
          description: t("solutionTrades.pain3Desc"),
        },
      ]}
      features={[
        { title: t("solutionTrades.feat1Title"), description: t("solutionTrades.feat1Desc") },
        { title: t("solutionTrades.feat2Title"), description: t("solutionTrades.feat2Desc") },
        { title: t("solutionTrades.feat3Title"), description: t("solutionTrades.feat3Desc") },
        { title: t("solutionTrades.feat4Title"), description: t("solutionTrades.feat4Desc") },
        { title: t("solutionTrades.feat5Title"), description: t("solutionTrades.feat5Desc") },
        { title: t("solutionTrades.feat6Title"), description: t("solutionTrades.feat6Desc") },
      ]}
      complianceBadges={[
        t("solutionTrades.badge1"),
        t("solutionTrades.badge2"),
        t("solutionTrades.badge3"),
        t("solutionTrades.badge4"),
        t("solutionTrades.badge5"),
      ]}
      ctaText={t("solutionTrades.ctaText")}
      testimonialQuote={t("solutionTrades.testimonialQuote")}
      testimonialAuthor={t("solutionTrades.testimonialAuthor")}
      testimonialRole={t("solutionTrades.testimonialRole")}
    />
  );
}
