"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKSDashboardStats = exports.deleteQuestionnaireKS = exports.updateQuestionnaireKS = exports.getQuestionnaireKSById = exports.getAllQuestionnaireKS = exports.createQuestionnaireKS = void 0;
var client_1 = require("@prisma/client");
var dateUtils_1 = require("../utils/dateUtils");
var prisma = new client_1.PrismaClient();
// Create Kuesioner KS dengan Anggota Keluarga
var createQuestionnaireKS = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, 
    // I. Pengenalan Tempat
    provinsi, kabupatenKota, kecamatan, namaPuskesmas, kodePuskesmas, desaKelurahan, rw, rt, noUrutBangunan, noUrutKeluarga, alamatRumah, latitude, longitude, 
    // II. Keterangan Keluarga
    namaKepalaKeluarga, saranaAirBersih, jenisAirMinum, jambanKeluarga, jenisJamban, gangguanJiwaBerat, obatGangguanJiwa, anggotaDipasungi, 
    // III. Keterangan Pengumpul Data
    namaPengumpulData, namaSupervisor, tanggalPengumpulan, 
    // Jumlah Anggota (auto-calculated)
    jumlahAnggotaKeluarga, jumlahAnggotaDewasa, jumlahAnggotaUsia0_15, jumlahAnggotaUsia12_59, jumlahAnggotaUsia10_54, jumlahAnggotaUsia0_11, 
    // IV. Anggota Keluarga (array)
    anggotaKeluarga, _b, status_1, questionnaire, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, provinsi = _a.provinsi, kabupatenKota = _a.kabupatenKota, kecamatan = _a.kecamatan, namaPuskesmas = _a.namaPuskesmas, kodePuskesmas = _a.kodePuskesmas, desaKelurahan = _a.desaKelurahan, rw = _a.rw, rt = _a.rt, noUrutBangunan = _a.noUrutBangunan, noUrutKeluarga = _a.noUrutKeluarga, alamatRumah = _a.alamatRumah, latitude = _a.latitude, longitude = _a.longitude, namaKepalaKeluarga = _a.namaKepalaKeluarga, saranaAirBersih = _a.saranaAirBersih, jenisAirMinum = _a.jenisAirMinum, jambanKeluarga = _a.jambanKeluarga, jenisJamban = _a.jenisJamban, gangguanJiwaBerat = _a.gangguanJiwaBerat, obatGangguanJiwa = _a.obatGangguanJiwa, anggotaDipasungi = _a.anggotaDipasungi, namaPengumpulData = _a.namaPengumpulData, namaSupervisor = _a.namaSupervisor, tanggalPengumpulan = _a.tanggalPengumpulan, jumlahAnggotaKeluarga = _a.jumlahAnggotaKeluarga, jumlahAnggotaDewasa = _a.jumlahAnggotaDewasa, jumlahAnggotaUsia0_15 = _a.jumlahAnggotaUsia0_15, jumlahAnggotaUsia12_59 = _a.jumlahAnggotaUsia12_59, jumlahAnggotaUsia10_54 = _a.jumlahAnggotaUsia10_54, jumlahAnggotaUsia0_11 = _a.jumlahAnggotaUsia0_11, anggotaKeluarga = _a.anggotaKeluarga, _b = _a.status, status_1 = _b === void 0 ? "DRAFT" : _b;
                // Validasi required fields
                if (!provinsi ||
                    !kabupatenKota ||
                    !kecamatan ||
                    !namaPuskesmas ||
                    !desaKelurahan ||
                    !rw ||
                    !rt ||
                    !namaKepalaKeluarga ||
                    !namaPengumpulData) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: "Field wajib tidak boleh kosong",
                        })];
                }
                if (!anggotaKeluarga || anggotaKeluarga.length === 0) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: "Minimal harus ada 1 anggota keluarga",
                        })];
                }
                return [4 /*yield*/, prisma.questionnaire.create({
                        data: {
                            // I. Pengenalan Tempat
                            provinsi: provinsi,
                            kabupatenKota: kabupatenKota,
                            kecamatan: kecamatan,
                            namaPuskesmas: namaPuskesmas,
                            kodePuskesmas: kodePuskesmas,
                            desaKelurahan: desaKelurahan,
                            rw: rw,
                            rt: rt,
                            noUrutBangunan: noUrutBangunan,
                            noUrutKeluarga: noUrutKeluarga,
                            alamatRumah: alamatRumah,
                            latitude: latitude ? parseFloat(latitude) : null,
                            longitude: longitude ? parseFloat(longitude) : null,
                            // II. Keterangan Keluarga
                            namaKepalaKeluarga: namaKepalaKeluarga,
                            saranaAirBersih: saranaAirBersih,
                            jenisAirMinum: jenisAirMinum,
                            jambanKeluarga: jambanKeluarga,
                            jenisJamban: jenisJamban,
                            gangguanJiwaBerat: gangguanJiwaBerat,
                            obatGangguanJiwa: obatGangguanJiwa,
                            anggotaDipasungi: anggotaDipasungi,
                            // III. Keterangan Pengumpul Data
                            namaPengumpulData: namaPengumpulData,
                            namaSupervisor: namaSupervisor,
                            tanggalPengumpulan: tanggalPengumpulan
                                ? new Date(tanggalPengumpulan)
                                : new Date(),
                            // Jumlah Anggota
                            jumlahAnggotaKeluarga: jumlahAnggotaKeluarga,
                            jumlahAnggotaDewasa: jumlahAnggotaDewasa,
                            jumlahAnggotaUsia0_15: jumlahAnggotaUsia0_15,
                            jumlahAnggotaUsia12_59: jumlahAnggotaUsia12_59,
                            jumlahAnggotaUsia10_54: jumlahAnggotaUsia10_54,
                            jumlahAnggotaUsia0_11: jumlahAnggotaUsia0_11,
                            status: status_1,
                            createdBy: req.user.id,
                            // Nested Create Anggota Keluarga
                            anggotaKeluarga: {
                                create: anggotaKeluarga.map(function (anggota, index) {
                                    var tanggalLahir = new Date(anggota.tanggalLahir);
                                    var umur = (0, dateUtils_1.calculateAge)(tanggalLahir);
                                    return {
                                        noUrut: index + 1,
                                        nama: anggota.nama,
                                        hubunganKeluarga: anggota.hubunganKeluarga,
                                        tanggalLahir: tanggalLahir,
                                        umur: umur, // Auto-calculated from tanggalLahir
                                        jenisKelamin: anggota.jenisKelamin,
                                        statusPerkawinan: anggota.statusPerkawinan,
                                        sedangHamil: anggota.sedangHamil,
                                        agama: anggota.agama,
                                        pendidikan: anggota.pendidikan,
                                        pekerjaan: anggota.pekerjaan,
                                        nik: anggota.nik,
                                        // Gangguan Kesehatan (optional fields)
                                        kartuJKN: anggota.kartuJKN,
                                        merokok: anggota.merokok,
                                        buangAirBesarJamban: anggota.buangAirBesarJamban,
                                        airBersih: anggota.airBersih,
                                        diagnosisTB: anggota.diagnosisTB,
                                        obatTBC6Bulan: anggota.obatTBC6Bulan,
                                        batukDarah2Minggu: anggota.batukDarah2Minggu,
                                        diagnosisHipertensi: anggota.diagnosisHipertensi,
                                        obatHipertensiTeratur: anggota.obatHipertensiTeratur,
                                        pengukuranTekananDarah: anggota.pengukuranTekananDarah,
                                        sistolik: anggota.sistolik,
                                        diastolik: anggota.diastolik,
                                        kontrasepsiKB: anggota.kontrasepsiKB,
                                        melahirkanDiFaskes: anggota.melahirkanDiFaskes,
                                        asiEksklusif: anggota.asiEksklusif,
                                        imunisasiLengkap: anggota.imunisasiLengkap,
                                        pemantauanPertumbuhanBalita: anggota.pemantauanPertumbuhanBalita,
                                    };
                                }),
                            },
                        },
                        include: {
                            anggotaKeluarga: true,
                            creator: {
                                select: {
                                    id: true,
                                    username: true,
                                    role: true,
                                },
                            },
                        },
                    })];
            case 1:
                questionnaire = _c.sent();
                res.status(201).json({
                    success: true,
                    message: "Kuesioner KS berhasil dibuat",
                    data: questionnaire,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error("Error creating questionnaire KS:", error_1);
                res.status(500).json({
                    success: false,
                    message: "Gagal membuat kuesioner KS",
                    error: error_1.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createQuestionnaireKS = createQuestionnaireKS;
// Get All Questionnaire KS (dengan pagination)
var getAllQuestionnaireKS = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, status_2, search, skip, where, _d, questionnaires, total, error_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, status_2 = _a.status, search = _a.search;
                skip = (Number(page) - 1) * Number(limit);
                where = {};
                if (status_2) {
                    where.status = status_2;
                }
                if (search) {
                    where.OR = [
                        {
                            namaKepalaKeluarga: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        { provinsi: { contains: search, mode: "insensitive" } },
                        { kabupatenKota: { contains: search, mode: "insensitive" } },
                        { desaKelurahan: { contains: search, mode: "insensitive" } },
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        prisma.questionnaire.findMany({
                            where: where,
                            skip: skip,
                            take: Number(limit),
                            orderBy: { createdAt: "desc" },
                            include: {
                                anggotaKeluarga: {
                                    select: {
                                        id: true,
                                        nama: true,
                                        hubunganKeluarga: true,
                                        umur: true,
                                    },
                                },
                                creator: {
                                    select: {
                                        id: true,
                                        username: true,
                                        role: true,
                                    },
                                },
                            },
                        }),
                        prisma.questionnaire.count({ where: where }),
                    ])];
            case 1:
                _d = _e.sent(), questionnaires = _d[0], total = _d[1];
                res.json({
                    success: true,
                    data: questionnaires,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: total,
                        totalPages: Math.ceil(total / Number(limit)),
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _e.sent();
                console.error("Error fetching questionnaires:", error_2);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data kuesioner",
                    error: error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllQuestionnaireKS = getAllQuestionnaireKS;
// Get Questionnaire KS by ID
var getQuestionnaireKSById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, questionnaire, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.questionnaire.findUnique({
                        where: { id: id },
                        include: {
                            anggotaKeluarga: {
                                orderBy: { noUrut: "asc" },
                                include: {
                                    gangguanKesehatan: true, // Include data kesehatan
                                },
                            },
                            creator: {
                                select: {
                                    id: true,
                                    username: true,
                                    role: true,
                                    phone: true,
                                    profile: {
                                        select: {
                                            fullName: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                questionnaire = _a.sent();
                if (!questionnaire) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: "Kuesioner tidak ditemukan",
                        })];
                }
                res.json({
                    success: true,
                    data: questionnaire,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error fetching questionnaire:", error_3);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil detail kuesioner",
                    error: error_3.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getQuestionnaireKSById = getQuestionnaireKSById;
// Update Questionnaire KS
var updateQuestionnaireKS = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, updateData, existing, anggotaKeluarga, updated, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                id_1 = req.params.id;
                updateData = req.body;
                return [4 /*yield*/, prisma.questionnaire.findUnique({
                        where: { id: id_1 },
                    })];
            case 1:
                existing = _a.sent();
                if (!existing) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: "Kuesioner tidak ditemukan",
                        })];
                }
                anggotaKeluarga = updateData.anggotaKeluarga;
                delete updateData.anggotaKeluarga;
                return [4 /*yield*/, prisma.questionnaire.update({
                        where: { id: id_1 },
                        data: __assign(__assign({}, updateData), { tanggalPengumpulan: updateData.tanggalPengumpulan
                                ? new Date(updateData.tanggalPengumpulan)
                                : undefined, latitude: updateData.latitude
                                ? parseFloat(updateData.latitude)
                                : undefined, longitude: updateData.longitude
                                ? parseFloat(updateData.longitude)
                                : undefined }),
                        include: {
                            anggotaKeluarga: true,
                            creator: {
                                select: {
                                    id: true,
                                    username: true,
                                    role: true,
                                },
                            },
                        },
                    })];
            case 2:
                updated = _a.sent();
                if (!(anggotaKeluarga !== undefined && Array.isArray(anggotaKeluarga))) return [3 /*break*/, 7];
                if (!(anggotaKeluarga.length > 0)) return [3 /*break*/, 5];
                // Delete existing anggota
                return [4 /*yield*/, prisma.anggotaKeluarga.deleteMany({
                        where: { questionnaireId: id_1 },
                    })];
            case 3:
                // Delete existing anggota
                _a.sent();
                // Create new anggota
                return [4 /*yield*/, prisma.anggotaKeluarga.createMany({
                        data: anggotaKeluarga.map(function (anggota, index) {
                            var tanggalLahir = new Date(anggota.tanggalLahir);
                            var umur = (0, dateUtils_1.calculateAge)(tanggalLahir);
                            return {
                                questionnaireId: id_1,
                                noUrut: index + 1,
                                nama: anggota.nama,
                                hubunganKeluarga: anggota.hubunganKeluarga,
                                tanggalLahir: tanggalLahir,
                                umur: umur, // Auto-calculated from tanggalLahir
                                jenisKelamin: anggota.jenisKelamin,
                                statusPerkawinan: anggota.statusPerkawinan,
                                sedangHamil: anggota.sedangHamil,
                                agama: anggota.agama,
                                pendidikan: anggota.pendidikan,
                                pekerjaan: anggota.pekerjaan,
                                nik: anggota.nik,
                                kartuJKN: anggota.kartuJKN,
                                merokok: anggota.merokok,
                                buangAirBesarJamban: anggota.buangAirBesarJamban,
                                airBersih: anggota.airBersih,
                                diagnosisTB: anggota.diagnosisTB,
                                obatTBC6Bulan: anggota.obatTBC6Bulan,
                                batukDarah2Minggu: anggota.batukDarah2Minggu,
                                diagnosisHipertensi: anggota.diagnosisHipertensi,
                                obatHipertensiTeratur: anggota.obatHipertensiTeratur,
                                pengukuranTekananDarah: anggota.pengukuranTekananDarah,
                                sistolik: anggota.sistolik,
                                diastolik: anggota.diastolik,
                                kontrasepsiKB: anggota.kontrasepsiKB,
                                melahirkanDiFaskes: anggota.melahirkanDiFaskes,
                                asiEksklusif: anggota.asiEksklusif,
                                imunisasiLengkap: anggota.imunisasiLengkap,
                                pemantauanPertumbuhanBalita: anggota.pemantauanPertumbuhanBalita,
                            };
                        }),
                    })];
            case 4:
                // Create new anggota
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                // If empty array is sent, log warning but don't delete
                console.warn("\u26A0\uFE0F Empty anggotaKeluarga array received for questionnaire ".concat(id_1, ". Keeping existing data to prevent accidental deletion."));
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                // anggotaKeluarga is undefined or not sent - keep existing data
                console.log("\u2139\uFE0F anggotaKeluarga not provided for questionnaire ".concat(id_1, ". Keeping existing data unchanged."));
                _a.label = 8;
            case 8:
                res.json({
                    success: true,
                    message: "Kuesioner berhasil diupdate",
                    data: updated,
                });
                return [3 /*break*/, 10];
            case 9:
                error_4 = _a.sent();
                console.error("Error updating questionnaire:", error_4);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengupdate kuesioner",
                    error: error_4.message,
                });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.updateQuestionnaireKS = updateQuestionnaireKS;
// Delete Questionnaire KS
var deleteQuestionnaireKS = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existing, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, prisma.questionnaire.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existing = _a.sent();
                if (!existing) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: "Kuesioner tidak ditemukan",
                        })];
                }
                // Delete (cascade akan auto-delete anggotaKeluarga)
                return [4 /*yield*/, prisma.questionnaire.delete({
                        where: { id: id },
                    })];
            case 2:
                // Delete (cascade akan auto-delete anggotaKeluarga)
                _a.sent();
                res.json({
                    success: true,
                    message: "Kuesioner berhasil dihapus",
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error("Error deleting questionnaire:", error_5);
                res.status(500).json({
                    success: false,
                    message: "Gagal menghapus kuesioner",
                    error: error_5.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteQuestionnaireKS = deleteQuestionnaireKS;
// Get Dashboard Stats for KS
var getKSDashboardStats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var today, _a, totalKuesioner, totalKeluarga, totalAnggotaKeluarga, kuesionerHariIni, kuesionerSelesai, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                today = new Date();
                today.setHours(0, 0, 0, 0);
                return [4 /*yield*/, Promise.all([
                        prisma.questionnaire.count(),
                        prisma.questionnaire.count(), // Total keluarga = total questionnaire
                        prisma.anggotaKeluarga.count(), // Total anggota keluarga (warga)
                        prisma.questionnaire.count({
                            where: {
                                createdAt: {
                                    gte: today,
                                },
                            },
                        }),
                        prisma.questionnaire.count({
                            where: {
                                status: "COMPLETED",
                            },
                        }),
                    ])];
            case 1:
                _a = _b.sent(), totalKuesioner = _a[0], totalKeluarga = _a[1], totalAnggotaKeluarga = _a[2], kuesionerHariIni = _a[3], kuesionerSelesai = _a[4];
                res.json({
                    success: true,
                    data: {
                        totalKuesioner: totalKuesioner,
                        totalKeluarga: totalKeluarga,
                        totalAnggotaKeluarga: totalAnggotaKeluarga,
                        kuesionerHariIni: kuesionerHariIni,
                        kuesionerSelesai: kuesionerSelesai,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error("Error fetching dashboard stats:", error_6);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil statistik dashboard",
                    error: error_6.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getKSDashboardStats = getKSDashboardStats;
