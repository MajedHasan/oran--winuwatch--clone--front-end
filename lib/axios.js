import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // change to your backend URL in production
  withCredentials: true,
});

export default api;
