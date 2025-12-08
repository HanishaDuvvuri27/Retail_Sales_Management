let salesData = [];

function setSalesData(data) {
  salesData = data;
}

function getSalesData() {
  return salesData;
}

module.exports = {
  setSalesData,
  getSalesData,
};
