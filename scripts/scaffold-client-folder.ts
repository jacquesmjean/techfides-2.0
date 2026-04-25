/**
 * CLI test for the filesystem scaffolding module.
 *
 * Run with: npx tsx scripts/scaffold-client-folder.ts "Smith Law Firm"
 *
 * Creates a fake client folder at <TECHFIDES_OPS_ROOT>/Clients/<name>/
 * with proper subfolders and README. Useful for testing without going
 * through the API or seeding the database.
 *
 * Idempotent — running twice with the same name does not duplicate or
 * destroy content.
 */

import { scaffoldClientFolder } from "../src/lib/filesystem/scaffold";
import { getOpsRoot } from "../src/lib/filesystem/config";

async function main() {
  const name = process.argv[2] ?? "Test Client Co";
  console.log(`Ops root: ${getOpsRoot()}`);
  console.log(`Scaffolding client: ${name}\n`);

  const result = await scaffoldClientFolder({
    companyName: name,
    contactName: "Jane Doe",
    email: "jane@example.com",
    tier: "Gold",
    service: "SOVEREIGN_AI",
    retainerAmount: 1500,
    retainerStart: new Date(),
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
