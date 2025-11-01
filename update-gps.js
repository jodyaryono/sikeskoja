const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper untuk generate koordinat GPS random di area Kota Jayapura (fokus daratan)
// Jayapura Kota: latitude -2.53 to -2.60, longitude 140.68 to 140.75
// Area ini mencakup: Jayapura Utara, Jayapura Selatan, Abepura, Heram, Muara Tami
function generateJayapuraCoordinates() {
    const latMin = -2.60; // Selatan (Abepura)
    const latMax = -2.53; // Utara (Jayapura Utara)
    const lngMin = 140.68; // Barat (pinggir kota)
    const lngMax = 140.75; // Timur (area pantai kota)

    const latitude = Math.random() * (latMax - latMin) + latMin;
    const longitude = Math.random() * (lngMax - lngMin) + lngMin;

    return {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
    };
} async function updateGPS() {
    try {
        console.log("🔄 Updating questionnaires without GPS coordinates...\n");

        // Find questionnaires without GPS
        const questionnaires = await prisma.questionnaire.findMany({
            where: {
                OR: [
                    { latitude: null },
                    { longitude: null }
                ]
            },
            select: {
                id: true,
                namaKepalaKeluarga: true,
            }
        });

        console.log(`📊 Found ${questionnaires.length} questionnaires without GPS\n`);

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

            console.log(`✅ Updated: ${q.namaKepalaKeluarga} -> Lat: ${coords.latitude}, Lng: ${coords.longitude}`);
            updated++;
        }

        console.log(`\n🎉 Successfully updated ${updated} questionnaires with GPS coordinates!`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

updateGPS();
