import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bookings", {
          params: {
            page: currentPage,
            limit: 10,
            ...(search.trim() && {
              search: search.trim(),
            }),
            ...(statusFilter !== "All Status" && {
              status: statusFilter,
            }),
          },
        });

        const backendBookings = response.data.data?.filteredRecords || [];

        const backendPagination = response.data.data?.pagination || {};

        const formattedBookings = backendBookings.map((booking) => ({
          id: booking.id,
          bookingReference: booking.bookingReference,
          user: booking.user?.name || "Unknown User",
          email: booking.user?.email || "-",
          parkingLot: booking.lot?.name || "Unknown Parking Lot",
          slot: booking.slot?.slotNumber || "-",
          vehicle: booking.vehicle?.vehicleNumber || "-",

          date: new Date(booking.startTime).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),

          time: `${new Date(booking.startTime).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(booking.endTime).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,

          duration: `${booking.durationHours} hrs`,
          amount: Number(booking.totalAmount),
          status: booking.bookingStatus,
        }));

        setBookings(formattedBookings);

        setPagination({
          page: backendPagination.page || currentPage,
          limit: backendPagination.limit || 10,
          totalRecords: backendPagination.totalRecords || 0,
          totalPages: backendPagination.totalPages || 0,
          hasNextPage: backendPagination.hasNextPage || false,
          hasPreviousPage: backendPagination.hasPreviousPage || false,
        });
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        setError(error.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, search, statusFilter]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const activeBookings = bookings.filter(
    (booking) => booking.status === "ACTIVE",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.status !== "CANCELLED" && booking.status !== "EXPIRED",
    )
    .reduce((sum, booking) => sum + booking.amount, 0);

  const getStatusStyle = (status) => {
    if (status === "ACTIVE") {
      return {
        wrapper: "border-cyan-400/10 bg-cyan-400/[0.08] text-cyan-400",
        dot: "bg-cyan-400",
      };
    }

    if (status === "CONFIRMED") {
      return {
        wrapper: "border-blue-400/10 bg-blue-400/[0.08] text-blue-400",
        dot: "bg-blue-400",
      };
    }

    if (status === "COMPLETED") {
      return {
        wrapper: "border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    if (status === "CANCELLED") {
      return {
        wrapper: "border-red-400/10 bg-red-400/[0.08] text-red-400",
        dot: "bg-red-400",
      };
    }

    if (status === "PENDING_PAYMENT") {
      return {
        wrapper: "border-yellow-400/10 bg-yellow-400/[0.08] text-yellow-400",
        dot: "bg-yellow-400",
      };
    }

    if (status === "OVERSTAY_PAYMENT_PENDING") {
      return {
        wrapper: "border-orange-400/10 bg-orange-400/[0.08] text-orange-400",
        dot: "bg-orange-400",
      };
    }

    if (status === "EXPIRED") {
      return {
        wrapper: "border-gray-400/10 bg-gray-400/[0.08] text-gray-400",
        dot: "bg-gray-400",
      };
    }

    return {
      wrapper: "border-red-400/10 bg-red-400/[0.08] text-red-400",
      dot: "bg-red-400",
    };
  };

  const handleViewBooking = async (bookingId) => {
    try {
      setViewLoading(true);
      setViewError("");
      setSelectedBooking(null);
      setShowViewModal(true);

      const response = await api.get(`/bookings/${bookingId}`);

      setSelectedBooking(response.data.data);
    } catch (error) {
      console.error("Failed to fetch booking:", error);

      setViewError(
        error.response?.data?.message ||
          "Failed to load booking details. Please try again.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedBooking(null);
    setViewError("");
  };

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <Link to="/admin" className="transition-colors hover:text-cyan-400">
              Admin
            </Link>

            <span>/</span>

            <span className="text-gray-400">Bookings</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Bookings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor and manage all parking reservations across ParkSphere.
          </p>
        </div>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Active */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Active
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {activeBookings}
              </p>

              <p className="mt-1 text-xs text-cyan-400">Currently parked</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
              ●
            </div>
          </div>
        </div>

        {/* Confirmed */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Confirmed
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {confirmedBookings}
              </p>

              <p className="mt-1 text-xs text-blue-400">Upcoming bookings</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-400">
              ✓
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {completedBookings}
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                Successfully completed
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ◉
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Booking Revenue
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-purple-400">
                From current records
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-lg text-purple-400">
              ₹
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOOKINGS TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl shadow-black/10">
        {/* Card Header */}
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">All Bookings</h2>

              <p className="mt-1 text-xs text-gray-500">
                {pagination.totalRecords} bookings found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-gray-400 outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              >
                <option value="All Status" className="bg-[#0A0F1C]">
                  All Status
                </option>

                <option value="ACTIVE" className="bg-[#0A0F1C]">
                  Active
                </option>

                <option value="CONFIRMED" className="bg-[#0A0F1C]">
                  Confirmed
                </option>

                <option value="COMPLETED" className="bg-[#0A0F1C]">
                  Completed
                </option>

                <option value="CANCELLED" className="bg-[#0A0F1C]">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">Loading bookings...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-2xl text-red-400">
              !
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              Failed to load bookings
            </h3>

            <p className="mt-2 text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-275">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Booking
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Parking
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Slot
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Vehicle
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Date & Time
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Duration
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => {
                  const statusStyle = getStatusStyle(booking.status);

                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-white/6 transition-colors hover:bg-white/25"
                    >
                      {/* Booking */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/10 to-blue-500/10 text-xs font-bold text-cyan-400">
                            BK
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-white">
                              {booking.bookingReference}
                            </p>

                            <p className="mt-1 text-[11px] text-gray-600">
                              Reservation
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-300">
                          {booking.user}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-600">
                          {booking.email}
                        </p>
                      </td>

                      {/* Parking */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <p className="text-sm text-gray-400">
                          {booking.parkingLot}
                        </p>
                      </td>

                      {/* Slot */}
                      <td className="px-5 py-5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5 text-xs font-semibold text-cyan-400">
                          {booking.slot}
                        </span>
                      </td>

                      {/* Vehicle */}
                      <td className="px-5 py-5">
                        <p className="text-sm font-medium text-gray-300">
                          {booking.vehicle}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <p className="text-sm text-gray-400">{booking.date}</p>

                        <p className="mt-1 text-[11px] text-gray-600">
                          {booking.time}
                        </p>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-5 text-center">
                        <span className="text-sm text-gray-400">
                          {booking.duration}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-5 text-center">
                        <span className="text-sm font-semibold text-white">
                          ₹{booking.amount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${statusStyle.wrapper}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                          />

                          {booking.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-5 text-center">
                        <button
                          onClick={() => handleViewBooking(booking.id)}
                          className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[11px] font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Styled Pagination Wrapper */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 p-5 sm:flex-row">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-medium text-white">
                  {pagination.totalRecords === 0
                    ? 0
                    : (pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-white">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.totalRecords,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">
                  {pagination.totalRecords}
                </span>{" "}
                bookings
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400 disabled:pointer-events-none disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="hidden items-center gap-1 sm:flex">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition-all ${
                        currentPage === page
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                          : "border-white/10 bg-white/3 text-gray-400 hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400 disabled:pointer-events-none disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
            {/* End Styled Pagination */}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4 text-2xl text-gray-600">
              ⌕
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No bookings found
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* ================= VIEW BOOKING MODAL ================= */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Booking Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  View complete reservation information
                </p>
              </div>

              <button
                onClick={closeViewModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-gray-400 transition-all hover:border-red-400/20 hover:bg-red-400/5 hover:text-red-400"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {viewLoading && (
                <div className="py-16 text-center">
                  <p className="text-sm text-gray-500">
                    Loading booking details...
                  </p>
                </div>
              )}

              {!viewLoading && viewError && (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-2xl text-red-400">
                    !
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-white">
                    Failed to load booking
                  </h3>

                  <p className="mt-2 text-xs text-red-400">{viewError}</p>
                </div>
              )}

              {!viewLoading && !viewError && selectedBooking && (
                <div className="space-y-6">
                  {/* Booking Information */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Booking Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">
                          Booking Reference
                        </p>

                        <p className="mt-1 text-sm font-semibold text-cyan-400">
                          {selectedBooking.bookingReference || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Status</p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {selectedBooking.bookingStatus || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Duration</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.durationHours ?? "-"} hours
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">
                          Total Amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          ₹
                          {Number(
                            selectedBooking.totalAmount || 0,
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Name</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.user?.name || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Email</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.user?.email || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Vehicle Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">
                          Vehicle Number
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-300">
                          {selectedBooking.vehicle?.vehicleNumber || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">
                          Vehicle Type
                        </p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.vehicle?.vehicleType || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Parking Information */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Parking Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Parking Lot</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.lot?.name || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Address</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.lot?.address || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">City</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.lot?.city || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Slot</p>

                        <p className="mt-1 text-sm font-medium text-cyan-400">
                          {selectedBooking.slot?.slotNumber || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Floor</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.slot?.floorNumber ?? "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Slot Type</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.slot?.slotType || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timing */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Timing
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Start Time</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.startTime
                            ? new Date(
                                selectedBooking.startTime,
                              ).toLocaleString("en-IN")
                            : "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">End Time</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.endTime
                            ? new Date(selectedBooking.endTime).toLocaleString(
                                "en-IN",
                              )
                            : "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Entry Time</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.entryTime
                            ? new Date(
                                selectedBooking.entryTime,
                              ).toLocaleString("en-IN")
                            : "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                        <p className="text-[11px] text-gray-500">Exit Time</p>

                        <p className="mt-1 text-sm text-gray-300">
                          {selectedBooking.exitTime
                            ? new Date(selectedBooking.exitTime).toLocaleString(
                                "en-IN",
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Overstay Information */}
                  {(selectedBooking.overstayMinutes > 0 ||
                    Number(selectedBooking.overstayAmount || 0) > 0) && (
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Overstay
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-orange-400/10 bg-orange-400/5 p-4">
                          <p className="text-[11px] text-gray-500">
                            Overstay Minutes
                          </p>

                          <p className="mt-1 text-sm font-semibold text-orange-400">
                            {selectedBooking.overstayMinutes || 0} minutes
                          </p>
                        </div>

                        <div className="rounded-xl border border-orange-400/10 bg-orange-400/5 p-4">
                          <p className="text-[11px] text-gray-500">
                            Overstay Amount
                          </p>

                          <p className="mt-1 text-sm font-semibold text-orange-400">
                            ₹
                            {Number(
                              selectedBooking.overstayAmount || 0,
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payments */}
                  {selectedBooking.payments?.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Payments
                      </h3>

                      <div className="space-y-3">
                        {selectedBooking.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="rounded-xl border border-white/10 bg-white/3 p-4"
                          >
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div>
                                <p className="text-[11px] text-gray-500">
                                  Type
                                </p>

                                <p className="mt-1 text-sm text-gray-300">
                                  {payment.paymentType || "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[11px] text-gray-500">
                                  Status
                                </p>

                                <p className="mt-1 text-sm text-gray-300">
                                  {payment.paymentStatus || "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[11px] text-gray-500">
                                  Amount
                                </p>

                                <p className="mt-1 text-sm font-semibold text-white">
                                  ₹
                                  {Number(payment.amount || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-white/10 px-6 py-4">
              <button
                onClick={closeViewModal}
                className="rounded-xl border border-white/10 bg-white/3 px-5 py-2.5 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;