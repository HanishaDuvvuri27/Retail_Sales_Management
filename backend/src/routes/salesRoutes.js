const express = require("express");
const router = express.Router();
const { handleGetSales } = require("../controllers/salesController");

router.get("/", handleGetSales);

module.exports = router;
