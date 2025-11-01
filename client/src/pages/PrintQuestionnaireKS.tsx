import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const PrintQuestionnaireKS: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
          // Auto trigger print dialog after data loaded
          setTimeout(() => {
            window.print();
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching questionnaire detail:", error);
        alert("Gagal memuat detail kuesioner untuk cetak");
        window.close();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memuat data untuk dicetak...</p>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data tidak ditemukan</p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 20px;
              font-size: 12pt;
            }
            @page {
              size: A4;
              margin: 15mm;
            }
            .no-print {
              display: none !important;
            }
            .page-break {
              page-break-after: always;
            }
            table {
              page-break-inside: avoid;
            }
          }
          
          body {
            font-family: 'Arial', sans-serif;
            color: #000;
            background: white;
          }
          
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          
          .header-section {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
          }
          
          .logo-section img {
            width: 80px;
            height: 80px;
            margin-right: 20px;
          }
          
          .header-text h1 {
            margin: 0;
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .header-text h2 {
            margin: 5px 0 0 0;
            font-size: 14pt;
            font-weight: bold;
          }
          
          .header-text p {
            margin: 5px 0 0 0;
            font-size: 10pt;
          }
          
          .section-title {
            background: #2563EB;
            color: white;
            padding: 8px 12px;
            font-weight: bold;
            font-size: 12pt;
            margin: 20px 0 10px 0;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 8px;
            margin-bottom: 15px;
          }
          
          .info-label {
            font-weight: bold;
          }
          
          .info-value {
            border-bottom: 1px dotted #ccc;
          }
          
          .member-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          
          .member-table th {
            background: #f3f4f6;
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            font-size: 10pt;
          }
          
          .member-table td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 10pt;
          }
          
          .footer-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-box {
            text-align: center;
            min-width: 200px;
          }
          
          .signature-line {
            margin-top: 60px;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
        `}
      </style>

      <div className="print-container">
        {/* Header */}
        <div className="header-section">
          <div className="logo-section">
            <img src="/images/logo-jayapura.png" alt="Logo Jayapura" />
            <div className="header-text">
              <h1>Dinas Kesehatan Kota Jayapura</h1>
              <h2>Kuesioner Keluarga Sehat</h2>
              <p>Provinsi Papua</p>
            </div>
          </div>
        </div>

        {/* Data Keluarga */}
        <div className="section-title">I. DATA KELUARGA</div>
        <div className="info-grid">
          <div className="info-label">Nama Kepala Keluarga</div>
          <div className="info-value">{questionnaire.namaKepalaKeluarga}</div>

          <div className="info-label">Alamat</div>
          <div className="info-value">{questionnaire.alamatRumah}</div>

          <div className="info-label">RT / RW</div>
          <div className="info-value">
            {questionnaire.rt} / {questionnaire.rw}
          </div>

          <div className="info-label">Desa/Kelurahan</div>
          <div className="info-value">{questionnaire.desaKelurahan}</div>

          <div className="info-label">Kecamatan</div>
          <div className="info-value">{questionnaire.kecamatan}</div>

          <div className="info-label">Kabupaten/Kota</div>
          <div className="info-value">{questionnaire.kabupatenKota}</div>

          <div className="info-label">Provinsi</div>
          <div className="info-value">{questionnaire.provinsi}</div>

          <div className="info-label">Status</div>
          <div className="info-value">{questionnaire.status}</div>
        </div>

        {/* Anggota Keluarga */}
        <div className="section-title">II. ANGGOTA KELUARGA</div>
        <table className="member-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>No</th>
              <th>Nama</th>
              <th style={{ width: "130px" }}>NIK</th>
              <th style={{ width: "120px" }}>Hubungan</th>
              <th style={{ width: "100px" }}>Tgl Lahir</th>
              <th style={{ width: "50px" }}>Umur</th>
              <th style={{ width: "40px" }}>JK</th>
              <th style={{ width: "80px" }}>Agama</th>
            </tr>
          </thead>
          <tbody>
            {questionnaire.anggotaKeluarga.map((anggota, index) => (
              <tr key={anggota.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>{anggota.nama}</td>
                <td style={{ fontSize: "8pt", fontFamily: "monospace" }}>
                  {anggota.nik || "-"}
                </td>
                <td style={{ fontSize: "9pt" }}>
                  {anggota.hubunganKeluarga.replace(/_/g, " ")}
                </td>
                <td style={{ fontSize: "9pt" }}>
                  {new Date(anggota.tanggalLahir).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td style={{ textAlign: "center" }}>{anggota.umur}</td>
                <td style={{ textAlign: "center", fontSize: "9pt" }}>
                  {anggota.jenisKelamin === "PRIA" ? "L" : "P"}
                </td>
                <td style={{ fontSize: "9pt" }}>{anggota.agama}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Data Kesehatan Detail Per Anggota */}
        <div className="section-title" style={{ marginTop: "30px" }}>
          III. DATA KESEHATAN ANGGOTA KELUARGA
        </div>
        {questionnaire.anggotaKeluarga.map((anggota, index) => (
          <div
            key={anggota.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "10px",
              pageBreakInside: "avoid",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "11pt" }}>
              {index + 1}. {anggota.nama} ({anggota.umur} tahun)
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                fontSize: "9pt",
              }}
            >
              {anggota.gangguanKesehatan ? (
                <>
                  <div>
                    <strong>Kartu JKN:</strong>{" "}
                    {anggota.gangguanKesehatan.kartuJKN === "YA"
                      ? "Ya ✓"
                      : "Tidak"}
                  </div>
                  <div>
                    <strong>Merokok:</strong>{" "}
                    {anggota.gangguanKesehatan.merokok === "YA"
                      ? "Ya"
                      : "Tidak"}
                  </div>
                  {anggota.umur >= 15 && (
                    <>
                      <div>
                        <strong>BAB di Jamban:</strong>{" "}
                        {anggota.gangguanKesehatan.buangAirBesarJamban === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>Air Bersih:</strong>{" "}
                        {anggota.gangguanKesehatan.airBersih === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>Diagnosis TB:</strong>{" "}
                        {anggota.gangguanKesehatan.diagnosisTB === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>Obat TB 6 Bulan:</strong>{" "}
                        {anggota.gangguanKesehatan.obatTBC6Bulan === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>Batuk Darah 2 Minggu:</strong>{" "}
                        {anggota.gangguanKesehatan.batukDarah2Minggu === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>Diagnosis Hipertensi:</strong>{" "}
                        {anggota.gangguanKesehatan.diagnosisHipertensi === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>Obat Hipertensi Teratur:</strong>{" "}
                        {anggota.gangguanKesehatan.obatHipertensiTeratur ===
                        "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>Pengukuran Tekanan Darah:</strong>{" "}
                        {anggota.gangguanKesehatan.pengukuranTekananDarah ===
                        "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      {(anggota.gangguanKesehatan.sistolik ||
                        anggota.gangguanKesehatan.diastolik) && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <strong>Tekanan Darah:</strong>{" "}
                          {anggota.gangguanKesehatan.sistolik || "-"} /{" "}
                          {anggota.gangguanKesehatan.diastolik || "-"} mmHg
                        </div>
                      )}
                    </>
                  )}
                  {anggota.jenisKelamin === "WANITA" &&
                    anggota.umur >= 10 &&
                    anggota.umur <= 54 && (
                      <div>
                        <strong>Kontrasepsi/KB:</strong>{" "}
                        {anggota.gangguanKesehatan.kontrasepsiKB === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                    )}
                  {anggota.umur <= 1 && (
                    <>
                      <div>
                        <strong>Melahirkan di Faskes:</strong>{" "}
                        {anggota.gangguanKesehatan.melahirkanDiFaskes === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                      <div>
                        <strong>ASI Eksklusif (0-6 bln):</strong>{" "}
                        {anggota.gangguanKesehatan.asiEksklusif === "YA"
                          ? "Ya"
                          : "Tidak"}
                      </div>
                    </>
                  )}
                  {anggota.umur >= 1 && anggota.umur <= 2 && (
                    <div>
                      <strong>Imunisasi Lengkap (12-23 bln):</strong>{" "}
                      {anggota.gangguanKesehatan.imunisasiLengkap === "YA"
                        ? "Ya"
                        : "Tidak"}
                    </div>
                  )}
                  {anggota.umur >= 2 && anggota.umur <= 5 && (
                    <div>
                      <strong>Pemantauan Balita (2-59 bln):</strong>{" "}
                      {anggota.gangguanKesehatan.pemantauanPertumbuhanBalita ===
                      "YA"
                        ? "Ya"
                        : "Tidak"}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ gridColumn: "1 / -1", color: "#666" }}>
                  Data kesehatan belum tersedia
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Data Tambahan Keluarga */}
        <div className="section-title" style={{ marginTop: "30px" }}>
          IV. DATA TAMBAHAN KELUARGA
        </div>
        <div className="info-grid">
          <div className="info-label">Sarana Air Bersih</div>
          <div className="info-value">
            {(questionnaire as any).saranaAirBersih || "-"}
          </div>

          <div className="info-label">Jenis Air Minum</div>
          <div className="info-value">
            {(questionnaire as any).jenisAirMinum || "-"}
          </div>

          <div className="info-label">Jamban Keluarga</div>
          <div className="info-value">
            {(questionnaire as any).jambanKeluarga || "-"}
          </div>

          <div className="info-label">Jenis Jamban</div>
          <div className="info-value">
            {(questionnaire as any).jenisJamban?.replace(/_/g, " ") || "-"}
          </div>

          <div className="info-label">Gangguan Jiwa Berat</div>
          <div className="info-value">
            {(questionnaire as any).gangguanJiwaBerat || "-"}
          </div>

          <div className="info-label">Obat Gangguan Jiwa Teratur</div>
          <div className="info-value">
            {(questionnaire as any).obatGangguanJiwa || "-"}
          </div>

          <div className="info-label">Anggota Dipasungi</div>
          <div className="info-value">
            {(questionnaire as any).anggotaDipasungi || "-"}
          </div>
        </div>

        {/* Data Pengumpul */}
        <div className="section-title" style={{ marginTop: "30px" }}>
          V. DATA PENGUMPUL
        </div>
        <div className="info-grid">
          <div className="info-label">Nama Pengumpul Data</div>
          <div className="info-value">
            {(questionnaire as any).namaPengumpulData || "-"}
          </div>

          <div className="info-label">Nama Supervisor</div>
          <div className="info-value">
            {(questionnaire as any).namaSupervisor || "-"}
          </div>

          <div className="info-label">Tanggal Pengumpulan</div>
          <div className="info-value">
            {(questionnaire as any).tanggalPengumpulan
              ? new Date(
                  (questionnaire as any).tanggalPengumpulan
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </div>
        </div>

        {/* Footer with Signature */}
        <div className="footer-section">
          <div className="signature-box">
            <div>Petugas Pencatat</div>
            <div className="signature-line">
              {(questionnaire as any).namaPengumpulData ||
                questionnaire.creator?.profile?.fullName ||
                questionnaire.creator?.username}
            </div>
          </div>

          <div className="signature-box">
            <div>
              Jayapura,{" "}
              {new Date(questionnaire.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div>Kepala Keluarga</div>
            <div className="signature-line">
              {questionnaire.namaKepalaKeluarga}
            </div>
          </div>
        </div>

        {/* Print Info - Hidden on Print */}
        <div
          className="no-print"
          style={{ marginTop: "40px", textAlign: "center", color: "#666" }}
        >
          <p>
            Jendela cetak akan muncul otomatis. Jika tidak, tekan Ctrl+P untuk
            mencetak.
          </p>
          <button
            onClick={() => window.print()}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cetak Ulang
          </button>
          <button
            onClick={() => window.close()}
            style={{
              marginTop: "10px",
              marginLeft: "10px",
              padding: "10px 20px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
};

export default PrintQuestionnaireKS;
