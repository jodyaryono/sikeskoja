import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStatistics,
} from "../controllers/usersController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validateUserUpdate } from "../middleware/validation";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/users - Get paginated users (Admin only)
router.get("/", requireRole(["ADMIN"]), getUsers);

// GET /api/users/statistics - Get user statistics (Admin only)
router.get("/statistics", requireRole(["ADMIN"]), getUserStatistics);

// GET /api/users/:id - Get specific user
router.get("/:id", getUserById);

// PUT /api/users/:id - Update user
router.put("/:id", validateUserUpdate, updateUser);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete("/:id", requireRole(["ADMIN"]), deleteUser);

export default router;
