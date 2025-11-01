# CRUD Questionnaire - SiKesKoja

## Overview

Sistem CRUD (Create, Read, Update, Delete) lengkap untuk manajemen kuesioner Dinas Kesehatan dengan backend API dan frontend React.

## Backend Architecture

### 1. Database Schema (Prisma)

#### Models:

- **Questionnaire**: Data kuesioner utama
- **Respondent**: Data Dinas Kesehatan
- **QuestionnaireAnswer**: Detail jawaban per pertanyaan
- **QuestionTemplate**: Template pertanyaan
- **User**: User management dengan OTP authentication
- **OTPSession**: Session OTP untuk WhatsApp authentication

### 2. Controllers

#### QuestionnaireController (`src/controllers/questionnaireController.ts`)

- `getAllQuestionnaires`: Get all with pagination, search, and filters
- `getQuestionnaireById`: Get single questionnaire with full details
- `createQuestionnaire`: Create new questionnaire
- `updateQuestionnaire`: Update existing questionnaire
- `deleteQuestionnaire`: Delete questionnaire (cascade delete answers)
- `getQuestionnaireStats`: Get statistics by status and province

#### RespondentController (`src/controllers/respondentController.ts`)

- `getAllRespondents`: Get all with pagination and filters
- `getRespondentById`: Get single respondent with questionnaires
- `createRespondent`: Create new respondent (Dinas Kesehatan)
- `updateRespondent`: Update existing respondent
- `deleteRespondent`: Delete respondent (prevents if has questionnaires)
- `getRespondentStats`: Get statistics by province

### 3. Routes

#### `/api/questionnaires`

- `GET /` - Get all questionnaires (with pagination)
- `GET /:id` - Get questionnaire by ID
- `POST /` - Create new questionnaire
- `PUT /:id` - Update questionnaire
- `DELETE /:id` - Delete questionnaire
- `GET /stats` - Get statistics

#### `/api/respondents`

- `GET /` - Get all respondents (with pagination)
- `GET /:id` - Get respondent by ID
- `POST /` - Create new respondent
- `PUT /:id` - Update respondent
- `DELETE /:id` - Delete respondent
- `GET /stats` - Get statistics

All routes require authentication via JWT token.

### 4. Features

#### Pagination

```typescript
{
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10
}
```

#### Filtering

- By status: `DRAFT`, `IN_PROGRESS`, `COMPLETED`, `SUBMITTED`, `VERIFIED`, `REJECTED`
- By province
- By kabupaten/kota
- By respondent ID
- Search by name, location

#### Relations

- Questionnaire includes respondent data
- Questionnaire includes creator (user) data
- Questionnaire includes all answers
- Respondent includes questionnaire count

## Frontend Architecture

### 1. Pages

#### Questionnaires.tsx (`client/src/pages/Questionnaires.tsx`)

Features:

- ✅ List view with table layout
- ✅ Search functionality
- ✅ Status filter dropdown
- ✅ Province filter
- ✅ Pagination
- ✅ Status badges with icons
- ✅ View, Edit, Delete actions
- ✅ Responsive design
- 🚧 Modal for Create/Edit (skeleton ready)

Display columns:

- Dinas Kesehatan (dengan icon)
- Lokasi (Kabupaten/Kota, Provinsi)
- Pengisi (Nama & Jabatan)
- Status (dengan badge berwarna)
- Tanggal
- Aksi (View, Edit, Delete)

#### Respondents.tsx (`client/src/pages/Respondents.tsx`)

Features:

- ✅ Grid card view layout
- ✅ Search functionality
- ✅ Province filter
- ✅ Pagination
- ✅ Active/Inactive badges
- ✅ Questionnaire count per respondent
- ✅ View, Edit, Delete actions
- ✅ Responsive grid (1/2/3 columns)
- 🚧 Modal for Create/Edit (skeleton ready)

Card displays:

- Nama Dinas Kesehatan
- Kode Dinas (if exists)
- Status (Aktif/Nonaktif)
- Lokasi (Kabupaten/Kota, Provinsi)
- Kontak (Telepon, Email)
- Jumlah Kuesioner
- Action buttons

### 2. Routing

Updated routes in `App.tsx`:

- `/dashboard` - Dashboard dengan statistik
- `/respondents` - Halaman Dinas Kesehatan (formerly /patients)
- `/questionnaires` - Halaman Kuesioner (formerly /health-records)

### 3. Navigation

Updated `Layout.tsx`:

- "Dashboard" → Dashboard page
- "Dinas Kesehatan" → /respondents
- "Kuesioner" → /questionnaires
- "Pengaturan" → Settings page

### 4. API Integration

Using axios with:

- Base URL: `http://localhost:5000`
- Authorization: `Bearer ${token}` from localStorage
- Error handling with alerts
- Loading states

## Status Indicators

### Questionnaire Status

- **DRAFT**: Gray badge with Edit icon - "Draft"
- **IN_PROGRESS**: Blue badge with Clock icon - "Dalam Proses"
- **COMPLETED**: Green badge with CheckCircle icon - "Selesai"
- **SUBMITTED**: Emerald badge with CheckCircle icon - "Terkirim"
- **VERIFIED**: Purple badge with CheckCircle icon - "Terverifikasi"
- **REJECTED**: Red badge with XCircle icon - "Ditolak"

### Respondent Status

- **Active**: Green badge - "Aktif"
- **Inactive**: Gray badge - "Nonaktif"

## Next Steps (TODO)

### High Priority

1. ✅ Backend API controllers and routes
2. ✅ Frontend list/grid pages
3. 🚧 Create/Edit forms in modals
4. 🚧 Detail view pages
5. 🚧 Form validation
6. 🚧 Questionnaire form based on PDF structure

### Medium Priority

- Export to Excel/PDF
- Bulk operations
- Advanced filters
- Data visualization charts
- Email notifications
- Print preview

### Low Priority

- Audit logs
- Activity timeline
- Comments/Notes system
- File attachments
- Version history

## Authentication

All API requests require JWT token obtained from OTP login:

1. Request OTP via WhatsApp: `POST /api/auth/otp/request`
2. Verify OTP: `POST /api/auth/otp/verify` → Returns JWT token
3. Use token in Authorization header: `Bearer <token>`

## Testing

Use `test-questionnaire-api.http` for API testing with VS Code REST Client extension.

Sample users from seed:

- Admin: 081234567890
- Supervisor: 081234567891
- Operator: 081234567892

## Error Handling

### Backend

- 400: Bad Request (validation errors)
- 401: Unauthorized (no/invalid token)
- 404: Not Found
- 500: Internal Server Error

### Frontend

- Loading states with spinner
- Error alerts
- Confirmation dialogs for delete
- Empty states with icons

## Performance Considerations

- Pagination (default 10 items per page)
- Indexed database fields (status, provinsi, kabupatenKota, respondentId)
- Cascade deletes for related data
- Count aggregations for statistics
- Selective field inclusion in queries

## Security

- JWT authentication required for all endpoints
- User ID from token used for createdBy field
- Validation of required fields
- Unique constraints (kodeDinasKesehatan)
- Prevent deletion of respondents with questionnaires
