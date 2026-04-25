/**
 * One-time script to add real, in-motion deals to the database.
 *
 * After auditing the in-memory GSE store, only one entry is a real
 * deal in motion:
 *   - FarmMate Ghana ($200K, Proposal stage, client-paced)
 *
 * The rest of the entries (MIDA, Columbus, BCA, ECERES, Eric/Gartner,
 * GSA) are networking, partnerships, or vendor conversations — they
 * do not belong in Pipeline.
 *
 * Run with: npx tsx scripts/add-real-deals.ts
 *
 * Idempotent: uses upsert on email, so running twice does not duplicate.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Adding real in-motion deals to the database...\n");

  // ─────────────────────────────────────────────────────────────────
  // FarmMate Ghana — $200K, Transformation Management, Proposal stage
  //
  // Status from Jacques: real opportunity. Client-paced. Feasibility
  // study for tomato processing in Ghana. Waiting on client to move
  // forward.
  //
  // Email is a placeholder until Jacques pulls the real contact from
  // his Outlook. The script updates by email so when you re-run with
  // the correct email, the record updates cleanly.
  // ─────────────────────────────────────────────────────────────────
  const farmmate = await db.lead.upsert({
    where: { email: "ceo@farmmate-ghana.example.com" },
    update: {
      firstName: "FarmMate",
      lastName: "CEO",
      company: "FarmMate Agri-Processing",
      title: "Chief Executive Officer",
      stage: "PROPOSAL",
      dealValue: 200_000,
      service: "TRANSFORMATION_MANAGEMENT",
      vertical: "OTHER",
      region: "CEMAC", // Ghana — using CEMAC as nearest enum value
      source: "REFERRAL",
      tier: "TIER_2",
      heatScore: 48,
      staleDays: 30,
      city: "Accra",
    },
    create: {
      firstName: "FarmMate",
      lastName: "CEO",
      email: "ceo@farmmate-ghana.example.com",
      company: "FarmMate Agri-Processing",
      title: "Chief Executive Officer",
      stage: "PROPOSAL",
      dealValue: 200_000,
      service: "TRANSFORMATION_MANAGEMENT",
      vertical: "OTHER",
      region: "CEMAC",
      source: "REFERRAL",
      tier: "TIER_2",
      heatScore: 48,
      staleDays: 30,
      city: "Accra",
    },
  });
  console.log(`✓ FarmMate Ghana: ${farmmate.id} (${farmmate.stage}, $${farmmate.dealValue.toLocaleString()})`);

  // Log an Activity entry so the deal has a recognizable history
  await db.activity.create({
    data: {
      leadId: farmmate.id,
      type: "STAGE_CHANGE",
      title: "Deal moved to Proposal — feasibility study scoped",
      description: "FarmMate evaluating tomato processing project in Ghana. TechFides delivered initial feasibility framework. Waiting on client to confirm scope and timing.",
      automated: false,
    },
  });
  console.log(`  + Activity logged: stage change to PROPOSAL`);

  console.log("\n✓ Done. Re-run /api/v1/forecast/compute to see updated projection.");
  console.log("  Expected: ~$113K projected (was $33K), gap -$387K.");

  // Reminder to clean up old fake leads if any made it into the DB
  console.log("\n⚠️  Reminder: the following are NOT deals and should not be in Pipeline:");
  console.log("    - MIDA Advisors / ABC Gabon (relationship only)");
  console.log("    - City of Columbus, OH (networking only)");
  console.log("    - BCA Leadership Sierra Leone (questionnaire pending, no commitment)");
  console.log("    - ECERES Haiti (networking only)");
  console.log("    - Eric Jang / Gartner (vendor selling TO us)");
  console.log("    - GSA Federal Channel (long-term partnership pursuit, not a single deal)");
  console.log("  These should live in a Relationships / Nurture module, not Pipeline.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
