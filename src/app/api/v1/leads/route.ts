/**
 * GET /api/v1/leads
 *
 * Returns leads from the database. Filters supported via query params:
 *   stage      = PROSPECT|QUALIFIED|PROPOSAL|NEGOTIATION|CLOSED_WON|CLOSED_LOST
 *   vertical   = LEGAL|MEDICAL|AUTO|TRADES|PROPERTY_MANAGEMENT|OTHER
 *   service    = SOVEREIGN_AI|AI_READINESS_360|TRANSFORMATION_MANAGEMENT|AEGIS
 *   source     = WEBSITE|REFERRAL|LINKEDIN|COLD_OUTREACH|PARTNER|EVENT|INBOUND_CALL
 *   region     = US|MX|CEMAC
 *   search     = free-text search over name, company, email
 *   limit      = max 200 (default 100)
 *
 * Returns shape compatible with the GSE store Lead type so existing
 * frontend components can consume it with minimal change.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type LeadFilter = {
  stage?: { in: string[] };
  vertical?: { in: string[] };
  service?: { in: string[] };
  source?: { in: string[] };
  region?: { in: string[] };
  OR?: Array<Record<string, { contains: string; mode: "insensitive" }>>;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10), 200);

  const where: LeadFilter = {};
  const stage = url.searchParams.get("stage");
  if (stage) where.stage = { in: stage.split(",") };
  const vertical = url.searchParams.get("vertical");
  if (vertical) where.vertical = { in: vertical.split(",") };
  const service = url.searchParams.get("service");
  if (service) where.service = { in: service.split(",") };
  const source = url.searchParams.get("source");
  if (source) where.source = { in: source.split(",") };
  const region = url.searchParams.get("region");
  if (region) where.region = { in: region.split(",") };

  const search = url.searchParams.get("search");
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const leads = await db.lead.findMany({
      where: where as never,
      orderBy: [{ heatScore: "desc" }, { dealValue: "desc" }],
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        title: true,
        company: true,
        stage: true,
        dealValue: true,
        vertical: true,
        service: true,
        source: true,
        region: true,
        heatScore: true,
        staleDays: true,
        city: true,
        state: true,
        zip: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Map to a frontend-friendly shape that matches what the existing
    // Pipeline / Leads components expect from the GSE store. Contact
    // fields are nested under `contact` to mirror the original shape.
    const mapped = leads.map((l) => ({
      id: l.id,
      contact: {
        firstName: l.firstName,
        lastName: l.lastName,
        email: l.email,
        phone: l.phone ?? "",
        title: l.title ?? "",
        company: l.company,
      },
      stage: String(l.stage).toLowerCase().replace(/_/g, "-"), // maps PROSPECT → prospect, CLOSED_WON → closed-won
      dealValue: l.dealValue ?? 0,
      vertical: String(l.vertical).toLowerCase().replace(/_/g, "-"),
      service: String(l.service).toLowerCase().replace(/_/g, "-"),
      source: String(l.source).toLowerCase().replace(/_/g, "-"),
      region: String(l.region).toLowerCase(),
      heatScore: l.heatScore ?? 0,
      staleDays: l.staleDays ?? 0,
      city: l.city,
      state: l.state,
      zip: l.zip,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
      // lastActivity defaults to updatedAt until Activity table is wired
      // into the lead-detail summary in Phase 2 Task #9.
      lastActivity: l.updatedAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, leads: mapped, count: mapped.length });
  } catch (err) {
    console.error("[api/v1/leads] failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
