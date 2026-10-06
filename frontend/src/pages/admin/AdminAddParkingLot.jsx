import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";

function AdminAddParkingLot() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    pricePerHour: "",
    gracePeriodMinutes: "15",
    overstayRate: "",
    totalSlots: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const parkingLotData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        pricePerHour: formData.pricePerHour,
        gracePeriodMinutes: Number(formData.gracePeriodMinutes),
        overstayRate: formData.overstayRate,
        totalSlots: Number(formData.totalSlots),
      };

      const response = await api.post("/parking-lots", parkingLotData);

      const createdParkingLot = response.data.data;

      navigate(`/admin/parking-lots/${createdParkingLot.id}`);
    } catch (error) {
      console.error("Failed to create parking lot:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create parking lot. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <Link
            to="/admin"
            className="transition-colors hover:text-cyan-400"
          >
            Admin
          </Link>

          <span>/</span>

          <Link
            to="/admin/parking-lots"
            className="transition-colors hover:text-cyan-400"
          >
            Parking Lots
          </Link>

          <span>/</span>

          <span className="text-gray-400">Add</span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Add Parking Lot
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Register a new parking facility in the ParkSphere network.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/parking-lots")}
            className="rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
          >
            ← Back to Parking Lots
          </button>
        </div>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl shadow-black/10">
        <form onSubmit={handleSubmit}>
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Parking Lot Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. City Center Parking"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Main Street"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Kolkata"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* State */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. West Bengal"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g. 22.5726"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g. 88.3639"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Price Per Hour */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Price Per Hour
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                placeholder="e.g. 50"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Grace Period */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Grace Period (Minutes)
              </label>

              <input
                type="number"
                min="0"
                name="gracePeriodMinutes"
                value={formData.gracePeriodMinutes}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />

              <p className="mt-1 text-[11px] text-gray-600">
                Default: 15 minutes
              </p>
            </div>

            {/* Overstay Rate */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Overstay Rate
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="overstayRate"
                value={formData.overstayRate}
                onChange={handleChange}
                placeholder="e.g. 100"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Total Slots */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Slots
              </label>

              <input
                type="number"
                min="1"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleChange}
                placeholder="e.g. 50"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />

              <p className="mt-1 text-[11px] text-gray-600">
                Actual parking slots can be managed separately.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter a short description of the parking facility..."
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/parking-lots")}
              disabled={saving}
              className="rounded-xl border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "CREATING..." : "CREATE PARKING LOT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAddParkingLot;