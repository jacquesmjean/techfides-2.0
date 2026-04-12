"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GSEProvider } from "@/lib/gse/store";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/gse" },
  { label: "Pipeline", icon: "📈", href: "/gse/pipeline" },
  { label: "Leads", icon: "👥", href: "/gse/leads" },
  { label: "Territory Map", icon: "🗺️", href: "/gse/map" },
  { label: "Deal Rooms", icon: "🔐", href: "/gse/deal-room" },
  { label: "Surveys", icon: "⭐", href: "/gse/surveys" },
  { label: "Forecast & Goals", icon: "🎯", href: "/gse/forecast" },
  { label: "Analytics", icon: "📉", href: "/gse/analytics" },
  { label: "Nurture", icon: "🌱", href: "/gse/nurture" },
  { label: "Outreach", icon: "📧", href: "/gse/outreach" },
];

function GSELayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/gse") {
      return pathname === "/gse";
    }
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
                T
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold">TechFides</span>
                  <span className="text-xs text-sky-400">Global Sales Engine</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
              title={sidebarCollapsed ? "Expand" : "Collapse"}
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                    : "text-slate-400 hover:bg-slate-800/50"
                }`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            {!sidebarCollapsed && <p>Sales Engine v2.0</p>}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-bold text-slate-100">TechFides GSE</h1>
              <input
                type="text"
                placeholder="Search leads, companies, deals..."
                className="flex-1 max-w-md px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold text-slate-950">
                JJ
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">Jacques Jean</p>
                <p className="text-xs text-slate-500">Sales Director</p>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>
    </GSEProvider>
  );
}

export default GSELayout;
