import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Generate base64 dummy image untuk KTP (simulasi KTP Indonesia)
function generateKTPImage(nik: string, nama: string): string {
  // Ini adalah base64 untuk gambar placeholder KTP
  // Dalam produksi, Anda bisa ganti dengan gambar KTP asli atau generate dengan canvas
  return `data:image/svg+xml;base64,${Buffer.from(
    `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" fill="#e8f4f8" stroke="#003d82" stroke-width="3"/>
      <text x="200" y="30" font-family="Arial" font-size="18" font-weight="bold" fill="#003d82" text-anchor="middle">
        REPUBLIK INDONESIA
      </text>
      <text x="200" y="55" font-family="Arial" font-size="14" fill="#003d82" text-anchor="middle">
        PROVINSI PAPUA
      </text>
      <rect x="20" y="70" width="100" height="130" fill="#ddd" stroke="#666" stroke-width="1"/>
      <text x="70" y="140" font-family="Arial" font-size="10" fill="#666" text-anchor="middle">FOTO</text>
      <text x="140" y="90" font-family="Arial" font-size="10" fill="#000">NIK:</text>
      <text x="140" y="105" font-family="Arial" font-size="11" font-weight="bold" fill="#003d82">${nik}</text>
      <text x="140" y="125" font-family="Arial" font-size="10" fill="#000">Nama:</text>
      <text x="140" y="140" font-family="Arial" font-size="11" font-weight="bold" fill="#000">${nama}</text>
      <text x="140" y="160" font-family="Arial" font-size="9" fill="#666">Tempat/Tgl Lahir: Papua, 01-01-1990</text>
      <text x="140" y="175" font-family="Arial" font-size="9" fill="#666">Jenis Kelamin: L   Gol. Darah: -</text>
      <text x="140" y="190" font-family="Arial" font-size="9" fill="#666">Alamat: Papua</text>
      <text x="20" y="230" font-family="Arial" font-size="8" fill="#999">Berlaku Hingga: SEUMUR HIDUP</text>
    </svg>
  `
  ).toString("base64")}`;
}

// Generate base64 dummy image untuk KK (simulasi Kartu Keluarga)
function generateKKImage(
  noKK: string,
  namaKepala: string,
  jumlahAnggota: number
): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#fff5e6" stroke="#8b4513" stroke-width="3"/>
      <text x="300" y="30" font-family="Arial" font-size="20" font-weight="bold" fill="#8b4513" text-anchor="middle">
        KARTU KELUARGA
      </text>
      <text x="300" y="55" font-family="Arial" font-size="14" fill="#8b4513" text-anchor="middle">
        PROVINSI PAPUA
      </text>
      <line x1="20" y1="70" x2="580" y2="70" stroke="#8b4513" stroke-width="2"/>
      <text x="30" y="95" font-family="Arial" font-size="12" fill="#000">Nomor Kartu Keluarga:</text>
      <text x="30" y="115" font-family="Arial" font-size="14" font-weight="bold" fill="#8b4513">${noKK}</text>
      <text x="30" y="145" font-family="Arial" font-size="12" fill="#000">Nama Kepala Keluarga:</text>
      <text x="30" y="165" font-family="Arial" font-size="13" font-weight="bold" fill="#000">${namaKepala}</text>
      <text x="30" y="195" font-family="Arial" font-size="12" fill="#000">Alamat: Papua</text>
      <text x="30" y="215" font-family="Arial" font-size="12" fill="#000">Jumlah Anggota Keluarga: ${jumlahAnggota} orang</text>
      <line x1="20" y1="240" x2="580" y2="240" stroke="#8b4513" stroke-width="1"/>
      <text x="30" y="265" font-family="Arial" font-size="11" font-weight="bold" fill="#8b4513">DAFTAR ANGGOTA KELUARGA:</text>
      <text x="30" y="285" font-family="Arial" font-size="10" fill="#666">1. ${namaKepala} (Kepala Keluarga)</text>
      <text x="30" y="305" font-family="Arial" font-size="10" fill="#666">2. ... (Anggota Keluarga)</text>
      <text x="30" y="325" font-family="Arial" font-size="10" fill="#666">3. ... (Anggota Keluarga)</text>
      <text x="30" y="370" font-family="Arial" font-size="9" fill="#999">Dikeluarkan tanggal: 01 Januari 2024</text>
    </svg>
  `
  ).toString("base64")}`;
}

