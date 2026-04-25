/**
 * CLI test for employee folder scaffolding.
 *
 * Run with: npx tsx scripts/scaffold-employee-folder.ts "Jacques D. Jean"
 *
 * Phase 1 (now): manual invocation against the filesystem module.
 * Phase 2 (next): wired up to the Employee Prisma model and /gse/hr UI.
 */

import { scaffoldEmployeeFolder } from "../src/lib/filesystem/scaffold";
import { getOpsRoot } from "../src/lib/filesystem/config";

async function main() {
  const name = process.argv[2] ?? "Test Employee";
  console.log(`Ops root: ${getOpsRoot()}`);
  console.log(`Scaffolding employee: ${name}\n`);

  const result = await scaffoldEmployeeFolder({
    name,
    email: "test@techfides.com",
    role: "Technical Sales Engineer",
    type: "Contractor",
    startDate: new Date(),
    status: "ACTIVE",
    scaffoldedAt: new Date(),
  });

  console.log(`Folder:         ${result.rootPath}`);
  console.log(`Already existed: ${result.alreadyExisted}`);
  console.log(`New subfolders:  ${result.createdSubfolders.join(", ") || "(none — all already existed)"}`);
  console.log(`README:         ${result.readmePath}`);
}

main().catch((err) => {
  console.error("Scaffold failed:", err.message ?? err);
  process.exit(1);
});
