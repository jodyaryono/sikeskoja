import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking Wilayah Data in Database...\n");

  const provinsiCount = await prisma.provinsi.count();
  console.log(`✅ Total Provinsi: ${provinsiCount}`);

  const kabupatenCount = await prisma.kabupaten.count();
  console.log(`✅ Total Kabupaten: ${kabupatenCount}`);

  const kecamatanCount = await prisma.kecamatan.count();
  console.log(`✅ Total Kecamatan: ${kecamatanCount}`);

  const desaCount = await prisma.desa.count();
  console.log(`✅ Total Desa: ${desaCount}\n`);

  // Cek data Papua spesifik
  const papua = await prisma.provinsi.findUnique({
    where: { kode: "94" },
  });
  console.log("Papua Provinsi:", papua);

  const kotaJayapura = await prisma.kabupaten.findUnique({
    where: { kode: "9471" },
  });
  console.log("Kota Jayapura:", kotaJayapura);

  const heram = await prisma.kecamatan.findUnique({
    where: { kode: "9471021" },
  });
  console.log("Heram Kecamatan:", heram);

  const waena = await prisma.desa.findUnique({
    where: { kode: "9471021005" },
  });
  console.log("Waena Desa:", waena);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
