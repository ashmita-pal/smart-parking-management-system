import prisma from "../config/prisma.js";

import { BOOKING_STATUS } from "../constants/booking.constants.js";
import { PAYMENT_STATUS } from "../constants/payment.constants.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";

const expireBookings = async () => {
  const expiredBookings = await prisma.booking.findMany({
    where: {
      bookingStatus: BOOKING_STATUS.PENDING_PAYMENT,

      expiresAt: {
        lte: new Date(),
      },
    },

    select: {
      id: true,
      slotId: true,
    },
  });

  if (expiredBookings.length === 0) {
    return {
      processed: 0,
      expired: 0,
    };
  }

  let expiredCount = 0;


  for (const booking of expiredBookings) {
    try {
      await prisma.$transaction(async (tx) => {
        const updatedBooking =
          await tx.booking.updateMany({
            where: {
              id: booking.id,

              bookingStatus:BOOKING_STATUS.PENDING_PAYMENT,
            },

            data: {
              bookingStatus:BOOKING_STATUS.EXPIRED,
            },
          });

        if (updatedBooking.count === 0) {
          return;
        }


        await tx.payment.updateMany({
          where: {
            bookingId: booking.id,

            paymentStatus:
              PAYMENT_STATUS.PENDING,
          },

          data: {
            paymentStatus:
              PAYMENT_STATUS.FAILED,

            failureReason:
              "Booking expired before payment",
          },
        });


        await tx.parkingSlot.updateMany({
          where: {
            id: booking.slotId,

            status:
              SLOT_STATUS.TEMP_RESERVED,
          },

          data: {
            status:
              SLOT_STATUS.AVAILABLE,
          },
        });

        expiredCount++;
      });
    } catch (error) {
      console.error(
        `Failed to expire booking ${booking.id}:`,
        error.message,
      );
    }
  }

  return {
    processed: expiredBookings.length,
    expired: expiredCount,
  };
};

export {
  expireBookings,
};