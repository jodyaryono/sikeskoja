# 🚀 Quick Start Scripts

Scripts untuk memudahkan menjalankan aplikasi SiKesKoja.

## 📁 Available Scripts

### Windows

#### 1. **start.bat** (Command Prompt)

```cmd
start.bat
```

#### 2. **start.ps1** (PowerShell - Recommended)

```powershell
.\start.ps1
```

> **Note**: Jika ada error execution policy, jalankan:
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .\start.ps1
> ```

### Linux/Mac

#### **start.sh** (Bash)

```bash
chmod +x start.sh
./start.sh
```

## 🔧 What These Scripts Do

### 1. **Check Dependencies**

- ✅ Cek apakah `node_modules` terinstall
- ✅ Auto-install jika belum ada
- ✅ Cek client dependencies

### 2. **Environment Setup**

- ✅ Cek file `.env`
- ✅ Copy dari `.env.example` jika belum ada
- ✅ Warning jika perlu update credentials

### 3. **Prisma Setup**

- ✅ Generate Prisma Client
- ✅ Check database connection
- ✅ Push schema ke database

### 4. **Database Seeding** (Optional)

- ✅ Tanya user apakah ingin seed sample data
- ✅ Jalankan seed script jika user pilih Yes

### 5. **Start Servers**

- ✅ Jalankan backend (port 5000)
- ✅ Jalankan frontend (port 3000)
- ✅ Concurrent mode dengan `npm run dev`

## 📋 Prerequisites

Pastikan sudah terinstall:

- ✅ Node.js (v18+)
- ✅ PostgreSQL
- ✅ npm atau yarn

## 🎯 First Time Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd sikeskoja
```

### 2. Configure Database

Edit `.env` file:

```env
DATABASE_URL="postgresql://postgres:423525@localhost:5432/sikeskoja_db"
```

### 3. Run Start Script

**Windows (PowerShell):**

```powershell
.\start.ps1
```

**Windows (CMD):**

```cmd
start.bat
```

**Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

### 4. Choose Seed Option

Ketika ditanya:

```
Do you want to seed the database with sample data? (y/N):
```

- Ketik `y` untuk load sample data (5 keluarga + 4 users)
- Ketik `n` untuk skip (database kosong)

## 🌐 Access Application

Setelah script selesai running:

### Backend

- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api

### Frontend

- **URL**: http://localhost:3000
- Auto-open di browser

## 🔐 Default Credentials (After Seeding)

### Superadmin

```
Phone: 085719195627
Username: jodyaryono
Password: password123
```

### Petugas 1

```
Phone: 081234567801
Username: siti_nurhaliza
Password: petugas123
```

### Petugas 2

```
Phone: 081234567802
Username: rina_marlina
Password: petugas123
```

## 🛠️ Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### Error: "Database connection failed"

Check `.env` file dan pastikan PostgreSQL running:

```bash
# Check PostgreSQL status
# Windows
pg_ctl status

# Linux/Mac
sudo service postgresql status
```

### Error: "Port already in use"

Kill process di port 5000 atau 3000:

**Windows:**

```powershell
# Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Linux/Mac:**

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Error: "Execution Policy" (PowerShell)

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

## 🔄 Manual Steps (Without Scripts)

Jika tidak ingin pakai script:

```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Generate Prisma
npx prisma generate

# 3. Push schema
npx prisma db push

# 4. Seed (optional)
npm run prisma:seed

# 5. Start servers
npm run dev
```

## 📝 Script Features

### ✨ Auto-Detection

- ✅ Deteksi missing dependencies
- ✅ Deteksi missing .env file
- ✅ Deteksi database connection issues

### 🎨 Color Output

- 🟢 Green: Success messages
- 🟡 Yellow: Info/Warning messages
- 🔴 Red: Error messages
- 🔵 Cyan: Section headers

### 🛡️ Error Handling

- ✅ Exit on critical errors
- ✅ Clear error messages
- ✅ Pause before exit (Windows)

## 💡 Tips

1. **Development Mode**: Scripts automatically run in development mode with hot-reload
2. **Production Build**: Use `npm run build` instead
3. **Database Reset**: Run `npx prisma db push --force-reset` before seeding
4. **Prisma Studio**: Open with `npm run prisma:studio` to view database

## 📞 Support

Issues? Contact:

- **Developer**: Jodyaryono
- **Phone**: 085719195627
- **Email**: jodyaryono@sikeskoja.com

---

**© 2025 SiKesKoja. Happy Coding! 🚀**
