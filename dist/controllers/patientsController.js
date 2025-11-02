"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientStatistics = exports.searchPatients = exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatientById = exports.getPatients = void 0;
const database_1 = __importDefault(require("../config/database"));
const config_1 = require("../config");
const getPatients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || config_1.config.DEFAULT_PAGE_SIZE, config_1.config.MAX_PAGE_SIZE);
        const search = req.query.search;
        const gender = req.query.gender;
        const bloodType = req.query.bloodType;
        const isActive = req.query.isActive;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {};
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: "insensitive" } },
                { nik: { contains: search } },
            ];
        }
        if (gender)
            where.gender = gender;
        if (bloodType)
            where.bloodType = bloodType;
        if (isActive !== undefined)
            where.isActive = isActive === "true";
        // Get patients with pagination
        const [patients, total] = await Promise.all([
            database_1.default.patient.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            database_1.default.patient.count({ where }),
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
    }
    catch (error) {
        console.error("Get patients error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to fetch patients",
        });
    }
};
exports.getPatients = getPatients;
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await database_1.default.patient.findUnique({
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
    }
    catch (error) {
        console.error("Get patient by ID error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to fetch patient",
        });
    }
};
exports.getPatientById = getPatientById;
const createPatient = async (req, res) => {
    try {
        const patientData = req.body;
        // Check if NIK already exists
        const existingPatient = await database_1.default.patient.findUnique({
            where: { nik: patientData.nik },
        });
        if (existingPatient) {
            return res.status(400).json({
                error: "Patient already exists",
                message: "A patient with this NIK already exists",
            });
        }
        const patient = await database_1.default.patient.create({
            data: patientData,
        });
        res.status(201).json({
            message: "Patient created successfully",
            patient,
        });
    }
    catch (error) {
        console.error("Create patient error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to create patient",
        });
    }
};
exports.createPatient = createPatient;
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Check if patient exists
        const existingPatient = await database_1.default.patient.findUnique({
            where: { id },
        });
        if (!existingPatient) {
            return res.status(404).json({
                error: "Patient not found",
            });
        }
        // If NIK is being updated, check for duplicates
        if (updateData.nik && updateData.nik !== existingPatient.nik) {
            const nikExists = await database_1.default.patient.findUnique({
                where: { nik: updateData.nik },
            });
            if (nikExists) {
                return res.status(400).json({
                    error: "NIK already exists",
                    message: "A patient with this NIK already exists",
                });
            }
        }
        const patient = await database_1.default.patient.update({
            where: { id },
            data: updateData,
        });
        res.json({
            message: "Patient updated successfully",
            patient,
        });
    }
    catch (error) {
        console.error("Update patient error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to update patient",
        });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if patient exists
        const existingPatient = await database_1.default.patient.findUnique({
            where: { id },
        });
        if (!existingPatient) {
            return res.status(404).json({
                error: "Patient not found",
            });
        }
        // Soft delete by setting isActive to false
        const patient = await database_1.default.patient.update({
            where: { id },
            data: { isActive: false },
        });
        res.json({
            message: "Patient deleted successfully",
            patient,
        });
    }
    catch (error) {
        console.error("Delete patient error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to delete patient",
        });
    }
};
exports.deletePatient = deletePatient;
const searchPatients = async (req, res) => {
    try {
        const { q } = req.query;
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        if (!q || typeof q !== "string" || q.trim().length < 2) {
            return res.status(400).json({
                error: "Invalid search query",
                message: "Search query must be at least 2 characters long",
            });
        }
        const patients = await database_1.default.patient.findMany({
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
    }
    catch (error) {
        console.error("Search patients error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to search patients",
        });
    }
};
exports.searchPatients = searchPatients;
const getPatientStatistics = async (req, res) => {
    try {
        const [totalPatients, activePatients, malePatients, femalePatients, recentPatients,] = await Promise.all([
            database_1.default.patient.count(),
            database_1.default.patient.count({ where: { isActive: true } }),
            database_1.default.patient.count({ where: { gender: "MALE", isActive: true } }),
            database_1.default.patient.count({ where: { gender: "FEMALE", isActive: true } }),
            database_1.default.patient.count({
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
    }
    catch (error) {
        console.error("Get patient statistics error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to fetch patient statistics",
        });
    }
};
exports.getPatientStatistics = getPatientStatistics;
//# sourceMappingURL=patientsController.js.map