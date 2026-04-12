import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// 🔥 ALWAYS attach token automatically (NO EXCEPTIONS)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN BEING SENT:", token); // DEBUG

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;