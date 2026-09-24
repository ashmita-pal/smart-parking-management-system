import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import api from "../../api/api.js";

function BookingConfirmation() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch booking details
  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/bookings/${bookingId}`);

        console.log("Booking confirmation:", response.data);

        setBooking(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch booking confirmation:",
          error,
        );

        setError(
          error.response?.data?.message ||
            "Unable to load booking confirmation.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  // Format duration using actual start and end time
  function formatDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const differenceInMinutes = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60),
    );

    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;

    if (minutes === 0) {
      return `${hours} Hours`;
    }

    if (hours === 0) {
      return `${minutes} Minutes`;
    }

    return `${hours} Hours ${minutes} Minutes`;
  }

  // Format amount
  function formatAmount(amount) {
    return Number(amount).toFixed(2);
  }

  // Loading state
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden font-sans py-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-gray-400">
              Loading booking confirmation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden font-sans py-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 px-8 py-6 text-center">
              <p className="text-red-400">
                {error || "Booking not found."}
              </p>

              <Link
                to="/my-bookings"
                className="mt-5 inline-block rounded-xl border border-gray-700 bg-white/5 px-5 py-3 text-sm font-medium text-gray-300 transition-all hover:border-cyan-500/40 hover:bg-white/10 hover:text-white"
              >
                VIEW MY BOOKINGS
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden font-sans py-10">

      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-[25%] right-[-15%] w-100 h-100 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-6">

        {/* Success Message */}
        <section className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 shadow-[0_0_25px_rgba(34,197,94,0.25)]">
            <span className="text-3xl text-green-400">
              ✓
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold text-white tracking-tight">
            Booking Confirmed
          </h1>

          <p className="mt-2 text-gray-400">
            Your parking booking has been successfully confirmed.
          </p>
        </section>

        {/* QR Code */}
        <section className="mt-8 rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-8 text-center shadow-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300">

          <h2 className="text-xl font-bold text-white">
            Your Parking QR Code
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Show this QR code at the parking entrance.
          </p>

          <div className="mx-auto mt-6 flex h-56 w-56 items-center justify-center rounded-xl border-4 border-gray-700 bg-white shadow-[0_0_30px_rgba(6,182,212,0.15)]">

            {booking.qrToken ? (
              <QRCodeSVG
                value={booking.qrToken}
                size={190}
                level="H"
              />
            ) : (
              <p className="px-4 text-sm text-gray-500">
                QR code is not available.
              </p>
            )}

          </div>

          <p className="mt-5 text-sm text-gray-500">
            Booking ID:{" "}
            <span className="font-semibold text-cyan-400">
              {booking.bookingReference}
            </span>
          </p>
        </section>

        {/* Booking Details */}
        <section className="mt-6 rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-8 shadow-2xl backdrop-blur-md hover:border-blue-500/30 transition-all duration-300">

          <h2 className="text-xl font-bold text-white">
            Booking Details
          </h2>

          <div className="mt-6 space-y-4">

            {/* Booking Reference */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Booking Reference
              </span>

              <span className="font-medium text-cyan-400">
                {booking.bookingReference}
              </span>
            </div>

            {/* Parking Lot */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Parking Lot
              </span>

              <span className="font-medium text-gray-200">
                {booking.lot?.name || "N/A"}
              </span>
            </div>

            {/* Location */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Location
              </span>

              <span className="font-medium text-gray-200">
                {booking.lot?.address || booking.lot?.city || "N/A"}
              </span>
            </div>

            {/* Parking Slot */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Parking Slot
              </span>

              <span className="font-medium text-cyan-400">
                {booking.slot?.slotNumber || "N/A"}
              </span>
            </div>

            {/* Floor */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Floor
              </span>

              <span className="font-medium text-gray-200">
                {booking.slot?.floorNumber ?? "N/A"}
              </span>
            </div>

            {/* Vehicle */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Vehicle
              </span>

              <span className="font-medium text-gray-200">
                {booking.vehicle?.vehicleNumber || "N/A"}
              </span>
            </div>

            {/* Vehicle Type */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Vehicle Type
              </span>

              <span className="font-medium text-gray-200">
                {booking.vehicle?.vehicleType || "N/A"}
              </span>
            </div>

            {/* Duration */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Duration
              </span>

              <span className="font-medium text-gray-200">
                {formatDuration(
                  booking.startTime,
                  booking.endTime,
                )}
              </span>
            </div>

            {/* Amount Paid */}
            <div className="flex justify-between">
              <span className="text-gray-500">
                Amount Paid
              </span>

              <span className="font-bold text-green-400">
                ₹{formatAmount(booking.totalAmount)}
              </span>
            </div>

          </div>
        </section>

        {/* Actions */}
        <section className="mt-6 space-y-3">

          <Link
            to="/dashboard"
            className="block w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-center font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 transition-all duration-300"
          >
            GO TO DASHBOARD
          </Link>

          <Link
            to="/my-bookings"
            className="block w-full rounded-xl border border-gray-700 bg-white/5 px-5 py-3 text-center font-medium text-gray-300 hover:bg-white/10 hover:border-cyan-500/40 hover:text-white transition-all duration-300"
          >
            VIEW MY BOOKINGS
          </Link>

        </section>

      </div>
    </div>
  );
}

export default BookingConfirmation;