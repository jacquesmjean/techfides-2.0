import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

/**
 * GET /api/v1/hr/employees/[id]
 *
 * Returns one employee with full task + document detail.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const employee = await db.employee.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { order: "asc" } },
      documents: { orderBy: { type: "asc" } },
      manager: { select: { id: true, name: true, email: true } },
    },
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const required = employee.tasks.filter((t) => t.required);
  const completed = required.filter((t) => t.completedAt !== null);
  const onboardingProgress =
    required.length === 0 ? 100 : Math.round((completed.length / required.length) * 100);

  return NextResponse.json({
    ...employee,
    onboardingProgress,
    requiredTaskCount: required.length,
    completedTaskCount: completed.length,
  });
}

const UpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().optional(),
  role: z.string().min(1).max(120).optional(),
  status: z.enum(["ONBOARDING", "ACTIVE", "ON_LEAVE", "TERMINATED"]).optional(),
  tier: z.enum(["Top", "Mid", "Low"]).nullable().optional(),
  region: z.enum(["US", "MX", "CEMAC"]).optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  payRate: z.number().nonnegative().optional(),
  utilization: z.number().min(0).max(100).nullable().optional(),
  roi: z.number().nullable().optional(),
  nps: z.number().min(0).max(10).nullable().optional(),
  managerId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

/**
 * PATCH /api/v1/hr/employees/[id]
 *
 * Update mutable fields. Status changes to TERMINATED set endDate to now if
 * not provided.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = { ...data };
  if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.status === "TERMINATED" && data.endDate === undefined) {
    updateData.endDate = new Date();
  }

  const updated = await db.employee.update({ where: { id }, data: updateData });

  await db.auditLog.create({
    data: {
      action: "update_employee",
      resource: `Employee/${id}`,
      metadata: { changedFields: Object.keys(data) },
    },
  });

  return NextResponse.json(updated);
}
