import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { BOOKING_STATUS } from "../constants/booking.constants.js";
import { PAYMENT_STATUS } from "../constants/payment.constants.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import {generateBookingQRCode} from "./qrCode.services.js";


const createPaymentOrder = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
    select: {
      id: true,
      bookingReference: true,
      totalAmount: true,
      bookingStatus: true,
      payment: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking Does not Exist");
  }

  if (booking.bookingStatus !== BOOKING_STATUS.PENDING_PAYMENT) {
    throw new ApiError(409, "Payment can only be made for pending bookings");
  }

  if (booking.payment) {
    throw new ApiError(409, "Payment already initiated for this booking");
  }

  let razorpayOrder;

  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(booking.totalAmount.toNumber() * 100),
      currency: "INR",
      receipt: booking.bookingReference,
      notes: {
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        userId,
      },
    });
  } catch (error) {
    throw new ApiError(
      502,
      "Unable to create payment order. Please try again later.",
    );
  }

  let payment;

  try {
    payment = await prisma.$transaction(async (tx) => {
      // Re-check inside the transaction to close the race window
      const existingPayment = await tx.payment.findUnique({
        where: { bookingId: booking.id },
      });

      if (existingPayment) {
        throw new ApiError(409, "Payment already initiated for this booking");
      }

      const createdPayment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          razorpayOrderId: razorpayOrder.id,
          amount: booking.totalAmount,
          currency: razorpayOrder.currency,
          paymentStatus: PAYMENT_STATUS.PENDING,
        },
        select: {
          id: true,
          bookingId: true,
          paymentStatus: true,
          amount: true,
          currency: true,
          razorpayOrderId: true,
          createdAt: true,
        },
      });
      return createdPayment;
    });
  } catch (error) {
    // Duplicate payment row slipped through despite the check — unique constraint caught it
    if (error.code === "P2002") {
      throw new ApiError(409, "Payment already initiated for this booking");
    }
    throw error;
  }

  return {
    bookingId: booking.id,

    paymentId: payment.id,

    orderId: razorpayOrder.id,

    amount: booking.totalAmount,

    currency: razorpayOrder.currency,

    bookingReference: booking.bookingReference,

    razorpayKey: process.env.RAZORPAY_KEY_ID,
  };
};

const verifyPayment = async (
  userId,
  bookingId,
  { razorpay_order_id, razorpay_payment_id, razorpay_signature },
) => {
  // Fetch Booking + Payment

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    include: {
      payment: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (!booking.payment) {
    throw new ApiError(404, "Payment record not found");
  }

  // Validate Current Status

  if (booking.bookingStatus !== BOOKING_STATUS.PENDING_PAYMENT) {
    throw new ApiError(409, "Booking is not awaiting payment");
  }

  if (booking.payment.paymentStatus !== PAYMENT_STATUS.PENDING) {
    throw new ApiError(409, "Payment has already been verified");
  }

  // Verify Razorpay Order ID

  if (booking.payment.razorpayOrderId !== razorpay_order_id) {
    throw new ApiError(400, "Invalid Razorpay order");
  }

  // Signature Verification

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Payment signature verification failed");
  }

  // Generate QR

  const qrCode = generateBookingQRCode(booking);

  const qrExpiresAt = booking.endTime;

  // Transaction

  const verifiedBooking = await prisma.$transaction(async (tx) => {
    // Payment

    const updatedPayment = await tx.payment.updateMany({
      where: {
        bookingId: booking.id,
        paymentStatus: PAYMENT_STATUS.PENDING,
      },
      data: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    if (updatedPayment.count === 0) {
      throw new ApiError(409, "Payment has already been processed.");
    }

    // Booking

    const updatedBooking = await tx.booking.update({
      where: {
        id: booking.id,
      },

      data: {
        bookingStatus: BOOKING_STATUS.CONFIRMED,

        qrCode,

        qrExpiresAt,
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

        payment: {
          select: {
            paymentStatus: true,
            razorpayPaymentId: true,
          },
        },
      },
    });

    // Parking Slot

    const updatedSlot = await tx.parkingSlot.updateMany({
      where: {
        id: booking.slotId,
        status: SLOT_STATUS.TEMP_RESERVED,
      },
      data: {
        status: SLOT_STATUS.RESERVED,
      },
    });

    if (updatedSlot.count === 0) {
      throw new ApiError(409, "Parking slot is no longer available.");
    }

    return updatedBooking;
  });

  return verifiedBooking;
};
export { createPaymentOrder, verifyPayment };