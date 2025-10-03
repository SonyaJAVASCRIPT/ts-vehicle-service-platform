-- CreateTable
CREATE TABLE "fine" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "fine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fine" ADD CONSTRAINT "fine_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
