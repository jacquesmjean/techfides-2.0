"use client";

import Link from "next/link";
import { useGSE } from "@/lib/gse/store";
import { SERVICE_CONFIG, VERTICAL_CONFIG } from "@/lib/gse/types";
import type { DealRoomStatus, Lead } from "@/lib/gse/types";

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

// Status badge styling
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

// Stats Row
function StatsRow({ leads }: { leads: Lead[] }) {
  const dealsWithRooms = leads.filter((l) => l.dealRoomId);
  const activeRooms = dealsWithRooms.filter(
    (l) => l.dealRoomStatus && !["completed"].includes(l.dealRoomStatus)
  ).length;

  // Mock metrics
  const totalDocuments = dealsWithRooms.length * 3; // Average 3 docs per room
  const awaitingSignature = dealsWithRooms.filter((l) => l.dealRoomStatus === "viewed").length;
  const paymentsReceived = dealsWithRooms.filter((l) => l.dealRoomStatus === "paid").length;

  const stats = [
    {
      label: "Active Rooms",
      value: activeRooms,
      icon: "🔐",
      color: "text-sky-400",
    },
    {
      label: "Documents Sent",
      value: totalDocuments,
      icon: "📄",
      color: "text-purple-400",
    },
    {
      label: "Awaiting Signature",
      value: awaitingSignature,
      icon: "✍️",
      color: "text-amber-400",
    },
    {
      label: "Payments Received",
      value: paymentsReceived,
      icon: "💰",
      color: "text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Deal Room Card
function DealRoomCard({ lead }: { lead: Lead }) {
  if (!lead.dealRoomId) return null;

  const statusColor = getStatusBadgeColor(lead.dealRoomStatus);
  const serviceConfig = SERVICE_CONFIG[lead.service];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-all group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              {lead.contact.firstName} {lead.contact.lastName}
            </h3>
            <p className="text-sm text-slate-400 mt-1">{lead.contact.company}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
          >
            {lead.dealRoomStatus || "draft"}
          </div>
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
          <span className="text-sm text-slate-300 flex items-center gap-1">
            {serviceConfig.icon} {serviceConfig.label}
          </span>
          <span className="text-sm text-slate-500">{formatCurrency(lead.dealValue)}</span>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Documents</span>
            <span className="font-medium text-slate-100">3 files</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Created</span>
            <span className="text-slate-300">{formatDate(lead.createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/gse/deal-room/${lead.dealRoomId}`}
          className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium rounded-lg transition-colors text-center"
        >
          Open Deal Room
        </Link>
      </div>
    </div>
  );
}

// Main Page
export default function DealRoomsPage() {
  const { leads } = useGSE();
  const dealsWithRooms = leads.filter((l) => l.dealRoomId);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Digital Deal Rooms</h1>
        <p className="text-sm text-slate-400 mt-2">
          Secure branded portals for client proposals, contracts, and payments
        </p>
      </div>

      {/* Stats */}
      <StatsRow leads={leads} />

      {/* Deal Rooms Grid */}
      {dealsWithRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dealsWithRooms.map((lead) => (
            <DealRoomCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/50 border border-dashed border-slate-700 rounded-lg">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="text-lg font-semibold text-slate-300">No deal rooms created yet</h3>
          <p className="text-sm text-slate-400 mt-2">
            Create a deal room when you move a lead to the proposal stage
          </p>
        </div>
      )}
    </div>
  );
}
