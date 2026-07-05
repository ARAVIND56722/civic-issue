import axios from "axios";

const api = axios.create({ baseURL: "https://civic-issue-h6x8.onrender.com/api", timeout: 15000 });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
