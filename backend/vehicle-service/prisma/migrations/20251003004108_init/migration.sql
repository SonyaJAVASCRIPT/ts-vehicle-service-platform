/*
  Warnings:

  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "vehicle-service"."Vehicle";

-- CreateTable
CREATE TABLE "vehicle" (
    "id" SERIAL NOT NULL,
    "plate" TEXT,
    "brand" TEXT,
    "ownerId" INTEGER,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_ownerId_key" ON "vehicle"("ownerId");
