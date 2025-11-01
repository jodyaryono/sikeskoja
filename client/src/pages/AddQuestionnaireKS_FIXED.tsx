import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

interface AnggotaKeluarga {
  id: string;
  nama: string;
  nik?: string;
  hubunganKeluarga: string;
  tanggalLahir: string;
  umur: number;
  jenisKelamin: string;
  statusPerkawinan: string;
  sedangHamil?: string;
  agama: string;
  pendidikan?: string;
  pekerjaan?: string;
  // Gangguan Kesehatan
  kartuJKN?: string;
  merokok?: string;
  buangAirBesarJamban?: string;
  airBersih?: string;
  diagnosisTB?: string;
  obatTBC6Bulan?: string;
  batukDarah2Minggu?: string;
  diagnosisHipertensi?: string;
  obatHipertensiTeratur?: string;
  pengukuranTekananDarah?: string;
  sistolik?: number;
  diastolik?: number;
  kontrasepsiKB?: string;
  melahirkanDiFaskes?: string;
  asiEksklusif?: string;
  imunisasiLengkap?: string;
  pemantauanPertumbuhanBalita?: string;
}

const AddQuestionnaireKS: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);

  const [mainTab, setMainTab] = useState(1);
  const [subTab, setSubTab] = useState("A");

  const [formData, setFormData] = useState({
    provinsi: "",
    kabupatenKota: "",
    kecamatan: "",
    namaPuskesmas: "",
    kodePuskesmas: "",
    desaKelurahan: "",
    rw: "",
    rt: "",
    noUrutBangunan: "",
    noUrutKeluarga: "",
    alamatRumah: "",
    namaKepalaKeluarga: "",
    saranaAirBersih: "YA",
    jenisAirMinum: "PDAM",
    jambanKeluarga: "YA",
    jenisJamban: "KLOSET_LEHER_ANGSA",
    gangguanJiwaBerat: "TIDAK",
    obatGangguanJiwa: "TIDAK",
    anggotaDipasungi: "TIDAK",
    namaPengumpulData: "",
    namaSupervisor: "",
    tanggalPengumpulan: new Date().toISOString().split("T")[0],
  });

  const [anggotaKeluarga, setAnggotaKeluarga] = useState<AnggotaKeluarga[]>([]);
  const [selectedAnggotaIndex, setSelectedAnggotaIndex] = useState<
    number | null
  >(null);
  const [showAddAnggota, setShowAddAnggota] = useState(false);
  const [showEditAnggota, setShowEditAnggota] = useState(false);
  const [showViewAnggota, setShowViewAnggota] = useState(false);
  const [editingAnggotaIndex, setEditingAnggotaIndex] = useState<number | null>(
    null
  );
  const [newAnggota, setNewAnggota] = useState<Partial<AnggotaKeluarga>>({
    nama: "",
    hubunganKeluarga: "KEPALA_KELUARGA",
    tanggalLahir: "",
    umur: 0,
    jenisKelamin: "PRIA",
    statusPerkawinan: "KAWIN",
    agama: "ISLAM",
  });

  const fetchQuestionnaireData = useCallback(async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(
        `http://localhost:5000/api/questionnaires-ks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const data = response.data.data;
        setFormData({
          provinsi: data.provinsi || "",
          kabupatenKota: data.kabupatenKota || "",
          kecamatan: data.kecamatan || "",
          namaPuskesmas: data.namaPuskesmas || "",
          kodePuskesmas: data.kodePuskesmas || "",
          desaKelurahan: data.desaKelurahan || "",
          rw: data.rw || "",
          rt: data.rt || "",
          noUrutBangunan: data.noUrutBangunan || "",
          noUrutKeluarga: data.noUrutKeluarga || "",
          alamatRumah: data.alamatRumah || "",
          namaKepalaKeluarga: data.namaKepalaKeluarga || "",
          saranaAirBersih: data.saranaAirBersih || "YA",
          jenisAirMinum: data.jenisAirMinum || "PDAM",
          jambanKeluarga: data.jambanKeluarga || "YA",
          jenisJamban: data.jenisJamban || "KLOSET_LEHER_ANGSA",
          gangguanJiwaBerat: data.gangguanJiwaBerat || "TIDAK",
          obatGangguanJiwa: data.obatGangguanJiwa || "TIDAK",
          anggotaDipasungi: data.anggotaDipasungi || "TIDAK",
          namaPengumpulData: data.namaPengumpulData || "",
          namaSupervisor: data.namaSupervisor || "",
          tanggalPengumpulan: data.tanggalPengumpulan
            ? new Date(data.tanggalPengumpulan).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });

        if (data.anggotaKeluarga && data.anggotaKeluarga.length > 0) {
          const mappedAnggota = data.anggotaKeluarga.map((a: any) => ({
            id: a.id,
            nama: a.nama,
            nik: a.nik || "",
            hubunganKeluarga: a.hubunganKeluarga,
            tanggalLahir: a.tanggalLahir
              ? new Date(a.tanggalLahir).toISOString().split("T")[0]
              : "",
            umur: a.umur,
            jenisKelamin: a.jenisKelamin,
            statusPerkawinan: a.statusPerkawinan,
            sedangHamil: a.sedangHamil,
            agama: a.agama,
            pendidikan: a.pendidikan,
            pekerjaan: a.pekerjaan,
            kartuJKN: a.gangguanKesehatan?.kartuJKN || "TIDAK",
            merokok: a.gangguanKesehatan?.merokok || "TIDAK",
            buangAirBesarJamban:
              a.gangguanKesehatan?.buangAirBesarJamban || "TIDAK",
            airBersih: a.gangguanKesehatan?.airBersih || "TIDAK",
            diagnosisTB: a.gangguanKesehatan?.diagnosisTB || "TIDAK",
            obatTBC6Bulan: a.gangguanKesehatan?.obatTBC6Bulan || "TIDAK",
            batukDarah2Minggu:
              a.gangguanKesehatan?.batukDarah2Minggu || "TIDAK",
            diagnosisHipertensi:
              a.gangguanKesehatan?.diagnosisHipertensi || "TIDAK",
            obatHipertensiTeratur:
              a.gangguanKesehatan?.obatHipertensiTeratur || "TIDAK",
            pengukuranTekananDarah:
              a.gangguanKesehatan?.pengukuranTekananDarah || "TIDAK",
            sistolik: a.gangguanKesehatan?.sistolik || undefined,
            diastolik: a.gangguanKesehatan?.diastolik || undefined,
            kontrasepsiKB: a.gangguanKesehatan?.kontrasepsiKB || "TIDAK",
            melahirkanDiFaskes:
              a.gangguanKesehatan?.melahirkanDiFaskes || "TIDAK",
            asiEksklusif: a.gangguanKesehatan?.asiEksklusif || "TIDAK",
            imunisasiLengkap: a.gangguanKesehatan?.imunisasiLengkap || "TIDAK",
            pemantauanPertumbuhanBalita:
              a.gangguanKesehatan?.pemantauanPertumbuhanBalita || "TIDAK",
          }));
          setAnggotaKeluarga(mappedAnggota);
        }
      }
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      alert("Gagal memuat data kuesioner");
      navigate("/questionnaires");
    } finally {
      setFetchingData(false);
    }
  }, [id, navigate, token]);

  useEffect(() => {
    if (isEditMode && id) {
      fetchQuestionnaireData();
    }
  }, [isEditMode, id, fetchQuestionnaireData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewAnggotaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "tanggalLahir") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = Math.floor(
        (today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      setNewAnggota({ ...newAnggota, [name]: value, umur: age });
    } else {
      setNewAnggota({ ...newAnggota, [name]: value });
    }
  };

  const addAnggotaKeluarga = () => {
    if (!newAnggota.nama || !newAnggota.tanggalLahir) {
      alert("Nama dan tanggal lahir wajib diisi");
      return;
    }
    const anggota: AnggotaKeluarga = {
      id: `temp-${Date.now()}`,
      nama: newAnggota.nama!,
      nik: newAnggota.nik,
      hubunganKeluarga: newAnggota.hubunganKeluarga!,
      tanggalLahir: newAnggota.tanggalLahir!,
      umur: newAnggota.umur!,
      jenisKelamin: newAnggota.jenisKelamin!,
      statusPerkawinan: newAnggota.statusPerkawinan!,
      sedangHamil: newAnggota.sedangHamil,
      agama: newAnggota.agama!,
      pendidikan: newAnggota.pendidikan,
      pekerjaan: newAnggota.pekerjaan,
      kartuJKN: "TIDAK",
      merokok: "TIDAK",
    };
    setAnggotaKeluarga([...anggotaKeluarga, anggota]);
    setShowAddAnggota(false);
    setNewAnggota({
      nama: "",
      hubunganKeluarga: "ANAK",
      tanggalLahir: "",
      umur: 0,
      jenisKelamin: "PRIA",
      statusPerkawinan: "BELUM_KAWIN",
      agama: "ISLAM",
    });
  };

  const openEditAnggota = (index: number) => {
    setEditingAnggotaIndex(index);
    const anggota = anggotaKeluarga[index];
    setNewAnggota({
      nama: anggota.nama,
      nik: anggota.nik,
      hubunganKeluarga: anggota.hubunganKeluarga,
      tanggalLahir: anggota.tanggalLahir,
      umur: anggota.umur,
      jenisKelamin: anggota.jenisKelamin,
      statusPerkawinan: anggota.statusPerkawinan,
      sedangHamil: anggota.sedangHamil,
      agama: anggota.agama,
      pendidikan: anggota.pendidikan,
      pekerjaan: anggota.pekerjaan,
    });
    setShowEditAnggota(true);
  };

  const updateAnggotaKeluarga = () => {
    if (
      !newAnggota.nama ||
      !newAnggota.tanggalLahir ||
      editingAnggotaIndex === null
    ) {
      alert("Nama dan tanggal lahir wajib diisi");
      return;
    }
    const updated = [...anggotaKeluarga];
    updated[editingAnggotaIndex] = {
      ...updated[editingAnggotaIndex],
      nama: newAnggota.nama!,
      nik: newAnggota.nik,
      hubunganKeluarga: newAnggota.hubunganKeluarga!,
      tanggalLahir: newAnggota.tanggalLahir!,
      umur: newAnggota.umur!,
      jenisKelamin: newAnggota.jenisKelamin!,
      statusPerkawinan: newAnggota.statusPerkawinan!,
      sedangHamil: newAnggota.sedangHamil,
      agama: newAnggota.agama!,
      pendidikan: newAnggota.pendidikan,
      pekerjaan: newAnggota.pekerjaan,
    };
    setAnggotaKeluarga(updated);
    setShowEditAnggota(false);
    setEditingAnggotaIndex(null);
    setNewAnggota({
      nama: "",
      hubunganKeluarga: "ANAK",
      tanggalLahir: "",
      umur: 0,
      jenisKelamin: "PRIA",
      statusPerkawinan: "BELUM_KAWIN",
      agama: "ISLAM",
    });
  };

  const openViewAnggota = (index: number) => {
    setSelectedAnggotaIndex(index);
    setShowViewAnggota(true);
  };

  const removeAnggotaKeluarga = (id: string) => {
    setAnggotaKeluarga(anggotaKeluarga.filter((a) => a.id !== id));
    setSelectedAnggotaIndex(null);
  };

  const handleAnggotaGangguanChange = (field: string, value: any) => {
    if (selectedAnggotaIndex === null) return;
    const updated = [...anggotaKeluarga];
    updated[selectedAnggotaIndex] = {
      ...updated[selectedAnggotaIndex],
      [field]: value,
    };
    setAnggotaKeluarga(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (anggotaKeluarga.length === 0) {
      alert("Minimal harus ada 1 anggota keluarga!");
      return;
    }

    try {
      setLoading(true);
      const jumlahAnggotaDewasa = anggotaKeluarga.filter(
        (a) => a.umur >= 15
      ).length;
      const jumlahAnggotaUsia0_15 = anggotaKeluarga.filter(
        (a) => a.umur <= 15
      ).length;
      const jumlahAnggotaUsia12_59 = anggotaKeluarga.filter(
        (a) => a.umur >= 12 && a.umur <= 59
      ).length;
      const jumlahAnggotaUsia10_54 = anggotaKeluarga.filter(
        (a) => a.umur >= 10 && a.umur <= 54
      ).length;
      const jumlahAnggotaUsia0_11 = anggotaKeluarga.filter(
        (a) => a.umur <= 11
      ).length;

      const payload = {
        ...formData,
        jumlahAnggotaKeluarga: anggotaKeluarga.length,
        jumlahAnggotaDewasa,
        jumlahAnggotaUsia0_15,
        jumlahAnggotaUsia12_59,
        jumlahAnggotaUsia10_54,
        jumlahAnggotaUsia0_11,
        anggotaKeluarga: anggotaKeluarga.map(({ id, ...rest }) => rest),
        status: "DRAFT",
      };

      const response = isEditMode
        ? await axios.put(
            `http://localhost:5000/api/questionnaires-ks/${id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        : await axios.post(
            "http://localhost:5000/api/questionnaires-ks",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

      if (response.data.success) {
        alert(
          isEditMode
            ? "Kuesioner berhasil diupdate!"
            : "Kuesioner berhasil dibuat!"
        );
        navigate("/questionnaires");
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Gagal menyimpan kuesioner");
    } finally {
      setLoading(false);
    }
  };

  // Render functions would be here - I'll add them in next part due to length
  // renderTabI, renderTabII, renderTabIII, renderTabIV_SubA, renderTabIV_SubB, renderTabIV

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data kuesioner...</p>
        </div>
      </div>
    );
  }

  return <div>Placeholder - Full component rendered here</div>;
};

export default AddQuestionnaireKS;
