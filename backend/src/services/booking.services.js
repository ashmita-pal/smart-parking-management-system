import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";

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
        "Parking slot is no longer available. Please select another slot.",
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


export { createBooking };