"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var otpAuthController_1 = require("../controllers/otpAuthController");
var router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/otp/request
 * @desc    Request OTP code via WhatsApp
 * @access  Public
 */
router.post("/request", otpAuthController_1.requestOTP);
/**
 * @route   POST /api/auth/otp/verify
 * @desc    Verify OTP and login
 * @access  Public
 */
router.post("/verify", otpAuthController_1.verifyOTP);
/**
 * @route   POST /api/auth/otp/resend
 * @desc    Resend OTP code
 * @access  Public
 */
router.post("/resend", otpAuthController_1.resendOTP);
/**
 * @route   GET /api/auth/otp/status
 * @desc    Check WhatsApp device status
 * @access  Public
 */
router.get("/status", otpAuthController_1.checkDeviceStatus);
exports.default = router;
