import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗺️ Mengambil data wilayah Kota Jayapura...\n");

  // Get Provinsi Papua
  const provinsi = await prisma.provinsi.findFirst({
    where: { nama: { contains: "PAPUA" } },
  });

  if (!provinsi) {
    console.log("❌ Provinsi Papua tidak ditemukan");
    return;
  }

  console.log(`✅ Provinsi: ${provinsi.nama} (${provinsi.kode})\n`);

  // Get Kota Jayapura (PENTING: kode 9471, bukan 9403 yang adalah Kabupaten Jayapura)
  const kotaJayapura = await prisma.kabupaten.findFirst({
    where: {
      kode: "9471", // Kota Jayapura yang benar
      provinsiKode: provinsi.kode,
    },
  });

  if (!kotaJayapura) {
    console.log("❌ Kota Jayapura tidak ditemukan");
    return;
  }

  console.log(
    `✅ Kabupaten/Kota: ${kotaJayapura.nama} (${kotaJayapura.kode})\n`
  );

  // Get all Kecamatan in Kota Jayapura
  const kecamatanList = await prisma.kecamatan.findMany({
    where: { kabupatenKode: kotaJayapura.kode },
    orderBy: { nama: "asc" },
  });

  console.log(
    `📍 Daftar Kecamatan di Kota Jayapura (${kecamatanList.length}):\n`
  );

  for (const kec of kecamatanList) {
    // Get desa/kelurahan in this kecamatan
    const desaList = await prisma.desa.findMany({
      where: { kecamatanKode: kec.kode },
      orderBy: { nama: "asc" },
    });

    console.log(
      `\n🏘️ ${kec.nama} (${kec.kode}) - ${desaList.length} kelurahan:`
    );
    desaList.forEach((desa, idx) => {
      console.log(`   ${idx + 1}. ${desa.nama} (${desa.kode})`);
    });
  }

  // Export untuk digunakan di seed
  console.log("\n\n📋 Data untuk seed.ts:\n");
  console.log("export const wilayahJayapura = {");
  console.log(
    `  provinsi: { kode: '${provinsi.kode}', nama: '${provinsi.nama}' },`
  );
  console.log(
    `  kabupaten: { kode: '${kotaJayapura.kode}', nama: '${kotaJayapura.nama}' },`
  );
  console.log("  kecamatan: [");

  for (const kec of kecamatanList) {
    const desaList = await prisma.desa.findMany({
      where: { kecamatanKode: kec.kode },
      orderBy: { nama: "asc" },
    });

    console.log(`    { kode: '${kec.kode}', nama: '${kec.nama}', kelurahan: [`);
    desaList.forEach((desa) => {
      console.log(`      { kode: '${desa.kode}', nama: '${desa.nama}' },`);
    });
    console.log("    ]},");
  }
  console.log("  ]");
  console.log("};");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
