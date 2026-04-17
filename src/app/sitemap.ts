import type { MetadataRoute } from "next";

const BASE_URL = "https://techfides.com";
const LOCALES = ["en", "es", "fr"] as const;

function multilingualUrl(path: string) {
  const alternates: Record<string, string> = {};
  for (const locale of LOCALES) {
    alternates[locale] = `${BASE_URL}${path}`;
  }
  alternates["x-default"] = `${BASE_URL}${path}`;
  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/solutions", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/solutions/legal", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/solutions/medical", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/solutions/auto", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/solutions/trades", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/stack", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/pricing", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/consulting", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/consulting/ai-readiness-360", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/consulting/transformation-management", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/consulting/aegis", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/assess", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/careers", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/partners", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: multilingualUrl(route.path),
    },
  }));
}
