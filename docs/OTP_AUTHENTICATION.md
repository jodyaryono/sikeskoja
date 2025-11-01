# OTP Authentication - SiKesKoja

## Sistem Kesehatan Kota Jayapura - Modular Authentication System

SiKesKoja menggunakan sistem OTP (One-Time Password) via WhatsApp untuk autentikasi yang aman dan mudah.

---

## 🔐 Fitur OTP Authentication

- ✅ Login menggunakan OTP via WhatsApp
- ✅ Kode OTP 6 digit
- ✅ Berlaku selama 5 menit
- ✅ Integrasi dengan WhatsApp API (Whacenter)
- ✅ Support fallback ke password login
- ✅ Modular dan mudah dikembangkan

---

## 📱 Konfigurasi WhatsApp Device

### Device ID

```env
WHATSAPP_DEVICE_ID=59087f966f4f8cc3385569ef6481cc29
```

### WhatsApp API Endpoint

```
https://app.whacenter.com/api/send
```

### Status Device

Check device connection:

```bash
GET /api/auth/otp/status
```

Response jika terhubung:

```json
{
  "success": true,
  "data": {
    "connected": true,
    "deviceId": "59087f966f4f8cc3385569ef6481cc29"
  }
}
```

Response jika tidak terhubung:

```json
{
  "status": false,
  "message": "device not connected or not found",
  "data": []
}
```

---

## 🚀 API Endpoints

### 1. Request OTP

Kirim kode OTP ke nomor WhatsApp pengguna.

**Endpoint:**

```
POST /api/auth/otp/request
```

**Request Body:**

```json
{
  "phone": "081234567890"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Kode OTP telah dikirim ke WhatsApp Anda",
  "data": {
    "sessionId": "cmh...",
    "expiresAt": "2024-10-30T10:15:00.000Z"
  }
}
```

**Error Responses:**

Nomor tidak terdaftar:

```json
{
  "success": false,
  "message": "Nomor telepon tidak terdaftar atau akun tidak aktif"
}
```

Device WhatsApp tidak terhubung:

```json
{
  "success": false,
  "message": "Gagal mengirim OTP via WhatsApp. Perangkat tidak terhubung.",
  "details": "device not connected or not found"
}
```

---

### 2. Verify OTP

Verifikasi kode OTP dan login.

**Endpoint:**

```
POST /api/auth/otp/verify
```

**Request Body:**

```json
{
  "phone": "081234567890",
  "otpCode": "123456"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cmh...",
      "email": "admin@sikeskoja.com",
      "username": "admin",
      "phone": "081234567890",
      "role": "ADMIN",
      "profile": {
        "fullName": "Administrator SiKesKoja",
        "phone": "081234567890"
      }
    }
  }
}
```

**Error Responses:**

Kode OTP salah atau kadaluarsa:

```json
{
  "success": false,
  "message": "Kode OTP tidak valid atau sudah kadaluarsa"
}
```

---

### 3. Resend OTP

Kirim ulang kode OTP baru.

**Endpoint:**

```
POST /api/auth/otp/resend
```

**Request Body:**

```json
{
  "phone": "081234567890"
}
```

**Response:** Sama dengan Request OTP

---

## 💬 Format Pesan WhatsApp OTP

```
Halo [Nama User],

Kode OTP untuk login ke SiKesKoja - Sistem Kesehatan Kota Jayapura:

*123456*

Kode ini berlaku selama 5 menit.
Jangan bagikan kode ini kepada siapapun.

Terima kasih,
Tim SiKesKoja
```

---

## 👥 Demo Users dengan OTP

| Role       | Phone        | Email                    | Password (fallback) |
| ---------- | ------------ | ------------------------ | ------------------- |
| Admin      | 081234567890 | admin@sikeskoja.com      | password123         |
| Supervisor | 081234567891 | supervisor@sikeskoja.com | password123         |
| Operator   | 081234567892 | operator@sikeskoja.com   | password123         |

---

## 🔧 Konfigurasi Environment

