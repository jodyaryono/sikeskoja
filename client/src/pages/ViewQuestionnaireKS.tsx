import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, User, Printer } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

interface QuestionnaireDetail {
  id: string;
  namaKepalaKeluarga: string;
  alamatRumah: string;
  rt: string;
  rw: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  anggotaKeluarga: any[];
  creator: {
    id: string;
    username: string;
    profile?: {
      fullName: string;
    };
  };
}

const ViewQuestionnaireKS: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [questionnaire, setQuestionnaire] =
    useState<QuestionnaireDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/questionnaires-ks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setQuestionnaire(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching questionnaire detail:", error);
        alert("Gagal memuat detail kuesioner");
        navigate("/questionnaires");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, token, navigate]);

  const handlePrint = () => {
    window.open(`/questionnaires/print/${id}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Kuesioner tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/questionnaires")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Kembali ke daftar"
            aria-label="Kembali ke daftar kuesioner"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Kuesioner Keluarga Sehat
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Lihat informasi lengkap kuesioner keluarga
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="btn-primary flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Cetak</span>
        </button>
      </div>

      {/* Info Keluarga */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Informasi Keluarga
            </h2>
            <p className="text-sm text-gray-500">
              Data kepala keluarga dan alamat
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Nama Kepala Keluarga
            </label>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {questionnaire.namaKepalaKeluarga}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Alamat</label>
            <p className="mt-1 text-base text-gray-900">
              {questionnaire.alamatRumah}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">RT / RW</label>
            <p className="mt-1 text-base text-gray-900">
              {questionnaire.rt} / {questionnaire.rw}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Desa/Kelurahan
            </label>
            <p className="mt-1 text-base text-gray-900">
              {questionnaire.desaKelurahan}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Kecamatan
            </label>
            <p className="mt-1 text-base text-gray-900">
              {questionnaire.kecamatan}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Kabupaten/Kota
            </label>
            <p className="mt-1 text-base text-gray-900">
              {questionnaire.kabupatenKota}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Provinsi
            </label>
            <p className="mt-1 text-base text-gray-900">
              {questionnaire.provinsi}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="mt-1">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  questionnaire.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : questionnaire.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {questionnaire.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Anggota Keluarga */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Users className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Anggota Keluarga
            </h2>
            <p className="text-sm text-gray-500">
              Total: {questionnaire.anggotaKeluarga.length} anggota
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {questionnaire.anggotaKeluarga.map((anggota, index) => (
            <div key={anggota.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {anggota.nama}
                    </h3>
                    {anggota.nik && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">NIK: </span>
                        <span className="text-xs font-mono font-medium text-blue-600">
                          {anggota.nik}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Hubungan:</span>
                        <p className="font-medium">
                          {anggota.hubunganKeluarga}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Umur:</span>
                        <p className="font-medium">{anggota.umur} tahun</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Jenis Kelamin:</span>
                        <p className="font-medium">{anggota.jenisKelamin}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Pendidikan:</span>
                        <p className="font-medium">
                          {anggota.pendidikan || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Data Kesehatan Lengkap */}
                    {anggota.gangguanKesehatan && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Informasi Kesehatan Lengkap:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Semua Umur */}
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-600">
                              Semua Umur:
                            </p>
                            {anggota.gangguanKesehatan.kartuJKN && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Memiliki Kartu JKN:
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    anggota.gangguanKesehatan.kartuJKN === "YA"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {anggota.gangguanKesehatan.kartuJKN}
                                </span>
                              </div>
                            )}
                            {anggota.gangguanKesehatan.merokok && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Merokok:</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    anggota.gangguanKesehatan.merokok === "YA"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {anggota.gangguanKesehatan.merokok}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* ≥15 Tahun */}
                          {anggota.umur >= 15 && (
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">
                                Umur ≥15 Tahun:
                              </p>
                              {anggota.gangguanKesehatan
                                .buangAirBesarJamban && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    BAB di Jamban:
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      anggota.gangguanKesehatan
                                        .buangAirBesarJamban === "YA"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {
                                      anggota.gangguanKesehatan
                                        .buangAirBesarJamban
                                    }
                                  </span>
                                </div>
                              )}
                              {anggota.gangguanKesehatan.airBersih && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Akses Air Bersih:
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      anggota.gangguanKesehatan.airBersih ===
                                      "YA"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {anggota.gangguanKesehatan.airBersih}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* TB */}
                          {anggota.umur >= 15 &&
                            anggota.gangguanKesehatan.diagnosisTB && (
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-600">
                                  Tuberkulosis (TB):
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Diagnosis TB:
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      anggota.gangguanKesehatan.diagnosisTB ===
                                      "YA"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {anggota.gangguanKesehatan.diagnosisTB}
                                  </span>
                                </div>
                                {anggota.gangguanKesehatan.diagnosisTB ===
                                  "YA" && (
                                  <>
                                    {anggota.gangguanKesehatan
                                      .obatTBC6Bulan && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">
                                          Obat TBC 6 Bulan:
                                        </span>
                                        <span
                                          className={`px-2 py-0.5 rounded text-xs ${
                                            anggota.gangguanKesehatan
                                              .obatTBC6Bulan === "YA"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {
                                            anggota.gangguanKesehatan
                                              .obatTBC6Bulan
                                          }
                                        </span>
                                      </div>
                                    )}
                                    {anggota.gangguanKesehatan
                                      .batukDarah2Minggu && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">
                                          Batuk Darah ≥2 Minggu:
                                        </span>
                                        <span
                                          className={`px-2 py-0.5 rounded text-xs ${
                                            anggota.gangguanKesehatan
                                              .batukDarah2Minggu === "YA"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-green-100 text-green-800"
                                          }`}
                                        >
                                          {
                                            anggota.gangguanKesehatan
                                              .batukDarah2Minggu
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}

                          {/* Hipertensi */}
                          {anggota.umur >= 15 &&
                            anggota.gangguanKesehatan.diagnosisHipertensi && (
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-600">
                                  Hipertensi:
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Diagnosis Hipertensi:
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      anggota.gangguanKesehatan
                                        .diagnosisHipertensi === "YA"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {
                                      anggota.gangguanKesehatan
                                        .diagnosisHipertensi
                                    }
                                  </span>
                                </div>
                                {anggota.gangguanKesehatan
                                  .diagnosisHipertensi === "YA" &&
                                  anggota.gangguanKesehatan
                                    .obatHipertensiTeratur && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-600">
                                        Obat Teratur:
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs ${
                                          anggota.gangguanKesehatan
                                            .obatHipertensiTeratur === "YA"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {
                                          anggota.gangguanKesehatan
                                            .obatHipertensiTeratur
                                        }
                                      </span>
                                    </div>
                                  )}
                                {anggota.gangguanKesehatan
                                  .pengukuranTekananDarah === "YA" && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                      Tekanan Darah:
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">
                                      {anggota.gangguanKesehatan.sistolik}/
                                      {anggota.gangguanKesehatan.diastolik} mmHg
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Wanita 10-54 Tahun */}
                          {anggota.jenisKelamin === "WANITA" &&
                            anggota.umur >= 10 &&
                            anggota.umur <= 54 &&
                            anggota.gangguanKesehatan.kontrasepsiKB && (
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-600">
                                  Wanita Usia Subur:
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Menggunakan KB:
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      anggota.gangguanKesehatan
                                        .kontrasepsiKB === "YA"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {anggota.gangguanKesehatan.kontrasepsiKB}
                                  </span>
                                </div>
                              </div>
                            )}

                          {/* Ibu dengan Anak <12 Bulan */}
                          {anggota.gangguanKesehatan.melahirkanDiFaskes && (
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">
                                Ibu dengan Anak &lt;12 Bulan:
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Melahirkan di Faskes:
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    anggota.gangguanKesehatan
                                      .melahirkanDiFaskes === "YA"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {anggota.gangguanKesehatan.melahirkanDiFaskes}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Bayi 0-6 Bulan */}
                          {anggota.gangguanKesehatan.asiEksklusif && (
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">
                                Bayi 0-6 Bulan:
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  ASI Eksklusif:
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    anggota.gangguanKesehatan.asiEksklusif ===
                                    "YA"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {anggota.gangguanKesehatan.asiEksklusif}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Bayi 12-23 Bulan */}
                          {anggota.gangguanKesehatan.imunisasiLengkap && (
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">
                                Bayi 12-23 Bulan:
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Imunisasi Lengkap:
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    anggota.gangguanKesehatan
                                      .imunisasiLengkap === "YA"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {anggota.gangguanKesehatan.imunisasiLengkap}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Balita 2-59 Bulan */}
                          {anggota.gangguanKesehatan
                            .pemantauanPertumbuhanBalita && (
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-600">
                                Balita 2-59 Bulan:
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Pemantauan Pertumbuhan:
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    anggota.gangguanKesehatan
                                      .pemantauanPertumbuhanBalita === "YA"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {
                                    anggota.gangguanKesehatan
                                      .pemantauanPertumbuhanBalita
                                  }
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Catatan */}
                          {anggota.gangguanKesehatan.catatan && (
                            <div className="md:col-span-2 space-y-1">
                              <p className="font-semibold text-gray-600">
                                Catatan:
                              </p>
                              <p className="text-gray-700 italic">
                                {anggota.gangguanKesehatan.catatan}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Pencatat */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <User className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Informasi Pencatatan
            </h2>
            <p className="text-sm text-gray-500">
              Data petugas dan waktu pencatatan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Dicatat Oleh
            </label>
            <p className="mt-1 text-base text-gray-900">
              {questionnaire.creator?.profile?.fullName ||
                questionnaire.creator?.username}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Tanggal Dibuat
            </label>
            <p className="mt-1 text-base text-gray-900">
              {new Date(questionnaire.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Terakhir Diupdate
            </label>
            <p className="mt-1 text-base text-gray-900">
              {new Date(questionnaire.updatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuestionnaireKS;
