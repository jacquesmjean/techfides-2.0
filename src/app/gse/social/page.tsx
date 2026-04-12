"use client";

import { useState, useEffect, useCallback } from "react";

interface SocialPost {
  id: string;
  title: string;
  body: string;
  category: string;
  platforms: string[];
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  approvedAt: string | null;
  hashtags: string[];
  ctaUrl: string | null;
  impressions: number;
  clicks: number;
  likes: number;
  comments: number;
  shares: number;
  reviewNotes: string | null;
  createdAt: string;
}

interface Metrics {
  totalPosts: number;
  totalImpressions: number;
  totalClicks: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: string;
  pendingApproval: number;
  scheduledThisWeek: number;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  CLIENT_SUCCESS: { label: "Client Success", icon: "\uD83C\uDFC6", color: "#22c55e" },
  CLIENT_CHALLENGE: { label: "Client Challenge", icon: "\uD83D\uDCA1", color: "#f59e0b" },
  TECH_INSIGHT: { label: "Tech Insight", icon: "\u2699\uFE0F", color: "#38bdf8" },
  COMPANY_CULTURE: { label: "Culture", icon: "\uD83D\uDC65", color: "#a78bfa" },
  INDUSTRY_COMMENTARY: { label: "Industry", icon: "\uD83C\uDF0D", color: "#06b6d4" },
  LESSONS_LEARNED: { label: "Lessons Learned", icon: "\uD83D\uDCDA", color: "#f97316" },
  THOUGHT_LEADERSHIP: { label: "Thought Leadership", icon: "\uD83C\uDFAF", color: "#ec4899" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Draft", color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  PENDING_APPROVAL: { label: "Pending Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  APPROVED: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  SCHEDULED: { label: "Scheduled", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  PUBLISHED: { label: "Published", color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  REJECTED: { label: "Revision Needed", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const PLATFORM_ICONS: Record<string, string> = {
  "linkedin-company": "\uD83C\uDFE2 LI Company",
  "linkedin-personal": "\uD83D\uDC64 LI Jacques",
  x: "\uD835\uDD4F X",
  facebook: "\uD83D\uDCD8 Facebook",
  instagram: "\uD83D\uDCF7 Instagram",
};

const ALL_PLATFORMS = ["linkedin-company", "linkedin-personal", "x", "facebook", "instagram"];
const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG);

export default function SocialMediaPage() {
  const [tab, setTab] = useState<"calendar" | "approval" | "analytics" | "create">("calendar");
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Create form
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    category: "THOUGHT_LEADERSHIP",
    platforms: ALL_PLATFORMS,
    scheduledAt: "",
    hashtags: "#AI #DataSovereignty #TechFides",
    ctaUrl: "",
  });

  const fetchPosts = useCallback(async (status?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (tab === "calendar") params.set("month", selectedMonth);
    const res = await fetch(`/api/v1/social/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts);
    setMetrics(data.metrics);
    setLoading(false);
  }, [tab, selectedMonth]);

  useEffect(() => {
    if (tab === "approval") fetchPosts("PENDING_APPROVAL");
    else fetchPosts();
  }, [tab, fetchPosts]);

  async function handleStatusChange(postId: string, newStatus: string, reviewNotes?: string) {
    await fetch(`/api/v1/social/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, reviewNotes }),
    });
    fetchPosts(tab === "approval" ? "PENDING_APPROVAL" : undefined);
  }

