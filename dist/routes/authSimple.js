"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var database_1 = __importDefault(require("../config/database"));
var config_1 = require("../config");
var router = (0, express_1.Router)();
// Register endpoint
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, username, password, fullName, phone, existingUser, saltRounds, hashedPassword, user, token, _, userWithoutPassword, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, username = _a.username, password = _a.password, fullName = _a.fullName, phone = _a.phone;
                return [4 /*yield*/, database_1.default.user.findFirst({
                        where: {
                            OR: [{ email: email }, { username: username }],
                        },
                    })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({
                            error: "User already exists",
                            message: "Email or username is already taken",
                        })];
                }
                saltRounds = 12;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, saltRounds)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, database_1.default.user.create({
                        data: {
                            email: email,
                            username: username,
                            password: hashedPassword,
                            phone: phone || "0812".concat(Date.now().toString().slice(-8)), // Generate phone if not provided
                            role: "USER",
                            profile: {
                                create: {
                                    fullName: fullName,
                                    phone: phone,
                                },
                            },
                        },
                        include: {
                            profile: true,
                        },
                    })];
            case 3:
                user = _b.sent();
                token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }, config_1.config.JWT_SECRET);
                _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                res.status(201).json({
                    message: "User registered successfully",
                    user: userWithoutPassword,
                    token: token,
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error("Register error:", error_1);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to register user",
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Login endpoint
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, token, _, userWithoutPassword, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { email: email },
                        include: {
                            profile: true,
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user || !user.isActive) {
                    return [2 /*return*/, res.status(401).json({
                            error: "Authentication failed",
                            message: "Invalid credentials or account is inactive",
                        })];
                }
                // Check password
                if (!user.password) {
                    return [2 /*return*/, res.status(401).json({
                            error: "Authentication failed",
                            message: "This account uses OTP login. Please use OTP authentication.",
                        })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(401).json({
                            error: "Authentication failed",
                            message: "Invalid credentials",
                        })];
                }
                token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }, config_1.config.JWT_SECRET);
                _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                res.json({
                    message: "Login successful",
                    user: userWithoutPassword,
                    token: token,
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error("Login error:", error_2);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to login",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Health check for auth
router.get("/health", function (req, res) {
    res.json({
        message: "Auth service is healthy",
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
