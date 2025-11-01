import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Script untuk menambahkan data kesehatan COMPREHENSIVE ke semua anggota keluarga
 * Mencakup semua case dari form B. Gangguan Kesehatan:
 * - Kartu JKN (semua umur)
 * - Merokok (semua umur)
 * - Buang air besar di jamban (≥15 tahun)
 * - Air bersih (≥15 tahun)
 * - Diagnosis TB dan obat TBC 6 bulan (≥15 tahun)
 * - Batuk darah ≥2 minggu (≥15 tahun)
 * - Diagnosis hipertensi (≥15 tahun)
 * - Obat hipertensi teratur (≥15 tahun)
 * - Pengukuran tekanan darah (≥15 tahun)
 * - Kontrasepsi KB (wanita 10-54 tahun)
 * - Melahirkan di fasilitas kesehatan (ibu dengan AK <12 bulan)
 * - ASI eksklusif (bayi 0-6 bulan)
 * - Imunisasi lengkap (bayi 12-23 bulan)
 * - Pemantauan pertumbuhan balita (AK 2-59 bulan)
 */

async function main() {
  console.log("🏥 Menambahkan data kesehatan comprehensive...");

  // Ambil semua anggota keluarga
  const allAnggota = await prisma.anggotaKeluarga.findMany({
    orderBy: [{ questionnaireId: "asc" }, { noUrut: "asc" }],
  });

  console.log(`📊 Total anggota keluarga: ${allAnggota.length}`);

  let successCount = 0;
  let updateCount = 0;

  for (const anggota of allAnggota) {
    const umur = anggota.umur;
    const jenisKelamin = anggota.jenisKelamin;

    // Data dasar untuk semua umur
    const healthData: any = {
      anggotaKeluargaId: anggota.id,
      // Semua umur
      kartuJKN: Math.random() > 0.1 ? "YA" : "TIDAK", // 90% punya JKN
      merokok: Math.random() > 0.7 ? "YA" : "TIDAK", // 30% merokok
    };

    // Untuk usia ≥ 15 tahun
    if (umur >= 15) {
      healthData.buangAirBesarJamban = Math.random() > 0.05 ? "YA" : "TIDAK"; // 95% pakai jamban
      healthData.airBersih = Math.random() > 0.1 ? "YA" : "TIDAK"; // 90% akses air bersih

      // TB cases (5% populasi)
      const hasTB = Math.random() > 0.95;
      healthData.diagnosisTB = hasTB ? "YA" : "TIDAK";
      if (hasTB) {
        healthData.obatTBC6Bulan = Math.random() > 0.2 ? "YA" : "TIDAK"; // 80% yang TB minum obat
        healthData.batukDarah2Minggu = Math.random() > 0.7 ? "YA" : "TIDAK"; // 30% batuk darah
      } else {
        healthData.obatTBC6Bulan = "TIDAK";
        healthData.batukDarah2Minggu = "TIDAK";
      }

      // Hipertensi cases (lebih tinggi untuk usia >40)
      const hipertensiChance = umur > 40 ? 0.3 : 0.1; // 30% untuk >40th, 10% untuk <40th
      const hasHipertensi = Math.random() < hipertensiChance;
      healthData.diagnosisHipertensi = hasHipertensi ? "YA" : "TIDAK";

      if (hasHipertensi) {
        healthData.obatHipertensiTeratur = Math.random() > 0.3 ? "YA" : "TIDAK"; // 70% minum obat teratur
      } else {
        healthData.obatHipertensiTeratur = "TIDAK";
      }

      // Pengukuran tekanan darah (semua ≥15 tahun)
      healthData.pengukuranTekananDarah = Math.random() > 0.2 ? "YA" : "TIDAK"; // 80% pernah diukur

      if (healthData.pengukuranTekananDarah === "YA") {
        // Generate realistic blood pressure
        if (hasHipertensi) {
          healthData.sistolik = 140 + Math.floor(Math.random() * 40); // 140-180
          healthData.diastolik = 90 + Math.floor(Math.random() * 20); // 90-110
        } else {
          healthData.sistolik = 100 + Math.floor(Math.random() * 30); // 100-130
          healthData.diastolik = 60 + Math.floor(Math.random() * 30); // 60-90
        }
      }
    }

    // Wanita usia 10-54 tahun - KB
    if (jenisKelamin === "WANITA" && umur >= 10 && umur <= 54) {
      // KB hanya untuk yang sudah menikah (asumsi >18 tahun)
      if (umur >= 18) {
        healthData.kontrasepsiKB = Math.random() > 0.4 ? "YA" : "TIDAK"; // 60% pakai KB
      } else {
        healthData.kontrasepsiKB = "TIDAK";
      }
    }

    // Ibu yang memiliki anak < 12 bulan
    // (Simplified: anggota dengan hubungan ISTRI_SUAMI dan ada anak umur <1 tahun di keluarga yang sama)
    if (
      jenisKelamin === "WANITA" &&
      anggota.hubunganKeluarga === "ISTRI_SUAMI"
    ) {
      // Check if ada anak <1 tahun
      const anakBalita = await prisma.anggotaKeluarga.findFirst({
        where: {
          questionnaireId: anggota.questionnaireId,
          umur: { lt: 1 },
        },
      });

      if (anakBalita) {
        healthData.melahirkanDiFaskes = Math.random() > 0.15 ? "YA" : "TIDAK"; // 85% melahirkan di faskes
      }
    }

    // Bayi 0-6 bulan - ASI eksklusif
    if (umur < 1) {
      healthData.asiEksklusif = Math.random() > 0.3 ? "YA" : "TIDAK"; // 70% ASI eksklusif
    }

    // Bayi 12-23 bulan - Imunisasi lengkap
    if (umur >= 1 && umur < 2) {
      healthData.imunisasiLengkap = Math.random() > 0.2 ? "YA" : "TIDAK"; // 80% imunisasi lengkap
    }

    // Anak 2-59 bulan (2-5 tahun) - Pemantauan pertumbuhan balita
    if (umur >= 2 && umur < 5) {
      healthData.pemantauanPertumbuhanBalita =
        Math.random() > 0.25 ? "YA" : "TIDAK"; // 75% dipantau
    }

    // Catatan tambahan (random cases)
    const catatanOptions = [
      null,
      "Rutin kontrol kesehatan setiap bulan",
      "Alergi obat tertentu",
      "Riwayat operasi tahun lalu",
      "Sedang dalam pengobatan",
      "Perlu perhatian khusus",
    ];
    healthData.catatan =
      catatanOptions[Math.floor(Math.random() * catatanOptions.length)];

    try {
      // Upsert - update jika sudah ada, create jika belum
      await prisma.gangguanKesehatan.upsert({
        where: {
          anggotaKeluargaId: anggota.id,
        },
        update: healthData,
        create: healthData,
      });

      successCount++;

      // Log setiap 10 data
      if (successCount % 10 === 0) {
        console.log(
          `✅ Processed ${successCount}/${allAnggota.length} anggota...`
        );
      }
    } catch (error) {
      console.error(`❌ Error untuk ${anggota.nama}:`, error);
    }
  }

  console.log(
    `\n✅ Selesai! Total data kesehatan ditambahkan: ${successCount}/${allAnggota.length}`
  );

  // Summary statistics
  const stats = await prisma.gangguanKesehatan.groupBy({
    by: ["kartuJKN"],
    _count: true,
  });

  console.log("\n📊 Statistik Data Kesehatan:");
  console.log(
    `Total data kesehatan: ${await prisma.gangguanKesehatan.count()}`
  );

  const jknYa = await prisma.gangguanKesehatan.count({
    where: { kartuJKN: "YA" },
  });
  const hipertensi = await prisma.gangguanKesehatan.count({
    where: { diagnosisHipertensi: "YA" },
  });
  const tb = await prisma.gangguanKesehatan.count({
    where: { diagnosisTB: "YA" },
  });
  const merokok = await prisma.gangguanKesehatan.count({
    where: { merokok: "YA" },
  });
  const kb = await prisma.gangguanKesehatan.count({
    where: { kontrasepsiKB: "YA" },
  });
  const asi = await prisma.gangguanKesehatan.count({
    where: { asiEksklusif: "YA" },
  });
  const imunisasi = await prisma.gangguanKesehatan.count({
    where: { imunisasiLengkap: "YA" },
  });

  console.log(`- Memiliki JKN: ${jknYa}`);
  console.log(`- Diagnosis Hipertensi: ${hipertensi}`);
  console.log(`- Diagnosis TB: ${tb}`);
  console.log(`- Merokok: ${merokok}`);
  console.log(`- Pengguna KB: ${kb}`);
  console.log(`- ASI Eksklusif: ${asi}`);
  console.log(`- Imunisasi Lengkap: ${imunisasi}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
