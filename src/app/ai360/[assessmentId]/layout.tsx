"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TabNav } from "@/components/ai360/TabNav";
import { AssessmentCtx, AssessmentContextType } from "@/lib/ai360/assessment-context";

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const assessmentId = params.assessmentId as string;
  const [data, setData] = useState<AssessmentContextType | null>(null);
  const [loading, setLoading] = useState(true);

  function loadAssessment() {
    fetch(`/api/v1/ai360/${assessmentId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setData({
            id: json.id,
            name: json.name,
            orgName: json.orgName,
            status: json.status,
            overallScore: json.overallScore,
            completionRate: json.completionRate ?? 0,
            reload: loadAssessment,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Assessment Not Found</h2>
        <p className="text-gray-500">This assessment may have been deleted or you don&apos;t have access.</p>
      </div>
    );
  }

  return (
    <AssessmentCtx.Provider value={data}>
      <TabNav assessmentId={assessmentId} status={data.status} orgName={data.orgName} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </AssessmentCtx.Provider>
  );
}
