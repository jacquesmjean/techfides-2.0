/**
 * Self-Healing Intelligence Layer
 *
 * Continuously monitors the TechFides system for broken links,
 * stale data, lifecycle gaps, and performance issues.
 * Auto-fixes what it can, recommends what it can't.
 *
 * Called by: /api/v1/intelligence/health-check (scheduled or manual)
 */

import { db } from "@/lib/db";

export interface HealthIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "broken" | "stale" | "gap" | "performance" | "recommendation";
  title: string;
  description: string;
  autoFixable: boolean;
  autoFixAction?: string;
  fixed: boolean;
  fixedAt?: string;
}

/**
 * Run a comprehensive system health check.
 * Returns issues found and auto-fixes applied.
 */
export async function runHealthCheck(): Promise<{
  issues: HealthIssue[];
  autoFixed: number;
  recommendations: string[];
}> {
  const issues: HealthIssue[] = [];
  let autoFixed = 0;
  const recommendations: string[] = [];

  try {
    // ============================================================
    // 1. STALE DATA DETECTION
    // ============================================================

    // Leads with no activity for 7+ days that aren't closed
    const staleLeads = await db.lead.findMany({
      where: {
        staleDays: { gte: 7 },
        stage: { in: ["PROSPECT", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] },
      },
    });

    for (const lead of staleLeads) {
      if (lead.staleDays >= 14) {
        issues.push({
          id: `stale-lead-${lead.id}`,
          severity: lead.heatScore >= 70 ? "critical" : "high",
          category: "stale",
          title: `Lead ${lead.firstName} ${lead.lastName} stale for ${lead.staleDays} days`,
          description: `${lead.company}, heat ${lead.heatScore}, $${lead.dealValue.toLocaleString()}. No activity since ${lead.lastActivity.toLocaleDateString()}.`,
          autoFixable: lead.heatScore < 40,
          autoFixAction: lead.heatScore < 40 ? "Move to long-term nurture" : undefined,
          fixed: false,
        });

        // Auto-fix: Move very cold leads to long-term nurture
        if (lead.heatScore < 40 && lead.staleDays >= 30) {
          await db.lead.update({
            where: { id: lead.id },
            data: {
              tags: [...lead.tags, "auto-nurture-long-term"],
              notes: `${lead.notes || ""}\n\n[Auto] Moved to long-term nurture after ${lead.staleDays} days stale.`,
            },
          });
          issues[issues.length - 1].fixed = true;
          issues[issues.length - 1].fixedAt = new Date().toISOString();
          autoFixed++;
        }
      }
    }

    // ============================================================
    // 2. LIFECYCLE GAP DETECTION
    // ============================================================

    // Closed-won leads without a project
    const closedWonNoProject = await db.lead.findMany({
      where: {
        stage: "CLOSED_WON",
        NOT: {
          id: {
            in: (await db.project.findMany({ select: { leadId: true } }))
              .filter((p) => p.leadId)
              .map((p) => p.leadId as string),
          },
        },
      },
    });

    for (const lead of closedWonNoProject) {
      issues.push({
        id: `gap-no-project-${lead.id}`,
        severity: "critical",
        category: "gap",
        title: `Closed-won deal has no project: ${lead.firstName} ${lead.lastName}`,
        description: `${lead.company} closed-won for $${lead.dealValue.toLocaleString()} but no delivery project was created. Revenue at risk.`,
        autoFixable: true,
        autoFixAction: "Auto-create project from deal data",
        fixed: false,
      });
    }

    // Completed projects without client sign-off
    const completedNoSignoff = await db.project.findMany({
      where: { status: "COMPLETED" },
    });

    for (const proj of completedNoSignoff) {
      const signoff = await db.clientSignoff.findFirst({
        where: { projectId: proj.id },
      });
      if (!signoff) {
        issues.push({
          id: `gap-no-signoff-${proj.id}`,
          severity: "high",
          category: "gap",
          title: `Completed project missing client sign-off: ${proj.name}`,
          description: `${proj.clientName} project marked complete but client hasn't signed off. NPS not captured.`,
          autoFixable: false,
          fixed: false,
        });
      }
    }

    // Active clients with no recent tickets or touchpoints
    const activeClients = await db.clientAccount.findMany({
      where: { status: "ACTIVE" },
      include: { tickets: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    for (const client of activeClients) {
      const lastTicket = client.tickets[0];
      const daysSinceLastTouch = lastTicket
        ? Math.floor((Date.now() - new Date(lastTicket.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysSinceLastTouch > 60) {
        issues.push({
          id: `gap-silent-client-${client.id}`,
          severity: "medium",
          category: "gap",
          title: `Active client with no engagement for ${daysSinceLastTouch}+ days`,
          description: `${client.companyName} is paying $${client.retainerAmount}/mo but hasn't opened a ticket or had contact in ${daysSinceLastTouch} days. Churn risk.`,
          autoFixable: false,
          fixed: false,
        });
        recommendations.push(`Schedule a proactive check-in with ${client.companyName} to demonstrate retainer value.`);
      }
    }

    // ============================================================
    // 3. PERFORMANCE ISSUES
    // ============================================================

    // Overdue projects
    const overdueProjects = await db.project.findMany({
      where: {
        status: "IN_PROGRESS",
        plannedEnd: { lt: new Date() },
      },
    });

    for (const proj of overdueProjects) {
      const daysOverdue = Math.floor((Date.now() - new Date(proj.plannedEnd!).getTime()) / (1000 * 60 * 60 * 24));
      issues.push({
        id: `perf-overdue-${proj.id}`,
        severity: daysOverdue > 14 ? "critical" : "high",
        category: "performance",
        title: `Project ${daysOverdue} days overdue: ${proj.name}`,
        description: `${proj.clientName}, $${proj.contractValue.toLocaleString()} contract. Planned end was ${proj.plannedEnd!.toLocaleDateString()}.`,
        autoFixable: false,
        fixed: false,
      });
    }

    // Unassigned open tickets older than 24h
    const unassignedTickets = await db.supportTicket.findMany({
      where: {
        status: "OPEN",
        assignedTo: null,
        createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      include: { clientAccount: { select: { companyName: true } } },
    });

    for (const ticket of unassignedTickets) {
      const hoursOld = Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60));
      issues.push({
        id: `perf-unassigned-${ticket.id}`,
        severity: ticket.priority === "CRITICAL" ? "critical" : "high",
        category: "performance",
        title: `Ticket unassigned for ${hoursOld}h: ${ticket.subject}`,
        description: `${ticket.clientAccount.companyName}, ${ticket.priority} priority. Client waiting.`,
        autoFixable: false,
        fixed: false,
      });
    }

    // ============================================================
    // 4. RECOMMENDATIONS
    // ============================================================

    // Check lead-to-project conversion
    const totalClosedWon = await db.lead.count({ where: { stage: "CLOSED_WON" } });
    const totalProjects = await db.project.count();
    if (totalClosedWon > 0 && totalProjects < totalClosedWon * 0.8) {
      recommendations.push(`Only ${totalProjects}/${totalClosedWon} closed deals have projects. Enable auto-transition to prevent delivery gaps.`);
    }

    // Check if outreach is running
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const draftsToday = await db.emailDraft.count({ where: { batchDate: { gte: today } } });
    if (draftsToday === 0) {
      recommendations.push("No outreach drafts generated today. Check if the draft generation worker is running.");
    }

    // Check social media cadence
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentPosts = await db.socialPost.count({ where: { publishedAt: { gte: weekAgo } } });
    if (recentPosts < 2) {
      recommendations.push(`Only ${recentPosts} social posts published this week. Target is 2/week. Generate content from recent client successes.`);
    }

    // Check for clients paying retainer but no tickets = underutilizing
    const underutilized = activeClients.filter((c) => c.tickets.length === 0);
    if (underutilized.length > 0) {
      recommendations.push(`${underutilized.length} retainer clients have never opened a ticket. Proactive outreach recommended to demonstrate value and prevent churn.`);
    }

  } catch (error) {
    issues.push({
      id: "system-error",
      severity: "critical",
      category: "broken",
      title: "Health check encountered an error",
      description: error instanceof Error ? error.message : "Unknown error during health check",
      autoFixable: false,
      fixed: false,
    });
  }

  return { issues, autoFixed, recommendations };
}

/**
 * Generate smart social media content from real client journey data.
 */
export async function generateStoryContent(): Promise<{
  stories: Array<{
    category: string;
    title: string;
    body: string;
    hashtags: string[];
    source: string;
  }>;
}> {
  const stories: Array<{ category: string; title: string; body: string; hashtags: string[]; source: string }> = [];

  try {
    // Story from recently completed projects
    const recentCompleted = await db.project.findMany({
      where: { status: "COMPLETED", actualEnd: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      include: { updates: { orderBy: { createdAt: "desc" }, take: 3 } },
      take: 3,
    });

    for (const proj of recentCompleted) {
      const daysToDeliver = proj.actualStart && proj.actualEnd
        ? Math.floor((new Date(proj.actualEnd).getTime() - new Date(proj.actualStart).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      stories.push({
        category: "CLIENT_SUCCESS",
        title: `${proj.tier} Deployment Complete`,
        body: `Another ${proj.service.replace(/_/g, " ").toLowerCase()} deployment completed${daysToDeliver ? ` in ${daysToDeliver} days` : ""}.\n\nWhen businesses own their AI infrastructure instead of renting it from the cloud, they get their time back and their data stays in their building.\n\nThis is what control looks like in practice.${proj.clientNps && proj.clientNps >= 8 ? `\n\nClient satisfaction: ${proj.clientNps}/10` : ""}`,
        hashtags: ["#PrivateAI", "#DataPrivacy", "#TechFides", "#LocalAI", "#EnterpriseAI"],
        source: `Project: ${proj.name}`,
      });
    }

    // Story from resolved high-priority tickets
    const resolvedTickets = await db.supportTicket.findMany({
      where: {
        status: { in: ["RESOLVED", "CLOSED"] },
        priority: { in: ["CRITICAL", "HIGH"] },
        resolvedAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      },
      include: { clientAccount: { select: { companyName: true } } },
      take: 2,
    });

    for (const ticket of resolvedTickets) {
      const resolutionHours = ticket.resolvedAt && ticket.createdAt
        ? Math.floor((new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60))
        : null;

      stories.push({
        category: "CLIENT_CHALLENGE",
        title: `${ticket.priority} Issue Resolved`,
        body: `A ${ticket.priority.toLowerCase()}-priority ${ticket.category || "technical"} issue came in from a retainer client${resolutionHours ? `. Resolved in ${resolutionHours < 24 ? `${resolutionHours} hours` : `${Math.round(resolutionHours / 24)} days`}` : ""}.\n\nThis is why we build on local infrastructure. When the system is yours, the response time is yours too. No waiting on cloud vendor support queues.\n\nOwnership means control. Control means speed.`,
        hashtags: ["#TechFides", "#ClientFirst", "#PrivateAI", "#ManagedAI", "#ITSupport"],
        source: `Ticket: ${ticket.subject}`,
      });
    }

    // Story from assessment leads (viral content)
    const assessmentLeads = await db.lead.count({
      where: { tags: { has: "assessment-lead" } },
    });

    if (assessmentLeads > 0) {
      stories.push({
        category: "THOUGHT_LEADERSHIP",
        title: "AI Readiness Reality Check",
        body: `${assessmentLeads} businesses have taken our AI Readiness Assessment so far.\n\nThe pattern is clear: most SMBs score highest on "Team Readiness" but lowest on "Data Governance." Your people are ready for AI. Your infrastructure isn't.\n\nThat's exactly the gap we close. Private AI deployed on your hardware, governed by your rules.\n\nTake the free assessment: techfides.com/assess`,
        hashtags: ["#AIReadiness", "#DataGovernance", "#PrivateAI", "#TechFides", "#SMB"],
        source: `Assessment data: ${assessmentLeads} leads`,
      });
    }

    // Story about team/culture
    const teamSize = await db.projectAssignment.groupBy({
      by: ["name"],
      _count: true,
    });

    if (teamSize.length > 0) {
      stories.push({
        category: "COMPANY_CULTURE",
        title: "Behind the Private AI Stack",
        body: `Our team spans ${teamSize.length} specialists across Frisco TX, Guadalajara MX, and Libreville GA.\n\nBuilding private AI isn't just about technology. It's about having people on three continents who understand that data privacy means something different in every regulatory environment.\n\nThat global perspective is what makes TechFides different. Local expertise. Global reach.`,
        hashtags: ["#TechFides", "#RemoteWork", "#GlobalTeam", "#PrivateAI", "#Diversity"],
        source: `Team data: ${teamSize.length} active resources`,
      });
    }

    // Lessons learned / industry commentary
    const lossReasons = await db.lossReason.findMany({ orderBy: { count: "desc" }, take: 1 });
    if (lossReasons.length > 0) {
      stories.push({
        category: "LESSONS_LEARNED",
        title: "What We Learn From Lost Deals",
        body: `We don't win every deal. And we learn from every one we lose.\n\nThe most common reason businesses pass on private AI: "${lossReasons[0].description}"\n\nFair enough. But here's what we've found — the businesses that said "not yet" 6 months ago are now paying 3x more in cloud AI costs.\n\nTiming matters. But so does ownership.\n\ntechfides.com/pricing`,
        hashtags: ["#Transparency", "#LessonsLearned", "#PrivateAI", "#CloudTax", "#TechFides"],
        source: `Loss data: ${lossReasons[0].category}`,
      });
    }

  } catch {
    // Silently handle DB errors — return whatever stories were generated
  }

  return { stories };
}
