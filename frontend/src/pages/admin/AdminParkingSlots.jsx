import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminParkingSlots() {
  const [search, setSearch] = useState("");
  const [selectedLot, setSelectedLot] = useState("All Parking Lots");

  const [parkingLots, setParkingLots] = useState([]);
  const [parkingSlots, setParkingSlots] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= ADD PARKING SLOT STATES =================

  const [showAddModal, setShowAddModal] = useState(false);

  const [addForm, setAddForm] = useState({
    lotId: "",
    floorNumber: 1,
    slotNumber: "",
    slotType: "CAR",
  });

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // ================= VIEW PARKING SLOT STATES =================

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  // ================= EDIT PARKING SLOT STATES =================

  const [showEditModal, setShowEditModal] = useState(false);
  const [editSlotId, setEditSlotId] = useState(null);

  const [editForm, setEditForm] = useState({
    lotId: "",
    floorNumber: 1,
    slotNumber: "",
    slotType: "CAR",
  });

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // ================= FETCH PARKING SLOTS =================

  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch parking lots
        const parkingLotsResponse = await api.get("/parking-lots");

        const lots = parkingLotsResponse.data.data;

        setParkingLots(lots);

        // Fetch all parking slots
        const parkingSlotsResponse = await api.get("/parking-slots");

        const slots = parkingSlotsResponse.data.data;

        const formattedSlots = slots.map((slot) => ({
          id: slot.id,
          slotNumber: slot.slotNumber,
          parkingLot: slot.lot?.name || "Unknown Parking Lot",
          floor: `Floor ${slot.floorNumber}`,
          type: slot.slotType,
          status: slot.status,
        }));

        setParkingSlots(formattedSlots);
      } catch (error) {
        console.error("Failed to fetch parking slots:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load parking slots. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSlots();
  }, []);

  // ================= FILTER =================

  const filteredSlots = parkingSlots.filter((slot) => {
    const matchesSearch =
      slot.slotNumber.toLowerCase().includes(search.toLowerCase()) ||
      slot.parkingLot.toLowerCase().includes(search.toLowerCase()) ||
      slot.id.toLowerCase().includes(search.toLowerCase());

    const matchesLot =
      selectedLot === "All Parking Lots" ||
      slot.parkingLot === selectedLot;

    return matchesSearch && matchesLot;
  });

  // ================= STATISTICS =================

  const totalSlots = parkingSlots.length;

  const availableSlots = parkingSlots.filter(
    (slot) => slot.status === "AVAILABLE",
  ).length;

  const occupiedSlots = parkingSlots.filter(
    (slot) => slot.status === "OCCUPIED",
  ).length;

  const reservedSlots = parkingSlots.filter(
    (slot) => slot.status === "RESERVED",
  ).length;

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {
    if (status === "AVAILABLE") {
      return {
        wrapper:
          "border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    if (status === "OCCUPIED") {
      return {
        wrapper:
          "border-orange-400/10 bg-orange-400/[0.08] text-orange-400",
        dot: "bg-orange-400",
      };
    }

    if (status === "RESERVED") {
      return {
        wrapper: "border-blue-400/10 bg-blue-400/[0.08] text-blue-400",
        dot: "bg-blue-400",
      };
    }

    if (status === "TEMP_RESERVED") {
      return {
        wrapper:
          "border-yellow-400/10 bg-yellow-400/[0.08] text-yellow-400",
        dot: "bg-yellow-400",
      };
    }

    if (status === "MAINTENANCE") {
      return {
        wrapper:
          "border-gray-400/10 bg-gray-400/[0.06] text-gray-500",
        dot: "bg-gray-500",
      };
    }

    return {
      wrapper: "border-gray-400/10 bg-gray-400/[0.06] text-gray-500",
      dot: "bg-gray-500",
    };
  };

  // ================= FORMAT STATUS =================

  const formatStatus = (status) => {
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // ================= REFRESH PARKING SLOTS =================

  const refreshParkingSlots = async () => {
    const parkingSlotsResponse = await api.get("/parking-slots");

    const slots = parkingSlotsResponse.data.data;

    const formattedSlots = slots.map((slot) => ({
      id: slot.id,
      slotNumber: slot.slotNumber,
      parkingLot: slot.lot?.name || "Unknown Parking Lot",
      floor: `Floor ${slot.floorNumber}`,
      type: slot.slotType,
      status: slot.status,
    }));

    setParkingSlots(formattedSlots);
  };

  // ================= ADD PARKING SLOT =================

  const handleAddParkingSlot = async (e) => {
    e.preventDefault();

    try {
      setAddLoading(true);
      setAddError("");

      await api.post("/parking-slots", {
        lotId: addForm.lotId,
        floorNumber: Number(addForm.floorNumber),
        slotNumber: addForm.slotNumber.trim(),
        slotType: addForm.slotType,
      });

      setShowAddModal(false);

      setAddForm({
        lotId: "",
        floorNumber: 1,
        slotNumber: "",
        slotType: "CAR",
      });

      await refreshParkingSlots();
    } catch (error) {
      console.error("Failed to create parking slot:", error);

      setAddError(
        error.response?.data?.message ||
          "Failed to create parking slot. Please try again.",
      );
    } finally {
      setAddLoading(false);
    }
  };

  // ================= VIEW PARKING SLOT =================

  const handleViewParkingSlot = async (slotId) => {
    try {
      setViewLoading(true);
      setViewError("");
      setSelectedSlot(null);

      const response = await api.get(`/parking-slots/${slotId}`);

      setSelectedSlot(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Failed to fetch parking slot:", error);

      setViewError(
        error.response?.data?.message ||
          "Failed to load parking slot details. Please try again.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  // ================= EDIT PARKING SLOT =================

  const handleEditParkingSlot = async (slotId) => {
    try {
      setEditLoading(true);
      setEditError("");

      const response = await api.get(`/parking-slots/${slotId}`);

      const slot = response.data.data;

      setEditSlotId(slot.id);

      setEditForm({
        lotId: slot.lotId || slot.lot?.id || "",
        floorNumber: slot.floorNumber,
        slotNumber: slot.slotNumber,
        slotType: slot.slotType,
      });

      setShowEditModal(true);
    } catch (error) {
      console.error("Failed to fetch parking slot for editing:", error);

      setEditError(
        error.response?.data?.message ||
          "Failed to load parking slot for editing. Please try again.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ================= UPDATE PARKING SLOT =================

  const handleUpdateParkingSlot = async (e) => {
    e.preventDefault();

    try {
      setEditLoading(true);
      setEditError("");

      await api.patch(`/parking-slots/${editSlotId}`, {
        lotId: editForm.lotId,
        floorNumber: Number(editForm.floorNumber),
        slotNumber: editForm.slotNumber.trim(),
        slotType: editForm.slotType,
      });

      setShowEditModal(false);

      setEditSlotId(null);

      setEditForm({
        lotId: "",
        floorNumber: 1,
        slotNumber: "",
        slotType: "CAR",
      });

      await refreshParkingSlots();
    } catch (error) {
      console.error("Failed to update parking slot:", error);

      setEditError(
        error.response?.data?.message ||
          "Failed to update parking slot. Please try again.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <Link
              to="/admin"
              className="transition-colors hover:text-cyan-400"
            >
              Admin
            </Link>

            <span>/</span>

            <span className="text-gray-400">Parking Slots</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Parking Slots
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage parking spaces and monitor their current availability.
          </p>
        </div>

        <button
          onClick={() => {
            setAddError("");
            setShowAddModal(true);
          }}
          className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/20"
        >
          <span className="text-lg leading-none">+</span>
          ADD PARKING SLOT
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/10 bg-red-400/5 px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ================= STATISTICS ================= */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Slots */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Slots
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalSlots}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Registered parking spaces
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
              ▥
            </div>
          </div>
        </div>

        {/* Available */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Available
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {availableSlots}
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                Ready for booking
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ✓
            </div>
          </div>
        </div>

        {/* Occupied */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Occupied
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {occupiedSlots}
              </p>

              <p className="mt-1 text-xs text-orange-400">
                Currently in use
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-lg text-orange-400">
              ●
            </div>
          </div>
        </div>

        {/* Reserved */}

        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Reserved
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {reservedSlots}
              </p>

              <p className="mt-1 text-xs text-blue-400">
                Booked in advance
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-400">
              ◈
            </div>
          </div>
        </div>
      </div>

      {/* ================= SLOT MANAGEMENT CARD ================= */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl shadow-black/10">
        {/* Card Header */}

        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                All Parking Slots
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredSlots.length} slots found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}

              <div className="relative w-full sm:w-72">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search slots..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              {/* Parking Lot Filter */}

              <select
                value={selectedLot}
                onChange={(e) => setSelectedLot(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-gray-400 outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              >
                <option
                  value="All Parking Lots"
                  className="bg-[#0A0F1C]"
                >
                  All Parking Lots
                </option>

                {parkingLots.map((lot) => (
                  <option
                    key={lot.id}
                    value={lot.name}
                    className="bg-[#0A0F1C]"
                  >
                    {lot.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

            <p className="mt-4 text-sm text-gray-500">
              Loading parking slots...
            </p>
          </div>
        ) : (
          <>
            {/* ================= TABLE ================= */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-225">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2">
                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Slot
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Parking Lot
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Floor
                    </th>

                    <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Vehicle Type
                    </th>

                    <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSlots.map((slot) => {
                    const statusStyle = getStatusStyle(slot.status);

                    return (
                      <tr
                        key={slot.id}
                        className="border-b border-white/6 transition-colors hover:bg-white/2.5"
                      >
                        {/* Slot */}

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/10 to-blue-500/10 text-sm font-bold text-cyan-400">
                              {slot.slotNumber}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-white">
                                Slot {slot.slotNumber}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-600">
                                {slot.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Parking Lot */}

                        <td className="px-5 py-5">
                          <p className="text-sm text-gray-400">
                            {slot.parkingLot}
                          </p>
                        </td>

                        {/* Floor */}

                        <td className="px-5 py-5">
                          <span className="rounded-lg border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-gray-400">
                            {slot.floor}
                          </span>
                        </td>

                        {/* Vehicle Type */}

                        <td className="px-5 py-5 text-center">
                          <span className="text-sm text-gray-400">
                            {slot.type}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-5 text-center">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${statusStyle.wrapper}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                            />

                            {formatStatus(slot.status)}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleViewParkingSlot(slot.id)
                              }
                              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[11px] font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                handleEditParkingSlot(slot.id)
                              }
                              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[11px] font-medium text-gray-400 transition-all hover:border-blue-400/20 hover:bg-blue-400/5 hover:text-blue-400"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}

            {filteredSlots.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4 text-2xl text-gray-600">
                  ⌕
                </div>

                <h3 className="mt-4 text-sm font-semibold text-white">
                  No parking slots found
                </h3>

                <p className="mt-2 text-xs text-gray-600">
                  Try changing your search or parking lot filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= ADD PARKING SLOT MODAL ================= */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Add Parking Slot
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Create a new parking slot.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xl text-gray-500 transition-colors hover:text-white"
              >
                ×
              </button>
            </div>

            {addError && (
              <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                {addError}
              </div>
            )}

            <form
              onSubmit={handleAddParkingSlot}
              className="space-y-5"
            >
              {/* Parking Lot */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Parking Lot
                </label>

                <select
                  value={addForm.lotId}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      lotId: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="">Select parking lot</option>

                  {parkingLots.map((lot) => (
                    <option
                      key={lot.id}
                      value={lot.id}
                      className="bg-[#0A0F1C]"
                    >
                      {lot.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor Number */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Floor Number
                </label>

                <input
                  type="number"
                  min="1"
                  value={addForm.floorNumber}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      floorNumber: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                />
              </div>

              {/* Slot Number */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Slot Number
                </label>

                <input
                  type="text"
                  placeholder="e.g. A-01"
                  value={addForm.slotNumber}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      slotNumber: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
                />
              </div>

              {/* Slot Type */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Slot Type
                </label>

                <select
                  value={addForm.slotType}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      slotType: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="CAR">CAR</option>
                  <option value="BIKE">BIKE</option>
                  <option value="EV">EV</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addLoading}
                  className="rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addLoading ? "Creating..." : "Create Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW PARKING SLOT MODAL ================= */}

      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Parking Slot Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  View parking slot information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedSlot(null);
                  setViewError("");
                }}
                className="text-xl text-gray-500 transition-colors hover:text-white"
              >
                ×
              </button>
            </div>

            {viewLoading && (
              <div className="py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading parking slot...
                </p>
              </div>
            )}

            {!viewLoading && viewError && (
              <div className="rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                {viewError}
              </div>
            )}

            {!viewLoading && !viewError && selectedSlot && (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                  <p className="text-xs text-gray-500">
                    Slot Number
                  </p>

                  <p className="mt-1 text-lg font-semibold text-cyan-400">
                    {selectedSlot.slotNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                    <p className="text-xs text-gray-500">
                      Parking Lot
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {selectedSlot.lot?.name || "Unknown"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                    <p className="text-xs text-gray-500">
                      Floor
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      Floor {selectedSlot.floorNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                    <p className="text-xs text-gray-500">
                      Vehicle Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {selectedSlot.slotType}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {formatStatus(selectedSlot.status)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                  <p className="text-xs text-gray-500">
                    Slot ID
                  </p>

                  <p className="mt-1 break-all text-xs text-gray-400">
                    {selectedSlot.id}
                  </p>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedSlot(null);
                      setViewError("");
                    }}
                    className="rounded-xl border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT PARKING SLOT MODAL ================= */}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 shadow-2xl">
            {/* Header */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Edit Parking Slot
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update parking slot information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditSlotId(null);
                  setEditError("");
                }}
                className="text-xl text-gray-500 transition-colors hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Error */}

            {editError && (
              <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                {editError}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleUpdateParkingSlot}
              className="space-y-5"
            >
              {/* Parking Lot */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Parking Lot
                </label>

                <select
                  value={editForm.lotId}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      lotId: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="">Select parking lot</option>

                  {parkingLots.map((lot) => (
                    <option
                      key={lot.id}
                      value={lot.id}
                      className="bg-[#0A0F1C]"
                    >
                      {lot.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor Number */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Floor Number
                </label>

                <input
                  type="number"
                  min="1"
                  value={editForm.floorNumber}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      floorNumber: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                />
              </div>

              {/* Slot Number */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Slot Number
                </label>

                <input
                  type="text"
                  value={editForm.slotNumber}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      slotNumber: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
                />
              </div>

              {/* Slot Type */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Slot Type
                </label>

                <select
                  value={editForm.slotType}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      slotType: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="CAR">CAR</option>
                  <option value="BIKE">BIKE</option>
                  <option value="EV">EV</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditSlotId(null);
                    setEditError("");
                  }}
                  className="rounded-xl border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editLoading ? "Updating..." : "Update Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminParkingSlots;