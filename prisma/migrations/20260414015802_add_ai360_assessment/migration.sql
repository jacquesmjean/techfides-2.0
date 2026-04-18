-- CreateEnum
CREATE TYPE "AI360Status" AS ENUM ('DRAFT', 'SUBMITTED', 'ANALYZING', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AI360Maturity" AS ENUM ('LEADING', 'ADVANCING', 'DEVELOPING', 'EMERGING', 'NASCENT');

-- CreateEnum
CREATE TYPE "AI360Domain" AS ENUM ('STRATEGY_LEADERSHIP', 'DATA_INFRASTRUCTURE', 'TECHNOLOGY_ARCHITECTURE', 'OPERATIONS_PROCESSES', 'GOVERNANCE_RISK', 'PEOPLE_CULTURE');

-- CreateEnum
CREATE TYPE "AI360DocCategory" AS ENUM ('STRATEGY', 'PROCESS', 'ARCHITECTURE', 'POLICY', 'OTHER');

-- CreateEnum
CREATE TYPE "AI360Role" AS ENUM ('CLIENT_ADMIN', 'CONTRIBUTOR', 'ANALYST', 'REVIEWER');

-- CreateTable
CREATE TABLE "AI360Assessment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "orgIndustry" "Vertical" NOT NULL DEFAULT 'OTHER',
    "status" "AI360Status" NOT NULL DEFAULT 'DRAFT',
    "accessToken" TEXT NOT NULL,
    "createdById" TEXT,
    "leadId" TEXT,
    "overallScore" DOUBLE PRECISION,
    "maturityLevel" "AI360Maturity",
    "scoringSnapshot" JSONB,
    "executiveSummary" TEXT,
    "narrativeSummary" TEXT,
    "opportunityMap" JSONB,
    "keyRisks" JSONB,
    "priorityMatrix" JSONB,
    "submittedAt" TIMESTAMP(3),
    "analyzedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AI360Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI360Response" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "domain" "AI360Domain" NOT NULL,
    "responderId" TEXT,
    "responderName" TEXT,
    "responderRole" TEXT,
    "selectedOption" INTEGER,
    "score" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AI360Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI360Evidence" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT,
    "domain" "AI360Domain" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AI360Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI360Document" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "category" "AI360DocCategory" NOT NULL,
    "description" TEXT,
    "uploadedById" TEXT,
    "uploaderName" TEXT,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AI360Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI360Member" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AI360Role" NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,

    CONSTRAINT "AI360Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AI360Assessment_accessToken_key" ON "AI360Assessment"("accessToken");

-- CreateIndex
CREATE INDEX "AI360Assessment_status_idx" ON "AI360Assessment"("status");

-- CreateIndex
CREATE INDEX "AI360Assessment_accessToken_idx" ON "AI360Assessment"("accessToken");

-- CreateIndex
CREATE INDEX "AI360Assessment_createdById_idx" ON "AI360Assessment"("createdById");

-- CreateIndex
CREATE INDEX "AI360Response_assessmentId_idx" ON "AI360Response"("assessmentId");

-- CreateIndex
CREATE INDEX "AI360Response_domain_idx" ON "AI360Response"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "AI360Response_assessmentId_questionId_responderId_key" ON "AI360Response"("assessmentId", "questionId", "responderId");

-- CreateIndex
CREATE INDEX "AI360Evidence_assessmentId_idx" ON "AI360Evidence"("assessmentId");

-- CreateIndex
CREATE INDEX "AI360Evidence_domain_idx" ON "AI360Evidence"("domain");

-- CreateIndex
CREATE INDEX "AI360Document_assessmentId_idx" ON "AI360Document"("assessmentId");

-- CreateIndex
CREATE INDEX "AI360Document_category_idx" ON "AI360Document"("category");

-- CreateIndex
CREATE UNIQUE INDEX "AI360Member_accessToken_key" ON "AI360Member"("accessToken");

-- CreateIndex
CREATE INDEX "AI360Member_assessmentId_idx" ON "AI360Member"("assessmentId");

-- CreateIndex
CREATE INDEX "AI360Member_accessToken_idx" ON "AI360Member"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "AI360Member_assessmentId_email_key" ON "AI360Member"("assessmentId", "email");

-- AddForeignKey
ALTER TABLE "AI360Response" ADD CONSTRAINT "AI360Response_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "AI360Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI360Evidence" ADD CONSTRAINT "AI360Evidence_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "AI360Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI360Document" ADD CONSTRAINT "AI360Document_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "AI360Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI360Member" ADD CONSTRAINT "AI360Member_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "AI360Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
