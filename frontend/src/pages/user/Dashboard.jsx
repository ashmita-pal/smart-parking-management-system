import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/me");

        console.log("Current user:", response.data);

        setUser(response.data.data);
      } catch (error) {
        console.error("Failed to fetch current user:", error);

        const message =
          error.response?.data?.message ||
          "Unable to fetch current user.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-10">
        {/* Welcome Section */}
        <section>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Smart Parking Control
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            {loading
              ? "Welcome back!"
              : user
                ? `Welcome back, ${user.name}!`
                : "Welcome back!"}
          </h1>

          <p className="mt-3 text-gray-400">
            Find a parking spot or manage your current bookings.
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}
        </section>

        {/* Main Actions */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Find Parking */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C]/90 p-7 shadow-xl shadow-cyan-500/5 backdrop-blur-xl transition hover:border-cyan-400/30">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition group-hover:bg-cyan-500/20" />

            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <svg
                  className="h-6 w-6 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z"
                  />
                  <circle cx="12" cy="10" r="2.5" strokeWidth="1.8" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-white">
                FIND PARKING
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
                Find available parking near you and reserve your spot
                instantly.
              </p>

              <Link
                to="/find-parking"
                className="mt-6 inline-flex rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90"
              >
                FIND PARKING
              </Link>
            </div>
          </div>

          {/* Active Booking */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C]/90 p-7 shadow-xl shadow-purple-500/5 backdrop-blur-xl transition hover:border-purple-400/30">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-purple-500/20" />

            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    strokeWidth="1.8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.8"
                    d="M8 3v4M16 3v4M3 10h18"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-white">
                ACTIVE BOOKING
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                No active booking
              </p>

              <Link
                to="/my-bookings"
                className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/10"
              >
                VIEW BOOKINGS
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              Account
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Quick Access
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* My Bookings */}
            <Link
              to="/my-bookings"
              className="group rounded-2xl border border-white/10 bg-[#0A0F1C]/90 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20">
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
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                  />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold text-white">
                My Bookings
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View your booking history
              </p>
            </Link>

            {/* My Vehicles */}
            <Link
              to="/my-vehicles"
              className="group rounded-2xl border border-white/10 bg-[#0A0F1C]/90 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-400/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 border border-blue-400/20">
                <svg
                  className="h-5 w-5 text-blue-400"
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

              <h3 className="mt-4 font-semibold text-white">
                My Vehicles
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage registered vehicles
              </p>
            </Link>

            {/* Payments */}
            <Link
              to="/payments"
              className="group rounded-2xl border border-white/10 bg-[#0A0F1C]/90 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:border-purple-400/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 border border-purple-400/20">
                <svg
                  className="h-5 w-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    strokeWidth="1.8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.8"
                    d="M3 10h18"
                  />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold text-white">
                Payments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View payment history
              </p>
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className="group rounded-2xl border border-white/10 bg-[#0A0F1C]/90 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                <svg
                  className="h-5 w-5 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="3"
                    strokeWidth="1.8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.8"
                    d="M5 20a7 7 0 0114 0"
                  />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold text-white">
                Profile
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account
              </p>
            </Link>
          </div>
        </section>

        {/* Recent Bookings */}
        <section>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              Activity
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Recent Bookings
            </h2>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1C]/90 shadow-xl backdrop-blur-xl">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-white/10 bg-white/3 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span>Parking Lot</span>
              <span>Date</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Empty State */}
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/3">
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M8 6h13M8 12h13M8 18h13"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                No recent bookings
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;