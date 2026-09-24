import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

function Profile() {
  const navigate = useNavigate();

  // ==================================================
  // PROFILE DATA
  // ==================================================

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    isEmailVerified: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // EDIT STATE
  // ==================================================

  const [isEditing, setIsEditing] = useState(false);

  // ==================================================
  // LOGOUT STATE
  // ==================================================

  const [loggingOut, setLoggingOut] = useState(false);

  // ==================================================
  // FETCH CURRENT USER
  // ==================================================

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/me");

        console.log("Current user:", response.data);

        const user = response.data.data;

        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          isEmailVerified: user.isEmailVerified || false,
        });
      } catch (error) {
        console.error("Failed to fetch current user:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to fetch your profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [navigate]);

  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setProfileData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // ==================================================
  // EDIT PROFILE
  // ==================================================

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleSave() {
    /*
     * Profile update API is not available in the current
     * backend yet.
     *
     * Therefore, we do not send a fake request here.
     * The actual profile update functionality will be
     * connected after adding the backend update endpoint.
     */

    console.log(
      "Profile changes are currently local only:",
      profileData,
    );

    setIsEditing(false);
  }

  // ==================================================
  // LOGOUT
  // ==================================================

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");

      console.log("Logout successful");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      /*
       * Even if the request fails, send the user to
       * the login page because the local session may
       * already be invalid.
       */
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  // ==================================================
  // USER INITIALS
  // ==================================================

  function getUserInitials(name) {
    if (!name) {
      return "U";
    }

    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0) +
      nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  }

  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center">

          <div className="rounded-2xl border border-gray-800 bg-[#0a0f1c] p-10 text-center shadow-2xl">

            <p className="font-semibold text-cyan-400">
              Loading your profile...
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Fetching your account information.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // ERROR STATE
  // ==================================================

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="relative mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center">

          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0a0f1c] p-10 text-center shadow-2xl">

            <p className="font-semibold text-red-400">
              Unable to load profile
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              TRY AGAIN
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">

      {/* Architectural Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl space-y-8">

        {/* ================================================== */}
        {/* PAGE HEADING */}
        {/* ================================================== */}

        <section>

          <h1 className="text-3xl font-bold text-white">
            My Profile
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your personal and account information.
          </p>

        </section>

        {/* ================================================== */}
        {/* PROFILE HEADER */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              {/* Profile Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-2xl font-bold text-cyan-400 shadow-lg shadow-cyan-500/10">
                {getUserInitials(profileData.name)}
              </div>

              {/* Basic Information */}
              <div>

                <h2 className="text-2xl font-bold text-white">
                  {profileData.name}
                </h2>

                <p className="mt-1 text-gray-400">
                  {profileData.email}
                </p>

                {profileData.isEmailVerified ? (
                  <span className="mt-2 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    Verified Account
                  </span>
                ) : (
                  <span className="mt-2 inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                    Email Not Verified
                  </span>
                )}

              </div>

            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg border border-cyan-500/60 px-5 py-2.5 text-sm font-medium text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                EDIT PROFILE
              </button>
            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* PERSONAL INFORMATION */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-white">
              Personal Information
            </h2>

          </div>

          {!isEditing ? (

            /* VIEW MODE */
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Full Name
                </p>

                <p className="mt-1 font-medium text-gray-200">
                  {profileData.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email Address
                </p>

                <p className="mt-1 font-medium text-gray-200">
                  {profileData.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone Number
                </p>

                <p className="mt-1 font-medium text-gray-200">
                  {profileData.phone}
                </p>
              </div>

            </div>

          ) : (

            /* EDIT MODE */
            <div className="mt-6 space-y-5">

              {/* Name */}
              <div>

                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-400"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-[#070B14] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                />

              </div>

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-[#070B14] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                />

              </div>

              {/* Phone */}
              <div>

                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-400"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-[#070B14] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                />

              </div>

              {/* Notice */}
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">

                <p className="text-sm text-yellow-400">
                  Profile editing is not connected to the server yet.
                  Your changes will not be saved after leaving this page.
                </p>

              </div>

              {/* Edit Actions */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
                >
                  SAVE CHANGES
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-700 bg-[#070B14] px-5 py-3 font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-900"
                >
                  CANCEL
                </button>

              </div>

            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* ACCOUNT INFORMATION */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white">
            Account Information
          </h2>

          <div className="mt-6 space-y-5">

            {/* Account Status */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">

              <div>

                <p className="font-medium text-gray-200">
                  Account Status
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Current status of your account
                </p>

              </div>

              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                Active
              </span>

            </div>

            {/* Email Verification */}
            <div className="flex items-center justify-between">

              <div>

                <p className="font-medium text-gray-200">
                  Email Verification
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {profileData.isEmailVerified
                    ? "Your email address has been verified"
                    : "Your email address has not been verified"}
                </p>

              </div>

              {profileData.isEmailVerified ? (
                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  Verified
                </span>
              ) : (
                <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                  Not Verified
                </span>
              )}

            </div>

          </div>

        </section>

        {/* ================================================== */}
        {/* QUICK LINKS */}
        {/* ================================================== */}

        <section className="grid gap-4 md:grid-cols-2">

          <Link
            to="/my-vehicles"
            className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-5 shadow-2xl transition hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-[#0c1322]"
          >

            <h3 className="font-bold text-white">
              My Vehicles
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              View and manage your registered vehicles.
            </p>

          </Link>

          <Link
            to="/my-bookings"
            className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c] p-5 shadow-2xl transition hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-[#0c1322]"
          >

            <h3 className="font-bold text-white">
              My Bookings
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              View your parking booking history.
            </p>

          </Link>

        </section>

        {/* ================================================== */}
        {/* LOGOUT */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-red-500/10 bg-[#0a0f1c] p-6 shadow-2xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-bold text-white">
                Sign Out
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Sign out of your ParkSphere account.
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-red-500/40 bg-red-500/5 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/70 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "LOGGING OUT..." : "LOGOUT"}
            </button>

          </div>

        </section>

        {/* ================================================== */}
        {/* BACK */}
        {/* ================================================== */}

        <div>

          <Link
            to="/dashboard"
            className="text-sm text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Profile;