```env
# WhatsApp OTP Configuration
WHATSAPP_DEVICE_ID=59087f966f4f8cc3385569ef6481cc29
OTP_EXPIRES_IN=5          # Durasi dalam menit
OTP_LENGTH=6              # Panjang kode OTP
```

---

## 📊 Database Schema

### User Table

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String?  // Optional untuk OTP-only users
  phone     String   @unique // WhatsApp number
  role      UserRole @default(USER)
  otpSessions OTPSession[]
}
```

### OTPSession Table

```prisma
model OTPSession {
  id          String   @id @default(cuid())
  userId      String
  phone       String
  otpCode     String
  messageId   String?  // WhatsApp message ID
  isVerified  Boolean  @default(false)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## 🔄 Flow Diagram OTP Login

```
1. User memasukkan nomor telepon
   ↓
2. Backend validasi nomor di database
   ↓
3. Generate kode OTP 6 digit
   ↓
4. Kirim OTP via WhatsApp API
   ↓
5. Simpan OTP session di database (expires 5 menit)
   ↓
6. User menerima pesan WhatsApp dengan OTP
   ↓
7. User memasukkan kode OTP
   ↓
8. Backend validasi OTP code
   ↓
9. Generate JWT token
   ↓
10. Return token & user data
```

---

## 🧪 Testing dengan cURL

### 1. Check Device Status

```bash
curl http://localhost:5000/api/auth/otp/status
```

### 2. Request OTP

```bash
curl -X POST http://localhost:5000/api/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"phone":"081234567890"}'
```

### 3. Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"081234567890","otpCode":"123456"}'
```

---

## 🔐 Security Features

1. **OTP Expiration**: Kode OTP kadaluarsa setelah 5 menit
2. **One-time Use**: Kode OTP hanya bisa digunakan sekali
3. **Phone Verification**: Validasi nomor telepon terdaftar
4. **Session Cleanup**: OTP lama otomatis dihapus saat request baru
5. **JWT Token**: Token autentikasi dengan expiry 7 hari
6. **Account Status**: Validasi akun aktif sebelum kirim OTP

---

## 🏗️ Arsitektur Modular

```
src/
├── controllers/
│   ├── otpAuthController.ts      # OTP authentication logic
│   ├── authController.ts         # Traditional auth (backup)
│   └── ...
├── services/
│   └── whatsappService.ts        # WhatsApp API integration
├── routes/
│   ├── otpAuth.ts                # OTP routes
│   ├── authSimple.ts             # Traditional auth routes
│   └── ...
└── config/
    └── index.ts                  # Configuration
```

---

## 🚧 Troubleshooting

### OTP tidak terkirim

```
- Pastikan WHATSAPP_DEVICE_ID sudah benar
- Check device status via /api/auth/otp/status
- Pastikan nomor WhatsApp aktif dan terhubung
- Verify nomor telepon format: 081234567890 (tanpa +62)
```

### Kode OTP expired

```
- OTP berlaku 5 menit
- Gunakan endpoint /api/auth/otp/resend untuk kirim ulang
- Cek waktu server dan timezone
```

### User tidak ditemukan

```
- Pastikan nomor telepon sudah terdaftar di database
- Cek di tabel users kolom phone
- Jalankan seed: npx prisma db seed
```

---

## 📚 Referensi

- **WhatsApp API**: [Whacenter Documentation](https://app.whacenter.com)
- **SiKesKoja**: Sistem Kesehatan Kota Jayapura
- **Tech Stack**: Node.js, Express, TypeScript, Prisma, PostgreSQL

---

## 📝 License

Copyright © 2024 SiKesKoja - Sistem Kesehatan Kota Jayapura

---

## 👨‍💻 Developer Notes

Sistem ini didesain modular sehingga mudah untuk:

- Menambahkan modul kesehatan baru
- Integrasi dengan sistem lain
- Scaling untuk handle lebih banyak user
- Customize flow OTP sesuai kebutuhan

**Modular Approach**: Setiap modul (Questionnaire, Patient Records, Scheduling, etc.) bisa ditambahkan sebagai plugin terpisah.
