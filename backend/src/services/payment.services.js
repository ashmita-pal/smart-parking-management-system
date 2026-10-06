import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

import { BOOKING_STATUS } from "../constants/booking.constants.js";
import {
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from "../constants/payment.constants.js";

import razorpay from "../config/razorpay.js";
import crypto from "crypto";

import { generateBookingQRCode } from "./qrCode.services.js";

import { SLOT_STATUS } from "../constants/parking.constants.js";

import { paymentFilters } from "../helpers/build-payment-filters.js";

const createRazorpayOrder = async ({
  booking,
  amount,
  paymentType,
  description,
  userId,
}) => {
  let razorpayOrder;

  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount.toNumber() * 100),
      currency: "INR",
      receipt: `${booking.bookingReference}-${paymentType}`,
      notes: {
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        paymentType,
        userId,
      },
    });
  } catch (error) {
    throw new ApiError(502, "Unable to create Razorpay order.");
  }

  const payment = await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findFirst({
      where: {
        bookingId: booking.id,
        paymentType,
        paymentStatus: PAYMENT_STATUS.PENDING,
      },
    });

    if (existingPayment) {
      throw new ApiError(
        409,
        `${paymentType} payment already initiated.`,
      );
    }

    return tx.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: razorpayOrder.id,
        amount,
        currency: razorpayOrder.currency,
        paymentType,
        paymentStatus: PAYMENT_STATUS.PENDING,
        description,
      },
      select: {
        id: true,
        bookingId: true,
        amount: true,
        paymentType: true,
        paymentStatus: true,
        razorpayOrderId: true,
      },
    });
  });

  return {
    payment,
    razorpayOrder,
  };
};

const createPaymentOrder = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
    select: {
      id: true,
      bookingReference: true,
      bookingStatus: true,
      totalAmount: true,
      overstayAmount: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  let paymentType;
  let amount;
  let description;

  if (booking.bookingStatus === BOOKING_STATUS.PENDING_PAYMENT) {
    paymentType = PAYMENT_TYPE.BOOKING;
    amount = booking.totalAmount;
    description = `Booking Payment (${booking.bookingReference})`;
  } else if (
    booking.bookingStatus === BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING
  ) {
    if (booking.overstayAmount.lte(0)) {
      throw new ApiError(400, "No overstay amount due.");
    }

    amount = booking.overstayAmount;
    paymentType = PAYMENT_TYPE.OVERSTAY;
    description = `Overstay Charge (${booking.bookingReference})`;
  } else {
    throw new ApiError(409, "No payment is currently due for this booking.");
  }

  const { payment, razorpayOrder } = await createRazorpayOrder({
    booking,
    amount,
    paymentType,
    description,
    userId,
  });

  return {
    paymentId: payment.id,
    bookingId: booking.id,
    orderId: razorpayOrder.id,
    amount,
    currency: razorpayOrder.currency,
    bookingReference: booking.bookingReference,
    paymentType,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  };
};

const verifyBookingPayment = async ({
  booking,
  payment,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const { qrToken, qrImage } = await generateBookingQRCode();
  const qrExpiresAt = booking.endTime;

  const updatedBooking = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.updateMany({
      where: {
        id: payment.id,
        paymentStatus: PAYMENT_STATUS.PENDING,
        paymentType: PAYMENT_TYPE.BOOKING,
      },
      data: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
    });

    if (updatedPayment.count === 0) {
      throw new ApiError(409, "Payment already processed.");
    }

    const updateBooking = await tx.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        bookingStatus: BOOKING_STATUS.CONFIRMED,
        qrToken,
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
      },
    });

    return updateBooking;
  });

  return {
    ...updatedBooking,
    paymentType: PAYMENT_TYPE.BOOKING,
    qrImage,
  };
};

const verifyOverstayPayment = async ({
  booking,
  payment,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const completedBooking = await prisma.$transaction(async (tx) => {
    // 1. Mark overstay payment as SUCCESS
    const updatedPayment = await tx.payment.updateMany({
      where: {
        id: payment.id,
        paymentStatus: PAYMENT_STATUS.PENDING,
        paymentType: PAYMENT_TYPE.OVERSTAY,
      },
      data: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
    });

    if (updatedPayment.count === 0) {
      throw new ApiError(
        409,
        "Overstay payment has already been processed.",
      );
    }

    // 2. Mark booking as COMPLETED
    const updatedBooking = await tx.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        bookingStatus: BOOKING_STATUS.COMPLETED,
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
            overstayRate: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            paymentType: true,
            paymentStatus: true,
            amount: true,
            paidAt: true,
          },
        },
      },
    });

    // 3. Release the occupied slot
    const releasedSlot = await tx.parkingSlot.updateMany({
      where: {
        id: booking.slotId,
        status: SLOT_STATUS.OCCUPIED,
      },
      data: {
        status: SLOT_STATUS.AVAILABLE,
      },
    });

    if (releasedSlot.count === 0) {
      throw new ApiError(
        409,
        "Parking slot could not be released after overstay payment.",
      );
    }

    return updatedBooking;
  });

  return {
    ...completedBooking,
    paymentType: PAYMENT_TYPE.OVERSTAY,
  };
};

