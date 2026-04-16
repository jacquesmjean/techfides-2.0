import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const post = await db.socialPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allowedFields = [
    "title", "body", "category", "platforms", "status",
    "scheduledAt", "hashtags", "ctaUrl", "ctaText", "reviewNotes",
    "impressions", "clicks", "likes", "comments", "shares",
  ];

  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === "scheduledAt" && typeof body[field] === "string") {
        updateData[field] = new Date(body[field] as string);
      } else {
        updateData[field] = body[field];
      }
    }
  }

  // Track approval
  if (body.status === "APPROVED") {
    updateData.approvedAt = new Date();
    updateData.approvedBy = "jacques@techfides.com";
  }

  // Track publish
  if (body.status === "PUBLISHED") {
    updateData.publishedAt = new Date();
  }

  const updated = await db.socialPost.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.socialPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
