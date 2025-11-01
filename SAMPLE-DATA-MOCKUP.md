# 📊 Sample Data & Mockup - Sistem Kuesioner Keluarga Sehat (KS)

## 🎯 Overview

File ini berisi sample data realistis untuk sistem pendataan kesehatan keluarga sehat di Indonesia. Data ini dapat digunakan untuk:

- **Mockup & Presentasi**
- **Testing & Development**
- **Demo untuk Stakeholder**
- **Training Petugas Lapangan**

---

## 📁 File Structure

```
prisma/
├── sample-data.ts      # Sample data keluarga dengan 5 skenario berbeda
├── seed.ts            # Script untuk populate database
└── schema.prisma      # Database schema
```

---

## 👨‍👩‍👧‍👦 Sample Data - 5 Keluarga

### 1. **Keluarga Muda dengan Balita** 🍼

- **Kepala Keluarga**: Ahmad Rizki (35 tahun, Karyawan Swasta)
- **Lokasi**: Cilandak, Jakarta Selatan
- **Anggota**: 4 orang (Ayah, Ibu, Anak 3 tahun, Bayi 1 tahun)
- **Highlight**:
  - ✅ Semua punya JKN
  - ✅ Balita imunisasi lengkap
  - ✅ Bayi ASI eksklusif
  - ✅ Sanitasi baik (PDAM, jamban leher angsa)

### 2. **Keluarga dengan Lansia** 👴

- **Kepala Keluarga**: Budi Santoso (59 tahun, Pensiunan PNS)
- **Lokasi**: Menteng, Jakarta Pusat
- **Anggota**: 3 orang (Ayah, Ibu, Anak dewasa)
- **Highlight**:
  - ⚠️ 2 orang hipertensi (terkontrol dengan obat)
  - ⚠️ Kepala keluarga merokok
  - ✅ Rutin kontrol tekanan darah
  - ✅ Semua punya JKN

### 3. **Keluarga dengan Ibu Hamil** 🤰

- **Kepala Keluarga**: Eko Prasetyo (37 tahun, Manager)
- **Lokasi**: Kelapa Gading, Jakarta Utara
- **Anggota**: 3 orang (Ayah, Ibu hamil, Anak 5 tahun)
- **Highlight**:
  - 👶 Ibu sedang hamil
  - ✅ Kontrol kehamilan rutin
  - ✅ Balita imunisasi lengkap
  - ✅ Ekonomi menengah atas

### 4. **Keluarga dengan Riwayat TB** 🏥

- **Kepala Keluarga**: Darmawan (47 tahun, Wiraswasta)
- **Lokasi**: Tanah Abang, Jakarta Barat
- **Anggota**: 4 orang (Ayah, Ibu, 2 anak)
- **Highlight**:
  - ⚠️ Kepala keluarga diagnosis TB (sedang minum obat 6 bulan)
  - ⚠️ Kepala keluarga merokok
  - ⚠️ Air bersih dari sumur
  - ✅ Berobat teratur di Puskesmas

### 5. **Keluarga Besar dengan Gangguan Jiwa** 🏠

- **Kepala Keluarga**: Hadi Purnomo (55 tahun, PNS)
- **Lokasi**: Kebayoran Baru, Jakarta Selatan
- **Anggota**: 5 orang (Ayah, Ibu, 2 anak, Nenek 80 tahun)
- **Highlight**:
  - ⚠️ 1 anggota keluarga gangguan jiwa berat (minum obat teratur)
  - ⚠️ Nenek hipertensi tidak terkontrol
  - ✅ Semua punya JKN
  - ✅ Rumah layak huni

---

## 📊 Statistik Dashboard (Mockup)

### Total Data

- 📋 **Total Kuesioner**: 247 keluarga
- 👨‍👩‍👧‍👦 **Total Anggota Keluarga**: 1,042 orang
- 📅 **Bulan Ini**: 45 kuesioner baru

### Status Kuesioner

- ✅ **Completed**: 180 (73%)
- 📝 **Submitted**: 35 (14%)
- ⏳ **In Progress**: 8 (3%)
- 📄 **Draft**: 12 (5%)
- ✔️ **Verified**: 12 (5%)

### Distribusi Wilayah

- **DKI Jakarta**: 150 keluarga (61%)
- **Jawa Barat**: 45 keluarga (18%)
- **Jawa Tengah**: 28 keluarga (11%)
- **Jawa Timur**: 15 keluarga (6%)
- **Banten**: 9 keluarga (4%)

### Indikator Kesehatan

| Indikator                     | Jumlah  | Persentase |
| ----------------------------- | ------- | ---------- |
| Kepemilikan JKN               | 945     | 90.7%      |
| Hipertensi                    | 87      | 8.3%       |
| Tuberkulosis                  | 12      | 1.2%       |
| Gangguan Jiwa                 | 5       | 0.5%       |
| Balita Imunisasi Lengkap      | 156/172 | 90.7%      |
| Ibu Hamil                     | 23      | -          |
| Pengguna KB (Wanita 10-54 th) | 198/412 | 48.1%      |

---

## 👥 User Credentials (Mockup)

### SUPERADMIN

- **Nama**: Jodyaryono
- **Phone**: 085719195627
- **Email**: jodyaryono@sikeskoja.com
- **Password**: password123
- **Role**: Full access ke sistem

### PETUGAS 1

- **Nama**: Siti Nurhaliza
- **Phone**: 081234567801
- **Email**: siti.nurhaliza@sikeskoja.com
- **Password**: petugas123
- **Wilayah**: Jakarta Selatan

### PETUGAS 2

