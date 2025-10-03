-- CreateEnum
CREATE TYPE "FineStatus" AS ENUM ('UNPAID', 'PAID');

-- AlterTable
ALTER TABLE "fine" ADD COLUMN     "status" "FineStatus" NOT NULL DEFAULT 'UNPAID';
