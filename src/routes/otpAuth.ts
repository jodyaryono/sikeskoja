import { Router } from "express";
import {
  requestOTP,
  verifyOTP,
  resendOTP,
  checkDeviceStatus,
} from "../controllers/otpAuthController";

const router = Router();

/**
 * @route   POST /api/auth/otp/request
 * @desc    Request OTP code via WhatsApp
 * @access  Public
 */
router.post("/request", requestOTP);

/**
 * @route   POST /api/auth/otp/verify
 * @desc    Verify OTP and login
 * @access  Public
 */
router.post("/verify", verifyOTP);

/**
 * @route   POST /api/auth/otp/resend
 * @desc    Resend OTP code
 * @access  Public
 */
router.post("/resend", resendOTP);

/**
 * @route   GET /api/auth/otp/status
 * @desc    Check WhatsApp device status
 * @access  Public
 */
router.get("/status", checkDeviceStatus);

export default router;