// Helper untuk calculate umur
function calculateAge(tanggalLahir: Date): number {
  const today = new Date();
  let age = today.getFullYear() - tanggalLahir.getFullYear();
  const monthDiff = today.getMonth() - tanggalLahir.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < tanggalLahir.getDate())
  ) {
    age--;
  }

  return age;
}

// Nama-nama Papua untuk keluarga
const namaPapuaPria = [
  "Albertus Kogoya",
  "Barnabas Wanggai",
  "Cornelius Yikwa",
  "Daniel Wenda",
  "Elias Enumbi",
  "Fransiskus Tekege",
  "Gabriel Nawipa",
  "Hendrikus Ayomi",
  "Ignatius Karunggu",
  "Jhon Padang",
  "Kristian Wally",
  "Lukas Rumere",
  "Martinus Yoku",
  "Nikolas Asso",
  "Oktavianus Modouw",
  "Paulus Sani",
  "Robertus Wambrauw",
  "Stefanus Imbiri",
  "Timotius Krey",
  "Urbanus Bonay",
  "Viktor Magai",
  "Wilhelmus Mandacan",
  "Yakobus Kafiar",
  "Yosafat Kayame",
  "Zacheus Wetipo",
  "Agustinus Yumte",
  "Benediktus Pigai",
  "Clemens Wenda",
  "Dominikus Gobai",
  "Emanuel Waker",
  "Fabianus Yogi",
  "Gregorius Wally",
  "Hilarius Hindom",
  "Imanuel Yogi",
  "Justinus Soru",
  "Konstantinus Karunggu",
  "Laurensius Tekege",
  "Maksimus Wenda",
  "Natanael Kogoya",
  "Oktavius Yikwa",
  "Petrus Enumbi",
  "Quite Nawipa",
  "Rufinus Ayomi",
  "Siprianus Padang",
  "Terensianus Wally",
  "Urbandus Rumere",
  "Venantius Yoku",
  "Wilhelmus Asso",
  "Xaverius Modouw",
  "Yohanes Sani",
  "Antonius Wambrauw",
  "Bartholomeus Imbiri",
  "Carolus Krey",
  "Desiderius Bonay",
  "Eduardus Magai",
  "Frederikus Mandacan",
  "Gasparus Kafiar",
  "Hendrikus Kayame",
  "Ignasius Wetipo",
  "Julianus Yumte",
  "Klaudius Pigai",
  "Leonardus Wenda",
  "Markus Gobai",
  "Nikolaus Waker",
  "Oktavianus Yogi",
  "Paulinus Wally",
  "Quirinus Hindom",
  "Romanus Yogi",
  "Sebastianus Soru",
  "Theodorus Karunggu",
  "Urbanus Tekege",
  "Valentinus Wenda",
  "Wenseslaus Kogoya",
  "Xystus Yikwa",
  "Yustinus Enumbi",
  "Zacharias Nawipa",
  "Adolphus Ayomi",
  "Bernardus Padang",
  "Cyrillus Wally",
  "Damianus Rumere",
  "Egidius Yoku",
  "Florentius Asso",
  "Georgius Modouw",
  "Hieronymus Sani",
  "Innocentius Wambrauw",
  "Johannes Imbiri",
  "Laurentius Krey",
  "Melchior Bonay",
  "Norbertus Magai",
  "Oswald Mandacan",
  "Placidus Kafiar",
  "Quintus Kayame",
  "Richardus Wetipo",
  "Silvester Yumte",
  "Timoteus Pigai",
  "Ursicinus Wenda",
  "Vincentius Gobai",
  "Wolfgangus Waker",
  "Xanthippus Yogi",
  "Yosef Wally",
];

