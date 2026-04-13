import { NextResponse } from "next/server";
import { generateProspectProfile } from "@/lib/velocity/intelligence/deal-prep";

export async function GET(
  _request: Request,
  { params }: { params: { leadId: string } }
) {
  const profile = await generateProspectProfile(params.leadId);

  if (!profile) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
