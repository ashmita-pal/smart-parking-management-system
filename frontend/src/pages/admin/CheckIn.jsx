import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api/api";

const CheckIn = () => {
  const scannerRef = useRef(null);
  const scanningRef = useRef(false);
  const mountedRef = useRef(true);

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cameraLoading, setCameraLoading] = useState(true);

  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      if (scanningRef.current) {
        await scanner.stop();
        scanningRef.current = false;
      }
    } catch (error) {
      console.log("Scanner stop error:", error);
    }

    try {
      scanner.clear();
    } catch (error) {
      console.log("Scanner clear error:", error);
    }

    scannerRef.current = null;
  };

  const startScanner = async () => {
    try {
      setCameraLoading(true);
      setError("");

      await stopScanner();

      if (!mountedRef.current) {
        return;
      }

      const reader = document.getElementById("qr-reader");

      if (!reader) {
        return;
      }

      reader.innerHTML = "";

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        throw new Error("No camera found");
      }

      const cameraId = cameras[0].id;

      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

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
          if (!mountedRef.current) {
            return;
          }

          if (!scanningRef.current) {
            return;
          }

          scanningRef.current = false;

          setError("");
          setSuccess("");

          try {
            await scanner.stop();
          } catch (error) {
            console.log("Scanner stop error:", error);
          }

          try {
            const response = await api.post(
              "/bookings/check-in",
              {
                qrToken: decodedText,
              },
            );

            if (!mountedRef.current) {
              return;
            }

            setBooking(response.data.data);

            setSuccess(
              "Vehicle checked in successfully",
            );
          } catch (error) {
            if (!mountedRef.current) {
              return;
            }

            setError(
              error.response?.data?.message ||
                "Unable to check in vehicle",
            );

            scanningRef.current = true;
          }
        },

        () => {
          // Ignore continuous QR scanning errors
        },
      );

      scanningRef.current = true;

      if (mountedRef.current) {
        setCameraLoading(false);
      }
    } catch (error) {
      console.error("Camera error:", error);

      if (!mountedRef.current) {
        return;
      }

      setCameraLoading(false);

      setError(
        error.message ||
          "Unable to open camera. Please allow camera access.",
      );
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    startScanner();

    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, []);

  const scanAnother = () => {
    setBooking(null);
    setSuccess("");
    setError("");

    scanningRef.current = false;

    setTimeout(() => {
      if (mountedRef.current) {
        startScanner();
      }
    }, 200);
  };

  return (
    <div className="min-h-full bg-[#050b14] px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 text-center">

          {/* QR Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]">

            <span className="text-2xl font-semibold text-cyan-400">
              QR
            </span>

          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Parking{" "}
            <span className="text-cyan-400">
              Check-In
            </span>
          </h1>

          <p className="mt-3 text-gray-400">
            Scan the customer's parking QR code to allow
            entry.
          </p>

        </div>


        {/* ================= MAIN CARD ================= */}

        {!booking && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-[#080f1c] p-8 shadow-[0_0_40px_rgba(0,0,0,0.25)]">

            {/* Card Heading */}

            <h2 className="text-center text-2xl font-bold">
              Scan Parking QR Code
            </h2>

            <p className="mt-2 text-center text-gray-400">
              Point the camera at the QR code shown by the
              customer.
            </p>


            {/* ================= CAMERA BOX ================= */}

            <div className="mt-7 flex justify-center">

              <div className="relative h-[320px] w-[320px] overflow-hidden rounded-2xl border border-cyan-500/50 bg-black shadow-[0_0_30px_rgba(6,182,212,0.12)]">

                {/* Scanner */}

                <div
                  id="qr-reader"
                  className="h-full w-full"
                ></div>


                {/* Corner Brackets */}

                <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 border-l-4 border-t-4 border-cyan-400 rounded-tl-lg"></div>

                <div className="pointer-events-none absolute right-4 top-4 h-10 w-10 border-r-4 border-t-4 border-cyan-400 rounded-tr-lg"></div>

                <div className="pointer-events-none absolute bottom-4 left-4 h-10 w-10 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>

                <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>


                {/* Scan Line */}

                <div className="pointer-events-none absolute left-8 right-8 top-1/2 h-[2px] bg-cyan-400/70 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>

              </div>

            </div>


            {/* Loading */}

            {cameraLoading && !error && (
              <p className="mt-4 text-center text-sm text-gray-400">
                Opening camera...
              </p>
            )}


            {/* Error */}

            {error && (
              <div className="mx-auto mt-5 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm text-red-400">
                {error}
              </div>
            )}


            {/* Instruction */}

            {!cameraLoading && !error && (
              <p className="mt-5 text-center text-sm text-gray-500">
                Position the customer's QR code inside the
                frame.
              </p>
            )}

          </div>
        )}


        {/* ================= SUCCESS CARD ================= */}

        {booking && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-[#080f1c] p-8">

            {/* Success Icon */}

            <div className="mb-7 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl text-green-400">
                ✓
              </div>

              <h2 className="text-2xl font-bold text-green-400">
                {success}
              </h2>

              <p className="mt-2 text-gray-400">
                The vehicle is now allowed to enter the
                parking lot.
              </p>

            </div>


            {/* Booking Details */}

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-[#0d1625] p-4">
                <p className="text-sm text-gray-500">
                  Booking Reference
                </p>

                <p className="mt-1 font-semibold">
                  {booking.bookingReference || "N/A"}
                </p>
              </div>


              <div className="rounded-xl bg-[#0d1625] p-4">
                <p className="text-sm text-gray-500">
                  Booking Status
                </p>

                <p className="mt-1 font-semibold text-green-400">
                  {booking.bookingStatus}
                </p>
              </div>


              <div className="rounded-xl bg-[#0d1625] p-4">
                <p className="text-sm text-gray-500">
                  Vehicle Number
                </p>

                <p className="mt-1 font-semibold">
                  {booking.vehicle?.vehicleNumber || "N/A"}
                </p>
              </div>


              <div className="rounded-xl bg-[#0d1625] p-4">
                <p className="text-sm text-gray-500">
                  Vehicle Type
                </p>

                <p className="mt-1 font-semibold">
                  {booking.vehicle?.vehicleType || "N/A"}
                </p>
              </div>


              <div className="rounded-xl bg-[#0d1625] p-4">
                <p className="text-sm text-gray-500">
                  Parking Slot
                </p>

                <p className="mt-1 font-semibold">
                  {booking.slot?.slotNumber || "N/A"}
                </p>
              </div>


              <div className="rounded-xl bg-[#0d1625] p-4">
                <p className="text-sm text-gray-500">
                  Floor
                </p>

                <p className="mt-1 font-semibold">
                  {booking.slot?.floorNumber || "N/A"}
                </p>
              </div>

            </div>


            {/* Scan Another */}

            <button
              onClick={scanAnother}
              className="mt-8 w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Scan Another QR
            </button>

          </div>
        )}


        {/* Back */}

        <div className="mt-6 text-center">

          <Link
            to="/admin"
            className="text-sm text-gray-400 transition hover:text-cyan-400"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
};

export default CheckIn;