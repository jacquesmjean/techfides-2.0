/**
 * Seed: TechFides core team
 *
 * Creates Employee + linked User records for the founding team:
 *   - Jacques M. Jean        — Founder & CEO          — ADMIN
 *   - Kasthuri Henry         — Chief Financial Officer — ADMIN
 *   - Erich Hagio Nelson     — Administrative Manager  — ADMIN
 *   - Jean-Gardais Monfiston — VP International BD     — CLOSER
 *
 * For each person, this script:
 *   1. Upserts a User row (NextAuth) keyed on email, with the right app role
 *   2. Upserts an Employee row keyed on email, linked to the User
 *   3. Seeds default FTE onboarding tasks (10 tasks)
 *   4. Seeds expected document checklist (6 docs for FTE)
 *   5. Scaffolds the on-disk folder at <opsRoot>/HR/<Name>/
 *
 * Idempotent — safe to re-run. If a person already exists, the script:
 *   - Updates their role/title if it changed
 *   - Skips re-seeding tasks/documents
 *   - Re-runs the folder scaffold (which itself is idempotent)
 *
 * Run with: npx tsx scripts/seed-techfides-team.ts
 */

import { PrismaClient } from "@prisma/client";

import { scaffoldEmployeeFolder } from "../src/lib/filesystem/scaffold";
import {
  getDefaultTasks,
  getDefaultDocuments,
  computeDueDate,
} from "../src/lib/hr/onboarding-templates";

const db = new PrismaClient();

interface SeedPerson {
  name: string;
  email: string;
  role: string;            // job title
  appRole: "ADMIN" | "CLOSER" | "VIEWER";
  type: "FTE" | "CONTRACTOR";
  region: "US" | "MX" | "CEMAC";
  startDate: Date;
  notes?: string;
}

const TEAM: SeedPerson[] = [
  {
    name: "Jacques M. Jean",
    email: "jacques.jean@techfides.com",
    role: "Founder & CEO",
    appRole: "ADMIN",
    type: "FTE",
    region: "US",
    startDate: new Date("2026-01-01"), // founding
    notes: "Founder and CEO. Owns sales pipeline, client relationships, and overall strategy.",
  },
  {
    name: "Kasthuri Henry",
    email: "kasthuri.henry@techfides.com",
    role: "Chief Financial Officer",
    appRole: "ADMIN",
    type: "FTE",
    region: "US",
    startDate: new Date("2026-04-25"),
    notes: "Owns financial operations: AR, AP, payroll, banking, tax compliance, and financial reporting.",
  },
  {
    name: "Erich Hagio Nelson",
    email: "erich.hagionelson@techfides.com",
    role: "Administrative Manager",
    appRole: "ADMIN",
    type: "FTE",
    region: "US",
    startDate: new Date("2026-04-25"),
    notes: "Owns operational coordination: HR records, vendor management, scheduling, internal SOPs.",
  },
  {
    name: "Jean-Gardais Monfiston",
    email: "jeangardais.monfiston@techfides.com",
    role: "VP International Business Development",
    appRole: "CLOSER",
    type: "FTE",
    region: "US", // default; update if based abroad (CEMAC / MX)
    startDate: new Date("2026-04-25"),
    notes: "Owns international sales pipeline: Gabon ABC, Haiti ULC, Mexico/CEMAC expansion.",
  },
  {
    name: "Jacques D. Jean",
    email: "jacques.d.jean@techfides.com",
    role: "Technical Sales Engineer",
    appRole: "CLOSER",
    type: "CONTRACTOR",
    region: "US",
    startDate: new Date("2026-04-25"),
    notes: "First Technical Sales Engineer for TechFides. Handles technical sales discovery, demo, and pre-deployment scoping. Brought in on-demand for opportunities approaching close.",
  },
];

