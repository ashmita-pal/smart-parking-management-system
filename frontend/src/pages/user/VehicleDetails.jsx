import { useState } from "react";
import { Link } from "react-router-dom";

function VehicleDetails() {
  const [vehicleData, setVehicleData] = useState({
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setVehicleData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Vehicle Data:", vehicleData);
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
            Add Vehicle
          </h1>

          <p className="mt-2 text-gray-400">
            Register your vehicle to use it for parking bookings.
          </p>
        </section>


        {/* Vehicle Form */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white">
            Vehicle Information
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* Vehicle Number */}
            <div>
              <label
                htmlFor="vehicleNumber"
                className="block text-sm font-medium text-gray-400"
              >
                Vehicle Number
              </label>

              <input
                id="vehicleNumber"
                name="vehicleNumber"
                type="text"
                value={vehicleData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. WB12AB1234"
                className="mt-2 w-full rounded-lg border border-gray-800 bg-[#070B14] px-4 py-3 uppercase text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                required
              />
            </div>


            {/* Vehicle Type */}
            <div>
              <label
                htmlFor="vehicleType"
                className="block text-sm font-medium text-gray-400"
              >
                Vehicle Type
              </label>

              <select
                id="vehicleType"
                name="vehicleType"
                value={vehicleData.vehicleType}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-800 bg-[#070B14] px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                required
              >
                <option value="" className="bg-[#0a0f1c]">
                  Select vehicle type
                </option>

                <option value="Car" className="bg-[#0a0f1c]">
                  Car
                </option>

                <option value="Bike" className="bg-[#0a0f1c]">
                  Bike
                </option>

                <option value="SUV" className="bg-[#0a0f1c]">
                  SUV
                </option>

                <option value="Other" className="bg-[#0a0f1c]">
                  Other
                </option>
              </select>
            </div>


            {/* Vehicle Model */}
            <div>
              <label
                htmlFor="vehicleModel"
                className="block text-sm font-medium text-gray-400"
              >
                Vehicle Model
              </label>

              <input
                id="vehicleModel"
                name="vehicleModel"
                type="text"
                value={vehicleData.vehicleModel}
                onChange={handleChange}
                placeholder="e.g. Hyundai Creta"
                className="mt-2 w-full rounded-lg border border-gray-800 bg-[#070B14] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                required
              />
            </div>


            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
            >
              ADD VEHICLE
            </button>

          </form>

        </section>


        {/* Back */}
        <div>
          <Link
            to="/my-vehicles"
            className="text-sm text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            ← Back to My Vehicles
          </Link>
        </div>

      </div>
    </div>
  );
}

export default VehicleDetails;
