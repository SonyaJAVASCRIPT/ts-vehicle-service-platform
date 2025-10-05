/*
  Warnings:

  - You are about to drop the column `status` on the `fine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "vehicle-service"."fine" DROP CONSTRAINT "fine_vehicleId_fkey";

-- DropIndex
DROP INDEX "vehicle-service"."vehicle_ownerId_key";

-- AlterTable
ALTER TABLE "fine" DROP COLUMN "status",
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "vehicle-service"."FineStatus";

-- AddForeignKey
ALTER TABLE "fine" ADD CONSTRAINT "fine_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
