import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { registerUser, loginUser } from "../services/auth.services.js";
import { ApiError } from "../utils/api-error.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { cookieOptions } from "../constants/cookieOptions.js";

const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (
  [name, email, password, phone].some(
    (field) => !field?.trim()
  )
) {
  throw new ApiError(400, "All fields are required");
}
  const user = await registerUser({
    name,
    email,
    password,
    phone,
  });

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User registered successfully"));
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


  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };

  const accessToken= generateAccessToken(user);

  return res.status(200) .cookie("accessToken", accessToken,cookieOptions,).json(
    new ApiResponse(
      200,
      userResponse,
      "Login successful",
    ),
  );
}); 

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const logoutController = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie(
      "accessToken",
      cookieOptions,
    )
    .json(
      new ApiResponse(
        200,
        {},
        "Logout successful",
      ),
    );
});

export { registerController, loginController , getCurrentUser, logoutController};