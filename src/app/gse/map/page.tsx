"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useGSE } from "@/lib/gse/store";
import {
  SALES_STATUS_CONFIG,
  VERTICAL_CONFIG,
  SERVICE_CONFIG,
  type SalesStatus,
  type GeoLocation,
  type Lead,
} from "@/lib/gse/types";

// ============================================================
// Utility Functions
// ============================================================

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

function getUniqueByKey<T extends Record<string, any>>(
  items: T[],
  key: keyof T
): T[] {
  const seen = new Set();
  return items.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.has(val) || seen.add(val);
    return true;
  });
}

/**
 * Map lat/lng to SVG coordinates
 * DFW area: lat 32.6-33.2, lng -97.4 to -96.5
 */
function geoToSvg(
  location: GeoLocation,
  viewBoxWidth: number = 800,
  viewBoxHeight: number = 600
) {
  const LAT_MIN = 32.6;
  const LAT_MAX = 33.2;
  const LNG_MIN = -97.4;
  const LNG_MAX = -96.5;

  const x =
    ((location.lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * viewBoxWidth;
  const y =
    ((LAT_MAX - location.lat) / (LAT_MAX - LAT_MIN)) * viewBoxHeight;

  return { x, y };
}

/**
 * Get dot size based on deal value
 */
function getDotSize(dealValue: number): number {
  const minSize = 6;
  const maxSize = 20;
  const minValue = 5000;
  const maxValue = 25000;
  const clamped = Math.max(minValue, Math.min(maxValue, dealValue));
  const normalized = (clamped - minValue) / (maxValue - minValue);
  return minSize + normalized * (maxSize - minSize);
}

/**
 * Calculate heat value for clustering visualization
 */
function calculateHeatValue(
  leads: Lead[],
  x: number,
  y: number,
  radius: number = 80
): number {
  let totalHeat = 0;
  let count = 0;

  leads.forEach((lead) => {
    const pos = geoToSvg(lead.location);
    const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
    if (distance < radius) {
      totalHeat += lead.heatScore * (1 - distance / radius);
      count++;
    }
  });

  return totalHeat;
}

// ============================================================
// Component: City Tag Pill
// ============================================================

function CityPill({
  city,
  count,
  value,
  onClick,
}: {
  city: string;
  count: number;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
    >
      {city} ({count})
    </button>
  );
}

// ============================================================
// Component: Territory Map SVG
// ============================================================

function TerritoryMapSvg({
  leads,
  selectedStatus,
  selectedCity,
  hoveredLeadId,
  onHover,
  onClick,
}: {
  leads: Lead[];
  selectedStatus: SalesStatus | null;
  selectedCity: string | null;
  hoveredLeadId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedStatus && lead.salesStatus !== selectedStatus) return false;
      if (selectedCity && lead.location.city !== selectedCity) return false;
      return true;
    });
  }, [leads, selectedStatus, selectedCity]);

  const viewBoxWidth = 800;
  const viewBoxHeight = 600;

  // Calculate grid and city labels
  const cities = [
    { name: "Frisco", lat: 32.9483, lng: -96.7299 },
    { name: "Plano", lat: 33.0198, lng: -96.6989 },
    { name: "Dallas", lat: 32.7767, lng: -96.7970 },
    { name: "Fort Worth", lat: 32.7555, lng: -97.3308 },
    { name: "Arlington", lat: 32.8140, lng: -97.1367 },
    { name: "Richardson", lat: 32.8668, lng: -96.7836 },
    { name: "McKinney", lat: 33.1507, lng: -96.8236 },
    { name: "Allen", lat: 32.9126, lng: -96.6389 },
    { name: "Carrollton", lat: 32.9857, lng: -96.8300 },
    { name: "The Colony", lat: 33.0801, lng: -96.8084 },
  ];

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
      >
        <defs>
          {/* Grid pattern */}
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path d={`M 80 0 L 0 0 0 80`} fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.2" />
          </pattern>

          {/* Radial gradient for heat effect */}
          <radialGradient id="heatGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for dots */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong glow for hovered dots */}
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#grid)" />

        {/* Grid lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`vline-${i}`}
            x1={(viewBoxWidth / 5) * i}
            y1="0"
            x2={(viewBoxWidth / 5) * i}
            y2={viewBoxHeight}
            stroke="#334155"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`hline-${i}`}
            x1="0"
            y1={(viewBoxHeight / 4) * i}
            x2={viewBoxWidth}
            y2={(viewBoxHeight / 4) * i}
            stroke="#334155"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Heat clusters */}
        {Array.from({ length: 4 }).map((_, x) => {
          return Array.from({ length: 3 }).map((_, y) => {
            const cx = (x + 0.5) * (viewBoxWidth / 4);
            const cy = (y + 0.5) * (viewBoxHeight / 3);
            const heatValue = calculateHeatValue(filteredLeads, cx, cy, 120);
            return heatValue > 50 ? (
              <circle
                key={`heat-${x}-${y}`}
                cx={cx}
                cy={cy}
                r="80"
                fill="url(#heatGradient)"
                opacity={Math.min(0.3, heatValue / 500)}
              />
            ) : null;
          });
        })}

        {/* Lead dots */}
        {filteredLeads.map((lead) => {
          const { x, y } = geoToSvg(lead.location, viewBoxWidth, viewBoxHeight);
          const size = getDotSize(lead.dealValue);
          const statusConfig = SALES_STATUS_CONFIG[lead.salesStatus];
          const isHovered = hoveredLeadId === lead.id;

          return (
            <g key={lead.id}>
              {/* Shadow/halo on hover */}
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r={size + 6}
                  fill={statusConfig.color}
                  opacity="0.15"
                />
              )}

              {/* Main dot */}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={statusConfig.color}
                opacity={isHovered ? 1 : 0.8}
                filter={isHovered ? "url(#glowStrong)" : "url(#glow)"}
                style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={() => onHover(lead.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onClick(lead.id)}
              />

              {/* Status icon label */}
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.7}
                fill="white"
                fontWeight="bold"
                pointerEvents="none"
              >
                {statusConfig.icon}
              </text>
            </g>
          );
        })}

        {/* City labels */}
        {cities.map((city) => {
          const { x, y } = geoToSvg(
            {
              lat: city.lat,
              lng: city.lng,
              city: city.name,
              state: "TX",
              zip: "",
              address: "",
            },
            viewBoxWidth,
            viewBoxHeight
          );
          return (
            <text
              key={`label-${city.name}`}
              x={x}
              y={y - 25}
              fontSize="11"
              fill="#64748b"
              textAnchor="middle"
              fontWeight="500"
              opacity="0.7"
            >
              {city.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// Component: Lead Tooltip Card
// ============================================================

function LeadTooltip({
  lead,
  visible,
}: {
  lead: Lead | null;
  visible: boolean;
}) {
  if (!lead || !visible) return null;

  return (
    <div className="absolute bg-slate-800 border border-slate-700 rounded-lg p-3 z-50 w-64 shadow-xl">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-slate-100 text-sm">
            {lead.contact.company}
          </p>
          <p className="text-xs text-slate-400">
            {lead.contact.firstName} {lead.contact.lastName}
          </p>
        </div>
      </div>
      <div className="space-y-1 text-xs text-slate-300">
        <p>
          <span className="text-slate-500">Status:</span>{" "}
          {SALES_STATUS_CONFIG[lead.salesStatus].label}
        </p>
        <p>
          <span className="text-slate-500">Deal Value:</span>{" "}
          {formatCurrency(lead.dealValue)}
        </p>
        <p>
          <span className="text-slate-500">Location:</span> {lead.location.city},{" "}
          {lead.location.state} {lead.location.zip}
        </p>
        <p>
          <span className="text-slate-500">Heat:</span> {lead.heatScore}/100
        </p>
      </div>
      <Link
        href={`/gse/leads/${lead.id}`}
        className="mt-2 block text-center text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded transition-colors"
      >
        View Lead
      </Link>
    </div>
  );
}

// ============================================================
// Component: Status Filter Chips
// ============================================================

function StatusFilterChips({
  selected,
  onChange,
}: {
  selected: SalesStatus | null;
  onChange: (status: SalesStatus | null) => void;
}) {
  const statuses: SalesStatus[] = [
    "not-contacted",
    "contacted",
    "prospect",
    "appointment-scheduled",
    "proposal-sent",
    "accepted",
    "client",
    "lost",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? "bg-blue-600 text-white"
            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
        }`}
      >
        All
      </button>
      {statuses.map((status) => {
        const config = SALES_STATUS_CONFIG[status];
        const isSelected = selected === status;
        return (
          <button
            key={status}
            onClick={() => onChange(isSelected ? null : status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? `text-white`
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
            style={{
              backgroundColor: isSelected ? config.color : undefined,
            }}
          >
            {config.icon} {config.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// Component: Status Stats Badges
// ============================================================

function StatusStatsBadges({ leads }: { leads: Lead[] }) {
  const statuses: SalesStatus[] = [
    "not-contacted",
    "contacted",
    "prospect",
    "appointment-scheduled",
    "proposal-sent",
    "accepted",
    "client",
    "lost",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const config = SALES_STATUS_CONFIG[status];
        const count = leads.filter((l) => l.salesStatus === status).length;
        return (
          <div
            key={status}
            className="px-3 py-1 rounded-full text-xs font-medium text-slate-900"
            style={{ backgroundColor: config.color }}
          >
            <span className="font-bold">{count}</span> {config.label}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Main Component: GPS Territory Map Page
// ============================================================

export default function TerritoryMapPage() {
  const { leads } = useGSE();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<SalesStatus | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filter leads by search term
  const searchedLeads = useMemo(() => {
    if (!searchTerm) return leads;
    const term = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.contact.company.toLowerCase().includes(term) ||
        lead.location.city.toLowerCase().includes(term) ||
        lead.location.zip.includes(term)
    );
  }, [leads, searchTerm]);

  // Apply status and city filters
  const filteredLeads = useMemo(() => {
    return searchedLeads.filter((lead) => {
      if (selectedStatus && lead.salesStatus !== selectedStatus) return false;
      if (selectedCity && lead.location.city !== selectedCity) return false;
      return true;
    });
  }, [searchedLeads, selectedStatus, selectedCity]);

  // City breakdown data
  const cityBreakdown = useMemo(() => {
    const grouped: Record<string, Lead[]> = {};
    leads.forEach((lead) => {
      const city = lead.location.city;
      if (!grouped[city]) grouped[city] = [];
      grouped[city].push(lead);
    });

    return Object.entries(grouped)
      .map(([city, cityLeads]) => ({
        city,
        count: cityLeads.length,
        value: cityLeads.reduce((sum, l) => sum + l.dealValue, 0),
        leads: cityLeads,
      }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  // Total pipeline and average heat score
  const stats = useMemo(() => {
    const totalValue = filteredLeads.reduce((sum, l) => sum + l.dealValue, 0);
    const avgHeat =
      filteredLeads.length > 0
        ? filteredLeads.reduce((sum, l) => sum + l.heatScore, 0) /
          filteredLeads.length
        : 0;
    return { totalValue, avgHeat };
  }, [filteredLeads]);

  const expandedLead = expandedLeadId ? leads.find((l) => l.id === expandedLeadId) ?? null : null;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-white mb-1">Territory Map</h1>
          <p className="text-slate-400">DFW Metro — Sales Coverage</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by city, zip, or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        {/* Status Filter Chips */}
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Filter by Status
          </p>
          <StatusFilterChips
            selected={selectedStatus}
            onChange={setSelectedStatus}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="mb-2 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Pipeline Stats
          </h3>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Pipeline Value</p>
            <p className="text-lg font-bold text-blue-400">
              {formatCurrency(stats.totalValue)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <StatusStatsBadges leads={filteredLeads} />
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Average Heat Score: <span className="font-semibold text-amber-400">{stats.avgHeat.toFixed(1)}/100</span>
        </div>
      </div>

      {/* Main Layout: Map + Side Panel */}
      <div className="flex gap-6">
        {/* Map Container */}
        <div className="flex-1 flex flex-col">
          <div
            ref={mapContainerRef}
            className="flex-1 min-h-96 mb-6 relative"
          >
            <TerritoryMapSvg
              leads={searchedLeads}
              selectedStatus={selectedStatus}
              selectedCity={selectedCity}
              hoveredLeadId={hoveredLeadId}
              onHover={setHoveredLeadId}
              onClick={setExpandedLeadId}
            />
            <LeadTooltip lead={expandedLead} visible={!!expandedLead} />
          </div>

          {/* Lead List Below Map */}
          {filteredLeads.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
                {selectedCity
                  ? `Leads in ${selectedCity}`
                  : selectedStatus
                  ? `${SALES_STATUS_CONFIG[selectedStatus].label} Leads`
                  : "All Leads"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {filteredLeads.map((lead) => {
                  const statusConfig = SALES_STATUS_CONFIG[lead.salesStatus];
                  return (
                    <Link
                      key={lead.id}
                      href={`/gse/leads/${lead.id}`}
                      className="p-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-750 hover:border-slate-600 transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-100 text-sm group-hover:text-blue-400 transition-colors">
                            {lead.contact.company}
                          </p>
                          <p className="text-xs text-slate-500">
                            {lead.location.city}, {lead.location.zip}
                          </p>
                        </div>
                        <div
                          className="px-2 py-1 rounded text-xs font-medium text-slate-900"
                          style={{ backgroundColor: statusConfig.color }}
                        >
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {formatCurrency(lead.dealValue)}
                        </span>
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${lead.heatScore}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel */}
        <div className="w-80 flex flex-col gap-6">
          {/* City Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
              City Breakdown
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {cityBreakdown.map((item) => {
                const activeCount = item.leads.filter(
                  (l) => l.salesStatus !== "lost"
                ).length;
                const lostCount = item.leads.filter(
                  (l) => l.salesStatus === "lost"
                ).length;
                const clientCount = item.leads.filter(
                  (l) => l.salesStatus === "client"
                ).length;

                return (
                  <button
                    key={item.city}
                    onClick={() => {
                      setSelectedCity(
                        selectedCity === item.city ? null : item.city
                      );
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCity === item.city
                        ? "bg-slate-700 border border-blue-500"
                        : "bg-slate-800 border border-slate-700 hover:bg-slate-750"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-100 text-sm">
                          {item.city}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.count} leads
                        </p>
                      </div>
                      <p className="font-semibold text-slate-300 text-sm">
                        {formatCurrency(item.value)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {clientCount > 0 && (
                        <div
                          className="flex-1 h-2 rounded"
                          style={{
                            backgroundColor: SALES_STATUS_CONFIG.client.color,
                            width: `${(clientCount / item.count) * 100}%`,
                          }}
                          title={`${clientCount} clients`}
                        />
                      )}
                      {activeCount - clientCount > 0 && (
                        <div
                          className="flex-1 h-2 rounded"
                          style={{
                            backgroundColor: SALES_STATUS_CONFIG.prospect.color,
                            width: `${((activeCount - clientCount) / item.count) * 100}%`,
                          }}
                          title={`${activeCount - clientCount} active`}
                        />
                      )}
                      {lostCount > 0 && (
                        <div
                          className="flex-1 h-2 rounded"
                          style={{
                            backgroundColor: SALES_STATUS_CONFIG.lost.color,
                            width: `${(lostCount / item.count) * 100}%`,
                          }}
                          title={`${lostCount} lost`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Status Legend
            </h3>
            <div className="space-y-2">
              {(
                [
                  "not-contacted",
                  "contacted",
                  "prospect",
                  "appointment-scheduled",
                  "proposal-sent",
                  "accepted",
                  "client",
                  "lost",
                ] as SalesStatus[]
              ).map((status) => {
                const config = SALES_STATUS_CONFIG[status];
                return (
                  <div
                    key={status}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-slate-300">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metrics Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Map Metrics
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Leads:</span>
                <span className="font-semibold">{filteredLeads.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pipeline Value:</span>
                <span className="font-semibold text-blue-400">
                  {formatCurrency(stats.totalValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Deal Size:</span>
                <span className="font-semibold">
                  {filteredLeads.length > 0
                    ? formatCurrency(stats.totalValue / filteredLeads.length)
                    : "$0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Heat Score:</span>
                <span className="font-semibold text-amber-400">
                  {stats.avgHeat.toFixed(1)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cities Covered:</span>
                <span className="font-semibold">{cityBreakdown.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
