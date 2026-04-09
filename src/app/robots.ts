import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/gse/", "/survey/", "/onboarding/"],
      },
    ],
    sitemap: "https://techfides.com/sitemap.xml",
  };
}
