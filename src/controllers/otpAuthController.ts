import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { config } from "../config";
import whatsappService from "../services/whatsappService";

const prisma = new PrismaClient();

/**
 * Generate random OTP code
 * For development: returns 123456
 * For production: generates random OTP
 */
function generateOTP(): string {
  // Development mode - always return 123456 for easy testing
  if (process.env.NODE_ENV !== "production") {
    return "123456";
  }

  // Production mode - generate random OTP
  const length = config.OTP_LENGTH;
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

/**
 * Request OTP - Send OTP code to user's phone
 * POST /api/auth/otp/request
 * Body: { phone: string }
 */
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Nomor telepon wajib diisi",
      });
    }

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        profile: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "Nomor telepon tidak terdaftar atau akun tidak aktif",
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + config.OTP_EXPIRES_IN);

    // Delete old OTP sessions for this user
    await prisma.oTPSession.deleteMany({
      where: {
        userId: user.id,
        isVerified: false,
      },
    });

    // Send OTP via WhatsApp
    const whatsappResponse = await whatsappService.sendOTP(
      phone,
      otpCode,
      user.profile?.fullName
    );

    if (!whatsappResponse.status) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengirim OTP via WhatsApp. Perangkat tidak terhubung.",
        details: whatsappResponse.message,
      });
    }

    // Create OTP session
    const otpSession = await prisma.oTPSession.create({
      data: {
        userId: user.id,
        phone,
        otpCode,
        messageId:
          whatsappResponse.data && !Array.isArray(whatsappResponse.data)
            ? whatsappResponse.data.id?.toString()
            : undefined,
        expiresAt,
      },
    });

    res.json({
      success: true,
      message: "Kode OTP telah dikirim ke WhatsApp Anda",
      data: {
        sessionId: otpSession.id,
        expiresAt: otpSession.expiresAt,
      },
    });
  } catch (error: any) {
    console.error("Request OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat meminta OTP",
      error: error.message,
    });
  }
};

/**
 * Verify OTP - Validate OTP and login user
 * POST /api/auth/otp/verify
 * Body: { phone: string, otpCode: string }
 */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otpCode } = req.body;

    if (!phone || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Nomor telepon dan kode OTP wajib diisi",
      });
    }

    // Find OTP session
    const otpSession = await prisma.oTPSession.findFirst({
      where: {
        phone,
        otpCode,
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
    });

    if (!otpSession) {
      return res.status(400).json({
        success: false,
        message: "Kode OTP tidak valid atau sudah kadaluarsa",
      });
    }

    // Mark OTP as verified
    await prisma.oTPSession.update({
      where: { id: otpSession.id },
      data: { isVerified: true },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: otpSession.user.id,
        email: otpSession.user.email,
        role: otpSession.user.role,
      },
      config.JWT_SECRET as string
    ) as string;

    // Update user last login
    await prisma.user.update({
      where: { id: otpSession.user.id },
      data: { updatedAt: new Date() },
    });

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
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
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi OTP",
      error: error.message,
    });
  }
};

/**
 * Resend OTP - Send new OTP code
 * POST /api/auth/otp/resend
 * Body: { phone: string }
 */
export const resendOTP = async (req: Request, res: Response) => {
  // Same as requestOTP
  return requestOTP(req, res);
};

/**
 * Check WhatsApp Device Status
 * GET /api/auth/otp/status
 */
export const checkDeviceStatus = async (req: Request, res: Response) => {
  try {
    const isConnected = await whatsappService.checkDeviceStatus();

    res.json({
      success: true,
      data: {
        connected: isConnected,
        deviceId: config.WHATSAPP_DEVICE_ID,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal memeriksa status perangkat",
      error: error.message,
    });
  }
};
