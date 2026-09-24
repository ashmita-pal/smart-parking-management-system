import { Link } from "react-router-dom";
import { useState } from "react";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const users = [
    {
      id: "USR001",
      name: "Soumyadeep Paul",
      email: "soumya@gmail.com",
      phone: "1457895463",
      vehicles: 2,
      bookings: 8,
      joined: "12 Aug 2026",
      status: "Active",
      verified: true,
    },
    {
      id: "USR002",
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      vehicles: 1,
      bookings: 6,
      joined: "08 Aug 2026",
      status: "Active",
      verified: true,
    },
    {
      id: "USR003",
      name: "Ananya Das",
      email: "ananya@gmail.com",
      phone: "9123456780",
      vehicles: 2,
      bookings: 5,
      joined: "02 Aug 2026",
      status: "Active",
      verified: true,
    },
    {
      id: "USR004",
      name: "Arjun Roy",
      email: "arjun@gmail.com",
      phone: "9001122334",
      vehicles: 1,
      bookings: 3,
      joined: "28 Jul 2026",
      status: "Inactive",
      verified: true,
    },
    {
      id: "USR005",
      name: "Priya Sen",
      email: "priya@gmail.com",
      phone: "9012345678",
      vehicles: 2,
      bookings: 7,
      joined: "21 Jul 2026",
      status: "Active",
      verified: true,
    },
    {
      id: "USR006",
      name: "Amit Ghosh",
      email: "amit@gmail.com",
      phone: "9087654321",
      vehicles: 1,
      bookings: 2,
      joined: "18 Jul 2026",
      status: "Active",
      verified: false,
    },
    {
      id: "USR007",
      name: "Riya Mukherjee",
      email: "riya@gmail.com",
      phone: "9056781234",
      vehicles: 1,
      bookings: 4,
      joined: "14 Jul 2026",
      status: "Active",
      verified: true,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.id.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeUsers = users.filter((user) => user.status === "Active").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive",
  ).length;

  const verifiedUsers = users.filter((user) => user.verified).length;

  const totalBookings = users.reduce((sum, user) => sum + user.bookings, 0);

  return (
    <div className="relative">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/admin" className="transition-colors hover:text-cyan-400">
            Admin
          </Link>

          <span>/</span>

          <span className="text-gray-400">Users</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>

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

              <p className="mt-1 text-xs text-cyan-400">Registered accounts</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
              ◉
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-5 shadow-xl shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Active Users
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {activeUsers}
              </p>

              <p className="mt-1 text-xs text-emerald-400">Currently active</p>
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

              <p className="mt-1 text-xs text-blue-400">Email verified</p>
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

              <p className="mt-1 text-xs text-purple-400">User reservations</p>
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

            <div className="flex flex-col gap-3 sm:flex-row">
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

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-sm text-gray-400 outline-none transition-all focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              >
                <option value="All Status" className="bg-[#0A0F1C]">
                  All Status
                </option>

                <option value="Active" className="bg-[#0A0F1C]">
                  Active
                </option>

                <option value="Inactive" className="bg-[#0A0F1C]">
                  Inactive
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
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
                  Status
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
                        {user.name.charAt(0)}
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
                    <p className="text-sm text-gray-400">{user.email}</p>

                    <p className="mt-1 text-[11px] text-gray-600">
                      +91 {user.phone}
                    </p>
                  </td>

                  {/* Vehicles */}
                  <td className="px-5 py-5 text-center">
                    <span className="text-sm font-medium text-gray-300">
                      {user.vehicles}
                    </span>
                  </td>

                  {/* Bookings */}
                  <td className="px-5 py-5 text-center">
                    <span className="text-sm font-medium text-gray-300">
                      {user.bookings}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-5">
                    <span className="text-sm text-gray-400">{user.joined}</span>
                  </td>

                  {/* Verification */}
                  <td className="px-5 py-5 text-center">
                    {user.verified ? (
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

                  {/* Status */}
                  <td className="px-5 py-5 text-center">
                    {user.status === "Active" ? (
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
                  </td>

                  {/* Action */}
                  <td className="px-5 py-5 text-center">
                    <button
                      onClick={() => console.log("View user:", user.id)}
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

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4 text-2xl text-gray-600">
              ⌕
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No users found
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              Try changing your search or status filter.
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
            <p className="text-xs font-medium text-gray-300">User Management</p>

            <p className="mt-1 text-xs leading-5 text-gray-600">
              Verified users have completed email verification. Pending users
              can complete verification before using all ParkSphere services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;