import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const CreatePostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.enum([
    "CLIENT_SUCCESS", "CLIENT_CHALLENGE", "TECH_INSIGHT",
    "COMPANY_CULTURE", "INDUSTRY_COMMENTARY", "LESSONS_LEARNED", "THOUGHT_LEADERSHIP",
  ]),
  platforms: z.array(z.string()).min(1),
  scheduledAt: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  ctaUrl: z.string().optional(),
  ctaText: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const month = searchParams.get("month"); // YYYY-MM format

  let dateFilter = {};
  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);
    dateFilter = { scheduledAt: { gte: start, lt: end } };
  }

  const posts = await db.socialPost.findMany({
    where: {
      ...(status ? { status: status as "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "REJECTED" } : {}),
      ...dateFilter,
    },
    orderBy: { scheduledAt: "asc" },
  });

  // Aggregate metrics
  const published = await db.socialPost.findMany({ where: { status: "PUBLISHED" } });
  const metrics = {
    totalPosts: published.length,
    totalImpressions: published.reduce((s, p) => s + p.impressions, 0),
    totalClicks: published.reduce((s, p) => s + p.clicks, 0),
    totalLikes: published.reduce((s, p) => s + p.likes, 0),
    totalComments: published.reduce((s, p) => s + p.comments, 0),
    totalShares: published.reduce((s, p) => s + p.shares, 0),
    avgEngagementRate: published.length > 0
      ? ((published.reduce((s, p) => s + p.likes + p.comments + p.shares, 0) /
          Math.max(1, published.reduce((s, p) => s + p.impressions, 0))) * 100).toFixed(2)
      : "0",
    pendingApproval: await db.socialPost.count({ where: { status: "PENDING_APPROVAL" } }),
    scheduledThisWeek: await db.socialPost.count({
      where: {
        status: "SCHEDULED",
        scheduledAt: { gte: new Date(), lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  };

  return NextResponse.json({ posts, metrics });
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const post = await db.socialPost.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      category: parsed.data.category,
      platforms: parsed.data.platforms,
      status: "DRAFT",
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
      hashtags: parsed.data.hashtags || [],
      ctaUrl: parsed.data.ctaUrl,
      ctaText: parsed.data.ctaText,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
