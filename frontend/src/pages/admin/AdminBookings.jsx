import { Link } from "react-router-dom";
import { useState } from "react";

function AdminBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const bookings = [
    {
      id: "BK001",
      user: "Soumyadeep Paul",
      email: "soumya@gmail.com",
      parkingLot: "City Center Parking",
      slot: "A1",
      vehicle: "WB12AB1234",
      date: "25 Aug 2026",
      time: "10:15 AM - 01:15 PM",
      duration: "3 hrs",
      amount: 120,
      status: "Active",
    },
    {
      id: "BK002",
      user: "Rahul Sharma",
      email: "rahul@gmail.com",
      parkingLot: "Salt Lake Parking",
      slot: "B4",
      vehicle: "WB06CD5678",
      date: "24 Aug 2026",
      time: "09:00 AM - 01:00 PM",
      duration: "4 hrs",
      amount: 160,
      status: "Confirmed",
    },
    {
      id: "BK003",
      user: "Ananya Das",
      email: "ananya@gmail.com",
      parkingLot: "Park Street Parking",
      slot: "C2",
      vehicle: "WB02EF9012",
      date: "23 Aug 2026",
      time: "02:00 PM - 05:00 PM",
      duration: "3 hrs",
      amount: 120,
      status: "Completed",
    },
    {
      id: "BK004",
      user: "Arjun Roy",
      email: "arjun@gmail.com",
      parkingLot: "City Center Parking",
      slot: "A5",
      vehicle: "WB08GH3456",
      date: "22 Aug 2026",
      time: "11:00 AM - 02:00 PM",
      duration: "3 hrs",
      amount: 120,
      status: "Cancelled",
    },
    {
      id: "BK005",
      user: "Priya Sen",
      email: "priya@gmail.com",
      parkingLot: "Howrah Station Parking",
      slot: "D2",
      vehicle: "WB14IJ7890",
      date: "21 Aug 2026",
      time: "08:30 AM - 12:30 PM",
      duration: "4 hrs",
      amount: 160,
      status: "Completed",
    },
    {
      id: "BK006",
      user: "Amit Ghosh",
      email: "amit@gmail.com",
      parkingLot: "New Town Parking",
      slot: "E1",
      vehicle: "WB20KL1234",
      date: "20 Aug 2026",
      time: "04:00 PM - 06:00 PM",
      duration: "2 hrs",
      amount: 80,
      status: "Cancelled",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(search.toLowerCase()) ||
      booking.user.toLowerCase().includes(search.toLowerCase()) ||
      booking.email.toLowerCase().includes(search.toLowerCase()) ||
      booking.parkingLot.toLowerCase().includes(search.toLowerCase()) ||
      booking.slot.toLowerCase().includes(search.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeBookings = bookings.filter(
    (booking) => booking.status === "Active",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const totalRevenue = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + booking.amount, 0);

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return {
        wrapper: "border-cyan-400/10 bg-cyan-400/[0.08] text-cyan-400",
        dot: "bg-cyan-400",
      };
    }

    if (status === "Confirmed") {
      return {
        wrapper: "border-blue-400/10 bg-blue-400/[0.08] text-blue-400",
        dot: "bg-blue-400",
      };
    }

    if (status === "Completed") {
      return {
        wrapper: "border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-400",
        dot: "bg-emerald-400",
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
                {filteredBookings.length} bookings found
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-gray-400 outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              >
                <option value="All Status" className="bg-[#0A0F1C]">
                  All Status
                </option>

                <option value="Active" className="bg-[#0A0F1C]">
                  Active
                </option>

                <option value="Confirmed" className="bg-[#0A0F1C]">
                  Confirmed
                </option>

                <option value="Completed" className="bg-[#0A0F1C]">
                  Completed
                </option>

                <option value="Cancelled" className="bg-[#0A0F1C]">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-312.5">
            <thead>
              <tr className="border-b border-white/10 bg-white/2]">
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
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusStyle(booking.status);

                return (
                  <tr
                    key={booking.id}
                    className="border-b border-white/6 transition-colors hover:bg-white/25"
                  >
                    {/* Booking */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/10 to-blue-500/10 text-xs font-bold text-cyan-400">
                          BK
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {booking.id}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-600">
                            Reservation
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-5 py-5">
                      <p className="text-sm font-medium text-gray-300">
                        {booking.user}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-600">
                        {booking.email}
                      </p>
                    </td>

                    {/* Parking */}
                    <td className="px-5 py-5">
                      <p className="text-sm text-gray-400">
                        {booking.parkingLot}
                      </p>
                    </td>

                    {/* Slot */}
                    <td className="px-5 py-5 text-center">
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
                    <td className="px-5 py-5">
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
                        onClick={() =>
                          console.log("View booking details:", booking.id)
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
        {filteredBookings.length === 0 && (
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
    </div>
  );
}

export default AdminBookings;