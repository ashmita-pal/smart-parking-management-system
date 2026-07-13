import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  createBooking, getMyBookings, getBookingById, cancelBooking, checkIn
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

const getMyBookingsController = asyncHandler(async (req, res) => {
  const bookings = await getMyBookings(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      bookings,
      "Bookings fetched successfully",
    ),
  );
});

const getBookingByIdController = asyncHandler(async(req, res)=>{
  const userId =req.user.id;
  const {bookingId} = req.params;

  const booking= await getBookingById(userId,bookingId);

  return res.status(200).json(
    new ApiResponse(200, booking, "Booking details fetched successfully")
  );
});

const cancelBookingController = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId?.trim()) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await cancelBooking(
    req.user.id,
    bookingId,
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      booking,
      "Booking cancelled successfully",
    ),
  );
});

const checkInController = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;

  if (!qrToken?.trim()) {
    throw new ApiError(400, "QR Code is required");
  }

  const booking = await checkIn(qrToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      booking,
      "Vehicle checked in successfully",
    ),
  );
});
 
const gateStatusController = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId?.trim()) {
    throw new ApiError(400, "Booking ID is required");
  }

  const status = await getGateStatus(req.user.id, bookingId);

  return res
    .status(200)
    .json(new ApiResponse(200, status, "Gate status fetched successfully"));
});

const checkoutController = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId?.trim()) {
    throw new ApiError(400, "Booking ID is required");
  }

  const result = await checkOut(req.user.id, bookingId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Checkout processed successfully"));
});

export {
  createBookingController, getMyBookingsController, getBookingByIdController, 
  cancelBookingController, checkInController, gateStatusController, checkoutController
};