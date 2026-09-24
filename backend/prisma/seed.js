import bcrypt from "bcrypt";
import crypto from "crypto";

import prisma from "../src/config/prisma.js";

const main = async () => {
  console.log("🌱 Seeding database...");

  // ======================================================
  // CLEAN DATABASE
  // ======================================================

  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.parkingSlot.deleteMany();
  await prisma.parkingLot.deleteMany();
  await prisma.user.deleteMany();

  // ======================================================
  // USERS
  // ======================================================

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("Test@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Smart Parking Admin",
      email: "admin@smartparking.com",
      password: adminPassword,
      phone: "9876543210",
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  const testUser = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@smartparking.com",
      password: userPassword,
      phone: "9123456789",
      role: "USER",
      isEmailVerified: true,
    },
  });

  console.log("✅ Users created");

  // ======================================================
  // PARKING LOTS
  // ======================================================

  const cityCentre = await prisma.parkingLot.create({
    data: {
      name: "City Centre Parking",
      description: "Multi-level shopping mall parking",
      address: "Salt Lake Sector-I",
      city: "Kolkata",
      state: "West Bengal",
      latitude: 22.5881,
      longitude: 88.4101,
      pricePerHour: 60,
      gracePeriodMinutes: 15,
      overstayRate: 100,
      totalSlots: 37,
      isActive: true,
    },
  });

  const howrahRailway = await prisma.parkingLot.create({
    data: {
      name: "Howrah Railway Parking",
      description: "Railway station parking",
      address: "Howrah Junction",
      city: "Howrah",
      state: "West Bengal",
      latitude: 22.5835,
      longitude: 88.3426,
      pricePerHour: 40,
      gracePeriodMinutes: 10,
      overstayRate: 80,
      totalSlots: 29,
      isActive: true,
    },
  });

  console.log("✅ Parking lots created");

  // ======================================================
  // PARKING SLOTS
  // ======================================================

  const cityCentreSlots = [];
  const howrahRailwaySlots = [];

  // ---------- City Centre ----------

  for (let i = 1; i <= 20; i++) {
    cityCentreSlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: cityCentre.id,
          floorNumber: 1,
          slotNumber: `CAR-${String(i).padStart(3, "0")}`,
          slotType: "CAR",
          status: "AVAILABLE",
        },
      }),
    );
  }

  for (let i = 1; i <= 10; i++) {
    cityCentreSlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: cityCentre.id,
          floorNumber: 1,
          slotNumber: `BIKE-${String(i).padStart(3, "0")}`,
          slotType: "BIKE",
          status: "AVAILABLE",
        },
      }),
    );
  }

  for (let i = 1; i <= 5; i++) {
    cityCentreSlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: cityCentre.id,
          floorNumber: 1,
          slotNumber: `EV-${String(i).padStart(3, "0")}`,
          slotType: "EV",
          status: "AVAILABLE",
        },
      }),
    );
  }

  for (let i = 1; i <= 2; i++) {
    cityCentreSlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: cityCentre.id,
          floorNumber: 1,
          slotNumber: `DIS-${String(i).padStart(3, "0")}`,
          slotType: "DISABLED",
          status: "AVAILABLE",
        },
      }),
    );
  }

  // ---------- Howrah Railway ----------

  for (let i = 1; i <= 15; i++) {
    howrahRailwaySlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: howrahRailway.id,
          floorNumber: 1,
          slotNumber: `CAR-${String(i).padStart(3, "0")}`,
          slotType: "CAR",
          status: "AVAILABLE",
        },
      }),
    );
  }

  for (let i = 1; i <= 8; i++) {
    howrahRailwaySlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: howrahRailway.id,
          floorNumber: 1,
          slotNumber: `BIKE-${String(i).padStart(3, "0")}`,
          slotType: "BIKE",
          status: "AVAILABLE",
        },
      }),
    );
  }

  for (let i = 1; i <= 4; i++) {
    howrahRailwaySlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: howrahRailway.id,
          floorNumber: 1,
          slotNumber: `EV-${String(i).padStart(3, "0")}`,
          slotType: "EV",
          status: "AVAILABLE",
        },
      }),
    );
  }

  for (let i = 1; i <= 2; i++) {
    howrahRailwaySlots.push(
      await prisma.parkingSlot.create({
        data: {
          lotId: howrahRailway.id,
          floorNumber: 1,
          slotNumber: `DIS-${String(i).padStart(3, "0")}`,
          slotType: "DISABLED",
          status: "AVAILABLE",
        },
      }),
    );
  }

  console.log("✅ Parking slots created");

  // ======================================================
  // VEHICLES
  // ======================================================

  const adminCar = await prisma.vehicle.create({
    data: {
      userId: admin.id,
      vehicleNumber: "WB01AA0001",
      vehicleType: "CAR",
    },
  });

  const userCar = await prisma.vehicle.create({
    data: {
      userId: testUser.id,
      vehicleNumber: "WB06AB1284",
      vehicleType: "CAR",
    },
  });

  const userBike = await prisma.vehicle.create({
    data: {
      userId: testUser.id,
      vehicleNumber: "WB24CD5678",
      vehicleType: "BIKE",
    },
  });

  const userEV = await prisma.vehicle.create({
    data: {
      userId: testUser.id,
      vehicleNumber: "WB20EV1001",
      vehicleType: "EV",
    },
  });

  console.log("✅ Vehicles created");

  // ======================================================
  // BOOKINGS
  // ======================================================

  const now = new Date();

  const bookingData = [
    // ---------- COMPLETED ----------
    {
      vehicle: userCar,
      slot: cityCentreSlots[0],
      lot: cityCentre,
      status: "COMPLETED",
      duration: 2,
      daysAgo: 30,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: cityCentreSlots[20],
      lot: cityCentre,
      status: "COMPLETED",
      duration: 3,
      daysAgo: 28,
      overstay: 0,
    },
    {
      vehicle: userEV,
      slot: cityCentreSlots[30],
      lot: cityCentre,
      status: "COMPLETED",
      duration: 2,
      daysAgo: 26,
      overstay: 0,
    },
    {
      vehicle: userCar,
      slot: howrahRailwaySlots[0],
      lot: howrahRailway,
      status: "COMPLETED",
      duration: 4,
      daysAgo: 24,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: howrahRailwaySlots[15],
      lot: howrahRailway,
      status: "COMPLETED",
      duration: 2,
      daysAgo: 22,
      overstay: 0,
    },
    {
      vehicle: userEV,
      slot: howrahRailwaySlots[23],
      lot: howrahRailway,
      status: "COMPLETED",
      duration: 5,
      daysAgo: 20,
      overstay: 0,
    },
    {
      vehicle: userCar,
      slot: cityCentreSlots[1],
      lot: cityCentre,
      status: "COMPLETED",
      duration: 1,
      daysAgo: 18,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: cityCentreSlots[21],
      lot: cityCentre,
      status: "COMPLETED",
      duration: 2,
      daysAgo: 16,
      overstay: 0,
    },
    {
      vehicle: userEV,
      slot: cityCentreSlots[31],
      lot: cityCentre,
      status: "COMPLETED",
      duration: 3,
      daysAgo: 14,
      overstay: 0,
    },
    {
      vehicle: userCar,
      slot: howrahRailwaySlots[1],
      lot: howrahRailway,
      status: "COMPLETED",
      duration: 2,
      daysAgo: 12,
      overstay: 0,
    },

    // ---------- ACTIVE ----------
    {
      vehicle: userCar,
      slot: cityCentreSlots[2],
      lot: cityCentre,
      status: "ACTIVE",
      duration: 4,
      daysAgo: 0,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: cityCentreSlots[22],
      lot: cityCentre,
      status: "ACTIVE",
      duration: 3,
      daysAgo: 0,
      overstay: 0,
    },
    {
      vehicle: userEV,
      slot: howrahRailwaySlots[24],
      lot: howrahRailway,
      status: "ACTIVE",
      duration: 2,
      daysAgo: 0,
      overstay: 0,
    },

    // ---------- CONFIRMED ----------
    {
      vehicle: userCar,
      slot: cityCentreSlots[3],
      lot: cityCentre,
      status: "CONFIRMED",
      duration: 2,
      daysAgo: -1,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: howrahRailwaySlots[16],
      lot: howrahRailway,
      status: "CONFIRMED",
      duration: 3,
      daysAgo: -1,
      overstay: 0,
    },
    {
      vehicle: userEV,
      slot: cityCentreSlots[32],
      lot: cityCentre,
      status: "CONFIRMED",
      duration: 2,
      daysAgo: -2,
      overstay: 0,
    },

    // ---------- PENDING PAYMENT ----------
    {
      vehicle: userCar,
      slot: cityCentreSlots[4],
      lot: cityCentre,
      status: "PENDING_PAYMENT",
      duration: 2,
      daysAgo: 0,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: howrahRailwaySlots[17],
      lot: howrahRailway,
      status: "PENDING_PAYMENT",
      duration: 2,
      daysAgo: 0,
      overstay: 0,
    },
    {
      vehicle: userEV,
      slot: cityCentreSlots[33],
      lot: cityCentre,
      status: "PENDING_PAYMENT",
      duration: 1,
      daysAgo: 0,
      overstay: 0,
    },

    // ---------- CANCELLED ----------
    {
      vehicle: userCar,
      slot: cityCentreSlots[5],
      lot: cityCentre,
      status: "CANCELLED",
      duration: 2,
      daysAgo: 8,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: howrahRailwaySlots[18],
      lot: howrahRailway,
      status: "CANCELLED",
      duration: 2,
      daysAgo: 6,
      overstay: 0,
    },
    {
      vehicle: userEV,
      slot: cityCentreSlots[34],
      lot: cityCentre,
      status: "CANCELLED",
      duration: 3,
      daysAgo: 5,
      overstay: 0,
    },

    // ---------- EXPIRED ----------
    {
      vehicle: userCar,
      slot: howrahRailwaySlots[2],
      lot: howrahRailway,
      status: "EXPIRED",
      duration: 2,
      daysAgo: 4,
      overstay: 0,
    },
    {
      vehicle: userBike,
      slot: cityCentreSlots[23],
      lot: cityCentre,
      status: "EXPIRED",
      duration: 3,
      daysAgo: 3,
      overstay: 0,
    },

    // ---------- OVERSTAY ----------
    {
      vehicle: userCar,
      slot: cityCentreSlots[6],
      lot: cityCentre,
      status: "OVERSTAY_PAYMENT_PENDING",
      duration: 2,
      daysAgo: 2,
      overstay: 45,
    },
    {
      vehicle: userEV,
      slot: howrahRailwaySlots[25],
      lot: howrahRailway,
      status: "OVERSTAY_PAYMENT_PENDING",
      duration: 3,
      daysAgo: 1,
      overstay: 90,
    },
  ];

  const bookings = [];

  for (let i = 0; i < bookingData.length; i++) {
    const item = bookingData[i];

    const startTime = new Date(now);

    startTime.setDate(startTime.getDate() - item.daysAgo);

    startTime.setHours(10, 0, 0, 0);

    const endTime = new Date(startTime);

    endTime.setHours(endTime.getHours() + item.duration);

    // Prisma returns Decimal fields (pricePerHour, overstayRate) as
    // Decimal.js instances, not plain numbers — use .toNumber() rather
    // than Number() to convert them safely and precisely.
    const totalAmount = item.lot.pricePerHour.toNumber() * item.duration;

    const overstayAmount =
      item.overstay > 0
        ? Math.ceil((item.overstay / 60) * item.lot.overstayRate.toNumber())
        : 0;

    const booking = await prisma.booking.create({
      data: {
        userId: testUser.id,

        vehicleId: item.vehicle.id,

        lotId: item.lot.id,

        slotId: item.slot.id,

        bookingReference: `BK-${String(i + 1).padStart(6, "0")}`,

        durationHours: item.duration,

        startTime,

        endTime,

        totalAmount,

        bookingStatus: item.status,

        expiresAt:
          item.status === "PENDING_PAYMENT" || item.status === "EXPIRED"
            ? new Date(startTime.getTime() + 15 * 60000)
            : null,

        qrToken:
          item.status === "PENDING_PAYMENT" || item.status === "EXPIRED"
            ? null
            : crypto.randomUUID(),

        qrExpiresAt:
          item.status === "PENDING_PAYMENT" || item.status === "EXPIRED"
            ? null
            : endTime,

        entryTime:
          item.status === "ACTIVE" ||
          item.status === "COMPLETED" ||
          item.status === "OVERSTAY_PAYMENT_PENDING"
            ? new Date(startTime.getTime() + 5 * 60000)
            : null,

        exitTime:
          item.status === "COMPLETED"
            ? new Date(endTime.getTime() - 5 * 60000)
            : item.status === "OVERSTAY_PAYMENT_PENDING"
              ? new Date(endTime.getTime() + item.overstay * 60000)
              : null,

        overstayMinutes: item.overstay,

        overstayAmount,
      },
    });

    bookings.push(booking);
  }

  console.log(`✅ ${bookings.length} bookings created`);

  // ======================================================
  // PAYMENTS
  // ======================================================

  const paymentMethods = ["UPI", "CARD", "NET_BANKING", "WALLET"];

  const payments = [];

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];

    const paymentMethod = paymentMethods[i % paymentMethods.length];

    // -------------------------------
    // BOOKING PAYMENT
    // -------------------------------

    if (
      [
        "COMPLETED",
        "ACTIVE",
        "CONFIRMED",
        "CANCELLED",
        "OVERSTAY_PAYMENT_PENDING",
      ].includes(booking.bookingStatus)
    ) {
      const payment = await prisma.payment.create({
        data: {
          bookingId: booking.id,

          razorpayOrderId: `order_test_${i + 1}`,

          razorpayPaymentId: `pay_test_${i + 1}`,

          razorpaySignature: `signature_test_${i + 1}`,

          amount: booking.totalAmount,

          description: "Booking Payment",

          currency: "INR",

          paymentMethod,

          paymentStatus:
            booking.bookingStatus === "CANCELLED" ? "REFUNDED" : "SUCCESS",

          paymentType: "BOOKING",

          paidAt: booking.createdAt,

          refundedAt:
            booking.bookingStatus === "CANCELLED" ? booking.updatedAt : null,

          refundAmount:
            booking.bookingStatus === "CANCELLED" ? booking.totalAmount : 0,
        },
      });

      payments.push(payment);
    }

    // -------------------------------
    // PENDING BOOKING PAYMENT
    // -------------------------------

    if (booking.bookingStatus === "PENDING_PAYMENT") {
      const payment = await prisma.payment.create({
        data: {
          bookingId: booking.id,

          razorpayOrderId: `order_test_${i + 1}`,

          amount: booking.totalAmount,

          description: "Booking Payment",

          currency: "INR",

          paymentStatus: "PENDING",

          paymentType: "BOOKING",
        },
      });

      payments.push(payment);
    }

    // -------------------------------
    // OVERSTAY PAYMENT
    // -------------------------------

    if (booking.bookingStatus === "OVERSTAY_PAYMENT_PENDING") {
      const payment = await prisma.payment.create({
        data: {
          bookingId: booking.id,

          razorpayOrderId: `order_overstay_${i + 1}`,

          amount: booking.overstayAmount,

          description: "Overstay Payment",

          currency: "INR",

          paymentStatus: "PENDING",

          paymentType: "OVERSTAY",
        },
      });

      payments.push(payment);
    }
  }

  console.log(`✅ ${payments.length} payments created`);

  console.log("");
  console.log("====================================");
  console.log("Database seeded successfully!");
  console.log("====================================");
};

main()
  .then(async () => {
    console.log("🎉 Database seeded successfully.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });