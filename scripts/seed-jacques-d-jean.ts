/**
 * Seed: Jacques D. Jean — Technical Sales Engineer (Contractor)
 *
 * The first real employee record in the HR system. Mirrors the on-disk
 * folder at ~/Desktop/TechFides/HR/Jacques D. Jean/ that was scaffolded
 * in Phase 1.
 *
 * Run: npx tsx scripts/seed-jacques-d-jean.ts
 *
 * Idempotent: uses upsert on email so running twice does not duplicate.
 * If the record already exists, prints the existing state and exits.
 */

import { PrismaClient } from "@prisma/client";
import { scaffoldEmployeeFolder } from "../src/lib/filesystem/scaffold";
import {
  getDefaultTasks,
  getDefaultDocuments,
  computeDueDate,
} from "../src/lib/hr/onboarding-templates";

const db = new PrismaClient();

const JACQUES_D = {
  name: "Jacques D. Jean",
  email: "jacques.d.jean@techfides.com",
  role: "Technical Sales Engineer",
  type: "CONTRACTOR" as const,
  region: "US" as const,
  startDate: new Date("2026-04-25"),
  payRate: 0, // commission-based; pay rate set per engagement
  notes: "First Technical Sales Engineer for TechFides. Handles technical sales discovery, demo, and pre-deployment scoping. Brought in on-demand for opportunities approaching close.",
};

async function main() {
  console.log(`Seeding employee: ${JACQUES_D.name}\n`);

  // Check if exists
  const existing = await db.employee.findUnique({
    where: { email: JACQUES_D.email },
    include: {
      _count: { select: { tasks: true, documents: true } },
    },
  });

  if (existing) {
    console.log("Already exists:");
    console.log(`  id: ${existing.id}`);
    console.log(`  status: ${existing.status}`);
    console.log(`  tasks: ${existing._count.tasks}`);
    console.log(`  documents: ${existing._count.documents}`);
    console.log(`  folderPath: ${existing.folderPath ?? "(not scaffolded)"}`);
    console.log("\nNothing to do. Exiting.");
    return;
  }

  // 1. Create the employee
  const emp = await db.employee.create({
    data: {
      name: JACQUES_D.name,
      email: JACQUES_D.email,
      role: JACQUES_D.role,
      type: JACQUES_D.type,
      region: JACQUES_D.region,
      startDate: JACQUES_D.startDate,
      payRate: JACQUES_D.payRate,
      currency: "USD",
      status: "ONBOARDING",
      notes: JACQUES_D.notes,
    },
  });
  console.log(`✓ Created employee record: ${emp.id}`);

  // 2. Seed default tasks
  const taskTemplates = getDefaultTasks(JACQUES_D.type);
  await db.employeeOnboardingTask.createMany({
    data: taskTemplates.map((t) => ({
      employeeId: emp.id,
      order: t.order,
      title: t.title,
      description: t.description,
      category: t.category,
      owner: t.owner,
      required: t.required,
      dueDate: computeDueDate(JACQUES_D.startDate, t.dueOffsetDays),
    })),
  });
  console.log(`✓ Seeded ${taskTemplates.length} onboarding tasks`);

  // 3. Seed expected documents
  const docTemplates = getDefaultDocuments(JACQUES_D.type);
  await db.employeeDocument.createMany({
    data: docTemplates.map((d) => ({
      employeeId: emp.id,
      type: d.type,
      name: d.name,
      status: "PENDING",
    })),
  });
  console.log(`✓ Seeded ${docTemplates.length} expected documents`);

  // 4. Scaffold folder (idempotent — Phase 1 already created this folder)
  try {
    const result = await scaffoldEmployeeFolder({
      name: JACQUES_D.name,
      email: JACQUES_D.email,
      role: JACQUES_D.role,
      type: "Contractor",
      startDate: JACQUES_D.startDate,
      status: "ONBOARDING",
      scaffoldedAt: new Date(),
    });
    await db.employee.update({
      where: { id: emp.id },
      data: { folderPath: result.rootPath },
    });
    console.log(`✓ Folder linked: ${result.rootPath}`);
    console.log(`  alreadyExisted: ${result.alreadyExisted}`);
  } catch (e) {
    console.log(`⚠ Folder scaffold failed: ${e instanceof Error ? e.message : e}`);
    console.log(`  (Record created anyway. Re-run via POST /api/v1/hr/employees/${emp.id}/scaffold-folder)`);
  }

  console.log(`\nDone. Visit /gse/hr to see Jacques in the roster.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
