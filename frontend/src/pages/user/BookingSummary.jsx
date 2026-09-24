import { Link } from "react-router-dom";

function BookingSummary() {
  const bookingDetails = {
    parkingLot: "City Center Parking",
    location: "Main Street, Kolkata",
    slot: "A1",
    vehicle: "WB12AB1234",
    vehicleModel: "Hyundai Creta",
    duration: 3,
    ratePerHour: 40,
  };

  const totalAmount =
    bookingDetails.duration * bookingDetails.ratePerHour;

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
            Booking Summary
          </h1>

          <p className="mt-2 text-gray-400">
            Review your parking booking details before proceeding to payment.
          </p>
        </section>


        {/* Booking Details */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white">
            Booking Details
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Parking Lot
              </span>

              <span className="font-medium text-gray-200">
                {bookingDetails.parkingLot}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Location
              </span>

              <span className="font-medium text-gray-200">
                {bookingDetails.location}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Parking Slot
              </span>

              <span className="font-medium text-cyan-400">
                {bookingDetails.slot}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Vehicle
              </span>

              <span className="font-medium text-gray-200">
                {bookingDetails.vehicle}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Vehicle Model
              </span>

              <span className="font-medium text-gray-200">
                {bookingDetails.vehicleModel}
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Duration
              </span>

              <span className="font-medium text-gray-200">
                {bookingDetails.duration} Hours
              </span>
            </div>

          </div>

        </section>


        {/* Payment Summary */}
        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white">
            Payment Summary
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Parking Rate
              </span>

              <span className="font-medium text-gray-200">
                ₹{bookingDetails.ratePerHour} / hour
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Duration
              </span>

              <span className="font-medium text-gray-200">
                {bookingDetails.duration} Hours
              </span>
            </div>


            <div className="border-t border-gray-800 pt-4">

              <div className="flex items-center justify-between">

                <span className="text-lg font-bold text-white">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-cyan-400">
                  ₹{totalAmount}
                </span>

              </div>

            </div>

          </div>


          {/* Proceed to Payment */}
          <button
            type="button"
            onClick={() =>
              console.log("Proceed to Payment", bookingDetails)
            }
            className="mt-6 w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
          >
            PROCEED TO PAYMENT
          </button>

        </section>


        {/* Back */}
        <div>
          <Link
            to="/booking-duration"
            className="text-sm text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            ← Back to Booking Duration
          </Link>
        </div>

      </div>
    </div>
  );
}

export default BookingSummary;
