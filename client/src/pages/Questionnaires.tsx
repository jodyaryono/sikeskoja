import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Printer,
} from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

interface Questionnaire {
  id: string;
  namaPuskesmas: string;
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  desaKelurahan: string;
  namaKepalaKeluarga: string;
  namaPengumpulData: string;
  namaSupervisor?: string;
  status: string;
  tanggalPengumpulan?: string;
  createdAt: string;
  updatedAt: string;
}

const Questionnaires: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const fetchQuestionnaires = async (
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      if (!token) {
        console.warn("No token found, cannot fetch questionnaires");
        setLoading(false);
        return;
      }

      const params: any = {
        page: pageNum,
        limit: ITEMS_PER_PAGE,
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (provinceFilter) params.provinsi = provinceFilter;

      console.log("📡 Fetching questionnaires from: /api/questionnaires-ks");

      const response = await axios.get(
        "http://localhost:5000/api/questionnaires-ks",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      console.log("✅ Questionnaires response:", response.data);

      if (response.data && response.data.data) {
        if (append) {
          // Append untuk load more
          setQuestionnaires((prev) => [...prev, ...response.data.data]);
        } else {
          // Replace untuk initial load atau filter
          setQuestionnaires(response.data.data);
        }

        // Check jika masih ada data lagi
        const totalItems = response.data.pagination?.total || 0;
        const loadedItems = append
          ? questionnaires.length + response.data.data.length
          : response.data.data.length;
        setHasMore(loadedItems < totalItems);
      }
    } catch (error: any) {
      console.error("Error fetching questionnaires:", error);
      if (error.response?.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
      } else {
        alert("Gagal memuat data kuesioner. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    setPage(1);
    fetchQuestionnaires(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, provinceFilter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchQuestionnaires(nextPage, true);
  };

  const handleView = (id: string) => {
    navigate(`/questionnaires/view/${id}`);
  };

  const handlePrint = async (id: string) => {
    try {
      // Open print view in new window
      const printWindow = window.open(
        `/questionnaires/print/${id}`,
        "_blank",
        "width=800,height=600"
      );

      if (!printWindow) {
        alert("Pop-up diblokir! Silakan izinkan pop-up untuk mencetak.");
      }
    } catch (error) {
      console.error("Error opening print window:", error);
      alert("Gagal membuka halaman cetak.");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/questionnaires/edit-ks/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kuesioner ini?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/questionnaires-ks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Kuesioner berhasil dihapus");
      fetchQuestionnaires();
    } catch (error: any) {
      console.error("Error deleting questionnaire:", error);
      alert("Gagal menghapus kuesioner. Silakan coba lagi.");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      DRAFT: { icon: Edit, color: "bg-gray-100 text-gray-800", label: "Draft" },
      IN_PROGRESS: {
        icon: Clock,
        color: "bg-blue-100 text-blue-800",
        label: "Dalam Proses",
      },
      COMPLETED: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800",
        label: "Selesai",
      },
      SUBMITTED: {
        icon: CheckCircle,
        color: "bg-emerald-100 text-emerald-800",
        label: "Terkirim",
      },
      VERIFIED: {
        icon: CheckCircle,
        color: "bg-purple-100 text-purple-800",
        label: "Terverifikasi",
      },
      REJECTED: {
        icon: XCircle,
        color: "bg-red-100 text-red-800",
        label: "Ditolak",
      },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Kuesioner Dinas Kesehatan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola kuesioner dari berbagai Dinas Kesehatan
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => navigate("/questionnaires/add")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kuesioner
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Cari Nama KK atau Kelurahan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter status kuesioner"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">Dalam Proses</option>
              <option value="COMPLETED">Selesai</option>
              <option value="SUBMITTED">Terkirim</option>
              <option value="VERIFIED">Terverifikasi</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </div>

          {/* Province Filter */}
          <div className="relative">
            <input
              type="text"
              className="input"
              placeholder="Filter Provinsi..."
              value={provinceFilter}
              onChange={(e) => {
                setProvinceFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-gray-200"
              style={{ minWidth: "1200px" }}
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10"
                    style={{ width: "180px" }}
                  >
                    Aksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dinas Kesehatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelurahan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama KK
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengumpul Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Proses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questionnaires.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Tidak ada kuesioner ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  questionnaires.map((questionnaire) => (
                    <tr key={questionnaire.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-center sticky left-0 bg-white z-10">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(questionnaire.id)}
                            className="inline-flex items-center justify-center text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrint(questionnaire.id)}
                            className="inline-flex items-center justify-center text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Cetak"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(questionnaire.id)}
                            className="inline-flex items-center justify-center text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(questionnaire.id)}
                            className="inline-flex items-center justify-center text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {questionnaire.namaPuskesmas}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {questionnaire.desaKelurahan}
                        </div>
                        <div className="text-sm text-gray-500">
                          {questionnaire.kecamatan}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {questionnaire.namaKepalaKeluarga}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {questionnaire.namaPengumpulData}
                        </div>
                        {questionnaire.namaSupervisor && (
                          <div className="text-sm text-gray-500">
                            Supervisor: {questionnaire.namaSupervisor}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(questionnaire.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(
                          questionnaire.tanggalPengumpulan ||
                            questionnaire.createdAt
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Memuat...</span>
              </span>
            ) : (
              "Muat Lebih Banyak"
            )}
          </button>
        </div>
      )}

      {!hasMore && questionnaires.length > 0 && (
        <div className="text-center text-gray-500 mt-6">
          Semua data telah ditampilkan ({questionnaires.length} kuesioner)
        </div>
      )}
    </div>
  );
};

export default Questionnaires;
