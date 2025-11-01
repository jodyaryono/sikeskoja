import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏥 Adding health data to existing family members...");

  // Get all anggota keluarga
  const allMembers = await prisma.anggotaKeluarga.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${allMembers.length} family members`);

  for (const member of allMembers) {
    // Skip if already has health data
    const existing = await prisma.gangguanKesehatan.findUnique({
      where: { anggotaKeluargaId: member.id },
    });

    if (existing) {
      console.log(`⏭️  Skipping ${member.nama} - already has health data`);
      continue;
    }

    // Generate random health data based on age
    const healthData: any = {
      anggotaKeluargaId: member.id,
      kartuJKN: Math.random() > 0.1 ? "YA" : "TIDAK", // 90% punya JKN
      merokok:
        member.jenisKelamin === "PRIA" && member.umur >= 15
          ? Math.random() > 0.6
            ? "YA"
            : "TIDAK" // 40% pria dewasa merokok
          : "TIDAK",
    };

    // Data untuk umur >= 15 tahun
    if (member.umur >= 15) {
      healthData.buangAirBesarJamban = Math.random() > 0.05 ? "YA" : "TIDAK"; // 95% pakai jamban
      healthData.airBersih = Math.random() > 0.1 ? "YA" : "TIDAK"; // 90% ada air bersih
      healthData.diagnosisTB = Math.random() > 0.95 ? "YA" : "TIDAK"; // 5% TB
      healthData.obatTBC6Bulan =
        healthData.diagnosisTB === "YA" ? "YA" : "TIDAK";
      healthData.batukDarah2Minggu = "TIDAK";
      healthData.diagnosisHipertensi =
        member.umur >= 40 ? (Math.random() > 0.7 ? "YA" : "TIDAK") : "TIDAK"; // 30% lansia hipertensi
      healthData.obatHipertensiTeratur =
        healthData.diagnosisHipertensi === "YA"
          ? Math.random() > 0.3
            ? "YA"
            : "TIDAK"
          : null;
      healthData.pengukuranTekananDarah = Math.random() > 0.4 ? "YA" : "TIDAK"; // 60% pernah diukur

      if (healthData.pengukuranTekananDarah === "YA") {
        healthData.sistolik =
          healthData.diagnosisHipertensi === "YA"
            ? Math.floor(Math.random() * 30) + 140 // 140-170
            : Math.floor(Math.random() * 20) + 110; // 110-130
        healthData.diastolik =
          healthData.diagnosisHipertensi === "YA"
            ? Math.floor(Math.random() * 15) + 90 // 90-105
            : Math.floor(Math.random() * 15) + 70; // 70-85
      }
    }

    // Wanita usia 10-54 tahun
    if (
      member.jenisKelamin === "WANITA" &&
      member.umur >= 10 &&
      member.umur <= 54
    ) {
      if (member.statusPerkawinan === "Kawin") {
        healthData.kontrasepsiKB = Math.random() > 0.5 ? "YA" : "TIDAK"; // 50% pakai KB
      }
    }

    // Ibu dengan anak < 12 bulan (simplified - random)
    if (
      member.jenisKelamin === "WANITA" &&
      member.statusPerkawinan === "Kawin" &&
      member.umur >= 20 &&
      member.umur <= 40
    ) {
      if (Math.random() > 0.8) {
        // 20% chance punya bayi
        healthData.melahirkanDiFaskes = Math.random() > 0.2 ? "YA" : "TIDAK"; // 80% melahirkan di faskes
      }
    }

    // Bayi 0-6 bulan
    if (member.umur === 0) {
      healthData.asiEksklusif = Math.random() > 0.3 ? "YA" : "TIDAK"; // 70% ASI eksklusif
    }

    // Bayi 12-23 bulan
    if (member.umur >= 1 && member.umur <= 2) {
      healthData.imunisasiLengkap = Math.random() > 0.2 ? "YA" : "TIDAK"; // 80% imunisasi lengkap
    }

    // Anak 2-59 bulan (2-5 tahun)
    if (member.umur >= 2 && member.umur <= 5) {
      healthData.pemantauanPertumbuhanBalita =
        Math.random() > 0.3 ? "YA" : "TIDAK"; // 70% dipantau
    }

    // Create health data
    await prisma.gangguanKesehatan.create({
      data: healthData,
    });

    console.log(
      `✅ Added health data for ${member.nama} (${member.umur} tahun)`
    );
  }

  console.log("\n✅ Health data seeding completed successfully!");

  const totalHealth = await prisma.gangguanKesehatan.count();
  console.log(`📊 Total health records: ${totalHealth}`);
}

main()
  .catch((e) => {
    console.error("❌ Error adding health data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
