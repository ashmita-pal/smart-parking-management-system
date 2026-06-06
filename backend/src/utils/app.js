import express from "express";

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

export default app;