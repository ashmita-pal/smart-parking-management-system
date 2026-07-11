import cron from "node-cron";

import { expireBookings } from "../services/bookingExpiry.services.js";

const startBookingExpiry=()=> cron.schedule("* * * * *", async () => {
  console.log("Running booking expiry job...");

  try {
    const result = await expireBookings();

    console.log(
      `Processed: ${result.processed}, Expired: ${result.expired}`,
    );
  } catch (error) {
    console.error(
      "Booking expiry job failed:",
      error.message,
    );
  }
});

export {startBookingExpiry};