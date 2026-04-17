import type { Metadata } from "next";
import "./aegis-print.css";

export const metadata: Metadata = {
  title: {
    default: "AEGIS Delivery Templates",
    template: "%s · AEGIS",
  },
  description:
    "Internal AEGIS delivery templates. Source-of-truth artifacts for governance engagements.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AegisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
