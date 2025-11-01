import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Mencari semua wilayah dengan nama "JAYAPURA"...\n');

  const results = await prisma.kabupaten.findMany({
    where: {
      nama: {
        contains: "JAYAPURA",
        mode: "insensitive",
      },
    },
    orderBy: {
      kode: "asc",
    },
  });

  console.log(`Ditemukan ${results.length} hasil:\n`);

  results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.nama} (${item.kode})`);
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
