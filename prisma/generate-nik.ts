/**
 * Generate NIK (Nomor Induk Kependudukan) for Papua - Kota Jayapura
 * Format: AA BB CC DDMMYY XXXX
 *
 * AA = Kode provinsi (91 = Papua)
 * BB = Kode kabupaten/kota (71 = Kota Jayapura)
 * CC = Kode kecamatan
 *      01 = Jayapura Utara
 *      02 = Jayapura Selatan
 *      03 = Abepura
 *      04 = Heram
 *      05 = Muara Tami
 * DDMMYY = Tanggal lahir (DD + 40 untuk perempuan)
 * XXXX = Nomor urut (0001-9999)
 */

const KODE_PROVINSI = "91"; // Papua
const KODE_KOTA = "71"; // Kota Jayapura

const kodeKecamatan: { [key: string]: string } = {
  "Jayapura Utara": "01",
  "Jayapura Selatan": "02",
  Abepura: "03",
  Heram: "04",
  "Muara Tami": "05",
};

export function generateNIK(
  tanggalLahir: Date,
  jenisKelamin: string,
  kecamatan: string,
  nomorUrut: number
): string {
  const kodeKec = kodeKecamatan[kecamatan] || "01";

  // Extract date components
  let dd = tanggalLahir.getDate();
  const mm = tanggalLahir.getMonth() + 1; // 0-indexed
  const yy = tanggalLahir.getFullYear() % 100; // Last 2 digits

  // Add 40 to day for females
  if (jenisKelamin === "WANITA" || jenisKelamin === "Wanita") {
    dd += 40;
  }

  // Format with leading zeros
  const ddStr = String(dd).padStart(2, "0");
  const mmStr = String(mm).padStart(2, "0");
  const yyStr = String(yy).padStart(2, "0");
  const xxxxStr = String(nomorUrut).padStart(4, "0");

  return `${KODE_PROVINSI}${KODE_KOTA}${kodeKec}${ddStr}${mmStr}${yyStr}${xxxxStr}`;
}

// Generate NIK with auto-increment counter per kecamatan
let counterByKecamatan: { [key: string]: number } = {};

export function generateNIKWithAutoCounter(
  tanggalLahir: Date,
  jenisKelamin: string,
  kecamatan: string
): string {
  // Initialize counter for kecamatan if not exists
  if (!counterByKecamatan[kecamatan]) {
    counterByKecamatan[kecamatan] = 1;
  }

  const nik = generateNIK(
    tanggalLahir,
    jenisKelamin,
    kecamatan,
    counterByKecamatan[kecamatan]
  );

  // Increment counter
  counterByKecamatan[kecamatan]++;

  return nik;
}

// Reset counter (useful for testing)
export function resetNIKCounter() {
  counterByKecamatan = {};
}

// Parse NIK to extract information
export function parseNIK(nik: string) {
  if (nik.length !== 16) {
    throw new Error("NIK must be 16 digits");
  }

  const provinsi = nik.substring(0, 2);
  const kabkota = nik.substring(2, 4);
  const kecamatan = nik.substring(4, 6);
  let dd = parseInt(nik.substring(6, 8));
  const mm = parseInt(nik.substring(8, 10));
  const yy = parseInt(nik.substring(10, 12));
  const urut = nik.substring(12, 16);

  // Determine gender
  let jenisKelamin = "PRIA";
  if (dd > 40) {
    jenisKelamin = "WANITA";
    dd -= 40;
  }

  // Construct date (assuming 1900s or 2000s based on yy)
  const fullYear = yy > 50 ? 1900 + yy : 2000 + yy;
  const tanggalLahir = new Date(fullYear, mm - 1, dd);

  return {
    provinsi,
    kabkota,
    kecamatan,
    tanggalLahir,
    jenisKelamin,
    nomorUrut: urut,
  };
}
