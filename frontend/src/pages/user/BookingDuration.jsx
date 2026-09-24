import { useState } from "react";
import { Link } from "react-router-dom";

function BookingDuration() {
  const [duration, setDuration] = useState("");

  const ratePerHour = 40;

  const durationOptions = [1, 2, 3, 4, 6, 8];

  function handleDurationSelect(hours) {
    setDuration(hours);
  }

  function handleContinue() {
    const totalAmount = duration * ratePerHour;

    console.log("Duration:", duration);
    console.log("Total Amount:", totalAmount);
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
            Select Booking Duration
          </h1>

          <p className="mt-2 text-gray-400">
            Choose how long you want to park your vehicle.
          </p>
        </section>


        {/* Parking Information */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white">
            City Center Parking
          </h2>

          <p className="mt-2 text-cyan-400">
            Slot: A1
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Parking Rate: ₹{ratePerHour} per hour
          </p>

        </section>


        {/* Duration Selection */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white">
            Parking Duration
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">

            {durationOptions.map((hours) => {

              const isSelected = duration === hours;

              return (
                <button
                  key={hours}
                  type="button"
                  onClick={() => handleDurationSelect(hours)}
                  className={`rounded-xl border-2 px-5 py-5 font-semibold transition ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "border-gray-800 bg-[#070B14] text-gray-300 hover:border-cyan-500/50 hover:bg-white/[0.02] hover:text-white"
                  }`}
                >
                  {hours} {hours === 1 ? "Hour" : "Hours"}
                </button>
              );
            })}

          </div>


          {/* Booking Calculation */}
          <div className="mt-8 rounded-xl border border-gray-800/70 bg-[#070B14] p-5">

            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                Rate per hour
              </span>

              <span className="font-medium text-gray-200">
                ₹{ratePerHour}
              </span>
            </div>


            <div className="mt-3 flex items-center justify-between">
              <span className="text-gray-400">
                Duration
              </span>

              <span className="font-medium text-gray-200">
                {duration
                  ? `${duration} ${
                      duration === 1 ? "Hour" : "Hours"
                    }`
                  : "Not selected"}
              </span>
            </div>


            <div className="mt-4 border-t border-gray-800 pt-4">

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-cyan-400">
                  ₹{duration ? duration * ratePerHour : 0}
                </span>
              </div>

            </div>

          </div>


          {/* Continue */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!duration}
            className="mt-6 w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:bg-none disabled:text-gray-500 disabled:shadow-none"
          >
            CONTINUE
          </button>

        </section>


        {/* Back */}
        <div>
          <Link
            to="/select-vehicle"
            className="text-sm text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            ← Back to Vehicle Selection
          </Link>
        </div>

      </div>
    </div>
  );
}

export default BookingDuration;
