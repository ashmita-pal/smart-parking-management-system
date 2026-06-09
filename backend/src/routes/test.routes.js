import { Router } from "express";
import {
  testController,
  testDatabaseConnection,
} from "../controllers/test.controller.js";

const router = Router();

router.get("/", testController);
router.get("/db", testDatabaseConnection);

export default router;