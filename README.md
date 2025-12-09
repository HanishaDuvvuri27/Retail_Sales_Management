# Retail Sales Management System

## Overview
Full-stack dashboard for exploring retail sales data. Supports search across customer name/phone, multi-dimensional filtering, server-side sorting, and paginated browsing. Backend computes dataset-wide summaries (units sold, total amount, discount) for any filtered view. Built to mirror production-style data handling and UI interactions.

## Tech Stack
- Backend: Node.js, Express, MongoDB (with in-memory fallback sample)
- Frontend: React (Vite), axios
- Tooling: ESLint

## Search Implementation Summary
- Case-insensitive search on customer name and phone.
- Applied alongside filters, sort, and pagination via query params.

## Filter Implementation Summary
- Multi-select/range-ready filters: region, gender, age range, product category, tags, payment method, date range.
- State stored in the Dashboard and sent as normalized query params.

## Sorting Implementation Summary
- Sort by date (default desc), quantity, or customer name.
- Sort order carried in query params and applied server-side.

## Pagination Implementation Summary
- Page size 10 with next/previous controls.
- Pagination respects active search, filters, and sorting.

## Setup Instructions
1) Backend
   - `cd backend`
   - `npm install`
   - Ensure MongoDB connection is configured in `src/utils/db.js`
   - `npm start`
2) Frontend
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3) App runs with backend at `http://localhost:5000` and frontend via Vite dev server output.
