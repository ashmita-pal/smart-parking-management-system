import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";
import { BOOKING_STATUS } from "../constants/booking.constants.js";
import { buildBookingFilters } from "../helpers/build-booking-fliters.js";

const createBooking = async (
  userId,
  { slotId, vehicleId, startTime, endTime },
) => {
  // ==================================================
  // VALIDATE DATE/TIME
  // ==================================================

  const requestedStart = new Date(startTime);
  const requestedEnd = new Date(endTime);

  if (
    Number.isNaN(requestedStart.getTime()) ||
    Number.isNaN(requestedEnd.getTime())
  ) {
    throw new ApiError(400, "Invalid start time or end time");
  }

  if (requestedEnd <= requestedStart) {
    throw new ApiError(400, "End time must be after start time");
  }

  // ==================================================
  // VALIDATE VEHICLE
  // ==================================================

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      vehicleNumber: true,
      vehicleType: true,
    },
  });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  if (vehicle.userId !== userId) {
    throw new ApiError(
      403,
      "You are not authorized to use this vehicle",
    );
  }

  // ==================================================
  // VALIDATE PARKING SLOT
  // ==================================================

  const slot = await prisma.parkingSlot.findFirst({
    where: {
      id: slotId,
      deletedAt: null,
    },
    include: {
      lot: {
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
          isActive: true,
          deletedAt: true,
          pricePerHour: true,
        },
      },
    },
  });

  if (!slot) {
    throw new ApiError(404, "Parking slot not found");
  }

  // ==================================================
  // VALIDATE PARKING LOT
  // ==================================================

  if (!slot.lot || slot.lot.deletedAt) {
    throw new ApiError(404, "Parking lot not found");
  }

  if (!slot.lot.isActive) {
    throw new ApiError(
      409,
      "Parking lot is currently inactive",
    );
  }

  // ==================================================
  // VEHICLE TYPE VS SLOT TYPE
  // ==================================================

  if (vehicle.vehicleType !== slot.slotType) {
    throw new ApiError(
      400,
      `${slot.slotType} slot cannot be booked for ${vehicle.vehicleType} vehicle`,
    );
  }

  // ==================================================
  // CALCULATE DURATION
  // ==================================================

  const durationMilliseconds =
    requestedEnd.getTime() - requestedStart.getTime();

  const actualDurationHours =
    durationMilliseconds / (60 * 60 * 1000);

  if (actualDurationHours <= 0) {
    throw new ApiError(
      400,
      "Booking duration must be greater than zero",
    );
  }

  // Round UP to the next full hour for billing
  const durationHours = Math.ceil(actualDurationHours);

  // ==================================================
  // CALCULATE AMOUNT
  // ==================================================

  const totalAmount =
    slot.lot.pricePerHour.toNumber() * durationHours;

  // ==================================================
  // BOOKING EXPIRY
  // ==================================================

  /*
   * The booking gets 10 minutes to complete payment.
   * If payment is not completed, the booking can later
   * be expired by the existing booking-expiry process.
   */

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  );

  // ==================================================
  // BOOKING REFERENCE
  // ==================================================

  const bookingReference = `BK-${Date.now()}`;

  // ==================================================
  // CREATE BOOKING
  // ==================================================

  const booking = await prisma.$transaction(async (tx) => {
    // ----------------------------------------------
    // CHECK FOR OVERLAPPING BOOKINGS
    // ----------------------------------------------

    const conflictingBooking = await tx.booking.findFirst({
      where: {
        slotId,

        bookingStatus: {
          in: [
            BOOKING_STATUS.PENDING_PAYMENT,
            BOOKING_STATUS.CONFIRMED,
            BOOKING_STATUS.ACTIVE,
            BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING,
          ],
        },

        startTime: {
          lt: requestedEnd,
        },

        endTime: {
          gt: requestedStart,
        },
      },

      select: {
        id: true,
      },
    });

    if (conflictingBooking) {
      throw new ApiError(
        409,
        "Parking slot is no longer available for the selected time.",
      );
    }

    // ----------------------------------------------
    // TEMPORARILY RESERVE SLOT
    // ----------------------------------------------

    const reservedSlot = await tx.parkingSlot.updateMany({
      where: {
        id: slotId,
        status: SLOT_STATUS.AVAILABLE,
        deletedAt: null,
      },

      data: {
        status: SLOT_STATUS.TEMP_RESERVED,
      },
    });

    if (reservedSlot.count === 0) {
      throw new ApiError(
        409,
        "Parking slot is no longer available. Please choose another slot.",
      );
    }

    // ----------------------------------------------
    // CREATE BOOKING
    // ----------------------------------------------

    const createdBooking = await tx.booking.create({
      data: {
        userId,
        vehicleId,
        lotId: slot.lot.id,
        slotId,

        bookingReference,

        // Billable duration
        durationHours,

        // Exact requested times are still preserved
        startTime: requestedStart,
        endTime: requestedEnd,

        // Amount is based on billable hours
        totalAmount,

        bookingStatus: BOOKING_STATUS.PENDING_PAYMENT,

        expiresAt,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
            vehicleType: true,
          },
        },

        slot: {
          select: {
            id: true,
            slotNumber: true,
            floorNumber: true,
            slotType: true,
            status: true,
          },
        },

        lot: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
          },
        },
      },
    });

    return createdBooking;
  });

  return booking;
};

