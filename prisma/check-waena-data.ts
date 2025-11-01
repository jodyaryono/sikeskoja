import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.questionnaire.findFirst({
    where: { kodePuskesmas: "PKM-WAEN-006" },
    select: {
      id: true,
      alamatRumah: true,
      provinsi: true,
      provinsiKode: true,
      kabupatenKota: true,
      kabupatenKode: true,
      kecamatan: true,
      kecamatanKode: true,
      desaKelurahan: true,
      desaKode: true,
    },
  });

  console.log("Data Questionnaire Waena:");
  console.log(JSON.stringify(data, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
