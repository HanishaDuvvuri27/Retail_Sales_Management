const { getSalesData } = require("../dataStore");
const { connectToDb } = require("../utils/db");



function parseDate(dateInput) {
  if (!dateInput) return null;

  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) return dateInput;

  // numeric timestamp
  if (!isNaN(Number(dateInput))) {
    let t = Number(dateInput);
    if (t < 1e12) t *= 1000;
    const d = new Date(t);
    return isNaN(d.getTime()) ? null : d;
  }

  const s = String(dateInput).trim();


  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return iso;

  
  const ymd = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymd) return new Date(+ymd[1], +ymd[2] - 1, +ymd[3]);

  
  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return new Date(+dmy[3], +dmy[2] - 1, +dmy[1]);

  return null;
}

// Normalize front-end names 
function normalizeOptions(o = {}) {
  o = { ...o };
  if (!o.dateFrom && o.fromDate) o.dateFrom = o.fromDate;
  if (!o.dateTo && o.toDate) o.dateTo = o.toDate;
  return o;
}


function getSalesFromMemory(rawOptions) {
  const options = normalizeOptions(rawOptions);
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

  if (search && search.trim()) {
    const s = search.toLowerCase();
    data = data.filter(
      (it) =>
        (it.customerName || "").toLowerCase().includes(s) ||
        (it.phoneNumber || "").toLowerCase().includes(s)
    );
  }

  if (regions?.length) {
    data = data.filter((it) => regions.includes(it.customerRegion));
  }

  if (genders?.length) {
    data = data.filter((it) => genders.includes(it.gender));
  }

  if (ageMin != null || ageMax != null) {
    data = data.filter((it) => {
      const a = it.age;
      if (a == null) return false;
      if (ageMin != null && a < ageMin) return false;
      if (ageMax != null && a > ageMax) return false;
      return true;
    });
  }

  if (categories?.length) {
    data = data.filter((it) =>
      categories.includes(it.productCategory)
    );
  }

  if (tags?.length) {
    const filterTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    data = data.filter((it) => {
      const rowTags =
        it.tags
          ?.split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean) || [];
      return rowTags.some((t) => filterTags.includes(t));
    });
  }

  if (paymentMethods?.length) {
    data = data.filter((it) => paymentMethods.includes(it.paymentMethod));
  }

  // DATE FILTER FIXED
  if (dateFrom || dateTo) {
    const from = parseDate(dateFrom);
    const to = parseDate(dateTo);

    data = data.filter((it) => {
      const d = parseDate(it.date);
      if (!d) return false;

      if (from && d < from) return false;

      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }

  // Summary
  const summary = data.reduce(
    (acc, it) => {
      acc.totalUnitsSold += it.quantity || 0;
      acc.totalAmount += it.totalAmount || 0;
      acc.totalDiscount += (it.totalAmount || 0) - (it.finalAmount || 0);
      return acc;
    },
    { totalUnitsSold: 0, totalAmount: 0, totalDiscount: 0 }
  );

  // Sorting
  let sorted = [...data];
  const order = sortOrder === "asc" ? 1 : -1;

  if (sortBy === "date") {
    sorted.sort((a, b) => (parseDate(a.date) - parseDate(b.date)) * order);
  } else if (sortBy === "quantity") {
    sorted.sort((a, b) => ((a.quantity || 0) - (b.quantity || 0)) * order);
  } else if (sortBy === "customerName") {
    sorted.sort((a, b) =>
      a.customerName.localeCompare(b.customerName) * order
    );
  }

  const size = pageSize || 10;
  const currentPage = page || 1;
  const paged = sorted.slice((currentPage - 1) * size, currentPage * size);

  return {
    data: paged,
    page: currentPage,
    pageSize: size,
    totalItems: data.length,
    totalPages: Math.ceil(data.length / size),
    summary,
  };
}

function getDistinctTags(categories = []) {
  const data = getSalesData();
  const categorySet =
    categories && categories.length
      ? new Set(categories.map((c) => (c || "").toLowerCase()))
      : null;

  const tagSet = new Set();

  data.forEach((item) => {
    if (categorySet) {
      const cat = (item.productCategory || "").toLowerCase();
      if (!categorySet.has(cat)) return;
    }
    if (!item.tags) return;
    item.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => tagSet.add(t));
  });

  return Array.from(tagSet);
}


