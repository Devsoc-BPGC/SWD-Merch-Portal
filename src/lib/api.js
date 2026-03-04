import axios from "axios";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5s timeout
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("swd_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        }
      } catch (err) {
        console.error("Failed to parse stored auth data:", err.message);
        localStorage.removeItem("swd_user");
      }
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        error.userMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.message === "Network Error") {
        error.userMessage = "Network error. Please check your internet connection.";
      } else {
        error.userMessage = "An unexpected network error occurred. Please try again.";
      }
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        error.userMessage = data?.message || "Invalid request. Please check your input.";
        break;
      case 401:
        error.userMessage = data?.message || "Session expired. Please log in again.";
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          localStorage.removeItem("swd_user");
          window.location.href = "/login";
        }
        break;
      case 403:
        error.userMessage = data?.message || "You do not have permission to perform this action.";
        break;
      case 404:
        error.userMessage = data?.message || "The requested resource was not found.";
        break;
      case 409:
        error.userMessage = data?.message || "A conflict occurred. The resource may already exist.";
        break;
      case 422:
        error.userMessage = data?.message || "Validation failed. Please check your input.";
        break;
      case 429:
        error.userMessage = "Too many requests. Please wait a moment and try again.";
        break;
      case 500:
        error.userMessage = data?.message || "Internal server error. Please try again later.";
        break;
      case 502:
        error.userMessage = "Server is temporarily unavailable. Please try again later.";
        break;
      case 503:
        error.userMessage = "Service unavailable. Please try again later.";
        break;
      default:
        error.userMessage = data?.message || `Unexpected error (${status}). Please try again.`;
    }

    if (data?.errors) {
      error.validationErrors = data.errors;
    }

    console.error(`API error [${status}]:`, data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
