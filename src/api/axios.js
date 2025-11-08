import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// global response handler: if token expired or unauthorized, force logout and redirect
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      Swal.fire({
        icon: "warning",
        title: "Session expired",
        text: "Your session has expired. Please login again.",
        confirmButtonText: "Go to Login",
      }).then(() => {
        // redirect to login page
        window.location.href = "/";
      });
    }
    return Promise.reject(error);
  }
);

export default api;
