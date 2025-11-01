import React, { useState } from "react";
import { Search, Plus, Filter, Edit, Eye, Trash2 } from "lucide-react";

interface Patient {
  id: string;
  nik: string;
  fullName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  bloodType?: string;
  phone?: string;
  address: string;
  isActive: boolean;
}

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API calls
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      nik: "3201234567890001",
      fullName: "John Doe",
      dateOfBirth: "1990-05-15",
      gender: "MALE",
      bloodType: "O_POSITIVE",
      phone: "+62 812-3456-7890",
      address: "Jl. Merdeka No. 123, Jakarta",
      isActive: true,
    },
    {
      id: "2",
      nik: "3201234567890002",
      fullName: "Jane Smith",
      dateOfBirth: "1985-03-20",
      gender: "FEMALE",
      bloodType: "A_POSITIVE",
      phone: "+62 813-4567-8901",
      address: "Jl. Sudirman No. 456, Jakarta",
      isActive: true,
    },
    {
      id: "3",
      nik: "3201234567890003",
      fullName: "Bob Johnson",
      dateOfBirth: "1992-07-10",
      gender: "MALE",
      phone: "+62 814-5678-9012",
      address: "Jl. Thamrin No. 789, Jakarta",
      isActive: true,
    },
  ]);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatBloodType = (bloodType?: string) => {
    if (!bloodType) return "-";
    return bloodType.replace("_", " ");
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nik.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Data Pasien
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data pasien dalam sistem kesehatan
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
            Tambah Pasien
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
                placeholder="Cari berdasarkan nama atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <select className="input">
                  <option value="">Semua</option>
                  <option value="MALE">Laki-laki</option>
                  <option value="FEMALE">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Golongan Darah
                </label>
                <select className="input">
                  <option value="">Semua</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select className="input">
                  <option value="">Semua</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card p-0">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">NIK</th>
                <th className="table-header-cell">Nama Lengkap</th>
                <th className="table-header-cell">Umur</th>
                <th className="table-header-cell">Jenis Kelamin</th>
                <th className="table-header-cell">Golongan Darah</th>
                <th className="table-header-cell">No. Telepon</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Aksi</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="table-row">
                  <td className="table-cell font-mono text-sm">
                    {patient.nik}
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">
                      {patient.fullName}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {patient.address}
                    </div>
                  </td>
                  <td className="table-cell">
                    {calculateAge(patient.dateOfBirth)} tahun
                  </td>
                  <td className="table-cell">
                    {patient.gender === "MALE" ? "Laki-laki" : "Perempuan"}
                  </td>
                  <td className="table-cell">
                    {formatBloodType(patient.bloodType)}
                  </td>
                  <td className="table-cell">{patient.phone || "-"}</td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {patient.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-warning-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-error-600 transition-colors">
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
                <span className="font-medium">{filteredPatients.length}</span>{" "}
                dari <span className="font-medium">{patients.length}</span>{" "}
                hasil
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

export default Patients;
