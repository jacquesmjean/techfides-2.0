"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AI360_TABS, AI360StatusType, AI360_STATUS_CONFIG } from "@/lib/ai360/types";

interface TabNavProps {
  assessmentId: string;
  status: AI360StatusType;
  orgName: string;
}

export function TabNav({ assessmentId, status, orgName }: TabNavProps) {
  const pathname = usePathname();
  const basePath = `/ai360/${assessmentId}`;

  const statusConfig = AI360_STATUS_CONFIG[status];

  // Determine active tab
  const getActiveTab = () => {
    if (pathname.includes("/evidence")) return "evidence";
    if (pathname.includes("/uploads")) return "uploads";
    if (pathname.includes("/analyze")) return "analyze";
    if (pathname.includes("/variance")) return "variance";
    if (pathname.includes("/activity")) return "activity";
    if (pathname.includes("/results")) return "results";
    if (pathname.includes("/admin")) return "admin";
    return "assessment";
  };

  const activeTab = getActiveTab();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Assessment name + status */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-brand-dark">{orgName}</h1>
            <p className="text-sm text-gray-500">AI 360 Readiness Assessment</p>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
            <span className="w-2 h-2 rounded-full bg-current mr-2" />
            {statusConfig.label}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex gap-1 -mb-px">
          {AI360_TABS.map((tab) => {
            const href = `${basePath}${tab.href}`;
            const isActive = activeTab === tab.key;
            // Hide admin tab for non-admin users (we'll handle RBAC later)
            return (
              <Link
                key={tab.key}
                href={href}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
