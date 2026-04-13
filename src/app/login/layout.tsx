import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign In — TechFides C&C",
  description: "Authorized access to the TechFides Command & Control Operations Center.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
