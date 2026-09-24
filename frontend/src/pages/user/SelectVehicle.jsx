import { useState } from "react";
import { Link } from "react-router-dom";

function VehicleSelection() {
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const vehicles = [
    {
      id: 1,
      number: "WB12AB1234",
      type: "Car",
      model: "Hyundai Creta",
    },
    {
      id: 2,
      number: "WB06CD5678",
      type: "Bike",
      model: "Royal Enfield Classic 350",
    },
  ];

  function handleVehicleSelect(vehicleNumber) {
    setSelectedVehicle(vehicleNumber);
  }

  function handleContinue() {
    console.log("Selected Vehicle:", selectedVehicle);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">

      {/* Architectural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl space-y-8">

        {/* Page Heading */}
        <section>
          <h1 className="text-3xl font-bold text-white">
            Select Vehicle
          </h1>

          <p className="mt-2 text-gray-400">
            Choose the vehicle you will use for this parking booking.
          </p>
        </section>


        {/* Vehicle List */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              My Vehicles
            </h2>

            <button
              type="button"
              onClick={() => console.log("Add Vehicle")}
              className="rounded-lg border border-cyan-500/50 bg-cyan-500/5 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              + Add Vehicle
            </button>
          </div>


          {/* Vehicle Cards */}
          <div className="mt-6 space-y-4">

            {vehicles.map((vehicle) => {
              const isSelected =
                selectedVehicle === vehicle.number;

              return (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() =>
                    handleVehicleSelect(vehicle.number)
                  }
                  className={`w-full rounded-xl border-2 p-5 text-left transition ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-gray-800 bg-[#070B14] hover:border-cyan-500/50 hover:bg-white/[0.02]"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p
                        className={`text-lg font-bold ${
                          isSelected
                            ? "text-cyan-400"
                            : "text-white"
                        }`}
                      >
                        {vehicle.number}
                      </p>

                      <p className="mt-1 text-sm text-gray-300">
                        {vehicle.model}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Vehicle Type: {vehicle.type}
                      </p>
                    </div>


                    {/* Selection Indicator */}
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-gray-700"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#070B14]"></div>
                      )}
                    </div>

                  </div>

                </button>
              );
            })}

          </div>


          {/* Selected Vehicle */}
          <div className="mt-8 rounded-xl border border-gray-800/70 bg-[#070B14] p-4">

            <p className="text-sm text-gray-500">
              Selected Vehicle
            </p>

            <p className="mt-1 text-lg font-bold text-cyan-400">
              {selectedVehicle || "No vehicle selected"}
            </p>

          </div>


          {/* Continue */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedVehicle}
            className="mt-6 w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:bg-none disabled:text-gray-500 disabled:shadow-none"
          >
            CONTINUE
          </button>

        </section>


        {/* Back */}
        <div>
          <Link
            to="/parking-slots"
            className="text-sm text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            ← Back to Parking Slot Selection
          </Link>
        </div>

      </div>
    </div>
  );
}

export default VehicleSelection;
