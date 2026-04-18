"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";
import { AI360_DOMAINS, AI360_QUESTIONS, getQuestionsByDomain, AI360DomainKey, AI360Question } from "@/lib/ai360/questions";

interface ResponseMap {
  [questionId: string]: { selectedOption: number; notes: string };
}

interface MemberInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AssessmentPage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { status, completionRate } = useAssessment();
  const [activeDomain, setActiveDomain] = useState<AI360DomainKey>("STRATEGY_LEADERSHIP");
  const [responses, setResponses] = useState<ResponseMap>({});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Multi-respondent
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [activeRespondent, setActiveRespondent] = useState<string>("default");
  const [activeResponderName, setActiveResponderName] = useState<string>("Primary");
  const [activeResponderRole, setActiveResponderRole] = useState<string>("CLIENT_ADMIN");

  const isReadOnly = status !== "DRAFT";
  const questions = getQuestionsByDomain(activeDomain);

  // Load members
  useEffect(() => {
    fetch(`/api/v1/ai360/${assessmentId}/members`)
      .then((r) => r.ok ? r.json() : { members: [] })
      .then((data) => setMembers(data.members || []))
      .catch(() => {});
  }, [assessmentId]);

  // Load existing responses for active respondent
  useEffect(() => {
    fetch(`/api/v1/ai360/${assessmentId}/responses?responderId=${activeRespondent}`)
      .then((r) => r.ok ? r.json() : { responses: [] })
      .then((data) => {
        const map: ResponseMap = {};
        for (const r of data.responses || []) {
          map[r.questionId] = { selectedOption: r.selectedOption, notes: r.notes || "" };
        }
        setResponses(map);
      })
      .catch(() => {});
  }, [assessmentId, activeRespondent]);

  // Save responses
  const saveResponses = useCallback(async () => {
    setSaving(true);
    try {
      await fetch(`/api/v1/ai360/${assessmentId}/responses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses,
          responderId: activeRespondent,
          responderName: activeResponderName,
          responderRole: activeResponderRole,
        }),
      });
      setLastSaved(new Date());
    } finally {
      setSaving(false);
    }
  }, [assessmentId, responses, activeRespondent, activeResponderName, activeResponderRole]);

  // Auto-save on response change (debounced)
  useEffect(() => {
    if (isReadOnly || Object.keys(responses).length === 0) return;
    const timer = setTimeout(saveResponses, 2000);
    return () => clearTimeout(timer);
  }, [responses, isReadOnly, saveResponses]);

  function handleSelect(questionId: string, value: number) {
    if (isReadOnly) return;
    setResponses((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], selectedOption: value, notes: prev[questionId]?.notes || "" },
    }));
  }

  function handleNotes(questionId: string, notes: string) {
    if (isReadOnly) return;
    setResponses((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], notes },
    }));
  }

  // Progress calculations
  const totalAnswered = Object.keys(responses).filter((k) => responses[k].selectedOption > 0).length;
  const domainAnswered = questions.filter((q) => responses[q.id]?.selectedOption > 0).length;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left: Domain Navigation */}
      <div className="col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections & Progress</h3>
          <div className="space-y-1">
            {AI360_DOMAINS.map((domain) => {
              const domainQs = getQuestionsByDomain(domain.key);
              const answered = domainQs.filter((q) => responses[q.id]?.selectedOption > 0).length;
              const pct = Math.round((answered / domainQs.length) * 100);
              const isActive = activeDomain === domain.key;

              return (
                <button
                  key={domain.key}
                  onClick={() => setActiveDomain(domain.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{domain.shortLabel}</span>
                    <span className={`text-xs ${pct === 100 ? "text-emerald-600" : "text-gray-400"}`}>
                      {answered}/{domainQs.length}
                    </span>
                  </div>
                  <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all ${pct === 100 ? "bg-emerald-500" : "bg-blue-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Overall progress */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Overall</span>
              <span className="font-semibold text-gray-900">{totalAnswered}/60</span>
            </div>
            <div className="mt-1.5 w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.round((totalAnswered / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Save status */}
          <div className="mt-4 text-xs text-gray-400">
            {saving && "Saving..."}
            {!saving && lastSaved && `Last saved ${lastSaved.toLocaleTimeString()}`}
            {!saving && !lastSaved && "Auto-saves as you answer"}
          </div>
        </div>
      </div>

      {/* Right: Questions */}
      <div className="col-span-9">
        {/* Respondent Picker (shown when multiple members exist) */}
        {members.length > 0 && (
          <div className="mb-4 p-3 bg-white border border-gray-200 rounded-xl flex items-center gap-4">
            <span className="text-xs text-gray-500 font-medium">Responding as:</span>
            <select
              value={activeRespondent}
              onChange={(e) => {
                const val = e.target.value;
                setActiveRespondent(val);
                if (val === "default") {
                  setActiveResponderName("Primary");
                  setActiveResponderRole("CLIENT_ADMIN");
                } else {
                  const m = members.find((mm) => mm.id === val);
                  if (m) { setActiveResponderName(m.name); setActiveResponderRole(m.role); }
                }
              }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="default">Primary Respondent</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.role.replace("_", " ")})</option>
              ))}
            </select>
            <span className="text-xs text-gray-400">Each respondent&apos;s answers are tracked separately for variance analysis.</span>
          </div>
        )}

        {/* Domain Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {AI360_DOMAINS.find((d) => d.key === activeDomain)?.label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {AI360_DOMAINS.find((d) => d.key === activeDomain)?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  previewMode
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {previewMode ? "Editing Mode" : "Preview"}
              </button>
              <span className="text-sm text-gray-400">
                {domainAnswered} of {questions.length} answered
              </span>
            </div>
          </div>
        </div>

        {/* Inline notice */}
        {isReadOnly && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            This assessment has been submitted. Responses are read-only.
          </div>
        )}

        {!isReadOnly && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Use fixed response types only. Do not paste raw datasets, logs, or row-level records into answers.
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              selectedOption={responses[q.id]?.selectedOption || 0}
              notes={responses[q.id]?.notes || ""}
              onSelect={(value) => handleSelect(q.id, value)}
              onNotes={(notes) => handleNotes(q.id, notes)}
              readOnly={isReadOnly || previewMode}
            />
          ))}
        </div>

        {/* Section Actions */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={saveResponses}
            disabled={isReadOnly || saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Section as Draft"}
          </button>

          <div className="flex gap-3">
            {/* Navigate domains */}
            {AI360_DOMAINS.findIndex((d) => d.key === activeDomain) > 0 && (
              <button
                onClick={() => {
                  const idx = AI360_DOMAINS.findIndex((d) => d.key === activeDomain);
                  setActiveDomain(AI360_DOMAINS[idx - 1].key);
                  window.scrollTo(0, 0);
                }}
                className="px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous Section
              </button>
            )}
            {AI360_DOMAINS.findIndex((d) => d.key === activeDomain) < AI360_DOMAINS.length - 1 && (
              <button
                onClick={() => {
                  const idx = AI360_DOMAINS.findIndex((d) => d.key === activeDomain);
                  setActiveDomain(AI360_DOMAINS[idx + 1].key);
                  window.scrollTo(0, 0);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────
interface QuestionCardProps {
  question: AI360Question;
  index: number;
  selectedOption: number;
  notes: string;
  onSelect: (value: number) => void;
  onNotes: (notes: string) => void;
  readOnly: boolean;
}

function QuestionCard({ question, index, selectedOption, notes, onSelect, onNotes, readOnly }: QuestionCardProps) {
  const [showNotes, setShowNotes] = useState(!!notes);

  return (
    <div className={`bg-white rounded-xl border ${selectedOption > 0 ? "border-blue-200" : "border-gray-200"} p-5 transition-colors`}>
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono text-gray-400 mt-1 w-10 flex-shrink-0">{question.id}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 leading-relaxed">{question.text}</p>

          {question.weight >= 1.25 && (
            <span className="inline-flex items-center mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              High Impact
            </span>
          )}

          {/* Options */}
          <div className="mt-3 space-y-1.5">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => !readOnly && onSelect(opt.value)}
                disabled={readOnly}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  selectedOption === opt.value
                    ? "bg-blue-50 text-blue-800 border border-blue-300"
                    : readOnly
                    ? "bg-gray-50 text-gray-500"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedOption === opt.value
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}>
                  {selectedOption === opt.value && (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </span>
                <span className="flex-1">{opt.label}</span>
                <span className="text-xs text-gray-400">{opt.value}/5</span>
              </button>
            ))}
          </div>

          {/* Notes toggle */}
          <div className="mt-3">
            {!showNotes ? (
              <button
                onClick={() => setShowNotes(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                + Add notes
              </button>
            ) : (
              <textarea
                value={notes}
                onChange={(e) => onNotes(e.target.value)}
                placeholder="Optional notes or context for this response..."
                rows={2}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
