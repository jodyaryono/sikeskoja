/**
 * Mapping Wilayah Kota Jayapura
 * Digunakan untuk seed data dengan kode wilayah yang benar
 */

export const wilayahMapping = {
  provinsi: {
    kode: "94",
    nama: "PAPUA",
  },
  kabupaten: {
    kode: "9471",
    nama: "KOTA JAYAPURA",
  },
  kecamatan: {
    "Jayapura Utara": {
      kode: "9471040",
      nama: "JAYAPURA UTARA",
      kelurahan: {
        Gurabesi: { kode: "9471040001", nama: "GURABESI" },
        Angkasapura: { kode: "9471040005", nama: "ANGKASAPURA" },
        Bayangkara: { kode: "9471040002", nama: "BAYANGKARA" },
        Mandala: { kode: "9471040003", nama: "MANDALA" },
        Trikora: { kode: "9471040004", nama: "TRIKORA" },
        "Tanjung Ria": { kode: "9471040007", nama: "TANJUNG RIA" },
        "Kampung Kayobatu": { kode: "9471040008", nama: "KAMPUNG KAYOBATU" },
      },
    },
    "Jayapura Selatan": {
      kode: "9471030",
      nama: "JAYAPURA SELATAN",
      kelurahan: {
        Entrop: { kode: "9471030002", nama: "ENTROP" },
        Hamadi: { kode: "9471030004", nama: "HAMADI" },
        Tobati: { kode: "9471030003", nama: "TOBATI" },
        Ardipura: { kode: "9471030005", nama: "ARDIPURA" },
        Argapura: { kode: "9471030007", nama: "ARGAPURA" },
        Numbai: { kode: "9471030006", nama: "NUMBAI" },
        "Tahima Soroma": { kode: "9471030008", nama: "TAHIMA SOROMA" },
      },
    },
    Abepura: {
      kode: "9471020",
      nama: "ABEPURA",
      kelurahan: {
        Abepura: { kode: "9471020004", nama: "ASANO" }, // Asano sebagai default untuk "Abepura"
        Engros: { kode: "9471020006", nama: "ENGROS" }, // Perbaikan typo "Enggros"
        Enggros: { kode: "9471020006", nama: "ENGROS" }, // Alias untuk typo
        "Koya Timur": { kode: "9471020004", nama: "KOYA TIMUR" },
        "Koya Barat": { kode: "9471020001", nama: "KOYA BARAT" },
        "Abe Pantai": { kode: "9471020011", nama: "ABE PANTAI" },
        Awiyo: { kode: "9471020008", nama: "AWIYO" },
        "Kota Baru": { kode: "9471020012", nama: "KOTA BARU" },
        "Koya Koso": { kode: "9471020009", nama: "KOYA KOSO" },
        Nafri: { kode: "9471020005", nama: "NAFRI" },
        Wahno: { kode: "9471020015", nama: "WAHNO" },
        "Wai Mhorock": { kode: "9471020014", nama: "WAI MHOROCK" },
        Yobe: { kode: "9471020010", nama: "YOBE" },
      },
    },
    Heram: {
      kode: "9471021",
      nama: "HERAM",
      kelurahan: {
        Heram: { kode: "9471021003", nama: "HEDAM" }, // Hedam sebagai default untuk "Heram"
        Waena: { kode: "9471021005", nama: "WAENA" },
        Yabansai: { kode: "9471021006", nama: "YABANSAI" },
        Hedam: { kode: "9471021003", nama: "HEDAM" },
        "Kampung Waena": { kode: "9471021002", nama: "KAMPUNG WAENA" },
        Yoka: { kode: "9471021001", nama: "YOKA" },
      },
    },
    "Muara Tami": {
      kode: "9471010",
      nama: "MUARA TAMI",
      kelurahan: {
        "Muara Tami": { kode: "9471010001", nama: "KOYA BARAT" }, // Koya Barat sebagai default
        "Skouw Mabo": { kode: "9471010005", nama: "SKOW MABO" },
        "Skouw Sae": { kode: "9471010006", nama: "SKOW SAE" },
        "Skow Mabo": { kode: "9471010005", nama: "SKOW MABO" }, // Alias untuk typo
        "Skow Sae": { kode: "9471010006", nama: "SKOW SAE" }, // Alias untuk typo
        Holtekam: { kode: "9471010002", nama: "HOLTEKAM" },
        "Kampung Mosso": { kode: "9471010008", nama: "KAMPUNG MOSSO" },
        "Koya Barat": { kode: "9471010001", nama: "KOYA BARAT" },
        "Koya Tengah": { kode: "9471010007", nama: "KOYA TENGAH" },
        "Koya Timur": { kode: "9471010004", nama: "KOYA TIMUR" },
        "Skow Yambe": { kode: "9471010003", nama: "SKOW YAMBE" },
      },
    },
  },
};

/**
 * Helper function untuk mendapatkan kode wilayah berdasarkan nama
 */
export function getWilayahKodes(kecamatanName: string, kelurahanName: string) {
  type KecamatanName = keyof typeof wilayahMapping.kecamatan;

  const kecamatan = wilayahMapping.kecamatan[kecamatanName as KecamatanName];

  if (!kecamatan) {
    throw new Error(`Kecamatan "${kecamatanName}" tidak ditemukan`);
  }

  const kelurahanMap: any = kecamatan.kelurahan;
  const kelurahan = kelurahanMap[kelurahanName];

  if (!kelurahan) {
    throw new Error(
      `Kelurahan "${kelurahanName}" di Kecamatan "${kecamatanName}" tidak ditemukan`
    );
  }

  return {
    provinsiKode: wilayahMapping.provinsi.kode,
    provinsi: wilayahMapping.provinsi.nama,
    kabupatenKode: wilayahMapping.kabupaten.kode,
    kabupatenKota: wilayahMapping.kabupaten.nama,
    kecamatanKode: kecamatan.kode,
    kecamatan: kecamatan.nama,
    desaKode: kelurahan.kode as string,
    desaKelurahan: kelurahan.nama as string,
  };
}
