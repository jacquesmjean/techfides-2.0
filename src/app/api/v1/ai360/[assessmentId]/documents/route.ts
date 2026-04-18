import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "uploads", "ai360");

// GET /api/v1/ai360/:assessmentId/documents
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;

  const documents = await db.aI360Document.findMany({
    where: { assessmentId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    documents: documents.map((d) => ({
      id: d.id,
      fileName: d.fileName,
      fileSize: d.fileSize,
      mimeType: d.mimeType,
      category: d.category,
      description: d.description,
      uploaderName: d.uploaderName,
      createdAt: d.createdAt.toISOString(),
    })),
  });
}

// POST /api/v1/ai360/:assessmentId/documents — Upload files
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const formData = await req.formData();
  const category = (formData.get("category") as string) || "OTHER";
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  // Ensure upload directory
  const assessmentDir = join(UPLOAD_DIR, assessmentId);
  await mkdir(assessmentDir, { recursive: true });

  const created = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${Date.now()}-${safeName}`;
    const filePath = join(assessmentDir, storageKey);

    await writeFile(filePath, buffer);

    const doc = await db.aI360Document.create({
      data: {
        assessmentId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        category: category as "STRATEGY" | "PROCESS" | "ARCHITECTURE" | "POLICY" | "OTHER",
        storageKey,
      },
    });

    created.push({
      id: doc.id,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      category: doc.category,
      description: doc.description,
      uploaderName: doc.uploaderName,
      createdAt: doc.createdAt.toISOString(),
    });
  }

  return NextResponse.json({ documents: created }, { status: 201 });
}
