import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8082/api";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// add token from localStorage before each request
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// auto-handle 401 globally (redirect to login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login?sessionExpired=1";
    }
    return Promise.reject(err);
  }
);

export default api;
