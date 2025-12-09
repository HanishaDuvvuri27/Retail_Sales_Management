// Load sales data directly from MongoDB atlas sales_db.sales collection
const { connectToDb } = require("./db");

function extractNumber(val) {
  if (val == null) return null;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val);
    return isNaN(n) ? null : n;
  }
  if (typeof val === "object") {
    if (val.$numberInt) return Number(val.$numberInt);
    if (val.$numberLong) return Number(val.$numberLong);
    if (val.$numberDouble) return Number(val.$numberDouble);
    // try to find first numeric-like property
    for (const k of Object.keys(val)) {
      const maybe = Number(val[k]);
      if (!isNaN(maybe)) return maybe;
    }
  }
  return null;
}

function extractString(val) {
  if (val == null) return null;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.$date) return val.$date;
    if (val.toString) return val.toString();
  }
  return null;
}

async function loadSalesData() {
  const db = await connectToDb();
  const coll = db.collection("sales");

  // Load minimal sample (100 docs) for in-memory fallback; all queries go through MongoDB
  const docs = await coll.find({}).limit(100).toArray();

  const results = docs.map((doc) => {
    const tagsField = doc.tags || doc.Tags || doc["Tags"] || null;
    const tags = Array.isArray(tagsField)
      ? tagsField.join(",")
      : extractString(tagsField);

    return {
      transactionId: doc.transactionId || doc["Transaction ID"] || (doc._id ? String(doc._id) : null),
      date: extractString(doc.date || doc.Date || doc["Date"] || doc.transactionDate),

      customerId: doc.customerId || doc["Customer ID"] || null,
      customerName: doc.customerName || doc["Customer Name"] || null,
      phoneNumber: doc.phoneNumber || doc["Phone Number"] || null,
      gender: doc.gender || doc.Gender || null,
      age: extractNumber(doc.age || doc.Age),
      customerRegion: doc.customerRegion || doc["Customer Region"] || null,
      customerType: doc.customerType || doc["Customer Type"] || null,

      productId: doc.productId || doc["Product ID"] || null,
      productName: doc.productName || doc["Product Name"] || null,
      brand: doc.brand || doc.Brand || null,
      productCategory: doc.productCategory || doc["Product Category"] || null,
      tags,

      quantity: extractNumber(doc.quantity || doc.Quantity) || 0,
      pricePerUnit: extractNumber(doc.pricePerUnit || doc["Price per Unit"]) || 0,
      discountPercentage: extractNumber(doc.discountPercentage || doc["Discount Percentage"]) || 0,
      totalAmount: extractNumber(doc.totalAmount || doc["Total Amount"]) || 0,
      finalAmount: extractNumber(doc.finalAmount || doc["Final Amount"]) || 0,

      paymentMethod: doc.paymentMethod || doc["Payment Method"] || null,
      orderStatus: doc.orderStatus || doc["Order Status"] || null,
      deliveryType: doc.deliveryType || doc["Delivery Type"] || null,
      storeId: doc.storeId || doc["Store ID"] || null,
      storeLocation: doc.storeLocation || doc["Store Location"] || null,
      salespersonId: doc.salespersonId || doc["Salesperson ID"] || null,
      employeeName: doc.employeeName || doc["Employee Name"] || null,
    };
  });

  console.log(`✓ Loaded ${results.length} records from MongoDB (fallback sample)`);
  return results;
}

module.exports = { loadSalesData };
