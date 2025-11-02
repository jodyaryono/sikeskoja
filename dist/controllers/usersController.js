"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createAdmin = exports.getUserStatistics = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var database_1 = __importDefault(require("../config/database"));
var config_1 = require("../config");
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, search, role, isActive, skip, where, _a, users, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                page = parseInt(req.query.page) || 1;
                limit = Math.min(parseInt(req.query.limit) || config_1.config.DEFAULT_PAGE_SIZE, config_1.config.MAX_PAGE_SIZE);
                search = req.query.search;
                role = req.query.role;
                isActive = req.query.isActive;
                skip = (page - 1) * limit;
                where = {};
                if (search) {
                    where.OR = [
                        { email: { contains: search, mode: "insensitive" } },
                        { username: { contains: search, mode: "insensitive" } },
                        { profile: { fullName: { contains: search, mode: "insensitive" } } },
                    ];
                }
                if (role)
                    where.role = role;
                if (isActive !== undefined)
                    where.isActive = isActive === "true";
                return [4 /*yield*/, Promise.all([
                        database_1.default.user.findMany({
                            where: where,
                            skip: skip,
                            take: limit,
                            include: {
                                profile: true,
                            },
                            orderBy: { createdAt: "desc" },
                        }),
                        database_1.default.user.count({ where: where }),
                    ])];
            case 1:
                _a = _b.sent(), users = _a[0], total = _a[1];
                res.json({
                    users: users,
                    pagination: {
                        page: page,
                        limit: limit,
                        total: total,
                        pages: Math.ceil(total / limit),
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Get users error:", error_1);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to fetch users",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                // Check if user is requesting their own data or is admin
                if (req.user.id !== id && req.user.role !== "ADMIN") {
                    return [2 /*return*/, res.status(403).json({
                            error: "Permission denied",
                            message: "You can only access your own profile",
                        })];
                }
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { id: id },
                        include: {
                            profile: true,
                            createdRecords: {
                                take: 10,
                                orderBy: { createdAt: "desc" },
                                include: {
                                    patient: {
                                        select: {
                                            fullName: true,
                                            nik: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            error: "User not found",
                        })];
                }
                res.json({ user: user });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Get user by ID error:", error_2);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to fetch user",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserById = getUserById;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateData, existingUser, fullName, phone, address, avatar, userData_1, profileData_1, emailExists, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                updateData = req.body;
                // Check if user is updating their own data or is admin
                if (req.user.id !== id && req.user.role !== "ADMIN") {
                    return [2 /*return*/, res.status(403).json({
                            error: "Permission denied",
                            message: "You can only update your own profile",
                        })];
                }
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { id: id },
                        include: { profile: true },
                    })];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({
                            error: "User not found",
                        })];
                }
                fullName = updateData.fullName, phone = updateData.phone, address = updateData.address, avatar = updateData.avatar, userData_1 = __rest(updateData, ["fullName", "phone", "address", "avatar"]);
                profileData_1 = { fullName: fullName, phone: phone, address: address, avatar: avatar };
                // Remove undefined values
                Object.keys(userData_1).forEach(function (key) {
                    if (userData_1[key] === undefined)
                        delete userData_1[key];
                });
                Object.keys(profileData_1).forEach(function (key) {
                    if (profileData_1[key] === undefined)
                        delete profileData_1[key];
                });
                // Only admin can update role and isActive
                if (req.user.role !== "ADMIN") {
                    delete userData_1.role;
                    delete userData_1.isActive;
                }
                if (!(userData_1.email && userData_1.email !== existingUser.email)) return [3 /*break*/, 3];
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { email: userData_1.email },
                    })];
            case 2:
                emailExists = _a.sent();
                if (emailExists) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Email already exists",
                            message: "A user with this email already exists",
                        })];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, database_1.default.user.update({
                    where: { id: id },
                    data: __assign(__assign({}, userData_1), { profile: Object.keys(profileData_1).length > 0
                            ? {
                                upsert: {
                                    create: profileData_1,
                                    update: profileData_1,
                                },
                            }
                            : undefined }),
                    include: {
                        profile: true,
                    },
                })];
            case 4:
                user = _a.sent();
                res.json({
                    message: "User updated successfully",
                    user: user,
                });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error("Update user error:", error_3);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to update user",
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingUser, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({
                            error: "User not found",
                        })];
                }
                return [4 /*yield*/, database_1.default.user.update({
                        where: { id: id },
                        data: { isActive: false },
                    })];
            case 2:
                user = _a.sent();
                res.json({
                    message: "User deleted successfully",
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        isActive: user.isActive,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Delete user error:", error_4);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to delete user",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var getUserStatistics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, totalUsers, activeUsers, adminUsers, doctorUsers, nurseUsers, staffUsers, recentUsers, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([
                        database_1.default.user.count(),
                        database_1.default.user.count({ where: { isActive: true } }),
                        database_1.default.user.count({ where: { role: "ADMIN", isActive: true } }),
                        database_1.default.user.count({ where: { role: "DOCTOR", isActive: true } }),
                        database_1.default.user.count({ where: { role: "NURSE", isActive: true } }),
                        database_1.default.user.count({ where: { role: "STAFF", isActive: true } }),
                        database_1.default.user.count({
                            where: {
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                                },
                            },
                        }),
                    ])];
            case 1:
                _a = _b.sent(), totalUsers = _a[0], activeUsers = _a[1], adminUsers = _a[2], doctorUsers = _a[3], nurseUsers = _a[4], staffUsers = _a[5], recentUsers = _a[6];
                res.json({
                    statistics: {
                        totalUsers: totalUsers,
                        activeUsers: activeUsers,
                        inactiveUsers: totalUsers - activeUsers,
                        roleDistribution: {
                            admin: adminUsers,
                            doctor: doctorUsers,
                            nurse: nurseUsers,
                            staff: staffUsers,
                            user: activeUsers - (adminUsers + doctorUsers + nurseUsers + staffUsers),
                        },
                        recentUsers: recentUsers,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                console.error("Get user statistics error:", error_5);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to fetch user statistics",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserStatistics = getUserStatistics;
// Create new admin - only accessible by existing admins
var createAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phone, email, username, password, fullName, phoneExists, emailExists, usernameExists, saltRounds, hashedPassword, newAdmin, _, adminWithoutPassword, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, phone = _a.phone, email = _a.email, username = _a.username, password = _a.password, fullName = _a.fullName;
                // Validate required fields
                if (!phone) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Phone required",
                            message: "Phone number is required",
                        })];
                }
                if (!email || !username || !password || !fullName) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Missing fields",
                            message: "Email, username, password, and full name are required",
                        })];
                }
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { phone: phone },
                    })];
            case 1:
                phoneExists = _b.sent();
                if (phoneExists) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Phone already exists",
                            message: "A user with this phone number already exists",
                        })];
                }
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { email: email },
                    })];
            case 2:
                emailExists = _b.sent();
                if (emailExists) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Email already exists",
                            message: "A user with this email already exists",
                        })];
                }
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { username: username },
                    })];
            case 3:
                usernameExists = _b.sent();
                if (usernameExists) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Username already exists",
                            message: "A user with this username already exists",
                        })];
                }
                saltRounds = 12;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, saltRounds)];
            case 4:
                hashedPassword = _b.sent();
                return [4 /*yield*/, database_1.default.user.create({
                        data: {
                            email: email,
                            username: username,
                            phone: phone,
                            password: hashedPassword,
                            role: "ADMIN",
                            isActive: true,
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
            case 5:
                newAdmin = _b.sent();
                _ = newAdmin.password, adminWithoutPassword = __rest(newAdmin, ["password"]);
                res.status(201).json({
                    message: "Admin created successfully",
                    admin: adminWithoutPassword,
                });
                return [3 /*break*/, 7];
            case 6:
                error_6 = _b.sent();
                console.error("Create admin error:", error_6);
                res.status(500).json({
                    error: "Internal Server Error",
                    message: "Failed to create admin",
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createAdmin = createAdmin;
