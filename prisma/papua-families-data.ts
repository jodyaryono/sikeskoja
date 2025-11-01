/**
 * Data 20+ Keluarga Papua di Kota Jayapura
 * Lokasi: Kecamatan di Kota Jayapura (Jayapura Utara, Jayapura Selatan, Abepura, Heram, Muara Tami)
 * Nama: Nama-nama khas Papua
 */

import { getWilayahKodes } from "./jayapura-wilayah-mapping";

// Lokasi Puskesmas di Kota Jayapura
export const puskesmasJayapura = [
  {
    nama: "Puskesmas Dok II",
    kode: "PKM-DOK2-001",
    kecamatan: "Jayapura Utara",
  },
  {
    nama: "Puskesmas Dok V",
    kode: "PKM-DOK5-002",
    kecamatan: "Jayapura Selatan",
  },
  { nama: "Puskesmas Abepura", kode: "PKM-ABEP-003", kecamatan: "Abepura" },
  { nama: "Puskesmas Heram", kode: "PKM-HERA-004", kecamatan: "Heram" },
  {
    nama: "Puskesmas Entrop",
    kode: "PKM-ENTR-005",
    kecamatan: "Jayapura Selatan",
  },
  { nama: "Puskesmas Waena", kode: "PKM-WAEN-006", kecamatan: "Heram" },
  {
    nama: "Puskesmas Hamadi",
    kode: "PKM-HAMA-007",
    kecamatan: "Jayapura Selatan",
  },
];

// Kelurahan di Kota Jayapura
export const kelurahanJayapura = [
  // Jayapura Utara
  "Gurabesi",
  "Hamadi",
  "Tobati",
  "Enggros",
  // Jayapura Selatan
  "Jayapura Selatan",
  "Entrop",
  "Vim",
  "Bhayangkara",
  // Abepura
  "Abepura",
  "Waena",
  "Koya Timur",
  "Koya Barat",
  // Heram
  "Heram",
  "Yabansai",
  "Hedam",
  "Mandala",
  // Muara Tami
  "Muara Tami",
  "Skouw Mabo",
  "Skouw Sae",
];

