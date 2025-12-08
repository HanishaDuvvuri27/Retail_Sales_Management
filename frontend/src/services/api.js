import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// API helper used by the frontend
export const fetchSales = async (params) => {
  const response = await api.get("/sales", { params });
  return response.data; // { data, page, pageSize, totalItems, totalPages, summary }
};

export default api;
