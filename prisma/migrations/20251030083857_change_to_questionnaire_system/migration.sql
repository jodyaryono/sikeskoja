/*
  Warnings:

  - The values [DOCTOR,NURSE,STAFF] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `diagnoses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lab_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medical_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vital_signs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionnaireStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'SUBMITTED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'SCALE', 'MATRIX');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'SUPERVISOR', 'OPERATOR', 'VIEWER', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "diagnoses" DROP CONSTRAINT "diagnoses_healthRecordId_fkey";

-- DropForeignKey
ALTER TABLE "family_members" DROP CONSTRAINT "family_members_patientId_fkey";

-- DropForeignKey
ALTER TABLE "health_records" DROP CONSTRAINT "health_records_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "health_records" DROP CONSTRAINT "health_records_patientId_fkey";

-- DropForeignKey
ALTER TABLE "lab_results" DROP CONSTRAINT "lab_results_healthRecordId_fkey";

-- DropForeignKey
ALTER TABLE "medical_data" DROP CONSTRAINT "medical_data_healthRecordId_fkey";

-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_healthRecordId_fkey";

-- DropForeignKey
ALTER TABLE "vital_signs" DROP CONSTRAINT "vital_signs_healthRecordId_fkey";

-- DropTable
DROP TABLE "diagnoses";

-- DropTable
DROP TABLE "family_members";

-- DropTable
DROP TABLE "health_records";

-- DropTable
DROP TABLE "lab_results";

-- DropTable
DROP TABLE "medical_data";

-- DropTable
DROP TABLE "medications";

-- DropTable
DROP TABLE "patients";

-- DropTable
DROP TABLE "vital_signs";

-- DropEnum
DROP TYPE "BloodType";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "HealthRecordType";

-- DropEnum
DROP TYPE "RecordStatus";

-- DropEnum
DROP TYPE "Relationship";

-- DropEnum
DROP TYPE "Severity";

-- CreateTable
CREATE TABLE "questionnaires" (
    "id" TEXT NOT NULL,
    "respondentId" TEXT NOT NULL,
    "questionnaireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "QuestionnaireStatus" NOT NULL DEFAULT 'DRAFT',
    "namaDinasKesehatan" TEXT NOT NULL,
    "alamatDinasKesehatan" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kabupatenKota" TEXT NOT NULL,
    "noTelepon" TEXT,
    "email" TEXT,
    "namaPengisi" TEXT NOT NULL,
    "jabatanPengisi" TEXT NOT NULL,
    "questionnaireData" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "questionnaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respondents" (
    "id" TEXT NOT NULL,
    "namaDinasKesehatan" TEXT NOT NULL,
    "kodeDinasKesehatan" TEXT,
    "provinsi" TEXT NOT NULL,
    "kabupatenKota" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kodePos" TEXT,
    "noTelepon" TEXT,
    "email" TEXT,
    "website" TEXT,
    "namaKepala" TEXT,
    "jabatanKepala" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "respondents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_answers" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "questionNumber" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerType" "AnswerType" NOT NULL,
    "answerValue" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_templates" (
    "id" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "questionNumber" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerType" "AnswerType" NOT NULL,
    "options" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questionnaires_respondentId_idx" ON "questionnaires"("respondentId");

-- CreateIndex
CREATE INDEX "questionnaires_questionnaireDate_idx" ON "questionnaires"("questionnaireDate");

-- CreateIndex
CREATE INDEX "questionnaires_createdBy_idx" ON "questionnaires"("createdBy");

-- CreateIndex
CREATE INDEX "questionnaires_status_idx" ON "questionnaires"("status");

-- CreateIndex
CREATE INDEX "questionnaires_provinsi_idx" ON "questionnaires"("provinsi");

-- CreateIndex
CREATE INDEX "questionnaires_kabupatenKota_idx" ON "questionnaires"("kabupatenKota");

-- CreateIndex
CREATE UNIQUE INDEX "respondents_kodeDinasKesehatan_key" ON "respondents"("kodeDinasKesehatan");

-- CreateIndex
CREATE INDEX "respondents_namaDinasKesehatan_idx" ON "respondents"("namaDinasKesehatan");

-- CreateIndex
CREATE INDEX "respondents_provinsi_idx" ON "respondents"("provinsi");

-- CreateIndex
CREATE INDEX "respondents_kabupatenKota_idx" ON "respondents"("kabupatenKota");

-- CreateIndex
CREATE INDEX "questionnaire_answers_questionnaireId_idx" ON "questionnaire_answers"("questionnaireId");

-- CreateIndex
CREATE INDEX "questionnaire_answers_sectionName_idx" ON "questionnaire_answers"("sectionName");

-- CreateIndex
CREATE INDEX "questionnaire_answers_questionNumber_idx" ON "questionnaire_answers"("questionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "question_templates_questionNumber_key" ON "question_templates"("questionNumber");

-- CreateIndex
CREATE INDEX "question_templates_sectionName_idx" ON "question_templates"("sectionName");

-- CreateIndex
CREATE INDEX "question_templates_questionNumber_idx" ON "question_templates"("questionNumber");

-- CreateIndex
CREATE INDEX "question_templates_orderIndex_idx" ON "question_templates"("orderIndex");

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "respondents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_answers" ADD CONSTRAINT "questionnaire_answers_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;
