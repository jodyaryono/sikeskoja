const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper untuk generate koordinat GPS random di area Kota Jayapura (DARATAN KOTA ONLY!)
// FOKUS: Pusat kota Jayapura, Entrop, Abepura bagian barat (JAUH dari teluk/pantai)
// Range ULTRA KETAT untuk memastikan 100% DARATAN!
function generateJayapuraCoordinates() {
    const latMin = -2.585; // Selatan (Abepura barat)
    const latMax = -2.545; // Utara (Jayapura pusat kota)
    const lngMin = 140.698; // Barat (daratan safe)
    const lngMax = 140.708; // Timur (SEBELUM teluk - max 140.708!)    const latitude = Math.random() * (latMax - latMin) + latMin;
    const longitude = Math.random() * (lngMax - lngMin) + lngMin;

    return {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
    };
}

async function forceUpdateAllGPS() {
    try {
        console.log("🔄 Force updating ALL GPS coordinates to Kota Jayapura area...\n");

        // Get all questionnaires
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
        console.log("📍 Semua koordinat sekarang fokus di area Kota Jayapura (daratan)");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

forceUpdateAllGPS();
