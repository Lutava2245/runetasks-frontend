import { getToken, isAuthenticated } from "@/src/utils/auth";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && isAuthenticated()) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});