async function main() {
  console.log("Seeding TechFides core team\n");
  let created = 0;
  let updated = 0;

  for (const person of TEAM) {
    console.log(`\n── ${person.name} ──`);

    // 1. Upsert User (NextAuth)
    const user = await db.user.upsert({
      where: { email: person.email },
      update: {
        name: person.name,
        role: person.appRole,
      },
      create: {
        email: person.email,
        name: person.name,
        role: person.appRole,
        mfaEnabled: false, // they enable at first login
      },
    });
    console.log(`  ✓ User: ${user.id} (role: ${user.role})`);

    // 2. Upsert Employee, linked to User
    const existingEmp = await db.employee.findUnique({
      where: { email: person.email },
    });

    let employee;
    let isNew = false;
    if (existingEmp) {
      employee = await db.employee.update({
        where: { email: person.email },
        data: {
          name: person.name,
          role: person.role,
          type: person.type,
          region: person.region,
          notes: person.notes,
          userId: user.id,
        },
      });
      console.log(`  ✓ Employee: ${employee.id} (updated)`);
      updated++;
    } else {
      employee = await db.employee.create({
        data: {
          name: person.name,
          email: person.email,
          role: person.role,
          type: person.type,
          region: person.region,
          startDate: person.startDate,
          payRate: 0, // TBD — set per individual offer
          currency: "USD",
          status: "ONBOARDING",
          notes: person.notes,
          userId: user.id,
        },
      });
      console.log(`  ✓ Employee: ${employee.id} (created)`);
      isNew = true;
      created++;
    }

    // 3. Seed onboarding tasks (only for new records to avoid duplicating)
    if (isNew) {
      const tasks = getDefaultTasks(person.type);
      await db.employeeOnboardingTask.createMany({
        data: tasks.map((t) => ({
          employeeId: employee.id,
          order: t.order,
          title: t.title,
          description: t.description,
          category: t.category,
          owner: t.owner,
          required: t.required,
          dueDate: computeDueDate(person.startDate, t.dueOffsetDays),
        })),
      });
      console.log(`  ✓ Tasks seeded: ${tasks.length}`);

      // 4. Seed expected documents
      const docs = getDefaultDocuments(person.type);
      await db.employeeDocument.createMany({
        data: docs.map((d) => ({
          employeeId: employee.id,
          type: d.type,
          name: d.name,
          status: "PENDING",
        })),
      });
      console.log(`  ✓ Documents tracked: ${docs.length}`);
    } else {
      console.log(`  → tasks/documents already seeded — skipping`);
    }

    // 5. Scaffold on-disk folder (always — idempotent)
    try {
      const scaffold = await scaffoldEmployeeFolder({
        name: person.name,
        email: person.email,
        role: person.role,
        type: person.type === "FTE" ? "FTE" : "Contractor",
        startDate: person.startDate,
        status: employee.status,
        scaffoldedAt: new Date(),
      });
      // Persist canonical Mac path (not whatever sandbox path the script used)
      const canonicalFolder = `/Users/jacquesmjean/Desktop/TechFides/HR/${person.name}`;
      await db.employee.update({
        where: { id: employee.id },
        data: { folderPath: canonicalFolder },
      });
      console.log(`  ✓ Folder: ${canonicalFolder}`);
      console.log(`    (alreadyExisted: ${scaffold.alreadyExisted}, sandbox path: ${scaffold.rootPath})`);
    } catch (e) {
      console.log(`  ⚠ Folder scaffold failed: ${e instanceof Error ? e.message : e}`);
      console.log(`    Re-run via: POST /api/v1/hr/employees/${employee.id}/scaffold-folder`);
    }
  }

  console.log("\n\n══ Summary ══");
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log("\nVisit /gse/hr to see the full roster.");
  console.log("\nNotes:");
  console.log("  • Pay rates are set to 0 — update per-person via PATCH /api/v1/hr/employees/[id]");
  console.log("  • Jean-Gardais defaulted to US region — update if he's based in CEMAC/MX");
  console.log("  • Each person's first login will prompt MFA setup (TOTP)");
  console.log("  • App role tiers: ADMIN (full access), CLOSER (sales pipeline), VIEWER (read-only)");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
