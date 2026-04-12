-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLOSER', 'VIEWER');

-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'LINKEDIN', 'COLD_OUTREACH', 'PARTNER', 'EVENT', 'INBOUND_CALL');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SOVEREIGN_AI', 'AI_READINESS_360', 'TRANSFORMATION_MANAGEMENT', 'TEDOS');

-- CreateEnum
CREATE TYPE "Vertical" AS ENUM ('LEGAL', 'MEDICAL', 'AUTO', 'TRADES', 'PROPERTY_MANAGEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('US', 'MX', 'CEMAC');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'MXN', 'XAF');

-- CreateEnum
CREATE TYPE "SalesStatus" AS ENUM ('NOT_CONTACTED', 'CONTACTED', 'PROSPECT', 'APPOINTMENT_SCHEDULED', 'PROPOSAL_SENT', 'ACCEPTED', 'CLIENT', 'LOST');

-- CreateEnum
CREATE TYPE "LeadTier" AS ENUM ('TIER_1', 'TIER_2', 'REJECTED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EMAIL_SENT', 'EMAIL_RECEIVED', 'EMAIL_OPENED', 'EMAIL_CLICKED', 'CALL', 'MEETING', 'NOTE', 'STAGE_CHANGE', 'DEAL_ROOM_CREATED', 'DOCUMENT_SENT', 'DOCUMENT_SIGNED', 'PAYMENT_RECEIVED', 'TASK_COMPLETED', 'AUTO_NURTURE', 'WEBSITE_VISIT', 'LINKEDIN_VIEW');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('EMAIL_OPEN', 'EMAIL_CLICK', 'EMAIL_REPLY', 'WEBSITE_VISIT', 'PRICING_PAGE_VIEW', 'CALCULATOR_USE', 'DEAL_ROOM_VIEW', 'LINKEDIN_VIEW', 'CONTACT_FORM_SUBMIT');

-- CreateEnum
CREATE TYPE "OutreachChannel" AS ENUM ('EMAIL', 'LINKEDIN', 'SMS');

-- CreateEnum
CREATE TYPE "SequenceStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'STOPPED');

-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('PENDING', 'SCHEDULED', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "NurtureStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "DealRoomStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'SIGNED', 'PAID', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "title" TEXT,
    "company" TEXT NOT NULL,
    "vertical" "Vertical" NOT NULL,
    "service" "ServiceType" NOT NULL,
    "stage" "PipelineStage" NOT NULL DEFAULT 'PROSPECT',
    "source" "LeadSource" NOT NULL,
    "region" "Region" NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "dealValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sowCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyRetainer" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL DEFAULT 0,
    "grossMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedCloseDate" TIMESTAMP(3),
    "staleDays" INTEGER NOT NULL DEFAULT 0,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],
    "notes" TEXT,
    "referralPartner" TEXT,
    "salesStatus" "SalesStatus" NOT NULL DEFAULT 'NOT_CONTACTED',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "address" TEXT,
    "heatScore" INTEGER NOT NULL DEFAULT 0,
    "tier" "LeadTier" NOT NULL DEFAULT 'UNKNOWN',
    "linkedinUrl" TEXT,
    "enrichmentJson" JSONB,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "automated" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrichment" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "companyRevenue" TEXT,
    "companyEmployees" INTEGER,
    "companyIndustry" TEXT,
    "companyTechStack" TEXT[],
    "recentNews" JSONB,
    "linkedinActivity" JSONB,
    "jobPostings" JSONB,
    "provider" TEXT NOT NULL,
    "rawJson" JSONB NOT NULL,
    "enrichedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrichment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "SignalType" NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dossier" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "intentScore" INTEGER NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "painPoints" TEXT[],
    "recommendedHook" TEXT NOT NULL,
    "recommendedTier" TEXT,
    "estimatedDeal" DOUBLE PRECISION,
    "snapshotJson" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachSequence" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "templateId" TEXT,
    "channel" "OutreachChannel" NOT NULL,
    "status" "SequenceStatus" NOT NULL DEFAULT 'DRAFT',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "pausedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachStep" (
    "id" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "personalizationAnchor" TEXT,
    "cta" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "status" "StepStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "OutreachStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vertical" "Vertical",
    "channel" "OutreachChannel" NOT NULL,
    "promptJson" JSONB NOT NULL,
    "performanceJson" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SequenceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoringWeights" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "weights" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoringWeights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LossReason" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LossReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LookalikeJob" (
    "id" TEXT NOT NULL,
    "sourceLeadId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "LookalikeJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NurtureSequence" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "NurtureStatus" NOT NULL DEFAULT 'SCHEDULED',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "triggerReason" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NurtureSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NurtureStep" (
    "id" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "waitDays" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "NurtureStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealRoom" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "DealRoomStatus" NOT NULL DEFAULT 'DRAFT',
    "accessCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealRoomDocument" (
    "id" TEXT NOT NULL,
    "dealRoomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "url" TEXT,
    "signedAt" TIMESTAMP(3),

    CONSTRAINT "DealRoomDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealRoomPayment" (
    "id" TEXT NOT NULL,
    "dealRoomId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "invoiceNumber" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "DealRoomPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "scores" JSONB,
    "nps" INTEGER,
    "testimonial" TEXT,
    "improvementSuggestions" TEXT,
    "consentTestimonial" BOOLEAN NOT NULL DEFAULT false,
    "consentLogo" BOOLEAN NOT NULL DEFAULT false,
    "consentSocial" BOOLEAN NOT NULL DEFAULT false,
    "consentVideo" BOOLEAN NOT NULL DEFAULT false,
    "consentCaseStudy" BOOLEAN NOT NULL DEFAULT false,
    "referralName" TEXT,
    "referralEmail" TEXT,
    "referralCompany" TEXT,
    "successCreditApplied" BOOLEAN NOT NULL DEFAULT false,
    "socialProofPublished" BOOLEAN NOT NULL DEFAULT false,
    "executiveAlertTriggered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- CreateIndex
CREATE INDEX "Lead_heatScore_idx" ON "Lead"("heatScore");

-- CreateIndex
CREATE INDEX "Lead_assignedToId_idx" ON "Lead"("assignedToId");

-- CreateIndex
CREATE INDEX "Lead_vertical_idx" ON "Lead"("vertical");

-- CreateIndex
CREATE INDEX "Lead_tier_idx" ON "Lead"("tier");

-- CreateIndex
CREATE INDEX "Activity_leadId_idx" ON "Activity"("leadId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE INDEX "Enrichment_leadId_idx" ON "Enrichment"("leadId");

-- CreateIndex
CREATE INDEX "Signal_leadId_idx" ON "Signal"("leadId");

-- CreateIndex
CREATE INDEX "Signal_createdAt_idx" ON "Signal"("createdAt");

-- CreateIndex
CREATE INDEX "Dossier_leadId_idx" ON "Dossier"("leadId");

-- CreateIndex
CREATE INDEX "Dossier_intentScore_idx" ON "Dossier"("intentScore");

-- CreateIndex
CREATE INDEX "OutreachSequence_leadId_idx" ON "OutreachSequence"("leadId");

-- CreateIndex
CREATE INDEX "OutreachSequence_status_idx" ON "OutreachSequence"("status");

-- CreateIndex
CREATE INDEX "OutreachStep_sequenceId_idx" ON "OutreachStep"("sequenceId");

-- CreateIndex
CREATE INDEX "OutreachStep_scheduledFor_idx" ON "OutreachStep"("scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "ScoringWeights_version_key" ON "ScoringWeights"("version");

-- CreateIndex
CREATE INDEX "LookalikeJob_sourceLeadId_idx" ON "LookalikeJob"("sourceLeadId");

-- CreateIndex
CREATE INDEX "NurtureSequence_leadId_idx" ON "NurtureSequence"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "DealRoom_accessCode_key" ON "DealRoom"("accessCode");

-- CreateIndex
CREATE INDEX "DealRoom_leadId_idx" ON "DealRoom"("leadId");

-- CreateIndex
CREATE INDEX "SurveyResponse_leadId_idx" ON "SurveyResponse"("leadId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrichment" ADD CONSTRAINT "Enrichment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachSequence" ADD CONSTRAINT "OutreachSequence_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachStep" ADD CONSTRAINT "OutreachStep_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "OutreachSequence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LookalikeJob" ADD CONSTRAINT "LookalikeJob_sourceLeadId_fkey" FOREIGN KEY ("sourceLeadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NurtureSequence" ADD CONSTRAINT "NurtureSequence_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NurtureStep" ADD CONSTRAINT "NurtureStep_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "NurtureSequence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealRoom" ADD CONSTRAINT "DealRoom_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealRoomDocument" ADD CONSTRAINT "DealRoomDocument_dealRoomId_fkey" FOREIGN KEY ("dealRoomId") REFERENCES "DealRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealRoomPayment" ADD CONSTRAINT "DealRoomPayment_dealRoomId_fkey" FOREIGN KEY ("dealRoomId") REFERENCES "DealRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
