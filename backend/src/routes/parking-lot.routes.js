import { Router } from "express";

import { verifyJWT }
  from "../middleware/auth.middleware.js";

import { authorizeRoles }
  from "../middleware/role.middleware.js";

import { USER_ROLES }
  from "../constants/roles.js";

import {
  createParkingLotController, 
  getAllParkingLotsController, 
  getParkingLotByIdController, 
  updateParkingLotController,
  deleteParkingLotController
} from "../controllers/parking-lot.controller.js";


const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  createParkingLotController,
);

router.get("/",getAllParkingLotsController);

router.get("/:id",getParkingLotByIdController);

router.patch("/:id",verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN), updateParkingLotController);

router.delete("/:id",verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN), deleteParkingLotController);

export default router;