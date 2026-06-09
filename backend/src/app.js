import express from "express";
import errorHandler from "./middleware/error.middleware.js";
import testRouter from "./routes/test.routes.js";

const app = express();

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

app.use(errorHandler);
export default app;