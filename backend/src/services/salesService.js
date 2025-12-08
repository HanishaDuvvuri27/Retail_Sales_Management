const { getSalesData } = require("../dataStore");

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

// Core function: applies search, filters, sort, pagination
function getSales(options) {
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
  } = options;

  let data = getSalesData();

  // Search by customer name or phone
  if (search && search.trim() !== "") {
    const s = search.toLowerCase();
    data = data.filter((item) => {
      const name = (item.customerName || "").toLowerCase();
      const phone = (item.phoneNumber || "").toLowerCase();
      return name.includes(s) || phone.includes(s);
    });
  }

  // Filters

  if (regions && regions.length > 0) {
    data = data.filter(
      (item) => item.customerRegion && regions.includes(item.customerRegion)
    );
  }

  if (genders && genders.length > 0) {
    data = data.filter(
      (item) => item.gender && genders.includes(item.gender)
    );
  }

  if (ageMin != null || ageMax != null) {
    data = data.filter((item) => {
      const age = item.age;
      if (age == null) return false;

      if (ageMin != null && age < ageMin) return false;
      if (ageMax != null && age > ageMax) return false;
      return true;
    });
  }

  if (categories && categories.length > 0) {
    data = data.filter(
      (item) =>
        item.productCategory && categories.includes(item.productCategory)
    );
  }

  if (tags && tags.length > 0) {
    data = data.filter((item) => {
      if (!item.tags) return false;
      const rowTags = item.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      return rowTags.some((t) => tags.includes(t));
    });
  }

  if (paymentMethods && paymentMethods.length > 0) {
    data = data.filter(
      (item) =>
        item.paymentMethod && paymentMethods.includes(item.paymentMethod)
    );
  }

  if (dateFrom || dateTo) {
    const from = parseDate(dateFrom);
    const to = parseDate(dateTo);

    data = data.filter((item) => {
      const d = parseDate(item.date);
      if (!d) return false;

      if (from && d < from) return false;
      if (to) {
        // include end date in range
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }

      return true;
    });
  }

  // Summary (before pagination)
  const totalItems = data.length;

  const summary = data.reduce(
    (acc, item) => {
      const qty = item.quantity || 0;
      const totalAmt = item.totalAmount || 0;
      const finalAmt = item.finalAmount || 0;
      const discount = totalAmt - finalAmt;

      acc.totalUnitsSold += qty;
      acc.totalAmount += totalAmt;
      acc.totalDiscount += discount;

      return acc;
    },
    {
      totalUnitsSold: 0,
      totalAmount: 0,
      totalDiscount: 0,
    }
  );

  // Sorting
  let sorted = [...data];
  const order = sortOrder === "asc" ? 1 : -1;

  if (sortBy === "date") {
    sorted.sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da || !db) return 0;
      return (da - db) * order;
    });
  } else if (sortBy === "quantity") {
    sorted.sort((a, b) => {
      const qa = a.quantity || 0;
      const qb = b.quantity || 0;
      return (qa - qb) * order;
    });
  } else if (sortBy === "customerName") {
    sorted.sort((a, b) => {
      const na = (a.customerName || "").toLowerCase();
      const nb = (b.customerName || "").toLowerCase();
      if (na < nb) return -1 * order;
      if (na > nb) return 1 * order;
      return 0;
    });
  }

  // Pagination
  const currentPage = page && page > 0 ? page : 1;
  const size = pageSize || 10;
  const startIndex = (currentPage - 1) * size;
  const pagedData = sorted.slice(startIndex, startIndex + size);
  const totalPages = Math.max(1, Math.ceil(totalItems / size) || 1);

  return {
    data: pagedData,
    page: currentPage,
    pageSize: size,
    totalItems,
    totalPages,
    summary,
  };
}

module.exports = {
  getSales,
};