- **Nama**: Rina Marlina
- **Phone**: 081234567802
- **Email**: rina.marlina@sikeskoja.com
- **Password**: petugas123
- **Wilayah**: Jakarta Pusat

### PETUGAS 3

- **Nama**: Lina Anggraeni
- **Phone**: 081234567803
- **Email**: lina.anggraeni@sikeskoja.com
- **Password**: petugas123
- **Wilayah**: Jakarta Utara

---

## 🚀 Cara Menggunakan Sample Data

### 1. Seed Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run seed script
npm run prisma:seed
```

### 2. Verifikasi Data

```bash
# Buka Prisma Studio
npm run prisma:studio

# Check di browser: http://localhost:5555
```

### 3. Test di Aplikasi

1. Login dengan salah satu user di atas
2. Lihat dashboard dengan sample data
3. Browse kuesioner yang sudah ada
4. Test tambah kuesioner baru

---

## 📋 Struktur Kuesioner KS

### I. PENGENALAN TEMPAT

- Provinsi, Kabupaten/Kota
- Kecamatan, Desa/Kelurahan
- RW, RT, No. Urut Bangunan
- Nama Puskesmas & Kode
- Alamat Rumah

### II. KETERANGAN KELUARGA

- Nama Kepala Keluarga
- Jumlah Anggota Keluarga (berbagai kategori umur)
- Sarana Air Bersih
- Jamban Keluarga
- Gangguan Jiwa Berat

### III. KETERANGAN PENGUMPUL DATA

- Nama Pengumpul Data
- Nama Supervisor
- Tanggal Pengumpulan

### IV. KETERANGAN ANGGOTA KELUARGA (Per Individu)

#### A. Identitas Individu

- Nama, NIK
- Tanggal Lahir (Umur dihitung otomatis ✨)
- Jenis Kelamin
- Hubungan Keluarga
- Status Perkawinan
- Agama, Pendidikan, Pekerjaan
- Status Hamil (untuk wanita 10-54 th)

#### B. Gangguan Kesehatan

**Untuk Semua Umur:**

- Kepemilikan Kartu JKN
- Merokok

**Untuk Usia ≥ 15 Tahun:**

- BAB di jamban
- Penggunaan air bersih
- Diagnosis TB & pengobatan
- Diagnosis Hipertensi & pengobatan
- Pengukuran tekanan darah

**Untuk Wanita 10-54 Tahun:**

- Penggunaan alat/obat KB

**Untuk Ibu dengan Bayi < 12 Bulan:**

- Melahirkan di fasilitas kesehatan

**Untuk Bayi 0-6 Bulan:**

- ASI Eksklusif

**Untuk Bayi 12-23 Bulan:**

- Imunisasi Lengkap

**Untuk Anak 2-59 Bulan:**

- Pemantauan Pertumbuhan Balita

---

## 🎨 Mockup Scenarios

### Scenario 1: Petugas Survey Harian

**Context**: Petugas datang ke RT 05/RW 03, Cilandak  
**Workflow**:

1. Login dengan petugas account
2. Tambah Kuesioner Baru
3. Isi data lokasi & keluarga
4. Tambah anggota keluarga (tanggal lahir → umur otomatis)
5. Isi data kesehatan per individu
6. Submit kuesioner

### Scenario 2: Supervisor Review

**Context**: Supervisor cek hasil survey harian  
**Workflow**:

1. Login dengan supervisor account
2. View dashboard dengan chart & statistik
3. Filter kuesioner by status "Submitted"
4. Review detail kuesioner
5. Verify atau Reject

### Scenario 3: Superadmin Monitoring

**Context**: Monitoring nasional  
**Workflow**:

1. Login sebagai SUPERADMIN
2. View dashboard nasional
3. Filter by provinsi/kabupaten
4. Export data untuk laporan
5. Analisis trend kesehatan

---

## 📈 Key Features Highlighted in Sample Data

### ✨ Auto-Calculate Umur

- Input hanya tanggal lahir
- Umur dihitung otomatis
- Tampil di form & list

### 🎯 Multi-Level Tabs

- Tab Level 1: I-IV (Pengenalan Tempat, Keterangan, dll)
- Tab Level 2: A-B (Identitas & Gangguan Kesehatan)
- Navigasi intuitif

### 📊 Real-time Statistics

- Jumlah kuesioner per status
- Distribusi wilayah
- Indikator kesehatan utama

### 🔒 Role-Based Access

- SUPERADMIN: Full access
- ADMIN: Manage petugas
- PETUGAS: Input & edit kuesioner
- VIEWER: Read-only

---

## 💡 Tips untuk Presentasi

1. **Start with Dashboard**: Tunjukkan overview data
2. **Show Sample Family**: Pilih Keluarga #1 (paling ideal)
3. **Demonstrate Add Form**: Tambah keluarga baru dengan live demo
4. **Highlight Auto-Calculate**: Fokus pada fitur umur otomatis
5. **Show Different Scenarios**: Keluarga dengan TB, Hipertensi, dll
6. **End with Reports**: Export data & visualisasi

---

## 🎯 Mockup Goals

### For Stakeholders

- ✅ Proof of concept with realistic data
- ✅ User flow demonstration
- ✅ Feature showcase

### For Developers

- ✅ Test data for development
- ✅ Edge case scenarios
- ✅ Performance testing with volume

### For Training

- ✅ Real-world examples
- ✅ Step-by-step workflows
- ✅ Common scenarios

---

## 📞 Contact & Support

**Project**: SiKesKoja - Sistem Pendataan Kesehatan  
**Developer**: Jodyaryono  
**Phone**: 085719195627  
**Email**: jodyaryono@sikeskoja.com

---

**© 2025 SiKesKoja. All rights reserved.**
