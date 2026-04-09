"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useGSE } from "@/lib/gse/store";
import { SERVICE_CONFIG } from "@/lib/gse/types";
import type { DealRoomStatus, Activity } from "@/lib/gse/types";

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Status badge color
function getStatusBadgeColor(status?: DealRoomStatus) {
  const statusColors: Record<DealRoomStatus, { bg: string; text: string; border: string }> = {
    draft: { bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-700" },
    sent: { bg: "bg-blue-900", text: "text-blue-300", border: "border-blue-700" },
    viewed: { bg: "bg-purple-900", text: "text-purple-300", border: "border-purple-700" },
    signed: { bg: "bg-amber-900", text: "text-amber-300", border: "border-amber-700" },
    paid: { bg: "bg-green-900", text: "text-green-300", border: "border-green-700" },
    completed: { bg: "bg-emerald-900", text: "text-emerald-300", border: "border-emerald-700" },
  };
  return statusColors[status || "draft"];
}

// Document type colors
function getDocumentTypeColor(type: string) {
  const colors: Record<string, string> = {
    sow: "bg-blue-500/20 text-blue-300",
    contract: "bg-purple-500/20 text-purple-300",
    technical: "bg-emerald-500/20 text-emerald-300",
    nda: "bg-yellow-500/20 text-yellow-300",
    invoice: "bg-green-500/20 text-green-300",
  };
  return colors[type] || "bg-slate-500/20 text-slate-300";
}

// Mock document data
const mockDocuments = [
  {
    id: "doc-1",
    name: "Statement of Work (SOW)",
    type: "sow",
    status: "sent" as const,
    progress: 100,
  },
  {
    id: "doc-2",
    name: "Master Service Agreement",
    type: "contract",
    status: "viewed" as const,
    progress: 100,
  },
  {
    id: "doc-3",
    name: "Technical Architecture Document",
    type: "technical",
    status: "sent" as const,
    progress: 100,
  },
  {
    id: "doc-4",
    name: "Non-Disclosure Agreement",
    type: "nda",
    status: "signed" as const,
    progress: 100,
  },
];

// Mock payment data
const mockPayment = {
  invoiceNumber: "INV-2026-0847",
  amount: 10000,
  currency: "USD",
  method: "wire" as const,
  status: "pending" as const,
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

// Mock activity data (will be filtered from lead activities)
const mockDealRoomActivities = [
  {
    id: "a-1",
    type: "deal-room-created",
    title: "Deal Room Created",
    description: "Secure deal room portal generated with SOW, NDA, and technical docs.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a-2",
    type: "document-sent",
    title: "Documents Sent to Client",
    description: "SOW, Contract, and Technical documents sent to client portal.",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a-3",
    type: "document-viewed",
    title: "Document Viewed",
    description: "Client viewed the Statement of Work.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a-4",
    type: "document-signed",
    title: "NDA Signed",
    description: "Client signed the Non-Disclosure Agreement.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Back Button
function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-6"
    >
      <span>←</span> Back to Deal Rooms
    </button>
  );
}

// Deal Room Header
function DealRoomHeader({ dealRoomId, lead }: { dealRoomId: string; lead: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const clientUrl = `${window.location.origin}/onboarding/${lead.id}`;
    navigator.clipboard.writeText(clientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = getStatusBadgeColor(lead.dealRoomStatus);
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {lead.contact.firstName} {lead.contact.lastName}
          </h2>
          <p className="text-sm text-slate-400 mt-1">{lead.contact.company}</p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg border text-sm font-semibold ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
        >
          {lead.dealRoomStatus || "draft"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-slate-800">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Deal Value</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">
            {formatCurrency(lead.dealValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Service</p>
          <p className="text-lg font-semibold text-slate-100 mt-1">
            {SERVICE_CONFIG[lead.service as keyof typeof SERVICE_CONFIG]?.label ?? lead.service}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Created</p>
          <p className="text-sm text-slate-100 mt-1">{formatDate(lead.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Expires</p>
          <p className="text-sm text-slate-100 mt-1">{formatDate(expiryDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Access Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded font-mono text-sm text-slate-100">
              {dealRoomId.toUpperCase().slice(0, 8)}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(dealRoomId);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium rounded transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors h-fit"
        >
          <span>🔗</span> Copy Client Link
        </button>
      </div>
    </div>
  );
}

// Documents Section
function DocumentsSection() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-100">📄 Documents</h3>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium rounded transition-colors">
            + Generate SOW
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium rounded transition-colors">
            + Generate NDA
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-100">{doc.name}</h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getDocumentTypeColor(doc.type)}`}>
                    {doc.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Status: {doc.status}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="flex items-center gap-2 text-xs">
              <div className={`flex items-center px-2 py-1 rounded ${doc.progress >= 25 ? "bg-sky-500/20 text-sky-300" : "bg-slate-700 text-slate-400"}`}>
                Draft
              </div>
              <div className="w-6 h-px bg-slate-700"></div>
              <div className={`flex items-center px-2 py-1 rounded ${doc.progress >= 50 ? "bg-sky-500/20 text-sky-300" : "bg-slate-700 text-slate-400"}`}>
                Sent
              </div>
              <div className="w-6 h-px bg-slate-700"></div>
              <div className={`flex items-center px-2 py-1 rounded ${doc.progress >= 75 ? "bg-sky-500/20 text-sky-300" : "bg-slate-700 text-slate-400"}`}>
                Viewed
              </div>
              <div className="w-6 h-px bg-slate-700"></div>
              <div className={`flex items-center px-2 py-1 rounded ${doc.progress >= 100 ? "bg-green-500/20 text-green-300" : "bg-slate-700 text-slate-400"}`}>
                Signed
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Payment Section
function PaymentSection() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-slate-100 mb-6">💰 Payment</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Invoice Number</p>
          <p className="text-lg font-semibold text-slate-100 mt-2">{mockPayment.invoiceNumber}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Amount Due</p>
          <p className="text-lg font-semibold text-slate-100 mt-2">
            {formatCurrency(mockPayment.amount)} {mockPayment.currency}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Payment Method</p>
          <p className="text-lg font-semibold text-slate-100 mt-2 capitalize">{mockPayment.method}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg mb-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-100">Payment Status</p>
          <p className="text-xs text-slate-400 mt-1">Due: {formatDate(mockPayment.dueDate)}</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm font-semibold rounded">
          {mockPayment.status}
        </span>
      </div>

      <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
        Send Payment Request
      </button>
    </div>
  );
}

// Activity Log
function ActivityLog({ activities }: { activities: Activity[] }) {
  const dealRoomActivities = activities.filter((a) =>
    ["deal-room-created", "document-sent", "document-signed", "document-viewed"].includes(a.type)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-slate-100 mb-6">📋 Activity Log</h3>

      <div className="space-y-4">
        {dealRoomActivities.length > 0 ? (
          dealRoomActivities.map((activity) => (
            <div key={activity.id} className="flex gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                {activity.type === "deal-room-created" && "🔐"}
                {activity.type === "document-sent" && "📤"}
                {(activity.type as string) === "document-viewed" && "👀"}
                {activity.type === "document-signed" && "✍️"}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-100">{activity.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-2">{getRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm">No deal room activities yet</p>
        )}
      </div>
    </div>
  );
}

// Client Portal Preview
function ClientPortalPreview({ lead }: { lead: any }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-slate-100 mb-4">🌐 Client Portal Preview</h3>
      <p className="text-sm text-slate-400 mb-4">
        This is what {lead.contact.firstName} sees when they access the portal
      </p>

      {/* Mini progress bar */}
      <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-xs">
              ✓
            </div>
            <span className="mt-1 text-slate-400">NDA</span>
          </div>
          <div className="flex-1 h-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">
              2
            </div>
            <span className="mt-1 text-slate-400">SOW</span>
          </div>
          <div className="flex-1 h-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs">
              3
            </div>
            <span className="mt-1 text-slate-400">Payment</span>
          </div>
          <div className="flex-1 h-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs">
              4
            </div>
            <span className="mt-1 text-slate-400">Feedback</span>
          </div>
          <div className="flex-1 h-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs">
              5
            </div>
            <span className="mt-1 text-slate-400">Complete</span>
          </div>
        </div>
      </div>

      <Link
        href={`/onboarding/${lead.id}`}
        className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors text-center"
      >
        Open Client Portal
      </Link>
    </div>
  );
}

// Quick Actions Bar
function QuickActionsBar() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">⚡ Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-lg transition-colors text-center">
          📧 Send Reminder Email
        </button>
        <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-lg transition-colors text-center">
          🔄 Resend Access Code
        </button>
        <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-center">
          ✅ Mark as Complete
        </button>
      </div>
    </div>
  );
}

// Main Page
export default function DealRoomPage() {
  const params = useParams();
  const dealRoomId = params.id as string;
  const { getLeadById, getActivitiesForLead } = useGSE();

  // Find lead with this deal room ID
  const lead = getLeadById(dealRoomId.split("-")[0]) ||
    // Fallback: search all leads
    Array.from({ length: 8 }, (_, i) => getLeadById(`lead-${String(i + 1).padStart(3, "0")}`)).find(
      (l) => l?.dealRoomId === dealRoomId
    );

  if (!lead) {
    return (
      <div className="p-6">
        <BackButton />
        <div className="text-center py-16">
          <p className="text-2xl font-semibold text-slate-300 mb-2">Deal Room Not Found</p>
          <p className="text-slate-400">The deal room you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/gse/deal-room"
            className="inline-block mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg"
          >
            Back to Deal Rooms
          </Link>
        </div>
      </div>
    );
  }

  const activities = getActivitiesForLead(lead.id);

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <BackButton />
      <DealRoomHeader dealRoomId={dealRoomId} lead={lead} />
      <DocumentsSection />
      <PaymentSection />
      <ActivityLog activities={activities} />
      <ClientPortalPreview lead={lead} />
      <QuickActionsBar />
    </div>
  );
}
