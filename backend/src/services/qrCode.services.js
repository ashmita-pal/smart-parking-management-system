import QRCode from "qrcode";
import crypto from "crypto";
const generateBookingQRCode = async (booking) => {
  const qrToken = crypto.randomUUID();

  const qrImage = await QRCode.toDataURL(qrToken)


  return {
    qrCode, qrImage,
  };
};

export { generateBookingQRCode };