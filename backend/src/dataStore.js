let salesData = [];

/** Store sales data in memory */
function setSalesData(data) {
  salesData = data;
}

/** Return current sales data */
function getSalesData() {
  return salesData;
}

module.exports = {
  setSalesData,
  getSalesData,
};
