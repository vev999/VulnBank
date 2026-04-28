import axios from "axios";

// VULN: A07 — JWT przechowywany w localStorage (podatny na XSS)
const API_URL = "/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("vulnbank_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("vulnbank_token");
      localStorage.removeItem("vulnbank_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
