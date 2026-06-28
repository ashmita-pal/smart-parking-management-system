import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createVehicleController, getMyVehicleController, getVehicleByIdController,
  updateVehicleByIdController, deleteVehicleByIdController
} from "../controllers/vehicle.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  createVehicleController,
);

router.get("/",verifyJWT, getMyVehicleController);

router.get("/:vehicleId",verifyJWT ,getVehicleByIdController);

router.patch("/:vehicleId", verifyJWT, updateVehicleByIdController);

router.delete("/:vehicleId", verifyJWT, deleteVehicleByIdController);

export default router;