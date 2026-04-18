"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AI360_STATUS_CONFIG, AI360StatusType } from "@/lib/ai360/types";

interface AdminAssessment {
  id: string;
  name: string;
  orgName: string;
  status: AI360StatusType;
  overallScore: number | null;
  createdAt: string;
  memberCount: number;
  responseCount: number;
  documentCount: number;
}

export default function AI360AdminPage() {
  const [assessments, setAssessments] = useState<AdminAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AI360StatusType | "ALL">("ALL");

  useEffect(() => {
    fetch("/api/v1/ai360")
      .then((r) => r.ok ? r.json() : { assessments: [] })
      .then((d) => setAssessments(d.assessments || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? assessments : assessments.filter((a) => a.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all AI 360 assessments, users, and system settings.</p>
        </div>
        <Link href="/ai360" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Back to Assessments
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total", value: assessments.length, onClick: () => setFilter("ALL"), active: filter === "ALL" },
          { label: "Draft", value: assessments.filter((a) => a.status === "DRAFT").length, onClick: () => setFilter("DRAFT"), active: filter === "DRAFT" },
          { label: "Submitted", value: assessments.filter((a) => a.status === "SUBMITTED").length, onClick: () => setFilter("SUBMITTED"), active: filter === "SUBMITTED" },
          { label: "Analyzing", value: assessments.filter((a) => a.status === "ANALYZING").length, onClick: () => setFilter("ANALYZING"), active: filter === "ANALYZING" },
          { label: "Published", value: assessments.filter((a) => a.status === "PUBLISHED").length, onClick: () => setFilter("PUBLISHED"), active: filter === "PUBLISHED" },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={stat.onClick}
            className={`bg-white rounded-xl border p-4 text-left transition-colors ${
              stat.active ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Assessment List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Members</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Docs</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => {
                const config = AI360_STATUS_CONFIG[a.status];
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/ai360/${a.id}/admin`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {a.orgName}
                      </Link>
                      <p className="text-xs text-gray-400">{a.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{a.overallScore !== null ? `${a.overallScore}%` : "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{a.memberCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{a.responseCount}/60</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{a.documentCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/ai360/${a.id}/admin`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