// Data 25 Keluarga Papua
export const papuaFamilies = [
  {
    // Keluarga 1 - Gurabesi, Jayapura Utara
    questionnaire: {
      ...getWilayahKodes("Jayapura Utara", "Gurabesi"),
      namaPuskesmas: "Puskesmas Dok II",
      kodePuskesmas: "PKM-DOK2-001",
      rw: "02",
      rt: "01",
      noUrutBangunan: "15",
      noUrutKeluarga: "001",
      alamatRumah: "Jl. Gurabesi Raya No. 15",
      namaKepalaKeluarga: "Markus Wanggai",
      saranaAirBersih: "YA",
      jenisAirMinum: "PDAM",
      jambanKeluarga: "YA",
      jenisJamban: "Kloset duduk dengan leher angsa",
      gangguanJiwaBerat: "TIDAK",
      obatGangguanJiwa: "TIDAK",
      anggotaDipasungi: "TIDAK",
      namaPengumpulData: "Yanto Kogoya",
      namaSupervisor: "Dr. Sarah Karunggu",
      tanggalPengumpulan: new Date("2025-10-01"),
    },
    anggotaKeluarga: [
      {
        nama: "Markus Wanggai",
        hubunganKeluarga: "1", // Kepala Keluarga (Kode Kolom 3)
        tanggalLahir: new Date("1985-05-10"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "1", // Kawin (Kode Kolom 7)
        agama: "2", // Kristen (Kode Kolom 9)
        pendidikan: "7", // Tamat PT (Kode Kolom 10)
        pekerjaan: "3", // PNS/TNI/Polri/BUMN/BUMD (Kode Kolom 11)
        nik: "9171051005850001",
      },
      {
        nama: "Yuliana Yikwa",
        hubunganKeluarga: "2", // Istri/Suami (Kode Kolom 3)
        tanggalLahir: new Date("1987-08-15"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "1", // Kawin (Kode Kolom 7)
        agama: "2", // Kristen (Kode Kolom 9)
        pendidikan: "7", // Tamat PT (Kode Kolom 10)
        pekerjaan: "3", // PNS/TNI/Polri/BUMN/BUMD (Kode Kolom 11)
        nik: "9171051508870002",
        sedangHamil: "TIDAK",
      },
      {
        nama: "Samuel Wanggai",
        hubunganKeluarga: "3", // Anak (Kode Kolom 3)
        tanggalLahir: new Date("2015-03-20"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "2", // Belum Kawin (Kode Kolom 7)
        agama: "2", // Kristen (Kode Kolom 9)
        pendidikan: "3", // Tamat SD/MI (Kode Kolom 10)
        pekerjaan: "2", // Sekolah (Kode Kolom 11)
        nik: "9171052003150003",
      },
      {
        nama: "Maria Wanggai",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2020-06-12"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "Belum Kawin",
        agama: "Kristen Protestan",
        nik: "9171051206200004",
      },
    ],
  },

  {
    // Keluarga 2 - Entrop, Jayapura Selatan
    questionnaire: {
      ...getWilayahKodes("Jayapura Selatan", "Entrop"),
      namaPuskesmas: "Puskesmas Entrop",
      kodePuskesmas: "PKM-ENTR-005",
      rw: "03",
      rt: "02",
      noUrutBangunan: "22",
      noUrutKeluarga: "002",
      alamatRumah: "Jl. Entrop Permai No. 22",
      namaKepalaKeluarga: "Yohanes Waney",
      saranaAirBersih: "YA",
      jenisAirMinum: "PDAM",
      jambanKeluarga: "YA",
      jenisJamban: "Kloset jongkok dengan leher angsa",
      gangguanJiwaBerat: "TIDAK",
      obatGangguanJiwa: "TIDAK",
      anggotaDipasungi: "TIDAK",
      namaPengumpulData: "Maria Wenda",
      namaSupervisor: "Dr. Paul Numberi",
      tanggalPengumpulan: new Date("2025-10-02"),
    },
    anggotaKeluarga: [
      {
        nama: "Daniel Kogoya",
        hubunganKeluarga: "1", // Kepala Keluarga
        tanggalLahir: new Date("1990-02-14"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "1", // Kawin
        agama: "2", // Kristen
        pendidikan: "5", // Tamat SLTA/MA
        pekerjaan: "5", // Wiraswasta/Pedagang/Jasa
        nik: "9171021402900001",
      },
      {
        nama: "Agnes Tekege",
        hubunganKeluarga: "2", // Istri/Suami
        tanggalLahir: new Date("1992-07-22"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "1", // Kawin
        agama: "2", // Kristen
        pendidikan: "5", // Tamat SLTA/MA
        pekerjaan: "5", // Wiraswasta/Pedagang/Jasa
        nik: "9171022207920002",
        sedangHamil: "YA",
      },
      {
        nama: "Yakob Kogoya",
        hubunganKeluarga: "3", // Anak
        tanggalLahir: new Date("2018-11-05"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "2", // Belum Kawin
        agama: "2", // Kristen
        pendidikan: "2", // Tidak tamat SD/MI
        pekerjaan: "2", // Sekolah
        nik: "9171020511180003",
      },
    ],
  },

  {
    // Keluarga 3 - Waena, Heram (Waena ada di Heram kecamatan)
    questionnaire: {
      ...getWilayahKodes("Heram", "Waena"),
      namaPuskesmas: "Puskesmas Abepura",
      kodePuskesmas: "PKM-ABEP-003",
      rw: "05",
      rt: "03",
      noUrutBangunan: "42",
      noUrutKeluarga: "003",
      alamatRumah: "Jl. Raya Waena No. 42",
      namaKepalaKeluarga: "Petrus Nawipa",
      saranaAirBersih: "YA",
      jenisAirMinum: "PDAM",
      jambanKeluarga: "YA",
      jenisJamban: "Kloset duduk dengan leher angsa",
      gangguanJiwaBerat: "TIDAK",
      obatGangguanJiwa: "TIDAK",
      anggotaDipasungi: "TIDAK",
      namaPengumpulData: "John Wanggai",
      namaSupervisor: "Dr. Ruth Yoku",
      tanggalPengumpulan: new Date("2025-10-03"),
    },
    anggotaKeluarga: [
      {
        nama: "Petrus Nawipa",
        hubunganKeluarga: "1", // Kepala Keluarga
        tanggalLahir: new Date("1988-09-08"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "1", // Kawin
        agama: "3", // Katolik
        pendidikan: "7", // Tamat PT
        pekerjaan: "3", // PNS/TNI/Polri/BUMN/BUMD
        nik: "9171030809880001",
      },
      {
        nama: "Elisabeth Rumere",
        hubunganKeluarga: "2", // Istri/Suami
        tanggalLahir: new Date("1990-12-18"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "1", // Kawin
        agama: "3", // Katolik
        pendidikan: "7", // Tamat PT
        pekerjaan: "3", // PNS/TNI/Polri/BUMN/BUMD
        nik: "9171031812900002",
        sedangHamil: "TIDAK",
      },
      {
        nama: "Gabriel Nawipa",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2016-04-25"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "Belum Kawin",
        agama: "Katolik",
        pendidikan: "SD",
        nik: "9171032504160003",
      },
      {
        nama: "Ruth Nawipa",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2019-08-10"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "Belum Kawin",
        agama: "Katolik",
        nik: "9171031008190004",
      },
    ],
  },

  {
    // Keluarga 4 - Yabansai, Heram
    questionnaire: {
      ...getWilayahKodes("Heram", "Yabansai"),
      namaPuskesmas: "Puskesmas Heram",
      kodePuskesmas: "PKM-HERA-004",
      rw: "02",
      rt: "04",
      noUrutBangunan: "18",
      noUrutKeluarga: "004",
      alamatRumah: "Jl. Yabansai No. 18",
      namaKepalaKeluarga: "Simon Ayomi",
      saranaAirBersih: "YA",
      jenisAirMinum: "Sumur",
      jambanKeluarga: "YA",
      jenisJamban: "Kloset jongkok dengan leher angsa",
      gangguanJiwaBerat: "TIDAK",
      obatGangguanJiwa: "TIDAK",
      anggotaDipasungi: "TIDAK",
      namaPengumpulData: "Elisabeth Yikwa",
      namaSupervisor: "Dr. Michael Wenda",
      tanggalPengumpulan: new Date("2025-10-04"),
    },
    anggotaKeluarga: [
      {
        nama: "Simon Ayomi",
        hubunganKeluarga: "KEPALA_KELUARGA",
        tanggalLahir: new Date("1982-06-30"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "Kawin",
        agama: "Kristen Protestan",
        pendidikan: "SMA",
        pekerjaan: "Sopir",
        nik: "9171043006820001",
      },
      {
        nama: "Dorkas Padang",
        hubunganKeluarga: "ISTRI_SUAMI",
        tanggalLahir: new Date("1984-11-12"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "Kawin",
        agama: "Kristen Protestan",
        pendidikan: "SMP",
        pekerjaan: "Ibu Rumah Tangga",
        nik: "9171041211840002",
        sedangHamil: "TIDAK",
      },
      {
        nama: "Yosua Ayomi",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2010-02-08"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "Belum Kawin",
        agama: "Kristen Protestan",
        pendidikan: "SMP",
        pekerjaan: "Pelajar",
        nik: "9171040802100003",
      },
      {
        nama: "Ester Ayomi",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2014-05-20"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "Belum Kawin",
        agama: "Kristen Protestan",
        pendidikan: "SD",
        nik: "9171042005140004",
      },
      {
        nama: "Yohanis Ayomi",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2021-09-15"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "Belum Kawin",
        agama: "Kristen Protestan",
        nik: "9171041509210005",
      },
    ],
  },

  {
    // Keluarga 5
    // Keluarga 5 - Tobati, Jayapura Selatan (TOBATI ada di Jayapura Selatan, bukan Utara!)
    questionnaire: {
      ...getWilayahKodes("Jayapura Selatan", "Tobati"),
      namaPuskesmas: "Puskesmas Dok II",
      kodePuskesmas: "PKM-DOK2-001",
      rw: "04",
      rt: "02",
      noUrutBangunan: "33",
      noUrutKeluarga: "005",
      alamatRumah: "Jl. Tobati Asri No. 33",
      namaKepalaKeluarga: "Paulus Wally",
      saranaAirBersih: "YA",
      jenisAirMinum: "PDAM",
      jambanKeluarga: "YA",
      jenisJamban: "Kloset duduk dengan leher angsa",
      gangguanJiwaBerat: "TIDAK",
      obatGangguanJiwa: "TIDAK",
      anggotaDipasungi: "TIDAK",
      namaPengumpulData: "David Enumbi",
      namaSupervisor: "Dr. Anna Bonay",
      tanggalPengumpulan: new Date("2025-10-05"),
    },
    anggotaKeluarga: [
      {
        nama: "Paulus Wally",
        hubunganKeluarga: "KEPALA_KELUARGA",
        tanggalLahir: new Date("1975-03-25"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "Kawin",
        agama: "Kristen Protestan",
        pendidikan: "S1",
        pekerjaan: "Pegawai Bank",
        nik: "9171012503750001",
      },
      {
        nama: "Grace Imbiri",
        hubunganKeluarga: "ISTRI_SUAMI",
        tanggalLahir: new Date("1978-07-14"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "Kawin",
        agama: "Kristen Protestan",
        pendidikan: "S1",
        pekerjaan: "Guru",
        nik: "9171011407780002",
        sedangHamil: "TIDAK",
      },
      {
        nama: "David Wally",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2005-10-10"),
        jenisKelamin: "PRIA",
        statusPerkawinan: "Belum Kawin",
        agama: "Kristen Protestan",
        pendidikan: "SMA",
        pekerjaan: "Pelajar",
        nik: "9171011010050003",
      },
      {
        nama: "Sarah Wally",
        hubunganKeluarga: "ANAK",
        tanggalLahir: new Date("2008-01-28"),
        jenisKelamin: "WANITA",
        statusPerkawinan: "Belum Kawin",
        agama: "Kristen Protestan",
        pendidikan: "SMP",
        pekerjaan: "Pelajar",
        nik: "9171012801080004",
      },
    ],
  },

  // Keluarga 6-25 akan dibuat dengan pola similar
  // Total 25 keluarga dari berbagai kecamatan di Kota Jayapura
];

// Helper untuk generate lebih banyak keluarga
export function generateMorePapuaFamilies(count: number) {
  const additionalFamilies = [];
  const kepalaKeluargaNames = [
    "Thomas Karunggu",
    "Isaac Modouw",
    "Abraham Sani",
    "Yohanes Wambrauw",
    "Hendrik Krey",
    "Andreas Bonay",
    "Marthen Yoku",
    "Stefanus Asso",
    "Filipus Enumbi",
    "Kornelis Tekege",
    "Isak Nawipa",
    "Yakub Ayomi",
    "Mikael Karunggu",
    "Rafael Padang",
    "Tobias Wally",
    "Matheus Rumere",
    "Lukas Yikwa",
    "Markus Enumbi",
    "Yustus Kogoya",
    "Barnabas Wanggai",
  ];

  const istriNames = [
    "Magdalena Yoku",
    "Debora Asso",
    "Rebeka Modouw",
    "Lea Sani",
    "Rahel Wambrauw",
    "Sara Imbiri",
    "Hana Krey",
    "Ester Bonay",
    "Rut Wenda",
    "Naomi Tekege",
    "Maria Nawipa",
    "Marta Ayomi",
    "Lidia Karunggu",
    "Priskila Padang",
    "Tabita Wally",
    "Dina Rumere",
    "Yulia Yikwa",
    "Susana Enumbi",
    "Eli Kogoya",
    "Ana Wanggai",
  ];

  for (let i = 0; i < Math.min(count, kepalaKeluargaNames.length); i++) {
    const puskesmas = puskesmasJayapura[i % puskesmasJayapura.length];
    const kelurahan = kelurahanJayapura[i % kelurahanJayapura.length];
    const kecamatanNama = puskesmas.kecamatan;

    // Dapatkan wilayah kodes untuk kelurahan dan kecamatan ini
    let wilayahData;
    try {
      wilayahData = getWilayahKodes(kecamatanNama, kelurahan);
    } catch (error) {
      // Jika kelurahan tidak cocok dengan kecamatan, gunakan kelurahan default dari kecamatan
      const defaultKelurahan =
        {
          "Jayapura Utara": "Gurabesi",
          "Jayapura Selatan": "Entrop",
          Abepura: "Engros",
          Heram: "Waena",
          "Muara Tami": "Koya Barat",
        }[kecamatanNama] || "Gurabesi";
      wilayahData = getWilayahKodes(kecamatanNama, defaultKelurahan);
    }

    additionalFamilies.push({
      questionnaire: {
        ...wilayahData,
        namaPuskesmas: puskesmas.nama,
        kodePuskesmas: puskesmas.kode,
        rw: String(Math.floor(Math.random() * 10) + 1).padStart(2, "0"),
        rt: String(Math.floor(Math.random() * 10) + 1).padStart(2, "0"),
        noUrutBangunan: String(Math.floor(Math.random() * 100) + 1),
        noUrutKeluarga: String(i + 6).padStart(3, "0"),
        alamatRumah: `Jl. ${wilayahData.desaKelurahan} No. ${
          Math.floor(Math.random() * 100) + 1
        }`,
        namaKepalaKeluarga: kepalaKeluargaNames[i],
        saranaAirBersih: Math.random() > 0.2 ? "YA" : "TIDAK",
        jenisAirMinum: Math.random() > 0.3 ? "PDAM" : "Sumur",
        jambanKeluarga: Math.random() > 0.1 ? "YA" : "TIDAK",
        jenisJamban:
          Math.random() > 0.5
            ? "Kloset duduk dengan leher angsa"
            : "Kloset jongkok dengan leher angsa",
        gangguanJiwaBerat: "TIDAK",
        obatGangguanJiwa: "TIDAK",
        anggotaDipasungi: "TIDAK",
        namaPengumpulData: "Auto Generated", // Will be replaced with actual petugas name
        namaSupervisor: `Dr. ${
          [
            "Sarah Karunggu",
            "Paul Numberi",
            "Ruth Yoku",
            "Michael Wenda",
            "Anna Bonay",
          ][i % 5]
        }`,
        tanggalPengumpulan: new Date(
          `2025-10-${String(6 + i).padStart(2, "0")}`
        ),
      },
      anggotaKeluarga: [
        {
          nama: kepalaKeluargaNames[i],
          hubunganKeluarga: "1", // Kepala Keluarga (Kode Kolom 3)
          tanggalLahir: new Date(
            1970 + Math.floor(Math.random() * 20),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          jenisKelamin: "PRIA",
          statusPerkawinan: "1", // Kawin (Kode Kolom 7)
          agama: Math.random() > 0.4 ? "2" : "3", // 2=Kristen, 3=Katolik (Kode Kolom 9)
          pendidikan: ["3", "4", "5", "7"][Math.floor(Math.random() * 4)], // Kode Kolom 10
          pekerjaan: ["3", "5", "6", "7", "5"][Math.floor(Math.random() * 5)], // Kode Kolom 11
          nik: `917101${String(Math.floor(Math.random() * 1000000)).padStart(
            10,
            "0"
          )}`,
        },
        {
          nama: istriNames[i],
          hubunganKeluarga: "2", // Istri/Suami (Kode Kolom 3)
          tanggalLahir: new Date(
            1972 + Math.floor(Math.random() * 20),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          jenisKelamin: "WANITA",
          statusPerkawinan: "1", // Kawin (Kode Kolom 7)
          agama: Math.random() > 0.4 ? "2" : "3", // 2=Kristen, 3=Katolik (Kode Kolom 9)
          pendidikan: ["3", "4", "5", "7"][Math.floor(Math.random() * 4)], // Kode Kolom 10
          pekerjaan:
            Math.random() > 0.5
              ? "1"
              : ["3", "5", "6"][Math.floor(Math.random() * 3)], // Kode Kolom 11
          nik: `917101${String(Math.floor(Math.random() * 1000000)).padStart(
            10,
            "0"
          )}`,
          sedangHamil: Math.random() > 0.8 ? "YA" : "TIDAK",
        },
        // Anak 1
        {
          nama: `${
            ["Yosua", "Samuel", "Daniel", "Gabriel", "Yakob"][
              Math.floor(Math.random() * 5)
            ]
          } ${kepalaKeluargaNames[i].split(" ")[1]}`,
          hubunganKeluarga: "3", // Anak (Kode Kolom 3)
          tanggalLahir: new Date(
            2010 + Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          jenisKelamin: Math.random() > 0.5 ? "PRIA" : "WANITA",
          statusPerkawinan: "2", // Belum Kawin (Kode Kolom 7)
          agama: Math.random() > 0.4 ? "2" : "3", // 2=Kristen, 3=Katolik (Kode Kolom 9)
          pendidikan: "3", // Tamat SD/MI (Kode Kolom 10)
          pekerjaan: "2", // Sekolah (Kode Kolom 11)
          nik: `917101${String(Math.floor(Math.random() * 1000000)).padStart(
            10,
            "0"
          )}`,
        },
      ],
    });
  }

  return additionalFamilies;
}
