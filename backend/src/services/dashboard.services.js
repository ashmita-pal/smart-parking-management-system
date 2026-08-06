import prisma from "../config/prisma.js";

import { BOOKING_STATUS } from "../constants/booking.constants.js";
import {PAYMENT_STATUS, PAYMENT_TYPE } from "../constants/payment.constants.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";

const getDashboardSummary = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);


  const [
    totalUsers,
    totalVehicles,
    totalParkingLots,
    totalParkingSlots,

    bookingStatusCounts,

    slotStatusCounts,

    todayRevenue,

    totalRevenue,
  ] = await prisma.$transaction([
    prisma.user.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.vehicle.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.parkingLot.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.parkingSlot.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.booking.groupBy({
      by: ["bookingStatus"],

      _count: {
        bookingStatus: true,
      },
    }),

    prisma.parkingSlot.groupBy({
      by: ["status"],

      _count: {
        status: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,

        paymentType: {
          in: [
            PAYMENT_TYPE.BOOKING,
            PAYMENT_TYPE.OVERSTAY,
          ],
        },

        paidAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,

        paymentType: {
          in: [
            PAYMENT_TYPE.BOOKING,
            PAYMENT_TYPE.OVERSTAY,
          ],
        },
      },

      _sum: {
        amount: true,
      },
    }),
  ]);


  const bookingStats = {};

  Object.values(BOOKING_STATUS).forEach((status) => {
    bookingStats[status] = 0;
  });

  bookingStatusCounts.forEach((item) => {
    bookingStats[item.bookingStatus] =
      item._count.bookingStatus;
  });


  const slotStats = {};

  Object.values(SLOT_STATUS).forEach((status) => {
    slotStats[status] = 0;
  });

  slotStatusCounts.forEach((item) => {
    slotStats[item.status] =
      item._count.status;
  });


  return {
    users: {
      total: totalUsers,
    },

    vehicles: {
      total: totalVehicles,
    },

    parking: {
      totalLots: totalParkingLots,

      totalSlots: totalParkingSlots,

      availableSlots:
        slotStats[SLOT_STATUS.AVAILABLE],

      temporaryReservedSlots:
        slotStats[SLOT_STATUS.TEMP_RESERVED],

      reservedSlots:
        slotStats[SLOT_STATUS.RESERVED],

      occupiedSlots:
        slotStats[SLOT_STATUS.OCCUPIED],

      maintenanceSlots:
        slotStats[SLOT_STATUS.MAINTENANCE],
    },

    bookings: {
      active:
        bookingStats[BOOKING_STATUS.ACTIVE],

      confirmed:
        bookingStats[
          BOOKING_STATUS.CONFIRMED
        ],

      completed:
        bookingStats[
          BOOKING_STATUS.COMPLETED
        ],

      pendingPayment:
        bookingStats[
          BOOKING_STATUS.PENDING_PAYMENT
        ],

      cancelled:
        bookingStats[
          BOOKING_STATUS.CANCELLED
        ],

      expired:
        bookingStats[
          BOOKING_STATUS.EXPIRED
        ],

      overstayPaymentPending:
        bookingStats[
          BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING
        ],
    },

    revenue: {
      today: Number(
        todayRevenue._sum.amount ?? 0,
      ),

      total: Number(
        totalRevenue._sum.amount ?? 0,
      ),
    },
  };
};

const getBookingStatistics = async () => {

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay());

  const monthStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    1,
  );


  const [
    totalBookings,

    todayBookings,

    weeklyBookings,

    monthlyBookings,

    bookingStatusCounts,
  ] = await prisma.$transaction([
    prisma.booking.count(),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: weekStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.booking.groupBy({
      by: ["bookingStatus"],

      _count: {
        bookingStatus: true,
      },
    }),
  ]);


  const status = {};

  Object.values(BOOKING_STATUS).forEach((bookingStatus) => {
    status[bookingStatus] = 0;
  });

  bookingStatusCounts.forEach((item) => {
    status[item.bookingStatus] =
      item._count.bookingStatus;
  });


  return {
    totalBookings,

    todayBookings,

    weeklyBookings,

    monthlyBookings,

    status,
  };
};

const getRevenueStatistics = async () => {

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay());

  const monthStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    1,
  );

  const revenueFilter = {
    paymentStatus: PAYMENT_STATUS.SUCCESS,
    paymentType: {
      in: [
        PAYMENT_TYPE.BOOKING,
        PAYMENT_TYPE.OVERSTAY,
      ],
    },
  };

  const [
    totalRevenue,

    todayRevenue,

    weeklyRevenue,

    monthlyRevenue,

    bookingRevenue,

    overstayRevenue,

    refundAmount,

    paymentStatusCounts,
  ] = await prisma.$transaction([
    prisma.payment.aggregate({
      where: revenueFilter,

      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        ...revenueFilter,

        paidAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        ...revenueFilter,

        paidAt: {
          gte: weekStart,
          lte: todayEnd,
        },
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        ...revenueFilter,

        paidAt: {
          gte: monthStart,
          lte: todayEnd,
        },
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,

        paymentType: PAYMENT_TYPE.BOOKING,
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,

        paymentType: PAYMENT_TYPE.OVERSTAY,
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.REFUNDED,
      },

      _sum: {
        refundAmount: true,
      },
    }),

    prisma.payment.groupBy({
      by: ["paymentStatus"],

      _count: {
        paymentStatus: true,
      },
    }),
  ]);


  const paymentStatus = {};

  Object.values(PAYMENT_STATUS).forEach((status) => {
    paymentStatus[status] = 0;
  });

  paymentStatusCounts.forEach((item) => {
    paymentStatus[item.paymentStatus] =
      item._count.paymentStatus;
  });

  return {
    totalRevenue: Number(
      totalRevenue._sum.amount ?? 0,
    ),

    todayRevenue: Number(
      todayRevenue._sum.amount ?? 0,
    ),

    weeklyRevenue: Number(
      weeklyRevenue._sum.amount ?? 0,
    ),

    monthlyRevenue: Number(
      monthlyRevenue._sum.amount ?? 0,
    ),

    bookingRevenue: Number(
      bookingRevenue._sum.amount ?? 0,
    ),

    overstayRevenue: Number(
      overstayRevenue._sum.amount ?? 0,
    ),

    refundAmount: Number(
      refundAmount._sum.refundAmount ?? 0,
    ),

    paymentStatus,
  };
};

export {
  getDashboardSummary,
  getBookingStatistics,
  getRevenueStatistics
};