const namaPapuaWanita = [
  "Agatha Kogoya",
  "Bernadeta Wanggai",
  "Christina Yikwa",
  "Dorothea Wenda",
  "Elisabeth Enumbi",
  "Fransiska Tekege",
  "Gratia Nawipa",
  "Helena Ayomi",
  "Irmina Karunggu",
  "Juliana Padang",
  "Kristina Wally",
  "Lucia Rumere",
  "Maria Yoku",
  "Natalia Asso",
  "Oktavia Modouw",
  "Paulina Sani",
  "Regina Wambrauw",
  "Stefania Imbiri",
  "Theresia Krey",
  "Ursula Bonay",
  "Veronika Magai",
  "Wilhelmina Mandacan",
  "Xaveria Kafiar",
  "Yohana Kayame",
  "Zita Wetipo",
  "Anastasia Yumte",
  "Beatrix Pigai",
  "Cecilia Wenda",
  "Damaris Gobai",
  "Emilia Waker",
  "Felisitas Yogi",
  "Gloria Wally",
  "Hildegardis Hindom",
  "Ida Yogi",
  "Justina Soru",
  "Konstantia Karunggu",
  "Laurentia Tekege",
  "Magdalena Wenda",
  "Natasha Kogoya",
  "Olivia Yikwa",
  "Priska Enumbi",
  "Quiteria Nawipa",
  "Rosalia Ayomi",
  "Silvia Padang",
  "Tabita Wally",
  "Ursula Rumere",
  "Valeria Yoku",
  "Winifrida Asso",
  "Xenia Modouw",
  "Yana Sani",
  "Angela Wambrauw",
  "Barbara Imbiri",
  "Clarissa Krey",
  "Debora Bonay",
  "Edith Magai",
  "Fidelia Mandacan",
  "Gabriela Kafiar",
  "Helena Kayame",
  "Ines Wetipo",
  "Johanna Yumte",
  "Klara Pigai",
  "Lidwina Wenda",
  "Margareta Gobai",
  "Natanela Waker",
  "Odilia Yogi",
  "Perpetua Wally",
  "Quintina Hindom",
  "Rosemary Yogi",
  "Sebastiana Soru",
  "Theodora Karunggu",
  "Ursina Tekege",
  "Valentina Wenda",
  "Walburga Kogoya",
  "Xandra Yikwa",
  "Yustina Enumbi",
  "Zelia Nawipa",
  "Adriana Ayomi",
  "Brigita Padang",
  "Cornelia Wally",
  "Diana Rumere",
  "Eugenia Yoku",
  "Felicia Asso",
  "Georgina Modouw",
  "Hermana Sani",
  "Irene Wambrauw",
  "Josephina Imbiri",
  "Leandra Krey",
  "Melania Bonay",
  "Natania Magai",
  "Oswalda Mandacan",
  "Philomena Kafiar",
  "Quinta Kayame",
  "Richarda Wetipo",
  "Silvana Yumte",
  "Timothea Pigai",
  "Ursulina Wenda",
  "Vincentia Gobai",
  "Wilma Waker",
  "Xanthia Yogi",
  "Yosefa Wally",
];

