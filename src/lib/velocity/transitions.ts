/**
 * Deal-to-Project Transition Service
 *
 * When a deal is marked "closed-won", this service automatically:
 * 1. Creates a Project in the delivery pipeline
 * 2. Logs the transition as an Activity
 * 3. Creates a welcome notification
 *
 * This closes the gap between the Sales Machine and Client Delivery.
 */

import { db } from "@/lib/db";

interface TransitionInput {
  leadId: string;
  dealValue: number;
  service: string;
}

const SERVICE_MAP: Record<string, "SOVEREIGN_AI" | "AI_READINESS_360" | "TRANSFORMATION_MANAGEMENT" | "AEGIS"> = {
  "sovereign-ai": "SOVEREIGN_AI",
  "ai-readiness-360": "AI_READINESS_360",
  "transformation-management": "TRANSFORMATION_MANAGEMENT",
  aegis: "AEGIS",
  SOVEREIGN_AI: "SOVEREIGN_AI",
  AI_READINESS_360: "AI_READINESS_360",
  TRANSFORMATION_MANAGEMENT: "TRANSFORMATION_MANAGEMENT",
  AEGIS: "AEGIS",
};

const TIER_BY_VALUE: (value: number) => string = (value) => {
  if (value >= 15000) return "Platinum";
  if (value >= 10000) return "Gold";
  return "Silver";
};

export async function transitionDealToProject(input: TransitionInput) {
  // Look up lead from database (if available) or use seed data context
  let lead;
  try {
    lead = await db.lead.findUnique({ where: { id: input.leadId } });
  } catch {
    // DB might not have this lead (seed data), continue without
  }

  const clientName = lead
    ? `${lead.firstName} ${lead.lastName} — ${lead.company}`
    : `Client (Lead ${input.leadId})`;

  const service = SERVICE_MAP[input.service] || "SOVEREIGN_AI";
  const tier = TIER_BY_VALUE(input.dealValue);

  // Calculate planned timeline based on tier
  const now = new Date();
  const plannedStart = new Date(now);
  plannedStart.setDate(plannedStart.getDate() + 3); // 3 days for setup
  const durationWeeks = tier === "Platinum" ? 8 : tier === "Gold" ? 6 : 4;
  const plannedEnd = new Date(plannedStart);
  plannedEnd.setDate(plannedEnd.getDate() + durationWeeks * 7);

  // Create the project
  const project = await db.project.create({
    data: {
      name: `${service.replace(/_/g, " ")} Deployment — ${lead?.company || "Client"}`,
      clientName,
      leadId: input.leadId,
      service,
      tier,
      status: "PLANNING",
      plannedStart,
      plannedEnd,
      contractValue: input.dealValue,
      description: `Auto-created from closed-won deal. ${tier} tier, ${durationWeeks}-week delivery timeline.`,
    },
  });

  // Log the transition as a project update
  await db.projectUpdate.create({
    data: {
      projectId: project.id,
      authorName: "System",
      authorRole: "Velocity Engine",
      type: "STATUS_UPDATE",
      title: "Project auto-created from closed deal",
      body: `Deal closed-won for $${input.dealValue.toLocaleString()}. ${tier} tier with ${durationWeeks}-week delivery timeline. Planned start: ${plannedStart.toLocaleDateString()}.`,
    },
  });

  // Log activity on the lead
  if (lead) {
    await db.activity.create({
      data: {
        leadId: input.leadId,
        type: "TASK_COMPLETED",
        title: `Deal closed → Project created: ${project.name}`,
        description: `Auto-transitioned to delivery pipeline. Project ID: ${project.id}. Tier: ${tier}.`,
        automated: true,
        metadata: { projectId: project.id, tier, service },
      },
    });
  }

  return { project, tier, plannedStart, plannedEnd };
}
