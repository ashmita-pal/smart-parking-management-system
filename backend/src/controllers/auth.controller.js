import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { registerUser } from "../services/auth.services.js";

const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

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
    createdAt: user.createdAt,
  };

  return res.status(201).json(
    new ApiResponse(
      201,
      userResponse,
      "User registered successfully",
    ),
  );
});

export { registerController };