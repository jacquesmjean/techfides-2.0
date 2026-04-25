/**
 * Forecast Worker — BullMQ background process
 *
 * Runs daily at 02:00 (local time) to compute a fresh ForecastRun for
 * each period (YEARLY, QUARTERLY, MONTHLY). Writes one PUBLISHED row
 * per period per run. Forecast page, CEO Cockpit, and Intelligence
 * revenue API all read from the most recent PUBLISHED row.
 *
 * Run with: npm run worker:forecast
 *
 * Add to package.json scripts:
 *   "worker:forecast": "tsx src/workers/forecastWorker.ts"
 */

import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import { computeForecast } from "../lib/forecast/compute";
import type { ForecastPeriod } from "@prisma/client";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

const queue = new Queue("forecast-compute", { connection });

console.log("[forecast-worker] Starting...");

async function setupScheduler() {
  try {
    await queue.upsertJobScheduler(
      "daily-forecast",
      { pattern: "0 2 * * *" }, // Every day at 2:00 AM local time
      {
        name: "compute-daily-forecast",
        data: { triggeredBy: "schedule" },
      }
    );
    console.log("[forecast-worker] Scheduled: every day 2:00 AM");
  } catch (e) {
    console.error("[forecast-worker] Failed to set up scheduler:", e);
  }
}

const worker = new Worker(
  "forecast-compute",
  async (job) => {
    console.log(`[forecast-worker] Computing forecasts (${job.data.triggeredBy})...`);

    const periods: ForecastPeriod[] = ["YEARLY", "QUARTERLY", "MONTHLY"];
    const results = [];

    for (const period of periods) {
      try {
        const run = await computeForecast({
          period,
          computedBy: job.data.triggeredBy === "schedule" ? "cron" : "manual",
          publish: true,
        });
        results.push({
          period,
          ok: true,
          projectedRevenue: run.projectedRevenue,
          gapToTarget: run.gapToTarget,
          confidence: run.confidence,
        });
        console.log(
          `[forecast-worker] ${period}: projected $${run.projectedRevenue.toLocaleString()}, ` +
            `gap ${run.gapToTarget >= 0 ? "+" : ""}$${run.gapToTarget.toLocaleString()}, ` +
            `confidence ${run.confidence}%`
        );
      } catch (err) {
        console.error(`[forecast-worker] ${period} failed:`, err);
        results.push({ period, ok: false, error: String(err) });
      }
    }

    return { results };
  },
  { connection, concurrency: 1 }
);

worker.on("failed", (job, err) => {
  console.error(`[forecast-worker] Job ${job?.id} failed:`, err.message);
});

setupScheduler();

process.on("SIGTERM", async () => {
  console.log("[forecast-worker] Shutting down...");
  await worker.close();
  await connection.quit();
  process.exit(0);
});
