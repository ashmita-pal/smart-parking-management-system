import transporter from "../config/mail.config.js";

import verifyEmailTemplate from "../templates/verify-email.template.js";

import resetPasswordTemplate from "../templates/reset-password.template.js";
import passwordResetSuccessTemplate from "../templates/reset-password.template.js";

const sendVerificationEmail = async ({
  name,
  email,
  verificationCode,
}) => {
  const html = verifyEmailTemplate({
    name,
    verificationCode,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Verify Your Email | Smart Parking Management",
    html,
  });
};

const sendPasswordResetEmail = async ({
  name,
  email,
  resetUrl,
}) => {
  const html = resetPasswordTemplate({
    name,
    resetUrl,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Reset Your Password | Smart Parking Management",
    html,
  });
};

const passwordResetSuccessfulEmail = async ({ name, email }) => {
  const html = passwordResetSuccessTemplate({
    name,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Password Reset Successful | ParkSphere",
    html,
  });
};

export {
  sendVerificationEmail,
  sendPasswordResetEmail,
  passwordResetSuccessfulEmail
};