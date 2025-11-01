import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { calculateAge } from "../utils/dateUtils";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

// Create Kuesioner KS dengan Anggota Keluarga
export const createQuestionnaireKS = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      // I. Pengenalan Tempat
      provinsi,
      kabupatenKota,
      kecamatan,
      namaPuskesmas,
      kodePuskesmas,
      desaKelurahan,
      rw,
      rt,
      noUrutBangunan,
      noUrutKeluarga,
      alamatRumah,
      latitude,
      longitude,

      // II. Keterangan Keluarga
      namaKepalaKeluarga,
      saranaAirBersih,
      jenisAirMinum,
      jambanKeluarga,
      jenisJamban,
      gangguanJiwaBerat,
      obatGangguanJiwa,
      anggotaDipasungi,

      // III. Keterangan Pengumpul Data
      namaPengumpulData,
      namaSupervisor,
      tanggalPengumpulan,

      // Jumlah Anggota (auto-calculated)
      jumlahAnggotaKeluarga,
      jumlahAnggotaDewasa,
      jumlahAnggotaUsia0_15,
      jumlahAnggotaUsia12_59,
      jumlahAnggotaUsia10_54,
      jumlahAnggotaUsia0_11,

      // IV. Anggota Keluarga (array)
      anggotaKeluarga,

      status = "DRAFT",
    } = req.body;

    // Validasi required fields
    if (
      !provinsi ||
      !kabupatenKota ||
      !kecamatan ||
      !namaPuskesmas ||
      !desaKelurahan ||
      !rw ||
      !rt ||
      !namaKepalaKeluarga ||
      !namaPengumpulData
    ) {
      return res.status(400).json({
        success: false,
        message: "Field wajib tidak boleh kosong",
      });
    }

    if (!anggotaKeluarga || anggotaKeluarga.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal harus ada 1 anggota keluarga",
      });
    }

    // Create Questionnaire dengan nested Anggota Keluarga
    const questionnaire = await prisma.questionnaire.create({
      data: {
        // I. Pengenalan Tempat
        provinsi,
        kabupatenKota,
        kecamatan,
        namaPuskesmas,
        kodePuskesmas,
        desaKelurahan,
        rw,
        rt,
        noUrutBangunan,
        noUrutKeluarga,
        alamatRumah,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,

        // II. Keterangan Keluarga
        namaKepalaKeluarga,
        saranaAirBersih,
        jenisAirMinum,
        jambanKeluarga,
        jenisJamban,
        gangguanJiwaBerat,
        obatGangguanJiwa,
        anggotaDipasungi,

        // III. Keterangan Pengumpul Data
        namaPengumpulData,
        namaSupervisor,
        tanggalPengumpulan: tanggalPengumpulan
          ? new Date(tanggalPengumpulan)
          : new Date(),

        // Jumlah Anggota
        jumlahAnggotaKeluarga,
        jumlahAnggotaDewasa,
        jumlahAnggotaUsia0_15,
        jumlahAnggotaUsia12_59,
        jumlahAnggotaUsia10_54,
        jumlahAnggotaUsia0_11,

        status,
        createdBy: req.user.id,

        // Nested Create Anggota Keluarga
        anggotaKeluarga: {
          create: anggotaKeluarga.map((anggota: any, index: number) => {
            const tanggalLahir = new Date(anggota.tanggalLahir);
            const umur = calculateAge(tanggalLahir);

            return {
              noUrut: index + 1,
              nama: anggota.nama,
              hubunganKeluarga: anggota.hubunganKeluarga,
              tanggalLahir,
              umur, // Auto-calculated from tanggalLahir
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
    });

    res.status(201).json({
      success: true,
      message: "Kuesioner KS berhasil dibuat",
      data: questionnaire,
    });
  } catch (error: any) {
    console.error("Error creating questionnaire KS:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat kuesioner KS",
      error: error.message,
    });
  }
};

// Get All Questionnaire KS (dengan pagination)
export const getAllQuestionnaireKS = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          namaKepalaKeluarga: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        { provinsi: { contains: search as string, mode: "insensitive" } },
        { kabupatenKota: { contains: search as string, mode: "insensitive" } },
        { desaKelurahan: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [questionnaires, total] = await Promise.all([
      prisma.questionnaire.findMany({
        where,
        skip,
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
  } catch (error: any) {
    console.error("Error fetching questionnaires:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kuesioner",
      error: error.message,
    });
  }
};

// Get Questionnaire KS by ID
export const getQuestionnaireKSById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
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
  } catch (error: any) {
    console.error("Error fetching questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail kuesioner",
      error: error.message,
    });
  }
};

// Update Questionnaire KS
export const updateQuestionnaireKS = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if questionnaire exists
    const existing = await prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Kuesioner tidak ditemukan",
      });
    }

    // Handle Anggota Keluarga update separately
    let anggotaKeluarga = updateData.anggotaKeluarga;
    delete updateData.anggotaKeluarga;

    // Update Questionnaire
    const updated = await prisma.questionnaire.update({
      where: { id },
      data: {
        ...updateData,
        tanggalPengumpulan: updateData.tanggalPengumpulan
          ? new Date(updateData.tanggalPengumpulan)
          : undefined,
        latitude: updateData.latitude
          ? parseFloat(updateData.latitude)
          : undefined,
        longitude: updateData.longitude
          ? parseFloat(updateData.longitude)
          : undefined,
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
    });

    // Update Anggota Keluarga ONLY if provided and has data
    // IMPORTANT: Only update if anggotaKeluarga is explicitly provided AND not undefined
    // This prevents accidental deletion when updating other tabs
    // CRITICAL: We check !== undefined (not just truthy) because empty array [] is valid but should NOT trigger update
    if (anggotaKeluarga !== undefined && Array.isArray(anggotaKeluarga)) {
      // ONLY proceed if there's actual data to update
      // If empty array is sent, it means user explicitly wants to keep existing data unchanged
      // DO NOT delete if array is empty - this prevents data loss!
      if (anggotaKeluarga.length > 0) {
        // Delete existing anggota
        await prisma.anggotaKeluarga.deleteMany({
          where: { questionnaireId: id },
        });

        // Create new anggota
        await prisma.anggotaKeluarga.createMany({
          data: anggotaKeluarga.map((anggota: any, index: number) => {
            const tanggalLahir = new Date(anggota.tanggalLahir);
            const umur = calculateAge(tanggalLahir);

            return {
              questionnaireId: id,
              noUrut: index + 1,
              nama: anggota.nama,
              hubunganKeluarga: anggota.hubunganKeluarga,
              tanggalLahir,
              umur, // Auto-calculated from tanggalLahir
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
        });
      } else {
        // If empty array is sent, log warning but don't delete
        console.warn(
          `⚠️ Empty anggotaKeluarga array received for questionnaire ${id}. Keeping existing data to prevent accidental deletion.`
        );
      }
    } else {
      // anggotaKeluarga is undefined or not sent - keep existing data
      console.log(
        `ℹ️ anggotaKeluarga not provided for questionnaire ${id}. Keeping existing data unchanged.`
      );
    }

    res.json({
      success: true,
      message: "Kuesioner berhasil diupdate",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate kuesioner",
      error: error.message,
    });
  }
};

// Delete Questionnaire KS
export const deleteQuestionnaireKS = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if exists
    const existing = await prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Kuesioner tidak ditemukan",
      });
    }

    // Delete (cascade akan auto-delete anggotaKeluarga)
    await prisma.questionnaire.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Kuesioner berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Error deleting questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus kuesioner",
      error: error.message,
    });
  }
};

// Get Dashboard Stats for KS
export const getKSDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalKuesioner,
      totalKeluarga,
      totalAnggotaKeluarga,
      kuesionerHariIni,
      kuesionerSelesai,
    ] = await Promise.all([
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
    ]);

    res.json({
      success: true,
      data: {
        totalKuesioner,
        totalKeluarga,
        totalAnggotaKeluarga,
        kuesionerHariIni,
        kuesionerSelesai,
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik dashboard",
      error: error.message,
    });
  }
};
