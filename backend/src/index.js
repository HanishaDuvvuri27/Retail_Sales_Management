// src/index.js
const express = require("express");
const cors = require("cors");

const { loadSalesData } = require("./utils/loadCsv");
const { setSalesData } = require("./dataStore");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Sales routes
app.use("/api/sales", salesRoutes);
// After you create `const app = express();` and before app.listen

app.get("/", (req, res) => {
  res.send("Retail Sales Management System API is running ✅");
});


// Load CSV THEN start server
loadSalesData()
  .then((data) => {
    setSalesData(data);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to load CSV:", err);
    process.exit(1);
  });
