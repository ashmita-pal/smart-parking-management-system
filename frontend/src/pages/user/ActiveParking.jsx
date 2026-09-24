import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ActiveParking() {
  const [parkingSeconds, setParkingSeconds] = useState(4835);

  useEffect(() => {
    const timer = setInterval(() => {
      setParkingSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function formatParkingTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }

  const parkingDetails = {
    bookingId: "BK001",
    parkingLot: "City Center Parking",
    location: "Main Street, Kolkata",
    slot: "A1",
    vehicle: "WB12AB1234",
    checkInTime: "10:15 AM",
    bookedDuration: "3 Hours",
    expectedCheckout: "01:15 PM",
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Active Parking</h1>

        <p className="mt-2 text-gray-600">
          Your parking session is currently active.
        </p>
      </section>

      {/* Active Status */}
      <section className="rounded-xl border border-green-200 bg-green-50 p-6">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>

          <h2 className="text-lg font-bold text-green-800">
            Parking Session Active
          </h2>
        </div>

        <p className="mt-2 text-sm text-green-700">
          Your vehicle is currently parked in the selected parking slot.
        </p>
      </section>

      {/* Parking Details */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Parking Details</h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Booking ID</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.bookingId}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Parking Lot</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.parkingLot}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Location</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.location}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Parking Slot</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.slot}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Vehicle</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.vehicle}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Check-In Time</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.checkInTime}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Booked Duration</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.bookedDuration}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Expected Checkout</span>

            <span className="font-medium text-gray-900">
              {parkingDetails.expectedCheckout}
            </span>
          </div>
        </div>
      </section>

      {/* Parking Time */}
      <section className="rounded-xl border bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-gray-500">Parking Time</p>

        <p className="mt-2 text-3xl font-bold text-blue-600">
          {formatParkingTime(parkingSeconds)}
        </p>

        <p className="mt-2 text-sm text-gray-500">Current parking duration</p>
      </section>

      {/* Checkout */}
      <section>
        <button
          type="button"
          onClick={() => console.log("Checkout")}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          CHECKOUT
        </button>
      </section>

      {/* Back */}
      <div>
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default ActiveParking;