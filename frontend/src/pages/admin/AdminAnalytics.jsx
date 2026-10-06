import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminAnalytics() {
  const [summary, setSummary] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryResponse, bookingResponse, revenueResponse] =
          await Promise.all([
            api.get("/dashboard/summary"),
            api.get("/dashboard/bookings"),
            api.get("/dashboard/revenue"),
          ]);

        setSummary(summaryResponse.data.data);
        setBookingStats(bookingResponse.data.data);
        setRevenueStats(revenueResponse.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load analytics data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ---------------------------------
  // Loading State
  // ---------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-gray-400">
          Loading analytics...
        </div>
      </div>
    );
  }

  // ---------------------------------
  // Error State
  // ---------------------------------

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
        <p className="text-sm font-semibold text-red-400">
          Unable to load analytics
        </p>

        <p className="mt-2 text-xs text-gray-500">
          {error}
        </p>
      </div>
    );
  }

  // ---------------------------------
  // Safe Data
  // ---------------------------------

  const safeSummary = summary || {};
  const safeBookingStats = bookingStats || {};
  const safeRevenueStats = revenueStats || {};

  // ---------------------------------
  // Revenue
  // ---------------------------------

  const totalRevenue = Number(
    safeRevenueStats.totalRevenue || 0,
  );

  const weeklyRevenue = Number(
    safeRevenueStats.weeklyRevenue || 0,
  );

  const bookingRevenue = Number(
    safeRevenueStats.bookingRevenue || 0,
  );

  // ---------------------------------
  // Bookings
  // ---------------------------------

  const totalBookings = Number(
    safeBookingStats.totalBookings || 0,
  );

  const weeklyBookings = Number(
    safeBookingStats.weeklyBookings || 0,
  );

  // ---------------------------------
  // Average Booking Value
  // ---------------------------------

  const averageBookingValue =
    totalBookings > 0
      ? totalRevenue / totalBookings
      : 0;

  // ---------------------------------
  // Parking Performance
  // ---------------------------------

  const parkingPerformance =
    safeRevenueStats.parkingPerformance || [];

  const averageOccupancy =
    parkingPerformance.length > 0
      ? Math.round(
          parkingPerformance.reduce(
            (total, lot) =>
              total + Number(lot.occupancy || 0),
            0,
          ) / parkingPerformance.length,
        )
      : 0;

  // ---------------------------------
  // Revenue Chart
  // ---------------------------------

  const revenueData =
    safeRevenueStats.dailyRevenue || [];

  const maxRevenue = Math.max(
    ...revenueData.map((item) =>
      Number(item.amount || 0),
    ),
    0,
  );

  // ---------------------------------
  // Vehicle Distribution
  // ---------------------------------

  const vehicleData =
    safeRevenueStats.vehicleDistribution || [];

  const totalVehicleBookings = Number(
    safeRevenueStats.totalVehicleBookings || 0,
  );

  // ---------------------------------
  // Insights
  // ---------------------------------

  const leadingParkingLot =
    parkingPerformance.length > 0
      ? [...parkingPerformance].sort(
          (a, b) =>
            Number(b.occupancy || 0) -
            Number(a.occupancy || 0),
        )[0]
      : null;

  const leadingVehicle =
    vehicleData.length > 0
      ? [...vehicleData].sort(
          (a, b) =>
            Number(b.percentage || 0) -
            Number(a.percentage || 0),
        )[0]
      : null;

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link
            to="/admin"
            className="transition-colors hover:text-cyan-400"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-gray-400">
            Analytics
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Analytics
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Monitor parking activity, revenue performance, and usage trends.
        </p>
      </div>

      {/* ================= OVERVIEW STATISTICS ================= */}

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
                ₹{weeklyRevenue.toLocaleString("en-IN")} this week
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ₹
            </div>
          </div>
        </div>

        {/* Total Bookings */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Bookings
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalBookings.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-cyan-400">
                {weeklyBookings.toLocaleString("en-IN")} this week
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
              ▣
            </div>
          </div>
        </div>

        {/* Average Booking */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Avg. Booking Value
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                ₹{Math.round(averageBookingValue).toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-blue-400">
                Based on total revenue
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-400">
              ◈
            </div>
          </div>
        </div>

        {/* Average Occupancy */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Avg. Occupancy
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {averageOccupancy}%
              </p>

              <p className="mt-1 text-xs text-purple-400">
                Across all parking lots
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-lg text-purple-400">
              %
            </div>
          </div>
        </div>
      </div>

      {/* ================= REVENUE CHART ================= */}

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl shadow-black/10">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Revenue Overview
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Daily revenue performance for the last 7 days.
            </p>
          </div>

          <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-xs font-medium text-cyan-400">
            Last 7 Days
          </div>
        </div>

        {/* Chart */}

        {revenueData.length === 0 ? (
          <div className="flex h-72 items-center justify-center border-b border-l border-white/10 text-xs text-gray-600">
            No revenue data available.
          </div>
        ) : (
          <div className="flex h-72 items-end gap-3 border-b border-l border-white/10 px-4 pb-0 pt-6 sm:gap-5">
            {revenueData.map((item) => {
              const amount = Number(item.amount || 0);

              const height =
                maxRevenue > 0
                  ? (amount / maxRevenue) * 100
                  : 0;

              return (
                <div
                  key={item.day}
                  className="group flex h-full flex-1 flex-col items-center justify-end"
                >
                  {/* Amount */}

                  <div className="mb-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-md border border-cyan-400/10 bg-[#070B14] px-2 py-1 text-[10px] font-medium text-cyan-400">
                      ₹{amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Bar */}

                  <div
                    className="w-full max-w-12 rounded-t-lg bg-linear-to-t from-blue-600/70 to-cyan-400/80 transition-all duration-300 group-hover:from-blue-500 group-hover:to-cyan-300"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  {/* Day */}

                  <span className="mt-3 text-[10px] font-medium text-gray-600">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Chart Labels */}

        <div className="mt-5 flex items-center justify-between text-[10px] text-gray-600">
          <span>₹0</span>

          <span>
            ₹
            {Math.round(
              maxRevenue * 0.33,
            ).toLocaleString("en-IN")}
          </span>

          <span>
            ₹
            {Math.round(
              maxRevenue * 0.66,
            ).toLocaleString("en-IN")}
          </span>

          <span>
            ₹{maxRevenue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* ================= SECOND ROW ================= */}

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Parking Performance */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl shadow-black/10">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Parking Lot Performance
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Performance comparison across facilities.
            </p>
          </div>

          <div className="space-y-5">
            {parkingPerformance.length === 0 ? (
              <p className="text-xs text-gray-600">
                No parking lot data available.
              </p>
            ) : (
              parkingPerformance.map((lot) => {
                const occupancy = Number(
                  lot.occupancy || 0,
                );

                const bookings = Number(
                  lot.bookings || 0,
                );

                const revenue = Number(
                  lot.revenue || 0,
                );

                return (
                  <div key={lot.name}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <p className="truncate text-xs font-medium text-gray-300">
                        {lot.name}
                      </p>

                      <span className="shrink-0 text-xs font-semibold text-cyan-400">
                        {occupancy}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-600"
                        style={{
                          width: `${occupancy}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-600">
                        {bookings} bookings
                      </span>

                      <span className="text-[10px] text-gray-600">
                        ₹{revenue.toLocaleString("en-IN")} revenue
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Vehicle Distribution */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl shadow-black/10">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Vehicle Distribution
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Booking distribution by vehicle type.
            </p>
          </div>

          <div className="space-y-5">
            {vehicleData.length === 0 ? (
              <p className="text-xs text-gray-600">
                No vehicle booking data available.
              </p>
            ) : (
              vehicleData.map((vehicle) => {
                const percentage = Number(
                  vehicle.percentage || 0,
                );

                const bookings = Number(
                  vehicle.bookings || 0,
                );

                const type = vehicle.type || "Other";

                const initial =
                  type === "Car"
                    ? "C"
                    : type === "SUV"
                      ? "S"
                      : type === "Bike"
                        ? "B"
                        : "O";

                return (
                  <div key={type}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4 text-xs text-gray-400">
                          {initial}
                        </span>

                        <span className="text-sm font-medium text-gray-300">
                          {type}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-white">
                          {percentage}%
                        </span>

                        <span className="ml-2 text-[10px] text-gray-600">
                          {bookings} bookings
                        </span>
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Total */}

          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Total vehicle bookings
              </span>

              <span className="text-sm font-semibold text-white">
                {totalVehicleBookings.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= INSIGHTS ================= */}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Insight 1 */}

        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-sm text-cyan-400">
              ↑
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Revenue is active
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                ₹
                {weeklyRevenue.toLocaleString("en-IN")}{" "}
                revenue has been recorded this week.
              </p>
            </div>
          </div>
        </div>

        {/* Insight 2 */}

        <div className="rounded-2xl border border-blue-400/10 bg-blue-400/3 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-sm text-blue-400">
              ◉
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {leadingParkingLot
                  ? `${leadingParkingLot.name} leads`
                  : "Parking performance"}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {leadingParkingLot
                  ? `${leadingParkingLot.name} currently has the highest occupancy rate at ${Number(
                      leadingParkingLot.occupancy || 0,
                    )}%.`
                  : "No parking performance data is available yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Insight 3 */}

        <div className="rounded-2xl border border-purple-400/10 bg-purple-400/3 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-sm text-purple-400">
              C
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {leadingVehicle
                  ? `${leadingVehicle.type} dominates`
                  : "Vehicle distribution"}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {leadingVehicle
                  ? `${leadingVehicle.type} accounts for ${Number(
                      leadingVehicle.percentage || 0,
                    )}% of recorded vehicle bookings.`
                  : "No vehicle booking data is available yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;