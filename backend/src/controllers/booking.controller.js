import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  createBooking,
} from "../services/booking.services.js";

const createBookingController = asyncHandler(async (req, res) => {

  const { slotId, vehicleId, durationHours } = req.body;

  if (!slotId?.trim()) {
    throw new ApiError(400, "Parking Slot ID is required");
  }

  if (!vehicleId?.trim()) {
    throw new ApiError(400, "Vehicle ID is required");
  }

  if (
    durationHours === undefined ||
    Number.isNaN(Number(durationHours))
  ) {
    throw new ApiError(
      400,
      "Duration Hours must be a valid number",
    );
  }

  const booking = await createBooking(
    req.user.id,
    {
      slotId,
      vehicleId,
      durationHours: Number(durationHours),
    },
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      booking,
      "Booking created successfully",
    ),
  );
});

export {
  createBookingController,
};