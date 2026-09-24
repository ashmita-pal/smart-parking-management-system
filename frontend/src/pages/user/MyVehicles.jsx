import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

function MyVehicles() {
  const navigate = useNavigate();

  // ==================================================
  // VEHICLE LIST
  // ==================================================

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // ADD VEHICLE
  // ==================================================

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [addVehicleError, setAddVehicleError] = useState("");

  // ==================================================
  // VEHICLE DETAILS
  // ==================================================

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [vehicleDetailsLoading, setVehicleDetailsLoading] = useState(false);
  const [vehicleDetailsError, setVehicleDetailsError] = useState("");

  // ==================================================
  // EDIT VEHICLE
  // ==================================================

  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [editVehicleNumber, setEditVehicleNumber] = useState("");
  const [editVehicleType, setEditVehicleType] = useState("CAR");
  const [updatingVehicle, setUpdatingVehicle] = useState(false);
  const [editVehicleError, setEditVehicleError] = useState("");

  // ==================================================
  // DELETE VEHICLE
  // ==================================================

  const [showDeleteVehicle, setShowDeleteVehicle] = useState(false);
  const [deletingVehicle, setDeletingVehicle] = useState(false);
  const [deleteVehicleError, setDeleteVehicleError] = useState("");

  // ==================================================
  // FETCH VEHICLES
  // ==================================================

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/vehicle");

        console.log("Registered vehicles:", response.data);

        setVehicles(response.data.data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        const message =
          error.response?.data?.message ||
          "Unable to fetch your vehicles.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [navigate]);

  // ==================================================
  // ADD VEHICLE
  // ==================================================

  function handleAddVehicle() {
    setVehicleNumber("");
    setVehicleType("CAR");
    setAddVehicleError("");
    setShowAddVehicle(true);
  }

  function handleCloseAddVehicle() {
    if (addingVehicle) return;

    setShowAddVehicle(false);
    setVehicleNumber("");
    setVehicleType("CAR");
    setAddVehicleError("");
  }

  async function handleSubmitVehicle(event) {
    event.preventDefault();

    if (!vehicleNumber.trim()) {
      setAddVehicleError("Vehicle number is required.");
      return;
    }

    try {
      setAddingVehicle(true);
      setAddVehicleError("");

      const response = await api.post("/vehicle", {
        vehicleNumber: vehicleNumber.trim(),
        vehicleType,
      });

      console.log("Vehicle registered:", response.data);

      setVehicles((currentVehicles) => [
        response.data.data,
        ...currentVehicles,
      ]);

      setShowAddVehicle(false);
      setVehicleNumber("");
      setVehicleType("CAR");
    } catch (error) {
      console.error("Failed to register vehicle:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setAddVehicleError(
        error.response?.data?.message ||
          "Unable to register vehicle. Please try again.",
      );
    } finally {
      setAddingVehicle(false);
    }
  }

  // ==================================================
  // VIEW VEHICLE
  // ==================================================

  async function handleViewVehicle(vehicleId) {
    try {
      setVehicleDetailsLoading(true);
      setVehicleDetailsError("");
      setSelectedVehicle(null);
      setShowVehicleDetails(true);

      const response = await api.get(`/vehicle/${vehicleId}`);

      console.log("Vehicle details:", response.data);

      setSelectedVehicle(response.data.data);
    } catch (error) {
      console.error("Failed to fetch vehicle details:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setVehicleDetailsError(
        error.response?.data?.message ||
          "Unable to fetch vehicle details.",
      );
    } finally {
      setVehicleDetailsLoading(false);
    }
  }

  function handleCloseVehicleDetails() {
    setShowVehicleDetails(false);
    setSelectedVehicle(null);
    setVehicleDetailsError("");
  }

  // ==================================================
  // EDIT VEHICLE
  // ==================================================

  function handleEditVehicle() {
    if (!selectedVehicle) return;

    setEditVehicleNumber(selectedVehicle.vehicleNumber);
    setEditVehicleType(selectedVehicle.vehicleType);
    setEditVehicleError("");
    setShowVehicleDetails(false);
    setShowEditVehicle(true);
  }

  function handleCloseEditVehicle() {
    if (updatingVehicle) return;

    setShowEditVehicle(false);
    setEditVehicleNumber("");
    setEditVehicleType("CAR");
    setEditVehicleError("");
  }

  async function handleUpdateVehicle(event) {
    event.preventDefault();

    if (!editVehicleNumber.trim()) {
      setEditVehicleError("Vehicle number is required.");
      return;
    }

    if (!selectedVehicle) return;

    try {
      setUpdatingVehicle(true);
      setEditVehicleError("");

      const response = await api.patch(
        `/vehicle/${selectedVehicle.id}`,
        {
          vehicleNumber: editVehicleNumber.trim(),
          vehicleType: editVehicleType,
        },
      );

      console.log("Vehicle updated:", response.data);

      const updatedVehicle = response.data.data;

      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) =>
          vehicle.id === updatedVehicle.id
            ? updatedVehicle
            : vehicle,
        ),
      );

      setSelectedVehicle(updatedVehicle);

      setShowEditVehicle(false);
      setShowVehicleDetails(true);
    } catch (error) {
      console.error("Failed to update vehicle:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setEditVehicleError(
        error.response?.data?.message ||
          "Unable to update vehicle. Please try again.",
      );
    } finally {
      setUpdatingVehicle(false);
    }
  }

  // ==================================================
  // DELETE VEHICLE
  // ==================================================

  function handleDeleteVehicle() {
    setDeleteVehicleError("");
    setShowVehicleDetails(false);
    setShowDeleteVehicle(true);
  }

  function handleCloseDeleteVehicle() {
    if (deletingVehicle) return;

    setShowDeleteVehicle(false);
    setDeleteVehicleError("");
  }

  async function confirmDeleteVehicle() {
    if (!selectedVehicle) return;

    try {
      setDeletingVehicle(true);
      setDeleteVehicleError("");

      const response = await api.delete(
        `/vehicle/${selectedVehicle.id}`,
      );

      console.log("Vehicle deleted:", response.data);

      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (vehicle) => vehicle.id !== selectedVehicle.id,
        ),
      );

      setSelectedVehicle(null);
      setShowDeleteVehicle(false);
    } catch (error) {
      console.error("Failed to delete vehicle:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setDeleteVehicleError(
        error.response?.data?.message ||
          "Unable to delete vehicle. Please try again.",
      );
    } finally {
      setDeletingVehicle(false);
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] py-10 font-sans text-white">

      {/* Background Architectural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-125 w-125 rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-15%] top-[25%] h-100 w-100 rounded-full bg-cyan-600/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        {/* ================================================== */}
        {/* PAGE HEADING */}
        {/* ================================================== */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                My Vehicles
              </h1>

              <p className="mt-2 text-gray-400">
                Manage your registered vehicles.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVehicle}
              className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
            >
              + ADD VEHICLE
            </button>

          </div>
        </section>

        {/* ================================================== */}
        {/* VEHICLE LIST */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30">

          <h2 className="text-xl font-bold text-white">
            Registered Vehicles
          </h2>

          {/* Loading */}
          {loading ? (

            <div className="mt-6 rounded-xl border border-gray-800 bg-[#070B14] p-10 text-center">

              <p className="font-semibold text-cyan-400">
                Loading your vehicles...
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Fetching your registered vehicles.
              </p>

            </div>

          ) : error ? (

            /* Error */
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-10 text-center">

              <p className="font-semibold text-red-400">
                Unable to load vehicles
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>

            </div>

          ) : vehicles.length === 0 ? (

            /* Empty State */
            <div className="mt-6 rounded-xl border border-gray-800 bg-[#070B14] p-8 text-center">

              <p className="text-gray-400">
                You haven't added any vehicles yet.
              </p>

              <button
                type="button"
                onClick={handleAddVehicle}
                className="mt-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                + ADD VEHICLE
              </button>

            </div>

          ) : (

            /* Vehicle Cards */
            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {vehicles.map((vehicle) => (

                <div
                  key={vehicle.id}
                  className="group rounded-2xl border border-gray-800/80 bg-[#070B14]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-[#0d1527] hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)]"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-lg font-bold text-cyan-400">
                        {vehicle.vehicleNumber}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Vehicle Type: {vehicle.vehicleType}
                      </p>

                    </div>

                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                      {vehicle.vehicleType}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewVehicle(vehicle.id)}
                    className="mt-5 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                  >
                    View Details →
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

        {/* Back */}
        <div className="mt-6">

          <Link
            to="/dashboard"
            className="text-sm text-cyan-400 transition-colors hover:text-cyan-300"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </div>

      {/* ================================================== */}
      {/* ADD VEHICLE MODAL */}
      {/* ================================================== */}

      {showAddVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0a0f1c] p-7 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Add Vehicle
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Register a vehicle to your account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseAddVehicle}
                disabled={addingVehicle}
                className="text-2xl text-gray-500 transition-colors hover:text-white disabled:cursor-not-allowed"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmitVehicle}
              className="mt-6 space-y-5"
            >

              {/* Vehicle Number */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(event) =>
                    setVehicleNumber(event.target.value)
                  }
                  placeholder="e.g. WB12AB1234"
                  disabled={addingVehicle}
                  className="w-full rounded-xl border border-gray-700 bg-[#070B14] px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-500"
                />

              </div>

              {/* Vehicle Type */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Vehicle Type
                </label>

                <select
                  value={vehicleType}
                  onChange={(event) =>
                    setVehicleType(event.target.value)
                  }
                  disabled={addingVehicle}
                  className="w-full rounded-xl border border-gray-700 bg-[#070B14] px-4 py-3 text-white outline-none transition-all focus:border-cyan-500"
                >
                  <option value="CAR">Car</option>
                  <option value="BIKE">Bike</option>
                  <option value="EV">EV</option>
                </select>

              </div>

              {/* Error */}
              {addVehicleError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

                  <p className="text-sm text-red-400">
                    {addVehicleError}
                  </p>

                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCloseAddVehicle}
                  disabled={addingVehicle}
                  className="flex-1 rounded-xl border border-gray-700 px-4 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingVehicle}
                  className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingVehicle
                    ? "REGISTERING..."
                    : "REGISTER VEHICLE"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ================================================== */}
      {/* VEHICLE DETAILS MODAL */}
      {/* ================================================== */}

      {showVehicleDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0a0f1c] p-7 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Vehicle Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Information about your registered vehicle.
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseVehicleDetails}
                className="text-2xl text-gray-500 transition-colors hover:text-white"
              >
                ×
              </button>

            </div>

            {/* Loading */}
            {vehicleDetailsLoading && (
              <div className="mt-6 rounded-xl border border-gray-800 bg-[#070B14] p-8 text-center">

                <p className="font-semibold text-cyan-400">
                  Loading vehicle details...
                </p>

              </div>
            )}

            {/* Error */}
            {!vehicleDetailsLoading && vehicleDetailsError && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-6">

                <p className="font-semibold text-red-400">
                  Unable to load vehicle
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {vehicleDetailsError}
                </p>

              </div>
            )}

            {/* Vehicle Information */}
            {!vehicleDetailsLoading &&
              !vehicleDetailsError &&
              selectedVehicle && (
                <div className="mt-6 space-y-4">

                  <div className="rounded-xl border border-gray-800 bg-[#070B14] p-5">

                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Vehicle Number
                    </p>

                    <p className="mt-2 text-xl font-bold text-cyan-400">
                      {selectedVehicle.vehicleNumber}
                    </p>

                  </div>

                  <div className="rounded-xl border border-gray-800 bg-[#070B14] p-5">

                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Vehicle Type
                    </p>

                    <p className="mt-2 text-lg font-semibold text-white">
                      {selectedVehicle.vehicleType}
                    </p>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={handleEditVehicle}
                      className="flex-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
                    >
                      EDIT
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteVehicle}
                      className="flex-1 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20"
                    >
                      DELETE
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={handleCloseVehicleDetails}
                    className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                  >
                    CLOSE
                  </button>

                </div>
              )}

          </div>

        </div>
      )}

      {/* ================================================== */}
      {/* EDIT VEHICLE MODAL */}
      {/* ================================================== */}

      {showEditVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0a0f1c] p-7 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Edit Vehicle
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your vehicle information.
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseEditVehicle}
                disabled={updatingVehicle}
                className="text-2xl text-gray-500 transition-colors hover:text-white disabled:cursor-not-allowed"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleUpdateVehicle}
              className="mt-6 space-y-5"
            >

              {/* Vehicle Number */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  value={editVehicleNumber}
                  onChange={(event) =>
                    setEditVehicleNumber(event.target.value)
                  }
                  disabled={updatingVehicle}
                  className="w-full rounded-xl border border-gray-700 bg-[#070B14] px-4 py-3 text-white outline-none transition-all focus:border-cyan-500"
                />

              </div>

              {/* Vehicle Type */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Vehicle Type
                </label>

                <select
                  value={editVehicleType}
                  onChange={(event) =>
                    setEditVehicleType(event.target.value)
                  }
                  disabled={updatingVehicle}
                  className="w-full rounded-xl border border-gray-700 bg-[#070B14] px-4 py-3 text-white outline-none transition-all focus:border-cyan-500"
                >
                  <option value="CAR">Car</option>
                  <option value="BIKE">Bike</option>
                  <option value="EV">EV</option>
                </select>

              </div>

              {/* Error */}
              {editVehicleError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

                  <p className="text-sm text-red-400">
                    {editVehicleError}
                  </p>

                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={handleCloseEditVehicle}
                  disabled={updatingVehicle}
                  className="flex-1 rounded-xl border border-gray-700 px-4 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingVehicle}
                  className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingVehicle ? "UPDATING..." : "SAVE CHANGES"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ================================================== */}
      {/* DELETE VEHICLE CONFIRMATION */}
      {/* ================================================== */}

      {showDeleteVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0a0f1c] p-7 shadow-2xl">

            <h2 className="text-2xl font-bold text-white">
              Delete Vehicle?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Are you sure you want to remove this vehicle from your
              account?
            </p>

            {selectedVehicle && (
              <div className="mt-5 rounded-xl border border-gray-800 bg-[#070B14] p-4">

                <p className="text-sm text-gray-500">
                  Vehicle Number
                </p>

                <p className="mt-1 font-bold text-cyan-400">
                  {selectedVehicle.vehicleNumber}
                </p>

              </div>
            )}

            {deleteVehicleError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

                <p className="text-sm text-red-400">
                  {deleteVehicleError}
                </p>

              </div>
            )}

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={handleCloseDeleteVehicle}
                disabled={deletingVehicle}
                className="flex-1 rounded-xl border border-gray-700 px-4 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={confirmDeleteVehicle}
                disabled={deletingVehicle}
                className="flex-1 rounded-xl bg-red-500/80 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingVehicle ? "DELETING..." : "DELETE"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MyVehicles;