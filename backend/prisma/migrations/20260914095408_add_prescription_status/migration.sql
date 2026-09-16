-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('PENDING', 'DISPENSED');

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "status" "PrescriptionStatus" NOT NULL DEFAULT 'PENDING';
