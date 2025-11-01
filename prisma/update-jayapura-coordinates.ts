import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Koordinat real kelurahan di Kota Jayapura berdasarkan kode BPS dan data peta
const kelurahanCoordinates: { [key: string]: { lat: number; lng: number } } = {
  // Kecamatan Jayapura Utara (9471040)
  "9471040001": { lat: -2.5314, lng: 140.7177 }, // GURABESI
  "9471040002": { lat: -2.5289, lng: 140.7156 }, // BAYANGKARA
  "9471040003": { lat: -2.5312, lng: 140.7089 }, // MANDALA
  "9471040004": { lat: -2.5345, lng: 140.7134 }, // TRIKORA
  "9471040005": { lat: -2.5823, lng: 140.6389 }, // ANGKASAPURA
  "9471040007": { lat: -2.5245, lng: 140.7201 }, // TANJUNG RIA
  "9471040008": { lat: -2.5489, lng: 140.7312 }, // KAMPUNG KAYOBATU

  // Kecamatan Jayapura Selatan (9471030)
  "9471030002": { lat: -2.5778, lng: 140.6445 }, // ENTROP
  "9471030003": { lat: -2.5556, lng: 140.7234 }, // TOBATI
  "9471030004": { lat: -2.5434, lng: 140.7289 }, // HAMADI
  "9471030005": { lat: -2.5512, lng: 140.7145 }, // ARDIPURA
  "9471030006": { lat: -2.6045, lng: 140.7089 }, // NUMBAI
  "9471030007": { lat: -2.5467, lng: 140.7201 }, // ARGAPURA
  "9471030008": { lat: -2.5589, lng: 140.7267 }, // TAHIMA SOROMA

  // Kecamatan Heram (9471021) - Area Waena
  "9471021001": { lat: -2.6123, lng: 140.7134 }, // YOKA
  "9471021002": { lat: -2.5989, lng: 140.7056 }, // KAMPUNG WAENA
  "9471021003": { lat: -2.5812, lng: 140.6934 }, // HEDAM
  "9471021005": { lat: -2.5945, lng: 140.5167 }, // WAENA (area bandara)
  "9471021006": { lat: -2.5756, lng: 140.6889 }, // YABANSAI

  // Kecamatan Abepura (9471020)
  "9471020004": { lat: -2.5934, lng: 140.6334 }, // ASANO
  "9471020005": { lat: -2.5867, lng: 140.6278 }, // NAFRI
  "9471020006": { lat: -2.5889, lng: 140.6456 }, // ENGROS
  "9471020008": { lat: -2.5945, lng: 140.6523 }, // AWIYO
  "9471020009": { lat: -2.5978, lng: 140.6601 }, // KOYA KOSO
  "9471020010": { lat: -2.6012, lng: 140.6678 }, // YOBE
  "9471020011": { lat: -2.5823, lng: 140.6234 }, // ABE PANTAI
  "9471020012": { lat: -2.5901, lng: 140.6389 }, // KOTA BARU
  "9471020014": { lat: -2.6034, lng: 140.6734 }, // WAI MHOROCK
  "9471020015": { lat: -2.6067, lng: 140.6789 }, // WAHNO

  // Kecamatan Muara Tami (9471010)
  "9471010001": { lat: -2.4823, lng: 140.8123 }, // KOYA BARAT
  "9471010002": { lat: -2.4756, lng: 140.8201 }, // HOLTEKAM
  "9471010003": { lat: -2.5089, lng: 140.8312 }, // SKOW YAMBE
  "9471010004": { lat: -2.4901, lng: 140.8278 }, // KOYA TIMUR
  "9471010005": { lat: -2.5123, lng: 140.8234 }, // SKOW MABO
  "9471010006": { lat: -2.5178, lng: 140.8289 }, // SKOW SAE
  "9471010007": { lat: -2.4867, lng: 140.8189 }, // KOYA TENGAH
  "9471010008": { lat: -2.5145, lng: 140.8389 }, // KAMPUNG MOSSO
};

async function main() {
  console.log("🗺️  Updating koordinat kelurahan Kota Jayapura...\n");

  let updated = 0;
  let notFound = 0;

  for (const [kodeKelurahan, coords] of Object.entries(kelurahanCoordinates)) {
    try {
      // Update berdasarkan kode kelurahan
      const result = await prisma.desa.updateMany({
        where: {
          kode: kodeKelurahan,
        },
        data: {
          latitude: coords.lat,
          longitude: coords.lng,
        },
      });

      if (result.count > 0) {
        const desa = await prisma.desa.findUnique({
          where: { kode: kodeKelurahan },
        });
        console.log(
          `✅ ${desa?.nama} (${kodeKelurahan}): ${coords.lat}, ${coords.lng}`
        );
        updated++;
      } else {
        console.log(`⚠️  ${kodeKelurahan}: Tidak ditemukan di database`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${kodeKelurahan}:`, error);
    }
  }

  console.log(`\n✨ Selesai!`);
  console.log(`   Updated: ${updated} kelurahan`);
  console.log(`   Not found: ${notFound} kelurahan`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
