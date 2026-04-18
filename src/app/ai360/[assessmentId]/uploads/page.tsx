"use client";

import { useState, useEffect, useRef, DragEvent } from "react";
import { useParams } from "next/navigation";
import { useAssessment } from "@/lib/ai360/assessment-context";
import { AI360DocumentInfo } from "@/lib/ai360/types";

const DOC_CATEGORIES = [
  { value: "STRATEGY", label: "Strategy Documents", icon: "compass" },
  { value: "PROCESS", label: "Process Documentation", icon: "settings" },
  { value: "ARCHITECTURE", label: "Architecture Diagrams", icon: "cpu" },
  { value: "POLICY", label: "Policy / Compliance", icon: "shield" },
  { value: "OTHER", label: "Other", icon: "file" },
] as const;

export default function UploadsPage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { status } = useAssessment();
  const [documents, setDocuments] = useState<AI360DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isClientEditable = status === "DRAFT";
  const isAnalystEditable = status === "SUBMITTED" || status === "ANALYZING";

  useEffect(() => {
    fetch(`/api/v1/ai360/${assessmentId}/documents`)
      .then((r) => r.ok ? r.json() : { documents: [] })
      .then((d) => setDocuments(d.documents || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assessmentId]);

  async function handleUpload(files: FileList) {
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("category", filterCategory !== "all" ? filterCategory : "OTHER");

    try {
      const res = await fetch(`/api/v1/ai360/${assessmentId}/documents`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) => [...prev, ...(data.documents || [])]);
      }
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }

  async function handleDelete(docId: string) {
    const res = await fetch(`/api/v1/ai360/${assessmentId}/documents/${docId}`, { method: "DELETE" });
    if (res.ok) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    }
  }

  const filtered = documents.filter((d) => {
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (searchTerm && !d.fileName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const categoryCounts = DOC_CATEGORIES.reduce(
    (acc, c) => ({ ...acc, [c.value]: documents.filter((d) => d.category === c.value).length }),
    {} as Record<string, number>
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Content */}
      <div className="col-span-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-blue-600 font-medium mb-1">Supporting documents, not raw data.</p>
          <h2 className="text-xl font-bold text-gray-900">Uploads for your AI readiness assessment</h2>
          <p className="text-sm text-gray-500 mt-1">
            Documents add context and credibility but never change the fixed scoring logic.
          </p>
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Reuse, organization-scoped files</span>
            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Lock for clients after submission</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
          >
            <option value="all">All types</option>
            {DOC_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in filename..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          {(filterCategory !== "all" || searchTerm) && (
            <button onClick={() => { setFilterCategory("all"); setSearchTerm(""); }} className="text-sm text-blue-600 hover:text-blue-800">
              Clear filters
            </button>
          )}
        </div>

        {/* Document List */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Documents linked to this assessment</h3>
          {loading ? (
            <div className="py-8 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
              No documents uploaded yet. Attach key files below.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{formatFileSize(doc.fileSize)}</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{doc.category}</span>
                        {doc.uploaderName && (
                          <>
                            <span className="text-xs text-gray-300">|</span>
                            <span className="text-xs text-gray-400">{doc.uploaderName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {isClientEditable && (
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drop Zone */}
        {(isClientEditable || isAnalystEditable) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload new documents</h3>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-amber-50/50 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <svg className="w-10 h-10 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-gray-700">
                {uploading ? "Uploading..." : "Drag & drop a file or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PNG, JPG up to 25MB</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.svg"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="col-span-4 space-y-4">
        {/* Assessment Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Assessment Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total documents</span>
              <span className="font-semibold text-gray-900">{documents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last updated</span>
              <span className="text-gray-900">{documents.length > 0 ? new Date(documents[documents.length - 1].createdAt).toLocaleDateString() : "—"}</span>
            </div>
          </div>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            {isClientEditable
              ? "Client users can upload, edit, and delete files while the assessment is in Draft status. After submission, uploads become read-only for clients."
              : "Uploads are read-only. TechFides Analysts and Reviewers may attach additional materials."}
          </div>
        </div>

        {/* Uploads Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Uploads Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            {DOC_CATEGORIES.slice(0, 4).map((c) => (
              <div key={c.value} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{categoryCounts[c.value] || 0}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Include current strategy documents and architecture/system overviews.</p>
        </div>

        {/* What to Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">What to Upload</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">&#8226;</span> Strategy documents</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">&#8226;</span> Process documentation</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">&#8226;</span> Interview notes</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">&#8226;</span> Architecture / system diagrams</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">&#8226;</span> Policy / compliance documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
