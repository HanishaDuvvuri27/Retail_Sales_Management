# Architecture Overview

## Backend architecture
- Express server on port 5000 exposes `/api/sales` plus supporting endpoints for tags, payment methods, and categories.
- MongoDB is the primary data source; in-memory dataset is loaded as a fallback sample for resiliency and local dev.
- Service layer (`salesService`) centralizes filtering, sorting, pagination, and summaries to avoid duplicated logic.
- Controller layer parses query params, normalizes types, guards edge cases (age range swap), and delegates to services.
- Utilities handle DB connection and dataset loading/normalization from the provided sales schema.

## Frontend architecture
- React (Vite) single-page app. Dashboard page orchestrates search, filters, sort, pagination, and data fetches.
- Components are small and focused: SearchBar, FilterPanel, SortDropdown, Pagination, SummaryCards, TransactionsTable, CustomSelect, DateRangeFilter, Header.
- API layer (`src/services/api.js`) wraps axios and isolates base URL and payload shapes.
- State is localized to the Dashboard page; derived props flow downward to presentational components.

## Data flow
- User actions (search/filter/sort/paginate) update React state in `Dashboard.jsx`.
- State changes trigger `fetchSales` with normalized query params; backend applies match/sort/paginate and returns `data`, `summary`, and pagination meta.
- Filters and supporting metadata (tags, payment methods, categories) are loaded via dedicated endpoints to keep UI options in sync with data.
- Summary totals (units sold, total amount, discount) are computed server-side over the full filtered result set, not just the current page.

## Folder structure
- `backend/src/controllers`: Request handlers mapping HTTP to service calls.
- `backend/src/services`: Business logic for sales queries, summaries, and distinct option lookups.
- `backend/src/routes`: Express route definitions.
- `backend/src/utils`: DB connection and dataset loading helpers.
- `backend/src/dataStore`: In-memory storage for fallback data.
- `frontend/src/pages`: Page-level containers (Dashboard).
- `frontend/src/components`: Reusable UI pieces (filters, table, summary, etc.).
- `frontend/src/services`: API client wrappers.
- `frontend/src/styles`: Styling for dashboard and shared CSS.
- `docs`: Project documentation (this file).

## Module responsibilities
- `backend/src/index.js`: Bootstraps Express, wires middleware/routes, loads data, starts server.
- `backend/src/routes/salesRoutes.js`: Defines sales-related endpoints.
- `backend/src/controllers/salesController.js`: Validates/parses query params, enforces guardrails, delegates to service.
- `backend/src/services/salesService.js`: Implements search, filtering, sorting, pagination, summaries, and distinct value lookups; handles Mongo primary + memory fallback.
- `backend/src/utils/loadCsv.js`: Loads and normalizes sales data from MongoDB (and can adapt to CSV ingestion).
- `backend/src/utils/db.js`: MongoDB connection helper.
- `frontend/src/pages/Dashboard.jsx`: Coordinates UI state, triggers data fetches, and passes props to children.
- `frontend/src/components/*`: Render search bar, filters, sort dropdown, pagination, summary cards, and transactions table via props.
- `frontend/src/services/api.js`: Axios wrapper for backend endpoints.
