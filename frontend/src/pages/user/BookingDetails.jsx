import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/bookings/${bookingId}`);

        console.log("Booking details:", response.data);

        setBooking(response.data.data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message || "Unable to load booking details.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, navigate]);

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

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

  function getPaymentStatus() {
    if (!booking?.payments?.length) {
      return "Pending";
    }

    const successfulPayment = booking.payments.find(
      (payment) => payment.paymentStatus === "SUCCESS",
    );

    return successfulPayment ? "Paid" : "Pending";
  }

  function getStatusClasses(status) {
    if (status === "CONFIRMED" || status === "COMPLETED") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "CANCELLED" || status === "EXPIRED") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-white">Booking Details</h1>

          <p className="mt-4 text-red-400">{error}</p>

          <Link
            to="/my-bookings"
            className="mt-6 inline-block text-sm text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
          >
            ← Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const paymentStatus = getPaymentStatus();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
      {/* Architectural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl space-y-8">
        {/* Page Heading */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Booking Details
          </h1>

          <p className="mt-2 text-gray-400">
            View the complete information for your parking booking.
          </p>
        </section>

        {/* Booking Header */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Booking Reference</p>

              <p className="mt-1 text-2xl font-bold text-cyan-400">
                {booking.bookingReference}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses(
                booking.bookingStatus,
              )}`}
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-current" />

              {booking.bookingStatus.replaceAll("_", " ")}
            </span>
          </div>
        </section>

        {/* Parking & Vehicle Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Parking Information */}
          <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30">
            <h2 className="text-xl font-bold text-white">
              Parking Information
            </h2>

            <div className="mt-6 space-y-4">
              <div className="border-b border-gray-800 pb-4">
                <p className="text-sm text-gray-500">Parking Lot</p>

                <p className="mt-1 font-medium text-gray-200">
                  {booking.lot?.name}
                </p>
              </div>

              <div className="border-b border-gray-800 pb-4">
                <p className="text-sm text-gray-500">Location</p>

                <p className="mt-1 font-medium text-gray-200">
                  {booking.lot?.city}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Parking Slot</p>

                  <p className="mt-1 text-lg font-bold text-cyan-400">
                    {booking.slot?.slotNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Floor</p>

                  <p className="mt-1 font-medium text-gray-200">
                    Floor {booking.slot?.floorNumber}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle Information */}
          <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-blue-500/30">
            <h2 className="text-xl font-bold text-white">
              Vehicle Information
            </h2>

            <div className="mt-6 space-y-4">
              <div className="border-b border-gray-800 pb-4">
                <p className="text-sm text-gray-500">Vehicle Number</p>

                <p className="mt-1 text-lg font-bold text-cyan-400">
                  {booking.vehicle?.vehicleNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Vehicle Type</p>

                <p className="mt-1 font-medium text-gray-200">
                  {booking.vehicle?.vehicleType}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Booking Timing */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30">
          <h2 className="text-xl font-bold text-white">Booking Timing</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-800 bg-[#070B14] p-5">
              <p className="text-sm text-gray-500">Booking Date</p>

              <p className="mt-2 font-semibold text-gray-200">
                {formatDate(booking.startTime)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#070B14] p-5">
              <p className="text-sm text-gray-500">Start Time</p>

              <p className="mt-2 font-semibold text-gray-200">
                {formatTime(booking.startTime)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#070B14] p-5">
              <p className="text-sm text-gray-500">End Time</p>

              <p className="mt-2 font-semibold text-gray-200">
                {formatTime(booking.endTime)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#070B14] p-5">
              <p className="text-sm text-gray-500">Duration</p>

              <p className="mt-2 font-semibold text-cyan-400">
                {formatDuration(booking.startTime, booking.endTime)}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Summary */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-blue-500/30">
          <h2 className="text-xl font-bold text-white">Payment Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">Booking Amount</span>

              <span className="font-medium text-gray-200">
                ₹{Number(booking.totalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Status</span>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  paymentStatus === "Paid"
                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                    : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {paymentStatus}
              </span>
            </div>

            <div className="border-t border-gray-800 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-cyan-400">
                  ₹{Number(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-4">
          {/* Payment / QR */}
          {booking.bookingStatus === "PENDING_PAYMENT" ? (
            <Link
              to={`/payment/${booking.id}`}
              className="block rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-center font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
            >
              PROCEED TO PAYMENT
            </Link>
          ) : (
            <Link
              to={`/booking-confirmation/${booking.id}`}
              className="block rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-center font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
            >
              VIEW QR CODE
            </Link>
          )}

          {/* Exit Instruction */}
          {booking.bookingStatus === "ACTIVE" && (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <p className="font-medium text-cyan-400">
                Exit at the parking gate
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Present your QR code at the exit gate to complete checkout.
              </p>
            </div>
          )}

          {/* Cancel Booking */}
          {(booking.bookingStatus === "PENDING_PAYMENT" ||
            booking.bookingStatus === "CONFIRMED") && (
            <button
              type="button"
              onClick={() => console.log("Cancel Booking:", booking.id)}
              className="w-full rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-center font-medium text-red-400 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
            >
              CANCEL BOOKING
            </button>
          )}
        </section>

        {/* Back */}
        <div>
          <Link
            to="/my-bookings"
            className="text-sm text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
          >
            ← Back to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;