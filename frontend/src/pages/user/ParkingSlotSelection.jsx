import { useState } from "react";
import { Link } from "react-router-dom";

function ParkingSlotSelection() {
  const [selectedSlot, setSelectedSlot] = useState("");

  const slots = [
    { id: "A1", status: "available" },
    { id: "A2", status: "available" },
    { id: "A3", status: "occupied" },
    { id: "A4", status: "available" },
    { id: "B1", status: "available" },
    { id: "B2", status: "occupied" },
    { id: "B3", status: "available" },
    { id: "B4", status: "available" },
  ];

  function handleSlotClick(slot) {
    if (slot.status === "occupied") {
      return;
    }

    setSelectedSlot(slot.id);
  }

  function handleContinue() {
    console.log("Selected Slot:", selectedSlot);
  }

  return (
    <div className="relative space-y-10">
      {/* Background Atmospheric Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-[10rem] bg-linear-to-r from-blue-700/5 via-cyan-600/10 to-purple-800/10 blur-[150px]" />

      {/* Page Heading */}
      <section className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />

          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
            Parking Allocation
          </span>
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          Select{" "}
          <span className="bg-linear-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Parking Slot
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          Choose an available parking slot for your vehicle.
        </p>
      </section>

      {/* Parking Lot Information */}
      <section className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C]/80 p-7 shadow-xl shadow-cyan-500/5 backdrop-blur-xl">
        {/* Top Boundary */}
        <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
              Selected Location
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              City Center Parking
            </h2>

            <p className="mt-2 text-gray-400">Main Street, Kolkata</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/10 bg-white/3 px-5 py-3">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Available
              </p>

              <p className="mt-1 text-lg font-bold text-cyan-400">6 Slots</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/3 px-5 py-3">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Rate
              </p>

              <p className="mt-1 text-lg font-bold text-white">₹40/hour</p>
            </div>
          </div>
        </div>
      </section>

      {/* Slot Selection */}
      <section className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C]/80 p-7 shadow-xl shadow-cyan-500/5 backdrop-blur-xl">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Available Slots
        </h2>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-cyan-400/50 bg-cyan-400/10" />
            <span>Available</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-blue-500 bg-blue-500" />
            <span>Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-gray-700 bg-gray-800" />
            <span>Occupied</span>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            const isOccupied = slot.status === "occupied";

            let slotClass =
              "border-cyan-400/30 bg-cyan-400/5 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-400/10";

            if (isOccupied) {
              slotClass =
                "cursor-not-allowed border-white/5 bg-white/[0.03] text-gray-600";
            }

            if (isSelected) {
              slotClass =
                "border-blue-400 bg-linear-to-br from-cyan-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20";
            }

            return (
              <button
                key={slot.id}
                type="button"
                disabled={isOccupied}
                onClick={() => handleSlotClick(slot)}
                className={`rounded-2xl border-2 px-6 py-6 text-center font-semibold transition-all duration-200 ${slotClass}`}
              >
                <span className="text-xl font-bold">{slot.id}</span>

                <span className="mt-2 block text-xs font-normal uppercase tracking-wider">
                  {isOccupied
                    ? "Occupied"
                    : isSelected
                      ? "Selected"
                      : "Available"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Slot */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#050810]/80 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Selected Slot
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {selectedSlot || "No slot selected"}
          </p>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedSlot}
          className="mt-6 w-full rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-purple-600 px-5 py-4 font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:from-gray-800 disabled:via-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:shadow-none"
        >
          CONTINUE
        </button>
      </section>

      {/* Back Link */}
      <div className="relative z-10">
        <Link
          to="/find-parking"
          className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Find Parking
        </Link>
      </div>
    </div>
  );
}

export default ParkingSlotSelection;