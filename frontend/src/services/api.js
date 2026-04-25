import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

// 🔥 AUTO HANDLE TOKEN EXPIRE
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default API;