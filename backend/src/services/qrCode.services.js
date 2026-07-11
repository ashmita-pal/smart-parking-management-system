import QRCode from "qrcode";

const generateBookingQRCode = async (booking) => {
  const payload = {
    bookingId: booking.id,
    bookingReference: booking.bookingReference,
    userId: booking.userId,
    vehicleId: booking.vehicleId,
    issuedAt: new Date().toISOString(),
    expiresAt: booking.endTime,
  };

  const qrCode = await QRCode.toDataURL(
    JSON.stringify(payload),
  );

  return qrCode;
};

export { generateBookingQRCode };