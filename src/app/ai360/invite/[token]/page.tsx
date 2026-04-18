"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface InviteData {
  assessmentId: string;
  orgName: string;
  assessmentName: string;
  status: string;
  role: string;
  memberName: string;
}

export default function InvitePage() {
  const { token } = useParams() as { token: string };
  const router = useRouter();
  const [data, setData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/ai360/invite/${token}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Invalid or expired invite link");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleAccept() {
    setAccepting(true);
    try {
      const res = await fetch(`/api/v1/ai360/invite/${token}/accept`, { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        router.push(`/ai360/${result.assessmentId}`);
      }
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Invite</h2>
          <p className="text-sm text-gray-500">{error || "This invite link is invalid or has expired."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg w-full mx-4 p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">AI 360 Readiness Assessment</h1>
          <p className="text-sm text-gray-500 mt-1">You&apos;ve been invited to participate</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Organization</span>
            <span className="font-medium text-gray-900">{data.orgName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Assessment</span>
            <span className="font-medium text-gray-900">{data.assessmentName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Your Role</span>
            <span className="font-medium text-blue-600">{data.role.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Welcome</span>
            <span className="font-medium text-gray-900">{data.memberName}</span>
          </div>
        </div>

        <button
          onClick={handleAccept}
          disabled={accepting}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {accepting ? "Joining..." : "Accept & Open Assessment"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          By accepting, you agree to participate in this assessment under the role assigned to you.
        </p>
      </div>
    </div>
  );
}
