import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { cookieOptions } from "../constants/cookieOptions.js";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail, forgotPassword, resetPassword
} from "../services/auth.services.js";

const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if ([name, email, password, phone].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required.");
  }

  const result = await registerUser({
    name,
    email,
    password,
    phone,
  });

  const userResponse = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    phone: result.user.phone,
    role: result.user.role,
    isEmailVerified: result.user.isEmailVerified,
    createdAt: result.user.createdAt,
  };

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: userResponse,
        emailSent: result.emailSent,
        canResendVerification: result.canResendVerification,
      },
      result.message,
    ),
  );
});

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await loginUser({
    email,
    password,
  });

  const accessToken = generateAccessToken(user);
  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, userResponse, "Login successful"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const logoutController = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

const verifyEmailController = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Verification token is required.");
  }

  const result = await verifyEmail(token);

  return res.status(200).json(new ApiResponse(200, result, result.message));
});

const resendVerificationEmailController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required.");
  }

  const result = await resendVerificationEmail({
    email,
  });

  return res.status(200).json(new ApiResponse(200, result, result.message));
});

const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required.");
  }

  const result = await forgotPassword({
    email,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, result.message));
});

const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token?.trim()) {
    throw new ApiError(400, "Reset token is required.");
  }

  if (!newPassword?.trim()) {
    throw new ApiError(400, "New password is required.");
  }

  const result = await resetPassword({
    token,
    newPassword,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, result.message));
});

export {
  registerController,
  loginController,
  getCurrentUser,
  logoutController,
  verifyEmailController,
  resendVerificationEmailController,
  forgotPasswordController,
  resetPasswordController
};