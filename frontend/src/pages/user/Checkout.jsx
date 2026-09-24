import { Link } from "react-router-dom";

function Checkout() {
  const parkingDetails = {
    bookingId: "BK001",
    parkingLot: "City Center Parking",
    slot: "A1",
    vehicle: "WB12AB1234",
    checkInTime: "10:15 AM",
    expectedCheckout: "01:15 PM",
    actualCheckout: "01:35 PM",
    gracePeriod: "10 Minutes",
    overstayDuration: "10 Minutes",
    overstayFee: 20,
  };

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden font-sans py-10">

      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-[25%] right-[-15%] w-100 h-100 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-6">

        {/* Page Heading */}
        <section>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Parking Checkout
          </h1>

          <p className="mt-2 text-gray-400">
            Review your parking session and complete the checkout process.
          </p>
        </section>


        {/* Overstay Alert */}
        <section className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 shadow-[0_0_25px_rgba(239,68,68,0.08)]">

          <h2 className="text-lg font-bold text-red-400">
            Overstay Detected
          </h2>

          <p className="mt-2 text-sm text-red-300/80">
            Your parking session has exceeded the booked duration.
            An additional overstay fee is required.
          </p>

        </section>


        {/* Parking Details */}
        <section className="mt-6 rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-8 shadow-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300">

          <h2 className="text-xl font-bold text-white">
            Parking Details
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Booking ID
              </span>

              <span className="font-medium text-cyan-400">
                {parkingDetails.bookingId}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Parking Lot
              </span>

              <span className="font-medium text-gray-200">
                {parkingDetails.parkingLot}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Parking Slot
              </span>

              <span className="font-medium text-cyan-400">
                {parkingDetails.slot}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Vehicle
              </span>

              <span className="font-medium text-gray-200">
                {parkingDetails.vehicle}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Check-In Time
              </span>

              <span className="font-medium text-gray-200">
                {parkingDetails.checkInTime}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Expected Checkout
              </span>

              <span className="font-medium text-gray-200">
                {parkingDetails.expectedCheckout}
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Actual Checkout
              </span>

              <span className="font-medium text-gray-200">
                {parkingDetails.actualCheckout}
              </span>
            </div>

          </div>

        </section>


        {/* Overstay Summary */}
        <section className="mt-6 rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-8 shadow-2xl backdrop-blur-md hover:border-red-500/30 transition-all duration-300">

          <h2 className="text-xl font-bold text-white">
            Overstay Summary
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Grace Period
              </span>

              <span className="font-medium text-gray-200">
                {parkingDetails.gracePeriod}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-500">
                Overstay Duration
              </span>

              <span className="font-medium text-red-400">
                {parkingDetails.overstayDuration}
              </span>
            </div>


            <div className="border-t border-gray-800 pt-4">

              <div className="flex items-center justify-between">

                <span className="text-lg font-bold text-white">
                  Overstay Fee
                </span>

                <span className="text-2xl font-bold text-red-400">
                  ₹{parkingDetails.overstayFee}
                </span>

              </div>

            </div>

          </div>


          {/* Payment Button */}
          <button
            type="button"
            onClick={() =>
              console.log(
                "Pay Overstay Fee:",
                parkingDetails.overstayFee
              )
            }
            className="mt-6 w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 transition-all duration-300"
          >
            PAY OVERSTAY FEE
          </button>

        </section>


        {/* Back */}
        <div className="mt-6">

          <Link
            to="/active-parking"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Active Parking
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Checkout;

