import transporter from "../config/mail.config.js";
import verifyEmailTemplate from "../templates/verify-email.template.js";
import resetPasswordTemplate from "../templates/reset-password.template.js";

const sendVerificationEmail = async ({
  name,
  email,
  verificationUrl,
}) => {
  const html = verifyEmailTemplate({
    name,
    verificationUrl,
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


export {
  sendVerificationEmail, sendPasswordResetEmail
};