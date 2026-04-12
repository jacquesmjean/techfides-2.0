"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GSEProvider } from "@/lib/gse/store";
import { ToastNotifications } from "@/components/gse/ToastNotifications";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "COMMAND CENTER",
    items: [
      { label: "CEO Cockpit", icon: "\uD83C\uDFAF", href: "/gse" },
      { label: "Red Flag Alerts", icon: "\uD83D\uDEA8", href: "/gse/alerts" },
    ],
  },
  {
    title: "SALES MACHINE",
    items: [
      { label: "Pipeline", icon: "\uD83D\uDCC8", href: "/gse/pipeline" },
      { label: "Leads", icon: "\uD83D\uDC65", href: "/gse/leads" },
      { label: "Outreach", icon: "\uD83D\uDCE7", href: "/gse/outreach" },
      { label: "Nurture", icon: "\uD83C\uDF31", href: "/gse/nurture" },
      { label: "Territory Map", icon: "\uD83D\uDDFA\uFE0F", href: "/gse/map" },
    ],
  },
  {
    title: "CLIENT DELIVERY",
    items: [
      { label: "Projects", icon: "\uD83D\uDCC2", href: "/gse/projects" },
      { label: "Client Accounts", icon: "\uD83C\uDFE2", href: "/gse/clients" },
      { label: "Support Tickets", icon: "\uD83C\uDFAB", href: "/gse/tickets" },
      { label: "Deal Rooms", icon: "\uD83D\uDD10", href: "/gse/deal-room" },
      { label: "Surveys", icon: "\u2B50", href: "/gse/surveys" },
    ],
  },
  {
    title: "MACHINE HEALTH",
    items: [
      { label: "System Health", icon: "\uD83D\uDC9A", href: "/gse/health" },
      { label: "Analytics", icon: "\uD83D\uDCC9", href: "/gse/analytics" },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Social Media", icon: "\uD83D\uDCF1", href: "/gse/social" },
      { label: "Forecast & Goals", icon: "\uD83D\uDCC0", href: "/gse/forecast" },
      { label: "HR & Performance", icon: "\uD83D\uDC64", href: "/gse/hr" },
    ],
  },
];

function GSELayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/gse") return pathname === "/gse";
    return pathname.startsWith(href);
  };

  return (
    <GSEProvider>
      <div className="flex h-screen bg-slate-950 text-slate-100">
        {/* Sidebar */}
        <aside
          className={`flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center w-full" : ""}`}>
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-slate-950">
                C&C
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold">TechFides</span>
                  <span className="text-[10px] text-sky-400">Command &amp; Control</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
              title={sidebarCollapsed ? "Expand" : "Collapse"}
            >
              {sidebarCollapsed ? "\u2192" : "\u2190"}
            </button>
          </div>

          {/* Grouped Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                {!sidebarCollapsed && (
                  <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    {section.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-[13px] ${
                        isActive(item.href)
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }`}
                      title={sidebarCollapsed ? item.label : ""}
                    >
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500">
            {!sidebarCollapsed && <p>C&amp;C Operations Center v2.0</p>}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/50 backdrop-blur">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-lg font-bold text-slate-100">
                TechFides <span className="text-sky-400">C&amp;C</span>
              </h1>
              <input
                type="text"
                placeholder="Search leads, companies, deals..."
                className="flex-1 max-w-md px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-950">
                JJ
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">Jacques Jean</p>
                <p className="text-[10px] text-sky-400">CEO &amp; Founder</p>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">{children}</div>
          </main>
          <ToastNotifications />
        </div>
      </div>
    </GSEProvider>
  );
}

export default GSELayout;
