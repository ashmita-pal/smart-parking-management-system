import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

const testController = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        project: "Smart Parking Management System",
      },
      "Controller is working",
    ),
  );
});

const testDatabaseConnection = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        usersCount: users.length,
      },
      "Database connection successful",
    ),
  );
});

export { testController, testDatabaseConnection };