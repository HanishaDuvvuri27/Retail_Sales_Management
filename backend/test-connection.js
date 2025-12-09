const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI ||
  "mongodb+srv://Hanisha:Hanisha@cluster0.ot4pt9v.mongodb.net/?appName=Cluster0";

console.log("Testing MongoDB connection...");
console.log("URI:", MONGODB_URI.substring(0, 50) + "...");

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testConnection() {
  try {
    console.log("\n1. Connecting to MongoDB...");
    await client.connect();
    console.log("✓ Connection successful");

    console.log("\n2. Getting database (sales_db)...");
    const db = client.db("sales_db");
    console.log("✓ Database retrieved");

    console.log("\n3. Listing collections...");
    const collections = await db.listCollections().toArray();
    console.log("✓ Collections found:", collections.map((c) => c.name));

    console.log("\n4. Checking 'sales' collection...");
    const salesCollection = db.collection("sales");
    const count = await salesCollection.countDocuments();
    console.log(`✓ Sales collection exists with ${count} documents`);

    if (count > 0) {
      console.log("\n5. Fetching first document...");
      const firstDoc = await salesCollection.findOne({});
      console.log("✓ First document:", JSON.stringify(firstDoc, null, 2).substring(0, 500) + "...");
    }

    console.log("\n All tests passed!");
  } catch (err) {
    console.error("\n Error:", err.message);
    console.error("Full error:", err);
  } finally {
    await client.close();
    console.log("\nConnection closed.");
  }
}

testConnection();
