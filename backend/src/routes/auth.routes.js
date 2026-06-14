import { Router } from "express";
import { registerController, loginController, getCurrentUser } from "../controllers/auth.controller.js";
import { verify } from "node:crypto";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/me",verifyJWT, getCurrentUser);

export default router;