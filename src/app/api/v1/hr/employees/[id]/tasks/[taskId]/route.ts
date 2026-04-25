import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

/**
 * PATCH /api/v1/hr/employees/[id]/tasks/[taskId]
 *
 * Mark a task complete (or reopen it). Body:
 *   { completed: true, completedBy?: "Jacques M. Jean" }
 *   { completed: false }                             // reopen
 */

const Schema = z.object({
  completed: z.boolean(),
  completedBy: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const task = await db.employeeOnboardingTask.findUnique({ where: { id: taskId } });
  if (!task || task.employeeId !== id) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const updated = await db.employeeOnboardingTask.update({
    where: { id: taskId },
    data: {
      completedAt: parsed.data.completed ? new Date() : null,
      completedBy: parsed.data.completed ? parsed.data.completedBy ?? null : null,
    },
  });

  // If all required tasks are now complete, auto-promote employee to ACTIVE
  if (parsed.data.completed) {
    const remaining = await db.employeeOnboardingTask.count({
      where: { employeeId: id, required: true, completedAt: null },
    });
    if (remaining === 0) {
      const emp = await db.employee.findUnique({ where: { id } });
      if (emp && emp.status === "ONBOARDING") {
        await db.employee.update({
          where: { id },
          data: { status: "ACTIVE" },
        });
      }
    }
  }

  return NextResponse.json(updated);
}
