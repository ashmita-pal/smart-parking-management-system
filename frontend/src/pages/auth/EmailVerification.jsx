import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";

function EmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [verificationCode, setVerificationCode] = useState("");
  const [resendTimer, setResendTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const minutes = Math.floor(resendTimer / 60);
  const seconds = resendTimer % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await api.post("/auth/verify-email", {
        email,
        code: verificationCode,
      });

      console.log("Email verification successful:", response.data);

      navigate("/login");
    } catch (error) {
      console.error("Email verification failed:", error);

      const message =
        error.response?.data?.message ||
        "Email verification failed. Please try again.";

      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) {
      return;
    }

    setError("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    try {
      setIsResending(true);

      const response = await api.post("/auth/resend-verification-email", {
        email,
      });

      console.log("Verification code resent:", response.data);

      setResendTimer(300);
      setCanResend(false);
      setVerificationCode("");
    } catch (error) {
      console.error("Resend verification failed:", error);

      const message =
        error.response?.data?.message ||
        "Unable to resend verification code. Please try again.";

      setError(message);
    } finally {
      setIsResending(false);
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
          to="/login"
          className="text-sm text-gray-300 hover:text-white transition"
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
                    d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Verify Your Email
              </h1>

              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                We've sent a verification code to your email address. Enter the
                code below to verify your account.
              </p>

              {email && (
                <p className="mt-2 text-sm text-cyan-400 break-all">
                  {email}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={handleCodeChange}
                maxLength={6}
                placeholder="Enter 6-digit code"
                disabled={isVerifying}
                className="w-full bg-[#050810] border border-white/10 rounded-xl px-4 py-4 text-center text-xl tracking-[0.5em] text-white placeholder:text-gray-600 placeholder:tracking-normal outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition disabled:opacity-50"
              />

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full mt-6 py-4 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isVerifying ? "VERIFYING..." : "VERIFY EMAIL"}
              </button>
            </form>

            {/* Resend Countdown */}
            <div className="mt-6 text-center">
              {!canResend ? (
                <p className="text-sm text-gray-400">
                  Didn't receive the code?{" "}
                  <span className="font-medium text-cyan-400">
                    Resend in {formattedTime}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResending
                    ? "Sending..."
                    : "Didn't receive the code? Resend Code"}
                </button>
              )}
            </div>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-gray-500">
                Already verified?{" "}
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 transition font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmailVerification;