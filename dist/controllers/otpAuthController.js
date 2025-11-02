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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDeviceStatus = exports.resendOTP = exports.verifyOTP = exports.requestOTP = void 0;
var client_1 = require("@prisma/client");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config");
var whatsappService_1 = __importDefault(require("../services/whatsappService"));
var prisma = new client_1.PrismaClient();
/**
 * Generate random OTP code
 * For development: returns 123456
 * For production: generates random OTP
 */
function generateOTP() {
    // Development mode - always return 123456 for easy testing
    if (process.env.NODE_ENV !== "production") {
        return "123456";
    }
    // Production mode - generate random OTP
    var length = config_1.config.OTP_LENGTH;
    var digits = "0123456789";
    var otp = "";
    for (var i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}
/**
 * Request OTP - Send OTP code to user's phone
 * POST /api/auth/otp/request
 * Body: { phone: string }
 */
var requestOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phone, user, otpCode, expiresAt, whatsappResponse, otpSession, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                phone = req.body.phone;
                if (!phone) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: "Nomor telepon wajib diisi",
                        })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { phone: phone },
                        include: {
                            profile: true,
                        },
                    })];
            case 1:
                user = _c.sent();
                if (!user || !user.isActive) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: "Nomor telepon tidak terdaftar atau akun tidak aktif",
                        })];
                }
                otpCode = generateOTP();
                expiresAt = new Date();
                expiresAt.setMinutes(expiresAt.getMinutes() + config_1.config.OTP_EXPIRES_IN);
                // Delete old OTP sessions for this user
                return [4 /*yield*/, prisma.oTPSession.deleteMany({
                        where: {
                            userId: user.id,
                            isVerified: false,
                        },
                    })];
            case 2:
                // Delete old OTP sessions for this user
                _c.sent();
                return [4 /*yield*/, whatsappService_1.default.sendOTP(phone, otpCode, (_a = user.profile) === null || _a === void 0 ? void 0 : _a.fullName)];
            case 3:
                whatsappResponse = _c.sent();
                if (!whatsappResponse.status) {
                    return [2 /*return*/, res.status(500).json({
                            success: false,
                            message: "Gagal mengirim OTP via WhatsApp. Perangkat tidak terhubung.",
                            details: whatsappResponse.message,
                        })];
                }
                return [4 /*yield*/, prisma.oTPSession.create({
                        data: {
                            userId: user.id,
                            phone: phone,
                            otpCode: otpCode,
                            messageId: whatsappResponse.data && !Array.isArray(whatsappResponse.data)
                                ? (_b = whatsappResponse.data.id) === null || _b === void 0 ? void 0 : _b.toString()
                                : undefined,
                            expiresAt: expiresAt,
                        },
                    })];
            case 4:
                otpSession = _c.sent();
                res.json({
                    success: true,
                    message: "Kode OTP telah dikirim ke WhatsApp Anda",
                    data: {
                        sessionId: otpSession.id,
                        expiresAt: otpSession.expiresAt,
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                console.error("Request OTP Error:", error_1);
                res.status(500).json({
                    success: false,
                    message: "Terjadi kesalahan saat meminta OTP",
                    error: error_1.message,
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.requestOTP = requestOTP;
/**
 * Verify OTP - Validate OTP and login user
 * POST /api/auth/otp/verify
 * Body: { phone: string, otpCode: string }
 */
var verifyOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phone, otpCode, otpSession, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, phone = _a.phone, otpCode = _a.otpCode;
                if (!phone || !otpCode) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: "Nomor telepon dan kode OTP wajib diisi",
                        })];
                }
                return [4 /*yield*/, prisma.oTPSession.findFirst({
                        where: {
                            phone: phone,
                            otpCode: otpCode,
                            isVerified: false,
                            expiresAt: {
                                gte: new Date(),
                            },
                        },
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    })];
            case 1:
                otpSession = _b.sent();
                if (!otpSession) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: "Kode OTP tidak valid atau sudah kadaluarsa",
                        })];
                }
                // Mark OTP as verified
                return [4 /*yield*/, prisma.oTPSession.update({
                        where: { id: otpSession.id },
                        data: { isVerified: true },
                    })];
            case 2:
                // Mark OTP as verified
                _b.sent();
                token = jsonwebtoken_1.default.sign({
                    userId: otpSession.user.id,
                    email: otpSession.user.email,
                    role: otpSession.user.role,
                }, config_1.config.JWT_SECRET);
                // Update user last login
                return [4 /*yield*/, prisma.user.update({
                        where: { id: otpSession.user.id },
                        data: { updatedAt: new Date() },
                    })];
            case 3:
                // Update user last login
                _b.sent();
                res.json({
                    success: true,
                    message: "Login berhasil",
                    data: {
                        token: token,
                        user: {
                            id: otpSession.user.id,
                            email: otpSession.user.email,
                            username: otpSession.user.username,
                            phone: otpSession.user.phone,
                            role: otpSession.user.role,
                            profile: otpSession.user.profile,
                        },
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error("Verify OTP Error:", error_2);
                res.status(500).json({
                    success: false,
                    message: "Terjadi kesalahan saat verifikasi OTP",
                    error: error_2.message,
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.verifyOTP = verifyOTP;
/**
 * Resend OTP - Send new OTP code
 * POST /api/auth/otp/resend
 * Body: { phone: string }
 */
var resendOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Same as requestOTP
        return [2 /*return*/, (0, exports.requestOTP)(req, res)];
    });
}); };
exports.resendOTP = resendOTP;
/**
 * Check WhatsApp Device Status
 * GET /api/auth/otp/status
 */
var checkDeviceStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isConnected, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, whatsappService_1.default.checkDeviceStatus()];
            case 1:
                isConnected = _a.sent();
                res.json({
                    success: true,
                    data: {
                        connected: isConnected,
                        deviceId: config_1.config.WHATSAPP_DEVICE_ID,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({
                    success: false,
                    message: "Gagal memeriksa status perangkat",
                    error: error_3.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.checkDeviceStatus = checkDeviceStatus;
