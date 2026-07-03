/*
  Warnings:

  - A unique constraint covering the columns `[bookingReference]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingReference` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationHours` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'ACTIVE';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "bookingReference" TEXT NOT NULL,
ADD COLUMN     "durationHours" INTEGER NOT NULL,
ADD COLUMN     "lotId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingReference_key" ON "bookings"("bookingReference");

-- CreateIndex
CREATE INDEX "bookings_lotId_idx" ON "bookings"("lotId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "parking_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
