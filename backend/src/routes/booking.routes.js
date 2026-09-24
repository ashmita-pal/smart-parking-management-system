import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createBookingController, getBookingsController, getBookingByIdController, 
  cancelBookingController, checkInController, checkOutController, gateStatusController,

} from "../controllers/booking.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  createBookingController,
);

router.get( "/", verifyJWT, getBookingsController,
);

router.get("/:bookingId", verifyJWT, getBookingByIdController,
);

router.patch("/:bookingId/cancel", verifyJWT, cancelBookingController,
);
 
router.post("/check-in", verifyJWT, checkInController);

router.post("/check-out", verifyJWT, checkOutController);

router.get("/:bookingId/gate-status", verifyJWT, gateStatusController);

export default router;