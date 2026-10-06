import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../../api/api";

function AdminPayments() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);

  // ================= PAGINATION =================

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPayments: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const PAGE_SIZE = 10;

  // ================= FETCH PAYMENTS =================

  const fetchPayments = async (page = currentPage) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: PAGE_SIZE,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (typeFilter !== "All Types") {
        params.paymentType = typeFilter === "Booking" ? "BOOKING" : "OVERSTAY";
      }

      if (statusFilter !== "All Status") {
        params.paymentStatus =
          statusFilter === "Paid"
            ? "SUCCESS"
            : statusFilter === "Refunded"
              ? "REFUNDED"
              : "FAILED";
      }

      const response = await api.get("/payments", {
        params,
      });

      const data = response.data?.data;

      setPayments(data?.filteredPaymentRecords || []);

      setPagination(
        data?.pagination || {
          page,
          limit: PAGE_SIZE,
          totalPayments: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      console.error("Failed to fetch payments:", err);

      setError(
        err.response?.data?.message || "Failed to load payment records.",
      );

      setPayments([]);

      setPagination({
        page: 1,
        limit: PAGE_SIZE,
        totalPayments: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever pagination/filter/search changes

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments(currentPage);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, search, typeFilter, statusFilter]);

  // ================= RESET PAGE WHEN FILTER CHANGES =================

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // ================= NORMALIZE PAYMENT DATA =================

  const normalizedPayments = payments.map((payment) => ({
    id: payment.id,

    bookingId: payment.booking?.bookingReference || payment.booking?.id || "-",

    user: payment.booking?.user?.name || "-",

    date: payment.paidAt
      ? new Date(payment.paidAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : payment.createdAt
        ? new Date(payment.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-",

    type:
      payment.paymentType === "BOOKING"
        ? "Booking"
        : payment.paymentType === "OVERSTAY"
          ? "Overstay"
          : payment.paymentType || "-",

    method: payment.paymentMethod || "-",

    amount: Number(payment.amount || 0),

    status:
      payment.paymentStatus === "SUCCESS"
        ? "Paid"
        : payment.paymentStatus === "REFUNDED"
          ? "Refunded"
          : payment.paymentStatus === "FAILED"
            ? "Failed"
            : payment.paymentStatus || "-",

    currency: payment.currency || "INR",

    description: payment.description || "-",

    paidAt: payment.paidAt,

    createdAt: payment.createdAt,

    bookingStatus: payment.booking?.bookingStatus || "-",

    vehicleNumber: payment.booking?.vehicle?.vehicleNumber || "-",

    vehicleType: payment.booking?.vehicle?.vehicleType || "-",

    parkingLot: payment.booking?.lot?.name || "-",

    city: payment.booking?.lot?.city || "-",

    startTime: payment.booking?.startTime,

    endTime: payment.booking?.endTime,

    entryTime: payment.booking?.entryTime,

    exitTime: payment.booking?.exitTime,

    overstayMinutes: payment.booking?.overstayMinutes || 0,

    overstayAmount: Number(payment.booking?.overstayAmount || 0),
  }));

  // ================= CURRENT PAGE STATISTICS =================
  //
  // These are calculated from the records currently returned
  // by the backend.

  const paidPayments = normalizedPayments.filter(
    (payment) => payment.status === "Paid",
  );

  const totalRevenue = paidPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const bookingRevenue = paidPayments
    .filter((payment) => payment.type === "Booking")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const overstayRevenue = paidPayments
    .filter((payment) => payment.type === "Overstay")
    .reduce((sum, payment) => sum + payment.amount, 0);

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return {
        wrapper: "border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    if (status === "Refunded") {
      return {
        wrapper: "border-purple-400/10 bg-purple-400/[0.08] text-purple-400",
        dot: "bg-purple-400",
      };
    }

    if (status === "Failed") {
      return {
        wrapper: "border-red-400/10 bg-red-400/[0.08] text-red-400",
        dot: "bg-red-400",
      };
    }

    return {
      wrapper: "border-yellow-400/10 bg-yellow-400/[0.08] text-yellow-400",
      dot: "bg-yellow-400",
    };
  };

  // ================= DATE FORMAT =================

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= PAGINATION NUMBERS =================

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // ================= RENDER =================

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/admin" className="transition-colors hover:text-cyan-400">
            Admin
          </Link>

          <span>/</span>

          <span className="text-gray-400">Payments</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Payments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Track booking payments, overstay charges, refunds, and payment status.
        </p>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Revenue */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Revenue
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                Successful payments
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ₹
            </div>
          </div>
        </div>

        {/* Booking Revenue */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Booking Revenue
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                ₹{bookingRevenue.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-cyan-400">Parking reservations</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
              ◈
            </div>
          </div>
        </div>

        {/* Overstay Revenue */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Overstay Revenue
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                ₹{overstayRevenue.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-orange-400">
                Additional parking fees
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-lg text-orange-400">
              +
            </div>
          </div>
        </div>

        {/* Successful Transactions */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Successful Transactions
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {paidPayments.length}
              </p>

              <p className="mt-1 text-xs text-blue-400">Completed payments</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-400">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* ================= PAYMENTS TABLE ================= */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl shadow-black/10">
        {/* Card Header */}

        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Payment Transactions
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {pagination.totalPayments} transactions found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}

              <div className="relative w-full sm:w-64">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search payments..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              {/* Type Filter */}

              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-gray-400 outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              >
                <option value="All Types" className="bg-[#0A0F1C]">
                  All Types
                </option>

                <option value="Booking" className="bg-[#0A0F1C]">
                  Booking
                </option>

                <option value="Overstay" className="bg-[#0A0F1C]">
                  Overstay
                </option>
              </select>

              {/* Status Filter */}

              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-gray-400 outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              >
                <option value="All Status" className="bg-[#0A0F1C]">
                  All Status
                </option>

                <option value="Paid" className="bg-[#0A0F1C]">
                  Paid
                </option>

                <option value="Refunded" className="bg-[#0A0F1C]">
                  Refunded
                </option>

                <option value="Failed" className="bg-[#0A0F1C]">
                  Failed
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

            <p className="mt-4 text-sm text-gray-500">
              Loading payment records...
            </p>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-2xl text-red-400">
              !
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              Unable to load payments
            </h3>

            <p className="mt-2 text-xs text-gray-500">{error}</p>

            <button
              type="button"
              onClick={() => fetchPayments(currentPage)}
              className="mt-5 rounded-lg border border-white/10 bg-white/3 px-4 py-2 text-xs font-medium text-gray-300 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ================= TABLE ================= */}

        {!loading && !error && normalizedPayments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Payment
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Booking
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Type
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Method
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {normalizedPayments.map((payment) => {
                  const statusStyle = getStatusStyle(payment.status);

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-white/6 transition-colors hover:bg-white/2.5"
                    >
                      {/* Payment */}

                      <td className="whitespace-nowrap px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-purple-400/10 to-blue-500/10 text-sm font-bold text-purple-400">
                            ₹
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-white">
                              {payment.id}
                            </p>

                            <p className="mt-1 text-[11px] text-gray-600">
                              Transaction
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* User */}

                      <td className="whitespace-nowrap px-5 py-5">
                        <p className="text-sm font-medium text-gray-300">
                          {payment.user}
                        </p>
                      </td>

                      {/* Booking */}

                      <td className="whitespace-nowrap px-5 py-5">
                        <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
                          {payment.bookingId}
                        </span>
                      </td>

                      {/* Date */}

                      <td className="whitespace-nowrap px-5 py-5">
                        <span className="text-sm text-gray-400">
                          {payment.date}
                        </span>
                      </td>

                      {/* Type */}

                      <td className="whitespace-nowrap px-5 py-5 text-center">
                        <span
                          className={`inline-flex rounded-lg border px-3 py-1.5 text-[11px] font-medium ${
                            payment.type === "Booking"
                              ? "border-blue-400/10 bg-blue-400/6 text-blue-400"
                              : "border-orange-400/10 bg-orange-400/6 text-orange-400"
                          }`}
                        >
                          {payment.type}
                        </span>
                      </td>

                      {/* Method */}

                      <td className="whitespace-nowrap px-5 py-5 text-center">
                        <span className="text-sm text-gray-400">
                          {payment.method}
                        </span>
                      </td>

                      {/* Amount */}

                      <td className="whitespace-nowrap px-5 py-5 text-center">
                        <span className="text-sm font-semibold text-white">
                          ₹{payment.amount.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="whitespace-nowrap px-5 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${statusStyle.wrapper}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                          />

                          {payment.status}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="whitespace-nowrap px-5 py-5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedPayment(payment)}
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
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading && !error && normalizedPayments.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4 text-2xl text-gray-600">
              ⌕
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No payments found
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              Try changing your search or payment filters.
            </p>
          </div>
        )}

        {/* ================= PAGINATION ================= */}

        {!loading && !error && pagination.totalPages > 1 && (
          <div className="border-t border-white/10 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Page Information */}

              <p className="text-xs text-gray-500">
                Page{" "}
                <span className="font-medium text-gray-300">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-300">
                  {pagination.totalPages}
                </span>
              </p>

              {/* Pagination Controls */}

              <div className="flex items-center justify-center gap-1 overflow-x-auto">
                {/* Previous */}

                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  className="shrink-0 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/3 disabled:hover:text-gray-400"
                >
                  Previous
                </button>

                {/* Page Numbers */}

                {getPageNumbers().map((pageNumber, index) => {
                  if (pageNumber === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex h-9 min-w-9 shrink-0 items-center justify-center px-1 text-xs text-gray-600"
                      >
                        ...
                      </span>
                    );
                  }

                  const isActive = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-all ${
                        isActive
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                          : "border-white/10 bg-white/3 text-gray-400 hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next */}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, pagination.totalPages),
                    )
                  }
                  className="shrink-0 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/3 disabled:hover:text-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= INFORMATION NOTE ================= */}

      <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/3 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-xs text-cyan-400">
            i
          </div>

          <div>
            <p className="text-xs font-medium text-gray-300">
              Payment Information
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-600">
              Overstay payments are associated with the original booking.
              Refunded and failed transactions are excluded from total
              successful revenue.
            </p>
          </div>
        </div>
      </div>

      {/* ================= PAYMENT DETAILS MODAL ================= */}

      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Payment Details
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  {selectedPayment.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-gray-400 transition-all hover:border-white/20 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}

            <div className="grid max-h-[70vh] gap-4 overflow-y-auto p-6 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Payment ID
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {selectedPayment.id}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Booking
                </p>

                <p className="mt-1 text-sm font-medium text-cyan-400">
                  {selectedPayment.bookingId}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  User
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.user}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Amount
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  ₹{selectedPayment.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Payment Type
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.type}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Payment Method
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.method}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Payment Status
                </p>

                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                      getStatusStyle(selectedPayment.status).wrapper
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        getStatusStyle(selectedPayment.status).dot
                      }`}
                    />

                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Date
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.date}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Vehicle
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.vehicleNumber}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Vehicle Type
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.vehicleType}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Parking Lot
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.parkingLot}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  City
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.city}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Booking Status
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.bookingStatus}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Paid At
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {formatDateTime(selectedPayment.paidAt)}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Description
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  {selectedPayment.description}
                </p>
              </div>

              {selectedPayment.type === "Overstay" && (
                <>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-600">
                      Overstay Minutes
                    </p>

                    <p className="mt-1 text-sm text-orange-400">
                      {selectedPayment.overstayMinutes} minutes
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-600">
                      Overstay Amount
                    </p>

                    <p className="mt-1 text-sm font-semibold text-orange-400">
                      ₹{selectedPayment.overstayAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg border border-white/10 bg-white/3 px-4 py-2 text-xs font-medium text-gray-300 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
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

export default AdminPayments;