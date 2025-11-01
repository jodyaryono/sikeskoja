/*
  Warnings:

  - The values [SUPERVISOR,OPERATOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `alamatDinasKesehatan` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `jabatanPengisi` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `namaDinasKesehatan` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `namaPengisi` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `noTelepon` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `questionnaireData` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the column `respondentId` on the `questionnaires` table. All the data in the column will be lost.
  - You are about to drop the `question_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questionnaire_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `respondents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `alamatRumah` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desaKelurahan` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kecamatan` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaKepalaKeluarga` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaPengumpulData` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaPuskesmas` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noUrutBangunan` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noUrutKeluarga` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rt` to the `questionnaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rw` to the `questionnaires` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPERADMIN', 'ADMIN', 'PETUGAS', 'VIEWER', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "questionnaire_answers" DROP CONSTRAINT "questionnaire_answers_questionnaireId_fkey";

-- DropForeignKey
ALTER TABLE "questionnaires" DROP CONSTRAINT "questionnaires_respondentId_fkey";

-- DropIndex
DROP INDEX "questionnaires_respondentId_idx";

-- AlterTable
ALTER TABLE "questionnaires" DROP COLUMN "alamatDinasKesehatan",
DROP COLUMN "email",
DROP COLUMN "jabatanPengisi",
DROP COLUMN "namaDinasKesehatan",
DROP COLUMN "namaPengisi",
DROP COLUMN "noTelepon",
DROP COLUMN "questionnaireData",
DROP COLUMN "respondentId",
ADD COLUMN     "alamatRumah" TEXT NOT NULL,
ADD COLUMN     "anggotaDipasungi" TEXT,
ADD COLUMN     "desaKelurahan" TEXT NOT NULL,
ADD COLUMN     "gangguanJiwaBerat" TEXT,
ADD COLUMN     "jambanKeluarga" TEXT,
ADD COLUMN     "jenisAirMinum" TEXT,
ADD COLUMN     "jenisJamban" TEXT,
ADD COLUMN     "jumlahAnggotaDewasa" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlahAnggotaKeluarga" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlahAnggotaUsia0_11" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlahAnggotaUsia0_15" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlahAnggotaUsia10_54" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlahAnggotaUsia12_59" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "kecamatan" TEXT NOT NULL,
ADD COLUMN     "kodePuskesmas" TEXT,
ADD COLUMN     "namaKepalaKeluarga" TEXT NOT NULL,
ADD COLUMN     "namaPengumpulData" TEXT NOT NULL,
ADD COLUMN     "namaPuskesmas" TEXT NOT NULL,
ADD COLUMN     "namaSupervisor" TEXT,
ADD COLUMN     "noUrutBangunan" TEXT NOT NULL,
ADD COLUMN     "noUrutKeluarga" TEXT NOT NULL,
ADD COLUMN     "obatGangguanJiwa" TEXT,
ADD COLUMN     "rt" TEXT NOT NULL,
ADD COLUMN     "rw" TEXT NOT NULL,
ADD COLUMN     "saranaAirBersih" TEXT,
ADD COLUMN     "tanggalPengumpulan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "question_templates";

-- DropTable
DROP TABLE "questionnaire_answers";

-- DropTable
DROP TABLE "respondents";

-- DropEnum
DROP TYPE "AnswerType";

-- CreateTable
CREATE TABLE "anggota_keluarga" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "noUrut" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "hubunganKeluarga" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "umur" INTEGER NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "statusPerkawinan" TEXT NOT NULL,
    "sedangHamil" TEXT,
    "agama" TEXT NOT NULL,
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "nik" TEXT,
    "tanggalPulid" TIMESTAMP(3),
    "noUrutAnggota" TEXT,
    "usiaAnggota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gangguan_kesehatan" (
    "id" TEXT NOT NULL,
    "anggotaKeluargaId" TEXT NOT NULL,
    "kartuJKN" TEXT,
    "merokok" TEXT,
    "buangAirBesarJamban" TEXT,
    "airBersih" TEXT,
    "diagnosisTB" TEXT,
    "obatTBC6Bulan" TEXT,
    "batukDarah2Minggu" TEXT,
    "diagnosisHipertensi" TEXT,
    "obatHipertensiTeratur" TEXT,
    "pengukuranTekananDarah" TEXT,
    "sistolik" INTEGER,
    "diastolik" INTEGER,
    "kontrasepsiKB" TEXT,
    "melahirkanDiFaskes" TEXT,
    "asiEksklusif" TEXT,
    "imunisasiLengkap" TEXT,
    "pemantauanPertumbuhanBalita" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gangguan_kesehatan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anggota_keluarga_questionnaireId_idx" ON "anggota_keluarga"("questionnaireId");

-- CreateIndex
CREATE INDEX "anggota_keluarga_nama_idx" ON "anggota_keluarga"("nama");

-- CreateIndex
CREATE INDEX "anggota_keluarga_nik_idx" ON "anggota_keluarga"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "gangguan_kesehatan_anggotaKeluargaId_key" ON "gangguan_kesehatan"("anggotaKeluargaId");

-- CreateIndex
CREATE INDEX "gangguan_kesehatan_anggotaKeluargaId_idx" ON "gangguan_kesehatan"("anggotaKeluargaId");

-- CreateIndex
CREATE INDEX "questionnaires_kecamatan_idx" ON "questionnaires"("kecamatan");

-- CreateIndex
CREATE INDEX "questionnaires_kodePuskesmas_idx" ON "questionnaires"("kodePuskesmas");

-- AddForeignKey
ALTER TABLE "anggota_keluarga" ADD CONSTRAINT "anggota_keluarga_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gangguan_kesehatan" ADD CONSTRAINT "gangguan_kesehatan_anggotaKeluargaId_fkey" FOREIGN KEY ("anggotaKeluargaId") REFERENCES "anggota_keluarga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
