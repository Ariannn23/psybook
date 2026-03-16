import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
if (import.meta.env.PROD && !apiUrl) {
  throw new Error("VITE_API_URL es requerida en producción");
}

const api = axios.create({
  baseURL: apiUrl || "http://localhost:4001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  },
);

export default api;
