import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/reports/statistics - Statistik umum
router.get(
  "/statistics",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const {
        nik,
        nama,
        jenisKelamin,
        provinsiKode,
        kabupatenKode,
        kecamatanKode,
        desaKode,
        umurMin,
        umurMax,
      } = req.query;

      // Build where clause for questionnaire filter (CASCADE WILAYAH dengan KODE)
      const questionnaireWhere: any = {};
      if (nama) {
        questionnaireWhere.namaKepalaKeluarga = {
          contains: nama as string,
          mode: "insensitive",
        };
      }

      // CASCADE WILAYAH: Filter by KODE (bukan nama)
      if (provinsiKode) {
        questionnaireWhere.provinsiKode = provinsiKode as string;
      }
      if (kabupatenKode) {
        questionnaireWhere.kabupatenKode = kabupatenKode as string;
      }
      if (kecamatanKode) {
        questionnaireWhere.kecamatanKode = kecamatanKode as string;
      }
      if (desaKode) {
        questionnaireWhere.desaKode = desaKode as string;
      }

      // Build where clause for anggota keluarga filter (sesuai schema Prisma)
      const anggotaWhere: any = {};
      if (nik) {
        anggotaWhere.nik = { contains: nik as string };
      }

      // Filter by Jenis Kelamin (field yang ada di schema)
      if (jenisKelamin) {
        anggotaWhere.jenisKelamin =
          jenisKelamin === "Laki-laki" ? "PRIA" : "WANITA";
      }

      // Filter by Umur (field yang ada di schema)
      if (umurMin) {
        anggotaWhere.umur = {
          ...anggotaWhere.umur,
          gte: parseInt(umurMin as string),
        };
      }
      if (umurMax) {
        anggotaWhere.umur = {
          ...anggotaWhere.umur,
          lte: parseInt(umurMax as string),
        };
      }

      // Get filtered questionnaire IDs if needed
      let questionnaireIds: string[] | undefined;
      if (
        Object.keys(questionnaireWhere).length > 0 ||
        Object.keys(anggotaWhere).length > 0
      ) {
        const anggotaFilter: any = { ...anggotaWhere };

        const questionnaires = await prisma.questionnaire.findMany({
          where: {
            ...questionnaireWhere,
            ...(Object.keys(anggotaFilter).length > 0
              ? { anggotaKeluarga: { some: anggotaFilter } }
              : {}),
          },
          select: { id: true },
        });
        questionnaireIds = questionnaires.map((q) => q.id);

        // If no questionnaires match, return zero stats
        if (questionnaireIds.length === 0) {
          return res.json({
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
          });
        }
      }

      // Build final where for anggota keluarga counts
      const finalAnggotaWhere: any = { ...anggotaWhere };
      if (questionnaireIds) {
        finalAnggotaWhere.questionnaireId = { in: questionnaireIds };
      }

      // Total warga (anggota keluarga)
      const totalWarga = await prisma.anggotaKeluarga.count({
        where: finalAnggotaWhere,
      });

      // Laki-laki
      const lakiLaki = await prisma.anggotaKeluarga.count({
        where: { ...finalAnggotaWhere, jenisKelamin: "PRIA" },
      });

      // Perempuan
      const perempuan = await prisma.anggotaKeluarga.count({
        where: { ...finalAnggotaWhere, jenisKelamin: "WANITA" },
      });

      // Build where for gangguanKesehatan
      const gangguanWhere: any = {};
      if (questionnaireIds) {
        gangguanWhere.anggotaKeluarga = {
          questionnaireId: { in: questionnaireIds },
        };
      }

      // Layak (contoh: yang punya JKN)
      const layak = await prisma.gangguanKesehatan.count({
        where: { ...gangguanWhere, kartuJKN: "YA" },
      });

      // Distribusi jenis kelamin
      const distribusiKelamin = [
        { name: "Laki-laki", value: lakiLaki },
        { name: "Perempuan", value: perempuan },
      ];

      // Statistik Kesehatan berdasarkan GangguanKesehatan (field yang ADA di schema)
      const statistikKesehatan = [
        {
          name: "Punya JKN",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, kartuJKN: "YA" },
          }),
        },
        {
          name: "Tidak Punya JKN",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, kartuJKN: "TIDAK" },
          }),
        },
        {
          name: "Hipertensi",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, diagnosisHipertensi: "YA" },
          }),
        },
        {
          name: "TB",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, diagnosisTB: "YA" },
          }),
        },
        {
          name: "Merokok",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, merokok: "YA" },
          }),
        },
        {
          name: "KB",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, kontrasepsiKB: "YA" },
          }),
        },
        {
          name: "ASI Eksklusif",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, asiEksklusif: "YA" },
          }),
        },
        {
          name: "Imunisasi Lengkap",
          count: await prisma.gangguanKesehatan.count({
            where: { ...gangguanWhere, imunisasiLengkap: "YA" },
          }),
        },
      ];

      // Hitung total keluarga
      const totalKeluarga = await prisma.questionnaire.count({
        where: questionnaireWhere,
      });

      // Distribusi umur (kelompok umur)
      const distribusiUmur = [
        {
          name: "0-5 tahun",
          count: await prisma.anggotaKeluarga.count({
            where: { ...finalAnggotaWhere, umur: { gte: 0, lte: 5 } },
          }),
        },
        {
          name: "6-12 tahun",
          count: await prisma.anggotaKeluarga.count({
            where: { ...finalAnggotaWhere, umur: { gte: 6, lte: 12 } },
          }),
        },
        {
          name: "13-18 tahun",
          count: await prisma.anggotaKeluarga.count({
            where: { ...finalAnggotaWhere, umur: { gte: 13, lte: 18 } },
          }),
        },
        {
          name: "19-45 tahun",
          count: await prisma.anggotaKeluarga.count({
            where: { ...finalAnggotaWhere, umur: { gte: 19, lte: 45 } },
          }),
        },
        {
          name: "46-60 tahun",
          count: await prisma.anggotaKeluarga.count({
            where: { ...finalAnggotaWhere, umur: { gte: 46, lte: 60 } },
          }),
        },
        {
          name: "> 60 tahun",
          count: await prisma.anggotaKeluarga.count({
            where: { ...finalAnggotaWhere, umur: { gt: 60 } },
          }),
        },
      ];

      res.json({
        success: true,
        data: {
          totalKeluarga,
          totalWarga,
          lakiLaki,
          perempuan,
          distribusiKelamin,
          distribusiUmur,
          statistikKesehatan,
        },
      });
    } catch (error: any) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data statistik",
        error: error.message,
      });
    }
  }
);

