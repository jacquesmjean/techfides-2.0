/**
 * POST /api/v1/leads/ingest
 *
 * Velocity Engine entry point. Accepts raw lead data from scrapers
 * (Apollo, Clay, LinkedIn Sales Navigator) and queues each one for
 * enrichment.
 *
 * Auth: handled by middleware.ts — requires either a valid session OR
 *       a `Authorization: Bearer ${VELOCITY_API_KEY}` header.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getEnrichmentQueue } from "@/lib/velocity/queue";

const LeadInputSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  title: z.string().max(255).optional(),
  company: z.string().min(1).max(255),
  phone: z.string().max(50).optional(),
  linkedinUrl: z.string().url().max(500).optional(),
  rawData: z.record(z.string(), z.unknown()).optional(),
});

const IngestRequestSchema = z.object({
  source: z.enum(["apollo", "clay", "linkedin", "manual", "website"]),
  leads: z.array(LeadInputSchema).min(1).max(100),
});

const sourceMap = {
  apollo: "COLD_OUTREACH",
  clay: "COLD_OUTREACH",
  linkedin: "LINKEDIN",
  manual: "REFERRAL",
  website: "WEBSITE",
} as const;

export async function POST(request: Request) {
  // Parse and validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = IngestRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { source, leads } = parsed.data;

  // Process each lead
  const results = {
    ingested: 0,
    duplicates: 0,
    enrichmentJobIds: [] as string[],
    errors: [] as { email: string; error: string }[],
  };

  for (const leadInput of leads) {
    try {
      // Check for duplicate by email
      const existing = await db.lead.findUnique({
        where: { email: leadInput.email },
        select: { id: true },
      });

      if (existing) {
        results.duplicates++;
        continue;
      }

      // Create stub Lead
      const lead = await db.lead.create({
        data: {
          firstName: leadInput.firstName,
          lastName: leadInput.lastName,
          email: leadInput.email,
          title: leadInput.title,
          company: leadInput.company,
          phone: leadInput.phone,
          linkedinUrl: leadInput.linkedinUrl,
          vertical: "OTHER", // will be set by enrichment worker
          service: "SOVEREIGN_AI",
          stage: "PROSPECT",
          source: sourceMap[source],
          region: "US",
          currency: "USD",
          heatScore: 0,
          tier: "UNKNOWN",
        },
      });

      // Queue for enrichment
      const job = await getEnrichmentQueue().add(
        "enrich-lead",
        { leadId: lead.id, source },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: 100,
          removeOnFail: 1000,
        }
      );

      results.ingested++;
      if (job.id) results.enrichmentJobIds.push(job.id);
    } catch (err) {
      results.errors.push({
        email: leadInput.email,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json(results, { status: 202 });
}
