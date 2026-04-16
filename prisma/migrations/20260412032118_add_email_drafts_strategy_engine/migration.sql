-- CreateEnum
CREATE TYPE "EmailDraftStatus" AS ENUM ('DRAFT', 'SENT', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "StrategyAngle" AS ENUM ('STRATEGIC_ALIGNMENT', 'COST_RECOVERY', 'AEGIS_GOVERNANCE', 'SUBSCRIPTION_REDUCTION');

-- CreateTable
CREATE TABLE "EmailDraft" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "outlookDraftId" TEXT,
    "outlookMessageId" TEXT,
    "status" "EmailDraftStatus" NOT NULL DEFAULT 'DRAFT',
    "batchDate" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "strategyAngle" "StrategyAngle" NOT NULL,
    "sequenceStep" INTEGER NOT NULL,
    "pivotedFrom" "StrategyAngle",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachConfig" (
    "id" TEXT NOT NULL,
    "dailyDraftLimit" INTEGER NOT NULL DEFAULT 50,
    "dailyTier2Split" INTEGER NOT NULL DEFAULT 25,
    "dailyTier1Split" INTEGER NOT NULL DEFAULT 25,
    "heatScoreThreshold" INTEGER NOT NULL DEFAULT 40,
    "pivotAfterStep" INTEGER NOT NULL DEFAULT 3,
    "scheduleHour" INTEGER NOT NULL DEFAULT 8,
    "scheduleMinute" INTEGER NOT NULL DEFAULT 0,
    "scheduleDays" TEXT NOT NULL DEFAULT '1,2,3,4,5',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailDraft_leadId_idx" ON "EmailDraft"("leadId");

-- CreateIndex
CREATE INDEX "EmailDraft_batchDate_idx" ON "EmailDraft"("batchDate");

-- CreateIndex
CREATE INDEX "EmailDraft_status_idx" ON "EmailDraft"("status");

-- CreateIndex
CREATE INDEX "EmailDraft_strategyAngle_idx" ON "EmailDraft"("strategyAngle");

-- AddForeignKey
ALTER TABLE "EmailDraft" ADD CONSTRAINT "EmailDraft_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
