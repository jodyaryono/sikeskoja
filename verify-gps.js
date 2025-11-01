const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyGPS() {
    try {
        console.log("🔍 Checking GPS coordinates in questionnaires...\n");

        // Check total questionnaires
        const total = await prisma.questionnaire.count();
        console.log(`📊 Total questionnaires: ${total}`);

        // Check questionnaires with GPS
        const withGPS = await prisma.questionnaire.count({
            where: {
                AND: [
                    { latitude: { not: null } },
                    { longitude: { not: null } }
                ]
            }
        });
        console.log(`✅ With GPS coordinates: ${withGPS}`);
        console.log(`❌ Without GPS coordinates: ${total - withGPS}\n`);

        // Show sample data
        const samples = await prisma.questionnaire.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                namaKepalaKeluarga: true,
                latitude: true,
                longitude: true,
                alamatRumah: true,
            }
        });

        console.log("📍 Sample GPS data (5 recent questionnaires):");
        samples.forEach((q, i) => {
            console.log(`\n${i + 1}. ${q.namaKepalaKeluarga}`);
            console.log(`   Latitude: ${q.latitude || 'NULL'}`);
            console.log(`   Longitude: ${q.longitude || 'NULL'}`);
            console.log(`   Alamat: ${q.alamatRumah}`);
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

verifyGPS();
