const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        const questionnaireCount = await prisma.questionnaire.count();
        const anggotaCount = await prisma.anggotaKeluarga.count();
        const userCount = await prisma.user.count();

        console.log('\n📊 Database Check:');
        console.log('==================');
        console.log(`Total Questionnaires: ${questionnaireCount}`);
        console.log(`Total Anggota Keluarga: ${anggotaCount}`);
        console.log(`Total Users: ${userCount}`);
        console.log('==================\n');

        if (questionnaireCount === 0) {
            console.log('⚠️  Database is empty! Run: npm run prisma:seed');
        } else {
            console.log('✅ Database has data');

            // Show sample questionnaires
            const questionnaires = await prisma.questionnaire.findMany({
                take: 5,
                select: {
                    id: true,
                    namaKepalaKeluarga: true,
                    provinsi: true,
                    status: true
                }
            });

            console.log('\n📋 Sample Questionnaires:');
            questionnaires.forEach((q, i) => {
                console.log(`${i + 1}. ${q.namaKepalaKeluarga} - ${q.provinsi} (${q.status})`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
