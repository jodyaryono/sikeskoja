import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📋 Verifikasi Data Wilayah Kode\n");

  const samples = await prisma.questionnaire.findMany({
    take: 5,
    select: {
      namaKepalaKeluarga: true,
      provinsi: true,
      provinsiKode: true,
      kabupatenKota: true,
      kabupatenKode: true,
      kecamatan: true,
      kecamatanKode: true,
      desaKelurahan: true,
      desaKode: true,
      alamatRumah: true,
    },
  });

  console.log("Sample 5 Questionnaires dengan Wilayah Kode:\n");

  samples.forEach((q, i) => {
    console.log(`${i + 1}. ${q.namaKepalaKeluarga}`);
    console.log(`   Provinsi: ${q.provinsi} (${q.provinsiKode})`);
    console.log(`   Kab/Kota: ${q.kabupatenKota} (${q.kabupatenKode})`);
    console.log(`   Kecamatan: ${q.kecamatan} (${q.kecamatanKode})`);
    console.log(`   Kelurahan: ${q.desaKelurahan} (${q.desaKode})`);
    console.log(`   Alamat: ${q.alamatRumah}\n`);
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
