const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI ||
  "mongodb+srv://Hanisha:Hanisha@cluster0.ot4pt9v.mongodb.net/?appName=Cluster0";

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

let _db = null;
let _connecting = null;

async function connectToDb() {
  // If already connected, return cached db
  if (_db) return _db;
  
  // If currently connecting, wait for that promise
  if (_connecting) return await _connecting;

  // Start connection and cache the promise to prevent multiple simultaneous connections
  _connecting = (async () => {
    try {
      await client.connect();
      console.log("✓ MongoDB connected successfully");
      _db = client.db("sales_db");
      return _db;
    } finally {
      _connecting = null;
    }
  })();

  return await _connecting;
}

function getDb() {
  if (!_db) throw new Error("Database not connected. Call connectToDb() first.");
  return _db;
}

module.exports = {
  connectToDb,
  getDb,
  client,
};

