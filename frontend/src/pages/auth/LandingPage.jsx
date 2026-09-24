import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden font-sans">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-100 h-100 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigation (Glassmorphism) */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#070B14]/70 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ParkSphere
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#how-it-works"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              How It Works
            </a>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-white/5 border border-white/10 px-6 py-2 text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-8 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
          {/* Hero Text */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1.5 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                Available Nationwide
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Smart Parking Management <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500">
                System.
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-xl text-lg text-gray-400 leading-relaxed">
              Find available parking, reserve your spot, and manage your parking
              experience with ease. Skip the circles and secure your space in
              seconds.
            </p>

            <div className="pt-4">
              <Link
                to="/find-parking"
                className="inline-block rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                Find Parking Now
              </Link>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:w-1/2 w-full relative flex justify-center">
            <div className="relative w-full max-w-md aspect-4/3 bg-[#0b101d] border border-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden group hover:border-cyan-500/50 transition-colors duration-500">
              {/* Mockup Header */}
              <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div className="text-sm font-semibold text-gray-400">
                  Nearest Spot
                </div>
                <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                  Available
                </div>
              </div>

              {/* Mockup Parking Slot Graphic */}
              <div className="grow flex items-center justify-center my-6 relative">
                {/* Floor lines */}
                <div className="w-3/4 h-32 border-l-4 border-r-4 border-dashed border-gray-700 flex items-center justify-center relative">
                  <div className="text-4xl font-bold text-gray-700">P-42</div>
                  {/* Glowing Car Indicator */}
                  <div className="absolute inset-0 bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                </div>
              </div>

              {/* Mockup Footer */}
              <div className="flex justify-between items-end pt-4 border-t border-gray-800">
                <div>
                  <div className="text-xs text-gray-500">Distance</div>
                  <div className="text-lg font-bold text-cyan-400">
                    0.2 miles
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  →
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="relative border-t border-white/5 bg-[#050810] px-8 py-24 mt-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                How It Works
              </h2>
              <p className="mt-4 text-gray-400">
                Three simple steps to secure your spot.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="group relative rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-8 hover:bg-[#0d1527] hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)]">
                <div className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Find Parking
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  Search for available parking near your destination using our
                  real-time tracking map.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group relative rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-8 hover:bg-[#0d1527] hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)]">
                <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Book Your Spot
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  Select a parking slot, vehicle, and booking duration right
                  from your device.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group relative rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-8 hover:bg-[#0d1527] hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)]">
                <div className="w-12 h-12 rounded-full bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white">Park & Go</h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  Use your digital parking pass for seamless entry and enjoy a
                  stress-free experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#03050a] px-8 py-16 text-white relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center font-bold text-xs text-[#03050a]">
                  P
                </div>
                <h3 className="text-xl font-bold tracking-tight">ParkSphere</h3>
              </Link>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                The next-generation smart parking management system. Redefining
                urban mobility.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-200 tracking-wide mb-4">
                Quick Links
              </h3>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <Link
                  to="/find-parking"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Find Parking
                </Link>
                <a
                  href="#how-it-works"
                  className="hover:text-cyan-400 transition-colors"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="font-semibold text-gray-200 tracking-wide mb-4">
                Account
              </h3>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <Link
                  to="/login"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>© 2026 ParkSphere. All rights reserved.</div>
            <div>Developed By Soumyadeep Paul</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;