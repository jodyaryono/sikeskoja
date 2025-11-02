"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config");
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    console.log("🔑 Auth Debug:", {
        path: req.path,
        hasAuthHeader: !!authHeader,
        tokenLength: token === null || token === void 0 ? void 0 : token.length,
    });
    if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({ error: "Access token required" });
    }
    jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET, function (err, user) {
        if (err) {
            console.log("❌ Token verification failed:", err.message);
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        console.log("✅ Token verified, user:", user);
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
var requireRole = function (roles) {
    return function (req, res, next) {
        var _a;
        console.log("🔐 Role Check:", {
            requiredRoles: roles,
            userRole: (_a = req.user) === null || _a === void 0 ? void 0 : _a.role,
            hasUser: !!req.user,
        });
        if (!req.user) {
            console.log("❌ No user in request");
            return res.status(401).json({ error: "Authentication required" });
        }
        if (!roles.includes(req.user.role)) {
            console.log("❌ Insufficient permissions:", {
                required: roles,
                actual: req.user.role,
            });
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        console.log("✅ Role check passed");
        next();
    };
};
exports.requireRole = requireRole;
