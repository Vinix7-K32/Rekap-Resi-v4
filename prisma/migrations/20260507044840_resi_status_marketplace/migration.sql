/*
  Warnings:

  - The `status` column on the `resi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nomor_resi]` on the table `resi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ResiStatus" AS ENUM ('Menunggu', 'Diterima', 'Selesai');

-- DropIndex
DROP INDEX "resi_nomor_resi_idx";

-- AlterTable
ALTER TABLE "resi" DROP COLUMN "status",
ADD COLUMN     "status" "ResiStatus" NOT NULL DEFAULT 'Diterima';

-- CreateTable
CREATE TABLE "marketplace_resi" (
    "id" UUID NOT NULL,
    "nomor_resi" TEXT NOT NULL,
    "marketplace" TEXT NOT NULL,
    "status" "ResiStatus" NOT NULL DEFAULT 'Menunggu',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "marketplace_resi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_resi_nomor_resi_key" ON "marketplace_resi"("nomor_resi");

-- CreateIndex
CREATE INDEX "marketplace_resi_status_idx" ON "marketplace_resi"("status");

-- CreateIndex
CREATE UNIQUE INDEX "resi_nomor_resi_key" ON "resi"("nomor_resi");

-- CreateIndex
CREATE INDEX "resi_status_idx" ON "resi"("status");
