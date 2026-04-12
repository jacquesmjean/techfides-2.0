/**
 * Enrichment Worker — BullMQ background process
 *
 * Consumes jobs from the "enrichment" queue, calls Apollo to enrich leads,
 * updates the database, and writes an audit trail.
 *
 * Run with: npm run worker:enrichment
 *
 * In production, run as a separate process (e.g. systemd unit or PM2 process).
 */

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { db } from "../lib/db";
import {
  enrichLead,
  classifyTier,
  mapVertical,
} from "../lib/velocity/enrichment/apollo";
import type { EnrichmentJobData } from "../lib/velocity/queue";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

console.log("[enrichment-worker] Starting...");

const worker = new Worker<EnrichmentJobData>(
  "enrichment",
  async (job) => {
    const { leadId } = job.data;
    console.log(`[enrichment-worker] Processing lead ${leadId}`);

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    // Call Apollo (or mock)
    const result = await enrichLead({
      email: lead.email,
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      linkedinUrl: lead.linkedinUrl ?? undefined,
    });

    // Classify
    const tier = classifyTier(result.companyRevenue);
    const vertical = mapVertical(result.companyIndustry);

    // Update lead with enriched fields
    await db.lead.update({
      where: { id: leadId },
      data: {
        title: result.personTitle ?? lead.title,
        tier,
        vertical,
        enrichmentJson: result.raw as object,
      },
    });

    // Persist enrichment record for audit
    await db.enrichment.create({
      data: {
        leadId,
        provider: "apollo",
        companyRevenue: result.companyRevenue,
        companyEmployees: result.companyEmployees,
        companyIndustry: result.companyIndustry,
        companyTechStack: result.companyTechStack ?? [],
        rawJson: result.raw as object,
      },
    });

    // Activity log
    await db.activity.create({
      data: {
        leadId,
        type: "NOTE",
        title: "Lead enriched via Apollo",
        description: `Tier: ${tier}, Vertical: ${vertical}, Revenue: ${result.companyRevenue ?? "unknown"}`,
        automated: true,
      },
    });

    console.log(`[enrichment-worker] Done: ${leadId} → ${tier}/${vertical}`);
    return { leadId, tier, vertical };
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on("failed", (job, err) => {
  console.error(`[enrichment-worker] Job ${job?.id} failed:`, err.message);
});

worker.on("completed", (job) => {
  console.log(`[enrichment-worker] Job ${job.id} completed`);
});

process.on("SIGTERM", async () => {
  console.log("[enrichment-worker] Shutting down...");
  await worker.close();
  await connection.quit();
  process.exit(0);
});
