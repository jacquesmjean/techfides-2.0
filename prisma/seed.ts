/**
 * TechFides 2.0 — Database Seed Script
 *
 * Imports the existing seed data from src/lib/gse/data.ts into PostgreSQL
 * via Prisma. Maps the TypeScript types (lowercase string unions) to the
 * Prisma enums (UPPERCASE).
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient, PipelineStage, LeadSource, ServiceType, Vertical, Region, Currency, SalesStatus, LeadTier } from "@prisma/client";
import { SEED_LEADS } from "../src/lib/gse/data";

const prisma = new PrismaClient();

// Map lowercase-hyphenated string unions to Prisma SCREAMING_SNAKE enums
const stageMap: Record<string, PipelineStage> = {
  prospect: "PROSPECT",
  qualified: "QUALIFIED",
  proposal: "PROPOSAL",
  negotiation: "NEGOTIATION",
  "closed-won": "CLOSED_WON",
  "closed-lost": "CLOSED_LOST",
};

const sourceMap: Record<string, LeadSource> = {
  website: "WEBSITE",
  referral: "REFERRAL",
  linkedin: "LINKEDIN",
  "cold-outreach": "COLD_OUTREACH",
  partner: "PARTNER",
  event: "EVENT",
  "inbound-call": "INBOUND_CALL",
};

const serviceMap: Record<string, ServiceType> = {
  "sovereign-ai": "SOVEREIGN_AI",
  "ai-readiness-360": "AI_READINESS_360",
  "transformation-management": "TRANSFORMATION_MANAGEMENT",
  aegis: "AEGIS",
};

const verticalMap: Record<string, Vertical> = {
  legal: "LEGAL",
  medical: "MEDICAL",
  auto: "AUTO",
  trades: "TRADES",
  "property-management": "PROPERTY_MANAGEMENT",
  other: "OTHER",
};

const regionMap: Record<string, Region> = {
  us: "US",
  mx: "MX",
  cemac: "CEMAC",
};

const salesStatusMap: Record<string, SalesStatus> = {
  "not-contacted": "NOT_CONTACTED",
  contacted: "CONTACTED",
  prospect: "PROSPECT",
  "appointment-scheduled": "APPOINTMENT_SCHEDULED",
  "proposal-sent": "PROPOSAL_SENT",
  accepted: "ACCEPTED",
  client: "CLIENT",
  lost: "LOST",
};

async function main() {
  console.log("Seeding database with existing GSE seed data...");

  // Create admin users
  const adminUser = await prisma.user.upsert({
    where: { email: "engage@techfides.com" },
    update: {},
    create: {
      email: "engage@techfides.com",
      name: "TechFides Admin",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "jacques.jean@techfides.com" },
    update: {},
    create: {
      email: "jacques.jean@techfides.com",
      name: "Jacques Jean",
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin users created: engage@ and jacques.jean@`);

  // Seed leads
  let leadsCreated = 0;
  for (const seed of SEED_LEADS) {
    const stage = stageMap[seed.stage];
    if (!stage) {
      console.warn(`Skipping lead ${seed.id} - unknown stage: ${seed.stage}`);
      continue;
    }

    await prisma.lead.upsert({
      where: { email: seed.contact.email },
      update: {},
      create: {
        firstName: seed.contact.firstName,
        lastName: seed.contact.lastName,
        email: seed.contact.email,
        phone: seed.contact.phone,
        title: seed.contact.title,
        company: seed.contact.company,
        vertical: verticalMap[seed.vertical] ?? "OTHER",
        service: serviceMap[seed.service] ?? "SOVEREIGN_AI",
        stage,
        source: sourceMap[seed.source] ?? "WEBSITE",
        region: regionMap[seed.region] ?? "US",
        currency: (seed.currency as Currency) ?? "USD",
        dealValue: seed.dealValue,
        sowCost: seed.sowCost,
        monthlyRetainer: seed.monthlyRetainer,
        probability: seed.probability,
        grossMargin: seed.grossMargin,
        expectedCloseDate: new Date(seed.expectedCloseDate),
        staleDays: seed.staleDays,
        lastActivity: new Date(seed.lastActivity),
        tags: seed.tags,
        notes: seed.notes,
        salesStatus: salesStatusMap[seed.salesStatus] ?? "NOT_CONTACTED",
        lat: seed.location.lat,
        lng: seed.location.lng,
        city: seed.location.city,
        state: seed.location.state,
        zip: seed.location.zip,
        address: seed.location.address,
        heatScore: seed.heatScore,
        tier: "UNKNOWN" as LeadTier,
        assignedToId: adminUser.id,
        createdAt: new Date(seed.createdAt),
      },
    });
    leadsCreated++;
  }
  console.log(`✓ ${leadsCreated} leads seeded`);

  // Seed initial scoring weights
  await prisma.scoringWeights.upsert({
    where: { version: 1 },
    update: {},
    create: {
      version: 1,
      active: true,
      notes: "Initial scoring weights from blueprint",
      weights: {
        EMAIL_REPLY: 30,
        EMAIL_OPEN_REPEAT: 10,
        PRICING_PAGE_VIEW: 15,
        CALCULATOR_USE: 20,
        DEAL_ROOM_VIEW: 25,
        CONTACT_FORM_SUBMIT: 40,
        WEBSITE_VISIT: 5,
        LINKEDIN_VIEW: 8,
      },
    },
  });
  console.log("✓ Initial scoring weights created");

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
