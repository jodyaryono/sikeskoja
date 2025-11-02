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
var express_1 = require("express");
var client_1 = require("@prisma/client");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// GET /api/reports/statistics - Statistik umum
router.get("/statistics", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nik, nama, jenisKelamin, provinsiKode, kabupatenKode, kecamatanKode, desaKode, umurMin, umurMax, questionnaireWhere, anggotaWhere, questionnaireIds, anggotaFilter, questionnaires, finalAnggotaWhere, totalWarga, lakiLaki, perempuan, gangguanWhere, layak, distribusiKelamin, statistikKesehatan, _b, totalKeluarga, distribusiUmur, _c, error_1;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0:
                _t.trys.push([0, 22, , 23]);
                _a = req.query, nik = _a.nik, nama = _a.nama, jenisKelamin = _a.jenisKelamin, provinsiKode = _a.provinsiKode, kabupatenKode = _a.kabupatenKode, kecamatanKode = _a.kecamatanKode, desaKode = _a.desaKode, umurMin = _a.umurMin, umurMax = _a.umurMax;
                questionnaireWhere = {};
                if (nama) {
                    questionnaireWhere.namaKepalaKeluarga = {
                        contains: nama,
                        mode: "insensitive",
                    };
                }
                // CASCADE WILAYAH: Filter by KODE (bukan nama)
                if (provinsiKode) {
                    questionnaireWhere.provinsiKode = provinsiKode;
                }
                if (kabupatenKode) {
                    questionnaireWhere.kabupatenKode = kabupatenKode;
                }
                if (kecamatanKode) {
                    questionnaireWhere.kecamatanKode = kecamatanKode;
                }
                if (desaKode) {
                    questionnaireWhere.desaKode = desaKode;
                }
                anggotaWhere = {};
                if (nik) {
                    anggotaWhere.nik = { contains: nik };
                }
                // Filter by Jenis Kelamin (field yang ada di schema)
                if (jenisKelamin) {
                    anggotaWhere.jenisKelamin =
                        jenisKelamin === "Laki-laki" ? "PRIA" : "WANITA";
                }
                // Filter by Umur (field yang ada di schema)
                if (umurMin) {
                    anggotaWhere.umur = __assign(__assign({}, anggotaWhere.umur), { gte: parseInt(umurMin) });
                }
                if (umurMax) {
                    anggotaWhere.umur = __assign(__assign({}, anggotaWhere.umur), { lte: parseInt(umurMax) });
                }
                questionnaireIds = void 0;
                if (!(Object.keys(questionnaireWhere).length > 0 ||
                    Object.keys(anggotaWhere).length > 0)) return [3 /*break*/, 2];
                anggotaFilter = __assign({}, anggotaWhere);
                return [4 /*yield*/, prisma.questionnaire.findMany({
                        where: __assign(__assign({}, questionnaireWhere), (Object.keys(anggotaFilter).length > 0
                            ? { anggotaKeluarga: { some: anggotaFilter } }
                            : {})),
                        select: { id: true },
                    })];
            case 1:
                questionnaires = _t.sent();
                questionnaireIds = questionnaires.map(function (q) { return q.id; });
                // If no questionnaires match, return zero stats
                if (questionnaireIds.length === 0) {
                    return [2 /*return*/, res.json({
                            success: true,
                            data: {
                                totalKeluarga: 0,
                                totalWarga: 0,
                                lakiLaki: 0,
                                perempuan: 0,
                                distribusiKelamin: [
                                    { name: "Laki-laki", value: 0 },
                                    { name: "Perempuan", value: 0 },
                                ],
                                distribusiUmur: [
                                    { name: "0-5 tahun", count: 0 },
                                    { name: "6-12 tahun", count: 0 },
                                    { name: "13-18 tahun", count: 0 },
                                    { name: "19-45 tahun", count: 0 },
                                    { name: "46-60 tahun", count: 0 },
                                    { name: "> 60 tahun", count: 0 },
                                ],
                                statistikKesehatan: [
                                    { name: "Punya JKN", count: 0 },
                                    { name: "Tidak Punya JKN", count: 0 },
                                    { name: "Hipertensi", count: 0 },
                                    { name: "TB", count: 0 },
                                    { name: "Merokok", count: 0 },
                                    { name: "KB", count: 0 },
                                    { name: "ASI Eksklusif", count: 0 },
                                    { name: "Imunisasi Lengkap", count: 0 },
                                ],
                            },
                        })];
                }
                _t.label = 2;
            case 2:
                finalAnggotaWhere = __assign({}, anggotaWhere);
                if (questionnaireIds) {
                    finalAnggotaWhere.questionnaireId = { in: questionnaireIds };
                }
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: finalAnggotaWhere,
                    })];
            case 3:
                totalWarga = _t.sent();
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { jenisKelamin: "PRIA" }),
                    })];
            case 4:
                lakiLaki = _t.sent();
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { jenisKelamin: "WANITA" }),
                    })];
            case 5:
                perempuan = _t.sent();
                gangguanWhere = {};
                if (questionnaireIds) {
                    gangguanWhere.anggotaKeluarga = {
                        questionnaireId: { in: questionnaireIds },
                    };
                }
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { kartuJKN: "YA" }),
                    })];
            case 6:
                layak = _t.sent();
                distribusiKelamin = [
                    { name: "Laki-laki", value: lakiLaki },
                    { name: "Perempuan", value: perempuan },
                ];
                _d = {
                    name: "Punya JKN"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { kartuJKN: "YA" }),
                    })];
            case 7:
                _b = [
                    (_d.count = _t.sent(),
                        _d)
                ];
                _e = {
                    name: "Tidak Punya JKN"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { kartuJKN: "TIDAK" }),
                    })];
            case 8:
                _b = _b.concat([
                    (_e.count = _t.sent(),
                        _e)
                ]);
                _f = {
                    name: "Hipertensi"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { diagnosisHipertensi: "YA" }),
                    })];
            case 9:
                _b = _b.concat([
                    (_f.count = _t.sent(),
                        _f)
                ]);
                _g = {
                    name: "TB"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { diagnosisTB: "YA" }),
                    })];
            case 10:
                _b = _b.concat([
                    (_g.count = _t.sent(),
                        _g)
                ]);
                _h = {
                    name: "Merokok"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { merokok: "YA" }),
                    })];
            case 11:
                _b = _b.concat([
                    (_h.count = _t.sent(),
                        _h)
                ]);
                _j = {
                    name: "KB"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { kontrasepsiKB: "YA" }),
                    })];
            case 12:
                _b = _b.concat([
                    (_j.count = _t.sent(),
                        _j)
                ]);
                _k = {
                    name: "ASI Eksklusif"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { asiEksklusif: "YA" }),
                    })];
            case 13:
                _b = _b.concat([
                    (_k.count = _t.sent(),
                        _k)
                ]);
                _l = {
                    name: "Imunisasi Lengkap"
                };
                return [4 /*yield*/, prisma.gangguanKesehatan.count({
                        where: __assign(__assign({}, gangguanWhere), { imunisasiLengkap: "YA" }),
                    })];
            case 14:
                statistikKesehatan = _b.concat([
                    (_l.count = _t.sent(),
                        _l)
                ]);
                return [4 /*yield*/, prisma.questionnaire.count({
                        where: questionnaireWhere,
                    })];
            case 15:
                totalKeluarga = _t.sent();
                _m = {
                    name: "0-5 tahun"
                };
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { umur: { gte: 0, lte: 5 } }),
                    })];
            case 16:
                _c = [
                    (_m.count = _t.sent(),
                        _m)
                ];
                _o = {
                    name: "6-12 tahun"
                };
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { umur: { gte: 6, lte: 12 } }),
                    })];
            case 17:
                _c = _c.concat([
                    (_o.count = _t.sent(),
                        _o)
                ]);
                _p = {
                    name: "13-18 tahun"
                };
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { umur: { gte: 13, lte: 18 } }),
                    })];
            case 18:
                _c = _c.concat([
                    (_p.count = _t.sent(),
                        _p)
                ]);
                _q = {
                    name: "19-45 tahun"
                };
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { umur: { gte: 19, lte: 45 } }),
                    })];
            case 19:
                _c = _c.concat([
                    (_q.count = _t.sent(),
                        _q)
                ]);
                _r = {
                    name: "46-60 tahun"
                };
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { umur: { gte: 46, lte: 60 } }),
                    })];
            case 20:
                _c = _c.concat([
                    (_r.count = _t.sent(),
                        _r)
                ]);
                _s = {
                    name: "> 60 tahun"
                };
                return [4 /*yield*/, prisma.anggotaKeluarga.count({
                        where: __assign(__assign({}, finalAnggotaWhere), { umur: { gt: 60 } }),
                    })];
            case 21:
                distribusiUmur = _c.concat([
                    (_s.count = _t.sent(),
                        _s)
                ]);
                res.json({
                    success: true,
                    data: {
                        totalKeluarga: totalKeluarga,
                        totalWarga: totalWarga,
                        lakiLaki: lakiLaki,
                        perempuan: perempuan,
                        distribusiKelamin: distribusiKelamin,
                        distribusiUmur: distribusiUmur,
                        statistikKesehatan: statistikKesehatan,
                    },
                });
                return [3 /*break*/, 23];
            case 22:
                error_1 = _t.sent();
                console.error("Error fetching statistics:", error_1);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data statistik",
                    error: error_1.message,
                });
                return [3 /*break*/, 23];
            case 23: return [2 /*return*/];
        }
    });
}); });
// GET /api/reports/map-data - Data untuk peta sebaran
router.get("/map-data", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nik, nama, jenisKelamin, provinsiKode, kabupatenKode, kecamatanKode, desaKode, umurMin, umurMax, where, anggotaFilter, mapData, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, nik = _a.nik, nama = _a.nama, jenisKelamin = _a.jenisKelamin, provinsiKode = _a.provinsiKode, kabupatenKode = _a.kabupatenKode, kecamatanKode = _a.kecamatanKode, desaKode = _a.desaKode, umurMin = _a.umurMin, umurMax = _a.umurMax;
                where = {};
                if (nama) {
                    where.namaKepalaKeluarga = {
                        contains: nama,
                        mode: "insensitive",
                    };
                }
                // CASCADE WILAYAH: Filter by KODE
                if (provinsiKode) {
                    where.provinsiKode = provinsiKode;
                }
                if (kabupatenKode) {
                    where.kabupatenKode = kabupatenKode;
                }
                if (kecamatanKode) {
                    where.kecamatanKode = kecamatanKode;
                }
                if (desaKode) {
                    where.desaKode = desaKode;
                }
                anggotaFilter = {};
                if (nik) {
                    anggotaFilter.nik = { contains: nik };
                }
                if (jenisKelamin) {
                    anggotaFilter.jenisKelamin =
                        jenisKelamin === "Laki-laki" ? "PRIA" : "WANITA";
                }
                if (umurMin) {
                    anggotaFilter.umur = { gte: parseInt(umurMin) };
                }
                if (umurMax) {
                    anggotaFilter.umur = __assign(__assign({}, anggotaFilter.umur), { lte: parseInt(umurMax) });
                }
                // Apply anggota keluarga filter if any
                if (Object.keys(anggotaFilter).length > 0) {
                    where.anggotaKeluarga = {
                        some: anggotaFilter,
                    };
                }
                return [4 /*yield*/, prisma.questionnaire.findMany({
                        where: __assign(__assign({}, where), { 
                            // Hanya ambil yang punya koordinat GPS
                            latitude: { not: null }, longitude: { not: null } }),
                        select: {
                            id: true,
                            namaKepalaKeluarga: true,
                            alamatRumah: true,
                            desaKelurahan: true,
                            kecamatan: true,
                            kabupatenKota: true,
                            provinsi: true,
                            latitude: true,
                            longitude: true,
                        },
                    })];
            case 1:
                mapData = _b.sent();
                res.json({
                    success: true,
                    data: mapData, // Data sudah include latitude & longitude dari questionnaire
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error("Error fetching map data:", error_2);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data peta",
                    error: error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/reports/data-induk - Data induk dengan filter
router.get("/data-induk", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nik, nama, jenisKelamin, provinsiKode, kabupatenKode, kecamatanKode, desaKode, umurMin, umurMax, _b, page, _c, limit, skip, where, anggotaFilter, _d, data, total, error_3;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, nik = _a.nik, nama = _a.nama, jenisKelamin = _a.jenisKelamin, provinsiKode = _a.provinsiKode, kabupatenKode = _a.kabupatenKode, kecamatanKode = _a.kecamatanKode, desaKode = _a.desaKode, umurMin = _a.umurMin, umurMax = _a.umurMax, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "20" : _c;
                skip = (parseInt(page) - 1) * parseInt(limit);
                where = {};
                // Filter Nama Kepala Keluarga
                if (nama) {
                    where.namaKepalaKeluarga = {
                        contains: nama,
                        mode: "insensitive",
                    };
                }
                // CASCADE WILAYAH: Filter by KODE
                if (provinsiKode) {
                    where.provinsiKode = provinsiKode;
                }
                if (kabupatenKode) {
                    where.kabupatenKode = kabupatenKode;
                }
                if (kecamatanKode) {
                    where.kecamatanKode = kecamatanKode;
                }
                if (desaKode) {
                    where.desaKode = desaKode;
                }
                anggotaFilter = {};
                if (nik) {
                    anggotaFilter.nik = { contains: nik };
                }
                if (jenisKelamin) {
                    anggotaFilter.jenisKelamin =
                        jenisKelamin === "Laki-laki" ? "PRIA" : "WANITA";
                }
                if (umurMin) {
                    anggotaFilter.umur = { gte: parseInt(umurMin) };
                }
                if (umurMax) {
                    anggotaFilter.umur = __assign(__assign({}, anggotaFilter.umur), { lte: parseInt(umurMax) });
                }
                // Apply anggota keluarga filter
                if (Object.keys(anggotaFilter).length > 0) {
                    where.anggotaKeluarga = {
                        some: anggotaFilter,
                    };
                }
                return [4 /*yield*/, Promise.all([
                        prisma.questionnaire.findMany({
                            where: where,
                            include: {
                                anggotaKeluarga: {
                                    include: {
                                        gangguanKesehatan: true,
                                    },
                                },
                            },
                            skip: skip,
                            take: parseInt(limit),
                            orderBy: { createdAt: "desc" },
                        }),
                        prisma.questionnaire.count({ where: where }),
                    ])];
            case 1:
                _d = _e.sent(), data = _d[0], total = _d[1];
                res.json({
                    success: true,
                    data: data,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: total,
                        totalPages: Math.ceil(total / parseInt(limit)),
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _e.sent();
                console.error("Error fetching data induk:", error_3);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data induk",
                    error: error_3.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/reports/wilayah/provinsi - Load daftar provinsi
router.get("/wilayah/provinsi", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var provinsi, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.provinsi.findMany({
                        orderBy: { nama: "asc" },
                    })];
            case 1:
                provinsi = _a.sent();
                res.json({ success: true, data: provinsi });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error fetching provinsi:", error_4);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data provinsi",
                    error: error_4.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/reports/wilayah/kabupaten/:provinsiKode - Load kabupaten by provinsi
router.get("/wilayah/kabupaten/:provinsiKode", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var provinsiKode, kabupaten, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                provinsiKode = req.params.provinsiKode;
                return [4 /*yield*/, prisma.kabupaten.findMany({
                        where: { provinsiKode: provinsiKode },
                        orderBy: { nama: "asc" },
                    })];
            case 1:
                kabupaten = _a.sent();
                res.json({ success: true, data: kabupaten });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error fetching kabupaten:", error_5);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data kabupaten",
                    error: error_5.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/reports/wilayah/kecamatan/:kabupatenKode - Load kecamatan by kabupaten
router.get("/wilayah/kecamatan/:kabupatenKode", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var kabupatenKode, kecamatan, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                kabupatenKode = req.params.kabupatenKode;
                return [4 /*yield*/, prisma.kecamatan.findMany({
                        where: { kabupatenKode: kabupatenKode },
                        orderBy: { nama: "asc" },
                    })];
            case 1:
                kecamatan = _a.sent();
                res.json({ success: true, data: kecamatan });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Error fetching kecamatan:", error_6);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data kecamatan",
                    error: error_6.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/reports/wilayah/desa/:kecamatanKode - Load desa by kecamatan
router.get("/wilayah/desa/:kecamatanKode", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var kecamatanKode, desa, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                kecamatanKode = req.params.kecamatanKode;
                return [4 /*yield*/, prisma.desa.findMany({
                        where: { kecamatanKode: kecamatanKode },
                        orderBy: { nama: "asc" },
                    })];
            case 1:
                desa = _a.sent();
                res.json({ success: true, data: desa });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error("Error fetching desa:", error_7);
                res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data desa",
                    error: error_7.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
