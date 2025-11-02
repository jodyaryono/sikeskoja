"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnggotaKeluarga = exports.updateAnggotaKeluarga = exports.getQuestionnaireStats = exports.deleteQuestionnaire = exports.updateQuestionnaire = exports.createQuestionnaire = exports.getQuestionnaireById = exports.getAllQuestionnaires = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all questionnaires with pagination and filters
const getAllQuestionnaires = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, respondentId, provinsi, kabupatenKota, search, } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        // Build where clause
        const where = {};
        if (status) {
            where.status = status;
        }
        if (respondentId) {
            where.respondentId = respondentId;
        }
        if (provinsi) {
            where.provinsi = provinsi;
        }
        if (kabupatenKota) {
            where.kabupatenKota = kabupatenKota;
        }
        if (search) {
            where.OR = [
                {
                    namaDinasKesehatan: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                { namaPengisi: { contains: search, mode: "insensitive" } },
                { kabupatenKota: { contains: search, mode: "insensitive" } },
            ];
        }
        const [questionnaires, total] = await Promise.all([
            prisma.questionnaire.findMany({
                where,
                skip,
                take,
                include: {
                    respondent: {
                        select: {
                            id: true,
                            namaDinasKesehatan: true,
                            provinsi: true,
                            kabupatenKota: true,
                        },
                    },
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.questionnaire.count({ where }),
        ]);
        res.json({
            success: true,
            data: questionnaires,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching questionnaires:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kuesioner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getAllQuestionnaires = getAllQuestionnaires;
// Get single questionnaire by ID
const getQuestionnaireById = async (req, res) => {
    try {
        const { id } = req.params;
        const questionnaire = await prisma.questionnaire.findUnique({
            where: { id },
            include: {
                respondent: true,
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                answers: {
                    orderBy: [{ sectionName: "asc" }, { questionNumber: "asc" }],
                },
            },
        });
        if (!questionnaire) {
            return res.status(404).json({
                success: false,
                message: "Kuesioner tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: questionnaire,
        });
    }
    catch (error) {
        console.error("Error fetching questionnaire:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kuesioner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getQuestionnaireById = getQuestionnaireById;
// Create new questionnaire
const createQuestionnaire = async (req, res) => {
    try {
        const { respondentId, namaDinasKesehatan, alamatDinasKesehatan, provinsi, kabupatenKota, noTelepon, email, namaPengisi, jabatanPengisi, questionnaireData, status = "DRAFT", } = req.body;
        // Get user from auth middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User tidak terautentikasi",
            });
        }
        // Validate required fields
        if (!respondentId ||
            !namaDinasKesehatan ||
            !alamatDinasKesehatan ||
            !provinsi ||
            !kabupatenKota ||
            !namaPengisi ||
            !jabatanPengisi) {
            return res.status(400).json({
                success: false,
                message: "Data kuesioner tidak lengkap",
            });
        }
        // Check if respondent exists
        const respondent = await prisma.respondent.findUnique({
            where: { id: respondentId },
        });
        if (!respondent) {
            return res.status(404).json({
                success: false,
                message: "Respondent tidak ditemukan",
            });
        }
        const questionnaire = await prisma.questionnaire.create({
            data: {
                respondentId,
                namaDinasKesehatan,
                alamatDinasKesehatan,
                provinsi,
                kabupatenKota,
                noTelepon,
                email,
                namaPengisi,
                jabatanPengisi,
                questionnaireData: questionnaireData || "{}",
                status: status,
                createdBy: userId,
            },
            include: {
                respondent: true,
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Kuesioner berhasil dibuat",
            data: questionnaire,
        });
    }
    catch (error) {
        console.error("Error creating questionnaire:", error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat kuesioner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createQuestionnaire = createQuestionnaire;
// Update questionnaire
const updateQuestionnaire = async (req, res) => {
    try {
        const { id } = req.params;
        const { respondentId, namaDinasKesehatan, alamatDinasKesehatan, provinsi, kabupatenKota, noTelepon, email, namaPengisi, jabatanPengisi, questionnaireData, status, } = req.body;
        // Check if questionnaire exists
        const existingQuestionnaire = await prisma.questionnaire.findUnique({
            where: { id },
        });
        if (!existingQuestionnaire) {
            return res.status(404).json({
                success: false,
                message: "Kuesioner tidak ditemukan",
            });
        }
        // Build update data
        const updateData = {
            updatedAt: new Date(),
        };
        if (respondentId !== undefined)
            updateData.respondentId = respondentId;
        if (namaDinasKesehatan !== undefined)
            updateData.namaDinasKesehatan = namaDinasKesehatan;
        if (alamatDinasKesehatan !== undefined)
            updateData.alamatDinasKesehatan = alamatDinasKesehatan;
        if (provinsi !== undefined)
            updateData.provinsi = provinsi;
        if (kabupatenKota !== undefined)
            updateData.kabupatenKota = kabupatenKota;
        if (noTelepon !== undefined)
            updateData.noTelepon = noTelepon;
        if (email !== undefined)
            updateData.email = email;
        if (namaPengisi !== undefined)
            updateData.namaPengisi = namaPengisi;
        if (jabatanPengisi !== undefined)
            updateData.jabatanPengisi = jabatanPengisi;
        if (questionnaireData !== undefined)
            updateData.questionnaireData = questionnaireData;
        if (status !== undefined) {
            updateData.status = status;
            if (status === "SUBMITTED" && !existingQuestionnaire.submittedAt) {
                updateData.submittedAt = new Date();
            }
        }
        const questionnaire = await prisma.questionnaire.update({
            where: { id },
            data: updateData,
            include: {
                respondent: true,
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            message: "Kuesioner berhasil diupdate",
            data: questionnaire,
        });
    }
    catch (error) {
        console.error("Error updating questionnaire:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengupdate kuesioner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateQuestionnaire = updateQuestionnaire;
// Delete questionnaire
const deleteQuestionnaire = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if questionnaire exists
        const existingQuestionnaire = await prisma.questionnaire.findUnique({
            where: { id },
        });
        if (!existingQuestionnaire) {
            return res.status(404).json({
                success: false,
                message: "Kuesioner tidak ditemukan",
            });
        }
        // Delete questionnaire (answers will be cascade deleted)
        await prisma.questionnaire.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: "Kuesioner berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Error deleting questionnaire:", error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus kuesioner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteQuestionnaire = deleteQuestionnaire;
// Get questionnaire statistics
const getQuestionnaireStats = async (req, res) => {
    try {
        const [total, draft, inProgress, completed, submitted, byProvince, recentActivity,] = await Promise.all([
            prisma.questionnaire.count(),
            prisma.questionnaire.count({ where: { status: "DRAFT" } }),
            prisma.questionnaire.count({ where: { status: "IN_PROGRESS" } }),
            prisma.questionnaire.count({ where: { status: "COMPLETED" } }),
            prisma.questionnaire.count({ where: { status: "SUBMITTED" } }),
            prisma.questionnaire.groupBy({
                by: ["provinsi"],
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
                take: 10,
            }),
            prisma.questionnaire.findMany({
                take: 5,
                orderBy: { updatedAt: "desc" },
                select: {
                    id: true,
                    namaDinasKesehatan: true,
                    provinsi: true,
                    kabupatenKota: true,
                    status: true,
                    updatedAt: true,
                },
            }),
        ]);
        res.json({
            success: true,
            data: {
                total,
                byStatus: {
                    draft,
                    inProgress,
                    completed,
                    submitted,
                },
                byProvince: byProvince.map((p) => ({
                    provinsi: p.provinsi,
                    count: p._count.id,
                })),
                recentActivity,
            },
        });
    }
    catch (error) {
        console.error("Error fetching questionnaire stats:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik kuesioner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getQuestionnaireStats = getQuestionnaireStats;
// Update anggota keluarga
const updateAnggotaKeluarga = async (req, res) => {
    try {
        const { id: questionnaireId, anggotaId } = req.params;
        const updateData = req.body;
        // Check if questionnaire exists
        const questionnaire = await prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
            include: { anggotaKeluarga: true },
        });
        if (!questionnaire) {
            return res.status(404).json({
                success: false,
                message: "Kuesioner tidak ditemukan",
            });
        }
        // Check if anggota exists
        const anggota = questionnaire.anggotaKeluarga.find((a) => a.id === anggotaId);
        if (!anggota) {
            return res.status(404).json({
                success: false,
                message: "Anggota keluarga tidak ditemukan",
            });
        }
        // Validate required fields
        if (!updateData.nama || !updateData.nik) {
            return res.status(400).json({
                success: false,
                message: "Nama dan NIK harus diisi",
            });
        }
        // Prepare update data with proper type conversions
        const dataToUpdate = {
            nama: updateData.nama,
            nik: updateData.nik,
        };
        // Add optional fields if provided
        if (updateData.hubunganKeluarga)
            dataToUpdate.hubunganKeluarga = updateData.hubunganKeluarga;
        if (updateData.tanggalLahir)
            dataToUpdate.tanggalLahir = new Date(updateData.tanggalLahir);
        if (updateData.umur !== undefined)
            dataToUpdate.umur = parseInt(updateData.umur);
        if (updateData.jenisKelamin)
            dataToUpdate.jenisKelamin = updateData.jenisKelamin;
        if (updateData.statusPerkawinan)
            dataToUpdate.statusPerkawinan = updateData.statusPerkawinan;
        if (updateData.sedangHamil)
            dataToUpdate.sedangHamil = updateData.sedangHamil;
        if (updateData.agama)
            dataToUpdate.agama = updateData.agama;
        if (updateData.pendidikan)
            dataToUpdate.pendidikan = updateData.pendidikan;
        if (updateData.pekerjaan)
            dataToUpdate.pekerjaan = updateData.pekerjaan;
        // GPS coordinates (independen untuk tracking individu)
        if (updateData.latitude !== undefined)
            dataToUpdate.latitude = parseFloat(updateData.latitude);
        if (updateData.longitude !== undefined)
            dataToUpdate.longitude = parseFloat(updateData.longitude);
        // Alamat wilayah codes
        if (updateData.alamatRumah)
            dataToUpdate.alamatRumah = updateData.alamatRumah;
        if (updateData.provinsiKode)
            dataToUpdate.provinsiKode = updateData.provinsiKode;
        if (updateData.kabupatenKode)
            dataToUpdate.kabupatenKode = updateData.kabupatenKode;
        if (updateData.kecamatanKode)
            dataToUpdate.kecamatanKode = updateData.kecamatanKode;
        if (updateData.desaKode)
            dataToUpdate.desaKode = updateData.desaKode;
        // Update the anggota keluarga
        const updatedAnggota = await prisma.anggotaKeluarga.update({
            where: { id: anggotaId },
            data: dataToUpdate,
        });
        res.status(200).json({
            success: true,
            message: "Anggota keluarga berhasil diperbarui",
            data: updatedAnggota,
        });
    }
    catch (error) {
        console.error("Error updating anggota keluarga:", error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui anggota keluarga",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateAnggotaKeluarga = updateAnggotaKeluarga;
// Delete anggota keluarga
const deleteAnggotaKeluarga = async (req, res) => {
    try {
        const { id: questionnaireId, anggotaId } = req.params;
        // Check if questionnaire exists
        const questionnaire = await prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
            include: { anggotaKeluarga: true },
        });
        if (!questionnaire) {
            return res.status(404).json({
                success: false,
                message: "Kuesioner tidak ditemukan",
            });
        }
        // Check if anggota exists
        const anggota = questionnaire.anggotaKeluarga.find((a) => a.id === anggotaId);
        if (!anggota) {
            return res.status(404).json({
                success: false,
                message: "Anggota keluarga tidak ditemukan",
            });
        }
        // Prevent deletion of kepala keluarga if there are other members
        if ((anggota.hubunganKeluarga === "1" ||
            anggota.hubunganKeluarga === "Kepala Keluarga") &&
            questionnaire.anggotaKeluarga.length > 1) {
            return res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus Kepala Keluarga jika masih ada anggota keluarga lainnya. Hapus anggota lain terlebih dahulu.",
            });
        }
        // Delete the anggota keluarga
        await prisma.anggotaKeluarga.delete({
            where: { id: anggotaId },
        });
        // Update jumlahAnggotaKeluarga in questionnaire
        const remainingCount = questionnaire.anggotaKeluarga.length - 1;
        await prisma.questionnaire.update({
            where: { id: questionnaireId },
            data: { jumlahAnggotaKeluarga: remainingCount },
        });
        res.status(200).json({
            success: true,
            message: "Anggota keluarga berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Error deleting anggota keluarga:", error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus anggota keluarga",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteAnggotaKeluarga = deleteAnggotaKeluarga;
//# sourceMappingURL=questionnaireController.js.map