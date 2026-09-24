import { Link } from "react-router-dom";
import { useState } from "react";

function AdminParkingSlots() {
  const [search, setSearch] = useState("");
  const [selectedLot, setSelectedLot] = useState("All Parking Lots");

  const parkingLots = [
    "All Parking Lots",
    "City Center Parking",
    "Salt Lake Parking",
    "Park Street Parking",
    "Howrah Station Parking",
    "New Town Parking",
  ];

  const parkingSlots = [
    {
      id: "SL001",
      slotNumber: "A1",
      parkingLot: "City Center Parking",
      floor: "Floor 1",
      type: "Car",
      status: "Occupied",
    },
    {
      id: "SL002",
      slotNumber: "A2",
      parkingLot: "City Center Parking",
      floor: "Floor 1",
      type: "Car",
      status: "Available",
    },
    {
      id: "SL003",
      slotNumber: "A3",
      parkingLot: "City Center Parking",
      floor: "Floor 1",
      type: "SUV",
      status: "Available",
    },
    {
      id: "SL004",
      slotNumber: "A4",
      parkingLot: "City Center Parking",
      floor: "Floor 1",
      type: "Bike",
      status: "Occupied",
    },
    {
      id: "SL005",
      slotNumber: "B1",
      parkingLot: "Salt Lake Parking",
      floor: "Floor 1",
      type: "Car",
      status: "Available",
    },
    {
      id: "SL006",
      slotNumber: "B2",
      parkingLot: "Salt Lake Parking",
      floor: "Floor 1",
      type: "Car",
      status: "Reserved",
    },
    {
      id: "SL007",
      slotNumber: "B3",
      parkingLot: "Salt Lake Parking",
      floor: "Floor 2",
      type: "SUV",
      status: "Occupied",
    },
    {
      id: "SL008",
      slotNumber: "C1",
      parkingLot: "Park Street Parking",
      floor: "Floor 1",
      type: "Car",
      status: "Available",
    },
    {
      id: "SL009",
      slotNumber: "C2",
      parkingLot: "Park Street Parking",
      floor: "Floor 1",
      type: "Car",
      status: "Occupied",
    },
    {
      id: "SL010",
      slotNumber: "D1",
      parkingLot: "Howrah Station Parking",
      floor: "Floor 1",
      type: "Bike",
      status: "Available",
    },
    {
      id: "SL011",
      slotNumber: "D2",
      parkingLot: "Howrah Station Parking",
      floor: "Floor 2",
      type: "Car",
      status: "Available",
    },
    {
      id: "SL012",
      slotNumber: "E1",
      parkingLot: "New Town Parking",
      floor: "Floor 1",
      type: "Car",
      status: "Unavailable",
    },
  ];

  const filteredSlots = parkingSlots.filter((slot) => {
    const matchesSearch =
      slot.slotNumber.toLowerCase().includes(search.toLowerCase()) ||
      slot.parkingLot.toLowerCase().includes(search.toLowerCase()) ||
      slot.id.toLowerCase().includes(search.toLowerCase());

    const matchesLot =
      selectedLot === "All Parking Lots" || slot.parkingLot === selectedLot;

    return matchesSearch && matchesLot;
  });

  const totalSlots = parkingSlots.length;

  const availableSlots = parkingSlots.filter(
    (slot) => slot.status === "Available",
  ).length;

  const occupiedSlots = parkingSlots.filter(
    (slot) => slot.status === "Occupied",
  ).length;

  const reservedSlots = parkingSlots.filter(
    (slot) => slot.status === "Reserved",
  ).length;

  const getStatusStyle = (status) => {
    if (status === "Available") {
      return {
        wrapper: "border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    if (status === "Occupied") {
      return {
        wrapper: "border-orange-400/10 bg-orange-400/[0.08] text-orange-400",
        dot: "bg-orange-400",
      };
    }

    if (status === "Reserved") {
      return {
        wrapper: "border-blue-400/10 bg-blue-400/[0.08] text-blue-400",
        dot: "bg-blue-400",
      };
    }

    return {
      wrapper: "border-gray-400/10 bg-gray-400/[0.06] text-gray-500",
      dot: "bg-gray-500",
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

            <span className="text-gray-400">Parking Slots</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Parking Slots
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage parking spaces and monitor their current availability.
          </p>
        </div>

        <button
          onClick={() => console.log("Add parking slot clicked")}
          className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/20"
        >
          <span className="text-lg leading-none">+</span>
          ADD PARKING SLOT
        </button>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Slots */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Slots
              </p>

              <p className="mt-2 text-3xl font-bold text-white">{totalSlots}</p>

              <p className="mt-1 text-xs text-gray-600">
                Registered parking spaces
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
              ▥
            </div>
          </div>
        </div>

        {/* Available */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Available
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {availableSlots}
              </p>

              <p className="mt-1 text-xs text-emerald-400">Ready for booking</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ✓
            </div>
          </div>
        </div>

        {/* Occupied */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Occupied
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {occupiedSlots}
              </p>

              <p className="mt-1 text-xs text-orange-400">Currently in use</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-lg text-orange-400">
              ●
            </div>
          </div>
        </div>

        {/* Reserved */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Reserved
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {reservedSlots}
              </p>

              <p className="mt-1 text-xs text-blue-400">Booked in advance</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-400">
              ◈
            </div>
          </div>
        </div>
      </div>

      {/* ================= SLOT MANAGEMENT CARD ================= */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl shadow-black/10">
        {/* Card Header */}
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                All Parking Slots
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredSlots.length} slots found
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
                  placeholder="Search slots..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              {/* Parking Lot Filter */}
              <select
                value={selectedLot}
                onChange={(e) => setSelectedLot(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-gray-400 outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              >
                {parkingLots.map((lot) => (
                  <option key={lot} value={lot} className="bg-[#0A0F1C]">
                    {lot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Slot
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Parking Lot
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Floor
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Vehicle Type
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
              {filteredSlots.map((slot) => {
                const statusStyle = getStatusStyle(slot.status);

                return (
                  <tr
                    key={slot.id}
                    className="border-b border-white/6 transition-colors hover:bg-white/2.5"
                  >
                    {/* Slot */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/10 to-blue-500/10 text-sm font-bold text-cyan-400">
                          {slot.slotNumber}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            Slot {slot.slotNumber}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-600">
                            {slot.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Parking Lot */}
                    <td className="px-5 py-5">
                      <p className="text-sm text-gray-400">{slot.parkingLot}</p>
                    </td>

                    {/* Floor */}
                    <td className="px-5 py-5">
                      <span className="rounded-lg border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-gray-400">
                        {slot.floor}
                      </span>
                    </td>

                    {/* Vehicle Type */}
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm text-gray-400">{slot.type}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${statusStyle.wrapper}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                        />

                        {slot.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            console.log("View parking slot:", slot.id)
                          }
                          className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[11px] font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            console.log("Edit parking slot:", slot.id)
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
        {filteredSlots.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4 text-2xl text-gray-600">
              ⌕
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No parking slots found
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              Try changing your search or parking lot filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminParkingSlots;