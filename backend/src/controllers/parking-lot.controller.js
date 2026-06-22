import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  createParkingLot, getAllParkingLots, getParkingLotById, updateParkingLot, deleteParkingLot
} from "../services/parking-lot.services.js";

const createParkingLotController =
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      address,
      city,
      state,
      latitude,
      longitude,
      pricePerHour,
      totalSlots,
    } = req.body;

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      latitude === undefined ||
      longitude === undefined ||
      !pricePerHour ||
      !totalSlots
    ) {
      throw new ApiError(
        400,
        "All required fields must be provided",
      );
    }

    const parkingLot =
      await createParkingLot({
        name,
        description,
        address,
        city,
        state,
        latitude,
        longitude,
        pricePerHour,
        totalSlots,
      });

    return res.status(201).json(
      new ApiResponse(
        201,
        parkingLot,
        "Parking lot created successfully",
      ),
    );
  });

const getAllParkingLotsController =
  asyncHandler(async (req, res) => {
    const parkingLots =
      await getAllParkingLots();

    return res.status(200).json(
      new ApiResponse(
        200,
        parkingLots,
        "Parking lots fetched successfully",
      ),
    );
  });


const getParkingLotByIdController =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const parkingLot =
      await getParkingLotById(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        parkingLot,
        "Parking lot fetched successfully",
      ),
    );
  });


const updateParkingLotController =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const updatedParkingLot =
      await updateParkingLot(
        id,
        req.body,
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedParkingLot,
        "Parking lot updated successfully",
      ),
    );
  });

const deleteParkingLotController =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedParkingLot =
      await deleteParkingLot(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        deletedParkingLot,
        "Parking lot deleted successfully",
      ),
    );
  });

export { createParkingLotController, 
    getAllParkingLotsController, 
    getParkingLotByIdController, 
    updateParkingLotController, 
    deleteParkingLotController};