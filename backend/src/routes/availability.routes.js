import { Router } from "express";

import {
  getAvailableParkingController,
} from "../controllers/availability.controller.js";

const router = Router();

router.get("/", getAvailableParkingController);

export default router;