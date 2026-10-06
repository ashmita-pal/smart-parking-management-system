import { Router } from "express";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  registerController,
  loginController,
  logoutController,
  getCurrentUser,
  verifyEmailController,
  resendVerificationEmailController, forgotPasswordController, resetPasswordController,
  getAllUsersController, getUserByIdController
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerController);

/**
 * @route POST /api/v1/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 */
router.post("/verify-email", verifyEmailController);

/**
 * @route POST /api/v1/auth/resend-verification-email
 * @desc Resend email verification link
 * @access Public
 */
router.post(
  "/resend-verification-email",
  resendVerificationEmailController
);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post("/login", loginController);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post("/forgot-password", forgotPasswordController);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password using reset token
 * @access Public
 */
router.post("/reset-password", resetPasswordController);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout current user
 * @access Private
 */
router.post("/logout", verifyJWT, logoutController);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current logged-in user
 * @access Private
 */
router.get("/me", verifyJWT, getCurrentUser);

/**
 * @route GET /api/v1/auth/users
 * @desc Get all users
 * @access Admin
 */
router.get(
  "/users",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  getAllUsersController,
);

/**
 * @route GET /api/v1/auth/users/:userId
 * @desc Get user by ID
 * @access Admin
 */
router.get(
  "/users/:userId",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  getUserByIdController,
);

export default router;