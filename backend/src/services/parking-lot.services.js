import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

const createParkingLot = async (parkingLotData) => {
  const existingParkingLot =
    await prisma.parkingLot.findFirst({
      where: {
        name: parkingLotData.name,
        city: parkingLotData.city,
      },
    });

  if (existingParkingLot) {
    throw new ApiError(
      409,
      "Parking lot already exists",
    );
  }

  const parkingLot =
    await prisma.parkingLot.create({
      data: parkingLotData,
    });

  return parkingLot;
};

const getAllParkingLots = async () => {
  const parkingLots =
    await prisma.parkingLot.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return parkingLots;
};


const getParkingLotById = async (parkingLotId) => {
  const parkingLot =
    await prisma.parkingLot.findUnique({
      where: {
        id: parkingLotId,
      },
    });

  if (!parkingLot) {
    throw new ApiError(
      404,
      "Parking lot not found",
    );
  }

  return parkingLot;
};

const updateParkingLot = async (
  parkingLotId,
  updateData,
) => {
  const existingParkingLot =
    await prisma.parkingLot.findUnique({
      where: {
        id: parkingLotId,
      },
    });

  if (!existingParkingLot) {
    throw new ApiError(
      404,
      "Parking lot not found",
    );
  }

  const updatedParkingLot =
    await prisma.parkingLot.update({
      where: {
        id: parkingLotId,
      },
      data: updateData,
    });

  return updatedParkingLot;
};

const deleteParkingLot = async (
  parkingLotId,
) => {
  const existingParkingLot =
    await prisma.parkingLot.findUnique({
      where: {
        id: parkingLotId,
      },
    });

  if (!existingParkingLot) {
    throw new ApiError(
      404,
      "Parking lot not found",
    );
  }

  const deletedParkingLot =
    await prisma.parkingLot.update({
      where: {
        id: parkingLotId,
      },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

  return deletedParkingLot;
};

export { createParkingLot, getAllParkingLots, getParkingLotById, updateParkingLot, deleteParkingLot  };