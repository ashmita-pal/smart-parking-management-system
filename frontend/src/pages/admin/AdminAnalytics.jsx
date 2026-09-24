import { Link } from "react-router-dom";

function AdminAnalytics() {
  const revenueData = [
    { day: "Mon", amount: 8200 },
    { day: "Tue", amount: 10400 },
    { day: "Wed", amount: 9100 },
    { day: "Thu", amount: 12800 },
    { day: "Fri", amount: 11600 },
    { day: "Sat", amount: 15200 },
    { day: "Sun", amount: 12480 },
  ];

  const maxRevenue = Math.max(...revenueData.map((item) => item.amount));

  const parkingPerformance = [
    {
      name: "City Center Parking",
      bookings: 142,
      revenue: 5680,
      occupancy: 82,
    },
    {
      name: "Salt Lake Parking",
      bookings: 118,
      revenue: 4720,
      occupancy: 71,
    },
    {
      name: "Park Street Parking",
      bookings: 96,
      revenue: 3840,
      occupancy: 76,
    },
    {
      name: "Howrah Station Parking",
      bookings: 84,
      revenue: 3360,
      occupancy: 58,
    },
    {
      name: "New Town Parking",
      bookings: 62,
      revenue: 2480,
      occupancy: 49,
    },
  ];

  const vehicleData = [
    {
      type: "Car",
      percentage: 62,
      bookings: 312,
    },
    {
      type: "SUV",
      percentage: 21,
      bookings: 106,
    },
    {
      type: "Bike",
      percentage: 14,
      bookings: 71,
    },
    {
      type: "Other",
      percentage: 3,
      bookings: 15,
    },
  ];

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/admin" className="transition-colors hover:text-cyan-400">
            Admin
          </Link>

          <span>/</span>

          <span className="text-gray-400">Analytics</span>
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

              <p className="mt-2 text-3xl font-bold text-white">₹12,480</p>

              <p className="mt-1 text-xs text-emerald-400">
                +12.5% from last week
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

              <p className="mt-2 text-3xl font-bold text-white">518</p>

              <p className="mt-1 text-xs text-cyan-400">+8.4% from last week</p>
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

              <p className="mt-2 text-3xl font-bold text-white">₹312</p>

              <p className="mt-1 text-xs text-blue-400">+4.2% improvement</p>
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

              <p className="mt-2 text-3xl font-bold text-white">68%</p>

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
              Daily revenue performance for the current week.
            </p>
          </div>

          <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-xs font-medium text-cyan-400">
            Last 7 Days
          </div>
        </div>

        {/* Chart */}
        <div className="flex h-72 items-end gap-3 border-b border-l border-white/10 px-4 pb-0 pt-6 sm:gap-5">
          {revenueData.map((item) => {
            const height = (item.amount / maxRevenue) * 100;

            return (
              <div
                key={item.day}
                className="group flex h-full flex-1 flex-col items-center justify-end"
              >
                {/* Amount */}
                <div className="mb-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-md border border-cyan-400/10 bg-[#070B14] px-2 py-1 text-[10px] font-medium text-cyan-400">
                    ₹{item.amount.toLocaleString("en-IN")}
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

        {/* Chart Labels */}
        <div className="mt-5 flex items-center justify-between text-[10px] text-gray-600">
          <span>₹0</span>
          <span>₹5K</span>
          <span>₹10K</span>
          <span>₹15K</span>
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
            {parkingPerformance.map((lot) => (
              <div key={lot.name}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="truncate text-xs font-medium text-gray-300">
                    {lot.name}
                  </p>

                  <span className="shrink-0 text-xs font-semibold text-cyan-400">
                    {lot.occupancy}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-600"
                    style={{
                      width: `${lot.occupancy}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-gray-600">
                    {lot.bookings} bookings
                  </span>

                  <span className="text-[10px] text-gray-600">
                    ₹{lot.revenue.toLocaleString("en-IN")} revenue
                  </span>
                </div>
              </div>
            ))}
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
            {vehicleData.map((vehicle) => (
              <div key={vehicle.type}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4 text-xs text-gray-400">
                      {vehicle.type === "Car"
                        ? "C"
                        : vehicle.type === "SUV"
                          ? "S"
                          : vehicle.type === "Bike"
                            ? "B"
                            : "O"}
                    </span>

                    <span className="text-sm font-medium text-gray-300">
                      {vehicle.type}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-semibold text-white">
                      {vehicle.percentage}%
                    </span>

                    <span className="ml-2 text-[10px] text-gray-600">
                      {vehicle.bookings} bookings
                    </span>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-500"
                    style={{
                      width: `${vehicle.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Total vehicle bookings
              </span>

              <span className="text-sm font-semibold text-white">504</span>
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
                Revenue is growing
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Revenue increased by 12.5% compared with the previous week.
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
                City Center leads
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                City Center Parking currently has the highest occupancy rate.
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
              <p className="text-sm font-semibold text-white">Cars dominate</p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Cars account for 62% of all recorded vehicle bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;