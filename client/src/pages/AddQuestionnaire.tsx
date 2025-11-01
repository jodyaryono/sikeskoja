import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, FileText } from "lucide-react";

interface Respondent {
  id: string;
  namaDinasKesehatan: string;
  provinsi: string;
  kabupatenKota: string;
}

const AddQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [currentSection, setCurrentSection] = useState(1);
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

    // Section A: Profil Organisasi
    tahunBerdiri: "",
    jumlahPegawai: "",
    strukturOrganisasi: "ADA",
    visiMisi: "",

    // Section B: Sumber Daya Manusia
    jumlahDokter: "",
    jumlahPerawat: "",
    jumlahBidan: "",
    jumlahTenagaKesLain: "",
    jumlahTenagaNonKes: "",
    pelatihanSDM: "YA",

    // Section C: Sarana dan Prasarana
    jumlahPuskesmas: "",
    jumlahPuskesmasPembantu: "",
    jumlahRumahSakit: "",
    jumlahKlinik: "",
    jumlahPosyandu: "",
    kondisiSarana: "BAIK",

    // Section D: Program Kesehatan
    programImunisasi: "YA",
    programTB: "YA",
    programHIV: "YA",
    programGizi: "YA",
    programKIA: "YA",
    programSanitasi: "YA",
    programP2PTM: "YA",

    // Section E: Anggaran
    anggaranTahunan: "",
    sumberAnggaranAPBN: "YA",
    sumberAnggaranAPBD: "YA",
    sumberAnggaranLainnya: "TIDAK",

    // Section F: Layanan Kesehatan
    jumlahKunjunganRawatJalan: "",
    jumlahKunjunganRawatInap: "",
    jumlahPersalinan: "",
    jumlahImunisasi: "",
    cakupanJKN: "",

    // Section G: Catatan Tambahan
    kendalaUtama: "",
    kebutuhanBantuan: "",
    rencanaKedepan: "",
  });

  useEffect(() => {
    fetchRespondents();
  }, []);

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
        namaDinasKesehatan: "",
        provinsi: "",
        kabupatenKota: "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

      // Prepare questionnaire data JSON
      const questionnaireData = {
        profilOrganisasi: {
          tahunBerdiri: formData.tahunBerdiri,
          jumlahPegawai: formData.jumlahPegawai,
          strukturOrganisasi: formData.strukturOrganisasi,
          visiMisi: formData.visiMisi,
        },
        sumberDayaManusia: {
          jumlahDokter: formData.jumlahDokter,
          jumlahPerawat: formData.jumlahPerawat,
          jumlahBidan: formData.jumlahBidan,
          jumlahTenagaKesLain: formData.jumlahTenagaKesLain,
          jumlahTenagaNonKes: formData.jumlahTenagaNonKes,
          pelatihanSDM: formData.pelatihanSDM,
        },
        saranaPrasarana: {
          jumlahPuskesmas: formData.jumlahPuskesmas,
          jumlahPuskesmasPembantu: formData.jumlahPuskesmasPembantu,
          jumlahRumahSakit: formData.jumlahRumahSakit,
          jumlahKlinik: formData.jumlahKlinik,
          jumlahPosyandu: formData.jumlahPosyandu,
          kondisiSarana: formData.kondisiSarana,
        },
        programKesehatan: {
          programImunisasi: formData.programImunisasi,
          programTB: formData.programTB,
          programHIV: formData.programHIV,
          programGizi: formData.programGizi,
          programKIA: formData.programKIA,
          programSanitasi: formData.programSanitasi,
          programP2PTM: formData.programP2PTM,
        },
        anggaran: {
          anggaranTahunan: formData.anggaranTahunan,
          sumberAnggaranAPBN: formData.sumberAnggaranAPBN,
          sumberAnggaranAPBD: formData.sumberAnggaranAPBD,
          sumberAnggaranLainnya: formData.sumberAnggaranLainnya,
        },
        layananKesehatan: {
          jumlahKunjunganRawatJalan: formData.jumlahKunjunganRawatJalan,
          jumlahKunjunganRawatInap: formData.jumlahKunjunganRawatInap,
          jumlahPersalinan: formData.jumlahPersalinan,
          jumlahImunisasi: formData.jumlahImunisasi,
          cakupanJKN: formData.cakupanJKN,
        },
        catatanTambahan: {
          kendalaUtama: formData.kendalaUtama,
          kebutuhanBantuan: formData.kebutuhanBantuan,
          rencanaKedepan: formData.rencanaKedepan,
        },
      };

      const payload = {
        respondentId: formData.respondentId,
        namaDinasKesehatan: formData.namaDinasKesehatan,
        alamatDinasKesehatan: formData.alamatDinasKesehatan,
        provinsi: formData.provinsi,
        kabupatenKota: formData.kabupatenKota,
        noTelepon: formData.noTelepon,
        email: formData.email,
        namaPengisi: formData.namaPengisi,
        jabatanPengisi: formData.jabatanPengisi,
        status: formData.status,
        questionnaireData: JSON.stringify(questionnaireData),
      };

      const response = await axios.post(
        "http://localhost:5000/api/questionnaires",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Kuesioner berhasil dibuat!");
        navigate("/questionnaires");
      }
    } catch (error: any) {
      console.error("Error creating questionnaire:", error);
      alert(
        error.response?.data?.message ||
          "Gagal membuat kuesioner. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/questionnaires")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" />
              Tambah Kuesioner Baru
            </h1>
            <p className="text-gray-600 mt-1">
              Isi data kuesioner untuk Dinas Kesehatan
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

          {/* Section A: Profil Organisasi */}
          <div className="border-b pb-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold text-blue-900 mb-1">
                BAGIAN A: PROFIL ORGANISASI
              </h2>
              <p className="text-sm text-blue-700">
                Informasi umum tentang Dinas Kesehatan
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Berdiri <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="tahunBerdiri"
                  value={formData.tahunBerdiri}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1980"
                  required
                  min="1900"
                  max="2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Pegawai Total <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="jumlahPegawai"
                  value={formData.jumlahPegawai}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jumlah pegawai"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ketersediaan Struktur Organisasi
                </label>
                <select
                  name="strukturOrganisasi"
                  value={formData.strukturOrganisasi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Struktur organisasi"
                >
                  <option value="ADA">Ada</option>
                  <option value="TIDAK_ADA">Tidak Ada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visi dan Misi <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="visiMisi"
                  value={formData.visiMisi}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tuliskan visi dan misi Dinas Kesehatan..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Section B: Sumber Daya Manusia */}
          <div className="border-b pb-6">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold text-green-900 mb-1">
                BAGIAN B: SUMBER DAYA MANUSIA
              </h2>
              <p className="text-sm text-green-700">
                Data kepegawaian dan tenaga kesehatan
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Dokter <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="jumlahDokter"
                  value={formData.jumlahDokter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Perawat <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="jumlahPerawat"
                  value={formData.jumlahPerawat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Bidan <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="jumlahBidan"
                  value={formData.jumlahBidan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenaga Kesehatan Lainnya
                </label>
                <input
                  type="number"
                  name="jumlahTenagaKesLain"
                  value={formData.jumlahTenagaKesLain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenaga Non Kesehatan
                </label>
                <input
                  type="number"
                  name="jumlahTenagaNonKes"
                  value={formData.jumlahTenagaNonKes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Pelatihan SDM
                </label>
                <select
                  name="pelatihanSDM"
                  value={formData.pelatihanSDM}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Pelatihan SDM"
                >
                  <option value="YA">Ya, Rutin</option>
                  <option value="KADANG">Kadang-kadang</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section C: Sarana dan Prasarana */}
          <div className="border-b pb-6">
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold text-purple-900 mb-1">
                BAGIAN C: SARANA DAN PRASARANA
              </h2>
              <p className="text-sm text-purple-700">
                Fasilitas kesehatan yang tersedia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Puskesmas <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="jumlahPuskesmas"
                  value={formData.jumlahPuskesmas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Pustu
                </label>
                <input
                  type="number"
                  name="jumlahPuskesmasPembantu"
                  value={formData.jumlahPuskesmasPembantu}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Rumah Sakit
                </label>
                <input
                  type="number"
                  name="jumlahRumahSakit"
                  value={formData.jumlahRumahSakit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Klinik
                </label>
                <input
                  type="number"
                  name="jumlahKlinik"
                  value={formData.jumlahKlinik}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Posyandu
                </label>
                <input
                  type="number"
                  name="jumlahPosyandu"
                  value={formData.jumlahPosyandu}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kondisi Sarana Prasarana
                </label>
                <select
                  name="kondisiSarana"
                  value={formData.kondisiSarana}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Kondisi sarana"
                >
                  <option value="BAIK">Baik</option>
                  <option value="CUKUP">Cukup</option>
                  <option value="KURANG">Kurang</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section D: Program Kesehatan */}
          <div className="border-b pb-6">
            <div className="bg-orange-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold text-orange-900 mb-1">
                BAGIAN D: PROGRAM KESEHATAN
              </h2>
              <p className="text-sm text-orange-700">
                Program kesehatan yang sedang berjalan
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Program Imunisasi
                </span>
                <select
                  name="programImunisasi"
                  value={formData.programImunisasi}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Program Imunisasi"
                >
                  <option value="YA">Ada</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Program Tuberkulosis (TB)
                </span>
                <select
                  name="programTB"
                  value={formData.programTB}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Program TB"
                >
                  <option value="YA">Ada</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Program HIV/AIDS
                </span>
                <select
                  name="programHIV"
                  value={formData.programHIV}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Program HIV"
                >
                  <option value="YA">Ada</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Program Gizi
                </span>
                <select
                  name="programGizi"
                  value={formData.programGizi}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Program Gizi"
                >
                  <option value="YA">Ada</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Program KIA (Kesehatan Ibu dan Anak)
                </span>
                <select
                  name="programKIA"
                  value={formData.programKIA}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Program KIA"
                >
                  <option value="YA">Ada</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Program Sanitasi
                </span>
                <select
                  name="programSanitasi"
                  value={formData.programSanitasi}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Program Sanitasi"
                >
                  <option value="YA">Ada</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Program P2PTM (Pencegahan Penyakit Tidak Menular)
                </span>
                <select
                  name="programP2PTM"
                  value={formData.programP2PTM}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Program P2PTM"
                >
                  <option value="YA">Ada</option>
                  <option value="TIDAK">Tidak Ada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section E: Anggaran */}
          <div className="border-b pb-6">
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold text-red-900 mb-1">
                BAGIAN E: ANGGARAN DAN PEMBIAYAAN
              </h2>
              <p className="text-sm text-red-700">
                Informasi anggaran dan sumber pembiayaan
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anggaran Tahunan (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="anggaranTahunan"
                  value={formData.anggaranTahunan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 5000000000"
                  required
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Sumber APBN
                </span>
                <select
                  name="sumberAnggaranAPBN"
                  value={formData.sumberAnggaranAPBN}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="APBN"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Sumber APBD
                </span>
                <select
                  name="sumberAnggaranAPBD"
                  value={formData.sumberAnggaranAPBD}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="APBD"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Sumber Dana Lainnya (CSR, Hibah, dll)
                </span>
                <select
                  name="sumberAnggaranLainnya"
                  value={formData.sumberAnggaranLainnya}
                  onChange={handleChange}
                  className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sumber lainnya"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section F: Layanan Kesehatan */}
          <div className="border-b pb-6">
            <div className="bg-teal-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold text-teal-900 mb-1">
                BAGIAN F: LAYANAN KESEHATAN
              </h2>
              <p className="text-sm text-teal-700">
                Data layanan kesehatan dalam 1 tahun terakhir
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Kunjungan Rawat Jalan (per tahun)
                </label>
                <input
                  type="number"
                  name="jumlahKunjunganRawatJalan"
                  value={formData.jumlahKunjunganRawatJalan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Kunjungan Rawat Inap (per tahun)
                </label>
                <input
                  type="number"
                  name="jumlahKunjunganRawatInap"
                  value={formData.jumlahKunjunganRawatInap}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Persalinan (per tahun)
                </label>
                <input
                  type="number"
                  name="jumlahPersalinan"
                  value={formData.jumlahPersalinan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Imunisasi (per tahun)
                </label>
                <input
                  type="number"
                  name="jumlahImunisasi"
                  value={formData.jumlahImunisasi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cakupan JKN/BPJS Kesehatan (%)
                </label>
                <input
                  type="number"
                  name="cakupanJKN"
                  value={formData.cakupanJKN}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 85"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Section G: Catatan Tambahan */}
          <div className="border-b pb-6">
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold text-indigo-900 mb-1">
                BAGIAN G: CATATAN TAMBAHAN
              </h2>
              <p className="text-sm text-indigo-700">
                Informasi tambahan dan kebutuhan
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kendala Utama dalam Pelayanan Kesehatan
                </label>
                <textarea
                  name="kendalaUtama"
                  value={formData.kendalaUtama}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan kendala yang dihadapi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kebutuhan Bantuan/Dukungan
                </label>
                <textarea
                  name="kebutuhanBantuan"
                  value={formData.kebutuhanBantuan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan bantuan yang dibutuhkan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rencana Pengembangan Kedepan
                </label>
                <textarea
                  name="rencanaKedepan"
                  value={formData.rencanaKedepan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan rencana pengembangan..."
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
              {loading ? "Menyimpan..." : "Simpan Kuesioner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionnaire;
