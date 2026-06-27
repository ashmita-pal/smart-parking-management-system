import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import { createParkingSlot, getParkingSlots, getParkingSlotById, updateParkingSlot, 
  updateParkingSlotStatus, deleteParkingSlot } from "../services/parking-slot.services.js";

import {SLOT_STATUS} from "../constants/parking.constants.js";

const createParkingSlotController = asyncHandler(async (req, res) => {
  const {
    lotId,
    floorNumber,
    slotNumber,
    slotType,
  } = req.body;

  // Validation
  if (
    !lotId?.trim() ||
    !slotNumber?.trim() ||
    !slotType?.trim()
  ) {
    throw new ApiError(
      400,
      "Lot ID, Slot Number and Slot Type are required",
    );
  }

  const parkingSlot = await createParkingSlot({
    lotId,
    floorNumber: floorNumber ?? 1,
    slotNumber,
    slotType,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      parkingSlot,
      "Parking slot created successfully",
    ),
  );
});

const getParkingSlotsController =
  asyncHandler(async (req, res) => {
    const filters = req.query;
    if (filters.floorNumber && Number.isNaN(Number(filters.floorNumber))) {
    throw new ApiError(400, "Floor number must be a valid number");
  }
    const parkingSlots =
      await getParkingSlots(filters);

    return res.status(200).json(
      new ApiResponse(
        200,
        parkingSlots,
        "Parking slots fetched successfully",
      ),
    );
  });

const getParkingSlotByIdController =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id?.trim()) {
      throw new ApiError(
        400,
        "Parking slot ID is required",
      );
    }

    const parkingSlot =
      await getParkingSlotById(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        parkingSlot,
        "Parking slot fetched successfully",
      ),
    );
  });

const updateParkingSlotController =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id?.trim()) {
      throw new ApiError(
        400,
        "Parking slot ID is required",
      );
    }

    const {
      floorNumber,
      slotNumber,
      slotType,
    } = req.body;

    if (
      floorNumber === undefined &&
      !slotNumber &&
      !slotType
    ) {
      throw new ApiError(
        400,
        "At least one field must be provided for update",
      );
    }

    const updatedParkingSlot =
      await updateParkingSlot(id, {
        floorNumber,
        slotNumber,
        slotType,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedParkingSlot,
        "Parking slot updated successfully",
      ),
    );
  });

const updateParkingSlotStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id?.trim()) {
    throw new ApiError(400, "Parking slot ID is required");
  }

  if (!status?.trim()) {
    throw new ApiError(400, "Status is required");
  }


  if (!Object.values(SLOT_STATUS).includes(status)) {
    throw new ApiError(400, "Invalid slot status");
  }

  const parkingSlot = await updateParkingSlotStatus(id, status);

  return res.status(200).json(
    new ApiResponse(
      200,
      parkingSlot,
      "Parking slot status updated successfully",
    ),
  );
});

const deleteParkingSlotByIdController = asyncHandler(async (req, res) =>{
  const { id } = req.params;
  if (!id?.trim()) {
    throw new ApiError(400, "Parking slot ID is required");
  }
  const deletedSlot= await deleteParkingSlot(id);
  return res.status(200).json(
    new ApiResponse(
      200,
      deletedSlot,
      "Parking slot slot deleted successfully",
    ),
  );
});

export { createParkingSlotController, getParkingSlotsController, getParkingSlotByIdController, 
  updateParkingSlotController, updateParkingSlotStatusController, deleteParkingSlotByIdController };