const getMyBookings = async (userId, filters) => {
  let {
    page = 1,
    limit = 10,
    search,
    lotId,
    from,
    to,
    status,
    paymentStatus,
    sort,
  } = filters;

  page = Number(page);
  limit = Number(limit);

  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  limit = Math.min(limit, 100);

  const skip = (page - 1) * limit;

  const where = buildBookingFilters({
    userId,
    search,
    lotId,
    from,
    to,
    status,
    paymentStatus,
  });

  const [totalRecords, filteredRecords] = await prisma.$transaction([
    prisma.booking.count({
      where,
    }),
    prisma.booking.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },

      include: {
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
            vehicleType: true,
          },
        },

        slot: {
          select: {
            id: true,
            slotNumber: true,
            floorNumber: true,
          },
        },

        lot: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },

        payments: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            amount: true,
            paymentType: true,
            paymentStatus: true,
            paymentMethod: true,
            paidAt: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  return {
    filteredRecords,

    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      hasNextPage: page * limit < totalRecords,
      hasPreviousPage: page > 1,
    },
  };
};

const getBookingById = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    include: {
      vehicle: {
        select: {
          id: true,
          vehicleNumber: true,
          vehicleType: true,
        },
      },

      slot: {
        select: {
          id: true,
          slotNumber: true,
          floorNumber: true,
          slotType: true,
          status: true,
        },
      },

      lot: {
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
        },
      },

      payments: {
        select: {
          paymentStatus: true,
          amount: true,
          currency: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

const cancelBooking = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    select: {
      id: true,
      slotId: true,
      bookingStatus: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.bookingStatus === "CANCELLED") {
    throw new ApiError(409, "Booking is already cancelled");
  }

  if (booking.bookingStatus === "COMPLETED") {
    throw new ApiError(409, "Completed bookings cannot be cancelled");
  }

  if (booking.bookingStatus === "EXPIRED") {
    throw new ApiError(409, "Expired bookings cannot be cancelled");
  }

  if (booking.bookingStatus === "ACTIVE") {
    throw new ApiError(409, "Active bookings cannot be cancelled");
  }

  const cancelledBooking = await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        bookingStatus: "CANCELLED",
      },

      include: {
        vehicle: {
          select: {
            vehicleNumber: true,
            vehicleType: true,
          },
        },

        slot: {
          select: {
            slotNumber: true,
            floorNumber: true,
          },
        },

        lot: {
          select: {
            name: true,
            city: true,
          },
        },
      },
    });

    await tx.parkingSlot.update({
      where: {
        id: booking.slotId,
      },

      data: {
        status: SLOT_STATUS.AVAILABLE,
      },
    });

    return updatedBooking;
  });

  return cancelledBooking;
};

