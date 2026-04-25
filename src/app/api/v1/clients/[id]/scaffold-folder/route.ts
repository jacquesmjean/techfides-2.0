import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { scaffoldClientFolder } from "@/lib/filesystem/scaffold";

/**
 * POST /api/v1/clients/[id]/scaffold-folder
 *
 * Creates (or idempotently refreshes) the on-disk folder for a ClientAccount
 * under <TECHFIDES_OPS_ROOT>/Clients/<CompanyName>/.
 *
 * Auth is enforced by middleware (session cookie or VELOCITY_API_KEY bearer).
 *
 * Returns:
 *   200  ScaffoldResult — { rootPath, createdSubfolders, alreadyExisted, readmePath }
 *   404  Client not found
 *   500  Filesystem error (ops root missing, permission denied, etc.)
 *
 * Notes:
 *   - Filesystem operations run on the host where the Next.js server runs.
 *     For local-first ops (the recommended TechFides deployment model),
 *     this is your Mac. For Vercel deployments, this won't reach your
 *     Desktop — you'd need a local agent or self-hosted Next.js server.
 *   - Idempotent: safe to call after every ClientAccount update.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await db.clientAccount.findUnique({ where: { id } });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  try {
    const result = await scaffoldClientFolder({
      companyName: client.companyName,
      contactName: client.contactName,
      email: client.email,
      tier: client.tier,
      service: client.service,
      retainerAmount: client.retainerAmount,
      retainerStart: client.retainerStart,
      status: client.status,
      scaffoldedAt: new Date(),
    });

    await db.auditLog.create({
      data: {
        action: "scaffold_client_folder",
        resource: `ClientAccount/${id}`,
        metadata: {
          rootPath: result.rootPath,
          createdSubfolders: result.createdSubfolders,
          alreadyExisted: result.alreadyExisted,
        },
      },
    });

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown filesystem error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
