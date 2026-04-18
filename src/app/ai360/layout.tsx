"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AI360Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInvite = pathname.startsWith("/ai360/invite");

  const navLinks = [
    { href: "/ai360", label: "Assessments", exact: true },
    { href: "/ai360/command", label: "Command Center", exact: false },
    { href: "/ai360/admin", label: "Admin", exact: false },
  ];

  return (
    <div className="min-h-screen bg-brand-light text-brand-black">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Product Name */}
            <Link href="/ai360" className="flex items-center gap-3 group">
              <Image
                src="/images/techfides-logo-dark.png"
                alt="TechFides"
                width={160}
                height={40}
                className="h-8 w-auto"
                priority
              />
              <div className="h-5 w-px bg-gray-300 group-hover:bg-brand-primary transition-colors" />
              <span className="text-sm font-heading font-bold text-brand-dark tracking-wide">
                AI 360<span className="hidden sm:inline"> Readiness</span>
              </span>
            </Link>

            {/* Center Nav */}
            {!isInvite && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = link.exact
                    ? pathname === link.href
                    : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "text-gray-500 hover:text-brand-dark hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/gse"
                className="text-xs text-gray-400 hover:text-brand-dark transition-colors px-2 py-1.5 rounded"
              >
                C&C
              </Link>
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-brand-dark transition-colors px-2 py-1.5 rounded"
              >
                Website
              </Link>
              <div className="h-5 w-px bg-gray-200 mx-1" />
              <button className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/techfides-icon-brand.png" alt="TechFides" width={20} height={20} className="h-5 w-5" />
            <span className="text-xs text-gray-400">TechFides AI 360 Readiness Platform</span>
          </div>
          <span className="text-xs text-gray-300">&copy; {new Date().getFullYear()} TechFides. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
