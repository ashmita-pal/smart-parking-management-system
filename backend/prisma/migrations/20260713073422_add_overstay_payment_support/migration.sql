/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BOOKING', 'OVERSTAY', 'REFUND');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'OVERSTAY_PAYMENT_PENDING';

-- DropIndex
DROP INDEX "payments_bookingId_key";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "overstayAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "overstayMinutes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "parking_lots" ADD COLUMN     "gracePeriodMinutes" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "overstayRate" DECIMAL(65,30) NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "description" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'BOOKING',
ADD COLUMN     "refundAmount" DECIMAL(65,30) DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_qrCode_key" ON "bookings"("qrCode");

-- CreateIndex
CREATE INDEX "bookings_bookingStatus_endTime_idx" ON "bookings"("bookingStatus", "endTime");

-- CreateIndex
CREATE INDEX "payments_bookingId_paymentType_idx" ON "payments"("bookingId", "paymentType");

-- CreateIndex
CREATE INDEX "payments_paymentStatus_idx" ON "payments"("paymentStatus");

-- CreateIndex
CREATE INDEX "payments_paymentType_idx" ON "payments"("paymentType");
