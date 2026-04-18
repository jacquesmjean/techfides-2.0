import { NextRequest, NextResponse } from "next/server";
import { INDUSTRY_BENCHMARKS } from "@/lib/ai360/benchmarks";

// GET /api/v1/ai360/benchmarks?industry=LEGAL
export async function GET(req: NextRequest) {
  const industry = req.nextUrl.searchParams.get("industry");

  if (industry && INDUSTRY_BENCHMARKS[industry]) {
    return NextResponse.json(INDUSTRY_BENCHMARKS[industry]);
  }

  // Return all benchmarks
  return NextResponse.json({
    benchmarks: Object.values(INDUSTRY_BENCHMARKS).map((b) => ({
      industry: b.industry,
      label: b.label,
      sampleSize: b.sampleSize,
      overallAvg: b.overallAvg,
      insights: b.insights,
    })),
  });
}
