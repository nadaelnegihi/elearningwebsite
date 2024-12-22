// utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // Your backend API URL
  withCredentials: true, // Enable cookies
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = document.cookie
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    console.log("Token from cookies (Frontend):", token); // Debug token in frontend
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


export default axiosInstance;
