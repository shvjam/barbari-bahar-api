import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "/api", // The base URL for all API requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    // Check for tokens in localStorage in a specific order of priority
    const adminToken = localStorage.getItem("admin_token");
    const driverToken = localStorage.getItem("driver_token");
    const customerToken = localStorage.getItem("customer_token");

    let token = null;
    if (adminToken) {
      token = adminToken;
    } else if (driverToken) {
      token = driverToken;
    } else if (customerToken) {
      token = customerToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling (optional but recommended)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle global errors here, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
      // For example, redirect to a login page
      // window.location.href = '/login';
      console.error("Authentication Error: Please log in.");
    }
    return Promise.reject(error);
  }
);

export default api;
