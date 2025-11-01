import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌏 Mulai import data wilayah Indonesia...");

  const sqlPath = path.join(__dirname, "..", "wilayah.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  // Extract INSERT statements for provinces (hanya Papua - kode 94)
  const provinceMatch = sqlContent.match(/INSERT INTO `provinces`[^;]+;/g);
  if (provinceMatch) {
    const provinceData = provinceMatch[0].match(/\('(\d+)', '([^']+)'/g);
    if (provinceData) {
      for (const data of provinceData) {
        const match = data.match(/\('(\d+)', '([^']+)'/);
        if (match && match[1] === "94") {
          // Hanya Papua
          const [, kode, nama] = match;
          await prisma.provinsi.upsert({
            where: { kode },
            update: { nama },
            create: { kode, nama },
          });
          console.log(`✅ Provinsi: ${nama} (${kode})`);
        }
      }
    }
  }

  // Extract INSERT statements for regencies (kabupaten di Papua - kode 94xx)
  const regencyMatches = sqlContent.match(/INSERT INTO `regencies`[^;]+;/g);
  if (regencyMatches) {
    for (const match of regencyMatches) {
      const regencies = match.match(/\('(\d{4})', '(\d{2})', '([^']+)'/g);
      if (regencies) {
        for (const data of regencies) {
          const regMatch = data.match(/\('(\d{4})', '(\d{2})', '([^']+)'/);
          if (regMatch && regMatch[2] === "94") {
            // Hanya Papua
            const [, kode, provinsiKode, nama] = regMatch;
            await prisma.kabupaten.upsert({
              where: { kode },
              update: { nama, provinsiKode },
              create: { kode, nama, provinsiKode },
            });
            console.log(`✅ Kabupaten: ${nama} (${kode})`);
          }
        }
      }
    }
  }

  // Extract INSERT statements for districts (kecamatan di Papua)
  const districtMatches = sqlContent.match(/INSERT INTO `districts`[^;]+;/g);
  if (districtMatches) {
    for (const match of districtMatches) {
      const districts = match.match(/\('(\d{7})', '(\d{4})', '([^']+)'/g);
      if (districts) {
        for (const data of districts) {
          const distMatch = data.match(/\('(\d{7})', '(\d{4})', '([^']+)'/);
          if (distMatch && distMatch[1].startsWith("94")) {
            // Hanya Papua
            const [, kode, kabupatenKode, nama] = distMatch;
            await prisma.kecamatan.upsert({
              where: { kode },
              update: { nama, kabupatenKode },
              create: { kode, nama, kabupatenKode },
            });
            console.log(`✅ Kecamatan: ${nama} (${kode})`);
          }
        }
      }
    }
  }

  // Extract INSERT statements for villages (desa/kelurahan di Papua)
  const villageMatches = sqlContent.match(/INSERT INTO `villages`[^;]+;/g);
  if (villageMatches) {
    let villageCount = 0;
    for (const match of villageMatches) {
      const villages = match.match(/\('(\d{10})', '(\d{7})', '([^']+)'/g);
      if (villages) {
        for (const data of villages) {
          const villMatch = data.match(/\('(\d{10})', '(\d{7})', '([^']+)'/);
          if (villMatch && villMatch[1].startsWith("94")) {
            // Hanya Papua
            const [, kode, kecamatanKode, nama] = villMatch;
            await prisma.desa.upsert({
              where: { kode },
              update: { nama, kecamatanKode },
              create: { kode, nama, kecamatanKode },
            });
            villageCount++;
            if (villageCount % 50 === 0) {
              console.log(
                `✅ Progress desa/kelurahan: ${villageCount} data...`
              );
            }
          }
        }
      }
    }
    console.log(`✅ Total desa/kelurahan: ${villageCount} data`);
  }

  console.log("✅ Selesai import data wilayah!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
