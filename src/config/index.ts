import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // WhatsApp OTP Configuration
  WHATSAPP_DEVICE_ID:
    process.env.WHATSAPP_DEVICE_ID || "59087f966f4f8cc3385569ef6481cc29",
  OTP_EXPIRES_IN: parseInt(process.env.OTP_EXPIRES_IN || "5"), // minutes
  OTP_LENGTH: parseInt(process.env.OTP_LENGTH || "6"),

  // Redis Configuration
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  // Application Configuration
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:5000/api",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  // Pagination Configuration
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || "20"),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || "100"),

  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || "./uploads",

  // Performance Configuration
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
};