const verifyPayment = async (
  userId,
  bookingId,
  { razorpay_order_id, razorpay_payment_id, razorpay_signature },
) => {
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new ApiError(400, "Missing payment verification fields");
  }

  // Fetch Booking + Payment
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
    include: {
      payments: {
        where: {
          paymentStatus: PAYMENT_STATUS.PENDING,
          razorpayOrderId: razorpay_order_id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const payment = booking.payments[0];

  if (!payment) {
    throw new ApiError(404, "Pending payment not found");
  }

  // Validate Current Status
  if (payment.paymentStatus !== PAYMENT_STATUS.PENDING) {
    throw new ApiError(409, "Payment has already been verified");
  }

  if (
    payment.paymentType === PAYMENT_TYPE.BOOKING &&
    booking.bookingStatus !== BOOKING_STATUS.PENDING_PAYMENT
  ) {
    throw new ApiError(409, "Booking is not awaiting payment");
  }

  if (
    payment.paymentType === PAYMENT_TYPE.OVERSTAY &&
    booking.bookingStatus !== BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING
  ) {
    throw new ApiError(
      409,
      "Booking is not awaiting overstay payment",
    );
  }

  if (
    payment.paymentType === PAYMENT_TYPE.BOOKING &&
    booking.endTime <= new Date()
  ) {
    throw new ApiError(409, "Booking window has already expired");
  }

  // Verify Razorpay Order ID
  if (payment.razorpayOrderId !== razorpay_order_id) {
    throw new ApiError(400, "Invalid Razorpay order");
  }

  // Signature Verification (timing-safe)
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature, "hex");
  const providedBuffer = Buffer.from(razorpay_signature, "hex");

  if (
    generatedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(generatedBuffer, providedBuffer)
  ) {
    throw new ApiError(400, "Payment signature verification failed");
  }

  switch (payment.paymentType) {
    case PAYMENT_TYPE.BOOKING:
      return verifyBookingPayment({
        booking,
        payment,
        razorpay_payment_id,
        razorpay_signature,
      });

    case PAYMENT_TYPE.OVERSTAY:
      return verifyOverstayPayment({
        booking,
        payment,
        razorpay_payment_id,
        razorpay_signature,
      });

    default:
      throw new ApiError(400, "Unsupported payment type");
  }
};

const getPayments = async (user, filters) => {
  let {
    page = 1,
    limit = 10,
    search,
    paymentMethod,
    paymentType,
    paymentStatus,
    from,
    to,
    sort = "desc",
  } = filters;

  const isAdmin = user.role === "ADMIN";

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

  const where = paymentFilters({
    userId: isAdmin ? undefined : user.id,
    search,
    paymentMethod,
    paymentType,
    paymentStatus,
    from,
    to,
  });

  const [totalPayments, filteredPaymentRecords] =
    await prisma.$transaction([
      prisma.payment.count({
        where,
      }),

      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: sort === "asc" ? "asc" : "desc",
        },

        select: {
          id: true,
          amount: true,
          currency: true,
          paymentStatus: true,
          paymentType: true,
          paymentMethod: true,
          description: true,
          paidAt: true,
          createdAt: true,

          booking: {
            select: {
              id: true,
              bookingReference: true,
              bookingStatus: true,
              startTime: true,
              endTime: true,
              entryTime: true,
              exitTime: true,
              overstayMinutes: true,
              overstayAmount: true,

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

              lot: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                },
              },
            },
          },
        },
      }),
    ]);

  return {
    filteredPaymentRecords,

    pagination: {
      page,
      limit,
      totalPayments,
      totalPages: Math.ceil(totalPayments / limit) || 1,
      hasNextPage: page * limit < totalPayments,
      hasPreviousPage: page > 1,
    },
  };
};

export {
  createPaymentOrder,
  verifyPayment,
  getPayments,
};