"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const config_1 = require("../config");
const register = async (req, res) => {
    try {
        const { email, username, password, fullName, phone } = req.body;
        // Check if user already exists
        const existingUser = await database_1.default.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists",
                message: "Email or username is already taken",
            });
        }
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user with profile
        const user = await database_1.default.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: "USER",
                profile: {
                    create: {
                        fullName,
                        phone,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, config_1.config.JWT_SECRET);
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to register user",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user with profile
        const user = await database_1.default.user.findUnique({
            where: { email },
            include: {
                profile: true,
            },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                error: "Authentication failed",
                message: "Invalid credentials or account is inactive",
            });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Authentication failed",
                message: "Invalid credentials",
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, config_1.config.JWT_SECRET);
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: "Login successful",
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to login",
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                error: "Refresh token required",
            });
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.JWT_SECRET);
        // Find user
        const user = await database_1.default.user.findUnique({
            where: { id: decoded.id },
            include: { profile: true },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                error: "Invalid refresh token",
            });
        }
        // Generate new token
        const newToken = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, config_1.config.JWT_SECRET);
        res.json({
            token: newToken,
        });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        res.status(401).json({
            error: "Invalid refresh token",
        });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    // In a real implementation, you might want to blacklist the token
    res.json({
        message: "Logout successful",
    });
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        const user = await database_1.default.user.findUnique({
            where: { id: req.user.id },
            include: {
                profile: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        res.json({
            user,
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to get user profile",
        });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map