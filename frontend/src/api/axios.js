import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.warn("VITE_API_URL is not set!");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;