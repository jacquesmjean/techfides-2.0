"use client";

import { useState, useEffect, useCallback } from "react";

interface Issue {
  id: string; severity: string; category: string; title: string;
  description: string; autoFixable: boolean; autoFixAction?: string;
  fixed: boolean; fixedAt?: string;
}

interface Story {
  category: string; title: string; body: string;
  hashtags: string[]; source: string;
}

const SEV_CFG: Record<string, { color: string; bg: string; dot: string }> = {
  critical: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "\uD83D\uDD34" },
  high: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "\uD83D\uDFE0" },
  medium: { color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", dot: "\uD83D\uDD35" },
  low: { color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", dot: "\u26AA" },
};

const CAT_ICONS: Record<string, string> = {
  broken: "\uD83D\uDD27", stale: "\u231B", gap: "\u26A0\uFE0F",
  performance: "\uD83D\uDCC9", recommendation: "\uD83D\uDCA1",
};

const STORY_CFG: Record<string, { label: string; color: string }> = {
  CLIENT_SUCCESS: { label: "Client Success", color: "#22c55e" },
  CLIENT_CHALLENGE: { label: "Challenge Resolved", color: "#f59e0b" },
  THOUGHT_LEADERSHIP: { label: "Thought Leadership", color: "#38bdf8" },
  COMPANY_CULTURE: { label: "Culture", color: "#a78bfa" },
  LESSONS_LEARNED: { label: "Lessons Learned", color: "#f97316" },
};

export default function IntelligencePage() {
  const [tab, setTab] = useState<"health" | "stories" | "recommendations">("health");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [autoFixed, setAutoFixed] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState("");

  const runCheck = useCallback(async () => {
    setLoading(true);
    try {
      const [healthRes, storiesRes] = await Promise.all([
        fetch("/api/v1/intelligence/health-check"),
        fetch("/api/v1/intelligence/stories"),
      ]);
      const healthData = await healthRes.json();
      const storiesData = await storiesRes.json();

      setIssues(healthData.issues || []);
      setRecommendations(healthData.recommendations || []);
      setAutoFixed(healthData.autoFixed || 0);
      setLastCheck(healthData.checkedAt || new Date().toISOString());
      setStories(storiesData.stories || []);
    } catch {
      // handle error silently
    }
    setLoading(false);
  }, []);

  useEffect(() => { runCheck(); }, [runCheck]);

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const highCount = issues.filter((i) => i.severity === "high").length;
  const fixedCount = issues.filter((i) => i.fixed).length;

  async function handlePublishStory(story: Story) {
    await fetch("/api/v1/social/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: story.title,
        body: `${story.body}\n\n${story.hashtags.join(" ")}`,
        category: story.category,
        platforms: ["linkedin-company", "linkedin-personal", "x", "facebook", "instagram"],
        hashtags: story.hashtags,
      }),
    });
    alert(`Story "${story.title}" added to Social Media Hub as draft.`);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Intelligence</h1>
          <p className="text-sm text-slate-400">Self-healing monitor, smart recommendations, and AI-generated social content</p>
        </div>
        <div className="flex items-center gap-3">
          {lastCheck && <span className="text-[10px] text-slate-500">Last scan: {new Date(lastCheck).toLocaleTimeString()}</span>}
          <button onClick={runCheck} disabled={loading} className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 disabled:opacity-50">
            {loading ? "Scanning..." : "Run Health Check"}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className={`rounded-xl border p-4 ${criticalCount > 0 ? "border-red-500/30 bg-red-500/5 animate-pulse" : "border-slate-800 bg-slate-900/30"}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical</p>
          <p className={`mt-1 text-2xl font-extrabold ${criticalCount > 0 ? "text-red-400" : "text-slate-600"}`}>{criticalCount}</p>
        </div>
        <div className={`rounded-xl border p-4 ${highCount > 0 ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800 bg-slate-900/30"}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High</p>
          <p className={`mt-1 text-2xl font-extrabold ${highCount > 0 ? "text-amber-400" : "text-slate-600"}`}>{highCount}</p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Auto-Fixed</p>
          <p className="mt-1 text-2xl font-extrabold text-green-400">{autoFixed}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recommendations</p>
          <p className="mt-1 text-2xl font-extrabold text-sky-400">{recommendations.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Story Ideas</p>
          <p className="mt-1 text-2xl font-extrabold text-purple-400">{stories.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
        {([
          { id: "health", label: `Health Issues (${issues.length})` },
          { id: "recommendations", label: `Recommendations (${recommendations.length})` },
          { id: "stories", label: `Story Content (${stories.length})` },
        ] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${tab === t.id ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:text-slate-200"}`}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" /></div>
      ) : tab === "health" ? (
        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-12 text-center">
              <p className="text-2xl">\uD83D\uDFE2</p>
              <p className="mt-2 text-lg font-bold text-green-400">All Systems Healthy</p>
              <p className="mt-1 text-sm text-slate-400">No issues detected. The machine is running clean.</p>
            </div>
          ) : issues.map((issue) => {
            const sev = SEV_CFG[issue.severity] || SEV_CFG.medium;
            const catIcon = CAT_ICONS[issue.category] || "\u2139\uFE0F";
            return (
              <div key={issue.id} className={`rounded-xl border ${sev.bg} p-4`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{sev.dot}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{catIcon}</span>
                      <span className={`text-xs font-bold uppercase ${sev.color}`}>{issue.severity}</span>
                      <span className="text-xs text-slate-500">{issue.category}</span>
                      {issue.fixed && <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[9px] font-bold text-green-400">AUTO-FIXED</span>}
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-200">{issue.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{issue.description}</p>
                    {issue.autoFixAction && !issue.fixed && (
                      <p className="mt-2 text-[10px] text-sky-400">Suggested fix: {issue.autoFixAction}</p>
                    )}
                    {issue.fixed && issue.fixedAt && (
                      <p className="mt-1 text-[10px] text-green-400">Fixed at {new Date(issue.fixedAt).toLocaleTimeString()}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : tab === "recommendations" ? (
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
              <p className="text-slate-400">No recommendations at this time. System is optimized.</p>
            </div>
          ) : recommendations.map((rec, i) => (
            <div key={i} className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 flex items-start gap-3">
              <span className="text-lg mt-0.5">\uD83D\uDCA1</span>
              <p className="text-sm text-slate-300">{rec}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">AI-generated content from real client journey data. Click &ldquo;Add to Hub&rdquo; to send to Social Media for review.</p>
          {stories.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
              <p className="text-slate-400">No stories generated yet. System needs more client activity data.</p>
            </div>
          ) : stories.map((story, i) => {
            const cfg = STORY_CFG[story.category] || { label: story.category, color: "#64748b" };
            return (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}>{cfg.label}</span>
                    <span className="text-sm font-bold text-slate-200">{story.title}</span>
                  </div>
                  <button onClick={() => handlePublishStory(story)} className="rounded-lg bg-sky-500 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-sky-400">
                    Add to Hub
                  </button>
                </div>
                <div className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{story.body}</p>
                  <p className="mt-3 text-[10px] text-electric-400">{story.hashtags.join(" ")}</p>
                </div>
                <p className="mt-2 text-[9px] text-slate-500">Source: {story.source}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
