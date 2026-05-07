-- CreateTable
CREATE TABLE "resi" (
    "id" UUID NOT NULL,
    "nomor_resi" TEXT NOT NULL,
    "marketplace" TEXT NOT NULL,
    "kurir" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "tanggal" DATE NOT NULL,
    "nama_penerima" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "resi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resi_nomor_resi_idx" ON "resi"("nomor_resi");

-- CreateIndex
CREATE INDEX "resi_status_idx" ON "resi"("status");
