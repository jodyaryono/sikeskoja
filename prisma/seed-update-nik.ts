import { PrismaClient } from "@prisma/client";
import { generateNIKWithAutoCounter, resetNIKCounter } from "./generate-nik";

const prisma = new PrismaClient();

async function updateNIKForAllMembers() {
  try {
    console.log("🔄 Memulai update NIK untuk semua anggota keluarga...\n");

    // Reset counter
    resetNIKCounter();

    // Get all anggota keluarga with their questionnaire info
    const allMembers = await prisma.anggotaKeluarga.findMany({
      include: {
        questionnaire: {
          select: {
            kecamatan: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log(`📊 Total anggota keluarga: ${allMembers.length}\n`);

    let updatedCount = 0;
    let alreadyHasNIK = 0;
    let errorCount = 0;

    for (const member of allMembers) {
      try {
        // Skip if already has NIK
        if (member.nik && member.nik.length === 16) {
          alreadyHasNIK++;
          console.log(`✓ ${member.nama} - sudah punya NIK: ${member.nik}`);
          continue;
        }

        // Generate NIK
        const nik = generateNIKWithAutoCounter(
          new Date(member.tanggalLahir),
          member.jenisKelamin,
          member.questionnaire.kecamatan
        );

        // Update database
        await prisma.anggotaKeluarga.update({
          where: { id: member.id },
          data: { nik },
        });

        updatedCount++;
        console.log(`✅ ${member.nama} - NIK baru: ${nik}`);
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Error untuk ${member.nama}:`, error.message);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 RINGKASAN UPDATE NIK:");
    console.log("=".repeat(60));
    console.log(`Total anggota keluarga: ${allMembers.length}`);
    console.log(`Sudah punya NIK: ${alreadyHasNIK}`);
    console.log(`NIK baru dibuat: ${updatedCount}`);
    console.log(`Error: ${errorCount}`);
    console.log("=".repeat(60));

    if (updatedCount > 0) {
      console.log("\n✅ Update NIK berhasil!");

      // Show sample
      console.log("\n📋 Sample NIK yang dibuat:");
      const samples = await prisma.anggotaKeluarga.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: {
          nama: true,
          nik: true,
          jenisKelamin: true,
          tanggalLahir: true,
          questionnaire: {
            select: {
              kecamatan: true,
            },
          },
        },
      });

      samples.forEach((s) => {
        console.log(
          `  ${s.nama} (${s.jenisKelamin}) - ${s.nik} - ${s.questionnaire.kecamatan}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateNIKForAllMembers()
  .then(() => {
    console.log("\n✅ Selesai!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
