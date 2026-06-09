import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/api-error.js";

const registerUser = async ({ name, email, password, phone }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
    },
  });

  return user;
};

export { registerUser };