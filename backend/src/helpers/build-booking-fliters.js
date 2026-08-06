import { BOOKING_STATUS } from "../constants/booking.constants.js";

import { PAYMENT_STATUS } from "../constants/payment.constants.js";

const buildBookingFilters = ({
  userId,
  search,
  lotId,
  from,
  to,
  status,
  paymentStatus,
}) => {
  const where = {
    userId,
  };

  if (search?.trim()) {
    where.bookingReference = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  if (from || to) {
    where.createdAt = {};
    if (from) {
      where.createdAt.gte = new Date(from);
    }
    if (to) {
      where.createdAt.lte = new Date(to);
    }
  }

  if (lotId?.trim()) {
    where.lotId = lotId;
  }

  if (paymentStatus && Object.values(PAYMENT_STATUS).includes(paymentStatus)) {
    where.payment = {
      some: {
        paymentStatus,
      },
    };
  }

  if (status && Object.values(BOOKING_STATUS).includes(status)) {
    where.bookingStatus = status;
  }

  return where;
};

export { buildBookingFilters };