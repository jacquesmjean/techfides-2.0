import { NextResponse } from "next/server";
import { analyzeRevenue } from "@/lib/velocity/intelligence/revenue-monitor";

export async function GET() {
  const result = await analyzeRevenue();
  return NextResponse.json({
    ...result,
    analyzedAt: new Date().toISOString(),
  });
}
