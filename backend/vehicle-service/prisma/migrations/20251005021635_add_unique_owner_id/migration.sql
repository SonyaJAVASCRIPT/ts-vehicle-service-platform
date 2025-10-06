/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vehicle_ownerId_key" ON "vehicle"("ownerId");
