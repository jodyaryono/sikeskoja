# 🎯 Role-Based Access Control - SiKesKoja

## Hierarchy Roles

### 1. SUPERADMIN (Jodyaryono - 085719195627)

**Full Access** - Akses penuh ke seluruh sistem

- ✅ Kelola semua Admin
- ✅ Kelola semua Petugas
- ✅ Kelola Dinas Kesehatan
- ✅ Kelola Kuesioner
- ✅ Pengaturan Sistem
- ✅ Export semua data
- ✅ Lihat semua statistik dan laporan

### 2. ADMIN

**High Access** - Dapat manage Petugas dan operasional

- ✅ Kelola Petugas
- ✅ Kelola Dinas Kesehatan
- ✅ Kelola Kuesioner
- ✅ Export data
- ✅ Lihat statistik dan laporan
- ❌ Tidak bisa kelola Admin lain
- ❌ Tidak bisa ubah pengaturan sistem

### 3. PETUGAS

**Standard Access** - Operasional harian

- ✅ Tambah/Edit Dinas Kesehatan
- ✅ Tambah/Edit/Hapus Kuesioner
- ✅ Lihat statistik
- ❌ Tidak bisa kelola user lain
- ❌ Tidak bisa export data

### 4. VIEWER

**Read Only** - Hanya lihat data

- ✅ Lihat Dashboard
- ✅ Lihat Dinas Kesehatan (read-only)
- ✅ Lihat Kuesioner (read-only)
- ❌ Tidak bisa tambah/edit/hapus apapun

### 5. USER

**Limited** - Akses terbatas

- ✅ Lihat Dashboard sendiri
- ❌ Akses terbatas lainnya

---

## 📋 User Management Matrix

| Fitur                  | SUPERADMIN | ADMIN | PETUGAS | VIEWER | USER |
| ---------------------- | :--------: | :---: | :-----: | :----: | :--: |
| Kelola SuperAdmin      |     ✅     |  ❌   |   ❌    |   ❌   |  ❌  |
| Kelola Admin           |     ✅     |  ❌   |   ❌    |   ❌   |  ❌  |
| Kelola Petugas         |     ✅     |  ✅   |   ❌    |   ❌   |  ❌  |
| Kelola Dinas Kesehatan |     ✅     |  ✅   |   ✅    |   👁️   |  ❌  |
| Kelola Kuesioner       |     ✅     |  ✅   |   ✅    |   👁️   |  ❌  |
| Export Data            |     ✅     |  ✅   |   ❌    |   ❌   |  ❌  |
| Pengaturan Sistem      |     ✅     |  ❌   |   ❌    |   ❌   |  ❌  |
| Lihat Statistik        |     ✅     |  ✅   |   ✅    |   ✅   |  ⚠️  |

**Legend:**

- ✅ = Full Access
- 👁️ = View Only
- ⚠️ = Partial Access
- ❌ = No Access

---

## 🎨 Dashboard Features

### Modern Quick Action Buttons

Dashboard dilengkapi dengan **Quick Action Buttons** yang sangat menarik:

#### 1. **Gradient Design**

- Setiap button memiliki gradient warna unik
- Hover effect dengan scale animation
- Smooth transitions

#### 2. **Interactive Elements**

- Icon animasi saat hover
- Badge untuk menampilkan counter
- Arrow indicator
- Decorative circles

#### 3. **Role-Based Display**

Quick buttons yang tampil disesuaikan dengan role:

**SUPERADMIN:**

- ✨ Tambah Kuesioner (Blue)
- 👥 Dinas Kesehatan (Green)
- 👁️ Lihat Kuesioner (Purple)
- 📊 Laporan & Analisis (Orange-Red)
- **Manajemen Sistem:**
  - 👑 Kelola Admin (Indigo)
  - ⚙️ Pengaturan Sistem (Gray)
  - 👥 Kelola Petugas (Teal)
  - 📥 Export Data (Pink-Rose)

**ADMIN:**

