import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStatistics,
  createAdmin,
} from "../controllers/usersController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validateUserUpdate } from "../middleware/validation";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/users - Get paginated users (Admin/SuperAdmin only)
router.get("/", requireRole(["ADMIN", "SUPERADMIN"]), getUsers);

// GET /api/users/statistics - Get user statistics (Admin/SuperAdmin only)
router.get("/statistics", requireRole(["ADMIN", "SUPERADMIN"]), getUserStatistics);

// POST /api/users/admin - Create new admin (Admin/SuperAdmin only)
router.post("/admin", requireRole(["ADMIN", "SUPERADMIN"]), createAdmin);

// GET /api/users/:id - Get specific user
router.get("/:id", getUserById);

// PUT /api/users/:id - Update user
router.put("/:id", validateUserUpdate, updateUser);

// DELETE /api/users/:id - Delete user (Admin/SuperAdmin only)
router.delete("/:id", requireRole(["ADMIN", "SUPERADMIN"]), deleteUser);

export default router;
