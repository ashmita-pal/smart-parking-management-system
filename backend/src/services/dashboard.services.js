import prisma from "../config/prisma.js";

import { BOOKING_STATUS } from "../constants/booking.constants.js";
import {
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from "../constants/payment.constants.js";
import { SLOT_STATUS } from "../constants/parking.constants.js";

const getDashboardSummary = async () => {
  // -----------------------------
  // Date Range
  // -----------------------------

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // -----------------------------
  // Queries
  // -----------------------------

  const [
    totalUsers,
    totalVehicles,
    totalParkingLots,
    totalParkingSlots,
    bookingStatusCounts,
    slotStatusCounts,
    todayRevenue,
    totalRevenue,
    recentBookings,
  ] = await prisma.$transaction([
    // Total Users
    prisma.user.count({
      where: {
        deletedAt: null,
      },
    }),

    // Total Vehicles
    prisma.vehicle.count({
      where: {
        deletedAt: null,
      },
    }),

    // Total Parking Lots
    prisma.parkingLot.count({
      where: {
        deletedAt: null,
      },
    }),

    // Total Parking Slots
    prisma.parkingSlot.count({
      where: {
        deletedAt: null,
      },
    }),

    // Booking Status Counts
    prisma.booking.groupBy({
      by: ["bookingStatus"],

      _count: {
        bookingStatus: true,
      },
    }),

    // Slot Status Counts
    prisma.parkingSlot.groupBy({
      by: ["status"],

      _count: {
        status: true,
      },
    }),

    // Today's Revenue
    prisma.payment.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,

        paymentType: {
          in: [PAYMENT_TYPE.BOOKING, PAYMENT_TYPE.OVERSTAY],
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

    // Total Revenue
    prisma.payment.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,

        paymentType: {
          in: [PAYMENT_TYPE.BOOKING, PAYMENT_TYPE.OVERSTAY],
        },
      },

      _sum: {
        amount: true,
      },
    }),

    // Recent Bookings
    prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      select: {
        id: true,
        bookingReference: true,
        bookingStatus: true,
        createdAt: true,

        user: {
          select: {
            name: true,
          },
        },

        lot: {
          select: {
            name: true,
          },
        },

        slot: {
          select: {
            slotNumber: true,
            floorNumber: true,
          },
        },
      },
    }),
  ]);

  // -----------------------------
  // Booking Statistics
  // -----------------------------

  const bookingStats = {};

  Object.values(BOOKING_STATUS).forEach((status) => {
    bookingStats[status] = 0;
  });

  bookingStatusCounts.forEach((item) => {
    bookingStats[item.bookingStatus] = item._count.bookingStatus;
  });

  // -----------------------------
  // Slot Statistics
  // -----------------------------

  const slotStats = {};

  Object.values(SLOT_STATUS).forEach((status) => {
    slotStats[status] = 0;
  });

  slotStatusCounts.forEach((item) => {
    slotStats[item.status] = item._count.status;
  });

  // -----------------------------
  // Response
  // -----------------------------

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

      availableSlots: slotStats[SLOT_STATUS.AVAILABLE],

      temporaryReservedSlots: slotStats[SLOT_STATUS.TEMP_RESERVED],

      reservedSlots: slotStats[SLOT_STATUS.RESERVED],

      occupiedSlots: slotStats[SLOT_STATUS.OCCUPIED],

      maintenanceSlots: slotStats[SLOT_STATUS.MAINTENANCE],
    },

    bookings: {
      active: bookingStats[BOOKING_STATUS.ACTIVE],

      confirmed: bookingStats[BOOKING_STATUS.CONFIRMED],

      completed: bookingStats[BOOKING_STATUS.COMPLETED],

      pendingPayment: bookingStats[BOOKING_STATUS.PENDING_PAYMENT],

      cancelled: bookingStats[BOOKING_STATUS.CANCELLED],

      expired: bookingStats[BOOKING_STATUS.EXPIRED],

      overstayPaymentPending:
        bookingStats[BOOKING_STATUS.OVERSTAY_PAYMENT_PENDING],
    },

    revenue: {
      today: Number(todayRevenue._sum.amount ?? 0),

      total: Number(totalRevenue._sum.amount ?? 0),
    },

    // Latest 5 bookings
    recentBookings,
  };
};

const getBookingStatistics = async () => {
  // ---------------------------------
  // Date Ranges
  // ---------------------------------

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

  // ---------------------------------
  // Queries
  // ---------------------------------

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

  // ---------------------------------
  // Status Statistics
  // ---------------------------------

  const status = {};

  Object.values(BOOKING_STATUS).forEach((bookingStatus) => {
    status[bookingStatus] = 0;
  });

  bookingStatusCounts.forEach((item) => {
    status[item.bookingStatus] = item._count.bookingStatus;
  });

  // ---------------------------------
  // Response
  // ---------------------------------

  return {
    totalBookings,

    todayBookings,

    weeklyBookings,

    monthlyBookings,

    status,
  };
};

