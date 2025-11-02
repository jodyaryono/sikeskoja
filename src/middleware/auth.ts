import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🔑 Auth Debug:", {
    path: req.path,
    hasAuthHeader: !!authHeader,
    tokenLength: token?.length,
  });

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    console.log("✅ Token verified, user:", user);
    req.user = user;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("🔐 Role Check:", {
      requiredRoles: roles,
      userRole: req.user?.role,
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
