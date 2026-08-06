import express from "express";

import {
  getDashboardSummaryController,
  getBookingStatisticsController,
  getRevenueStatisticsController,
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import { USER_ROLES } from "../constants/roles.js";

const router = express.Router();

router.use(
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),
);

router.get("/summary", getDashboardSummaryController);

router.get("/bookings", getBookingStatisticsController);

router.get("/revenue", getRevenueStatisticsController);

export default router;