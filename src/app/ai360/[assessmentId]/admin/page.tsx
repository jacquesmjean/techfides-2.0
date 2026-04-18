"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";
import { AI360_STATUS_CONFIG, AI360StatusType, AI360MemberInfo, AI360RoleType } from "@/lib/ai360/types";

const STATUS_FLOW: { from: AI360StatusType; to: AI360StatusType; label: string; color: string }[] = [
  { from: "DRAFT", to: "SUBMITTED", label: "Submit for Analysis", color: "blue" },
  { from: "SUBMITTED", to: "ANALYZING", label: "Begin Analysis", color: "purple" },
  { from: "ANALYZING", to: "PUBLISHED", label: "Publish Results", color: "emerald" },
  { from: "PUBLISHED", to: "DRAFT", label: "Reopen as Draft", color: "amber" },
];

const ROLES: { value: AI360RoleType; label: string; description: string }[] = [
  { value: "CLIENT_ADMIN", label: "Client Admin", description: "Full access: edit, upload, submit" },
  { value: "CONTRIBUTOR", label: "Contributor", description: "Can answer questions and upload documents" },
  { value: "ANALYST", label: "Analyst", description: "TechFides analyst — reviews and scores" },
  { value: "REVIEWER", label: "Reviewer", description: "TechFides reviewer — final approval" },
];

export default function AssessmentAdminPage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { status, orgName, reload } = useAssessment();
  const router = useRouter();
  const [members, setMembers] = useState<AI360MemberInfo[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [accessLink, setAccessLink] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/ai360/${assessmentId}/members`)
      .then((r) => r.ok ? r.json() : { members: [] })
      .then((d) => setMembers(d.members || []));

    // Get access link
    fetch(`/api/v1/ai360/${assessmentId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.accessToken) {
          setAccessLink(`${window.location.origin}/ai360/invite/${d.accessToken}`);
        }
      });
  }, [assessmentId]);

  async function handleTransition(to: AI360StatusType) {
    setTransitioning(true);
    try {
      const res = await fetch(`/api/v1/ai360/${assessmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: to }),
      });
      if (res.ok) reload();
    } finally {
      setTransitioning(false);
    }
  }

  async function handleInvite(data: { email: string; name: string; role: AI360RoleType }) {
    const res = await fetch(`/api/v1/ai360/${assessmentId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newMember = await res.json();
      setMembers((prev) => [...prev, newMember]);
      setShowInvite(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    const res = await fetch(`/api/v1/ai360/${assessmentId}/members/${memberId}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  }

  const nextTransition = STATUS_FLOW.find((t) => t.from === status);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main */}
      <div className="col-span-8 space-y-6">
        {/* Status Workflow */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Assessment Status Workflow</h3>

          {/* Status timeline */}
          <div className="flex items-center gap-2 mb-6">
            {(["DRAFT", "SUBMITTED", "ANALYZING", "PUBLISHED"] as AI360StatusType[]).map((s, i) => {
              const config = AI360_STATUS_CONFIG[s];
              const isActive = s === status;
              const isPast = ["DRAFT", "SUBMITTED", "ANALYZING", "PUBLISHED"].indexOf(s) < ["DRAFT", "SUBMITTED", "ANALYZING", "PUBLISHED"].indexOf(status);
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    isActive ? config.bgColor + " " + config.color : isPast ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-current" : isPast ? "bg-emerald-500" : "bg-gray-300"}`} />
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>
                  {i < 3 && <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
                </div>
              );
            })}
          </div>

          {nextTransition && (
            <button
              onClick={() => handleTransition(nextTransition.to)}
              disabled={transitioning}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 bg-${nextTransition.color}-600 hover:bg-${nextTransition.color}-700`}
            >
              {transitioning ? "Processing..." : nextTransition.label}
            </button>
          )}
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Team Members</h3>
            <button
              onClick={() => setShowInvite(true)}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Invite Member
            </button>
          </div>

          {members.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No members invited yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {members.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">{m.role}</span>
                    {m.acceptedAt ? (
                      <span className="text-xs text-emerald-600">Active</span>
                    ) : (
                      <span className="text-xs text-amber-600">Pending</span>
                    )}
                    <button
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role-Aware Experience */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Role-Aware Experience</h3>
          <p className="text-sm text-gray-500 mb-4">
            Client Admins and Contributors can edit while assessment is in Draft. Once submitted, all answers become read-only for clients.
            TechFides Analysts and Reviewers always view structured responses in read-only mode.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => (
              <div key={role.value} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{role.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="col-span-4 space-y-4">
        {/* Client Access Link */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Client Access Link</h3>
          <p className="text-xs text-gray-500 mb-3">Share this private link with the client to access their assessment.</p>
          {accessLink ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={accessLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 bg-gray-50"
              />
              <button
                onClick={() => navigator.clipboard.writeText(accessLink)}
                className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Loading...</p>
          )}
        </div>

        {/* Clone Assessment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Clone Assessment</h3>
          <p className="text-xs text-gray-500 mb-3">Create a copy of this assessment for a new engagement or iteration.</p>
          <button
            onClick={async () => {
              const res = await fetch(`/api/v1/ai360/${assessmentId}/clone`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ includeResponses: false, includeEvidence: true, includeMembers: true }),
              });
              if (res.ok) {
                const data = await res.json();
                router.push(`/ai360/${data.id}/admin`);
              }
            }}
            className="w-full px-3 py-2 text-sm text-brand-primary border border-brand-primary rounded-lg hover:bg-blue-50 transition-colors"
          >
            Clone (Evidence + Members)
          </button>
          <button
            onClick={async () => {
              const res = await fetch(`/api/v1/ai360/${assessmentId}/clone`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ includeResponses: true, includeEvidence: true, includeMembers: true }),
              });
              if (res.ok) {
                const data = await res.json();
                router.push(`/ai360/${data.id}/admin`);
              }
            }}
            className="w-full mt-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Full Clone (Including Responses)
          </button>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Export Data</h3>
          <div className="space-y-2">
            <a href={`/api/v1/ai360/${assessmentId}/export?format=csv`} target="_blank" rel="noopener noreferrer"
              className="block w-full px-3 py-2 text-sm text-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Export CSV
            </a>
            <a href={`/api/v1/ai360/${assessmentId}/export?format=json`} target="_blank" rel="noopener noreferrer"
              className="block w-full px-3 py-2 text-sm text-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Export JSON
            </a>
            <a href={`/api/v1/ai360/${assessmentId}/score/pdf`} target="_blank" rel="noopener noreferrer"
              className="block w-full px-3 py-2 text-sm text-center text-brand-primary border border-brand-primary rounded-lg hover:bg-blue-50 transition-colors">
              Download PDF Report
            </a>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <h3 className="text-sm font-semibold text-red-600 mb-3">Danger Zone</h3>
          <button className="w-full px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            Delete Assessment
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
    </div>
  );
}

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (data: { email: string; name: string; role: AI360RoleType }) => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AI360RoleType>("CONTRIBUTOR");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Invite Team Member</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as AI360RoleType)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label} — {r.description}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
          <button
            onClick={() => onInvite({ email, name, role })}
            disabled={!email.trim() || !name.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}
