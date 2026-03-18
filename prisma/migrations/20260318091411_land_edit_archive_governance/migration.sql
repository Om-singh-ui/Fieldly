-- AlterTable
ALTER TABLE "Land" ADD COLUMN     "editCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastEditedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Land_isArchived_idx" ON "Land"("isArchived");
