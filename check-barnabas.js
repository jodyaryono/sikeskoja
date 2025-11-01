const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBarnabas() {
    try {
        // Cari questionnaire Barnabas
        const questionnaire = await prisma.questionnaire.findFirst({
            where: {
                namaKepalaKeluarga: {
                    contains: 'Barnabas'
                }
            },
            include: {
                anggotaKeluarga: {
                    include: {
                        gangguanKesehatan: true
                    }
                }
            }
        });

        if (!questionnaire) {
            console.log('❌ Data Barnabas Wanggai tidak ditemukan!');
            return;
        }

        console.log('\n✅ Data Questionnaire Barnabas Wanggai:');
        console.log('ID:', questionnaire.id);
        console.log('Nama Kepala Keluarga:', questionnaire.namaKepalaKeluarga);
        console.log('Alamat:', questionnaire.alamatRumah);
        console.log('Desa/Kelurahan:', questionnaire.desaKelurahan);
        console.log('\n📋 Anggota Keluarga:', questionnaire.anggotaKeluarga.length, 'orang');

        if (questionnaire.anggotaKeluarga.length === 0) {
            console.log('⚠️ TIDAK ADA ANGGOTA KELUARGA!');
        } else {
            questionnaire.anggotaKeluarga.forEach((anggota, index) => {
                console.log(`\n${index + 1}. ${anggota.nama}`);
                console.log('   NIK:', anggota.nik);
                console.log('   Hubungan:', anggota.hubunganKeluarga);
                console.log('   Umur:', anggota.umur, 'tahun');
                console.log('   Jenis Kelamin:', anggota.jenisKelamin);
                console.log('   Pendidikan:', anggota.pendidikan || 'N/A');
                console.log('   Pekerjaan:', anggota.pekerjaan || 'N/A');
                console.log('   Gangguan Kesehatan:', anggota.gangguanKesehatan.length, 'data');
            });
        }

        // Cek semua questionnaire yang tidak punya anggota keluarga
        const emptyQuestionnaires = await prisma.questionnaire.findMany({
            include: {
                _count: {
                    select: { anggotaKeluarga: true }
                }
            }
        });

        const questionnairesWithoutMembers = emptyQuestionnaires.filter(q => q._count.anggotaKeluarga === 0);

        console.log('\n\n⚠️ Questionnaires tanpa anggota keluarga:', questionnairesWithoutMembers.length);
        questionnairesWithoutMembers.forEach(q => {
            console.log(`- ${q.namaKepalaKeluarga} (ID: ${q.id})`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBarnabas();
