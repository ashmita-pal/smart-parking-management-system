import { Link } from "react-router-dom";
import { useState } from "react";

function AdminPayments() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const payments = [
    {
      id: "PAY001",
      bookingId: "BK001",
      user: "Soumyadeep Paul",
      date: "25 Aug 2026",
      type: "Booking",
      method: "UPI",
      amount: 120,
      status: "Paid",
    },
    {
      id: "PAY002",
      bookingId: "BK002",
      user: "Rahul Sharma",
      date: "24 Aug 2026",
      type: "Booking",
      method: "Card",
      amount: 160,
      status: "Paid",
    },
    {
      id: "PAY003",
      bookingId: "BK003",
      user: "Ananya Das",
      date: "23 Aug 2026",
      type: "Booking",
      method: "UPI",
      amount: 120,
      status: "Paid",
    },
    {
      id: "PAY004",
      bookingId: "BK003",
      user: "Ananya Das",
      date: "23 Aug 2026",
      type: "Overstay",
      method: "UPI",
      amount: 20,
      status: "Paid",
    },
    {
      id: "PAY005",
      bookingId: "BK004",
      user: "Arjun Roy",
      date: "22 Aug 2026",
      type: "Booking",
      method: "Net Banking",
      amount: 120,
      status: "Refunded",
    },
    {
      id: "PAY006",
      bookingId: "BK005",
      user: "Priya Sen",
      date: "21 Aug 2026",
      type: "Booking",
      method: "Card",
      amount: 160,
      status: "Paid",
    },
    {
      id: "PAY007",
      bookingId: "BK005",
      user: "Priya Sen",
      date: "21 Aug 2026",
      type: "Overstay",
      method: "Card",
      amount: 40,
      status: "Paid",
    },
    {
      id: "PAY008",
      bookingId: "BK006",
      user: "Amit Ghosh",
      date: "20 Aug 2026",
      type: "Booking",
      method: "UPI",
      amount: 80,
      status: "Failed",
    },
  ];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      payment.user.toLowerCase().includes(search.toLowerCase()) ||
      payment.method.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All Types" || payment.type === typeFilter;

    const matchesStatus =
      statusFilter === "All Status" || payment.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const paidPayments = payments.filter((payment) => payment.status === "Paid");

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

    return {
      wrapper: "border-red-400/10 bg-red-400/[0.08] text-red-400",
      dot: "bg-red-400",
    };
  };

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
                {filteredPayments.length} transactions found
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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
                onChange={(e) => setStatusFilter(e.target.value)}
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

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-250">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Payment
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  User
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Booking
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Method
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
              {filteredPayments.map((payment) => {
                const statusStyle = getStatusStyle(payment.status);

                return (
                  <tr
                    key={payment.id}
                    className="border-b border-white/6 transition-colors hover:bg-white/2.5"
                  >
                    {/* Payment */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-purple-400/10 to-blue-500/10 text-sm font-bold text-purple-400">
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
                    <td className="px-5 py-5">
                      <p className="text-sm font-medium text-gray-300">
                        {payment.user}
                      </p>
                    </td>

                    {/* Booking */}
                    <td className="px-5 py-5">
                      <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
                        {payment.bookingId}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-5">
                      <span className="text-sm text-gray-400">
                        {payment.date}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-5 text-center">
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
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm text-gray-400">
                        {payment.method}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm font-semibold text-white">
                        ₹{payment.amount}
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

                        {payment.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-5 text-center">
                      <button
                        onClick={() =>
                          console.log("View payment details:", payment.id)
                        }
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

        {/* Empty State */}
        {filteredPayments.length === 0 && (
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
    </div>
  );
}

export default AdminPayments;