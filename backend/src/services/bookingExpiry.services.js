import prisma from "../config/prisma.js";
import { BOOKING_STATUS } from "../constants/booking.constants.js";
import { PAYMENT_STATUS } from "../constants/payment.constants.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";

const expireBookings = async () => {
  const now = new Date();

  // =========================================================
  // 1. FIND UNPAID BOOKINGS WHOSE PAYMENT WINDOW EXPIRED
  // =========================================================

  const unpaidExpiredBookings = await prisma.booking.findMany({
    where: {
      bookingStatus: BOOKING_STATUS.PENDING_PAYMENT,
      expiresAt: {
        lte: now,
      },
    },

    select: {
      id: true,
      slotId: true,
    },
  });

  // =========================================================
  // 2. FIND CONFIRMED BOOKINGS WHERE USER NEVER CHECKED IN
  // =========================================================

  const noShowBookings = await prisma.booking.findMany({
    where: {
      bookingStatus: BOOKING_STATUS.CONFIRMED,

      // User never checked in
      entryTime: null,

      // Booking period has ended
      endTime: {
        lte: now,
      },
    },

    select: {
      id: true,
      slotId: true,
    },
  });

  // =========================================================
  // 3. FIND OLD EXPIRED BOOKINGS WITH STALE RESERVED SLOTS
  // =========================================================
  //
  // These are historical records created before no-show
  // cleanup existed.
  //
  // Example:
  //
  // Booking = EXPIRED
  // entryTime = null
  // endTime = already passed
  // Slot = RESERVED
  //
  // The booking doesn't need another status transition.
  // We only need to repair the slot.
  //

  const staleExpiredBookings = await prisma.booking.findMany({
    where: {
      bookingStatus: BOOKING_STATUS.EXPIRED,
      entryTime: null,
      endTime: {
        lte: now,
      },
    },

    select: {
      id: true,
      slotId: true,
    },
  });

  const totalProcessed =
    unpaidExpiredBookings.length +
    noShowBookings.length +
    staleExpiredBookings.length;

  if (totalProcessed === 0) {
    return {
      processed: 0,
      expired: 0,
      repaired: 0,
    };
  }

  let expiredCount = 0;
  let repairedCount = 0;

  // =========================================================
  // HELPER
  // =========================================================
  //
  // Check whether another booking is currently using or
  // currently reserving this physical slot.
  //
  // IMPORTANT:
  // We do NOT check for every future booking.
  //
  // A future booking such as:
  //
  // 14:00 -> 16:00
  //
  // should not prevent us from releasing a slot after a
  // no-show booking that ended at:
  //
  // 12:00
  //
  // The availability system handles future time-based
  // bookings separately.
  //

  const hasCurrentSlotBooking = async (tx, bookingId, slotId) => {
    const currentBooking = await tx.booking.findFirst({
      where: {
        id: {
          not: bookingId,
        },

        slotId,

        bookingStatus: {
          in: [
            BOOKING_STATUS.PENDING_PAYMENT,
            BOOKING_STATUS.CONFIRMED,
            BOOKING_STATUS.ACTIVE,
            BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING,
          ],
        },

        // Another booking must currently be active in time.
        startTime: {
          lte: now,
        },

        endTime: {
          gt: now,
        },
      },

      select: {
        id: true,
        bookingStatus: true,
      },
    });

    return Boolean(currentBooking);
  };

  // =========================================================
  // 4. PROCESS PENDING_PAYMENT EXPIRATIONS
  // =========================================================

  for (const booking of unpaidExpiredBookings) {
    try {
      await prisma.$transaction(async (tx) => {
        // ---------------------------------------------------
        // Expire booking only if it is still pending payment
        // ---------------------------------------------------

        const updatedBooking = await tx.booking.updateMany({
          where: {
            id: booking.id,
            bookingStatus: BOOKING_STATUS.PENDING_PAYMENT,
          },

          data: {
            bookingStatus: BOOKING_STATUS.EXPIRED,
          },
        });

        // Another process already handled this booking
        if (updatedBooking.count === 0) {
          return;
        }

        // ---------------------------------------------------
        // Mark pending payment as failed
        // ---------------------------------------------------

        await tx.payment.updateMany({
          where: {
            bookingId: booking.id,
            paymentStatus: PAYMENT_STATUS.PENDING,
          },

          data: {
            paymentStatus: PAYMENT_STATUS.FAILED,
            failureReason: "Booking expired before payment",
          },
        });

        // ---------------------------------------------------
        // Release temporary reservation
        // ---------------------------------------------------

        await tx.parkingSlot.updateMany({
          where: {
            id: booking.slotId,
            status: SLOT_STATUS.TEMP_RESERVED,
          },

          data: {
            status: SLOT_STATUS.AVAILABLE,
          },
        });

        expiredCount++;
      });
    } catch (error) {
      console.error(
        `Failed to expire unpaid booking ${booking.id}:`,
        error.message,
      );
    }
  }

  // =========================================================
  // 5. PROCESS CONFIRMED NO-SHOW BOOKINGS
  // =========================================================

  for (const booking of noShowBookings) {
    try {
      await prisma.$transaction(async (tx) => {
        // ---------------------------------------------------
        // Guarded update
        // ---------------------------------------------------
        //
        // If the user checked in between the initial query
        // and this transaction, this affects zero rows.
        //

        const updatedBooking = await tx.booking.updateMany({
          where: {
            id: booking.id,
            bookingStatus: BOOKING_STATUS.CONFIRMED,
            entryTime: null,
          },

          data: {
            bookingStatus: BOOKING_STATUS.EXPIRED,
          },
        });

        if (updatedBooking.count === 0) {
          return;
        }

        // ---------------------------------------------------
        // Check whether another booking currently uses slot
        // ---------------------------------------------------

        const anotherCurrentBooking = await hasCurrentSlotBooking(
          tx,
          booking.id,
          booking.slotId,
        );

        // ---------------------------------------------------
        // Release RESERVED slot
        // ---------------------------------------------------
        //
        // Only release if another current booking isn't using
        // the slot.
        //
        // Also only change RESERVED.
        //
        // Never turn:
        //
        // OCCUPIED     -> AVAILABLE
        // MAINTENANCE  -> AVAILABLE
        //

        if (!anotherCurrentBooking) {
          await tx.parkingSlot.updateMany({
            where: {
              id: booking.slotId,
              status: SLOT_STATUS.RESERVED,
            },

            data: {
              status: SLOT_STATUS.AVAILABLE,
            },
          });
        }

        expiredCount++;
      });
    } catch (error) {
      console.error(
        `Failed to expire no-show booking ${booking.id}:`,
        error.message,
      );
    }
  }

  // =========================================================
  // 6. REPAIR HISTORICAL EXPIRED BOOKINGS
  // =========================================================

  for (const booking of staleExpiredBookings) {
    try {
      await prisma.$transaction(async (tx) => {
        // ---------------------------------------------------
        // Check whether another booking currently uses slot
        // ---------------------------------------------------

        const anotherCurrentBooking = await hasCurrentSlotBooking(
          tx,
          booking.id,
          booking.slotId,
        );

        if (anotherCurrentBooking) {
          return;
        }

        // ---------------------------------------------------
        // Repair stale RESERVED slot
        // ---------------------------------------------------

        const releasedSlot = await tx.parkingSlot.updateMany({
          where: {
            id: booking.slotId,
            status: SLOT_STATUS.RESERVED,
          },

          data: {
            status: SLOT_STATUS.AVAILABLE,
          },
        });

        if (releasedSlot.count > 0) {
          repairedCount++;
        }
      });
    } catch (error) {
      console.error(
        `Failed to repair expired booking ${booking.id}:`,
        error.message,
      );
    }
  }

  // =========================================================
  // 7. RETURN JOB RESULT
  // =========================================================

  return {
    processed: totalProcessed,
    expired: expiredCount,
    repaired: repairedCount,
  };
};

export { expireBookings };