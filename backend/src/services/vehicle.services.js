import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

const createVehicle = async ({
  userId,
  vehicleNumber,
  vehicleType,
}) => {
  // Normalize vehicle number
  const normalizedVehicleNumber = vehicleNumber
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();

  // Check if vehicle already exists
  const existingVehicle = await prisma.vehicle.findUnique({
    where: {
      vehicleNumber: normalizedVehicleNumber,
    },
  });

  if (existingVehicle && !existingVehicle.deletedAt) {
    throw new ApiError(
      409,
      "Vehicle number already registered",
    );
  }

  // Optional: If the vehicle exists but was soft deleted,
  // restore it instead of creating a new one.
  if (existingVehicle && existingVehicle.deletedAt) {
    const restoredVehicle = await prisma.vehicle.update({
      where: {
        vehicleNumber: normalizedVehicleNumber,
      },
      data: {
        userId,
        vehicleType,
        deletedAt: null,
      },
    });

    return restoredVehicle;
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      userId,
      vehicleNumber: normalizedVehicleNumber,
      vehicleType,
    },
  });

  return vehicle;
};

const getMyVehicle = async(userId)=>{
  const vehicles= prisma.vehicle.findMany({
    where:{
      userId: userId,
      deletedAt: null,
    },
    select:{
      userId: true,
      id: true,
      vehicleNumber: true,
      vehicleType: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return vehicles;
};

const getVehicleById = async(vehicleId, userId) =>{
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      deletedAt: null,
    },
    select:{
    id: true,
    vehicleNumber: true,
    vehicleType: true,
    createdAt: true,
    userId: true,
    },
  });

  if(!vehicle){
    throw new ApiError(404, "Vehicle not registered");
  }

  if(userId !== vehicle.userId){
    throw new ApiError(403,"You are not authorized to get the vehicle");
  }

  return{
    id: vehicle.id,
    vehicleNumber: vehicle.vehicleNumber,
    vehicleType: vehicle.vehicleType,
    createdAt: vehicle.createdAt,
  };
};

const updateVehicleById = async (
  vehicleId,
  userId,
  { vehicleType, vehicleNumber },
) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      vehicleNumber: true,
      vehicleType: true,
    },
  });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  if (vehicle.userId !== userId) {
    throw new ApiError(
      403,
      "You are not authorized to access this vehicle",
    );
  }

  const normalizedVehicleNumber = vehicleNumber
    ? vehicleNumber.trim().replace(/\s+/g, "").toUpperCase()
    : undefined;

  if (
    normalizedVehicleNumber &&
    normalizedVehicleNumber !== vehicle.vehicleNumber
  ) {
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        vehicleNumber: normalizedVehicleNumber,
      },
    });

    if (
      existingVehicle &&
      existingVehicle.id !== vehicleId &&
      !existingVehicle.deletedAt
    ) {
      throw new ApiError(
        409,
        "Vehicle number already registered",
      );
    }
  }

  // Step 5: Update vehicle
  const updatedVehicle = await prisma.vehicle.update({
    where: {
      id: vehicleId,
    },
    data: {
      vehicleNumber:
        normalizedVehicleNumber ?? vehicle.vehicleNumber,
      vehicleType:
        vehicleType ?? vehicle.vehicleType,
    },
    select: {
      id: true,
      vehicleNumber: true,
      vehicleType: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedVehicle;
};

const deleteVehicleById = async (vehicleId, userId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  if (vehicle.userId !== userId) {
    throw new ApiError(
      403,
      "You are not authorized to delete this vehicle"
    );
  }

  const deletedVehicle = await prisma.vehicle.update({
    where: {
      id: vehicleId,
    },
    data: {
      deletedAt: new Date(),
    },
    select: {
      id: true,
      vehicleNumber: true,
      vehicleType: true,
      createdAt: true,
      deletedAt: true,
    },
  });

  return deletedVehicle;
};

export { createVehicle, getMyVehicle,getVehicleById, updateVehicleById, deleteVehicleById};