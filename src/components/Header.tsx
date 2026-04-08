"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useI18n, Locale } from "@/i18n";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useI18n();

  // Track scroll for subtle header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  const navigation = [
    { name: t("nav.solutions"), href: "/solutions" },
    { name: t("nav.theStack"), href: "/stack" },
    { name: t("nav.pricingRoi"), href: "/pricing" },
    { name: t("nav.partnerPortal"), href: "/partners" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-slate-700/50 bg-[#0c1929]/95 shadow-xl shadow-black/20 backdrop-blur-xl"
          : "border-slate-700/30 bg-[#0c1929] backdrop-blur-xl"
      }`}
    >
      {/* Top utility bar */}
      <div className="border-b border-slate-700/20 bg-[#071019]">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-6 py-1.5">
          <a
            href="mailto:engage@techfides.com"
            className="text-[11px] text-slate-500 transition-colors hover:text-electric-400"
          >
            engage@techfides.com
          </a>
          <span className="text-slate-700">|</span>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-electric-400"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
              </svg>
              {localeLabels[locale]}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[120px] overflow-hidden rounded-lg border border-slate-700 bg-[#0c1929] shadow-2xl">
                {(Object.keys(localeLabels) as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocale(loc);
                      setLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-electric-500/10 hover:text-electric-400 ${
                      locale === loc
                        ? "bg-electric-500/10 text-electric-400"
                        : "text-slate-400"
                    }`}
                  >
                    {t(`language.${loc}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/images/techfides-logo-white.png"
            alt="TechFides"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium tracking-wide text-slate-300 transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/partners#apply"
            className="rounded-lg bg-electric-500 px-5 py-2 text-[13px] font-semibold text-white transition-all hover:bg-electric-400 hover:shadow-lg hover:shadow-electric-500/25"
          >
            {t("nav.becomePartner")}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-700/30 bg-[#0c1929] px-6 py-4 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2.5 text-sm text-slate-300 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/partners#apply"
            className="mt-3 block w-full rounded-lg bg-electric-500 py-2.5 text-center text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.becomePartner")}
          </Link>
          {/* Mobile Language Switcher */}
          <div className="mt-3 flex gap-2 border-t border-slate-700/30 pt-3">
            {(Object.keys(localeLabels) as Locale[]).map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setMobileOpen(false);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  locale === loc
                    ? "bg-electric-500 text-white"
                    : "border border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {localeLabels[loc]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
