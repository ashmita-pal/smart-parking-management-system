import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createPaymentOrderController,
  verifyPaymentController,getPaymentsController
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
  verifyPaymentController
);

router.get("/", verifyJWT, getPaymentsController);

export default router;