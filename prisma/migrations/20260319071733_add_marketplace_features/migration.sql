/*
  Warnings:

  - A unique constraint covering the columns `[winningBidId]` on the table `LandListing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequence` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('UPCOMING', 'LIVE', 'PAUSED', 'CLOSED', 'SETTLED', 'FAILED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "LeaseSource" AS ENUM ('AUCTION', 'DIRECT', 'NEGOTIATION');

-- DropIndex
DROP INDEX "Bid_listingId_farmerId_status_key";

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "isAutoBid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWinning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "outbidAt" TIMESTAMP(3),
ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LandListing" ADD COLUMN     "auctionStatus" "AuctionStatus" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "autoExtendMinutes" INTEGER DEFAULT 5,
ADD COLUMN     "bidIncrement" DOUBLE PRECISION,
ADD COLUMN     "currentLeaderId" TEXT,
ADD COLUMN     "engagementScore" DOUBLE PRECISION,
ADD COLUMN     "hotnessScore" DOUBLE PRECISION,
ADD COLUMN     "lastBidAt" TIMESTAMP(3),
ADD COLUMN     "marketScore" DOUBLE PRECISION,
ADD COLUMN     "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "winningBidId" TEXT;

-- AlterTable
ALTER TABLE "Lease" ADD COLUMN     "creditApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "escrowStatus" TEXT,
ADD COLUMN     "grossContractValue" DOUBLE PRECISION,
ADD COLUMN     "leaseSource" "LeaseSource" NOT NULL DEFAULT 'AUCTION',
ADD COLUMN     "netOwnerReceivable" DOUBLE PRECISION,
ADD COLUMN     "platformFee" DOUBLE PRECISION,
ADD COLUMN     "riskScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "gatewayFee" DOUBLE PRECISION,
ADD COLUMN     "netAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "platformFee" DOUBLE PRECISION,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT;

-- CreateTable
CREATE TABLE "AuctionEvent" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actorId" TEXT,
    "bidId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuctionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingAnalytics" (
    "listingId" TEXT NOT NULL,
    "demandScore" DOUBLE PRECISION,
    "bidVelocity" DOUBLE PRECISION,
    "conversionScore" DOUBLE PRECISION,
    "avgBidGap" DOUBLE PRECISION,
    "watchers" INTEGER NOT NULL DEFAULT 0,
    "lastActivityAt" TIMESTAMP(3),

    CONSTRAINT "ListingAnalytics_pkey" PRIMARY KEY ("listingId")
);

-- CreateTable
CREATE TABLE "MarketSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuctionEvent_listingId_idx" ON "AuctionEvent"("listingId");

-- CreateIndex
CREATE INDEX "AuctionEvent_createdAt_idx" ON "AuctionEvent"("createdAt");

-- CreateIndex
CREATE INDEX "MarketSubscription_userId_idx" ON "MarketSubscription"("userId");

-- CreateIndex
CREATE INDEX "Bid_listingId_amount_idx" ON "Bid"("listingId", "amount" DESC);

-- CreateIndex
CREATE INDEX "Bid_listingId_createdAt_idx" ON "Bid"("listingId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LandListing_winningBidId_key" ON "LandListing"("winningBidId");

-- CreateIndex
CREATE INDEX "LandListing_auctionStatus_endDate_idx" ON "LandListing"("auctionStatus", "endDate");

-- CreateIndex
CREATE INDEX "LandListing_hotnessScore_idx" ON "LandListing"("hotnessScore");

-- CreateIndex
CREATE INDEX "Lease_riskScore_idx" ON "Lease"("riskScore");

-- CreateIndex
CREATE INDEX "Notification_entityType_entityId_idx" ON "Notification"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "Payment_razorpayOrderId_idx" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "Payment_razorpayPaymentId_idx" ON "Payment"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "LandListing" ADD CONSTRAINT "LandListing_winningBidId_fkey" FOREIGN KEY ("winningBidId") REFERENCES "Bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionEvent" ADD CONSTRAINT "AuctionEvent_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "LandListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionEvent" ADD CONSTRAINT "AuctionEvent_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAnalytics" ADD CONSTRAINT "ListingAnalytics_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "LandListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketSubscription" ADD CONSTRAINT "MarketSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
