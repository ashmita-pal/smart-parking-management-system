import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard/summary");

        setDashboard(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalSlots = dashboard?.parking?.totalSlots ?? 0;
  const occupiedSlots = dashboard?.parking?.occupiedSlots ?? 0;
  const availableSlots = dashboard?.parking?.availableSlots ?? 0;

  const occupancyPercentage =
    totalSlots > 0
      ? Math.round((occupiedSlots / totalSlots) * 100)
      : 0;

  const stats = [
    {
      title: "Total Parking Lots",
      value: dashboard?.parking?.totalLots ?? 0,
      detail: "Across all locations",
    },
    {
      title: "Total Parking Slots",
      value: totalSlots,
      detail: "Registered parking slots",
    },
    {
      title: "Active Bookings",
      value: dashboard?.bookings?.active ?? 0,
      detail: "Currently active",
    },
    {
      title: "Today's Revenue",
      value: `₹${(dashboard?.revenue?.today ?? 0).toLocaleString("en-IN")}`,
      detail: "From parking payments",
    },
  ];

  const formatStatus = (status) => {
    if (!status) return "";

    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-8 font-sans text-white sm:px-6 lg:px-8">
      {/* Architectural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-600/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
              ParkSphere Control Center
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-gray-400">
              Monitor parking operations, bookings, occupancy and revenue from
              one central dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800/80 bg-[#0a0f1c]/90 px-5 py-3 shadow-xl backdrop-blur-md">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              System Status
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-sm font-medium text-green-400">
                All Systems Operational
              </span>
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md">
            <p className="text-sm text-gray-400">
              Loading dashboard data...
            </p>
          </section>
        )}

        {/* Error */}
        {error && (
          <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-2xl backdrop-blur-md">
            <p className="text-sm text-red-400">{error}</p>
          </section>
        )}

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30"
            >
              <p className="text-sm text-gray-500">{stat.title}</p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-gray-500">{stat.detail}</p>
            </div>
          ))}
        </section>

        {/* Occupancy Overview */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Parking Occupancy
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current slot availability across the system
              </p>
            </div>

            <span className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-medium text-cyan-400">
              {occupancyPercentage}% Occupied
            </span>
          </div>

          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-600"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">
                  {occupiedSlots}
                </p>
                <p className="mt-1 text-xs text-gray-500">Occupied</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-cyan-400">
                  {availableSlots}
                </p>
                <p className="mt-1 text-xs text-gray-500">Available</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-gray-300">
                  {totalSlots}
                </p>
                <p className="mt-1 text-xs text-gray-500">Total Slots</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Bookings + Quick Actions */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Recent Bookings */}
          <section className="xl:col-span-2 rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Latest parking activity
                </p>
              </div>

              <Link
                to="/admin/bookings"
                className="text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-175">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-sm text-gray-500">
                    <th className="px-4 py-3 font-medium">Booking ID</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Parking Lot</th>
                    <th className="px-4 py-3 font-medium">Slot</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard?.recentBookings?.length > 0 ? (
                    dashboard.recentBookings.map((booking) => {
                      let statusClass =
                        "border-blue-500/20 bg-blue-500/10 text-blue-400";

                      if (booking.bookingStatus === "ACTIVE") {
                        statusClass =
                          "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";
                      }

                      if (booking.bookingStatus === "COMPLETED") {
                        statusClass =
                          "border-green-500/20 bg-green-500/10 text-green-400";
                      }

                      if (booking.bookingStatus === "CANCELLED") {
                        statusClass =
                          "border-red-500/20 bg-red-500/10 text-red-400";
                      }

                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-800/70 last:border-b-0 transition-colors hover:bg-white/2"
                        >
                          <td className="px-4 py-4 font-medium text-cyan-400">
                            {booking.bookingReference}
                          </td>

                          <td className="px-4 py-4 text-gray-300">
                            {booking.user?.name || "N/A"}
                          </td>

                          <td className="px-4 py-4 text-gray-400">
                            {booking.lot?.name || "N/A"}
                          </td>

                          <td className="px-4 py-4 font-medium text-gray-300">
                            {booking.slot
                              ? `Floor ${booking.slot.floorNumber} - ${booking.slot.slotNumber}`
                              : "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusClass}`}
                            >
                              {formatStatus(booking.bookingStatus)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the parking system
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/admin/parking-lots"
                className="block rounded-xl border border-gray-800 bg-[#070B14] p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
              >
                <p className="font-semibold text-white">Parking Lots</p>
                <p className="mt-1 text-sm text-gray-500">
                  Add and manage parking locations
                </p>
              </Link>

              <Link
                to="/admin/parking-slots"
                className="block rounded-xl border border-gray-800 bg-[#070B14] p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
              >
                <p className="font-semibold text-white">Parking Slots</p>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor and manage parking slots
                </p>
              </Link>

              <Link
                to="/admin/bookings"
                className="block rounded-xl border border-gray-800 bg-[#070B14] p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
              >
                <p className="font-semibold text-white">Bookings</p>
                <p className="mt-1 text-sm text-gray-500">
                  Review current and past bookings
                </p>
              </Link>

              <Link
                to="/admin/analytics"
                className="block rounded-xl border border-gray-800 bg-[#070B14] p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
              >
                <p className="font-semibold text-white">Analytics</p>
                <p className="mt-1 text-sm text-gray-500">
                  View parking and revenue insights
                </p>
              </Link>
            </div>
          </section>
        </div>

        {/* Revenue Snapshot */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Revenue Snapshot
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Today's parking revenue
              </p>
            </div>

            <Link
              to="/admin/payments"
              className="text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
            >
              View Payments
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-4xl font-bold tracking-tight text-white">
                ₹{(dashboard?.revenue?.today ?? 0).toLocaleString("en-IN")}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Today's successful parking payments
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-800 bg-[#070B14] px-5 py-4">
                <p className="text-xs text-gray-500">Bookings</p>
                <p className="mt-1 text-lg font-bold text-gray-200">
                  {dashboard?.bookings?.confirmed ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#070B14] px-5 py-4">
                <p className="text-xs text-gray-500">Overstay</p>
                <p className="mt-1 text-lg font-bold text-orange-400">
                  {dashboard?.bookings?.overstayPaymentPending ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#070B14] px-5 py-4">
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="mt-1 text-lg font-bold text-cyan-400">
                  ₹{(dashboard?.revenue?.total ?? 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;