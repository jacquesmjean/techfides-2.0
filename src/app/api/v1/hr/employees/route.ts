import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { scaffoldEmployeeFolder } from "@/lib/filesystem/scaffold";
import {
  getDefaultTasks,
  getDefaultDocuments,
  computeDueDate,
} from "@/lib/hr/onboarding-templates";

/**
 * GET /api/v1/hr/employees
 *
 * Returns all employees with their task summary.
 */
export async function GET() {
  const employees = await db.employee.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
    include: {
      tasks: {
        select: { id: true, completedAt: true, required: true },
      },
      _count: {
        select: { tasks: true, documents: true },
      },
    },
  });

  // Roll up onboarding progress per employee
  const enriched = employees.map((e) => {
    const required = e.tasks.filter((t) => t.required);
    const completed = required.filter((t) => t.completedAt !== null);
    const progress = required.length === 0 ? 100 : Math.round((completed.length / required.length) * 100);
    const { tasks: _t, ...rest } = e;
    return {
      ...rest,
      onboardingProgress: progress,
      requiredTaskCount: required.length,
      completedTaskCount: completed.length,
    };
  });

  return NextResponse.json(enriched);
}

const CreateEmployeeSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string().min(1).max(120),
  type: z.enum(["FTE", "CONTRACTOR"]),
  tier: z.enum(["Top", "Mid", "Low"]).optional(),
  region: z.enum(["US", "MX", "CEMAC"]).optional(),
  startDate: z.string().datetime().optional(),
  payRate: z.number().nonnegative().optional(),
  currency: z.enum(["USD", "MXN", "XAF"]).optional(),
  managerId: z.string().optional(),
  notes: z.string().optional(),
  /** If false, skip the on-disk folder scaffolding (rare — useful for tests) */
  scaffoldFolder: z.boolean().optional(),
});

/**
 * POST /api/v1/hr/employees
 *
 * Creates a new employee, auto-generates the default task + document list
 * for their type, and scaffolds an on-disk folder under <opsRoot>/HR/<Name>/.
 *
 * The on-disk scaffold is best-effort: if it fails (e.g., ops root missing on
 * a Vercel deployment), the employee record is still created and `folderPath`
 * stays null. The error is included in the response so the caller knows to
 * retry via /api/v1/hr/employees/[id]/scaffold-folder.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateEmployeeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const startDate = data.startDate ? new Date(data.startDate) : null;

  // Create the employee record
  const employee = await db.employee.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      type: data.type,
      tier: data.tier,
      region: data.region ?? "US",
      startDate,
      payRate: data.payRate ?? 0,
      currency: data.currency ?? "USD",
      managerId: data.managerId,
      notes: data.notes,
      status: "ONBOARDING",
    },
  });

  // Seed default onboarding tasks
  const taskTemplates = getDefaultTasks(data.type);
  await db.employeeOnboardingTask.createMany({
    data: taskTemplates.map((t) => ({
      employeeId: employee.id,
      order: t.order,
      title: t.title,
      description: t.description,
      category: t.category,
      owner: t.owner,
      required: t.required,
      dueDate: computeDueDate(startDate, t.dueOffsetDays),
    })),
  });

  // Seed expected documents
  const docTemplates = getDefaultDocuments(data.type);
  await db.employeeDocument.createMany({
    data: docTemplates.map((d) => ({
      employeeId: employee.id,
      type: d.type,
      name: d.name,
      status: "PENDING",
    })),
  });

  // Scaffold on-disk folder (best-effort)
  let folderPath: string | null = null;
  let scaffoldError: string | null = null;

  if (data.scaffoldFolder !== false) {
    try {
      const result = await scaffoldEmployeeFolder({
        name: data.name,
        email: data.email,
        role: data.role,
        type: data.type === "FTE" ? "FTE" : "Contractor",
        startDate,
        status: "ONBOARDING",
        scaffoldedAt: new Date(),
      });
      folderPath = result.rootPath;
      await db.employee.update({
        where: { id: employee.id },
        data: { folderPath },
      });
    } catch (e) {
      scaffoldError = e instanceof Error ? e.message : "Unknown scaffold error";
    }
  }

  await db.auditLog.create({
    data: {
      action: "create_employee",
      resource: `Employee/${employee.id}`,
      metadata: {
        name: data.name,
        type: data.type,
        role: data.role,
        scaffoldedFolder: folderPath !== null,
        scaffoldError,
      },
    },
  });

  return NextResponse.json(
    {
      employee: { ...employee, folderPath },
      tasksCreated: taskTemplates.length,
      documentsCreated: docTemplates.length,
      folderPath,
      scaffoldError,
    },
    { status: 201 }
  );
}
