import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

function FindParking() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    location: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [parkingLots, setParkingLots] = useState([]);
  const [selectedParkingLot, setSelectedParkingLot] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [vehicleError, setVehicleError] = useState("");
  const [bookingError, setBookingError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setSearchData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // ==================================================
  // SEARCH PARKING
  // ==================================================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      setSelectedParkingLot(null);
      setVehicles([]);
      setSelectedVehicle(null);
      setSelectedSlot(null);
      setVehicleError("");
      setBookingError("");

      console.log("Search data:", searchData);

      const response = await api.get("/availability", {
        params: {
          location: searchData.location,
          date: searchData.date,
          startTime: searchData.startTime,
          endTime: searchData.endTime,
        },
      });

      console.log("Parking lots:", response.data);

      setParkingLots(response.data.data.parkingLots);
    } catch (error) {
      console.error("Failed to fetch parking lots:", error);

      const message =
        error.response?.data?.message || "Unable to fetch parking lots.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // SELECT PARKING LOT
  // ==================================================

  async function handleParkingLotClick(parkingLot) {
    try {
      setSelectedParkingLot(parkingLot);

      setVehicles([]);
      setSelectedVehicle(null);
      setSelectedSlot(null);

      setVehicleLoading(true);
      setVehicleError("");
      setBookingError("");

      console.log("Selected parking lot:", parkingLot);

      const response = await api.get("/vehicle");

      console.log("Registered vehicles:", response.data);

      const userVehicles = response.data.data;

      setVehicles(userVehicles);

      if (userVehicles.length === 0) {
        setVehicleError(
          "You do not have any registered vehicles. Please register a vehicle before selecting a parking slot.",
        );
      }
    } catch (error) {
      console.error("Failed to fetch registered vehicles:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      const message =
        error.response?.data?.message ||
        "Unable to fetch your registered vehicles.";

      setVehicleError(message);
      setVehicles([]);
    } finally {
      setVehicleLoading(false);
    }
  }

  // ==================================================
  // SELECT VEHICLE
  // ==================================================

  function handleVehicleSelect(vehicle) {
    setSelectedVehicle(vehicle);
    setSelectedSlot(null);
    setBookingError("");

    console.log("Selected vehicle:", vehicle);
  }

  // ==================================================
  // SELECT SLOT
  // ==================================================

  function handleSlotSelect(slot) {
    setSelectedSlot(slot);
    setBookingError("");

    console.log("Selected parking slot:", slot);
  }

  // ==================================================
  // BACK TO PARKING LOTS
  // ==================================================

  function handleBackToParkingLots() {
    setSelectedParkingLot(null);
    setVehicles([]);
    setSelectedVehicle(null);
    setSelectedSlot(null);
    setVehicleError("");
    setBookingError("");
  }

  // ==================================================
  // INITIATE BOOKING
  // ==================================================

  async function handleBookNow() {
    if (!selectedParkingLot) {
      setBookingError("Please select a parking lot.");
      return;
    }

    if (!selectedVehicle) {
      setBookingError("Please select a vehicle.");
      return;
    }

    if (!selectedSlot) {
      setBookingError("Please select a parking slot.");
      return;
    }

    if (!searchData.date || !searchData.startTime || !searchData.endTime) {
      setBookingError(
        "Please select a reservation date, start time and end time.",
      );
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      /*
       * The backend expects:
       *
       * slotId
       * vehicleId
       * startTime
       * endTime
       *
       * We construct the date/time using the values
       * selected by the user in the search form.
       */

      const startTime = `${searchData.date}T${searchData.startTime}:00`;
      const endTime = `${searchData.date}T${searchData.endTime}:00`;

      const bookingData = {
        slotId: selectedSlot.id,
        vehicleId: selectedVehicle.id,
        startTime,
        endTime,
      };

      console.log("Creating booking:", bookingData);

      const response = await api.post("/bookings", bookingData);

      console.log("Booking created:", response.data);

      const booking = response.data.data;

      /*
       * Booking has been successfully created.
       *
       * We now move the user to the booking details page.
       */
      navigate(`/booking-details/${booking.id}`);
    } catch (error) {
      console.error("Failed to create booking:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      const message =
        error.response?.data?.message ||
        "Unable to create booking. Please try again.";

      setBookingError(message);
    } finally {
      setBookingLoading(false);
    }
  }

  // ==================================================
  // COMPATIBLE SLOTS
  // ==================================================

  const compatibleSlots =
    selectedParkingLot && selectedVehicle
      ? selectedParkingLot.slots.filter(
          (slot) => slot.slotType === selectedVehicle.vehicleType,
        )
      : [];

  return (
    <div className="relative space-y-12">
      {/* Background Atmospheric Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-[10rem] bg-linear-to-r from-blue-700/5 via-cyan-600/10 to-purple-800/10 blur-[150px]" />

      {/* ================================================== */}
      {/* PAGE HEADER */}
      {/* ================================================== */}

      <section className="relative z-10">
        <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-900/30 px-4 py-1.5 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />

          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
            Live Search Grid
          </span>
        </div>

        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
          Find{" "}
          <span className="bg-linear-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Parking
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-xl leading-relaxed text-gray-400">
          Search available parking spaces near your destination across the
          unified parking grid. Secure your spot in real-time.
        </p>
      </section>

      {/* ================================================== */}
      {/* SEARCH FORM */}
      {/* ================================================== */}

      <section className="group relative z-10 rounded-2xl border border-white/10 bg-[#0A0F1C]/80 p-10 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30">
        <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-transparent via-cyan-400/60 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />

        <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <svg
              className="h-5 w-5 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0"
              />
            </svg>
          </span>
          Search Parameters
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-7 md:grid-cols-2"
        >
          {/* Location */}
          <div className="md:col-span-2">
            <label
              htmlFor="location"
              className="mb-2.5 block text-sm font-semibold text-gray-300"
            >
              Destination Neighborhood
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={searchData.location}
              onChange={handleChange}
              placeholder="Enter city, landmark, or location"
              className="w-full rounded-xl border border-white/10 bg-[#050810] px-5 py-4 text-lg text-white outline-none shadow-inner transition-all placeholder:text-gray-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="mb-2.5 block text-sm font-semibold text-gray-300"
            >
              Reservation Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={searchData.date}
              onChange={handleChange}
              className="scheme-dark w-full rounded-xl border border-white/10 bg-[#050810] px-5 py-4 text-lg text-white outline-none shadow-inner transition-all focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
              required
            />
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label
                htmlFor="startTime"
                className="mb-2.5 block text-sm font-semibold text-gray-300"
              >
                Start Time
              </label>

              <input
                id="startTime"
                name="startTime"
                type="time"
                value={searchData.startTime}
                onChange={handleChange}
                className="scheme-dark w-full rounded-xl border border-white/10 bg-[#050810] px-4 py-4 text-white outline-none shadow-inner transition-all focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label
                htmlFor="endTime"
                className="mb-2.5 block text-sm font-semibold text-gray-300"
              >
                End Time
              </label>

              <input
                id="endTime"
                name="endTime"
                type="time"
                value={searchData.endTime}
                onChange={handleChange}
                className="scheme-dark w-full rounded-xl border border-white/10 bg-[#050810] px-4 py-4 text-white outline-none shadow-inner transition-all focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-cyan-500 px-6 py-4 text-lg font-bold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Scanning Grid..." : "Scan Grid for Spots"}
            </button>
          </div>
        </form>
      </section>

      {/* ================================================== */}
      {/* SEARCH RESULTS */}
      {/* ================================================== */}

      <section className="relative z-10 pt-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              Search Results
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              {selectedParkingLot ? "Parking Selection" : "Available Spots"}
            </h2>
          </div>

          <Link
            to="/dashboard"
            className="text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
          >
            Back to Dashboard →
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0A0F1C]/50 p-16 text-center backdrop-blur-xl">
            <p className="text-lg font-semibold text-cyan-300">
              Scanning parking grid...
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Looking for available parking locations.
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-16 text-center backdrop-blur-xl">
            <p className="text-lg font-semibold text-red-400">
              Unable to fetch parking lots
            </p>

            <p className="mt-2 text-sm text-gray-500">{error}</p>
          </div>
        ) : selectedParkingLot ? (
          /* ================================================== */
          /* SELECTED PARKING LOT */
          /* ================================================== */

          <div className="space-y-8">
            {/* Back */}
            <button
              type="button"
              onClick={handleBackToParkingLots}
              className="text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
            >
              ← Back to Parking Lots
            </button>

            {/* Parking Lot Information */}
            <div className="rounded-2xl border border-cyan-500/30 bg-[#0A0F1C]/80 p-7 shadow-xl shadow-cyan-500/5 backdrop-blur-xl">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                    Selected Parking Lot
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {selectedParkingLot.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    {selectedParkingLot.address}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedParkingLot.city}, {selectedParkingLot.state}
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Price / Hour
                  </p>

                  <p className="mt-1 text-xl font-bold text-cyan-300">
                    ₹{selectedParkingLot.pricePerHour}
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* VEHICLE */}
            {/* ================================================== */}

            <div>
              <div className="mb-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                  Step 1
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  Select Your Vehicle
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Available parking slots will be matched with your vehicle
                  type.
                </p>
              </div>

              {vehicleLoading ? (
                <div className="rounded-2xl border border-white/10 bg-[#0A0F1C]/50 p-12 text-center backdrop-blur-xl">
                  <p className="font-semibold text-cyan-300">
                    Checking your registered vehicles...
                  </p>

                  <p className="mt-2 text-sm text-gray-500">Please wait.</p>
                </div>
              ) : vehicleError ? (
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-12 text-center backdrop-blur-xl">
                  <p className="text-lg font-semibold text-yellow-400">
                    No Vehicle Registered
                  </p>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-400">
                    {vehicleError}
                  </p>

                  <Link
                    to="/my-vehicles"
                    className="mt-6 inline-block rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                  >
                    Register Vehicle →
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => handleVehicleSelect(vehicle)}
                      className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                        selectedVehicle?.id === vehicle.id
                          ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_25px_rgba(6,182,212,0.12)]"
                          : "border-white/10 bg-[#0A0F1C]/70 hover:-translate-y-1 hover:border-cyan-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                          <svg
                            className="h-5 w-5 text-cyan-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                              d="M5 17h14M7 17v2a1 1 0 001 1h1a1 1 0 001-1v-2h4v2a1 1 0 001 1h1a1 1 0 001-1v-2M5 17l1-7h12l1 7M8 10l1.5-3h5L16 10M7 14h.01M17 14h.01"
                            />
                          </svg>
                        </div>

                        {selectedVehicle?.id === vehicle.id && (
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                            Selected
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-lg font-bold text-white">
                        {vehicle.vehicleNumber}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {vehicle.vehicleType}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================================================== */}
            {/* PARKING SLOTS */}
            {/* ================================================== */}

            {selectedVehicle && (
              <div>
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                    Step 2
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Select Your Parking Slot
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Showing available{" "}
                    <span className="font-semibold text-cyan-300">
                      {selectedVehicle.vehicleType}
                    </span>{" "}
                    slots for {selectedVehicle.vehicleNumber}.
                  </p>
                </div>

                {compatibleSlots.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-white/10 bg-[#0A0F1C]/50 p-12 text-center backdrop-blur-xl">
                    <p className="text-lg font-semibold text-gray-300">
                      No Compatible Slots Available
                    </p>

                    <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                      There are currently no available{" "}
                      {selectedVehicle.vehicleType.toLowerCase()} slots for this
                      parking lot and time period.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-[#0A0F1C]/70 p-6 backdrop-blur-xl">
                    <div className="mb-5">
                      <p className="text-sm font-semibold text-gray-300">
                        Available {selectedVehicle.vehicleType} Slots
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {compatibleSlots.length} slot
                        {compatibleSlots.length !== 1 ? "s" : ""} available
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {compatibleSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={`rounded-xl border px-4 py-4 text-center transition-all duration-300 ${
                            selectedSlot?.id === slot.id
                              ? "border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                              : "border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                          }`}
                        >
                          <p className="font-bold">{slot.slotNumber}</p>

                          <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">
                            Floor {slot.floorNumber}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================== */}
            {/* BOOKING SUMMARY */}
            {/* ================================================== */}

            {selectedSlot && selectedVehicle && (
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6 shadow-[0_0_25px_rgba(6,182,212,0.08)]">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                  Booking Summary
                </p>

                <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Parking Lot
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {selectedParkingLot.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Vehicle
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {selectedVehicle.vehicleNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Parking Slot
                    </p>

                    <p className="mt-1 font-semibold text-cyan-300">
                      {selectedSlot.slotNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Reservation
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {searchData.date}
                    </p>

                    <p className="text-xs text-gray-500">
                      {searchData.startTime} - {searchData.endTime}
                    </p>
                  </div>
                </div>

                {/* Booking Error */}
                {bookingError && (
                  <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-sm text-red-400">{bookingError}</p>
                  </div>
                )}

                {/* BOOK NOW */}
                <div className="mt-7 flex justify-end">
                  <button
                    type="button"
                    onClick={handleBookNow}
                    disabled={bookingLoading}
                    className="rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-cyan-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {bookingLoading ? "Creating Booking..." : "BOOK NOW"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : parkingLots.length === 0 ? (
          /* ================================================== */
          /* EMPTY SEARCH */
          /* ================================================== */

          <div className="rounded-2xl border-2 border-dashed border-white/10 bg-[#0A0F1C]/50 p-16 text-center backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-[#0A0F1C]/70">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/3 shadow-inner">
              <svg
                className="h-9 w-9 text-cyan-400/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z"
                />

                <circle cx="12" cy="10" r="2.5" strokeWidth="1.7" />
              </svg>
            </div>

            <p className="mt-6 text-xl font-semibold tracking-tight text-gray-300">
              No Parking Lots Found
            </p>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
              No active parking locations are currently available.
            </p>
          </div>
        ) : (
          /* ================================================== */
          /* PARKING LOT RESULTS */
          /* ================================================== */

          <div className="grid gap-6 md:grid-cols-2">
            {parkingLots.map((parkingLot) => (
              <button
                key={parkingLot.id}
                type="button"
                onClick={() => handleParkingLotClick(parkingLot)}
                className="w-full rounded-2xl border border-white/10 bg-[#0A0F1C]/70 p-6 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {parkingLot.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {parkingLot.address}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {parkingLot.city}, {parkingLot.state}
                    </p>
                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    Active
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/2.5 p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Price / Hour
                    </p>

                    <p className="mt-2 text-lg font-bold text-white">
                      ₹{parkingLot.pricePerHour}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/2.5 p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Available Slots
                    </p>

                    <p className="mt-2 text-lg font-bold text-white">
                      {parkingLot.slots.length}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/5 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/70">
                    Click to select parking lot →
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default FindParking;