// GET /api/reports/map-data - Data untuk peta sebaran
router.get(
  "/map-data",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const {
        nik,
        nama,
        jenisKelamin,
        provinsiKode,
        kabupatenKode,
        kecamatanKode,
        desaKode,
        umurMin,
        umurMax,
      } = req.query;

      // Build where clause (CASCADE WILAYAH dengan KODE)
      const where: any = {};
      if (nama) {
        where.namaKepalaKeluarga = {
          contains: nama as string,
          mode: "insensitive",
        };
      }

      // CASCADE WILAYAH: Filter by KODE
      if (provinsiKode) {
        where.provinsiKode = provinsiKode as string;
      }
      if (kabupatenKode) {
        where.kabupatenKode = kabupatenKode as string;
      }
      if (kecamatanKode) {
        where.kecamatanKode = kecamatanKode as string;
      }
      if (desaKode) {
        where.desaKode = desaKode as string;
      }

      // Build anggota keluarga filter (sesuai schema Prisma)
      const anggotaFilter: any = {};
      if (nik) {
        anggotaFilter.nik = { contains: nik as string };
      }
      if (jenisKelamin) {
        anggotaFilter.jenisKelamin =
          jenisKelamin === "Laki-laki" ? "PRIA" : "WANITA";
      }
      if (umurMin) {
        anggotaFilter.umur = { gte: parseInt(umurMin as string) };
      }
      if (umurMax) {
        anggotaFilter.umur = {
          ...anggotaFilter.umur,
          lte: parseInt(umurMax as string),
        };
      }

      // Apply anggota keluarga filter if any
      if (Object.keys(anggotaFilter).length > 0) {
        where.anggotaKeluarga = {
          some: anggotaFilter,
        };
      }

      // Ambil data questionnaire dengan koordinat GPS langsung
      const mapData = await prisma.questionnaire.findMany({
        where: {
          ...where,
          // Hanya ambil yang punya koordinat GPS
          latitude: { not: null },
          longitude: { not: null },
        },
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
      });

      res.json({
        success: true,
        data: mapData, // Data sudah include latitude & longitude dari questionnaire
      });
    } catch (error: any) {
      console.error("Error fetching map data:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data peta",
        error: error.message,
      });
    }
  }
);

