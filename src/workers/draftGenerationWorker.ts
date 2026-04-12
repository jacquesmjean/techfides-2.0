/**
 * Draft Generation Worker — BullMQ background process
 *
 * Runs on a cron schedule (Mon-Fri 8am by default) to generate
 * branded email drafts. Splits 25/25 between Tier 2 and Tier 1.
 *
 * Run with: npm run worker:drafts
 */

import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import { generateDrafts } from "../lib/email/draft-service";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

const queue = new Queue("draft-generation", { connection });

console.log("[draft-worker] Starting...");

// Set up the daily schedule
async function setupScheduler() {
  try {
    await queue.upsertJobScheduler(
      "daily-drafts",
      { pattern: "0 8 * * 1-5" }, // Mon-Fri at 8am
      {
        name: "generate-daily-drafts",
        data: { triggeredBy: "schedule" },
      }
    );
    console.log("[draft-worker] Scheduled: Mon-Fri 8:00 AM");
  } catch (e) {
    console.error("[draft-worker] Failed to set up scheduler:", e);
  }
}

const worker = new Worker(
  "draft-generation",
  async (job) => {
    console.log(`[draft-worker] Running draft generation (${job.data.triggeredBy})...`);

    const result = await generateDrafts({
      triggeredBy: job.data.triggeredBy || "schedule",
    });

    console.log(
      `[draft-worker] Done: ${result.generated} generated (T2: ${result.tier2Generated}, T1: ${result.tier1Generated}), ` +
      `${result.pivoted} pivoted, ${result.skipped} skipped, ${result.errors.length} errors`
    );

    return result;
  },
  { connection, concurrency: 1 }
);

worker.on("failed", (job, err) => {
  console.error(`[draft-worker] Job ${job?.id} failed:`, err.message);
});

setupScheduler();

process.on("SIGTERM", async () => {
  console.log("[draft-worker] Shutting down...");
  await worker.close();
  await connection.quit();
  process.exit(0);
});
