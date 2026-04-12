/**
 * BullMQ queue definitions for the Velocity Engine.
 *
 * Queues:
 *   - enrichment   — Apollo/Clay enrichment jobs
 *   - outreach     — Outreach sequence delivery
 *   - signals      — Behavioral signal processing
 */

import { Queue } from "bullmq";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Lazy connection — only create when actually used (so build doesn't connect)
let connection: IORedis | null = null;
function getConnection(): IORedis {
  if (!connection) {
    connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }
  return connection;
}

export interface EnrichmentJobData {
  leadId: string;
  source: string;
}

export interface OutreachJobData {
  sequenceId: string;
  stepOrder: number;
  leadId: string;
}

export interface SignalJobData {
  leadId: string;
  type: string;
  source: string;
  metadata?: Record<string, unknown>;
}

let enrichmentQueueInstance: Queue<EnrichmentJobData> | null = null;
let outreachQueueInstance: Queue<OutreachJobData> | null = null;
let signalQueueInstance: Queue<SignalJobData> | null = null;

export function getEnrichmentQueue(): Queue<EnrichmentJobData> {
  if (!enrichmentQueueInstance) {
    enrichmentQueueInstance = new Queue<EnrichmentJobData>("enrichment", {
      connection: getConnection(),
    });
  }
  return enrichmentQueueInstance;
}

export function getOutreachQueue(): Queue<OutreachJobData> {
  if (!outreachQueueInstance) {
    outreachQueueInstance = new Queue<OutreachJobData>("outreach", {
      connection: getConnection(),
    });
  }
  return outreachQueueInstance;
}

export function getSignalQueue(): Queue<SignalJobData> {
  if (!signalQueueInstance) {
    signalQueueInstance = new Queue<SignalJobData>("signals", {
      connection: getConnection(),
    });
  }
  return signalQueueInstance;
}