// Daftar Kecamatan dan Desa di Papua (sampel)
const wilayahPapua = [
  {
    kecamatan: "SENTANI",
    desa: "SENTANI KOTA",
    kabupaten: "KABUPATEN JAYAPURA",
  },
  { kecamatan: "SENTANI", desa: "IFALE", kabupaten: "KABUPATEN JAYAPURA" },
  { kecamatan: "SENTANI", desa: "HOBONG", kabupaten: "KABUPATEN JAYAPURA" },
  {
    kecamatan: "SENTANI BARAT",
    desa: "DOYO BARU",
    kabupaten: "KABUPATEN JAYAPURA",
  },
  {
    kecamatan: "SENTANI BARAT",
    desa: "DOYO LAMA",
    kabupaten: "KABUPATEN JAYAPURA",
  },
  {
    kecamatan: "SENTANI TIMUR",
    desa: "WAENA",
    kabupaten: "KABUPATEN JAYAPURA",
  },
  { kecamatan: "SENTANI TIMUR", desa: "YOKA", kabupaten: "KABUPATEN JAYAPURA" },
  { kecamatan: "ABEPURA", desa: "ABEPURA", kabupaten: "KOTA JAYAPURA" },
  { kecamatan: "ABEPURA", desa: "ENTROP", kabupaten: "KOTA JAYAPURA" },
  { kecamatan: "HERAM", desa: "WAENA", kabupaten: "KOTA JAYAPURA" },
  { kecamatan: "JAYAPURA UTARA", desa: "GURABESI", kabupaten: "KOTA JAYAPURA" },
  { kecamatan: "JAYAPURA SELATAN", desa: "IMBI", kabupaten: "KOTA JAYAPURA" },
  { kecamatan: "MUARA TAMI", desa: "SKOUW YAMBE", kabupaten: "KOTA JAYAPURA" },
  { kecamatan: "WAMENA", desa: "SINAKMA", kabupaten: "KABUPATEN JAYAWIJAYA" },
  {
    kecamatan: "WAMENA",
    desa: "WALELAGAMA",
    kabupaten: "KABUPATEN JAYAWIJAYA",
  },
  {
    kecamatan: "MIMIKA BARU",
    desa: "KWAMKI LAMA",
    kabupaten: "KABUPATEN MIMIKA",
  },
  { kecamatan: "NABIRE", desa: "NABIRE BARAT", kabupaten: "KABUPATEN NABIRE" },
  {
    kecamatan: "BIAK KOTA",
    desa: "SAMOFA",
    kabupaten: "KABUPATEN BIAK NUMFOR",
  },
  { kecamatan: "MERAUKE", desa: "KELAPA LIMA", kabupaten: "KABUPATEN MERAUKE" },
  { kecamatan: "SARMI", desa: "SARMI KOTA", kabupaten: "KABUPATEN SARMI" },
];

