import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";

import { ApiError } from "../utils/api-error.js";

import {
  generateVerificationToken,
  hashToken,
} from "../utils/token.utils.js";

import { sendVerificationEmail, sendPasswordResetEmail } from "./email.services.js";


const sendVerificationEmailToUser = async ({
  user,
  token,
}) => {
  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationUrl,
  });
};


const registerUser = async ({
  name,
  email,
  password,
  phone,
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new ApiError(
        409,
        "User already exists with this email."
      );
    }

    throw new ApiError(
      409,
      "Email is already registered but not verified. Please verify your email or request a new verification email."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { token, hashedToken } =
    generateVerificationToken();

  const verificationExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,

      emailVerificationToken: hashedToken,
      emailVerificationExpiry:
        verificationExpiry,
    },
  });

  let emailSent = true;

  try {
    await sendVerificationEmailToUser({
      user,
      token,
    });
  } catch (error) {
    console.error("Verification email sending failed:", error);

    emailSent = false;
  }

  return {
    user,
    emailSent,
    canResendVerification: !emailSent,
    message: emailSent
      ? "Registration successful. Please verify your email."
      : "Registration successful, but verification email could not be sent. Please request a new verification email.",
  };
};


const loginUser = async ({
  email,
  password,
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email before logging in."
    );
  }

  return user;
};


const verifyEmail = async (token) => {
  const hashedToken = hashToken(token);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        emailVerificationToken: hashedToken,
      },
    });

    if (!user) {
      throw new ApiError(
        400,
        "Invalid verification token."
      );
    }

    if (user.isEmailVerified) {
      throw new ApiError(
        400,
        "Email is already verified."
      );
    }

    if (
      !user.emailVerificationExpiry ||
      user.emailVerificationExpiry < new Date()
    ) {
      throw new ApiError(
        400,
        "Verification token has expired."
      );
    }

    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      message: "Email verified successfully.",
    };
  });
};


const resendVerificationEmail = async ({
  email,
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "User not found."
    );
  }

  if (user.isEmailVerified) {
    throw new ApiError(
      400,
      "Email is already verified."
    );
  }

  const { token, hashedToken } =
    generateVerificationToken();

  const verificationExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry:
        verificationExpiry,
    },
  });

  try {
    await sendVerificationEmailToUser({
      user,
      token,
    });
  } catch (error) {
    console.error(
      "Verification email sending failed:",
      error
    );

    throw new ApiError(
      503,
      "Unable to send verification email. Please try again later."
    );
  }

  return {
    email: user.email,
    message:
      "Verification email sent successfully.",
  };
};

const forgotPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /**
   * Prevent Email Enumeration
   * Always return success even if the email doesn't exist.
   */
  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  const { token, hashedToken } = generateVerificationToken();

  const passwordResetExpiry = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpiry,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      resetUrl,
    });
  } catch (error) {
    console.error("Password reset email sending failed:", error);

    throw new ApiError(
      503,
      "Unable to send password reset email. Please try again later."
    );
  }

  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
};

const resetPassword = async({token, newPassword})=>{
  const hashedToken= hashToken(token);

  const user =await prisma.user.findFirst({
    where:{
      passwordResetToken: hashedToken,
    },
  });

  if(!user){
    throw new ApiError(400, "Invalid password reset token");
  }

  if(!user.passwordResetExpiry || user.passwordResetExpiry< new Date()){
    throw new ApiError(400, "Password reset token expired");
  }

  const hashedPassword= await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where:{
      id: user.id,
    },
    data:{
      password: hashedPassword,
      passwordResetExpiry: null,
      passwordResetToken: null,
    },
  });

  return {
    message: "Password reset successfully",
  }
}


export {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword
};