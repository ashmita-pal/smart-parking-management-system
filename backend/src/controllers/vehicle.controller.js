import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import { createVehicle, getMyVehicle, getVehicleById, 
  updateVehicleById, deleteVehicleById } from "../services/vehicle.services.js";

const createVehicleController = asyncHandler(async (req, res) => {
  const { vehicleNumber, vehicleType } = req.body;

  if (
    !vehicleNumber?.trim() ||
    !vehicleType?.trim()
  ) {
    throw new ApiError(
      400,
      "Vehicle number and vehicle type are required",
    );
  }

  const vehicle = await createVehicle({
    userId: req.user.id,
    vehicleNumber,
    vehicleType,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      vehicle,
      "Vehicle registered successfully",
    ),
  );
});

const getMyVehicleController = asyncHandler(async(req, res)=>{
  const userId = req.user.id;

  const vehicle = await getMyVehicle(userId);

  return res.status(200).json(
    new ApiResponse(200, vehicle, "Registered vehicle fetched successfully",),
  );
});

const getVehicleByIdController = asyncHandler(async(req, res)=>{
  const {vehicleId} = req.params;
  const userId=req.user.id;

  if(!vehicleId?.trim()){
    throw new ApiError(400, "Vehicle id is required",);
  }

  const vehicle = await getVehicleById(vehicleId, userId);

  return res.status(200).json(
    new ApiResponse(200, vehicle, "Vehicle fetched successfully",),
  );
});

const updateVehicleByIdController = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const { vehicleType, vehicleNumber } = req.body;

  if (!vehicleId?.trim()) {
    throw new ApiError(400, "Vehicle ID is required");
  }

  const updates = {
    vehicleType,
    vehicleNumber,
  };

  const hasUpdates = Object.values(updates).some(
    (value) => value !== undefined,
  );

  if (!hasUpdates) {
    throw new ApiError(
      400,
      "At least one field must be provided for update",
    );
  }

  const updatedVehicle = await updateVehicleById(
    vehicleId,
    req.user.id,
    updates,
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedVehicle,
      "Vehicle updated successfully",
    ),
  );
});

const deleteVehicleByIdController = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  if (!vehicleId?.trim()) {
    throw new ApiError(
      400,
      "Vehicle ID is required"
    );
  }

  const deletedVehicle = await deleteVehicleById(vehicleId,req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedVehicle,
      "Vehicle deleted successfully"
    )
  );
});

export { createVehicleController, getMyVehicleController, getVehicleByIdController, 
  updateVehicleByIdController,  deleteVehicleByIdController};