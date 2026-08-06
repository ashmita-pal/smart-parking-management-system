import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";
import { BOOKING_STATUS } from "../constants/booking.constants.js";
import { buildBookingFilters } from "../helpers/build-booking-fliters.js";

const createBooking = async (userId, { slotId, vehicleId, durationHours }) => {
  if (!Number.isInteger(durationHours) || durationHours <= 0) {
    throw new ApiError(400, "Duration must be a positive integer");
  }

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
    throw new ApiError(403, "You are not authorized to use this vehicle");
  }

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

  if (!slot.lot || slot.lot.deletedAt) {
    throw new ApiError(404, "Parking lot not found");
  }

  if (!slot.lot.isActive) {
    throw new ApiError(409, "Parking lot is currently inactive");
  }

  if (vehicle.vehicleType !== slot.slotType) {
    throw new ApiError(
      400,
      `${slot.slotType} slot cannot be booked for ${vehicle.vehicleType} vehicle`,
    );
  }

  const totalAmount = slot.lot.pricePerHour.toNumber() * durationHours;

  const startTime = new Date();

  const endTime = new Date(
    startTime.getTime() + durationHours * 60 * 60 * 1000,
  );

  const expiresAt = new Date(startTime.getTime() + 10 * 60 * 1000);

  const bookingReference = `BK-${Date.now()}`;

  const booking = await prisma.$transaction(async (tx) => {
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

    const createdBooking = await tx.booking.create({
      data: {
        userId,
        vehicleId,
        lotId: slot.lot.id,
        slotId,

        bookingReference,

        durationHours,

        startTime,
        endTime,

        totalAmount,

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

        payment: {
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

      payment: {
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

const checkIn = async (qrCode) => {
  const booking = await prisma.booking.findUnique({
    where: {
      qrCode: qrCode,
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
};

const checkOut = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
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

  // --- Validation chain: exists → ACTIVE → entryTime present → not already exited ---

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  if (booking.bookingStatus !== BOOKING_STATUS.ACTIVE) {
    throw new ApiError(409, "Booking is not currently active.");
  }

  if (!booking.entryTime) {
    throw new ApiError(409, "Booking has no recorded entry time.");
  }

  if (booking.exitTime) {
    throw new ApiError(409, "Booking has already been checked out.");
  }

  const exitTime = new Date();

  // --- Overstay calculation ---

  const overstayMinutes = Math.max(
    0,
    Math.floor((exitTime - booking.endTime) / 60000),
  );

  let overstayAmount = 0;

  if (overstayMinutes > booking.lot.gracePeriodMinutes) {
    const chargeableMinutes = overstayMinutes - booking.lot.gracePeriodMinutes;

    // Math.ceil to avoid undercharging on fractional-rupee overstay
    // (e.g. ₹83.33 becomes ₹84, not silently truncated to ₹83).
    overstayAmount = Math.ceil(
      (chargeableMinutes / 60) * booking.lot.overstayRate.toNumber(),
    );
  }

  const hasOverstay = overstayAmount > 0;

  // --- Transaction: update booking, and release the slot only if there's no overstay ---

  await prisma.$transaction(async (tx) => {
    // Guarded update: only succeeds if the booking is still ACTIVE with no
    // exitTime set yet. Protects against a double checkout race (e.g. the
    // exit scanner firing twice, or a retried request).
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

    // Only release the slot when there's nothing left to collect. If there's
    // an overstay charge, the slot stays occupied/reserved until payment
    // verification completes and releases it (see verifyOverstayPayment).
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