function getDistinctPaymentMethods() {
  const data = getSalesData();
  const set = new Set();
  data.forEach((item) => {
    if (item.paymentMethod) set.add(item.paymentMethod);
  });
  return Array.from(set);
}

function getDistinctCategories() {
  const data = getSalesData();
  const set = new Set();
  data.forEach((item) => {
    if (item.productCategory) set.add(item.productCategory);
  });
  return Array.from(set);
}


async function getSales(rawOptions) {
  const options = normalizeOptions(rawOptions);
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

  try {
    const db = await connectToDb();
    const coll = db.collection("sales");

    const match = {};

    if (search?.trim()) {
      match.$or = [
        { "Customer Name": { $regex: search, $options: "i" } },
        { "Phone Number": { $regex: search, $options: "i" } },
      ];
    }

    if (regions?.length) match["Customer Region"] = { $in: regions };
    if (genders?.length) match.Gender = { $in: genders };
    if (categories?.length) match["Product Category"] = { $in: categories };
    if (paymentMethods?.length)
      match["Payment Method"] = { $in: paymentMethods };

    if (ageMin != null || ageMax != null) {
      match.Age = {};
      if (ageMin != null) match.Age.$gte = ageMin;
      if (ageMax != null) match.Age.$lte = ageMax;
    }

    // DATE RANGE FIX 
    if (dateFrom || dateTo) {
      const from = parseDate(dateFrom);
      const to = parseDate(dateTo);

      const end = to ? new Date(to.setHours(23, 59, 59, 999)) : null;

      
      const bsonFilter = {};
      if (from) bsonFilter.$gte = from;
      if (end) bsonFilter.$lte = end;

      
      const strFilter = {};
      if (dateFrom) strFilter.$gte = dateFrom;
      if (dateTo) strFilter.$lte = dateTo;

    
      match.$or = [
        { Date: bsonFilter },
        { Date: strFilter },
      ];
    }

    const sortObj = {};
    sortObj.Date = sortOrder === "asc" ? 1 : -1;

    const currentPage = page || 1;
    const size = pageSize || 10;

    const pipeline = [
      { $match: match },
      {
        $facet: {
          data: [
            { $sort: sortObj },
            { $skip: (currentPage - 1) * size },
            { $limit: size },
          ],
          totalCount: [{ $count: "count" }],
          summary: [
            {
              $group: {
                _id: null,
                totalUnitsSold: { $sum: { $ifNull: ["$Quantity", 0] } },
                totalAmount: { $sum: { $ifNull: ["$Total Amount", 0] } },
                totalDiscount: {
                  $sum: {
                    $subtract: [
                      { $ifNull: ["$Total Amount", 0] },
                      { $ifNull: ["$Final Amount", 0] },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ];

    const result = await coll.aggregate(pipeline).toArray();
    const res = result[0] || {};

    const summary =
      res.summary?.[0] || { totalUnitsSold: 0, totalAmount: 0, totalDiscount: 0 };

    return {
      data: res.data || [],
      totalItems: res.totalCount?.[0]?.count || 0,
      page: currentPage,
      pageSize: size,
      totalPages: Math.ceil((res.totalCount?.[0]?.count || 0) / size),
      summary,
    };
  } catch (err) {
    console.log("Mongo failed, using memory:", err.message);
    return getSalesFromMemory(options);
  }
}

module.exports = {
  getSales,
  getDistinctTags,
  getDistinctPaymentMethods,
  getDistinctCategories,
};
