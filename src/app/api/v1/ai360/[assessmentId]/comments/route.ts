import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/ai360/:assessmentId/comments?questionId=xxx
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const questionId = req.nextUrl.searchParams.get("questionId");

  const where: Record<string, unknown> = { assessmentId };
  if (questionId) where.questionId = questionId;

  const comments = await db.aI360Comment.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  // Organize into threads
  const topLevel = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);

  const threads = topLevel.map((c) => ({
    id: c.id,
    questionId: c.questionId,
    authorName: c.authorName,
    authorEmail: c.authorEmail,
    authorRole: c.authorRole,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
    replies: replies
      .filter((r) => r.parentId === c.id)
      .map((r) => ({
        id: r.id,
        authorName: r.authorName,
        authorEmail: r.authorEmail,
        authorRole: r.authorRole,
        body: r.body,
        createdAt: r.createdAt.toISOString(),
      })),
  }));

  return NextResponse.json({ comments: threads, total: comments.length });
}

// POST /api/v1/ai360/:assessmentId/comments
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const body = await req.json();

  if (!body.body?.trim() || !body.authorName?.trim()) {
    return NextResponse.json({ error: "body and authorName are required" }, { status: 400 });
  }

  const comment = await db.aI360Comment.create({
    data: {
      assessmentId,
      questionId: body.questionId || null,
      authorName: body.authorName,
      authorEmail: body.authorEmail || null,
      authorRole: body.authorRole || null,
      body: body.body,
      parentId: body.parentId || null,
    },
  });

  // Log activity
  await db.aI360Activity.create({
    data: {
      assessmentId,
      actorName: body.authorName,
      actorRole: body.authorRole || null,
      action: "commented",
      target: body.questionId || "general",
      detail: body.body.slice(0, 200),
    },
  });

  return NextResponse.json({
    id: comment.id,
    questionId: comment.questionId,
    authorName: comment.authorName,
    authorRole: comment.authorRole,
    body: comment.body,
    parentId: comment.parentId,
    createdAt: comment.createdAt.toISOString(),
  }, { status: 201 });
}
