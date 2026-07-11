import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createPaymentOrderController,
  verifyPaymentController,
} from "../controllers/payment.controller.js";

const router = Router();

router.post(
  "/:bookingId/order",
  verifyJWT,
  createPaymentOrderController,
);

router.post(
  "/:bookingId/verify",
  verifyJWT,
  verifyPaymentController,
);

export default router;