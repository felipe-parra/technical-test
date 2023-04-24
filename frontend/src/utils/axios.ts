import axios from "axios";

export const baseAxios = axios.create({
  baseURL: "http://0.0.0.0:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

baseAxios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
