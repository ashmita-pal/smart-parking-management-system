import { Link, Outlet, useLocation } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "▦",
    },
    {
      name: "Parking Lots",
      path: "/admin/parking-lots",
      icon: "⌂",
    },
    {
      name: "Parking Slots",
      path: "/admin/parking-slots",
      icon: "▥",
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: "▣",
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: "◈",
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: "⌁",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "◉",
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070B14] text-white">
      {/* ================= BACKGROUND GRID ================= */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ================= AMBIENT GLOW ================= */}
      <div className="pointer-events-none fixed left-0 top-0 z-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 z-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-[#080D18]/95 backdrop-blur-xl">
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-6">
          <Link to="/admin" className="group flex items-center gap-3">
            {/* Logo Mark */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <span className="text-lg font-black text-white">P</span>
            </div>

            {/* Logo Text */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Park<span className="text-cyan-400">Sphere</span>
              </h1>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        {/* System Status */}
        <div className="mx-5 mt-6 rounded-xl border border-cyan-400/10 bg-cyan-400/3 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-xs font-medium text-gray-300">
                System Online
              </span>
            </div>

            <span className="text-[10px] text-gray-600">LIVE</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-7 flex-1 px-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                    active
                      ? "border border-cyan-400/10 bg-cyan-400/[0.08 text-white shadow-lg shadow-cyan-500/4"
                      : "border border-transparent text-gray-400 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  {/* Active Indicator */}
                  {active && (
                    <span className="absolute left-0 h-6 w-0.5 rounded-r-full bg-linear-to-b from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50" />
                  )}

                  {/* Icon */}
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-all ${
                      active
                        ? "bg-linear-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300"
                        : "bg-white/3 text-gray-500 group-hover:bg-white/6 group-hover:text-gray-300"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Active Arrow */}
                  {active && (
                    <span className="ml-auto text-xs text-cyan-400">›</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="border-t border-white/10 p-4">
          {/* Admin Profile */}
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/5 bg-white/2.5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-xs font-bold">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                Administrator
              </p>

              <p className="truncate text-xs text-gray-500">System Manager</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => console.log("Logout clicked")}
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left text-gray-500 transition-all hover:border-red-400/10 hover:bg-red-400/5 hover:text-red-400"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/3 text-sm transition-all group-hover:bg-red-400/10">
              ↪
            </span>

            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 ml-72 min-h-screen">
        <div className="min-h-screen p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;