import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api.js";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
      }
    }

    if (name === "password") {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
      }
    }

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      console.log("Registration successful:", response.data);

      navigate("/verify-email", {
        state: {
          email: formData.email,
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute left-[-15%] top-[-10%] h-125 w-125 rounded-full bg-blue-600/20 blur-[120px]"></div>

      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-100 w-100 rounded-full bg-purple-600/20 blur-[110px]"></div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-[#070B14]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-linear-to-br from-cyan-400 to-blue-600 font-bold text-[#070B14] shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all group-hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
              P
            </div>

            <span className="text-xl font-bold tracking-tight">ParkSphere</span>
          </Link>

          {/* Back to Home */}
          <Link
            to="/"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-cyan-400"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-2xl font-bold text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              P
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight">
              Create Your Account
            </h1>

            <p className="mt-3 text-gray-400">
              Join ParkSphere and make parking simple.
            </p>
          </div>

          {/* Register Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0F1C]/90 p-8 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-xl border border-gray-700/80 bg-[#060913] px-4 py-3 text-white outline-none placeholder:text-gray-600 shadow-inner transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-2 w-full rounded-xl border border-gray-700/80 bg-[#060913] px-4 py-3 text-white outline-none placeholder:text-gray-600 shadow-inner transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="mt-2 w-full rounded-xl border border-gray-700/80 bg-[#060913] px-4 py-3 text-white outline-none placeholder:text-gray-600 shadow-inner transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="mt-2 w-full rounded-xl border border-gray-700/80 bg-[#060913] px-4 py-3 text-white outline-none placeholder:text-gray-600 shadow-inner transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`mt-2 w-full rounded-xl border bg-[#060913] px-4 py-3 text-white outline-none placeholder:text-gray-600 shadow-inner transition focus:ring-1 ${
                    passwordError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-700/80 focus:border-cyan-500 focus:ring-cyan-500"
                  }`}
                  required
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                )}
              </div>

              {/* Backend Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
            </form>

            {/* Login */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-gray-500">Already have an account?</p>

              <Link
                to="/login"
                className="mt-2 inline-block text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Sign in instead →
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <p className="mt-6 text-center text-xs text-gray-600">
            Secure parking management with ParkSphere.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;