import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, FileText, Loader2 } from "lucide-react";

interface Respondent {
  id: string;
  namaDinasKesehatan: string;
  provinsi: string;
  kabupatenKota: string;
}

const EditQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [formData, setFormData] = useState({
    respondentId: "",
    namaDinasKesehatan: "",
    alamatDinasKesehatan: "",
    provinsi: "",
    kabupatenKota: "",
    noTelepon: "",
    email: "",
    namaPengisi: "",
    jabatanPengisi: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetchRespondents();
    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  const fetchRespondents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/respondents",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 100 },
        }
      );
      setRespondents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching respondents:", error);
    }
  };

  const fetchQuestionnaire = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/questionnaires/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.data;
      setFormData({
        respondentId: data.respondentId || "",
        namaDinasKesehatan: data.namaDinasKesehatan || "",
        alamatDinasKesehatan: data.alamatDinasKesehatan || "",
        provinsi: data.provinsi || "",
        kabupatenKota: data.kabupatenKota || "",
        noTelepon: data.noTelepon || "",
        email: data.email || "",
        namaPengisi: data.namaPengisi || "",
        jabatanPengisi: data.jabatanPengisi || "",
        status: data.status || "DRAFT",
      });
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      alert("Gagal memuat data kuesioner");
      navigate("/questionnaires");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleRespondentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedRespondent = respondents.find((r) => r.id === selectedId);

    if (selectedRespondent) {
      setFormData({
        ...formData,
        respondentId: selectedId,
        namaDinasKesehatan: selectedRespondent.namaDinasKesehatan,
        provinsi: selectedRespondent.provinsi,
        kabupatenKota: selectedRespondent.kabupatenKota,
      });
    } else {
      setFormData({
        ...formData,
        respondentId: selectedId,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.respondentId) {
      alert("Silakan pilih Dinas Kesehatan");
      return;
    }

    if (
      !formData.alamatDinasKesehatan ||
      !formData.namaPengisi ||
      !formData.jabatanPengisi
    ) {
      alert("Silakan lengkapi data yang wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/questionnaires/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Kuesioner berhasil diupdate!");
        navigate("/questionnaires");
      }
    } catch (error: any) {
      console.error("Error updating questionnaire:", error);
      alert(
        error.response?.data?.message ||
          "Gagal mengupdate kuesioner. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data kuesioner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/questionnaires")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Kembali ke daftar kuesioner"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" />
              Edit Kuesioner
            </h1>
            <p className="text-gray-600 mt-1">
              Ubah data kuesioner untuk Dinas Kesehatan
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dinas Kesehatan Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Dinas Kesehatan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Dinas Kesehatan <span className="text-red-500">*</span>
                </label>
                <select
                  name="respondentId"
                  value={formData.respondentId}
                  onChange={handleRespondentChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Pilih Dinas Kesehatan"
                >
                  <option value="">-- Pilih Dinas Kesehatan --</option>
                  {respondents.map((respondent) => (
                    <option key={respondent.id} value={respondent.id}>
                      {respondent.namaDinasKesehatan} -{" "}
                      {respondent.kabupatenKota}, {respondent.provinsi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Dinas Kesehatan
                </label>
                <input
                  type="text"
                  name="namaDinasKesehatan"
                  value={formData.namaDinasKesehatan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                  aria-label="Nama Dinas Kesehatan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="alamatDinasKesehatan"
                  value={formData.alamatDinasKesehatan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi
                </label>
                <input
                  type="text"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                  aria-label="Provinsi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kabupaten/Kota
                </label>
                <input
                  type="text"
                  name="kabupatenKota"
                  value={formData.kabupatenKota}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                  aria-label="Kabupaten/Kota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 021-12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh@email.com"
                />
              </div>
            </div>
          </div>

          {/* Pengisi Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Pengisi Kuesioner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pengisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaPengisi"
                  value={formData.namaPengisi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan Pengisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jabatanPengisi"
                  value={formData.jabatanPengisi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Kepala Dinas"
                  required
                />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status Kuesioner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Status kuesioner"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="IN_PROGRESS">Dalam Proses</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="SUBMITTED">Terkirim</option>
                  <option value="VERIFIED">Terverifikasi</option>
                  <option value="REJECTED">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/questionnaires")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              {loading ? "Menyimpan..." : "Update Kuesioner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionnaire;
