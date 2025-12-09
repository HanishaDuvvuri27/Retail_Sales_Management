import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://retail-sales-management-2.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// API helper 
export const fetchSales = async (params) => {
  const response = await api.get("/sales", { params });
  return response.data; // { data, page, pageSize, totalItems, totalPages, summary }
};

export const fetchTags = async (params) => {
  const response = await api.get("/sales/tags", { params });
  return response.data; // tags
};

export const fetchPaymentMethods = async () => {
  const response = await api.get("/sales/payment-methods");
  return response.data; //  paymentMethods
};

export const fetchCategories = async () => {
  const response = await api.get("/sales/categories");
  return response.data; // categories
};

export default api;
