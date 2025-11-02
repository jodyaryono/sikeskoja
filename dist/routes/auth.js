"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// POST /api/auth/register - Register new user
router.post("/register", validation_1.validateRegister, authController_1.register);
// POST /api/auth/login - User login
router.post("/login", validation_1.validateLogin, authController_1.login);
// POST /api/auth/refresh - Refresh access token
router.post("/refresh", authController_1.refreshToken);
// POST /api/auth/logout - User logout
router.post("/logout", auth_1.authenticateToken, authController_1.logout);
// GET /api/auth/profile - Get user profile
router.get("/profile", auth_1.authenticateToken, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map