import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const desaList = await prisma.desa.findMany({
    where: {
      kecamatan: {
        kabupatenKode: "9471",
      },
    },
    include: {
      kecamatan: true,
    },
    orderBy: {
      kecamatanKode: "asc",
    },
  });

  console.log("📍 Kelurahan di Kota Jayapura:\n");
  desaList.forEach((d) => {
    console.log(`${d.kode} | ${d.kecamatan.nama} | ${d.nama}`);
  });

  console.log(`\nTotal: ${desaList.length} kelurahan`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
