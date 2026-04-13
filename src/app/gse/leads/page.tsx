"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGSE } from "@/lib/gse/store";
import type {
  PipelineStage, Vertical, ServiceType, LeadSource,
} from "@/lib/gse/types";
import { STAGE_CONFIG, SERVICE_CONFIG, VERTICAL_CONFIG, SOURCE_CONFIG } from "@/lib/gse/types";

type SortColumn = "value" | "heat" | "lastActivity" | null;

export default function LeadsPage() {
  const { leads } = useGSE();
  const [search, setSearch] = useState("");
  const [selectedStages, setSelectedStages] = useState<PipelineStage[]>([]);
  const [selectedVerticals, setSelectedVerticals] = useState<Vertical[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [selectedSources, setSelectedSources] = useState<LeadSource[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Filter leads
  const filteredLeads = useMemo(() => {
    let result = leads;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.contact.firstName.toLowerCase().includes(q) ||
          l.contact.lastName.toLowerCase().includes(q) ||
          l.contact.company.toLowerCase().includes(q) ||
          l.contact.email.toLowerCase().includes(q)
      );
    }

    if (selectedStages.length > 0) {
      result = result.filter((l) => selectedStages.includes(l.stage));
    }

    if (selectedVerticals.length > 0) {
      result = result.filter((l) => selectedVerticals.includes(l.vertical));
    }

    if (selectedServices.length > 0) {
      result = result.filter((l) => selectedServices.includes(l.service));
    }

    if (selectedSources.length > 0) {
      result = result.filter((l) => selectedSources.includes(l.source));
    }

    // Sort
    if (sortColumn) {
      result = result.slice().sort((a, b) => {
        let aVal: number = 0;
        let bVal: number = 0;

        if (sortColumn === "value") {
          aVal = a.dealValue;
          bVal = b.dealValue;
        } else if (sortColumn === "heat") {
          aVal = a.heatScore;
          bVal = b.heatScore;
        } else if (sortColumn === "lastActivity") {
          aVal = new Date(a.lastActivity).getTime();
          bVal = new Date(b.lastActivity).getTime();
        }

        return sortAsc ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [leads, search, selectedStages, selectedVerticals, selectedServices, selectedSources, sortColumn, sortAsc]);

  const handleStageMToggle = (stage: PipelineStage) => {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  };

  const handleVerticalToggle = (vertical: Vertical) => {
    setSelectedVerticals((prev) =>
      prev.includes(vertical) ? prev.filter((v) => v !== vertical) : [...prev, vertical]
    );
  };

  const handleServiceToggle = (service: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSourceToggle = (source: LeadSource) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(false);
    }
  };

  const relativeDate = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const stageColors = {
    prospect: "bg-slate-700 text-slate-100",
    qualified: "bg-sky-700 text-sky-100",
    proposal: "bg-purple-700 text-purple-100",
    negotiation: "bg-amber-700 text-amber-100",
    "closed-won": "bg-emerald-700 text-emerald-100",
    "closed-lost": "bg-red-700 text-red-100",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Leads</h1>
          <p className="text-sm text-slate-400 mt-1">
            {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
        <Link
          href="/gse/pipeline"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
        >
          View Pipeline
        </Link>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by name, company, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Filter Chips */}
      <div className="space-y-4">
        {/* Stage Filters */}
        <div className="flex flex-wrap gap-2 items-start">
          <span className="text-sm font-medium text-slate-400 mt-1.5">Stage:</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STAGE_CONFIG) as PipelineStage[]).map((stage) => (
              <button
                key={stage}
                onClick={() => handleStageMToggle(stage)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  selectedStages.includes(stage)
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {STAGE_CONFIG[stage].label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Filters */}
        <div className="flex flex-wrap gap-2 items-start">
          <span className="text-sm font-medium text-slate-400 mt-1.5">Vertical:</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(VERTICAL_CONFIG) as Vertical[]).map((vertical) => (
              <button
                key={vertical}
                onClick={() => handleVerticalToggle(vertical)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  selectedVerticals.includes(vertical)
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {VERTICAL_CONFIG[vertical].icon} {VERTICAL_CONFIG[vertical].label}
              </button>
            ))}
          </div>
        </div>

        {/* Service Filters */}
        <div className="flex flex-wrap gap-2 items-start">
          <span className="text-sm font-medium text-slate-400 mt-1.5">Service:</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SERVICE_CONFIG) as ServiceType[]).map((service) => (
              <button
                key={service}
                onClick={() => handleServiceToggle(service)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  selectedServices.includes(service)
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {SERVICE_CONFIG[service].icon} {SERVICE_CONFIG[service].label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Filters */}
        <div className="flex flex-wrap gap-2 items-start">
          <span className="text-sm font-medium text-slate-400 mt-1.5">Source:</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SOURCE_CONFIG) as LeadSource[]).map((source) => (
              <button
                key={source}
                onClick={() => handleSourceToggle(source)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  selectedSources.includes(source)
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {SOURCE_CONFIG[source].icon} {SOURCE_CONFIG[source].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-slate-800 bg-slate-800/30">
          <p className="text-slate-400 text-lg font-medium">No leads match your filters</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                  Stage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase cursor-pointer hover:text-sky-400 transition"
                  onClick={() => handleSort("value")}
                >
                  Value
                  {sortColumn === "value" && (
                    <span className="ml-1">{sortAsc ? "▲" : "▼"}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase cursor-pointer hover:text-sky-400 transition"
                  onClick={() => handleSort("heat")}
                >
                  Heat Score
                  {sortColumn === "heat" && (
                    <span className="ml-1">{sortAsc ? "▲" : "▼"}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase cursor-pointer hover:text-sky-400 transition"
                  onClick={() => handleSort("lastActivity")}
                >
                  Last Activity
                  {sortColumn === "lastActivity" && (
                    <span className="ml-1">{sortAsc ? "▲" : "▼"}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className={`border-b border-slate-800 hover:bg-slate-800/50 transition ${
                    idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/30"
                  }`}
                >
                  {/* Contact */}
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/gse/leads/${lead.id}`}
                      className="hover:underline text-slate-100 cursor-pointer block"
                    >
                      <div className="font-medium">
                        {lead.contact.firstName} {lead.contact.lastName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {lead.contact.company}
                      </div>
                    </Link>
                  </td>

                  {/* Service */}
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {SERVICE_CONFIG[lead.service].icon} {SERVICE_CONFIG[lead.service].label}
                  </td>

                  {/* Stage */}
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        stageColors[lead.stage as keyof typeof stageColors]
                      }`}
                    >
                      {STAGE_CONFIG[lead.stage].label}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="px-6 py-4 text-sm text-right font-medium text-slate-100">
                    ${lead.dealValue.toLocaleString()}
                  </td>

                  {/* Heat Score */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
                          style={{ width: `${lead.heatScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">
                        {lead.heatScore}
                      </span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {SOURCE_CONFIG[lead.source].icon} {SOURCE_CONFIG[lead.source].label}
                  </td>

                  {/* Last Activity */}
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {relativeDate(lead.lastActivity)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/gse/leads/${lead.id}`}
                      className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
