import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createBookingController, getMyBookingsController, getBookingByIdController, cancelBookingController
} from "../controllers/booking.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  createBookingController,
);

router.get(
  "/",
  verifyJWT,
  getMyBookingsController,
);

router.get(
  "/:bookingId",
  verifyJWT,
  getBookingByIdController,
);

router.patch(
  "/:bookingId/cancel",
  verifyJWT,
  cancelBookingController,
);
 
export default router;