const getRevenueStatistics = async () => {
  // ---------------------------------
  // Date Ranges
  // ---------------------------------

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

  // Last 7 days including today
  const sevenDaysStart = new Date(todayStart);
  sevenDaysStart.setDate(todayStart.getDate() - 6);

  const revenueFilter = {
    paymentStatus: PAYMENT_STATUS.SUCCESS,

    paymentType: {
      in: [PAYMENT_TYPE.BOOKING, PAYMENT_TYPE.OVERSTAY],
    },
  };

  // ---------------------------------
  // Queries
  // ---------------------------------

  const [
    totalRevenue,
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    bookingRevenue,
    overstayRevenue,
    refundAmount,
    paymentStatusCounts,
    dailyRevenuePayments,
    parkingLots,
    parkingBookings,
    vehicleBookings,
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

    // Payments used for the 7-day revenue chart
    prisma.payment.findMany({
      where: {
        ...revenueFilter,

        paidAt: {
          gte: sevenDaysStart,
          lte: todayEnd,
        },
      },

      select: {
        amount: true,
        paidAt: true,
      },

      orderBy: {
        paidAt: "asc",
      },
    }),

    // Parking lots
    prisma.parkingLot.findMany({
      where: {
        deletedAt: null,
      },

      select: {
        id: true,
        name: true,

        slots: {
          where: {
            deletedAt: null,
          },

          select: {
            id: true,
            status: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    }),

    // Successful bookings with their parking lot and payments
    prisma.booking.findMany({
      where: {
        payments: {
          some: {
            paymentStatus: PAYMENT_STATUS.SUCCESS,

            paymentType: {
              in: [PAYMENT_TYPE.BOOKING, PAYMENT_TYPE.OVERSTAY],
            },
          },
        },
      },

      select: {
        id: true,
        lotId: true,

        payments: {
          where: {
            paymentStatus: PAYMENT_STATUS.SUCCESS,

            paymentType: {
              in: [PAYMENT_TYPE.BOOKING, PAYMENT_TYPE.OVERSTAY],
            },
          },

          select: {
            amount: true,
          },
        },
      },
    }),

    // Bookings with vehicle type
    prisma.booking.findMany({
      select: {
        vehicle: {
          select: {
            vehicleType: true,
          },
        },
      },
    }),
  ]);

  // ---------------------------------
  // Payment Status Statistics
  // ---------------------------------

  const paymentStatus = {};

  Object.values(PAYMENT_STATUS).forEach((status) => {
    paymentStatus[status] = 0;
  });

  paymentStatusCounts.forEach((item) => {
    paymentStatus[item.paymentStatus] = item._count.paymentStatus;
  });

  // ---------------------------------
  // Daily Revenue Statistics
  // ---------------------------------

  const dailyRevenueMap = {};

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(sevenDaysStart);
    date.setDate(sevenDaysStart.getDate() + i);

    const key = date.toISOString().split("T")[0];

    dailyRevenueMap[key] = {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      amount: 0,
    };
  }

  dailyRevenuePayments.forEach((payment) => {
    if (!payment.paidAt) {
      return;
    }

    const key = new Date(payment.paidAt).toISOString().split("T")[0];

    if (dailyRevenueMap[key]) {
      dailyRevenueMap[key].amount += Number(payment.amount ?? 0);
    }
  });

  const dailyRevenue = Object.values(dailyRevenueMap);

  // ---------------------------------
  // Parking Lot Performance
  // ---------------------------------

  const parkingPerformance = parkingLots.map((lot) => {
    const totalSlots = lot.slots.length;

    const occupiedSlots = lot.slots.filter(
      (slot) => slot.status === SLOT_STATUS.OCCUPIED,
    ).length;

    const occupancy =
      totalSlots > 0
        ? Math.round((occupiedSlots / totalSlots) * 100)
        : 0;

    const lotBookings = parkingBookings.filter(
      (booking) => booking.lotId === lot.id,
    );

    const bookings = lotBookings.length;

    const revenue = lotBookings.reduce((total, booking) => {
      const bookingRevenue = booking.payments.reduce(
        (paymentTotal, payment) =>
          paymentTotal + Number(payment.amount ?? 0),
        0,
      );

      return total + bookingRevenue;
    }, 0);

    return {
      name: lot.name,
      bookings,
      revenue,
      occupancy,
    };
  });

  // ---------------------------------
  // Vehicle Distribution
  // ---------------------------------

  const vehicleBookingCounts = {};

  vehicleBookings.forEach((booking) => {
    const vehicleType = booking.vehicle?.vehicleType;

    if (!vehicleType) {
      return;
    }

    if (!vehicleBookingCounts[vehicleType]) {
      vehicleBookingCounts[vehicleType] = 0;
    }

    vehicleBookingCounts[vehicleType] += 1;
  });

  const totalVehicleBookings = vehicleBookings.length;

  const vehicleDistribution = Object.entries(vehicleBookingCounts).map(
    ([type, bookings]) => ({
      type,
      bookings,
      percentage:
        totalVehicleBookings > 0
          ? Math.round((bookings / totalVehicleBookings) * 100)
          : 0,
    }),
  );

  // ---------------------------------
  // Response
  // ---------------------------------

  return {
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),

    todayRevenue: Number(todayRevenue._sum.amount ?? 0),

    weeklyRevenue: Number(weeklyRevenue._sum.amount ?? 0),

    monthlyRevenue: Number(monthlyRevenue._sum.amount ?? 0),

    bookingRevenue: Number(bookingRevenue._sum.amount ?? 0),

    overstayRevenue: Number(overstayRevenue._sum.amount ?? 0),

    refundAmount: Number(refundAmount._sum.refundAmount ?? 0),

    paymentStatus,

    // Analytics data
    dailyRevenue,

    parkingPerformance,

    vehicleDistribution,

    totalVehicleBookings,
  };
};

export {
  getDashboardSummary,
  getBookingStatistics,
  getRevenueStatistics,
};