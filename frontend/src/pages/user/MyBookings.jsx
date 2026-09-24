import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

function MyBookings() {
  const navigate = useNavigate();

  // ==================================================
  // BOOKINGS STATE
  // ==================================================

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH BOOKINGS
  // ==================================================

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bookings", {
          params: {
            page: 1,
            limit: 100,
            sort: "desc",
          },
        });

        console.log("Bookings response:", response.data);

        setBookings(response.data.data.filteredRecords || []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message || "Unable to fetch your bookings.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [navigate]);

  // ==================================================
  // FORMAT DATE
  // ==================================================

  function formatDate(dateString) {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // ==================================================
  // FORMAT BOOKING STATUS
  // ==================================================

  function formatStatus(status) {
    if (!status) {
      return "Unknown";
    }

    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // ==================================================
  // STATUS COLOR
  // ==================================================

  function getStatusClass(status) {
    switch (status) {
      case "COMPLETED":
        return "border-green-500/20 bg-green-500/10 text-green-400";

      case "CANCELLED":
      case "EXPIRED":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      case "ACTIVE":
      case "CONFIRMED":
        return "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";

      case "PENDING_PAYMENT":
      case "OVERSTAY_PAYMENT_PENDING":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      default:
        return "border-gray-500/20 bg-gray-500/10 text-gray-400";
    }
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">
      {/* Architectural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ================================================== */}
        {/* PAGE HEADING */}
        {/* ================================================== */}

        <section>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-400">
            View and manage your parking bookings.
          </p>
        </section>

        {/* ================================================== */}
        {/* BOOKING LIST */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 sm:p-8">
          {/* Section Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Booking History</h2>

              <p className="mt-1 text-sm text-gray-500">
                Your recent parking bookings
              </p>
            </div>

            <span className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-medium text-cyan-400">
              {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
            </span>
          </div>

          {/* ================================================== */}
          {/* LOADING */}
          {/* ================================================== */}

          {loading && (
            <div className="mt-6 rounded-xl border border-gray-800 bg-[#070B14] p-10 text-center">
              <p className="font-semibold text-cyan-400">
                Loading your bookings...
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Fetching your booking history.
              </p>
            </div>
          )}

          {/* ================================================== */}
          {/* ERROR */}
          {/* ================================================== */}

          {!loading && error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-10 text-center">
              <p className="font-semibold text-red-400">
                Unable to load bookings
              </p>

              <p className="mt-2 text-sm text-gray-500">{error}</p>
            </div>
          )}

          {/* ================================================== */}
          {/* EMPTY STATE */}
          {/* ================================================== */}

          {!loading && !error && bookings.length === 0 && (
            <div className="mt-6 rounded-xl border border-gray-800 bg-[#070B14] p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gray-800 bg-white/5">
                <span className="text-2xl text-gray-500">⌕</span>
              </div>

              <p className="mt-4 text-gray-400">
                You don't have any bookings yet.
              </p>

              <Link
                to="/find-parking"
                className="mt-4 inline-block text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
              >
                Find Parking
              </Link>
            </div>
          )}

          {/* ================================================== */}
          {/* BOOKING TABLE */}
          {/* ================================================== */}

          {!loading && !error && bookings.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-175">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-sm text-gray-500">
                    <th className="px-4 py-4 font-medium">Booking ID</th>

                    <th className="px-4 py-4 font-medium">Parking Lot</th>

                    <th className="px-4 py-4 font-medium">Date</th>

                    <th className="px-4 py-4 font-medium">Status</th>

                    <th className="px-4 py-4 text-right font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-800/80 transition-colors last:border-b-0 hover:bg-white/2"
                    >
                      {/* Booking ID */}
                      <td className="px-4 py-5">
                        <span className="font-semibold text-cyan-400">
                          {booking.bookingReference}
                        </span>
                      </td>

                      {/* Parking Lot */}
                      <td className="px-4 py-5">
                        <div>
                          <span className="font-medium text-gray-200">
                            {booking.lot?.name || "—"}
                          </span>

                          {booking.lot?.city && (
                            <p className="mt-1 text-xs text-gray-500">
                              {booking.lot.city}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-5 text-gray-400">
                        {formatDate(booking.startTime)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                            booking.bookingStatus,
                          )}`}
                        >
                          {formatStatus(booking.bookingStatus)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-5 text-right">
                        <Link
                          to={`/booking-details/${booking.id}`}
                          className="text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ================================================== */}
        {/* BOOKING STATUS OVERVIEW */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Total */}
          <div className="rounded-xl border border-gray-800/80 bg-[#0a0f1c]/90 p-5 shadow-xl backdrop-blur-md">
            <p className="text-sm text-gray-500">Total Bookings</p>

            <p className="mt-2 text-2xl font-bold text-white">
              {bookings.length}
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-xl border border-gray-800/80 bg-[#0a0f1c]/90 p-5 shadow-xl backdrop-blur-md">
            <p className="text-sm text-gray-500">Completed</p>

            <p className="mt-2 text-2xl font-bold text-green-400">
              {
                bookings.filter(
                  (booking) => booking.bookingStatus === "COMPLETED",
                ).length
              }
            </p>
          </div>

          {/* Cancelled */}
          <div className="rounded-xl border border-gray-800/80 bg-[#0a0f1c]/90 p-5 shadow-xl backdrop-blur-md">
            <p className="text-sm text-gray-500">Cancelled</p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {
                bookings.filter(
                  (booking) => booking.bookingStatus === "CANCELLED",
                ).length
              }
            </p>
          </div>
        </section>

        {/* ================================================== */}
        {/* FIND PARKING */}
        {/* ================================================== */}

        <section className="mt-8 text-center">
          <Link
            to="/find-parking"
            className="inline-block rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
          >
            FIND PARKING
          </Link>
        </section>
      </div>
    </div>
  );
}

export default MyBookings;