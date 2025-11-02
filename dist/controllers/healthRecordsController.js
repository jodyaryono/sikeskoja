"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHealthRecords = exports.getHealthRecordsByPatient = exports.deleteHealthRecord = exports.updateHealthRecord = exports.createHealthRecord = exports.getHealthRecordById = exports.getHealthRecords = void 0;
const database_1 = __importDefault(require("../config/database"));
const config_1 = require("../config");
const getHealthRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || config_1.config.DEFAULT_PAGE_SIZE, config_1.config.MAX_PAGE_SIZE);
        const search = req.query.search;
        const recordType = req.query.recordType;
        const status = req.query.status;
        const patientId = req.query.patientId;
        const dateFrom = req.query.dateFrom;
        const dateTo = req.query.dateTo;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {};
        if (search) {
            where.OR = [
                { patient: { fullName: { contains: search, mode: "insensitive" } } },
                { notes: { contains: search, mode: "insensitive" } },
            ];
        }
        if (recordType)
            where.recordType = recordType;
        if (status)
            where.status = status;
        if (patientId)
            where.patientId = patientId;
        if (dateFrom || dateTo) {
            where.recordDate = {};
            if (dateFrom)
                where.recordDate.gte = new Date(dateFrom);
            if (dateTo)
                where.recordDate.lte = new Date(dateTo);
        }
        // Get health records with pagination
        const [healthRecords, total] = await Promise.all([
            database_1.default.healthRecord.findMany({
                where,
                skip,
                take: limit,
                include: {
                    patient: {
                        select: {
                            id: true,
                            nik: true,
                            fullName: true,
                            dateOfBirth: true,
                            gender: true,
                        },
                    },
                    creator: {
                        select: {
                            username: true,
                            profile: {
                                select: { fullName: true },
                            },
                        },
                    },
                    vitalSigns: {
                        orderBy: { measuredAt: "desc" },
                        take: 1,
                    },
                    diagnoses: true,
                    medications: {
                        where: { isActive: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            database_1.default.healthRecord.count({ where }),
        ]);
        res.json({
            healthRecords,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Get health records error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to fetch health records",
        });
    }
};
exports.getHealthRecords = getHealthRecords;
const getHealthRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        const healthRecord = await database_1.default.healthRecord.findUnique({
            where: { id },
            include: {
                patient: {
                    include: {
                        familyMembers: true,
                    },
                },
                creator: {
                    select: {
                        username: true,
                        profile: {
                            select: { fullName: true },
                        },
                    },
                },
                medicalData: {
                    orderBy: { createdAt: "desc" },
                },
                vitalSigns: {
                    orderBy: { measuredAt: "desc" },
                },
                medications: {
                    orderBy: { createdAt: "desc" },
                },
                diagnoses: {
                    orderBy: { diagnosedAt: "desc" },
                },
                labResults: {
                    orderBy: { testedAt: "desc" },
                },
            },
        });
        if (!healthRecord) {
            return res.status(404).json({
                error: "Health record not found",
            });
        }
        res.json({ healthRecord });
    }
    catch (error) {
        console.error("Get health record by ID error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to fetch health record",
        });
    }
};
exports.getHealthRecordById = getHealthRecordById;
const createHealthRecord = async (req, res) => {
    try {
        const healthRecordData = {
            ...req.body,
            createdBy: req.user.id,
        };
        // Verify patient exists
        const patient = await database_1.default.patient.findUnique({
            where: { id: healthRecordData.patientId },
        });
        if (!patient) {
            return res.status(404).json({
                error: "Patient not found",
            });
        }
        const healthRecord = await database_1.default.healthRecord.create({
            data: healthRecordData,
            include: {
                patient: {
                    select: {
                        id: true,
                        nik: true,
                        fullName: true,
                        dateOfBirth: true,
                        gender: true,
                    },
                },
                creator: {
                    select: {
                        username: true,
                        profile: {
                            select: { fullName: true },
                        },
                    },
                },
            },
        });
        res.status(201).json({
            message: "Health record created successfully",
            healthRecord,
        });
    }
    catch (error) {
        console.error("Create health record error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to create health record",
        });
    }
};
exports.createHealthRecord = createHealthRecord;
const updateHealthRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Check if health record exists
        const existingRecord = await database_1.default.healthRecord.findUnique({
            where: { id },
        });
        if (!existingRecord) {
            return res.status(404).json({
                error: "Health record not found",
            });
        }
        // Check if user has permission to update (creator or admin/doctor)
        if (existingRecord.createdBy !== req.user.id &&
            !["ADMIN", "DOCTOR"].includes(req.user.role)) {
            return res.status(403).json({
                error: "Permission denied",
                message: "You can only update your own records",
            });
        }
        const healthRecord = await database_1.default.healthRecord.update({
            where: { id },
            data: updateData,
            include: {
                patient: {
                    select: {
                        id: true,
                        nik: true,
                        fullName: true,
                        dateOfBirth: true,
                        gender: true,
                    },
                },
                creator: {
                    select: {
                        username: true,
                        profile: {
                            select: { fullName: true },
                        },
                    },
                },
            },
        });
        res.json({
            message: "Health record updated successfully",
            healthRecord,
        });
    }
    catch (error) {
        console.error("Update health record error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to update health record",
        });
    }
};
exports.updateHealthRecord = updateHealthRecord;
const deleteHealthRecord = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if health record exists
        const existingRecord = await database_1.default.healthRecord.findUnique({
            where: { id },
        });
        if (!existingRecord) {
            return res.status(404).json({
                error: "Health record not found",
            });
        }
        // Check if user has permission to delete (only admin)
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                error: "Permission denied",
                message: "Only administrators can delete health records",
            });
        }
        // Soft delete by setting status to CANCELLED
        const healthRecord = await database_1.default.healthRecord.update({
            where: { id },
            data: { status: "CANCELLED" },
        });
        res.json({
            message: "Health record deleted successfully",
            healthRecord,
        });
    }
    catch (error) {
        console.error("Delete health record error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to delete health record",
        });
    }
};
exports.deleteHealthRecord = deleteHealthRecord;
const getHealthRecordsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || config_1.config.DEFAULT_PAGE_SIZE, config_1.config.MAX_PAGE_SIZE);
        const skip = (page - 1) * limit;
        // Verify patient exists
        const patient = await database_1.default.patient.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            return res.status(404).json({
                error: "Patient not found",
            });
        }
        const [healthRecords, total] = await Promise.all([
            database_1.default.healthRecord.findMany({
                where: { patientId },
                skip,
                take: limit,
                include: {
                    creator: {
                        select: {
                            username: true,
                            profile: {
                                select: { fullName: true },
                            },
                        },
                    },
                    vitalSigns: {
                        orderBy: { measuredAt: "desc" },
                        take: 1,
                    },
                    diagnoses: true,
                    medications: {
                        where: { isActive: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            database_1.default.healthRecord.count({ where: { patientId } }),
        ]);
        res.json({
            patient: {
                id: patient.id,
                nik: patient.nik,
                fullName: patient.fullName,
            },
            healthRecords,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Get health records by patient error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to fetch patient health records",
        });
    }
};
exports.getHealthRecordsByPatient = getHealthRecordsByPatient;
const searchHealthRecords = async (req, res) => {
    try {
        const { q } = req.query;
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        if (!q || typeof q !== "string" || q.trim().length < 2) {
            return res.status(400).json({
                error: "Invalid search query",
                message: "Search query must be at least 2 characters long",
            });
        }
        const healthRecords = await database_1.default.healthRecord.findMany({
            where: {
                OR: [
                    {
                        patient: { fullName: { contains: q.trim(), mode: "insensitive" } },
                    },
                    { patient: { nik: { contains: q.trim() } } },
                    { notes: { contains: q.trim(), mode: "insensitive" } },
                ],
            },
            take: limit,
            include: {
                patient: {
                    select: {
                        id: true,
                        nik: true,
                        fullName: true,
                        dateOfBirth: true,
                        gender: true,
                    },
                },
                creator: {
                    select: {
                        username: true,
                        profile: {
                            select: { fullName: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ healthRecords });
    }
    catch (error) {
        console.error("Search health records error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to search health records",
        });
    }
};
exports.searchHealthRecords = searchHealthRecords;
//# sourceMappingURL=healthRecordsController.js.map