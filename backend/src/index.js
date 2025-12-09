const express = require("express");
const cors = require("cors");

const { loadSalesData } = require("./utils/loadCsv");
const { setSalesData } = require("./dataStore");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/sales", salesRoutes);

app.get("/", (req, res) => {
  res.send("Retail Sales Management System API is running ✅");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Request error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

loadSalesData()
  .then((data) => {
    setSalesData(data);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to load initial data from MongoDB:", err);
    process.exit(1);
  });
