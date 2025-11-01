import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Eye,
  Trash2,
  FileText,
} from "lucide-react";

interface HealthRecord {
  id: string;
  patientName: string;
  patientId: string;
  recordType: string;
  recordDate: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "DRAFT";
  notes?: string;
  createdBy: string;
}

const HealthRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API calls
  const [records] = useState<HealthRecord[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientId: "1",
      recordType: "GENERAL_CHECKUP",
      recordDate: "2024-01-15",
      status: "COMPLETED",
      notes: "Pemeriksaan rutin, kondisi pasien baik",
      createdBy: "Dr. Jane Smith",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientId: "2",
      recordType: "EMERGENCY",
      recordDate: "2024-01-15",
      status: "ACTIVE",
      notes: "Pasien datang dengan keluhan nyeri dada",
      createdBy: "Dr. Bob Johnson",
    },
    {
      id: "3",
      patientName: "Bob Johnson",
      patientId: "3",
      recordType: "FOLLOW_UP",
      recordDate: "2024-01-14",
      status: "COMPLETED",
      notes: "Kontrol pasca operasi, pemulihan baik",
      createdBy: "Dr. Alice Brown",
    },
    {
      id: "4",
      patientName: "Alice Brown",
      patientId: "4",
      recordType: "VACCINATION",
      recordDate: "2024-01-13",
      status: "COMPLETED",
      notes: "Vaksinasi COVID-19 booster",
      createdBy: "Nurse Mary Wilson",
    },
    {
      id: "5",
      patientName: "Charlie Davis",
      patientId: "5",
      recordType: "LABORATORY",
      recordDate: "2024-01-12",
      status: "DRAFT",
      notes: "Hasil lab belum lengkap",
      createdBy: "Dr. John Doe",
    },
  ]);

  const getRecordTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      GENERAL_CHECKUP: "Pemeriksaan Umum",
      EMERGENCY: "Gawat Darurat",
      FOLLOW_UP: "Kontrol",
      SPECIALIST_CONSULTATION: "Konsultasi Spesialis",
      VACCINATION: "Vaksinasi",
      SURGERY: "Operasi",
      LABORATORY: "Laboratorium",
      IMAGING: "Pencitraan",
      THERAPY: "Terapi",
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      ACTIVE: "Aktif",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
      DRAFT: "Draft",
    };
    return labels[status] || status;
  };

  const filteredRecords = records.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRecordTypeLabel(record.recordType)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Rekam Medis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola rekam medis pasien dalam sistem kesehatan
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Rekam Medis
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Cari berdasarkan nama pasien, jenis rekam, atau dokter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Rekam Medis
                </label>
                <select className="input" aria-label="Filter jenis rekam medis">
                  <option value="">Semua</option>
                  <option value="GENERAL_CHECKUP">Pemeriksaan Umum</option>
                  <option value="EMERGENCY">Gawat Darurat</option>
                  <option value="FOLLOW_UP">Kontrol</option>
                  <option value="VACCINATION">Vaksinasi</option>
                  <option value="LABORATORY">Laboratorium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select className="input" aria-label="Filter status">
                  <option value="">Semua</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="DRAFT">Draft</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Dari
                </label>
                <input type="date" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Sampai
                </label>
                <input type="date" className="input" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {records.length}
              </div>
              <div className="text-sm text-gray-500">Total Rekam Medis</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {records.filter((r) => r.status === "ACTIVE").length}
              </div>
              <div className="text-sm text-gray-500">Aktif</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {records.filter((r) => r.status === "COMPLETED").length}
              </div>
              <div className="text-sm text-gray-500">Selesai</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-yellow-600"></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {records.filter((r) => r.status === "DRAFT").length}
              </div>
              <div className="text-sm text-gray-500">Draft</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Pasien</th>
                <th className="table-header-cell">Jenis Rekam Medis</th>
                <th className="table-header-cell">Tanggal</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Dibuat Oleh</th>
                <th className="table-header-cell">Catatan</th>
                <th className="table-header-cell">Aksi</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">
                      {record.patientName}
                    </div>
                  </td>
                  <td className="table-cell">
                    {getRecordTypeLabel(record.recordType)}
                  </td>
                  <td className="table-cell">
                    {new Date(record.recordDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {record.createdBy}
                  </td>
                  <td className="table-cell">
                    <div
                      className="max-w-xs truncate"
                      title={record.notes || ""}
                    >
                      {record.notes || "-"}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Lihat detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-warning-600 transition-colors"
                        title="Edit rekam medis"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-error-600 transition-colors"
                        title="Hapus rekam medis"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn-secondary">Sebelumnya</button>
            <button className="btn-secondary">Selanjutnya</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">1</span> sampai{" "}
                <span className="font-medium">{filteredRecords.length}</span>{" "}
                dari <span className="font-medium">{records.length}</span> hasil
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Sebelumnya
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary-50 text-sm font-medium text-primary-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Selanjutnya
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