async function main() {
  console.log("🌱 Mulai seeding 100 keluarga dengan foto KTP dan KK...");

  // Ambil semua user petugas untuk assign sebagai pengumpul data
  const petugasList = await prisma.user.findMany({
    where: { role: "PETUGAS" },
  });

  if (petugasList.length === 0) {
    throw new Error(
      "Tidak ada user dengan role PETUGAS. Jalankan seed utama dulu!"
    );
  }

  let totalQuestionnaireCreated = 0;
  let totalAnggotaCreated = 0;

  for (let i = 1; i <= 100; i++) {
    try {
      // Pilih petugas secara random
      const petugas =
        petugasList[Math.floor(Math.random() * petugasList.length)];

      // Pilih wilayah secara random
      const wilayah =
        wilayahPapua[Math.floor(Math.random() * wilayahPapua.length)];

      // Generate nama kepala keluarga
      const namaKepala =
        namaPapuaPria[i - 1] ||
        `${namaPapuaPria[Math.floor(Math.random() * namaPapuaPria.length)]}`;

      // Generate NIK dan No KK
      const nik = `9471${String(i).padStart(12, "0")}`;
      const noKK = `9471${String(i).padStart(12, "0")}`;

      // Jumlah anggota keluarga random (2-6 orang)
      const jumlahAnggota = Math.floor(Math.random() * 5) + 2;

      // Generate foto KK untuk kepala keluarga
      const fotoKK = generateKKImage(noKK, namaKepala, jumlahAnggota);

      // Tanggal pengumpulan random dalam 6 bulan terakhir
      const tanggalRandom = new Date();
      tanggalRandom.setDate(
        tanggalRandom.getDate() - Math.floor(Math.random() * 180)
      );

      // Create Questionnaire
      const questionnaire = await prisma.questionnaire.create({
        data: {
          createdBy: petugas.id,
          provinsi: "PAPUA",
          provinsiKode: "94",
          kabupatenKota: wilayah.kabupaten,
          kabupatenKode: "9471",
          kecamatan: wilayah.kecamatan,
          kecamatanKode: "9471010",
          namaPuskesmas: "Puskesmas " + wilayah.desa,
          kodePuskesmas: `PKM-${String(i).padStart(3, "0")}`,
          desaKelurahan: wilayah.desa,
          desaKode: "9471010001",
          rw: String(Math.floor(Math.random() * 10) + 1).padStart(2, "0"),
          rt: String(Math.floor(Math.random() * 10) + 1).padStart(2, "0"),
          noUrutBangunan: String(Math.floor(Math.random() * 100) + 1),
          noUrutKeluarga: String(i).padStart(3, "0"),
          alamatRumah: `Jl. ${wilayah.desa} No. ${
            Math.floor(Math.random() * 100) + 1
          }`,
          latitude: -2.5 + Math.random() * 0.5,
          longitude: 140.5 + Math.random() * 0.5,
          namaKepalaKeluarga: namaKepala,
          saranaAirBersih: Math.random() > 0.3 ? "YA" : "TIDAK",
          jenisAirMinum: ["PDAM", "SUMUR", "AIR_HUJAN", "MATA_AIR"][
            Math.floor(Math.random() * 4)
          ] as any,
          jambanKeluarga: Math.random() > 0.2 ? "YA" : "TIDAK",
          jenisJamban: ["KLOSET_LEHER_ANGSA", "PLENGSENGAN", "CEMPLUNG_CUBLUK"][
            Math.floor(Math.random() * 3)
          ] as any,
          gangguanJiwaBerat: Math.random() > 0.9 ? "YA" : "TIDAK",
          obatGangguanJiwa: Math.random() > 0.95 ? "YA" : "TIDAK",
          anggotaDipasungi: Math.random() > 0.85 ? "YA" : "TIDAK",
          namaPengumpulData: petugas.username,
          namaSupervisor: "Supervisor " + String(Math.floor(i / 10) + 1),
          tanggalPengumpulan: tanggalRandom,
          statusProses: ["DRAFT", "SUBMITTED", "VERIFIED"][
            Math.floor(Math.random() * 3)
          ] as any,
        },
      });

      totalQuestionnaireCreated++;

      // Create Anggota Keluarga
      const anggotaList = [];

      // 1. Kepala Keluarga
      const tanggalLahirKepala = new Date(
        1970 + Math.floor(Math.random() * 30),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );
      const umurKepala = calculateAge(tanggalLahirKepala);
      const fotoKTPKepala = generateKTPImage(nik, namaKepala);

      anggotaList.push({
        questionnaireId: questionnaire.id,
        nama: namaKepala,
        nik: nik,
        hubunganKeluarga: "1", // Kepala Keluarga
        tanggalLahir: tanggalLahirKepala,
        umur: umurKepala,
        jenisKelamin: "PRIA",
        statusPerkawinan: "1", // Kawin
        agama: ["2", "3"][Math.floor(Math.random() * 2)], // Kristen/Katolik
        pendidikan: ["4", "5", "6", "7"][Math.floor(Math.random() * 4)],
        pekerjaan: ["3", "4", "5", "6"][Math.floor(Math.random() * 4)],
        ktpFile: fotoKTPKepala,
        kkFile: fotoKK,
        provinsi: "PAPUA",
        provinsiKode: "94",
        kabupatenKota: wilayah.kabupaten,
        kabupatenKode: "9471",
        kecamatan: wilayah.kecamatan,
        kecamatanKode: "9471010",
        desaKelurahan: wilayah.desa,
        desaKode: "9471010001",
        rw: questionnaire.rw,
        rt: questionnaire.rt,
        noUrutBangunan: questionnaire.noUrutBangunan,
        noUrutKeluarga: questionnaire.noUrutKeluarga,
        alamatRumah: questionnaire.alamatRumah,
        ikutiKepalaKeluarga: false,
      });

      // 2. Istri/Suami
      if (jumlahAnggota >= 2) {
        const namaIstri =
          namaPapuaWanita[i - 1] ||
          namaPapuaWanita[Math.floor(Math.random() * namaPapuaWanita.length)];
        const nikIstri = `9471${String(i * 1000 + 1).padStart(12, "0")}`;
        const tanggalLahirIstri = new Date(
          1972 + Math.floor(Math.random() * 28),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        );
        const umurIstri = calculateAge(tanggalLahirIstri);
        const fotoKTPIstri = generateKTPImage(nikIstri, namaIstri);

        anggotaList.push({
          questionnaireId: questionnaire.id,
          nama: namaIstri,
          nik: nikIstri,
          hubunganKeluarga: "2", // Istri/Suami
          tanggalLahir: tanggalLahirIstri,
          umur: umurIstri,
          jenisKelamin: "WANITA",
          statusPerkawinan: "1", // Kawin
          agama: ["2", "3"][Math.floor(Math.random() * 2)],
          pendidikan: ["3", "4", "5", "6"][Math.floor(Math.random() * 4)],
          pekerjaan: ["2", "5", "8"][Math.floor(Math.random() * 3)],
          ktpFile: fotoKTPIstri,
          provinsi: "PAPUA",
          provinsiKode: "94",
          kabupatenKota: wilayah.kabupaten,
          kabupatenKode: "9471",
          kecamatan: wilayah.kecamatan,
          kecamatanKode: "9471010",
          desaKelurahan: wilayah.desa,
          desaKode: "9471010001",
          rw: questionnaire.rw,
          rt: questionnaire.rt,
          noUrutBangunan: questionnaire.noUrutBangunan,
          noUrutKeluarga: questionnaire.noUrutKeluarga,
          alamatRumah: questionnaire.alamatRumah,
          ikutiKepalaKeluarga: true,
        });
      }

      // 3-6. Anak-anak
      for (let j = 3; j <= jumlahAnggota; j++) {
        const jenisKelamin = Math.random() > 0.5 ? "PRIA" : "WANITA";
        const namaAnak =
          jenisKelamin === "PRIA"
            ? namaPapuaPria[Math.floor(Math.random() * namaPapuaPria.length)]
            : namaPapuaWanita[
                Math.floor(Math.random() * namaPapuaWanita.length)
              ];
        const nikAnak = `9471${String(i * 1000 + j - 1).padStart(12, "0")}`;
        const tanggalLahirAnak = new Date(
          2000 + Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        );
        const umurAnak = calculateAge(tanggalLahirAnak);
        const fotoKTPAnak = generateKTPImage(nikAnak, namaAnak);

        anggotaList.push({
          questionnaireId: questionnaire.id,
          nama: namaAnak,
          nik: nikAnak,
          hubunganKeluarga: "3", // Anak
          tanggalLahir: tanggalLahirAnak,
          umur: umurAnak,
          jenisKelamin: jenisKelamin,
          statusPerkawinan:
            umurAnak >= 17 ? (Math.random() > 0.7 ? "1" : "2") : "2", // Kawin/Belum Kawin
          agama: ["2", "3"][Math.floor(Math.random() * 2)],
          pendidikan:
            umurAnak < 7
              ? "1"
              : umurAnak < 13
              ? "3"
              : umurAnak < 16
              ? "4"
              : umurAnak < 19
              ? "5"
              : ["5", "6", "7"][Math.floor(Math.random() * 3)],
          pekerjaan:
            umurAnak < 18
              ? "2"
              : ["2", "3", "4", "5", "8"][Math.floor(Math.random() * 5)],
          ktpFile: fotoKTPAnak,
          provinsi: "PAPUA",
          provinsiKode: "94",
          kabupatenKota: wilayah.kabupaten,
          kabupatenKode: "9471",
          kecamatan: wilayah.kecamatan,
          kecamatanKode: "9471010",
          desaKelurahan: wilayah.desa,
          desaKode: "9471010001",
          rw: questionnaire.rw,
          rt: questionnaire.rt,
          noUrutBangunan: questionnaire.noUrutBangunan,
          noUrutKeluarga: questionnaire.noUrutKeluarga,
          alamatRumah: questionnaire.alamatRumah,
          ikutiKepalaKeluarga: true,
        });
      }

      // Insert semua anggota keluarga sekaligus
      await prisma.anggotaKeluarga.createMany({
        data: anggotaList,
      });

      totalAnggotaCreated += anggotaList.length;

      // Log progress setiap 10 keluarga
      if (i % 10 === 0) {
        console.log(
          `✅ Progress: ${i}/100 keluarga (${totalAnggotaCreated} anggota)`
        );
      }
    } catch (error) {
      console.error(`❌ Error creating family ${i}:`, error);
    }
  }

  console.log("\n🎉 Seeding selesai!");
  console.log(`✅ Total Questionnaire dibuat: ${totalQuestionnaireCreated}`);
  console.log(`✅ Total Anggota Keluarga dibuat: ${totalAnggotaCreated}`);
  console.log(`✅ Setiap anggota keluarga memiliki foto KTP (base64 SVG)`);
  console.log(`✅ Setiap kepala keluarga memiliki foto KK (base64 SVG)`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
