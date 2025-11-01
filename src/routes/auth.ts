import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  getProfile,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";
import { validateLogin, validateRegister } from "../middleware/validation";

const router = Router();

// POST /api/auth/register - Register new user
router.post("/register", validateRegister, register);

// POST /api/auth/login - User login
router.post("/login", validateLogin, login);

// POST /api/auth/refresh - Refresh access token
router.post("/refresh", refreshToken);

// POST /api/auth/logout - User logout
router.post("/logout", authenticateToken, logout);

// GET /api/auth/profile - Get user profile
router.get("/profile", authenticateToken, getProfile);

export default router;