  async function handleCreate() {
    await fetch("/api/v1/social/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newPost,
        hashtags: newPost.hashtags.split(" ").filter(Boolean),
      }),
    });
    setNewPost({ title: "", body: "", category: "THOUGHT_LEADERSHIP", platforms: ALL_PLATFORMS, scheduledAt: "", hashtags: "#AI #DataSovereignty #TechFides", ctaUrl: "" });
    setTab("calendar");
    fetchPosts();
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Social Media Hub</h1>
          <p className="mt-1 text-sm text-slate-400">
            Branded content across all platforms &mdash; 2x/week, reviewed by Jacques
          </p>
        </div>
        <button
          onClick={() => setTab("create")}
          className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
        >
          + New Post
        </button>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <MetricCard label="Pending Review" value={String(metrics.pendingApproval)} highlight={metrics.pendingApproval > 0} />
          <MetricCard label="Scheduled This Week" value={String(metrics.scheduledThisWeek)} />
          <MetricCard label="Total Published" value={String(metrics.totalPosts)} />
          <MetricCard label="Total Impressions" value={metrics.totalImpressions.toLocaleString()} />
          <MetricCard label="Engagement Rate" value={`${metrics.avgEngagementRate}%`} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
        {([
          { id: "calendar", label: "Content Calendar" },
          { id: "approval", label: `Approval Queue${metrics?.pendingApproval ? ` (${metrics.pendingApproval})` : ""}` },
          { id: "analytics", label: "Analytics" },
          { id: "create", label: "Create Post" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              tab === t.id ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && tab !== "create" ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" />
        </div>
      ) : tab === "calendar" ? (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
          </div>
          {posts.length === 0 ? (
            <EmptyState message="No posts scheduled for this month" action="Create Post" onAction={() => setTab("create")} />
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>
      ) : tab === "approval" ? (
        <div>
          {posts.length === 0 ? (
            <EmptyState message="No posts pending approval" />
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <ApprovalCard key={post.id} post={post} onAction={handleStatusChange} />
              ))}
            </div>
          )}
        </div>
      ) : tab === "analytics" ? (
        <AnalyticsPanel metrics={metrics} posts={posts} />
      ) : (
        <CreatePostForm post={newPost} onChange={setNewPost} onSubmit={handleCreate} />
      )}
    </div>
  );
}

// ---- Components ----

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800 bg-slate-900/30"}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-amber-400" : "text-slate-100"}`}>{value}</p>
    </div>
  );
}

function PostCard({ post, onStatusChange }: { post: SocialPost; onStatusChange: (id: string, status: string) => void }) {
  const cat = CATEGORY_CONFIG[post.category] || { label: post.category, icon: "", color: "#64748b" };
  const stat = STATUS_CONFIG[post.status] || { label: post.status, color: "#64748b", bg: "transparent" };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span>{cat.icon}</span>
            <span className="text-sm font-semibold text-slate-200">{post.title}</span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: stat.color, backgroundColor: stat.bg }}>
              {stat.label}
            </span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ color: cat.color, backgroundColor: `${cat.color}15` }}>
              {cat.label}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2">{post.body}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
            {post.scheduledAt && <span>Scheduled: {new Date(post.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>}
            <span>|</span>
            {post.platforms.map((p) => <span key={p}>{PLATFORM_ICONS[p] || p}</span>)}
          </div>
          {post.status === "PUBLISHED" && (
            <div className="mt-2 flex gap-4 text-[10px] text-slate-500">
              <span>{post.impressions.toLocaleString()} impressions</span>
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
              <span>{post.shares} shares</span>
            </div>
          )}
        </div>
        <div className="ml-4 flex shrink-0 gap-2">
          {post.status === "DRAFT" && (
            <button onClick={() => onStatusChange(post.id, "PENDING_APPROVAL")} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10">
              Submit for Review
            </button>
          )}
          {post.status === "APPROVED" && (
            <button onClick={() => onStatusChange(post.id, "SCHEDULED")} className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400">
              Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ApprovalCard({ post, onAction }: { post: SocialPost; onAction: (id: string, status: string, notes?: string) => void }) {
  const [notes, setNotes] = useState("");
  const cat = CATEGORY_CONFIG[post.category] || { label: "", icon: "", color: "#64748b" };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex items-center gap-2 mb-3">
        <span>{cat.icon}</span>
        <h3 className="text-lg font-bold text-slate-100">{post.title}</h3>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ color: cat.color, backgroundColor: `${cat.color}15` }}>
          {cat.label}
        </span>
      </div>

      {/* Post Preview */}
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4 mb-4">
        <p className="text-sm text-slate-300 whitespace-pre-line">{post.body}</p>
        {post.hashtags.length > 0 && (
          <p className="mt-2 text-xs text-electric-400">{post.hashtags.join(" ")}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-400">
        <span>Platforms:</span>
        {post.platforms.map((p) => (
          <span key={p} className="rounded bg-slate-800 px-2 py-0.5">{PLATFORM_ICONS[p] || p}</span>
        ))}
        {post.scheduledAt && (
          <span className="ml-2">Scheduled: {new Date(post.scheduledAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor={`notes-${post.id}`} className="block text-xs font-medium text-slate-400 mb-1">
          Review Notes (optional)
        </label>
        <input
          id={`notes-${post.id}`}
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Feedback or revision instructions..."
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onAction(post.id, "APPROVED", notes)}
          className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
        >
          Approve
        </button>
        <button
          onClick={() => onAction(post.id, "REJECTED", notes)}
          className="rounded-lg border border-red-500/50 px-6 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10"
        >
          Request Revision
        </button>
      </div>
    </div>
  );
}

function AnalyticsPanel({ metrics, posts }: { metrics: Metrics | null; posts: SocialPost[] }) {
  if (!metrics) return null;

  const published = posts.filter((p) => p.status === "PUBLISHED");
  const byCat = Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
    const catPosts = published.filter((p) => p.category === key);
    return {
      ...cfg,
      key,
      count: catPosts.length,
      impressions: catPosts.reduce((s, p) => s + p.impressions, 0),
      engagement: catPosts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0),
    };
  }).filter((c) => c.count > 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total Impressions</p>
          <p className="mt-2 text-3xl font-bold text-sky-400">{metrics.totalImpressions.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total Engagement</p>
          <p className="mt-2 text-3xl font-bold text-green-400">{(metrics.totalLikes + metrics.totalComments + metrics.totalShares).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400">Engagement Rate</p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{metrics.avgEngagementRate}%</p>
        </div>
      </div>

      {byCat.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Performance by Category</h3>
          <div className="space-y-3">
            {byCat.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-lg">{c.icon}</span>
                <span className="w-32 text-sm text-slate-300">{c.label}</span>
                <span className="text-xs text-slate-400">{c.count} posts</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.impressions / Math.max(1, metrics.totalImpressions)) * 100)}%`, backgroundColor: c.color }} />
                </div>
                <span className="text-xs text-slate-400">{c.impressions.toLocaleString()} impr</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {published.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
          <p className="text-slate-400">No published posts yet. Analytics will appear once posts are published.</p>
        </div>
      )}
    </div>
  );
}

