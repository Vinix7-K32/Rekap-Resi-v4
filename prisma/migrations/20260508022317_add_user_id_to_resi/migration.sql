/*
  Warnings:

  - A unique constraint covering the columns `[user_id,nomor_resi]` on the table `marketplace_resi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,nomor_resi]` on the table `resi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `marketplace_resi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `resi` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "marketplace_resi_nomor_resi_key";

-- DropIndex
DROP INDEX "resi_nomor_resi_key";

-- AlterTable
ALTER TABLE "marketplace_resi" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "resi" ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "marketplace_resi_user_id_idx" ON "marketplace_resi"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_resi_user_id_nomor_resi_key" ON "marketplace_resi"("user_id", "nomor_resi");

-- CreateIndex
CREATE INDEX "resi_user_id_idx" ON "resi"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "resi_user_id_nomor_resi_key" ON "resi"("user_id", "nomor_resi");
