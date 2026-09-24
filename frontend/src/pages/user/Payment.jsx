import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/bookings/${bookingId}`);

        console.log("Payment page booking:", response.data);

        setBooking(response.data.data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load booking details.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, navigate]);

  async function handlePayment() {
    if (!booking) {
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      // Create Razorpay order through our backend
      const response = await api.post(
        `/payments/${booking.id}/order`,
      );

      console.log("Payment order created:", response.data);

      const paymentData = response.data.data;

      // Check whether Razorpay Checkout loaded
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please refresh the page and try again.",
        );
      }

      const options = {
        key: paymentData.razorpayKey,

        amount: Number(paymentData.amount) * 100,

        currency: paymentData.currency,

        name: "ParkSphere",

        description: `Parking Booking - ${paymentData.bookingReference}`,

        order_id: paymentData.orderId,

        prefill: {
          name: booking.user?.name || "",
          email: booking.user?.email || "",
          contact: booking.user?.phone || "",
        },

        notes: {
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          paymentMethod,
        },

        theme: {
          color: "#06b6d4",
        },

        handler: async function (razorpayResponse) {
          try {
            console.log(
              "Razorpay payment response:",
              razorpayResponse,
            );

            const verifyResponse = await api.post(
              `/payments/${booking.id}/verify`,
              {
                razorpay_order_id:
                  razorpayResponse.razorpay_order_id,

                razorpay_payment_id:
                  razorpayResponse.razorpay_payment_id,

                razorpay_signature:
                  razorpayResponse.razorpay_signature,
              },
            );

            console.log(
              "Payment verification response:",
              verifyResponse.data,
            );

            navigate(`/booking-confirmation/${booking.id}`);
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error,
            );

            setError(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support if money was deducted.",
            );

            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout closed");

            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(
          "Razorpay payment failed:",
          response.error,
        );

        setError(
          response.error?.description ||
            "Payment failed. Please try again.",
        );

        setPaymentLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to initiate payment. Please try again.",
      );

      setPaymentLoading(false);
    }
  }

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

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-gray-400">
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-white">
            Payment
          </h1>

          <p className="mt-4 text-red-400">
            {error}
          </p>

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

  const totalAmount = Number(booking.totalAmount);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
      {/* Architectural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-8">
        {/* Page Heading */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Payment
          </h1>

          <p className="mt-2 text-gray-400">
            Complete your payment to confirm the parking booking.
          </p>
        </section>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Booking Information */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Booking Reference
              </p>

              <p className="mt-1 text-xl font-bold text-cyan-400">
                {booking.bookingReference}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#070B14] px-5 py-3">
              <p className="text-xs text-gray-500">
                Parking Slot
              </p>

              <p className="mt-1 text-lg font-bold text-cyan-400">
                {booking.slot?.slotNumber}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Payment Methods */}
          <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md lg:col-span-3">
            <h2 className="text-xl font-bold text-white">
              Select Payment Method
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Choose your preferred payment method.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "UPI",
                "Credit / Debit Card",
                "Net Banking",
              ].map((method) => {
                const isSelected =
                  paymentMethod === method;

                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(method)
                    }
                    className={`w-full rounded-xl border-2 p-5 text-left transition-all duration-300 ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                        : "border-gray-800 bg-[#070B14] hover:border-cyan-500/40 hover:bg-white/2"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-semibold ${
                            isSelected
                              ? "text-cyan-400"
                              : "text-gray-200"
                          }`}
                        >
                          {method}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {method === "UPI"
                            ? "Pay securely using your UPI app"
                            : method ===
                                "Credit / Debit Card"
                              ? "Pay using your bank card"
                              : "Pay directly through your bank"}
                        </p>
                      </div>

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-500"
                            : "border-gray-700"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#070B14]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Security Notice */}
            <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-sm font-medium text-cyan-400">
                Secure Payment
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Your payment information is securely processed
                through Razorpay.
              </p>
            </div>
          </section>

          {/* Payment Summary */}
          <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md lg:col-span-2">
            <h2 className="text-xl font-bold text-white">
              Payment Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Parking Lot
                </span>

                <span className="text-right text-sm font-medium text-gray-200">
                  {booking.lot?.name}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-500">
                  Vehicle
                </span>

                <span className="text-sm font-medium text-gray-200">
                  {booking.vehicle?.vehicleNumber}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Rate
                </span>

                <span className="text-sm font-medium text-gray-200">
                  ₹
                  {(
                    totalAmount /
                    booking.durationHours
                  ).toFixed(2)}{" "}
                  / hour
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Booking Date
                </span>

                <span className="text-sm font-medium text-gray-200">
                  {formatDate(booking.startTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Time
                </span>

                <span className="text-right text-sm font-medium text-gray-200">
                  {formatTime(booking.startTime)} -{" "}
                  {formatTime(booking.endTime)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-500">
                  Duration
                </span>

                <span className="text-sm font-medium text-gray-200">
                  {booking.durationHours} Hours
                </span>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">
                    Total Amount
                  </span>

                  <span className="text-2xl font-bold text-cyan-400">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={paymentLoading}
              className="mt-6 w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paymentLoading
                ? "PROCESSING..."
                : `PAY ₹${totalAmount}`}
            </button>
          </section>
        </div>

        {/* Back */}
        <div>
          <Link
            to={`/booking-details/${booking.id}`}
            className="text-sm text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
          >
            ← Back to Booking Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Payment;