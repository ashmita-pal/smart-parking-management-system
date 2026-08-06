/*
  Warnings:

  - You are about to drop the column `qrCode` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qrToken]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bookings_qrCode_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "qrCode",
ADD COLUMN     "qrToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_qrToken_key" ON "bookings"("qrToken");

-- CreateIndex
CREATE INDEX "bookings_bookingStatus_idx" ON "bookings"("bookingStatus");
