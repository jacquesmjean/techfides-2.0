/**
 * Reset all Lead stages back to PROSPECT.
 *
 * Stage discipline (per Jacques 2026-04-25):
 *   PROSPECT      — outreach target; haven't given us substantive engagement
 *   QUALIFIED     — they've returned a questionnaire / had a discovery call
 *                   / signaled real interest
 *   PROPOSAL      — we've sent a formal proposal/SOW
 *   NEGOTIATION   — active terms negotiation
 *   CLOSED_WON    — signed contract
 *   CLOSED_LOST   — dead
 *
 * Even FarmMate Ghana resets to PROSPECT — they have not returned the
 * feasibility questionnaire yet. Once they do, they'll move to QUALIFIED.
 *
 * This script lists the current state, resets ALL non-closed leads to
 * PROSPECT, and prints the diff. CLOSED_WON and CLOSED_LOST are left
 * alone (those are terminal states; if any are seed-data fiction,
 * Jacques should flag them manually).
 *
 * Idempotent — safe to re-run.
 *
 * Run with: npx tsx scripts/reset-pipeline-stages.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Reading current pipeline state...\n");

  const before = await db.lead.findMany({
    select: { id: true, firstName: true, lastName: true, company: true, stage: true, dealValue: true },
    orderBy: { stage: "asc" },
  });

  console.log(`Found ${before.length} leads. Current stage distribution:`);
  const stageGroups = before.reduce<Record<string, typeof before>>((acc, l) => {
    const k = String(l.stage);
    (acc[k] ||= []).push(l);
    return acc;
  }, {});
  for (const [stage, leads] of Object.entries(stageGroups)) {
    console.log(`  ${stage}: ${leads.length}`);
    for (const l of leads) {
      console.log(`    - ${l.company} · ${l.firstName} ${l.lastName} · $${l.dealValue?.toLocaleString() ?? 0}`);
    }
  }

  console.log("\nResetting all non-closed leads to PROSPECT...\n");

  const result = await db.lead.updateMany({
    where: {
      stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] },
    },
    data: {
      stage: "PROSPECT",
    },
  });

  console.log(`✓ Updated ${result.count} leads to PROSPECT.`);

  // Confirm FarmMate is now PROSPECT too
  const farmmate = await db.lead.findFirst({
    where: { company: { contains: "FarmMate" } },
    select: { company: true, stage: true, dealValue: true },
  });
  if (farmmate) {
    console.log(`✓ FarmMate now: ${farmmate.company} · ${farmmate.stage} · $${farmmate.dealValue?.toLocaleString() ?? 0}`);
    console.log(`  Will move to QUALIFIED when feasibility questionnaire returns.`);
  }

  // Surface any CLOSED_WON entries so Jacques can flag fiction vs reality
  const closedWon = await db.lead.findMany({
    where: { stage: "CLOSED_WON" },
    select: { company: true, firstName: true, lastName: true, dealValue: true },
  });
  if (closedWon.length > 0) {
    console.log(`\n⚠️  ${closedWon.length} lead(s) currently marked CLOSED_WON — verify these are real:`);
    for (const l of closedWon) {
      console.log(`    - ${l.company} · ${l.firstName} ${l.lastName} · $${l.dealValue?.toLocaleString() ?? 0}`);
    }
    console.log(`  If any are seed fiction (not real revenue), update them manually with Prisma Studio or another script.`);
  }

  console.log("\n✓ Done. Re-run /api/v1/forecast/compute (POST) to refresh the projection.");
  console.log("  Expected new state:");
  console.log("    - All non-closed leads → PROSPECT (including FarmMate at $200K)");
  console.log("    - Forecast projection: ~$292K active × 5% PROSPECT win rate = $14.6K");
  console.log("    - Plus any real CLOSED_WON revenue still on the books");
  console.log("    - This is the brutal truth: nothing is qualified yet. Wave 1 IS the engine.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
