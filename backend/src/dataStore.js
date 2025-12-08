// src/dataStore.js

let salesData = [];

/**
 * Save loaded sales data in memory
 */
function setSalesData(data) {
  salesData = data;
}

/**
 * Get current sales data
 */
function getSalesData() {
  return salesData;
}

module.exports = {
  setSalesData,
  getSalesData,
};
