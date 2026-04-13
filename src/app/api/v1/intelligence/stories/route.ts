/**
 * GET /api/v1/intelligence/stories
 *
 * Generates smart social media content from real client journey data.
 * Each story is sourced from actual system events: completed projects,
 * resolved tickets, assessment leads, team activity, and loss patterns.
 */

import { NextResponse } from "next/server";
import { generateStoryContent } from "@/lib/velocity/intelligence/self-healing";

export async function GET() {
  const result = await generateStoryContent();

  return NextResponse.json({
    ...result,
    generatedAt: new Date().toISOString(),
    storyCount: result.stories.length,
  });
}
