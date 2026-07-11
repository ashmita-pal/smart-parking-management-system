import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { startBookingExpiry } from "./jobs/bookingExpiry.jobs.js";



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);

  startBookingExpiry();

  console.log("⏰ Booking expiry cron job started");
});

