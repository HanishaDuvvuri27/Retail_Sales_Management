const express = require("express");
const app = express();
const PORT = 5000;

console.log("Starting simple test server...");

app.get("/test", (req, res) => {
  console.log("Got request to /test");
  res.json({ ok: true });
});

app.listen(PORT, "localhost", () => {
  console.log(`Test server listening on port ${PORT}`);
});

setTimeout(() => {
  console.log("Test server still running...");
}, 5000);
