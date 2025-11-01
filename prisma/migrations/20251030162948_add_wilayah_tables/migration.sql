-- AlterTable
ALTER TABLE "anggota_keluarga" ADD COLUMN     "alamatRumah" TEXT,
ADD COLUMN     "desaKode" TEXT,
ADD COLUMN     "ikutiKepalaKeluarga" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "kabupatenKode" TEXT,
ADD COLUMN     "kecamatanKode" TEXT,
ADD COLUMN     "provinsiKode" TEXT;

-- CreateTable
CREATE TABLE "provinsi" (
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provinsi_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "kabupaten" (
    "kode" TEXT NOT NULL,
    "provinsiKode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kabupaten_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "kecamatan" (
    "kode" TEXT NOT NULL,
    "kabupatenKode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kecamatan_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "desa" (
    "kode" TEXT NOT NULL,
    "kecamatanKode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "desa_pkey" PRIMARY KEY ("kode")
);

-- CreateIndex
CREATE INDEX "provinsi_nama_idx" ON "provinsi"("nama");

-- CreateIndex
CREATE INDEX "kabupaten_provinsiKode_idx" ON "kabupaten"("provinsiKode");

-- CreateIndex
CREATE INDEX "kabupaten_nama_idx" ON "kabupaten"("nama");

-- CreateIndex
CREATE INDEX "kecamatan_kabupatenKode_idx" ON "kecamatan"("kabupatenKode");

-- CreateIndex
CREATE INDEX "kecamatan_nama_idx" ON "kecamatan"("nama");

-- CreateIndex
CREATE INDEX "desa_kecamatanKode_idx" ON "desa"("kecamatanKode");

-- CreateIndex
CREATE INDEX "desa_nama_idx" ON "desa"("nama");

-- CreateIndex
CREATE INDEX "anggota_keluarga_provinsiKode_idx" ON "anggota_keluarga"("provinsiKode");

-- CreateIndex
CREATE INDEX "anggota_keluarga_kabupatenKode_idx" ON "anggota_keluarga"("kabupatenKode");

-- CreateIndex
CREATE INDEX "anggota_keluarga_kecamatanKode_idx" ON "anggota_keluarga"("kecamatanKode");

-- CreateIndex
CREATE INDEX "anggota_keluarga_desaKode_idx" ON "anggota_keluarga"("desaKode");

-- AddForeignKey
ALTER TABLE "kabupaten" ADD CONSTRAINT "kabupaten_provinsiKode_fkey" FOREIGN KEY ("provinsiKode") REFERENCES "provinsi"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kecamatan" ADD CONSTRAINT "kecamatan_kabupatenKode_fkey" FOREIGN KEY ("kabupatenKode") REFERENCES "kabupaten"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desa" ADD CONSTRAINT "desa_kecamatanKode_fkey" FOREIGN KEY ("kecamatanKode") REFERENCES "kecamatan"("kode") ON DELETE CASCADE ON UPDATE CASCADE;
