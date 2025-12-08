// src/controllers/salesController.js
const { getSales } = require("../services/salesService");

function parseListParam(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

async function handleGetSales(req, res) {
  try {
    const {
      search,
      regions,
      genders,
      ageMin,
      ageMax,
      categories,
      tags,
      paymentMethods,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      page,
      pageSize,
    } = req.query;

    const options = {
      search: search || "",
      regions: parseListParam(regions),
      genders: parseListParam(genders),
      ageMin: ageMin ? Number(ageMin) : null,
      ageMax: ageMax ? Number(ageMax) : null,
      categories: parseListParam(categories),
      tags: parseListParam(tags),
      paymentMethods: parseListParam(paymentMethods),
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      sortBy: sortBy || "date",
      sortOrder: sortOrder || "desc", // date newest first
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    };

    // Basic range sanity check
    if (
      options.ageMin != null &&
      options.ageMax != null &&
      options.ageMin > options.ageMax
    ) {
      // swap
      const temp = options.ageMin;
      options.ageMin = options.ageMax;
      options.ageMax = temp;
    }

    const result = getSales(options);
    res.json(result);
  } catch (err) {
    console.error("Error in handleGetSales:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleGetSales,
};
