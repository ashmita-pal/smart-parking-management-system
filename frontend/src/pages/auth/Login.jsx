import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response.data);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 bg-[#070B14]/70 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/20">
            P
          </div>

          <span className="text-xl font-semibold tracking-tight">
            ParkSphere
          </span>
        </Link>

        <Link
          to="/register"
          className="text-sm text-gray-300 hover:text-white transition"
        >
          Create Account
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 min-h-[calc(100vh-89px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#0A0F1C]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-cyan-500/5">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome Back
              </h1>

              <p className="mt-3 text-sm text-gray-400">
                Login to continue to ParkSphere.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full bg-[#050810] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full bg-[#050810] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition disabled:opacity-50"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-cyan-400 hover:text-cyan-300 transition font-medium"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;