"use strict";
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
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// GET all provinsi
router.get("/provinsi", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var provinsi, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.provinsi.findMany({
                        orderBy: { nama: "asc" },
                    })];
            case 1:
                provinsi = _a.sent();
                res.json(provinsi);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching provinsi:", error_1);
                res.status(500).json({ error: "Failed to fetch provinsi" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET kabupaten by provinsi kode
router.get("/kabupaten/:provinsiKode", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var provinsiKode, kabupaten, error_2;
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
                res.json(kabupaten);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching kabupaten:", error_2);
                res.status(500).json({ error: "Failed to fetch kabupaten" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET kecamatan by kabupaten kode
router.get("/kecamatan/:kabupatenKode", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var kabupatenKode, kecamatan, error_3;
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
                res.json(kecamatan);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error fetching kecamatan:", error_3);
                res.status(500).json({ error: "Failed to fetch kecamatan" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET desa by kecamatan kode
router.get("/desa/:kecamatanKode", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var kecamatanKode, desa, error_4;
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
                res.json(desa);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error fetching desa:", error_4);
                res.status(500).json({ error: "Failed to fetch desa" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
