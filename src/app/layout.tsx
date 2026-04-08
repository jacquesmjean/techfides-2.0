import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "TechFides | Enterprise AI. Local Infrastructure. Total Sovereignty.",
  description:
    "Deploy sovereign AI on your own hardware. No cloud tax. No data leakage. Local AI infrastructure for Legal, Medical, Auto, and Trades businesses.",
  keywords: [
    "local AI",
    "sovereign AI",
    "enterprise AI",
    "on-premise AI",
    "HIPAA compliant AI",
    "private AI infrastructure",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