// GET /api/reports/data-induk - Data induk dengan filter
router.get(
  "/data-induk",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const {
        nik,
        nama,
        jenisKelamin,
        provinsiKode,
        kabupatenKode,
        kecamatanKode,
        desaKode,
        umurMin,
        umurMax,
        page = "1",
        limit = "20",
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Build filter untuk Questionnaire (CASCADE WILAYAH dengan KODE)
      const where: any = {};

      // Filter Nama Kepala Keluarga
      if (nama) {
        where.namaKepalaKeluarga = {
          contains: nama as string,
          mode: "insensitive",
        };
      }

      // CASCADE WILAYAH: Filter by KODE
      if (provinsiKode) {
        where.provinsiKode = provinsiKode as string;
      }
      if (kabupatenKode) {
        where.kabupatenKode = kabupatenKode as string;
      }
      if (kecamatanKode) {
        where.kecamatanKode = kecamatanKode as string;
      }
      if (desaKode) {
        where.desaKode = desaKode as string;
      }

      // Build filter untuk Anggota Keluarga (sesuai schema Prisma)
      const anggotaFilter: any = {};
      if (nik) {
        anggotaFilter.nik = { contains: nik as string };
      }
      if (jenisKelamin) {
        anggotaFilter.jenisKelamin =
          jenisKelamin === "Laki-laki" ? "PRIA" : "WANITA";
      }
      if (umurMin) {
        anggotaFilter.umur = { gte: parseInt(umurMin as string) };
      }
      if (umurMax) {
        anggotaFilter.umur = {
          ...anggotaFilter.umur,
          lte: parseInt(umurMax as string),
        };
      }

      // Apply anggota keluarga filter
      if (Object.keys(anggotaFilter).length > 0) {
        where.anggotaKeluarga = {
          some: anggotaFilter,
        };
      }

      const [data, total] = await Promise.all([
        prisma.questionnaire.findMany({
          where,
          include: {
            anggotaKeluarga: {
              include: {
                gangguanKesehatan: true,
              },
            },
          },
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
        }),
        prisma.questionnaire.count({ where }),
      ]);

      res.json({
        success: true,
        data,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching data induk:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data induk",
        error: error.message,
      });
    }
  }
);

// GET /api/reports/wilayah/provinsi - Load daftar provinsi
router.get(
  "/wilayah/provinsi",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const provinsi = await prisma.provinsi.findMany({
        orderBy: { nama: "asc" },
      });
      res.json({ success: true, data: provinsi });
    } catch (error: any) {
      console.error("Error fetching provinsi:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data provinsi",
        error: error.message,
      });
    }
  }
);

// GET /api/reports/wilayah/kabupaten/:provinsiKode - Load kabupaten by provinsi
router.get(
  "/wilayah/kabupaten/:provinsiKode",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { provinsiKode } = req.params;
      const kabupaten = await prisma.kabupaten.findMany({
        where: { provinsiKode },
        orderBy: { nama: "asc" },
      });
      res.json({ success: true, data: kabupaten });
    } catch (error: any) {
      console.error("Error fetching kabupaten:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data kabupaten",
        error: error.message,
      });
    }
  }
);

// GET /api/reports/wilayah/kecamatan/:kabupatenKode - Load kecamatan by kabupaten
router.get(
  "/wilayah/kecamatan/:kabupatenKode",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { kabupatenKode } = req.params;
      const kecamatan = await prisma.kecamatan.findMany({
        where: { kabupatenKode },
        orderBy: { nama: "asc" },
      });
      res.json({ success: true, data: kecamatan });
    } catch (error: any) {
      console.error("Error fetching kecamatan:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data kecamatan",
        error: error.message,
      });
    }
  }
);

// GET /api/reports/wilayah/desa/:kecamatanKode - Load desa by kecamatan
router.get(
  "/wilayah/desa/:kecamatanKode",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { kecamatanKode } = req.params;
      const desa = await prisma.desa.findMany({
        where: { kecamatanKode },
        orderBy: { nama: "asc" },
      });
      res.json({ success: true, data: desa });
    } catch (error: any) {
      console.error("Error fetching desa:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data desa",
        error: error.message,
      });
    }
  }
);

export default router;
