const http = require("http");

const testCases = [
  { name: "No filter", url: "http://localhost:5000/api/sales?page=1&pageSize=5" },
  { name: "Region filter (East)", url: "http://localhost:5000/api/sales?regions=East&page=1&pageSize=5" },
  { name: "Gender filter (Male)", url: "http://localhost:5000/api/sales?genders=Male&page=1&pageSize=5" },
  { name: "Category filter (Beauty)", url: "http://localhost:5000/api/sales?categories=Beauty&page=1&pageSize=5" },
];

async function testAPI(testName, url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          console.log(`\n✓ ${testName}`);
          console.log(`  Total Items: ${json.totalItems}`);
          console.log(`  Page: ${json.page} / ${json.totalPages}`);
          console.log(`  Records Returned: ${json.data.length}`);
          if (json.summary) {
            console.log(`  Summary - Units Sold: ${json.summary.totalUnitsSold}, Amount: ${json.summary.totalAmount}`);
          }
        } catch (err) {
          console.log(`\n ${testName}: ${err.message}`);
          console.log(`  Response: ${data.substring(0, 200)}`);
        }
        resolve();
      });
    }).on("error", (err) => {
      console.log(`\n ${testName}: Connection error - ${err.message}`);
      resolve();
    });
  });
}

async function runTests() {
  console.log("Testing Retail Sales API...\n");
  for (const test of testCases) {
    await testAPI(test.name, test.url);
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log("\n Test suite completed");
}

runTests();
