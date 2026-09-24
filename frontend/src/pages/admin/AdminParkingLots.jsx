import { Link } from "react-router-dom";
import { useState } from "react";

function AdminParkingLots() {
  const [search, setSearch] = useState("");

  const parkingLots = [
    {
      id: "PL001",
      name: "City Center Parking",
      location: "Main Street, Kolkata",
      totalSlots: 42,
      availableSlots: 14,
      occupiedSlots: 28,
      status: "Active",
    },
    {
      id: "PL002",
      name: "Salt Lake Parking",
      location: "Sector V, Kolkata",
      totalSlots: 36,
      availableSlots: 18,
      occupiedSlots: 18,
      status: "Active",
    },
    {
      id: "PL003",
      name: "Park Street Parking",
      location: "Park Street, Kolkata",
      totalSlots: 28,
      availableSlots: 6,
      occupiedSlots: 22,
      status: "Active",
    },
    {
      id: "PL004",
      name: "Howrah Station Parking",
      location: "Howrah, Kolkata",
      totalSlots: 30,
      availableSlots: 20,
      occupiedSlots: 10,
      status: "Active",
    },
    {
      id: "PL005",
      name: "New Town Parking",
      location: "Action Area 1, Kolkata",
      totalSlots: 25,
      availableSlots: 25,
      occupiedSlots: 0,
      status: "Inactive",
    },
  ];

  const filteredLots = parkingLots.filter(
    (lot) =>
      lot.name.toLowerCase().includes(search.toLowerCase()) ||
      lot.location.toLowerCase().includes(search.toLowerCase()) ||
      lot.id.toLowerCase().includes(search.toLowerCase()),
  );

  const getOccupancyPercentage = (occupied, total) => {
    return Math.round((occupied / total) * 100);
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

            <span className="text-gray-400">Parking Lots</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Parking Lots
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and monitor all parking facilities in the ParkSphere network.
          </p>
        </div>

        <button
          onClick={() => console.log("Add parking lot clicked")}
          className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/20"
        >
          <span className="text-lg leading-none">+</span>
          ADD PARKING LOT
        </button>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Lots */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Lots
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {parkingLots.length}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Registered facilities
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-400">
              ⌂
            </div>
          </div>
        </div>

        {/* Active Lots */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Active Lots
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {parkingLots.filter((lot) => lot.status === "Active").length}
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                Currently operational
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ✓
            </div>
          </div>
        </div>

        {/* Total Slots */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Slots
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {parkingLots.reduce((sum, lot) => sum + lot.totalSlots, 0)}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Across all facilities
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-400">
              ▥
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Available Slots
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {parkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0)}
              </p>

              <p className="mt-1 text-xs text-cyan-400">Ready for booking</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-lg text-purple-400">
              ◈
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl shadow-black/10">
        {/* Card Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              All Parking Facilities
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredLots.length} facilities found
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search parking lots..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Parking Lot
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Total Slots
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Available
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Occupied
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Occupancy
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLots.map((lot) => {
                const occupancy = getOccupancyPercentage(
                  lot.occupiedSlots,
                  lot.totalSlots,
                );

                return (
                  <tr
                    key={lot.id}
                    className="border-b border-white/6 transition-colors hover:bg-white/25"
                  >
                    {/* Parking Lot */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/10 to-blue-500/10 text-sm text-cyan-400">
                          P
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white">
                            {lot.name}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-600">
                            {lot.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-5">
                      <p className="text-sm text-gray-400">{lot.location}</p>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm font-medium text-white">
                        {lot.totalSlots}
                      </span>
                    </td>

                    {/* Available */}
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm font-semibold text-cyan-400">
                        {lot.availableSlots}
                      </span>
                    </td>

                    {/* Occupied */}
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm font-semibold text-orange-400">
                        {lot.occupiedSlots}
                      </span>
                    </td>

                    {/* Occupancy */}
                    <td className="px-5 py-5">
                      <div className="w-28">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[11px] text-gray-500">
                            Occupied
                          </span>

                          <span className="text-[11px] font-medium text-gray-400">
                            {occupancy}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5 text-center">
                      {lot.status === "Active" ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/8 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-gray-400/10 bg-gray-400/6 px-3 py-1.5 text-[11px] font-medium text-gray-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            console.log("View parking lot:", lot.id)
                          }
                          className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[11px] font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            console.log("Edit parking lot:", lot.id)
                          }
                          className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[11px] font-medium text-gray-400 transition-all hover:border-blue-400/20 hover:bg-blue-400/5 hover:text-blue-400"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLots.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4 text-2xl text-gray-600">
              ⌕
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No parking lots found
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              Try searching with a different parking lot name or location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminParkingLots;