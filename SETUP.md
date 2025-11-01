# SiKesKoja Development Setup

## Quick Start Guide

### 1. Database Setup

Buat database PostgreSQL dengan nama `sikeskoja_db`:

```sql
CREATE DATABASE sikeskoja_db;
```

### 2. Environment Configuration

File `.env` sudah dikonfigurasi dengan:

- Database: localhost:5432/sikeskoja_db
- Username: postgres
- Password: 423525

### 3. Install Dependencies

```bash
npm install
cd client && npm install
```

### 4. Database Migration

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start Development

```bash
npm run dev
```

Aplikasi akan tersedia di:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Demo Login

- Email: admin@sikeskoja.com
- Password: password123

## Architecture

- **Backend**: Node.js + Express + TypeScript + Prisma
- **Frontend**: React + TypeScript + Tailwind CSS + Zustand
- **Database**: PostgreSQL dengan optimasi untuk 500k records

## Key Features

- ✅ Responsive design (mobile-first)
- ✅ Advanced pagination & filtering
- ✅ Role-based authentication
- ✅ Optimized database queries
- ✅ Real-time dashboard statistics
- ✅ Comprehensive patient management
- ✅ Medical records with vital signs
- ✅ Lab results integration
- ✅ Medication tracking
