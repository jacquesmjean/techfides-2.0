import { NextResponse } from "next/server";
import { generateDrafts } from "@/lib/email/draft-service";

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // no body is ok — use defaults
  }

  const result = await generateDrafts({
    heatScoreThreshold: typeof body.heatScoreThreshold === "number" ? body.heatScoreThreshold : undefined,
    tier2Limit: typeof body.tier2Limit === "number" ? body.tier2Limit : undefined,
    tier1Limit: typeof body.tier1Limit === "number" ? body.tier1Limit : undefined,
    triggeredBy: "manual",
  });

  return NextResponse.json(result, { status: 200 });
}
