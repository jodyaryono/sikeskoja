"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usersController_1 = require("../controllers/usersController");
var auth_1 = require("../middleware/auth");
var validation_1 = require("../middleware/validation");
var router = (0, express_1.Router)();
// Apply authentication to all routes
router.use(auth_1.authenticateToken);
// GET /api/users - Get paginated users (Admin/SuperAdmin only)
router.get("/", (0, auth_1.requireRole)(["ADMIN", "SUPERADMIN"]), usersController_1.getUsers);
// GET /api/users/statistics - Get user statistics (Admin/SuperAdmin only)
router.get("/statistics", (0, auth_1.requireRole)(["ADMIN", "SUPERADMIN"]), usersController_1.getUserStatistics);
// POST /api/users/admin - Create new admin (Admin/SuperAdmin only)
router.post("/admin", (0, auth_1.requireRole)(["ADMIN", "SUPERADMIN"]), usersController_1.createAdmin);
// GET /api/users/:id - Get specific user
router.get("/:id", usersController_1.getUserById);
// PUT /api/users/:id - Update user
router.put("/:id", validation_1.validateUserUpdate, usersController_1.updateUser);
// DELETE /api/users/:id - Delete user (Admin/SuperAdmin only)
router.delete("/:id", (0, auth_1.requireRole)(["ADMIN", "SUPERADMIN"]), usersController_1.deleteUser);
exports.default = router;