function CreatePostForm({
  post,
  onChange,
  onSubmit,
}: {
  post: { title: string; body: string; category: string; platforms: string[]; scheduledAt: string; hashtags: string; ctaUrl: string };
  onChange: (p: typeof post) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-6">Create New Post</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium text-slate-300">Title (internal reference)</label>
          <input id="post-title" type="text" value={post.title} onChange={(e) => onChange({ ...post, title: e.target.value })}
            placeholder="e.g., Q2 Client Success: Law Firm AI Deployment"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="post-body" className="block text-sm font-medium text-slate-300">Post Content</label>
          <textarea id="post-body" rows={6} value={post.body} onChange={(e) => onChange({ ...post, body: e.target.value })}
            placeholder="Write your post here... Keep it short, real, and authentic."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" />
          <p className="mt-1 text-xs text-slate-500">{post.body.length} chars {post.body.length > 280 ? "(LinkedIn: OK, X: too long)" : "(fits all platforms)"}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="post-cat" className="block text-sm font-medium text-slate-300">Category</label>
            <select id="post-cat" value={post.category} onChange={(e) => onChange({ ...post, category: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_CONFIG[c].icon} {CATEGORY_CONFIG[c].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="post-date" className="block text-sm font-medium text-slate-300">Schedule Date</label>
            <input id="post-date" type="datetime-local" value={post.scheduledAt} onChange={(e) => onChange({ ...post, scheduledAt: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {ALL_PLATFORMS.map((p) => (
              <button key={p} type="button"
                onClick={() => onChange({ ...post, platforms: post.platforms.includes(p) ? post.platforms.filter((x) => x !== p) : [...post.platforms, p] })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  post.platforms.includes(p) ? "bg-sky-500/20 text-sky-400 border border-sky-500/50" : "border border-slate-700 text-slate-500"
                }`}>
                {PLATFORM_ICONS[p]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="post-tags" className="block text-sm font-medium text-slate-300">Hashtags</label>
          <input id="post-tags" type="text" value={post.hashtags} onChange={(e) => onChange({ ...post, hashtags: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="post-cta" className="block text-sm font-medium text-slate-300">CTA Link (optional)</label>
          <input id="post-cta" type="url" value={post.ctaUrl} onChange={(e) => onChange({ ...post, ctaUrl: e.target.value })}
            placeholder="https://techfides.com/assess"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" />
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onSubmit} className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">
            Save as Draft
          </button>
          <button onClick={() => { onSubmit(); }}
            className="rounded-lg border border-amber-500/50 px-6 py-2.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/10">
            Save &amp; Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message, action, onAction }: { message: string; action?: string; onAction?: () => void }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
      <p className="text-lg font-semibold text-slate-300">{message}</p>
      {action && onAction && (
        <button onClick={onAction} className="mt-4 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">
          {action}
        </button>
      )}
    </div>
  );
}
