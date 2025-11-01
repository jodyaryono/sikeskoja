const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper untuk generate koordinat GPS random di DARATAN KOTA JAYAPURA
// Koordinat yang BENAR untuk daratan:
// - Pusat Kota Jayapura: sekitar -2.532, 140.718 (tapi ini dekat pantai)
// - Entrop/Abepura: -2.59, 140.67 (INI DARATAN!)
// - Waena: -2.58, 140.69
// MASALAHNYA: Longitude > 140.70 = TELUK! Harus < 140.70!
function generateJayapuraCoordinates() {
    // Koordinat DARATAN Jayapura yang BENAR
    // Fokus ke area Entrop, Waena, Abepura (BARAT dari teluk)
    const latMin = -2.595; // Selatan (Abepura)
    const latMax = -2.550; // Utara (Entrop)
    const lngMin = 140.670; // Barat (Waena/Entrop - DARATAN!)
    const lngMax = 140.695; // Timur (BATAS - sebelum teluk)

    const latitude = Math.random() * (latMax - latMin) + latMin;
    const longitude = Math.random() * (lngMax - lngMin) + lngMin;

    return {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
    };
}

async function forceUpdateAllGPS() {
    try {
        console.log("🔄 Force updating GPS ke DARATAN BARAT (Entrop/Waena/Abepura)...\n");

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
        console.log("📍 Semua koordinat sekarang di DARATAN BARAT (Entrop/Waena/Abepura - NO TELUK!)");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

forceUpdateAllGPS();
