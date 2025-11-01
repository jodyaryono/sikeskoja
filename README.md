# SiKesKoja - Sistem Pendataan Kesehatan

![SiKesKoja Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=SiKesKoja)

## 📋 Deskripsi

SiKesKoja adalah sistem pendataan kesehatan berbasis web yang dirancang untuk mengelola data kesehatan hingga 500 ribu record dengan performa optimal. Sistem ini dibangun dengan teknologi modern dan responsive design untuk mendukung akses dari berbagai perangkat.

## 🚀 Fitur Utama

### 📊 Dashboard

- **Statistik Real-time**: Monitoring jumlah pasien, rekam medis, dan kunjungan
- **Grafik Interaktif**: Visualisasi data kesehatan dengan chart responsif
- **Quick Actions**: Akses cepat ke fitur utama sistem

### 👥 Manajemen Pasien

- **Data Lengkap**: NIK, biodata, kontak darurat, golongan darah
- **Pencarian Advanced**: Filter berdasarkan berbagai kriteria
- **Riwayat Keluarga**: Tracking hereditas untuk analisis kesehatan
- **Pagination Optimal**: Handling 500k+ data dengan performa tinggi

### 📋 Rekam Medis

- **Multi-type Records**: General checkup, emergency, follow-up, vaksinasi
- **Vital Signs**: Temperature, blood pressure, heart rate, BMI
- **Lab Results**: Integrasi hasil laboratorium dengan reference range
- **Medications**: Tracking pengobatan dan jadwal konsumsi
- **Diagnoses**: Sistem diagnosis dengan ICD-10 codes

### 🔐 Sistem Keamanan

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, Doctor, Nurse, Staff permissions
- **Data Encryption**: Sensitive health data protection
- **Audit Trail**: Logging semua aktivitas sistem

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js dengan TypeScript
- **Database**: PostgreSQL dengan optimized indexing
- **ORM**: Prisma untuk type-safe database queries
- **Authentication**: JWT dengan bcrypt hashing
- **Caching**: Redis untuk performance optimization

### Frontend

- **Framework**: React 18 dengan TypeScript
- **State Management**: Zustand (lightweight & fast)
- **Styling**: Tailwind CSS dengan responsive design
- **Icons**: Lucide React
- **Forms**: React Hook Form dengan Yup validation
- **Routing**: React Router DOM v6

### Database Schema

- **Optimized Indexes**: Untuk query performa tinggi
- **Foreign Key Constraints**: Data integrity
- **Enum Types**: Standardized data values
- **Audit Fields**: createdAt, updatedAt tracking

## 📁 Struktur Project

```
sikeskoja/
├── 📁 src/                    # Backend source code
│   ├── 📁 config/            # Configuration files
│   ├── 📁 controllers/       # Request handlers
│   ├── 📁 middleware/        # Express middleware
│   ├── 📁 routes/            # API routes
│   ├── 📁 services/          # Business logic
│   ├── 📁 types/             # TypeScript definitions
│   └── 📄 server.ts          # Main server file
├── 📁 prisma/                # Database schema & migrations
│   └── 📄 schema.prisma      # Prisma schema definition
├── 📁 client/                # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable UI components
│   │   ├── 📁 pages/         # Page components
│   │   ├── 📁 store/         # Zustand state management
│   │   └── 📁 utils/         # Utility functions
│   └── 📄 package.json       # Frontend dependencies
├── 📄 package.json           # Backend dependencies
├── 📄 .env                   # Environment variables
└── 📄 README.md              # Project documentation
```

## ⚙️ Instalasi dan Setup

### Prerequisites

- Node.js 18 atau lebih tinggi
- PostgreSQL 12+
- npm atau yarn
- Git

### 1. Clone Repository

```bash
git clone [repository-url]
cd sikeskoja
```

### 2. Setup Database

