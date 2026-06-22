import express from "express";
import errorHandler from "./middleware/error.middleware.js";
import testRouter from "./routes/test.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import parkingLotRoutes from "./routes/parking-lot.routes.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Parking Backend Running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parking-lots", parkingLotRoutes);
app.use(errorHandler);
export default app;