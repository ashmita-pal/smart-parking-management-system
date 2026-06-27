import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

const createParkingSlot = async ({
  lotId,
  floorNumber,
  slotNumber,
  slotType,
}) => {
  // Check if parking lot exists
  const parkingLot = await prisma.parkingLot.findUnique({
    where: {
      id: lotId,
    },
  });

  if (!parkingLot) {
    throw new ApiError(404, "Parking lot not found");
  }

  // Check duplicate slot
  const existingSlot = await prisma.parkingSlot.findFirst({
    where: {
      lotId,
      floorNumber,
      slotNumber,
      deletedAt: null,
    },
  });

  if (existingSlot) {
    throw new ApiError(
      409,
      "Parking slot already exists on this floor",
    );
  }

  const createdParkingSlot =
    await prisma.parkingSlot.create({
      data: {
        lotId,
        floorNumber,
        slotNumber,
        slotType,
      },
    });

  return createdParkingSlot;
};

const getParkingSlots = async (filters) => {
  const where = {
    deletedAt: null,
  };

  if (filters.lotId) {
    const parkingLot = await prisma.parkingLot.findUnique({
      where: {
        id: filters.lotId,
      },
    });

    if (!parkingLot) {
      throw new ApiError(
        404,
        "Parking lot not found",
      );
    }

    where.lotId = filters.lotId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.slotType) {
    where.slotType = filters.slotType;
  }

  if (filters.floorNumber) {
    where.floorNumber = Number(
      filters.floorNumber,
    );
  }

  const parkingSlots =
    await prisma.parkingSlot.findMany({
      where,
      orderBy: [
        {
          floorNumber: "asc",
        },
        {
          slotNumber: "asc",
        },
      ],
    });

  return parkingSlots;
};

const getParkingSlotById = async (slotId) => {
  const parkingSlot = await prisma.parkingSlot.findFirst({
    where: {
      id: slotId,
      deletedAt: null,
    },
    include: {
      lot: true,
    },
  });

  if (!parkingSlot) {
    throw new ApiError(
      404,
      "Parking slot not found",
    );
  }

  return parkingSlot;
};

const updateParkingSlot = async (
  slotId,
  {
    floorNumber,
    slotNumber,
    slotType,
  },
) => {
  const existingParkingSlot =
    await prisma.parkingSlot.findFirst({
      where: {
        id: slotId,
        deletedAt: null,
      },
    });

  if (!existingParkingSlot) {
    throw new ApiError(
      404,
      "Parking slot not found",
    );
  }

  // Check duplicate slot if floor or slot number changes
  if (
    floorNumber !== undefined ||
    slotNumber !== undefined
  ) {
    const duplicateSlot =
      await prisma.parkingSlot.findFirst({
        where: {
          lotId: existingParkingSlot.lotId,
          floorNumber:
            floorNumber ??
            existingParkingSlot.floorNumber,
          slotNumber:
            slotNumber ??
            existingParkingSlot.slotNumber,
          id: {
            not: slotId,
          },
          deletedAt: null,
        },
      });

    if (duplicateSlot) {
      throw new ApiError(
        409,
        "A parking slot with the same floor and slot number already exists.",
      );
    }
  }

  const updatedParkingSlot =
    await prisma.parkingSlot.update({
      where: {
        id: slotId,
      },
      data: {
        ...(floorNumber !== undefined && {
          floorNumber,
        }),
        ...(slotNumber && {
          slotNumber,
        }),
        ...(slotType && {
          slotType,
        }),
      },
    });

  return updatedParkingSlot;
};

const updateParkingSlotStatus = async (slotId, status) => {
  const existingParkingSlot = await prisma.parkingSlot.findFirst({
    where: {
      id: slotId,
      deletedAt: null,
    },
  });

  if (!existingParkingSlot) {
    throw new ApiError(404, "Parking slot not found");
  }

  const updatedParkingSlot = await prisma.parkingSlot.update({
    where: {
      id: slotId,
    },
    data: {
      status,
    },
  });

  return updatedParkingSlot;
};

const deleteParkingSlot = async(slotId)=>{
  const existingSlot = await prisma.parkingSlot.findFirst({
    where:{
      id: slotId,
      deletedAt: null,
    },
  });
  
  if(!existingSlot){
    throw new ApiError(404, "Parking slot not found")
  }
  const deletedSlot= await prisma.parkingSlot.update({
    where: {
      id: slotId,
    },
    data: {
      deletedAt: new Date(),
    },
  })
  return deletedSlot
};

export { createParkingSlot, getParkingSlots, getParkingSlotById, updateParkingSlot, 
  updateParkingSlotStatus, deleteParkingSlot};