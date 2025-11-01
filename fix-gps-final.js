const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper untuk generate koordinat GPS HANYA DI AREA KOTA DARATAN
// Berdasarkan analisis peta, area yang 100% DARATAN:
// - Entrop: sekitar -2.575, 140.675
// - Waena: sekitar -2.585, 140.680
// - Abepura bagian barat: -2.590, 140.675
// Range SUPER KETAT: longitude MAX 140.685 (lebih dari ini = resiko laut!)
function generateJayapuraCoordinates() {
    const latMin = -2.595; // Selatan (Abepura)
    const latMax = -2.555; // Utara (Entrop)
    const lngMin = 140.672; // Barat (Waena/Entrop)
    const lngMax = 140.685; // Timur (BATAS KETAT - max 140.685!)

    const latitude = Math.random() * (latMax - latMin) + latMin;
    const longitude = Math.random() * (lngMax - lngMin) + lngMin;

    return {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
    };
}

async function forceUpdateAllGPS() {
    try {
        console.log("🔄 FINAL FIX - GPS ke area kota daratan ONLY (lng max 140.685)...\n");

        const questionnaires = await prisma.questionnaire.findMany({
            select: {
                id: true,
                namaKepalaKeluarga: true,
            }
        });

        console.log(`📊 Total ${questionnaires.length} questionnaires akan di-update\n`);

        let updated = 0;
        for (const q of questionnaires) {
            const coords = generateJayapuraCoordinates();

            await prisma.questionnaire.update({
                where: { id: q.id },
                data: {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }
            });

            console.log(`✅ ${q.namaKepalaKeluarga} -> Lat: ${coords.latitude}, Lng: ${coords.longitude}`);
            updated++;
        }

        console.log(`\n🎉 Successfully updated ${updated} questionnaires!`);
        console.log("📍 FINAL: Semua koordinat di DARATAN KOTA (lng 140.672-140.685)");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

forceUpdateAllGPS();
