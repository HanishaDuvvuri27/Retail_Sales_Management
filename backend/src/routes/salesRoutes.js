const express = require("express");
const router = express.Router();
const { handleGetSales } = require("../controllers/salesController");

// GET /api/sales
router.get("/", handleGetSales);

module.exports = router;
