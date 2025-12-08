// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// Main function used in Dashboard.jsx
export const fetchSales = async (params) => {
  const response = await api.get("/sales", { params });
  return response.data; // { data, page, pageSize, totalItems, totalPages, summary }
};

export default api;
