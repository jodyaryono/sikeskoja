# Fitur Kelola Admin

## Deskripsi

Fitur untuk admin menambahkan admin baru dengan memasukkan nomor HP dan data lainnya.

## Backend API

### Endpoint: Create Admin

- **URL**: `POST /api/users/admin`
- **Auth**: Bearer Token (hanya ADMIN)
- **Body**:

```json
{
  "phone": "+6281234567890",
  "email": "newadmin@sikeskoja.com",
  "username": "newadmin",
  "password": "Admin123!",
  "fullName": "Nama Admin Baru"
}
```

### Response Success (201):

```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "...",
    "email": "newadmin@sikeskoja.com",
    "username": "newadmin",
    "phone": "+6281234567890",
    "role": "ADMIN",
    "isActive": true,
    "profile": {
      "fullName": "Nama Admin Baru",
      "phone": "+6281234567890"
    }
  }
}
```

### Response Error:

- **400**: Phone/email/username sudah ada
- **403**: Bukan admin
- **500**: Server error

## Frontend

### Halaman: Admin Management

- **URL**: `/admin`
- **Akses**: Hanya user dengan role ADMIN
- **Fitur**:
  - List semua admin
  - Form tambah admin baru
  - Validasi input
  - Feedback success/error

### Menu Sidebar

Menu "Kelola Admin" hanya muncul untuk user dengan role ADMIN.

## File yang Diubah

### Backend:

1. `src/controllers/usersController.ts` - Tambah fungsi `createAdmin`
2. `src/routes/users.ts` - Tambah route `POST /api/users/admin`

### Frontend:

1. `client/src/pages/AdminManagement.tsx` - Halaman kelola admin (baru)
2. `client/src/App.tsx` - Tambah route `/admin`
3. `client/src/components/Layout.tsx` - Tambah menu "Kelola Admin"

## Testing

### Manual Test dengan HTTP File:

```bash
# File: test-create-admin.http
# 1. Login sebagai admin
# 2. Gunakan token untuk create admin
# 3. Test login dengan admin baru
```

### Test di Browser:

1. Login sebagai admin
2. Klik menu "Kelola Admin" di sidebar
3. Klik "Tambah Admin"
4. Isi form dan submit
5. Admin baru akan muncul di tabel

## Keamanan

- ✅ Endpoint dilindungi dengan `requireRole(['ADMIN'])`
- ✅ Password di-hash dengan bcrypt (12 rounds)
- ✅ Validasi phone/email/username unique
- ✅ Menu hanya tampil untuk admin
- ✅ Role otomatis diset ke ADMIN (tidak bisa diubah user)

## Catatan

- Nomor HP harus unique (wajib format +62...)
- Email harus unique dan valid
- Username harus unique
- Password minimal 8 karakter (sesuai kebutuhan)
- Admin baru otomatis aktif (`isActive: true`)
