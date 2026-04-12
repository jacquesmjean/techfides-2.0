/**
 * GET /api/v1/notifications/poll?since=timestamp
 *
 * Lightweight polling endpoint for real-time toast notifications.
 * Returns events that occurred since the given timestamp.
 *
 * In production, replace with WebSocket (Pusher/Ably) for instant delivery.
 * This polling approach works for MVP and low-traffic.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sinceStr = searchParams.get("since");
  const since = sinceStr ? new Date(Number(sinceStr)) : new Date(Date.now() - 60000);

  const events: { id: string; type: string; title: string; message: string; link?: string }[] = [];

  try {
    // Check for hot leads going stale (heatScore >80, stale >0)
    const staleHotLeads = await db.lead.findMany({
      where: {
        heatScore: { gte: 80 },
        staleDays: { gte: 1 },
        stage: { in: ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] },
        updatedAt: { gte: since },
      },
      take: 3,
    });

    for (const lead of staleHotLeads) {
      events.push({
        id: `stall-${lead.id}-${Date.now()}`,
        type: "stall",
        title: `Stall Alert: ${lead.firstName} ${lead.lastName}`,
        message: `Heat ${lead.heatScore}, ${lead.staleDays}d stale. $${lead.dealValue.toLocaleString()} deal cooling.`,
        link: `/gse/leads/${lead.id}`,
      });
    }

    // Check for recently closed deals
    const recentWins = await db.activity.findMany({
      where: {
        type: "STAGE_CHANGE",
        title: { contains: "closed-won" },
        createdAt: { gte: since },
      },
      take: 3,
    });

    for (const win of recentWins) {
      events.push({
        id: `deal-${win.id}`,
        type: "deal",
        title: "Deal Closed!",
        message: win.description || win.title,
        link: `/gse/leads/${win.leadId}`,
      });
    }

    // Check for overdue projects
    const overdueProjects = await db.project.findMany({
      where: {
        status: "IN_PROGRESS",
        plannedEnd: { lt: new Date() },
        updatedAt: { gte: since },
      },
      take: 2,
    });

    for (const proj of overdueProjects) {
      events.push({
        id: `project-${proj.id}-${Date.now()}`,
        type: "project",
        title: `Project Overdue: ${proj.clientName}`,
        message: `"${proj.name}" past planned end date.`,
        link: "/gse/projects",
      });
    }
  } catch {
    // DB might not be connected — return empty events
  }

  return NextResponse.json({ events });
}
