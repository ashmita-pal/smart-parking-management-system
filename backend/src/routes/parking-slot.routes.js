import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import { USER_ROLES } from "../constants/roles.js";

import {
  createParkingSlotController, getParkingSlotsController, getParkingSlotByIdController, 
  updateParkingSlotController, updateParkingSlotStatusController, deleteParkingSlotByIdController
} from "../controllers/parking-slot.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  createParkingSlotController,
);

router.get("/",getParkingSlotsController,);

router.get("/:id", getParkingSlotByIdController);

router.patch("/:id", verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN), updateParkingSlotController);

router.patch("/:id/status", verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN), updateParkingSlotStatusController );

router.delete("/:id", verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),deleteParkingSlotByIdController );
  
export default router;