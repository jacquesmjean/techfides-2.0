import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AI360_QUESTIONS } from "@/lib/ai360/questions";

// GET /api/v1/ai360/command — Aggregate data for the Global Command Center
export async function GET() {
  const assessments = await db.aI360Assessment.findMany({
    include: {
      _count: { select: { members: true, responses: true, documents: true, evidence: true } },
      members: { select: { role: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // ─── Aggregate Metrics ──────────────────────────────────────
  const totalAssessments = assessments.length;
  const byStatus = {
    DRAFT: assessments.filter((a) => a.status === "DRAFT").length,
    SUBMITTED: assessments.filter((a) => a.status === "SUBMITTED").length,
    ANALYZING: assessments.filter((a) => a.status === "ANALYZING").length,
    PUBLISHED: assessments.filter((a) => a.status === "PUBLISHED").length,
  };

  // Overall AI Readiness Index (weighted average of all scored assessments)
  const scoredAssessments = assessments.filter((a) => a.overallScore !== null);
  const globalReadinessIndex = scoredAssessments.length > 0
    ? Math.round(scoredAssessments.reduce((s, a) => s + (a.overallScore || 0), 0) / scoredAssessments.length)
    : 0;

  // Maturity distribution
  const maturityDistribution = {
    LEADING: scoredAssessments.filter((a) => a.maturityLevel === "LEADING").length,
    ADVANCING: scoredAssessments.filter((a) => a.maturityLevel === "ADVANCING").length,
    DEVELOPING: scoredAssessments.filter((a) => a.maturityLevel === "DEVELOPING").length,
    EMERGING: scoredAssessments.filter((a) => a.maturityLevel === "EMERGING").length,
    NASCENT: scoredAssessments.filter((a) => a.maturityLevel === "NASCENT").length,
  };

  // Industry distribution
  const industryDistribution: Record<string, number> = {};
  for (const a of assessments) {
    industryDistribution[a.orgIndustry] = (industryDistribution[a.orgIndustry] || 0) + 1;
  }

  // Completion funnel
  const funnel = {
    initialization: byStatus.DRAFT,
    dataCollection: assessments.filter((a) => a.status === "DRAFT" && a._count.responses > 0).length,
    evidenceGathering: assessments.filter((a) => a._count.evidence > 0).length,
    submitted: byStatus.SUBMITTED,
    analyzing: byStatus.ANALYZING,
    published: byStatus.PUBLISHED,
  };

  // Cycle time (average days from creation to publish for published assessments)
  const publishedAssessments = assessments.filter((a) => a.publishedAt);
  const avgCycleTimeDays = publishedAssessments.length > 0
    ? Math.round(
        publishedAssessments.reduce((sum, a) => {
          const days = (a.publishedAt!.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / publishedAssessments.length
      )
    : 0;

  // Assessments needing attention (stale drafts, overdue)
  const now = new Date();
  const staleDays = 7;
  const staleAssessments = assessments.filter((a) => {
    if (a.status !== "DRAFT" && a.status !== "SUBMITTED") return false;
    const daysSinceUpdate = (now.getTime() - a.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > staleDays;
  });

  // Regional data (from org industry mapping — in production this would come from assessment metadata)
  const regions = [
    { id: "US", name: "North America", lat: 39.8, lng: -98.5, count: 0, avgScore: 0 },
    { id: "MX", name: "Latin America", lat: 23.6, lng: -102.5, count: 0, avgScore: 0 },
    { id: "CEMAC", name: "Central Africa", lat: 0.4, lng: 11.5, count: 0, avgScore: 0 },
    { id: "EU", name: "Europe", lat: 48.8, lng: 2.3, count: 0, avgScore: 0 },
  ];

  // Simulate regional distribution based on assessment count
  const regionAssignments = assessments.map((a, i) => ({
    ...a,
    regionIdx: i % regions.length,
  }));
  for (const ra of regionAssignments) {
    regions[ra.regionIdx].count++;
    if (ra.overallScore) {
      regions[ra.regionIdx].avgScore += ra.overallScore;
    }
  }
  for (const r of regions) {
    r.avgScore = r.count > 0 ? Math.round(r.avgScore / r.count) : 0;
  }

  // Assessment detail list
  const assessmentList = assessments.map((a) => ({
    id: a.id,
    name: a.name,
    orgName: a.orgName,
    orgIndustry: a.orgIndustry,
    status: a.status,
    overallScore: a.overallScore,
    maturityLevel: a.maturityLevel,
    completionRate: Math.round((a._count.responses / AI360_QUESTIONS.length) * 100),
    memberCount: a._count.members,
    responseCount: a._count.responses,
    documentCount: a._count.documents,
    evidenceCount: a._count.evidence,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    submittedAt: a.submittedAt?.toISOString() || null,
    publishedAt: a.publishedAt?.toISOString() || null,
    daysSinceUpdate: Math.round((now.getTime() - a.updatedAt.getTime()) / (1000 * 60 * 60 * 24)),
  }));

  // Discovery & telemetry stats (simulated for MVP — in production, from probe infrastructure)
  const discovery = {
    activeSensors: assessments.filter((a) => a._count.evidence > 0).length,
    offlineSensors: 0,
    throttledSensors: 0,
    totalEvidenceItems: assessments.reduce((s, a) => s + a._count.evidence, 0),
    shadowITDetections: 0,
    integrationHealth: {
      total: assessments.length,
      healthy: assessments.filter((a) => a.status !== "DRAFT").length,
      degraded: 0,
      failed: 0,
    },
    complianceDiscrepancies: 0,
    dataMinimized: {
      analyzed: assessments.reduce((s, a) => s + a._count.responses, 0),
      discarded: 0,
    },
    networkOverheadPct: 0.3,
    encryptionActive: true,
    sovereigntyVerified: true,
  };

  return NextResponse.json({
    summary: {
      totalAssessments,
      byStatus,
      globalReadinessIndex,
      maturityDistribution,
      industryDistribution,
      avgCycleTimeDays,
      staleCount: staleAssessments.length,
    },
    funnel,
    regions,
    assessments: assessmentList,
    discovery,
  });
}
