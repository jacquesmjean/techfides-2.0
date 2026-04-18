"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AI360_STATUS_CONFIG, AI360StatusType } from "@/lib/ai360/types";

interface AssessmentItem {
  id: string;
  name: string;
  orgName: string;
  status: AI360StatusType;
  overallScore: number | null;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  completionRate: number;
}

export default function AI360LandingPage() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  async function fetchAssessments() {
    try {
      const res = await fetch("/api/v1/ai360");
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments || []);
      }
    } catch {
      // Fail silently for now — show empty state
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-dark">AI 360 Readiness Assessments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage client assessments across strategy, data, technology, operations, governance, and people.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Assessment
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Assessments</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{assessments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{assessments.filter((a) => a.status === "DRAFT" || a.status === "SUBMITTED").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Analyzing</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{assessments.filter((a) => a.status === "ANALYZING").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{assessments.filter((a) => a.status === "PUBLISHED").length}</p>
        </div>
      </div>

      {/* Assessment List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : assessments.length === 0 ? (
        <EmptyState onCreateClick={() => setShowCreate(true)} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Completion</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assessments.map((a) => {
                const statusConfig = AI360_STATUS_CONFIG[a.status];
                return (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/ai360/${a.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {a.orgName}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{a.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color} border`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {a.overallScore !== null ? (
                        <span className="text-sm font-bold text-gray-900">{a.overallScore}%</span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${a.completionRate}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{a.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{a.memberCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(a.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/ai360/${a.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && <CreateAssessmentModal onClose={() => setShowCreate(false)} onCreated={fetchAssessments} />}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments yet</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        Create your first AI 360 Readiness Assessment to evaluate a client organization across 6 critical dimensions.
      </p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors"
      >
        Create First Assessment
      </button>
    </div>
  );
}

// ─── Create Assessment Modal ──────────────────────────────────────
function CreateAssessmentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgIndustry, setOrgIndustry] = useState("OTHER");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !orgName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/ai360", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, orgName, orgIndustry }),
      });
      if (res.ok) {
        onCreated();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">New AI 360 Assessment</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp Q2 2026 AI Readiness"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry Vertical</label>
            <select
              value={orgIndustry}
              onChange={(e) => setOrgIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="LEGAL">Legal</option>
              <option value="MEDICAL">Medical / Healthcare</option>
              <option value="AUTO">Automotive</option>
              <option value="TRADES">Trades & Field Services</option>
              <option value="PROPERTY_MANAGEMENT">Property Management</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving || !name.trim() || !orgName.trim()}
            className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Creating..." : "Create Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}
