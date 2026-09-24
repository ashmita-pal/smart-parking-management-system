import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "../../api/api.js";

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  // Fetch logged-in user
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await api.get("/auth/me");

        console.log("Current user:", response.data);

        setUser(response.data.data);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    }

    fetchCurrentUser();
  }, []);

  // Generate user initials
  function getUserInitials(name) {
    if (!name) return "U";

    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0) +
      nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  }

  // Logout user
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      // Redirect to login even if logout request fails
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] font-sans text-white">
      {/* ================================================== */}
      {/* BACKGROUND */}
      {/* ================================================== */}

      {/* Structural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Atmospheric Blurs */}
      <div className="pointer-events-none absolute left-[-15%] top-[20%] h-150 w-150 rounded-full bg-cyan-950/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-blue-950/10 blur-[120px]" />

      {/* ================================================== */}
      {/* NAVIGATION BAR */}
      {/* ================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#070B14]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          {/* ================================================== */}
          {/* LOGO */}
          {/* ================================================== */}

          <Link
            to="/dashboard"
            className="group flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-400 via-blue-500 to-cyan-400 font-bold shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all">
              P
            </div>

            <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-200">
              ParkSphere
            </span>
          </Link>

          {/* ================================================== */}
          {/* NAVIGATION LINKS */}
          {/* ================================================== */}

          <div className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {[
              {
                path: "/find-parking",
                label: "Find Parking",
              },
              {
                path: "/my-bookings",
                label: "My Bookings",
              },
              {
                path: "/my-vehicles",
                label: "My Vehicles",
              },
              {
                path: "/payments",
                label: "Payments",
              },
              {
                path: "/profile",
                label: "Profile",
              },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative pb-1.5 transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-cyan-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}

                {/* Active Indicator */}
                {isActive(link.path) && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                )}
              </Link>
            ))}
          </div>

          {/* ================================================== */}
          {/* USER SECTION */}
          {/* ================================================== */}

          <div className="flex items-center gap-4">

            {/* User Initials */}
            <div
              title={user?.name || "User"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-gray-900 text-sm font-semibold text-gray-300 shadow-inner"
            >
              {getUserInitials(user?.name)}
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs text-red-400 transition-all duration-300 hover:border-red-500/50 hover:bg-red-950/30"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================================================== */}
      {/* PAGE CONTENT */}
      {/* ================================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;