const express = require("express");
const router = express.Router();
const {
  handleGetSales,
  handleGetTags,
  handleGetPaymentMethods,
  handleGetCategories,
} = require("../controllers/salesController");

router.get("/", handleGetSales);
router.get("/tags", handleGetTags);
router.get("/payment-methods", handleGetPaymentMethods);
router.get("/categories", handleGetCategories);

module.exports = router;
