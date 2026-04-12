-- CreateEnum
CREATE TYPE "ClientAccountStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DEACTIVATED', 'CHURNED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED');

-- AlterEnum
ALTER TYPE "ProjectUpdateType" ADD VALUE 'CLIENT_SIGNOFF';

-- CreateTable
CREATE TABLE "ClientAccount" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "tier" TEXT NOT NULL,
    "service" "ServiceType" NOT NULL,
    "status" "ClientAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "retainerAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retainerStart" TIMESTAMP(3),
    "retainerEnd" TIMESTAMP(3),
    "leadId" TEXT,
    "projectId" TEXT,
    "notes" TEXT,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSignoff" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "satisfaction" INTEGER,
    "feedback" TEXT,
    "signature" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "ClientSignoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "clientAccountId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "category" TEXT,
    "assignedTo" TEXT,
    "assignedEmail" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "hoursSpent" DOUBLE PRECISION,
    "clientRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccount_email_key" ON "ClientAccount"("email");

-- CreateIndex
CREATE INDEX "ClientAccount_status_idx" ON "ClientAccount"("status");

-- CreateIndex
CREATE INDEX "ClientAccount_email_idx" ON "ClientAccount"("email");

-- CreateIndex
CREATE INDEX "ClientSignoff_projectId_idx" ON "ClientSignoff"("projectId");

-- CreateIndex
CREATE INDEX "SupportTicket_clientAccountId_idx" ON "SupportTicket"("clientAccountId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicket_priority_idx" ON "SupportTicket"("priority");

-- CreateIndex
CREATE INDEX "SupportTicket_assignedTo_idx" ON "SupportTicket"("assignedTo");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
