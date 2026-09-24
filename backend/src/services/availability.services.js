import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { BOOKING_STATUS } from "../constants/booking.constants.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";

const getAvailableParking = async ({
  location,
  date,
  startTime,
  endTime,
}) => {
  // -----------------------------------------
  // 1. Create the requested start and end time
  // -----------------------------------------

  const requestedStart = new Date(`${date}T${startTime}:00`);
  const requestedEnd = new Date(`${date}T${endTime}:00`);

  // Check whether the generated dates are valid
  if (
    Number.isNaN(requestedStart.getTime()) ||
    Number.isNaN(requestedEnd.getTime())
  ) {
    throw new ApiError(400, "Invalid date or time");
  }

  // End time must be after start time
  if (requestedEnd <= requestedStart) {
    throw new ApiError(
      400,
      "End time must be after start time",
    );
  }

  // -----------------------------------------
  // 2. Find matching active parking lots
  // -----------------------------------------

  const parkingLots = await prisma.parkingLot.findMany({
    where: {
      isActive: true,
      deletedAt: null,

      OR: [
        {
          name: {
            contains: location,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: location,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: location,
            mode: "insensitive",
          },
        },
      ],
    },

    include: {
      slots: {
        where: {
          deletedAt: null,

          // Maintenance slots should never appear
          status: {
            not: SLOT_STATUS.MAINTENANCE,
          },

          // Find bookings that overlap with requested time
          bookings: {
            none: {
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
          },
        },

        orderBy: [
          {
            floorNumber: "asc",
          },
          {
            slotNumber: "asc",
          },
        ],
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  // -----------------------------------------
  // 3. Remove parking lots with no available
  //    slots
  // -----------------------------------------

  const availableParkingLots = parkingLots.filter(
    (parkingLot) => parkingLot.slots.length > 0,
  );

  // -----------------------------------------
  // 4. Return the result
  // -----------------------------------------

  return {
    search: {
      location,
      date,
      startTime,
      endTime,
    },

    parkingLots: availableParkingLots,
  };
};

export { getAvailableParking };