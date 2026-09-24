import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");

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
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Invalid or missing password reset link. Please request a new reset link.",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: formData.password,
      });

      console.log("Password reset response:", response.data);

      setSuccess(response.data.message || "Password Reset Successful.");

      setFormData({
        password: "",
        confirmPassword: "",
      });

      // Give the user a moment to see the success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 bg-[#070B14]/70 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all group-hover:shadow-cyan-500/40">
            P
          </div>

          <span className="text-xl font-semibold tracking-tight">
            ParkSphere
          </span>
        </Link>

        <Link
          to="/login"
          className="text-sm text-gray-300 hover:text-cyan-400 transition"
        >
          Back to Login
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Reset Your Password
              </h1>

              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Create a new password for your Smart Parking account.
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  New Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className={`mt-2 w-full rounded-xl bg-[#050810] border px-4 py-3.5 text-white placeholder:text-gray-600 outline-none transition shadow-inner ${
                    passwordError
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  }`}
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
                  placeholder="Confirm your new password"
                  className={`mt-2 w-full rounded-xl bg-[#050810] border px-4 py-3.5 text-white placeholder:text-gray-600 outline-none transition shadow-inner ${
                    passwordError
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  }`}
                  required
                />

                {passwordError && (
                  <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                )}
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 px-4 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </button>
            </form>

            {/* Back to Login */}
            <p className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;