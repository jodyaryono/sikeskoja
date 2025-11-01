import { Request, Response } from "express";
import prisma from "../config/database";
import { config } from "../config";

interface AuthRequest extends Request {
  user?: any;
}

export const getPatients = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(
      parseInt(req.query.limit as string) || config.DEFAULT_PAGE_SIZE,
      config.MAX_PAGE_SIZE
    );
    const search = req.query.search as string;
    const gender = req.query.gender as string;
    const bloodType = req.query.bloodType as string;
    const isActive = req.query.isActive as string;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { nik: { contains: search } },
      ];
    }

    if (gender) where.gender = gender;
    if (bloodType) where.bloodType = bloodType;
    if (isActive !== undefined) where.isActive = isActive === "true";

    // Get patients with pagination
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch patients",
    });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        healthRecords: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            creator: {
              select: {
                username: true,
                profile: {
                  select: { fullName: true },
                },
              },
            },
          },
        },
        familyMembers: true,
      },
    });

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    res.json({ patient });
  } catch (error) {
    console.error("Get patient by ID error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch patient",
    });
  }
};

export const createPatient = async (req: AuthRequest, res: Response) => {
  try {
    const patientData = req.body;

    // Check if NIK already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { nik: patientData.nik },
    });

    if (existingPatient) {
      return res.status(400).json({
        error: "Patient already exists",
        message: "A patient with this NIK already exists",
      });
    }

    const patient = await prisma.patient.create({
      data: patientData,
    });

    res.status(201).json({
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create patient",
    });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    // If NIK is being updated, check for duplicates
    if (updateData.nik && updateData.nik !== existingPatient.nik) {
      const nikExists = await prisma.patient.findUnique({
        where: { nik: updateData.nik },
      });

      if (nikExists) {
        return res.status(400).json({
          error: "NIK already exists",
          message: "A patient with this NIK already exists",
        });
      }
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update patient",
    });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    // Soft delete by setting isActive to false
    const patient = await prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      message: "Patient deleted successfully",
      patient,
    });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete patient",
    });
  }
};

export const searchPatients = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    if (!q || typeof q !== "string" || q.trim().length < 2) {
      return res.status(400).json({
        error: "Invalid search query",
        message: "Search query must be at least 2 characters long",
      });
    }

    const patients = await prisma.patient.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { fullName: { contains: q.trim(), mode: "insensitive" } },
              { nik: { contains: q.trim() } },
            ],
          },
        ],
      },
      take: limit,
      select: {
        id: true,
        nik: true,
        fullName: true,
        dateOfBirth: true,
        gender: true,
      },
      orderBy: { fullName: "asc" },
    });

    res.json({ patients });
  } catch (error) {
    console.error("Search patients error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to search patients",
    });
  }
};

export const getPatientStatistics = async (req: Request, res: Response) => {
  try {
    const [
      totalPatients,
      activePatients,
      malePatients,
      femalePatients,
      recentPatients,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { isActive: true } }),
      prisma.patient.count({ where: { gender: "MALE", isActive: true } }),
      prisma.patient.count({ where: { gender: "FEMALE", isActive: true } }),
      prisma.patient.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    res.json({
      statistics: {
        totalPatients,
        activePatients,
        inactivePatients: totalPatients - activePatients,
        malePatients,
        femalePatients,
        recentPatients,
      },
    });
  } catch (error) {
    console.error("Get patient statistics error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch patient statistics",
    });
  }
};
