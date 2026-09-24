import bcrypt from "bcrypt";
import { randomInt } from "crypto";
import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import {
  generateResetPasswordToken,
  hashToken,
} from "../utils/token.utils.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  passwordResetSuccessfulEmail,
} from "./email.services.js";

/* Generate a secure 6-digit verification code */
const generateVerificationCode = () => {
  return randomInt(100000, 1000000).toString();
};

/* Private Helper: Sends verification code */
const sendVerificationEmailToUser = async ({ user, code }) => {
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationCode: code,
  });
};

/* Register User */
const registerUser = async ({ name, email, password, phone }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new ApiError(409, "User already exists with this email.");
    }

    throw new ApiError(
      409,
      "Email is already registered but not verified. Please verify your email or request a new verification code.",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate 6-digit verification code
  const verificationCode = generateVerificationCode();

  // Store only the hashed version of the code
  const hashedCode = hashToken(verificationCode);

  // Verification code expires after 5 minutes
  const verificationExpiry = new Date(
    Date.now() + 5 * 60 * 1000,
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      emailVerificationToken: hashedCode,
      emailVerificationExpiry: verificationExpiry,
    },
  });

  let emailSent = true;

  try {
    await sendVerificationEmailToUser({
      user,
      code: verificationCode,
    });

    // Record the time when the verification email was successfully sent
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationSentAt: new Date(),
      },
    });
  } catch (error) {
    console.error(
      "Verification email sending failed:",
      error,
    );

    emailSent = false;
  }

  return {
    user,
    emailSent,
    canResendVerification: !emailSent,
    message: emailSent
      ? "Registration successful. Please check your email for the verification code."
      : "Registration successful, but verification email could not be sent. Please request a new verification code.",
  };
};

/* Login User */
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email before logging in.",
    );
  }

  return user;
};

/* Verify Email Using 6-Digit Code */
const verifyEmail = async ({ email, code }) => {
  const hashedCode = hashToken(code);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(
        400,
        "Invalid email or verification code.",
      );
    }

    if (user.isEmailVerified) {
      throw new ApiError(
        400,
        "Email is already verified.",
      );
    }

    if (
      !user.emailVerificationToken ||
      user.emailVerificationToken !== hashedCode
    ) {
      throw new ApiError(
        400,
        "Invalid verification code.",
      );
    }

    if (
      !user.emailVerificationExpiry ||
      user.emailVerificationExpiry < new Date()
    ) {
      throw new ApiError(
        400,
        "Verification code has expired.",
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

/* Resend Verification Code */
const resendVerificationEmail = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isEmailVerified) {
    throw new ApiError(
      400,
      "Email is already verified.",
    );
  }

  // User can request a new verification code only once every 5 minutes
  const RESEND_COOLDOWN = 5 * 60 * 1000;

  if (user.emailVerificationSentAt) {
    const elapsedTime =
      Date.now() -
      user.emailVerificationSentAt.getTime();

    if (elapsedTime < RESEND_COOLDOWN) {
      const remainingSeconds = Math.ceil(
        (RESEND_COOLDOWN - elapsedTime) / 1000,
      );

      throw new ApiError(
        429,
        `Please wait ${remainingSeconds} seconds before requesting another verification code.`,
      );
    }
  }

  // Generate a completely new 6-digit verification code
  const verificationCode = generateVerificationCode();

  // Store only the hashed version
  const hashedCode = hashToken(verificationCode);

  // New verification code expires after 5 minutes
  const verificationExpiry = new Date(
    Date.now() + 5 * 60 * 1000,
  );

  try {
    await sendVerificationEmailToUser({
      user,
      code: verificationCode,
    });
  } catch (error) {
    console.error(
      "Verification email sending failed:",
      error,
    );

    throw new ApiError(
      503,
      "Unable to send verification email. Please try again later.",
    );
  }

  // Email was successfully sent, so replace the old code
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: hashedCode,
      emailVerificationExpiry: verificationExpiry,
      emailVerificationSentAt: new Date(),
    },
  });

  return {
    email: user.email,
    message: "Verification code sent successfully.",
  };
};

/* Forgot Password */
const forgotPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /*
   * Prevent Email Enumeration
   * Always return success even if the email doesn't exist.
   */
  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  // Generate secure password reset token
  const { token, hashedToken } =
    generateResetPasswordToken();

  // Password reset token expires after 15 minutes
  const passwordResetExpiry = new Date(
    Date.now() + 15 * 60 * 1000,
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

  // Create password reset URL
  const resetUrl =
    `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      resetUrl,
    });
  } catch (error) {
    console.error(
      "Password reset email sending failed:",
      error,
    );

    throw new ApiError(
      503,
      "Unable to send password reset email. Please try again later.",
    );
  }

  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
};

/* Reset Password */
const resetPassword = async ({
  token,
  newPassword,
}) => {
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
    },
  });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid Password Reset Token",
    );
  }

  if (
    !user.passwordResetExpiry ||
    user.passwordResetExpiry < new Date()
  ) {
    throw new ApiError(
      400,
      "Reset Password token expired",
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10,
  );

  // Change password and invalidate reset token
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      passwordResetExpiry: null,
      passwordResetToken: null,
    },
  });

  // Send password reset successful email
  try {
    await passwordResetSuccessfulEmail({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(
      "Password reset successful email sending failed:",
      error,
    );
  }

  return {
    message: "Password Reset Successful.",
  };
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  passwordResetSuccessfulEmail
};