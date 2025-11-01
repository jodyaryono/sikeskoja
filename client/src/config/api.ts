// API Configuration
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api" // Relative path for production
    : process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export default API_BASE_URL;
