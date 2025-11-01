import { Request, Response } from "express";
import prisma from "../config/database";
import { config } from "../config";

interface AuthRequest extends Request {
  user?: any;
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(
      parseInt(req.query.limit as string) || config.DEFAULT_PAGE_SIZE,
      config.MAX_PAGE_SIZE
    );
    const search = req.query.search as string;
    const role = req.query.role as string;
    const isActive = req.query.isActive as string;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { profile: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === "true";

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          profile: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is requesting their own data or is admin
    if (req.user.id !== id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Permission denied",
        message: "You can only access your own profile",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch user",
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user is updating their own data or is admin
    if (req.user.id !== id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Permission denied",
        message: "You can only update your own profile",
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Separate user data from profile data
    const { fullName, phone, address, avatar, ...userData } = updateData;
    const profileData = { fullName, phone, address, avatar };

    // Remove undefined values
    Object.keys(userData).forEach((key) => {
      if ((userData as any)[key] === undefined) delete (userData as any)[key];
    });
    Object.keys(profileData).forEach((key) => {
      if ((profileData as any)[key] === undefined)
        delete (profileData as any)[key];
    });

    // Only admin can update role and isActive
    if (req.user.role !== "ADMIN") {
      delete userData.role;
      delete userData.isActive;
    }

    // If email is being updated, check for duplicates
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (emailExists) {
        return res.status(400).json({
          error: "Email already exists",
          message: "A user with this email already exists",
        });
      }
    }

    // Update user and profile
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...userData,
        profile:
          Object.keys(profileData).length > 0
            ? {
                upsert: {
                  create: profileData,
                  update: profileData,
                },
              }
            : undefined,
      },
      include: {
        profile: true,
      },
    });

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Soft delete by setting isActive to false
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      message: "User deleted successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete user",
    });
  }
};

export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      doctorUsers,
      nurseUsers,
      staffUsers,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "ADMIN", isActive: true } }),
      prisma.user.count({ where: { role: "DOCTOR", isActive: true } }),
      prisma.user.count({ where: { role: "NURSE", isActive: true } }),
      prisma.user.count({ where: { role: "STAFF", isActive: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    res.json({
      statistics: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        roleDistribution: {
          admin: adminUsers,
          doctor: doctorUsers,
          nurse: nurseUsers,
          staff: staffUsers,
          user:
            activeUsers - (adminUsers + doctorUsers + nurseUsers + staffUsers),
        },
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Get user statistics error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch user statistics",
    });
  }
};
