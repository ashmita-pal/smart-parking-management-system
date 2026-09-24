import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api/api";

function AdminCheckOut() {
  const scannerRef = useRef(null);
  const scanningRef = useRef(false);
  const mountedRef = useRef(true);

  const [scannerError, setScannerError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  useEffect(() => {
    mountedRef.current = true;

    startScanner();

    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, []);

  async function stopScanner() {
    if (!scannerRef.current || !scanningRef.current) {
      return;
    }

    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch (error) {
      console.error("Failed to stop scanner:", error);
    } finally {
      scanningRef.current = false;
    }
  }

  async function startScanner() {
    try {
      setScannerError("");
      setCheckoutError("");
      setCheckoutResult(null);

      await stopScanner();

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        setScannerError("No camera found.");
        return;
      }

      const cameraId = cameras[0].id;

      const scanner = new Html5Qrcode("checkout-qr-reader");

      scannerRef.current = scanner;
      scanningRef.current = true;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: {
            width: 220,
            height: 220,
          },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          if (!scanningRef.current) {
            return;
          }

          scanningRef.current = false;

          try {
            await scanner.stop();
          } catch (error) {
            console.error("Failed to stop scanner:", error);
          }

          await handleCheckout(decodedText);
        },
        (errorMessage) => {
          // Ignore normal QR scanning failures.
        },
      );
    } catch (error) {
      console.error("Failed to start checkout scanner:", error);

      if (mountedRef.current) {
        setScannerError(
          "Unable to access camera. Please allow camera permission and try again.",
        );
      }
    }
  }

  async function handleCheckout(qrToken) {
    try {
      setCheckingOut(true);
      setCheckoutError("");
      setCheckoutResult(null);

      /*
       * The QR contains the booking's qrToken.
       *
       * We first send the token to the backend.
       * The backend will identify the booking and
       * process checkout.
       */

      const response = await api.post(
        "/bookings/check-out",
        {
          qrToken,
        },
      );

      console.log("Checkout response:", response.data);

      if (mountedRef.current) {
        setCheckoutResult(response.data.data);
      }
    } catch (error) {
      console.error("Checkout failed:", error);

      if (mountedRef.current) {
        setCheckoutError(
          error.response?.data?.message ||
            "Unable to process checkout.",
        );
      }
    } finally {
      if (mountedRef.current) {
        setCheckingOut(false);
      }
    }
  }

  async function scanAnother() {
    setCheckoutResult(null);
    setCheckoutError("");
    setScannerError("");

    await startScanner();
  }

  function formatTime(date) {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 font-sans text-white sm:px-6 lg:px-8">

      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Parking Check-Out
          </h1>

          <p className="mt-2 text-gray-400">
            Scan the customer's QR code at the exit gate
          </p>

        </div>

        {/* Scanner */}
        {!checkoutResult && (
          <section className="rounded-2xl border border-gray-800/80 bg-[#0a0f1c]/90 p-6 shadow-2xl backdrop-blur-md">

            <div className="flex flex-col items-center">

              <div className="relative h-[320px] w-[320px] overflow-hidden rounded-2xl border border-cyan-500/30 bg-black shadow-[0_0_35px_rgba(6,182,212,0.15)]">

                {/* QR Scanner */}
                <div
                  id="checkout-qr-reader"
                  className="h-full w-full"
                />

                {/* Scanner Overlay */}
                <div className="pointer-events-none absolute inset-0">

                  {/* Top Left */}
                  <div className="absolute left-8 top-8 h-10 w-10 border-l-2 border-t-2 border-cyan-400" />

                  {/* Top Right */}
                  <div className="absolute right-8 top-8 h-10 w-10 border-r-2 border-t-2 border-cyan-400" />

                  {/* Bottom Left */}
                  <div className="absolute bottom-8 left-8 h-10 w-10 border-b-2 border-l-2 border-cyan-400" />

                  {/* Bottom Right */}
                  <div className="absolute bottom-8 right-8 h-10 w-10 border-b-2 border-r-2 border-cyan-400" />

                  {/* Scan Line */}
                  <div className="absolute left-10 right-10 top-1/2 h-px bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

                </div>

              </div>

              <p className="mt-5 text-sm text-gray-400">
                Position the customer's QR code inside the frame
              </p>

            </div>

            {/* Scanner Error */}
            {scannerError && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
                {scannerError}
              </div>
            )}

            {/* Checkout Error */}
            {checkoutError && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
                {checkoutError}
              </div>
            )}

            {/* Processing */}
            {checkingOut && (
              <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-400">
                Processing checkout...
              </div>
            )}

          </section>
        )}

        {/* Checkout Result */}
        {checkoutResult && (
          <section className="rounded-2xl border border-green-500/30 bg-[#0a0f1c]/90 p-8 shadow-2xl">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">

                <span className="text-3xl text-green-400">
                  ✓
                </span>

              </div>

              <h2 className="mt-5 text-2xl font-bold text-green-400">
                Checkout Successful
              </h2>

              <p className="mt-2 text-gray-400">
                Vehicle has been successfully checked out.
              </p>

            </div>

            {/* Booking Information */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">

                <span className="text-gray-500">
                  Booking Reference
                </span>

                <span className="font-semibold text-cyan-400">
                  {checkoutResult.bookingReference}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">

                <span className="text-gray-500">
                  Status
                </span>

                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  {checkoutResult.bookingStatus?.replaceAll(
                    "_",
                    " ",
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">

                <span className="text-gray-500">
                  Exit Time
                </span>

                <span className="font-medium text-gray-200">
                  {formatTime(checkoutResult.exitTime)}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">

                <span className="text-gray-500">
                  Overstay
                </span>

                <span className="font-medium text-gray-200">
                  {checkoutResult.overstayMinutes} minutes
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Overstay Amount
                </span>

                <span className="font-bold text-cyan-400">
                  ₹{Number(checkoutResult.overstayAmount)}
                </span>

              </div>

            </div>

            {/* Scan Another */}
            <button
              type="button"
              onClick={scanAnother}
              className="mt-8 w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
            >
              SCAN ANOTHER VEHICLE
            </button>

          </section>
        )}

      </div>
    </div>
  );
}

export default AdminCheckOut;