// Test script untuk verify bahwa data Barnabas Wanggai aman
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkBarnabas() {
    try {
        console.log("🔍 Checking Barnabas Wanggai data...\n");

        // Cari questionnaire Barnabas
        const questionnaire = await prisma.questionnaire.findFirst({
            where: {
                namaKepalaKeluarga: {
                    contains: "Barnabas",
                },
            },
            include: {
                anggotaKeluarga: true,
            },
        });

        if (!questionnaire) {
            console.log("❌ Questionnaire Barnabas Wanggai tidak ditemukan!");
            return;
        }

        console.log("✅ Questionnaire ditemukan!");
        console.log(`   ID: ${questionnaire.id}`);
        console.log(`   Nama Kepala Keluarga: ${questionnaire.namaKepalaKeluarga}`);
        console.log(`   Lokasi: ${questionnaire.desaKelurahan}, ${questionnaire.kecamatan}`);
        console.log(`\n👨‍👩‍👧‍👦 Jumlah Anggota Keluarga: ${questionnaire.anggotaKeluarga.length}`);

        if (questionnaire.anggotaKeluarga.length > 0) {
            console.log("\n📋 Daftar Anggota Keluarga:");
            questionnaire.anggotaKeluarga.forEach((anggota, index) => {
                console.log(
                    `   ${index + 1}. ${anggota.nama} - ${anggota.hubunganKeluarga} (${anggota.umur} tahun)`
                );
            });
        } else {
            console.log("\n⚠️ TIDAK ADA ANGGOTA KELUARGA!");
        }

        console.log("\n✅ Data check completed!");
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBarnabas();
