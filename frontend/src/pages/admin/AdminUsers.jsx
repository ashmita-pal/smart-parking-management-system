import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/users");

        setUsers(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load users. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.id.toLowerCase().includes(searchText) ||
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.phone.toLowerCase().includes(searchText)
    );
  });

  const verifiedUsers = users.filter(
    (user) => user.isEmailVerified,
  ).length;

  const totalBookings = users.reduce(
    (sum, user) => sum + (user._count?.bookings || 0),
    0,
  );

  const totalVehicles = users.reduce(
    (sum, user) => sum + (user._count?.vehicles || 0),
    0,
  );

  const handleViewUser = async (userId) => {
    try {
      setViewLoading(true);
      setViewError("");
      setSelectedUser(null);

      const response = await api.get(`/auth/users/${userId}`);

      setSelectedUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);

      setViewError(
        error.response?.data?.message ||
          "Failed to load user details. Please try again.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setSelectedUser(null);
    setViewError("");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link
            to="/admin"
            className="transition-colors hover:text-cyan-400"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-gray-400">Users</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Users
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage registered users and monitor their ParkSphere activity.
        </p>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {users.length}
              </p>

              <p className="mt-1 text-xs text-cyan-400">
                Registered accounts
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
              ◉
            </div>
          </div>
        </div>

        {/* Total Vehicles */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Vehicles
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalVehicles}
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                Registered vehicles
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ✓
            </div>
          </div>
        </div>

        {/* Verified Users */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Verified Users
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {verifiedUsers}
              </p>

              <p className="mt-1 text-xs text-blue-400">
                Email verified
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-400">
              ✓
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Bookings
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalBookings}
              </p>

              <p className="mt-1 text-xs text-purple-400">
                User reservations
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-lg text-purple-400">
              ▣
            </div>
          </div>
        </div>
      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl shadow-black/10">
        {/* Card Header */}
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Registered Users
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredUsers.length} users found
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#070B14] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

            <p className="mt-4 text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-xl text-red-400">
              !
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              Failed to load users
            </h3>

            <p className="mt-2 text-xs text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* ================= TABLE ================= */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-262.5">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Vehicles
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Bookings
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Verification
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/6 transition-colors hover:bg-white/25"
                  >
                    {/* User */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cyan-400/20 to-blue-600/20 text-sm font-bold text-cyan-400">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-600">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-5">
                      <p className="text-sm text-gray-400">
                        {user.email}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-600">
                        +91 {user.phone}
                      </p>
                    </td>

                    {/* Vehicles */}
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm font-medium text-gray-300">
                        {user._count?.vehicles || 0}
                      </span>
                    </td>

                    {/* Bookings */}
                    <td className="px-5 py-5 text-center">
                      <span className="text-sm font-medium text-gray-300">
                        {user._count?.bookings || 0}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-5">
                      <span className="text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>

                    {/* Verification */}
                    <td className="px-5 py-5 text-center">
                      {user.isEmailVerified ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/6 px-3 py-1.5 text-[11px] font-medium text-cyan-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/10 bg-orange-400/6 px-3 py-1.5 text-[11px] font-medium text-orange-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-5 text-center">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-[11px] font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          filteredUsers.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4 text-2xl text-gray-600">
                ⌕
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                No users found
              </h3>

              <p className="mt-2 text-xs text-gray-600">
                Try changing your search.
              </p>
            </div>
          )}
      </div>

      {/* ================= INFORMATION NOTE ================= */}
      <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/3 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-xs text-cyan-400">
            i
          </div>

          <div>
            <p className="text-xs font-medium text-gray-300">
              User Management
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-600">
              Verified users have completed email verification.
              Pending users can complete verification before using
              all ParkSphere services.
            </p>
          </div>
        </div>
      </div>

      {/* ================= VIEW USER MODAL ================= */}
      {(viewLoading || viewError || selectedUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0A0F1C] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  User Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  View registered user information
                </p>
              </div>

              <button
                onClick={closeViewModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition-colors hover:border-white/20 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[75vh] overflow-y-auto p-6">
              {viewLoading && (
                <div className="py-12 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

                  <p className="mt-4 text-sm text-gray-500">
                    Loading user details...
                  </p>
                </div>
              )}

              {!viewLoading && viewError && (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-xl text-red-400">
                    !
                  </div>

                  <p className="mt-4 text-sm text-red-400">
                    {viewError}
                  </p>
                </div>
              )}

              {!viewLoading && !viewError && selectedUser && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Basic Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Name
                        </p>

                        <p className="mt-1 text-sm text-white">
                          {selectedUser.name}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-white">
                          {selectedUser.email}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-white">
                          +91 {selectedUser.phone}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Role
                        </p>

                        <p className="mt-1 text-sm text-white">
                          {selectedUser.role}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Email Verification
                        </p>

                        <p
                          className={`mt-1 text-sm ${
                            selectedUser.isEmailVerified
                              ? "text-cyan-400"
                              : "text-orange-400"
                          }`}
                        >
                          {selectedUser.isEmailVerified
                            ? "Verified"
                            : "Pending"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Joined
                        </p>

                        <p className="mt-1 text-sm text-white">
                          {formatDate(selectedUser.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicles */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Vehicles
                      </h3>

                      <span className="text-xs text-gray-600">
                        {selectedUser.vehicles?.length || 0} registered
                      </span>
                    </div>

                    {selectedUser.vehicles?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.vehicles.map((vehicle) => (
                          <div
                            key={vehicle.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#070B14] px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">
                                {vehicle.vehicleNumber}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-600">
                                {vehicle.vehicleType}
                              </p>
                            </div>

                            <p className="text-[11px] text-gray-600">
                              {formatDate(vehicle.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-6 text-center">
                        <p className="text-xs text-gray-600">
                          No vehicles registered.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Booking Information */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Booking Information
                    </h3>

                    <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                      <p className="text-[10px] uppercase tracking-wider text-gray-600">
                        Total Bookings
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        {selectedUser._count?.bookings || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-white/10 px-6 py-4">
              <button
                onClick={closeViewModal}
                className="rounded-lg border border-white/10 bg-white/3 px-4 py-2 text-xs font-medium text-gray-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;