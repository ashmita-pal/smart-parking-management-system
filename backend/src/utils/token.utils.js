import crypto from "crypto";

const generateSecureToken = (size = 32) => {
  return crypto.randomBytes(size).toString("hex");
};

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

const generateVerificationToken = () => {
  const token = generateSecureToken();

  return {
    token,
    hashedToken: hashToken(token),
  };
};

const generateResetPasswordToken = () => {
  const token = generateSecureToken();

  return {
    token,
    hashedToken: hashToken(token),
  };
};

export {
  generateVerificationToken,
  generateResetPasswordToken,
  hashToken,
};