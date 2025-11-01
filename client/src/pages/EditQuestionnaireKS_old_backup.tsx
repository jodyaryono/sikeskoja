import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

interface QuestionnaireData {
  namaKepalaKeluarga: string;
  alamatRumah: string;
  rt: string;
  rw: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  namaPuskesmas: string;
  status: string;
}

const EditQuestionnaireKS: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<QuestionnaireData>({
    namaKepalaKeluarga: "",
    alamatRumah: "",
    rt: "",
    rw: "",
    desaKelurahan: "",
    kecamatan: "",
    kabupatenKota: "",
    provinsi: "",
    namaPuskesmas: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetchQuestionnaire();
  }, [id]);

  const fetchQuestionnaire = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/questionnaires-ks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setFormData({
          namaKepalaKeluarga: data.namaKepalaKeluarga,
          alamatRumah: data.alamatRumah,
          rt: data.rt,
          rw: data.rw,
          desaKelurahan: data.desaKelurahan,
          kecamatan: data.kecamatan,
          kabupatenKota: data.kabupatenKota,
          provinsi: data.provinsi,
          namaPuskesmas: data.namaPuskesmas,
          status: data.status,
        });
      }
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      alert("Gagal memuat data kuesioner");
      navigate("/questionnaires");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await axios.put(
        `http://localhost:5000/api/questionnaires-ks/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Kuesioner berhasil diupdate!");
        navigate("/questionnaires");
      }
    } catch (error: any) {
      console.error("Error updating questionnaire:", error);
      alert(error.response?.data?.message || "Gagal mengupdate kuesioner");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/questionnaires")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Kembali ke daftar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Kuesioner Keluarga Sehat
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit informasi dasar kuesioner
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Kepala Keluarga */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kepala Keluarga <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="namaKepalaKeluarga"
              value={formData.namaKepalaKeluarga}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Alamat */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Rumah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="alamatRumah"
              value={formData.alamatRumah}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* RT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RT <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rt"
              value={formData.rt}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* RW */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RW <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rw"
              value={formData.rw}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Desa/Kelurahan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desa/Kelurahan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="desaKelurahan"
              value={formData.desaKelurahan}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kecamatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="kecamatan"
              value={formData.kecamatan}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Kabupaten/Kota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kabupaten/Kota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="kabupatenKota"
              value={formData.kabupatenKota}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Provinsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="provinsi"
              value={formData.provinsi}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Puskesmas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Puskesmas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="namaPuskesmas"
              value={formData.namaPuskesmas}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">Dalam Proses</option>
              <option value="COMPLETED">Selesai</option>
              <option value="SUBMITTED">Terkirim</option>
              <option value="VERIFIED">Terverifikasi</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/questionnaires")}
            className="btn-secondary"
            disabled={saving}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Warning */}
      <div className="card bg-amber-50 border-l-4 border-amber-500">
        <p className="text-sm text-amber-800">
          <strong>Catatan:</strong> Edit ini hanya mengubah informasi dasar
          keluarga. Untuk mengubah data anggota keluarga atau kesehatan, silakan
          hubungi administrator.
        </p>
      </div>
    </div>
  );
};

export default EditQuestionnaireKS;
