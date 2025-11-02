import { Request, Response } from "express";
/**
 * Request OTP - Send OTP code to user's phone
 * POST /api/auth/otp/request
 * Body: { phone: string }
 */
export declare const requestOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Verify OTP - Validate OTP and login user
 * POST /api/auth/otp/verify
 * Body: { phone: string, otpCode: string }
 */
export declare const verifyOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Resend OTP - Send new OTP code
 * POST /api/auth/otp/resend
 * Body: { phone: string }
 */
export declare const resendOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Check WhatsApp Device Status
 * GET /api/auth/otp/status
 */
export declare const checkDeviceStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=otpAuthController.d.ts.map