const checkIn = async (qrToken) => {
  const booking = await prisma.booking.findUnique({
    where: {
      qrToken: qrToken,
    },
    select: {
      id: true,
      slotId: true,
      bookingStatus: true,
      entryTime: true,
      qrExpiresAt: true,
      endTime: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Invalid QR Code");
  }

  if (booking.qrExpiresAt && booking.qrExpiresAt < new Date()) {
    throw new ApiError(404, "Qr Expired!");
  }

  if (
    booking.bookingStatus &&
    booking.bookingStatus !== BOOKING_STATUS.CONFIRMED
  ) {
    throw new ApiError(409, "Booking is not allowed to Check-In");
  }

  if (booking.entryTime) {
    throw new ApiError(409, "Vehicle Already Checked-In");
  }

  const checkedInBooking = await prisma.$transaction(async (tx) => {
    //Booking

    const updatedBooking = await tx.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        bookingStatus: BOOKING_STATUS.ACTIVE,
        entryTime: new Date(),
      },
      include: {
        slot: true,
        vehicle: true,
      },
    });

    const updatedSlot = await tx.parkingSlot.updateMany({
      where: {
        id: booking.slotId,
        status: SLOT_STATUS.RESERVED,
      },
      data: {
        status: SLOT_STATUS.OCCUPIED,
      },
    });

    if (updatedSlot.count === 0) {
      throw new ApiError(409, "Parking Slot cannot be occupied");
    }

    return updatedBooking;
  });
  return checkedInBooking;
};

const checkOut = async (qrToken) => {
  // 1. Find booking using QR token
  const booking = await prisma.booking.findUnique({
    where: {
      qrToken,
    },
    include: {
      lot: true,
      slot: true,
      vehicle: {
        select: {
          vehicleNumber: true,
          vehicleType: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Invalid QR Code.");
  }

  if (booking.bookingStatus !== BOOKING_STATUS.ACTIVE) {
    throw new ApiError(409, "Vehicle is not currently checked in.");
  }

  if (!booking.entryTime) {
    throw new ApiError(409, "Booking has no recorded entry time.");
  }

  if (booking.exitTime) {
    throw new ApiError(409, "Vehicle has already been checked out.");
  }

  const exitTime = new Date();

  // 7. Calculate overstay
  const overstayMinutes = Math.max(
    0,
    Math.floor((exitTime - booking.endTime) / 60000),
  );

  let overstayAmount = 0;

  if (overstayMinutes > booking.lot.gracePeriodMinutes) {
    const chargeableMinutes = overstayMinutes - booking.lot.gracePeriodMinutes;

    overstayAmount = Math.ceil(
      (chargeableMinutes / 60) * booking.lot.overstayRate.toNumber(),
    );
  }

  const hasOverstay = overstayAmount > 0;

  // 8. Update booking and slot atomically
  await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.updateMany({
      where: {
        id: booking.id,
        bookingStatus: BOOKING_STATUS.ACTIVE,
        exitTime: null,
      },
      data: {
        exitTime,
        overstayMinutes,
        overstayAmount,
        bookingStatus: hasOverstay
          ? BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING
          : BOOKING_STATUS.COMPLETED,
      },
    });

    if (updatedBooking.count === 0) {
      throw new ApiError(409, "Booking checkout could not be processed.");
    }

    // Release slot only when no overstay payment is required
    if (!hasOverstay) {
      const updatedSlot = await tx.parkingSlot.updateMany({
        where: {
          id: booking.slotId,
          status: SLOT_STATUS.OCCUPIED,
        },
        data: {
          status: SLOT_STATUS.AVAILABLE,
        },
      });

      if (updatedSlot.count === 0) {
        throw new ApiError(409, "Parking slot could not be released.");
      }
    }
  });

  // 9. Return checkout information
  return {
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    bookingStatus: hasOverstay
      ? BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING
      : BOOKING_STATUS.COMPLETED,
    entryTime: booking.entryTime,
    exitTime,
    overstayMinutes,
    overstayAmount,
    vehicle: booking.vehicle,
    slot: {
      slotNumber: booking.slot.slotNumber,
      floorNumber: booking.slot.floorNumber,
    },
    lot: {
      name: booking.lot.name,
      city: booking.lot.city,
    },
  };
};

const getGateStatus = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    select: {
      bookingStatus: true,
      overstayAmount: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  return {
    bookingStatus: booking.bookingStatus,
    paymentRequired: hasOverstay,
    amountDue: booking.overstayAmount,
  };
};

export { createBooking, getMyBookings, getBookingById, cancelBooking, checkIn, checkOut, getGateStatus };