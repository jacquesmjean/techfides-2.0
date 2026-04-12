import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techfides.com"),
  title: {
    default: "TechFides | Enterprise AI. Local Infrastructure. Total Sovereignty.",
    template: "%s | TechFides",
  },
  description:
    "Deploy sovereign AI on your own hardware. No cloud tax. No data leakage. Local AI infrastructure for Legal, Medical, Auto, and Trades businesses.",
  keywords: [
    "local AI",
    "sovereign AI",
    "enterprise AI",
    "on-premise AI",
    "private AI infrastructure",
    "AI for law firms",
    "AI for healthcare",
    "AI for auto dealers",
    "AI for contractors",
  ],
  icons: {
    icon: "/images/techfides-icon.svg",
    apple: "/images/techfides-icon.png",
  },
  authors: [{ name: "TechFides", url: "https://techfides.com" }],
  creator: "TechFides",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techfides.com",
    siteName: "TechFides",
    title: "TechFides | Enterprise AI. Local Infrastructure. Total Sovereignty.",
    description:
      "Deploy sovereign AI on your own hardware. No cloud tax. No data leakage. Transparent pricing starting at $500/mo.",
    images: [
      {
        url: "/images/techfides-logo.png",
        width: 1200,
        height: 630,
        alt: "TechFides - Enterprise AI on Your Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tech_fides",
    creator: "@tech_fides",
    title: "TechFides | Enterprise AI. Local Infrastructure. Total Sovereignty.",
    description:
      "Deploy sovereign AI on your own hardware. No cloud tax. No data leakage.",
    images: ["/images/techfides-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://techfides.com",
  },
};

// JSON-LD Structured Data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechFides",
  url: "https://techfides.com",
  logo: "https://techfides.com/images/techfides-logo.png",
  description:
    "Enterprise AI infrastructure deployed on your own hardware. Sovereign, secure, and model-agnostic.",
  email: "engage@techfides.com",
  sameAs: [
    "https://www.linkedin.com/company/techfides/",
    "https://x.com/tech_fides",
    "https://www.facebook.com/TechFidesTX/",
    "https://www.instagram.com/tech_fides/",
    "https://www.youtube.com/@Tech_Fides",
  ],
  address: [
    {
      "@type": "PostalAddress",
      addressLocality: "Frisco",
      addressRegion: "TX",
      addressCountry: "US",
    },
    {
      "@type": "PostalAddress",
      addressLocality: "Guadalajara",
      addressRegion: "Jalisco",
      addressCountry: "MX",
    },
    {
      "@type": "PostalAddress",
      addressLocality: "Libreville",
      addressRegion: "Estuaire",
      addressCountry: "GA",
    },
  ],
  foundingDate: "2000",
  founder: {
    "@type": "Person",
    name: "Jacques Jean",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
