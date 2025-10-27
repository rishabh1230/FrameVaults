// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // your backend URL
  withCredentials: true, // send cookies/JWTs across domains
});

export default api;
