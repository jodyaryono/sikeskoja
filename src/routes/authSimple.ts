import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { config } from "../config";

const router = Router();

interface AuthRequest extends Request {
  user?: any;
}

// Register endpoint
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, username, password, fullName, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        phone: phone || `0812${Date.now().toString().slice(-8)}`, // Generate phone if not provided
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
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET as string
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to register user",
    });
  }
});

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user with profile
    const user = await prisma.user.findUnique({
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
    if (!user.password) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "This account uses OTP login. Please use OTP authentication.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET as string
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to login",
    });
  }
});

// Health check for auth
router.get("/health", (req: Request, res: Response) => {
  res.json({
    message: "Auth service is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
