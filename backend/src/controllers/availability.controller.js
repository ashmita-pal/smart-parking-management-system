import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import { getAvailableParking } from "../services/availability.services.js";

const getAvailableParkingController = asyncHandler(async (req, res) => {
  const { location, date, startTime, endTime } = req.query;

  // -----------------------------------------
  // Validation
  // -----------------------------------------

  if (!location?.trim()) {
    throw new ApiError(400, "Location is required");
  }

  if (!date?.trim()) {
    throw new ApiError(400, "Date is required");
  }

  if (!startTime?.trim()) {
    throw new ApiError(400, "Start time is required");
  }

  if (!endTime?.trim()) {
    throw new ApiError(400, "End time is required");
  }

  // -----------------------------------------
  // Get available parking
  // -----------------------------------------

  const result = await getAvailableParking({
    location: location.trim(),
    date,
    startTime,
    endTime,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Available parking fetched successfully",
      ),
    );
});

export { getAvailableParkingController };