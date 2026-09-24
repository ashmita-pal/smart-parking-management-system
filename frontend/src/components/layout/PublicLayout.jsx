import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070B14] text-white">
      {/* Architectural Grid */}
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

      {/* Ambient Glows */}
      <div className="pointer-events-none fixed left-0 top-0 z-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 z-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/4 blur-[140px]" />

      {/* Public Page Content */}
      <main className="relative z-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;