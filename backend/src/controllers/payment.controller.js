import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "../services/payment.services.js";

const createPaymentOrderController = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId?.trim()) {
    throw new ApiError(400, "Booking ID is required");
  }

  const payment = await createPaymentOrder(req.user.id, bookingId);

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment order created successfully"));
});

const verifyPaymentController = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId?.trim()) {
    throw new ApiError(400, "Booking ID is required");
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Payment verification details are required");
  }

  const verifiedBooking = await verifyPayment(req.user.id, bookingId, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, verifiedBooking, "Payment verified successfully"),
    );
});

export { createPaymentOrderController, verifyPaymentController };