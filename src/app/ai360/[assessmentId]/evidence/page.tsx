"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";
import { AI360_DOMAINS, AI360_QUESTIONS, AI360DomainKey, getQuestionsByDomain } from "@/lib/ai360/questions";
import { AI360EvidenceInfo } from "@/lib/ai360/types";

export default function EvidencePage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { status } = useAssessment();
  const [evidence, setEvidence] = useState<AI360EvidenceInfo[]>([]);
  const [activeDomain, setActiveDomain] = useState<AI360DomainKey>("STRATEGY_LEADERSHIP");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const isReadOnly = status === "PUBLISHED";

  useEffect(() => {
    fetch(`/api/v1/ai360/${assessmentId}/evidence`)
      .then((r) => r.ok ? r.json() : { evidence: [] })
      .then((d) => setEvidence(d.evidence || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assessmentId]);

  const domainEvidence = evidence.filter((e) => e.domain === activeDomain);
  const domainQuestions = getQuestionsByDomain(activeDomain);

  async function handleAdd(data: { questionId?: string; title: string; description: string; sourceType: string; sourceUrl?: string }) {
    const res = await fetch(`/api/v1/ai360/${assessmentId}/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, domain: activeDomain }),
    });
    if (res.ok) {
      const newEvidence = await res.json();
      setEvidence((prev) => [...prev, newEvidence]);
      setShowAdd(false);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Domain Sidebar */}
      <div className="col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Evidence by Domain</h3>
          <div className="space-y-1">
            {AI360_DOMAINS.map((domain) => {
              const count = evidence.filter((e) => e.domain === domain.key).length;
              const isActive = activeDomain === domain.key;
              return (
                <button
                  key={domain.key}
                  onClick={() => setActiveDomain(domain.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{domain.shortLabel}</span>
                    <span className="text-xs text-gray-400">{count} items</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 flex justify-between">
              <span>Total evidence</span>
              <span className="font-semibold text-gray-900">{evidence.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Content */}
      <div className="col-span-9">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Systems Evidence: {AI360_DOMAINS.find((d) => d.key === activeDomain)?.label}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Validate assessment responses with supporting evidence. Evidence bridges perception with operational reality.
            </p>
          </div>
          {!isReadOnly && (
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Evidence
            </button>
          )}
        </div>

        {/* Evidence by question */}
        {domainQuestions.map((q) => {
          const qEvidence = domainEvidence.filter((e) => e.questionId === q.id);
          return (
            <div key={q.id} className="mb-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">{q.id}</span>
                  <span className="text-sm text-gray-700 truncate max-w-lg">{q.text}</span>
                </div>
                {q.evidenceHint && (
                  <span className="text-xs text-blue-500">{q.evidenceHint}</span>
                )}
              </div>
              {qEvidence.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {qEvidence.map((ev) => (
                    <div key={ev.id} className="px-5 py-3 flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ev.verified ? "bg-emerald-500" : "bg-gray-300"}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{ev.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{ev.sourceType}</span>
                          {ev.verified && (
                            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-sm text-gray-400">No evidence attached yet</div>
              )}
            </div>
          );
        })}

        {/* General domain evidence (not linked to specific question) */}
        {domainEvidence.filter((e) => !e.questionId).length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">General Evidence</h3>
            <div className="space-y-2">
              {domainEvidence.filter((e) => !e.questionId).map((ev) => (
                <div key={ev.id} className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ev.verified ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ev.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded mt-1 inline-block">{ev.sourceType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Evidence Modal */}
      {showAdd && (
        <AddEvidenceModal
          domain={activeDomain}
          questions={domainQuestions}
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}

// ─── Add Evidence Modal ───────────────────────────────────────────
function AddEvidenceModal({
  domain,
  questions,
  onClose,
  onSave,
}: {
  domain: AI360DomainKey;
  questions: { id: string; text: string }[];
  onClose: () => void;
  onSave: (data: { questionId?: string; title: string; description: string; sourceType: string; sourceUrl?: string }) => void;
}) {
  const [questionId, setQuestionId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("documentation");
  const [sourceUrl, setSourceUrl] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add Systems Evidence</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link to Question (optional)</label>
            <select value={questionId} onChange={(e) => setQuestionId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">General domain evidence</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.id}: {q.text.slice(0, 60)}...</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Data Catalog Screenshot" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Describe what this evidence demonstrates..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
              <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="system_screenshot">System Screenshot</option>
                <option value="metrics_export">Metrics Export</option>
                <option value="configuration">Configuration</option>
                <option value="documentation">Documentation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source URL (optional)</label>
              <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="https://..." />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          <button
            onClick={() => onSave({ questionId: questionId || undefined, title, description, sourceType, sourceUrl: sourceUrl || undefined })}
            disabled={!title.trim() || !description.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add Evidence
          </button>
        </div>
      </div>
    </div>
  );
}
