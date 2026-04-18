import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "uploads", "ai360");

// DELETE /api/v1/ai360/:assessmentId/documents/:docId
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string; docId: string }> }
) {
  const { assessmentId, docId } = await params;

  const doc = await db.aI360Document.findFirst({
    where: { id: docId, assessmentId },
  });

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Delete file from disk
  try {
    await unlink(join(UPLOAD_DIR, assessmentId, doc.storageKey));
  } catch {
    // File may already be deleted
  }

  await db.aI360Document.delete({ where: { id: docId } });

  return NextResponse.json({ success: true });
}
