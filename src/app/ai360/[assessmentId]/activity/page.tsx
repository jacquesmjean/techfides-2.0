"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";

interface ActivityItem {
  id: string;
  actorName: string;
  actorRole: string | null;
  action: string;
  target: string | null;
  detail: string | null;
  createdAt: string;
}

interface CommentThread {
  id: string;
  questionId: string | null;
  authorName: string;
  authorEmail: string | null;
  authorRole: string | null;
  body: string;
  createdAt: string;
  replies: {
    id: string;
    authorName: string;
    authorRole: string | null;
    body: string;
    createdAt: string;
  }[];
}

export default function ActivityPage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { orgName } = useAssessment();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [activeTab, setActiveTab] = useState<"feed" | "comments">("feed");
  const [loading, setLoading] = useState(true);

  // New comment form
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Jacques Jean");
  const [commentRole, setCommentRole] = useState("ANALYST");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/ai360/${assessmentId}/comments`).then((r) => r.ok ? r.json() : { comments: [] }),
      // Activities come from audit log
      fetch(`/api/v1/ai360/${assessmentId}/comments`).then((r) => r.ok ? r.json() : { comments: [] }),
    ]).then(([commentData]) => {
      setComments(commentData.comments || []);
    }).finally(() => setLoading(false));

    // Load activities from audit log
    loadActivities();
  }, [assessmentId]);

  async function loadActivities() {
    // In a full implementation, this would query the AuditLog table
    // For now we'll generate from comments and assessment state
    try {
      const res = await fetch(`/api/v1/ai360/${assessmentId}`);
      if (res.ok) {
        const data = await res.json();
        const acts: ActivityItem[] = [];
        acts.push({
          id: "created",
          actorName: "System",
          actorRole: null,
          action: "created",
          target: "assessment",
          detail: `Assessment "${data.name}" created for ${data.orgName}`,
          createdAt: data.createdAt,
        });
        if (data.submittedAt) {
          acts.push({ id: "submitted", actorName: "Client", actorRole: "CLIENT_ADMIN", action: "status_changed", target: "SUBMITTED", detail: "Assessment submitted for analysis", createdAt: data.submittedAt });
        }
        if (data.analyzedAt) {
          acts.push({ id: "analyzed", actorName: "TechFides", actorRole: "ANALYST", action: "status_changed", target: "ANALYZING", detail: "Analysis started", createdAt: data.analyzedAt });
        }
        if (data.publishedAt) {
          acts.push({ id: "published", actorName: "TechFides", actorRole: "REVIEWER", action: "status_changed", target: "PUBLISHED", detail: "Results published", createdAt: data.publishedAt });
        }
        if (data.responseCount > 0) {
          acts.push({ id: "responses", actorName: "Respondents", actorRole: null, action: "responded", target: null, detail: `${data.responseCount} responses recorded`, createdAt: data.updatedAt });
        }
        setActivities(acts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch {}
  }

  async function handlePostComment() {
    if (!newComment.trim()) return;
    const res = await fetch(`/api/v1/ai360/${assessmentId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: newComment,
        authorName: commentAuthor,
        authorRole: commentRole,
      }),
    });
    if (res.ok) {
      const c = await res.json();
      setComments((prev) => [...prev, { ...c, replies: [] }]);
      setNewComment("");
    }
  }

  async function handlePostReply(parentId: string) {
    if (!replyText.trim()) return;
    const res = await fetch(`/api/v1/ai360/${assessmentId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: replyText,
        authorName: commentAuthor,
        authorRole: commentRole,
        parentId,
      }),
    });
    if (res.ok) {
      const r = await res.json();
      setComments((prev) => prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...c.replies, r] } : c
      ));
      setReplyingTo(null);
      setReplyText("");
    }
  }

  const ACTION_ICONS: Record<string, string> = {
    created: "bg-blue-100 text-blue-600",
    responded: "bg-emerald-100 text-emerald-600",
    commented: "bg-violet-100 text-violet-600",
    uploaded: "bg-amber-100 text-amber-600",
    status_changed: "bg-brand-primary/10 text-brand-primary",
    verified: "bg-emerald-100 text-emerald-600",
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-brand-dark">Activity & Discussion</h2>
          <p className="text-sm text-gray-500">Track all assessment activity and collaborate with the team</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        <button onClick={() => setActiveTab("feed")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "feed" ? "bg-brand-primary text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
          Activity Feed
        </button>
        <button onClick={() => setActiveTab("comments")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "comments" ? "bg-brand-primary text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
          Discussion ({comments.length})
        </button>
      </div>

      {activeTab === "feed" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No activity yet.</p>
          ) : (
            <div className="space-y-0">
              {activities.map((a, i) => (
                <div key={a.id} className="flex gap-4 pb-6 relative">
                  {/* Timeline line */}
                  {i < activities.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200" />
                  )}
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ACTION_ICONS[a.action] || "bg-gray-100 text-gray-500"}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {a.action === "status_changed" && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />}
                      {a.action === "commented" && <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />}
                      {a.action === "responded" && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                      {a.action === "created" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />}
                      {!["status_changed", "commented", "responded", "created"].includes(a.action) && <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    </svg>
                  </div>
                  {/* Content */}
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{a.actorName}</span>
                      {a.actorRole && <span className="text-xs text-gray-400 ml-1">({a.actorRole.replace("_", " ")})</span>}
                    </p>
                    <p className="text-sm text-gray-600">{a.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "comments" && (
        <div className="space-y-4">
          {/* New comment form */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-primary">
                {commentAuthor.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <input type="text" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)}
                className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none" />
              <select value={commentRole} onChange={(e) => setCommentRole(e.target.value)}
                className="text-xs text-gray-400 bg-transparent border-none">
                <option value="ANALYST">Analyst</option>
                <option value="REVIEWER">Reviewer</option>
                <option value="CLIENT_ADMIN">Client Admin</option>
                <option value="CONTRIBUTOR">Contributor</option>
              </select>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment about this assessment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
            <div className="flex justify-end mt-2">
              <button onClick={handlePostComment} disabled={!newComment.trim()}
                className="px-4 py-1.5 bg-brand-primary text-white text-sm rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors">
                Post Comment
              </button>
            </div>
          </div>

          {/* Comment threads */}
          {comments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
              No comments yet. Start a discussion about this assessment.
            </div>
          ) : (
            comments.map((thread) => (
              <div key={thread.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Main comment */}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-primary flex-shrink-0">
                      {thread.authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{thread.authorName}</span>
                        {thread.authorRole && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{thread.authorRole.replace("_", " ")}</span>
                        )}
                        <span className="text-xs text-gray-400">{new Date(thread.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{thread.body}</p>
                      <button onClick={() => setReplyingTo(replyingTo === thread.id ? null : thread.id)}
                        className="text-xs text-brand-primary hover:text-brand-dark mt-2 font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {thread.replies.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 space-y-3">
                    {thread.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 ml-8">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[9px] font-bold text-gray-600 flex-shrink-0">
                          {reply.authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{reply.authorName}</span>
                            {reply.authorRole && <span className="text-xs text-gray-400">{reply.authorRole.replace("_", " ")}</span>}
                            <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{reply.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply form */}
                {replyingTo === thread.id && (
                  <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                    <div className="flex gap-2 ml-8">
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..." rows={2}
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
                      <button onClick={() => handlePostReply(thread.id)} disabled={!replyText.trim()}
                        className="px-3 py-1.5 bg-brand-primary text-white text-xs rounded-lg hover:bg-brand-dark disabled:opacity-50 self-end">
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
