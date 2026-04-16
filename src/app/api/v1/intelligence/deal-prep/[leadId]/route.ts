import { NextResponse } from "next/server";
import { generateProspectProfile } from "@/lib/velocity/intelligence/deal-prep";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;
  const profile = await generateProspectProfile(leadId);

  if (!profile) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
