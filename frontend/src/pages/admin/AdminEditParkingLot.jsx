import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminEditParkingLot() {
  const { id } = useParams();
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
    gracePeriodMinutes: "",
    overstayRate: "",
    totalSlots: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchParkingLot = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/parking-lots/${id}`);

        const parkingLot = response.data.data;

        setFormData({
          name: parkingLot.name || "",
          description: parkingLot.description || "",
          address: parkingLot.address || "",
          city: parkingLot.city || "",
          state: parkingLot.state || "",
          latitude: parkingLot.latitude ?? "",
          longitude: parkingLot.longitude ?? "",
          pricePerHour: parkingLot.pricePerHour ?? "",
          gracePeriodMinutes: parkingLot.gracePeriodMinutes ?? "",
          overstayRate: parkingLot.overstayRate ?? "",
          totalSlots: parkingLot.totalSlots ?? "",
        });
      } catch (error) {
        console.error("Failed to fetch parking lot:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load parking lot details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLot();
  }, [id]);

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
      setSuccess("");

      const updateData = {
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

      await api.patch(`/parking-lots/${id}`, updateData);

      setSuccess("Parking lot updated successfully.");

      setTimeout(() => {
        navigate(`/admin/parking-lots/${id}`);
      }, 800);
    } catch (error) {
      console.error("Failed to update parking lot:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update parking lot. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

        <p className="mt-4 text-sm text-gray-500">Loading parking lot...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/admin" className="transition-colors hover:text-cyan-400">
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

          <span className="text-gray-400">Edit</span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Edit Parking Lot
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Update the parking facility information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/admin/parking-lots/${id}`)}
            className="rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
          >
            ← Back to Details
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

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-400">
              {success}
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
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
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
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Price */}
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
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
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
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            {/* Total Slots */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Slots
              </label>

              <input
                type="number"
                min="0"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
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
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/admin/parking-lots/${id}`)}
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
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEditParkingLot;