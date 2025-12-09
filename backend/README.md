Backend setup
---------------

This backend now loads sales data from MongoDB instead of the local CSV.

Environment
- `MONGODB_URI` (optional): MongoDB connection string. If not provided, the code falls back to the following default connection string embedded for convenience during development:

```
mongodb+srv://Hanisha:Hanisha@cluster0.ot4pt9v.mongodb.net/sales_db?retryWrites=true&w=majority&appName=Cluster0
```

How it works
- On startup `src/index.js` calls `loadSalesData()` which now queries the `sales` collection in the configured MongoDB and populates the in-memory data store used by the API. This preserves the existing API behavior while switching the data source.

Commands
- Install dependencies:

```powershell
cd backend
npm install
```

- Start in dev mode:

```powershell
npm run dev
```

