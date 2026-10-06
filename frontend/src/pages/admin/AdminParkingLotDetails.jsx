import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminParkingLotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parkingLot, setParkingLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParkingLot = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/parking-lots/${id}`);

        setParkingLot(response.data.data);
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

  if (loading) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

        <p className="mt-4 text-sm text-gray-500">
          Loading parking lot details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="mb-8">
          <Link
            to="/admin/parking-lots"
            className="text-sm text-gray-500 transition-colors hover:text-cyan-400"
          >
            ← Back to Parking Lots
          </Link>
        </div>

        <div className="rounded-2xl border border-red-400/10 bg-[#0A0F1C] p-8 text-center">
          <p className="text-sm text-red-400">{error}</p>

          <button
            onClick={() => navigate("/admin/parking-lots")}
            className="mt-5 rounded-xl border border-white/10 bg-white/3 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-cyan-400/20 hover:text-cyan-400"
          >
            Back to Parking Lots
          </button>
        </div>
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

          <span className="text-gray-400">Details</span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {parkingLot.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View parking facility information.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/parking-lots")}
            className="rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
          >
            ← Back to Parking Lots
          </button>
        </div>
      </div>

      {/* ================= DETAILS CARD ================= */}
      <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl shadow-black/10">
        <div className="mb-6 flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400/10 to-blue-500/10 text-lg text-cyan-400">
            P
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              {parkingLot.name}
            </h2>

            <p className="mt-1 text-xs text-gray-600">{parkingLot.id}</p>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Address
            </p>

            <p className="mt-2 text-sm text-white">{parkingLot.address}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              City
            </p>

            <p className="mt-2 text-sm text-white">{parkingLot.city}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              State
            </p>

            <p className="mt-2 text-sm text-white">{parkingLot.state}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Price Per Hour
            </p>

            <p className="mt-2 text-sm text-cyan-400">
              ₹{parkingLot.pricePerHour}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Total Slots
            </p>

            <p className="mt-2 text-sm text-white">{parkingLot.totalSlots}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Grace Period
            </p>

            <p className="mt-2 text-sm text-white">
              {parkingLot.gracePeriodMinutes} minutes
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Overstay Rate
            </p>

            <p className="mt-2 text-sm text-white">
              ₹{parkingLot.overstayRate} / hour
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Status
            </p>

            <div className="mt-2">
              {parkingLot.isActive ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/8 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-400/10 bg-gray-400/6 px-3 py-1.5 text-[11px] font-medium text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Description
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            {parkingLot.description || "No description available."}
          </p>
        </div>

        {/* Coordinates */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-4 text-xs uppercase tracking-wider text-gray-500">
            Location Coordinates
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs text-gray-600">Latitude</p>

              <p className="mt-2 text-sm text-white">{parkingLot.latitude}</p>
            </div>

            <div>
              <p className="text-xs text-gray-600">Longitude</p>

              <p className="mt-2 text-sm text-white">{parkingLot.longitude}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminParkingLotDetails;