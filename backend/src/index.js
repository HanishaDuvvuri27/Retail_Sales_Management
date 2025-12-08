const express = require("express");
const cors = require("cors");

const { loadSalesData } = require("./utils/loadCsv");
const { setSalesData } = require("./dataStore");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/sales", salesRoutes);

app.get("/", (req, res) => {
  res.send("Retail Sales Management System API is running ✅");
});

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
