# Login OTP - Frontend

## SiKesKoja - Sistem Kesehatan Kota Jayapura

### Login dengan OTP WhatsApp

Sistem login sekarang menggunakan OTP (One-Time Password) yang dikirim via WhatsApp.

---

## 🔐 Cara Login

### Step 1: Masukkan Nomor HP

1. Buka aplikasi SiKesKoja di browser: `http://localhost:3000`
2. Masukkan nomor WhatsApp yang terdaftar (contoh: `081234567890`)
3. Klik **"Kirim Kode OTP"**
4. Sistem akan mengirim kode OTP 6 digit ke WhatsApp Anda

### Step 2: Verifikasi OTP

1. Buka WhatsApp dan salin kode OTP 6 digit
2. Masukkan kode OTP di form verifikasi
3. Klik **"Verifikasi & Masuk"**
4. Anda akan masuk ke dashboard SiKesKoja

---

## 📱 Demo Users

| Role       | Nomor HP     | Email                    |
| ---------- | ------------ | ------------------------ |
| Admin      | 081234567890 | admin@sikeskoja.com      |
| Supervisor | 081234567891 | supervisor@sikeskoja.com |
| Operator   | 081234567892 | operator@sikeskoja.com   |

---

## 🎨 Fitur UI

### Step 1: Input Nomor HP

- Input field dengan icon Phone
- Validasi format nomor telepon
- Placeholder: 081234567890
- Button "Kirim Kode OTP"
- Loading state saat kirim OTP

### Step 2: Verifikasi OTP

- Input field khusus untuk 6 digit OTP
- Format: Large text, monospace, centered
- Timer countdown (5 menit)
- Button "Verifikasi & Masuk"
- Button "Ganti Nomor" - kembali ke step 1
- Button "Kirim Ulang" - request OTP baru (disabled saat timer masih aktif)

### Alert Messages

- **Error Alert** (Red): Menampilkan error saat gagal kirim/verifikasi
- **Success Alert** (Green): Menampilkan pesan sukses saat OTP terkirim

---

## 🔄 Flow Login

```
1. User masukkan nomor HP
   ↓
2. Click "Kirim Kode OTP"
   ↓
3. Frontend call: POST /api/auth/otp/request
   ↓
4. Backend kirim OTP via WhatsApp
   ↓
5. User terima WhatsApp berisi kode OTP
   ↓
6. User masukkan kode OTP (6 digit)
   ↓
7. Click "Verifikasi & Masuk"
   ↓
8. Frontend call: POST /api/auth/otp/verify
   ↓
9. Backend verifikasi OTP & return JWT token
   ↓
10. User login & redirect ke Dashboard
```

---

## 🛠️ Technical Details

### API Endpoints Used

**1. Request OTP**

```typescript
POST http://localhost:5000/api/auth/otp/request
Body: { phone: "081234567890" }
```

**2. Verify OTP**

```typescript
POST http://localhost:5000/api/auth/otp/verify
Body: {
  phone: "081234567890",
  otpCode: "123456"
}
```

**3. Resend OTP**

```typescript
POST http://localhost:5000/api/auth/otp/resend
Body: { phone: "081234567890" }
```

### State Management

```typescript
const [step, setStep] = useState<"phone" | "otp">("phone");
const [phone, setPhone] = useState("");
const [otpCode, setOtpCode] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [expiresAt, setExpiresAt] = useState<Date | null>(null);
const [timeLeft, setTimeLeft] = useState<number>(0);
```

### Timer Countdown

```typescript
React.useEffect(() => {
  if (expiresAt) {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.floor((expiry - now) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }
}, [expiresAt]);
```

---

## 🎯 User Experience

### Loading States

- **Mengirim OTP**: "Mengirim OTP..." dengan spinner
- **Memverifikasi**: "Memverifikasi..." dengan spinner
- Disabled buttons saat loading

### Validations

- Nomor HP wajib diisi
- OTP harus 6 digit angka
- Auto-format: remove non-numeric characters
- Disabled submit jika belum lengkap

### Error Handling

- Nomor tidak terdaftar: "Nomor telepon tidak terdaftar atau akun tidak aktif"
- OTP salah: "Kode OTP tidak valid atau sudah kadaluarsa"
- Device WhatsApp tidak aktif: "Gagal mengirim OTP via WhatsApp..."
- Network error: "Gagal mengirim OTP..."

---

## 🎨 Styling

### Colors

- Primary: Blue 600 (#2563eb)
- Success: Green 600 (#16a34a)
- Error: Red 600 (#dc2626)
- Gray shades untuk text & borders

### Components

- Rounded corners: `rounded-md`
- Shadow: `shadow-xl`
- Gradient background: `bg-gradient-to-br from-primary-50 to-primary-100`
- Icons dari `lucide-react`

---

## 📦 Dependencies

```json
{
  "axios": "^1.13.1",
  "lucide-react": "^0.548.0",
  "react": "^19.2.0",
  "zustand": "^5.0.8"
}
```

---

## 🚀 Run Application

### Backend

```bash
cd sikeskoja
npm run server:dev
# Backend running on http://localhost:5000
```

### Frontend

```bash
cd sikeskoja/client
npm start
# Frontend running on http://localhost:3000
```

---

## ✅ Checklist

- [x] Login page dengan step phone
- [x] Login page dengan step OTP
- [x] Timer countdown 5 menit
- [x] Resend OTP button
- [x] Ganti nomor button
- [x] Error & success alerts
- [x] Loading states
- [x] Input validations
- [x] API integration
- [x] Auto format phone & OTP
- [x] Responsive design

---

**Sistem Modular untuk SiKesKoja - Sistem Kesehatan Kota Jayapura**
