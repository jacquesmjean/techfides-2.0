import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { scaffoldEmployeeFolder } from "@/lib/filesystem/scaffold";

/**
 * POST /api/v1/hr/employees/[id]/scaffold-folder
 *
 * Idempotently (re-)scaffolds the on-disk folder for this Employee under
 * <TECHFIDES_OPS_ROOT>/HR/<Name>/. Updates Employee.folderPath.
 *
 * Useful when:
 *   - The initial scaffold failed (e.g., ops root wasn't mounted at create time)
 *   - The employee's name changed and you want a fresh folder
 *   - You moved the ops root and need to re-create folders
 *
 * Auth via existing middleware.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const employee = await db.employee.findUnique({ where: { id } });
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  try {
    const result = await scaffoldEmployeeFolder({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      type: employee.type === "FTE" ? "FTE" : "Contractor",
      startDate: employee.startDate,
      status: employee.status,
      scaffoldedAt: new Date(),
    });

    await db.employee.update({
      where: { id },
      data: { folderPath: result.rootPath },
    });

    await db.auditLog.create({
      data: {
        action: "scaffold_employee_folder",
        resource: `Employee/${id}`,
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
