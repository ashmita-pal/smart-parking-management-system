import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await api.post("/auth/forgot-password", {
        email,
      });

      console.log("Forgot password response:", response.data);

      setMessage(
        response.data.message ||
          "If an account with that email exists, a password reset link has been sent.",
      );

      setEmail("");
    } catch (error) {
      console.error("Forgot password failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#070B14] font-sans text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between border-b border-white/10 bg-[#070B14]/70 px-8 py-6 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 text-lg font-bold shadow-lg shadow-cyan-500/20">
            P
          </div>

          <span className="text-xl font-semibold tracking-tight">
            ParkSphere
          </span>
        </Link>

        <Link
          to="/login"
          className="text-sm text-gray-300 transition hover:text-white"
        >
          Back to Login
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0A0F1C]/90 p-8 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-linear-to-br from-cyan-400/20 to-blue-500/20">
                <svg
                  className="h-8 w-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM4 21a8 8 0 0116 0"
                  />
                </svg>
              </div>
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Forgot Password
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Enter your email address and we'll send you a password reset
                link.
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-sm leading-6 text-green-400">
                  {message}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm leading-6 text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#050810] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "SENDING..."
                  : "SEND RESET LINK"}
              </button>
            </form>

            {/* Back to Login */}
            <p className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-400 transition hover:text-cyan-300"
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

export default ForgotPassword;