```bash
# Buat database PostgreSQL
createdb sikeskoja_db

# Atau gunakan psql
psql -U postgres
CREATE DATABASE sikeskoja_db;
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env dengan konfigurasi Anda
DB_HOST=localhost
DB_NAME=sikeskoja_db
DB_USER=postgres
DB_PASSWORD=423525
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 5. Database Migration

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### 6. Start Development Server

```bash
# Start both backend and frontend
npm run dev

# Atau jalankan terpisah:
# Backend: npm run server:dev
# Frontend: npm run client:dev
```

### 7. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Prisma Studio**: http://localhost:5555 (npm run prisma:studio)

## 🎯 Demo Credentials

```
Email: admin@sikeskoja.com
Password: password123
Role: Admin

Email: doctor@sikeskoja.com
Password: password123
Role: Doctor
```

## 📱 Responsive Design

### Mobile First Approach

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Collapsible sidebar untuk mobile
- **Tables**: Horizontal scroll dengan touch support
- **Forms**: Optimized input untuk touch devices

### Performance Optimization

- **Lazy Loading**: Components dan routes
- **Virtual Scrolling**: Untuk list data besar
- **Debounced Search**: Mengurangi API calls
- **Cached Queries**: Redis caching untuk data yang sering diakses
- **Optimized Images**: WebP format dengan fallback

## 🚀 Deployment

### Production Build

```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

### Environment Variables (Production)

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-production-secret
REDIS_URL=redis://redis-host:6379
```

### Docker Support

```dockerfile
# Build dan run dengan Docker
docker build -t sikeskoja .
docker run -p 5000:5000 sikeskoja
```

## 📊 Database Performance

### Indexing Strategy

- **Composite Indexes**: Untuk query multi-kolom
- **Partial Indexes**: Untuk filtered queries
- **BTREE Indexes**: Untuk range queries
- **Hash Indexes**: Untuk equality lookups

### Query Optimization

- **Connection Pooling**: Max 20 concurrent connections
- **Prepared Statements**: Mengurangi parsing overhead
- **Batch Operations**: Untuk bulk insert/update
- **Pagination**: Offset/limit dengan optimization

## 🔒 Security Features

### Data Protection

- **Encryption at Rest**: Sensitive fields encrypted
- **HTTPS Only**: SSL/TLS encryption in transit
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Input sanitization
- **CSRF Protection**: Token validation

### Access Control

- **Role-based Permissions**: Granular access control
- **Session Management**: Secure JWT handling
- **Rate Limiting**: API request throttling
- **Audit Logging**: Activity tracking

## 📈 Monitoring & Analytics

### Performance Metrics

- **Response Times**: API endpoint monitoring
- **Database Queries**: Slow query detection
- **Memory Usage**: Application resource monitoring
- **Error Tracking**: Exception logging and alerting

### Health Checks

- **Database Connection**: Connection pool status
- **Redis Cache**: Cache hit/miss ratios
- **API Endpoints**: Uptime monitoring
- **System Resources**: CPU, memory, disk usage

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - User profile

### Patients Endpoints

- `GET /api/patients` - List patients (paginated)
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Health Records Endpoints

- `GET /api/health-records` - List health records
- `POST /api/health-records` - Create health record
- `GET /api/health-records/:id` - Get health record
- `GET /api/health-records/patient/:id` - Get patient records

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint dan Prettier configuration
2. **Git Workflow**: Feature branches dengan pull requests
3. **Testing**: Minimal 80% code coverage
4. **Documentation**: Update docs untuk setiap perubahan

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Commit changes dengan conventional commits
4. Push branch dan create PR
5. Wait for code review

## 📞 Support

### Technical Support

- **Documentation**: [Wiki/Docs URL]
- **Issues**: [GitHub Issues URL]
- **Discussions**: [GitHub Discussions URL]

### Contact Information

- **Email**: support@sikeskoja.com
- **Phone**: +62 21-1234-5678
- **Website**: https://sikeskoja.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Prisma Team** - Amazing ORM and database toolkit
- **React Team** - Excellent frontend library
- **Tailwind CSS** - Utility-first CSS framework
- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Robust relational database

---

**SiKesKoja** - Transforming Healthcare Data Management 🏥✨
