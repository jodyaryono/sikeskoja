"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRespondentStats = exports.deleteRespondent = exports.updateRespondent = exports.createRespondent = exports.getRespondentById = exports.getAllRespondents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all respondents with pagination and filters
const getAllRespondents = async (req, res) => {
    try {
        const { page = 1, limit = 10, provinsi, kabupatenKota, search, isActive, } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        // Build where clause
        const where = {};
        if (provinsi) {
            where.provinsi = provinsi;
        }
        if (kabupatenKota) {
            where.kabupatenKota = kabupatenKota;
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        if (search) {
            where.OR = [
                {
                    namaDinasKesehatan: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    kodeDinasKesehatan: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                { kabupatenKota: { contains: search, mode: "insensitive" } },
                { provinsi: { contains: search, mode: "insensitive" } },
            ];
        }
        const [respondents, total] = await Promise.all([
            prisma.respondent.findMany({
                where,
                skip,
                take,
                include: {
                    _count: {
                        select: { questionnaires: true },
                    },
                },
                orderBy: {
                    namaDinasKesehatan: "asc",
                },
            }),
            prisma.respondent.count({ where }),
        ]);
        res.json({
            success: true,
            data: respondents,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching respondents:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data respondent",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getAllRespondents = getAllRespondents;
// Get single respondent by ID
const getRespondentById = async (req, res) => {
    try {
        const { id } = req.params;
        const respondent = await prisma.respondent.findUnique({
            where: { id },
            include: {
                questionnaires: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 10,
                },
                _count: {
                    select: { questionnaires: true },
                },
            },
        });
        if (!respondent) {
            return res.status(404).json({
                success: false,
                message: "Respondent tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: respondent,
        });
    }
    catch (error) {
        console.error("Error fetching respondent:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data respondent",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getRespondentById = getRespondentById;
// Create new respondent
const createRespondent = async (req, res) => {
    try {
        const { namaDinasKesehatan, kodeDinasKesehatan, provinsi, kabupatenKota, alamat, kodePos, noTelepon, email, website, namaKepala, jabatanKepala, } = req.body;
        // Validate required fields
        if (!namaDinasKesehatan || !provinsi || !kabupatenKota || !alamat) {
            return res.status(400).json({
                success: false,
                message: "Data respondent tidak lengkap",
            });
        }
        // Check if kode already exists
        if (kodeDinasKesehatan) {
            const existing = await prisma.respondent.findUnique({
                where: { kodeDinasKesehatan },
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Kode Dinas Kesehatan sudah digunakan",
                });
            }
        }
        const respondent = await prisma.respondent.create({
            data: {
                namaDinasKesehatan,
                kodeDinasKesehatan,
                provinsi,
                kabupatenKota,
                alamat,
                kodePos,
                noTelepon,
                email,
                website,
                namaKepala,
                jabatanKepala,
            },
        });
        res.status(201).json({
            success: true,
            message: "Respondent berhasil dibuat",
            data: respondent,
        });
    }
    catch (error) {
        console.error("Error creating respondent:", error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat respondent",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createRespondent = createRespondent;
// Update respondent
const updateRespondent = async (req, res) => {
    try {
        const { id } = req.params;
        const { namaDinasKesehatan, kodeDinasKesehatan, provinsi, kabupatenKota, alamat, kodePos, noTelepon, email, website, namaKepala, jabatanKepala, isActive, } = req.body;
        // Check if respondent exists
        const existingRespondent = await prisma.respondent.findUnique({
            where: { id },
        });
        if (!existingRespondent) {
            return res.status(404).json({
                success: false,
                message: "Respondent tidak ditemukan",
            });
        }
        // Check if new kode already exists
        if (kodeDinasKesehatan &&
            kodeDinasKesehatan !== existingRespondent.kodeDinasKesehatan) {
            const existing = await prisma.respondent.findUnique({
                where: { kodeDinasKesehatan },
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Kode Dinas Kesehatan sudah digunakan",
                });
            }
        }
        // Build update data
        const updateData = {
            updatedAt: new Date(),
        };
        if (namaDinasKesehatan !== undefined)
            updateData.namaDinasKesehatan = namaDinasKesehatan;
        if (kodeDinasKesehatan !== undefined)
            updateData.kodeDinasKesehatan = kodeDinasKesehatan;
        if (provinsi !== undefined)
            updateData.provinsi = provinsi;
        if (kabupatenKota !== undefined)
            updateData.kabupatenKota = kabupatenKota;
        if (alamat !== undefined)
            updateData.alamat = alamat;
        if (kodePos !== undefined)
            updateData.kodePos = kodePos;
        if (noTelepon !== undefined)
            updateData.noTelepon = noTelepon;
        if (email !== undefined)
            updateData.email = email;
        if (website !== undefined)
            updateData.website = website;
        if (namaKepala !== undefined)
            updateData.namaKepala = namaKepala;
        if (jabatanKepala !== undefined)
            updateData.jabatanKepala = jabatanKepala;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        const respondent = await prisma.respondent.update({
            where: { id },
            data: updateData,
        });
        res.json({
            success: true,
            message: "Respondent berhasil diupdate",
            data: respondent,
        });
    }
    catch (error) {
        console.error("Error updating respondent:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengupdate respondent",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateRespondent = updateRespondent;
// Delete respondent
const deleteRespondent = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if respondent exists
        const existingRespondent = await prisma.respondent.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { questionnaires: true },
                },
            },
        });
        if (!existingRespondent) {
            return res.status(404).json({
                success: false,
                message: "Respondent tidak ditemukan",
            });
        }
        // Check if respondent has questionnaires
        if (existingRespondent._count.questionnaires > 0) {
            return res.status(400).json({
                success: false,
                message: `Tidak dapat menghapus respondent yang memiliki ${existingRespondent._count.questionnaires} kuesioner. Hapus kuesioner terlebih dahulu.`,
            });
        }
        // Delete respondent
        await prisma.respondent.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: "Respondent berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Error deleting respondent:", error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus respondent",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteRespondent = deleteRespondent;
// Get respondent statistics
const getRespondentStats = async (req, res) => {
    try {
        const [total, active, byProvince] = await Promise.all([
            prisma.respondent.count(),
            prisma.respondent.count({ where: { isActive: true } }),
            prisma.respondent.groupBy({
                by: ["provinsi"],
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
                take: 10,
            }),
        ]);
        res.json({
            success: true,
            data: {
                total,
                active,
                inactive: total - active,
                byProvince: byProvince.map((p) => ({
                    provinsi: p.provinsi,
                    count: p._count.id,
                })),
            },
        });
    }
    catch (error) {
        console.error("Error fetching respondent stats:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik respondent",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getRespondentStats = getRespondentStats;
//# sourceMappingURL=respondentController.js.map