- ✨ Tambah Kuesioner
- 👥 Dinas Kesehatan
- 👁️ Lihat Kuesioner
- 📊 Laporan & Analisis
- **Manajemen Sistem:**
  - 👥 Kelola Petugas (Teal)
  - 📥 Export Data (Pink-Rose)

**PETUGAS:**

- ✨ Tambah Kuesioner
- 👥 Dinas Kesehatan
- 👁️ Lihat Kuesioner
- 📊 Laporan & Analisis

---

## 🔐 Authentication

### OTP Login via WhatsApp

Semua user (termasuk SuperAdmin) login menggunakan OTP:

```
1. Masukkan nomor HP
2. Dapatkan OTP via WhatsApp
3. Verifikasi OTP
4. Login berhasil dengan JWT token
```

### Demo Users

**SuperAdmin:**

- Email: jodyaryono@sikeskoja.com
- Phone: 085719195627
- Password: password123

**Admin:**

- Email: admin@sikeskoja.com
- Phone: 081234567890
- Password: password123

**Petugas 1:**

- Email: petugas1@sikeskoja.com
- Phone: 081234567891
- Password: password123

**Petugas 2:**

- Email: petugas2@sikeskoja.com
- Phone: 081234567892
- Password: password123

---

## 🎯 Dashboard Statistics

### Stat Cards (Clean & Modern)

- **Total Dinas Kesehatan** (Blue)
- **Total Kuesioner** (Green)
- **Pengisian Hari Ini** (Yellow)
- **Kuesioner Selesai** (Emerald)

Setiap card menampilkan:

- Icon dengan background color
- Value angka besar
- Perubahan persentase (dengan trend up/down)

### Recent Activity

- List kuesioner terbaru
- Status badge (Selesai/Dalam Proses)
- Quick link ke detail

---

## 🚀 Implementation

### Backend

✅ Database schema updated dengan role baru
✅ Migration applied
✅ Seed data dengan 4 users (1 SuperAdmin, 1 Admin, 2 Petugas)
✅ All CRUD APIs ready

### Frontend

✅ QuickActionButton component (modern & animated)
✅ Dashboard dengan role-based quick buttons
✅ AuthStore updated dengan role baru
✅ Clean & attractive design
✅ Responsive layout

---

## 📱 UI/UX Features

### Clean Design Principles

1. **Minimalist**: Tidak overload informasi
2. **Intuitive**: Quick buttons jelas fungsinya
3. **Attractive**: Gradient colors yang menarik
4. **Professional**: Clean dan modern look
5. **Responsive**: Mobile-friendly

### Animations

- Smooth hover transitions
- Scale effect on buttons
- Icon animations
- Background decorative elements

### Color Palette

- **Blue**: Primary actions (Tambah Kuesioner)
- **Green/Teal**: Data management
- **Purple**: Viewing/Monitoring
- **Orange/Red**: Reports & Analytics
- **Indigo**: Admin management
- **Gray**: System settings
- **Pink/Rose**: Export features

---

## 🔄 Next Steps

### Features to Implement

1. **User Management Pages**

   - SuperAdmin: Kelola Admin & Petugas
   - Admin: Kelola Petugas
   - CRUD operations
   - Role assignment

2. **Enhanced Statistics**

   - Real-time data from API
   - Charts & graphs
   - Activity timeline

3. **Export Functionality**

   - Export to Excel
   - Export to PDF
   - Filtered exports

4. **System Settings**

   - Database configuration
   - Email templates
   - System parameters

5. **Audit Logs**
   - Track user activities
   - Security monitoring
   - Change history

---

## 💡 Design Philosophy

**"Clean but Attractive"**

- ✨ Modern gradient buttons
- 🎨 Colorful yet professional
- 🚀 Fast & responsive
- 📱 Mobile-optimized
- ♿ Accessible

**Key Principles:**

1. Function over form, but make it beautiful
2. Quick access to important features
3. Role-based UI (don't show what users can't access)
4. Clear visual hierarchy
5. Engaging interactions without being distracting
