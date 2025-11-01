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
import MapSelector from "../components/MapSelector";

interface AnggotaKeluarga {
  id: string;
  nama: string;
  nik?: string; // NIK - Nomor Induk Kependudukan
  hubunganKeluarga: string;
  tanggalLahir: string;
  umur: number;
  jenisKelamin: string;
  statusPerkawinan: string;
  sedangHamil?: string;
  agama: string;
  pendidikan?: string;
  pekerjaan?: string;
  // Upload documents
  ktpFile?: File | null;
  ktpPreview?: string;
  kkFile?: File | null;
  kkPreview?: string;
  // Alamat wilayah
  ikutiKepalaKeluarga?: boolean;
  alamatRumah?: string;
  provinsiKode?: string;
  kabupatenKode?: string;
  kecamatanKode?: string;
  desaKode?: string;
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

// Helper functions untuk mapping kode ke label
const getHubunganKeluargaLabel = (kode: string): string => {
  const mapping: Record<string, string> = {
    "1": "Kepala Keluarga",
    "2": "Istri/Suami",
    "3": "Anak",
    "4": "Orang Tua",
    "5": "Mertua",
    "6": "Menantu",
    "7": "Cucu",
    "8": "Famili Lain",
    "9": "Lainnya",
    KEPALA_KELUARGA: "Kepala Keluarga",
    ISTRI_SUAMI: "Istri/Suami",
    ANAK: "Anak",
    ORANG_TUA: "Orang Tua",
    MERTUA: "Mertua",
    MENANTU: "Menantu",
    CUCU: "Cucu",
    FAMILI_LAIN: "Famili Lain",
    LAINNYA: "Lainnya",
  };
  return mapping[kode] || kode;
};

const getAgamaLabel = (kode: string): string => {
  const mapping: Record<string, string> = {
    "1": "Islam",
    "2": "Kristen",
    "3": "Katolik",
    "4": "Hindu",
    "5": "Buddha",
    "6": "Konghucu",
    "7": "Kepercayaan",
    ISLAM: "Islam",
    KRISTEN: "Kristen",
    KATOLIK: "Katolik",
    HINDU: "Hindu",
    BUDDHA: "Buddha",
    KONGHUCU: "Konghucu",
    KEPERCAYAAN: "Kepercayaan",
  };
  return mapping[kode] || kode;
};

const AddQuestionnaireKS: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Function to show toast
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Main Tab (I, II, III, IV)
  const [mainTab, setMainTab] = useState(1);

  // Sub Tab for Tab IV (A, B)
  const [subTab, setSubTab] = useState("A");

  // I. PENGENALAN TEMPAT
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
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,

    // II. KETERANGAN KELUARGA
    namaKepalaKeluarga: "",
    saranaAirBersih: "YA",
    jenisAirMinum: "PDAM",
    jambanKeluarga: "YA",
    jenisJamban: "KLOSET_LEHER_ANGSA",
    gangguanJiwaBerat: "TIDAK",
    obatGangguanJiwa: "TIDAK",
    anggotaDipasungi: "TIDAK",

    // III. KETERANGAN PENGUMPUL DATA
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
  const [viewingAnggotaIndex, setViewingAnggotaIndex] = useState<number | null>(
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

  // Wilayah cascade state
  const [provinsiList, setProvinsiList] = useState<
    Array<{ kode: string; nama: string }>
  >([]);
  const [kabupatenList, setKabupatenList] = useState<
    Array<{ kode: string; nama: string }>
  >([]);
  const [kecamatanList, setKecamatanList] = useState<
    Array<{ kode: string; nama: string }>
  >([]);
  const [desaList, setDesaList] = useState<
    Array<{ kode: string; nama: string }>
  >([]);

  // Selected wilayah codes
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");

  // Fetch provinsi on mount
  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/wilayah/provinsi"
        );
        setProvinsiList(response.data);
      } catch (error) {
        console.error("Error fetching provinsi:", error);
        showToast("Gagal memuat data provinsi", "error");
      }
    };
    fetchProvinsi();
  }, []);

  // Fetch kabupaten when provinsi changes
  useEffect(() => {
    if (selectedProvinsi) {
      const fetchKabupaten = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/wilayah/kabupaten/${selectedProvinsi}`
          );
          setKabupatenList(response.data);
        } catch (error) {
          console.error("Error fetching kabupaten:", error);
          showToast("Gagal memuat data kabupaten/kota", "error");
        }
      };
      fetchKabupaten();
    } else {
      setKabupatenList([]);
      setSelectedKabupaten("");
    }
  }, [selectedProvinsi]);

  // Fetch kecamatan when kabupaten changes
  useEffect(() => {
    if (selectedKabupaten) {
      const fetchKecamatan = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/wilayah/kecamatan/${selectedKabupaten}`
          );
          setKecamatanList(response.data);
        } catch (error) {
          console.error("Error fetching kecamatan:", error);
          showToast("Gagal memuat data kecamatan", "error");
        }
      };
      fetchKecamatan();
    } else {
      setKecamatanList([]);
      setSelectedKecamatan("");
    }
  }, [selectedKabupaten]);

  // Fetch desa when kecamatan changes
  useEffect(() => {
    if (selectedKecamatan) {
      const fetchDesa = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/wilayah/desa/${selectedKecamatan}`
          );
          setDesaList(response.data);
        } catch (error) {
          console.error("Error fetching desa:", error);
          showToast("Gagal memuat data desa/kelurahan", "error");
        }
      };
      fetchDesa();
    } else {
      setDesaList([]);
      setSelectedDesa("");
    }
  }, [selectedKecamatan]);

  // Fetch data for edit mode
  const fetchQuestionnaireData = useCallback(async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(
        `http://localhost:5000/api/questionnaires-ks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;

        // Set form data
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
          latitude: data.latitude || undefined,
          longitude: data.longitude || undefined,
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

        // Load semua cascade wilayah secara manual untuk edit mode
        console.log("📍 Loading wilayah data for edit:", {
          provinsiKode: data.provinsiKode,
          kabupatenKode: data.kabupatenKode,
          kecamatanKode: data.kecamatanKode,
          desaKode: data.desaKode,
        });

        if (data.provinsiKode) {
          setSelectedProvinsi(data.provinsiKode);
          console.log("✅ Set provinsi:", data.provinsiKode);

          // Fetch dan set kabupaten
          if (data.kabupatenKode) {
            try {
              const kabResponse = await axios.get(
                `http://localhost:5000/api/wilayah/kabupaten/${data.provinsiKode}`
              );
              console.log(
                "✅ Loaded kabupaten:",
                kabResponse.data.length,
                "items"
              );
              setKabupatenList(kabResponse.data);
              setSelectedKabupaten(data.kabupatenKode);
              console.log("✅ Set kabupaten:", data.kabupatenKode);
            } catch (error) {
              console.error("❌ Error loading kabupaten for edit:", error);
            }
          }

          // Fetch dan set kecamatan
          if (data.kecamatanKode) {
            try {
              const kecResponse = await axios.get(
                `http://localhost:5000/api/wilayah/kecamatan/${data.kabupatenKode}`
              );
              console.log(
                "✅ Loaded kecamatan:",
                kecResponse.data.length,
                "items"
              );
              setKecamatanList(kecResponse.data);
              setSelectedKecamatan(data.kecamatanKode);
              console.log("✅ Set kecamatan:", data.kecamatanKode);
            } catch (error) {
              console.error("❌ Error loading kecamatan for edit:", error);
            }
          }

          // Fetch dan set desa
          if (data.desaKode) {
            try {
              const desaResponse = await axios.get(
                `http://localhost:5000/api/wilayah/desa/${data.kecamatanKode}`
              );
              console.log("✅ Loaded desa:", desaResponse.data.length, "items");
              setDesaList(desaResponse.data);
              setSelectedDesa(data.desaKode);
              console.log("✅ Set desa:", data.desaKode);
            } catch (error) {
              console.error("❌ Error loading desa for edit:", error);
            }
          }
        }

        // Set anggota keluarga with health data
        console.log("📋 Data anggota keluarga dari API:", data.anggotaKeluarga);
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
            // Alamat wilayah data
            ikutiKepalaKeluarga: a.ikutiKepalaKeluarga !== false,
            alamatRumah: a.alamatRumah,
            provinsiKode: a.provinsiKode,
            kabupatenKode: a.kabupatenKode,
            kecamatanKode: a.kecamatanKode,
            desaKode: a.desaKode,
            // Health data
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id]);

  // Auto-navigate to Tab II (Anggota Keluarga) when coming from reports page
  useEffect(() => {
    if (isEditMode && !fetchingData && anggotaKeluarga.length > 0) {
      // Navigate to Tab II for easy access to anggota keluarga list
      setMainTab(2);

      // Scroll to anggota keluarga section after a short delay
      setTimeout(() => {
        const anggotaSection = document.getElementById(
          "anggota-keluarga-section"
        );
        if (anggotaSection) {
          anggotaSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [isEditMode, fetchingData, anggotaKeluarga.length]);

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

  const handleNewAnggotaChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "tanggalLahir") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = Math.floor(
        (today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );

      setNewAnggota({
        ...newAnggota,
        [name]: value,
        umur: age,
      });
    } else {
      setNewAnggota({
        ...newAnggota,
        [name]: value,
      });
    }
  };

  const addAnggotaKeluarga = () => {
    // Validasi: Alamat di Tab I (Pengenalan Tempat) harus sudah diisi
    if (
      !formData.alamatRumah ||
      !selectedProvinsi ||
      !selectedKabupaten ||
      !selectedKecamatan ||
      !selectedDesa
    ) {
      showToast(
        "Harap lengkapi Alamat di Tab I (Pengenalan Tempat) terlebih dahulu!",
        "error"
      );
      return;
    }

    if (!newAnggota.nama || !newAnggota.tanggalLahir) {
      showToast("Nama dan tanggal lahir wajib diisi", "error");
      return;
    }

    // Auto-copy alamat dari Tab I (formData) - satu keluarga satu alamat
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
      // Alamat otomatis sama dengan Tab I (Pengenalan Tempat)
      ikutiKepalaKeluarga: true,
      alamatRumah: formData.alamatRumah,
      provinsiKode: selectedProvinsi,
      kabupatenKode: selectedKabupaten,
      kecamatanKode: selectedKecamatan,
      desaKode: selectedDesa,
      // Init gangguan kesehatan dengan default TIDAK
      kartuJKN: "TIDAK",
      merokok: "TIDAK",
    };

    setAnggotaKeluarga([...anggotaKeluarga, anggota]);
    setShowAddAnggota(false);
    showToast(
      `Anggota keluarga "${newAnggota.nama}" berhasil ditambahkan!`,
      "success"
    );

    // Reset form
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

  const removeAnggotaKeluarga = (id: string) => {
    const anggota = anggotaKeluarga.find((a) => a.id === id);
    const namaAnggota = anggota?.nama || "Anggota";

    setAnggotaKeluarga(anggotaKeluarga.filter((a) => a.id !== id));
    setSelectedAnggotaIndex(null);
    showToast(
      `"${namaAnggota}" berhasil dihapus dari daftar anggota keluarga`,
      "success"
    );
  };

  const handleEditAnggota = (index: number) => {
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
      // Load existing file previews if available
      ktpFile: anggota.ktpFile || null,
      ktpPreview: anggota.ktpPreview || undefined,
      kkFile: anggota.kkFile || null,
      kkPreview: anggota.kkPreview || undefined,
    });
    setEditingAnggotaIndex(index);
    setShowEditAnggota(true);
  };

  const handleViewAnggota = (index: number) => {
    setViewingAnggotaIndex(index);
    setShowViewAnggota(true);
  };

  const updateAnggotaKeluarga = () => {
    if (!newAnggota.nama || !newAnggota.tanggalLahir) {
      showToast("Nama dan tanggal lahir wajib diisi", "error");
      return;
    }

    if (editingAnggotaIndex !== null) {
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
      showToast(`Data "${newAnggota.nama}" berhasil diperbarui!`, "success");

      // Reset form
      setNewAnggota({
        nama: "",
        hubunganKeluarga: "ANAK",
        tanggalLahir: "",
        umur: 0,
        jenisKelamin: "PRIA",
        statusPerkawinan: "BELUM_KAWIN",
        agama: "ISLAM",
      });
    }
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

  // Handle file upload with preview
  const handleFileUpload = (
    file: File,
    type: "ktp" | "kk"
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB!");
        reject("File too large");
        return;
      }

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Format file harus JPG, PNG, atau PDF!");
        reject("Invalid file type");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject("Error reading file");
      };
      reader.readAsDataURL(file);
    });
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
        // Filter out file-related fields (ktpFile, kkFile, ktpPreview, kkPreview)
        // These cannot be serialized to JSON and would cause 500 error
        anggotaKeluarga: anggotaKeluarga.map(
          ({ id, ktpFile, kkFile, ktpPreview, kkPreview, ...rest }) => rest
        ),
        status: "DRAFT",
      };

      let response;
      if (isEditMode) {
        // Update existing questionnaire
        response = await axios.put(
          `http://localhost:5000/api/questionnaires-ks/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new questionnaire
        response = await axios.post(
          "http://localhost:5000/api/questionnaires-ks",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        alert(
          isEditMode
            ? "Kuesioner Keluarga Sehat berhasil diupdate!"
            : "Kuesioner Keluarga Sehat berhasil dibuat!"
        );
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

  const renderTabI = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provinsi <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProvinsi}
            onChange={(e) => {
              const kode = e.target.value;
              setSelectedProvinsi(kode);
              const namaProvinsi =
                provinsiList.find((p) => p.kode === kode)?.nama || "";
              setFormData({ ...formData, provinsi: namaProvinsi });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinsiList.map((prov) => (
              <option key={prov.kode} value={prov.kode}>
                {prov.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kabupaten/Kota <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedKabupaten}
            onChange={(e) => {
              const kode = e.target.value;
              setSelectedKabupaten(kode);
              const namaKabupaten =
                kabupatenList.find((k) => k.kode === kode)?.nama || "";
              setFormData({ ...formData, kabupatenKota: namaKabupaten });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            disabled={!selectedProvinsi}
          >
            <option value="">-- Pilih Kabupaten/Kota --</option>
            {kabupatenList.map((kab) => (
              <option key={kab.kode} value={kab.kode}>
                {kab.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kecamatan <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedKecamatan}
            onChange={(e) => {
              const kode = e.target.value;
              setSelectedKecamatan(kode);
              const namaKecamatan =
                kecamatanList.find((k) => k.kode === kode)?.nama || "";
              setFormData({ ...formData, kecamatan: namaKecamatan });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            disabled={!selectedKabupaten}
          >
            <option value="">-- Pilih Kecamatan --</option>
            {kecamatanList.map((kec) => (
              <option key={kec.kode} value={kec.kode}>
                {kec.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Puskesmas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="namaPuskesmas"
            value={formData.namaPuskesmas}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kode Puskesmas
          </label>
          <input
            type="text"
            name="kodePuskesmas"
            value={formData.kodePuskesmas}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desa/Kelurahan <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedDesa}
            onChange={(e) => {
              const kode = e.target.value;
              setSelectedDesa(kode);
              const namaDesa =
                desaList.find((d) => d.kode === kode)?.nama || "";
              setFormData({ ...formData, desaKelurahan: namaDesa });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            disabled={!selectedKecamatan}
          >
            <option value="">-- Pilih Desa/Kelurahan --</option>
            {desaList.map((desa) => (
              <option key={desa.kode} value={desa.kode}>
                {desa.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RW <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="rw"
            value={formData.rw}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RT <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="rt"
            value={formData.rt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. Urut Bangunan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="noUrutBangunan"
            value={formData.noUrutBangunan}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. Urut Keluarga <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="noUrutKeluarga"
            value={formData.noUrutKeluarga}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Rumah <span className="text-red-500">*</span>
          </label>
          <textarea
            name="alamatRumah"
            value={formData.alamatRumah}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* GPS Map Selector */}
        <div className="md:col-span-2">
          <MapSelector
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationSelect={(lat, lng) => {
              setFormData({
                ...formData,
                latitude: lat,
                longitude: lng,
              });
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderTabII = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Kepala Keluarga <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="namaKepalaKeluarga"
            value={formData.namaKepalaKeluarga}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Section Sanitasi & Kesehatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sarana air bersih
          </label>
          <select
            name="saranaAirBersih"
            value={formData.saranaAirBersih}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="YA">Ya</option>
            <option value="TIDAK">Tidak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis air minum
          </label>
          <select
            name="jenisAirMinum"
            value={formData.jenisAirMinum}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="PDAM">PDAM</option>
            <option value="SUMUR_POMPA">Sumur Pompa</option>
            <option value="SUMUR_GALI">Sumur Gali</option>
            <option value="MATA_AIR">Mata Air</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jamban keluarga
          </label>
          <select
            name="jambanKeluarga"
            value={formData.jambanKeluarga}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="YA">Ya</option>
            <option value="TIDAK">Tidak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis jamban
          </label>
          <select
            name="jenisJamban"
            value={formData.jenisJamban}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="KLOSET_LEHER_ANGSA">Kloset/Leher Angsa</option>
            <option value="PLENGSENGAN">Plengsengan</option>
            <option value="CEMPLUNG">Cemplung</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gangguan jiwa berat (Schizophrenia)
          </label>
          <select
            name="gangguanJiwaBerat"
            value={formData.gangguanJiwaBerat}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="YA">Ya</option>
            <option value="TIDAK">Tidak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Obat gangguan jiwa teratur
          </label>
          <select
            name="obatGangguanJiwa"
            value={formData.obatGangguanJiwa}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="YA">Ya</option>
            <option value="TIDAK">Tidak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anggota dipasungi
          </label>
          <select
            name="anggotaDipasungi"
            value={formData.anggotaDipasungi}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="YA">Ya</option>
            <option value="TIDAK">Tidak</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTabIII = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Pengumpul Data <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="namaPengumpulData"
            value={formData.namaPengumpulData}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Supervisor
          </label>
          <input
            type="text"
            name="namaSupervisor"
            value={formData.namaSupervisor}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Pengumpulan <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="tanggalPengumpulan"
            value={formData.tanggalPengumpulan}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderTabIV_SubA = () => (
    <div className="space-y-4" id="anggota-keluarga-section">
      {/* List Anggota */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📋 Daftar Anggota Keluarga ({anggotaKeluarga.length})
        </h3>
        <button
          type="button"
          onClick={() => {
            if (
              !formData.namaKepalaKeluarga ||
              !formData.alamatRumah ||
              !selectedProvinsi ||
              !selectedKabupaten ||
              !selectedKecamatan ||
              !selectedDesa
            ) {
              showToast(
                "Harap lengkapi data Kepala Keluarga dan Alamat di Tab II terlebih dahulu!",
                "error"
              );
              return;
            }
            setShowAddAnggota(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Tambah Anggota
        </button>
      </div>

      {/* Warning jika alamat KK belum lengkap */}
      {(!formData.namaKepalaKeluarga ||
        !formData.alamatRumah ||
        !selectedProvinsi ||
        !selectedKabupaten ||
        !selectedKecamatan ||
        !selectedDesa) && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800">
                Lengkapi Data Kepala Keluarga Terlebih Dahulu
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Harap isi{" "}
                <strong>
                  Nama Kepala Keluarga dan Alamat lengkap (dengan wilayah)
                </strong>{" "}
                di <strong>Tab II. Keterangan Keluarga</strong> sebelum
                menambahkan anggota keluarga.
              </p>
            </div>
          </div>
        </div>
      )}

      {anggotaKeluarga.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-600 mb-4">Belum ada anggota keluarga</p>
          <button
            type="button"
            onClick={() => {
              if (
                !formData.namaKepalaKeluarga ||
                !formData.alamatRumah ||
                !selectedProvinsi ||
                !selectedKabupaten ||
                !selectedKecamatan ||
                !selectedDesa
              ) {
                showToast(
                  "Harap lengkapi data Kepala Keluarga dan Alamat di Tab II terlebih dahulu!",
                  "error"
                );
                return;
              }
              setShowAddAnggota(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tambah Anggota Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {anggotaKeluarga.map((anggota, index) => (
            <div
              key={anggota.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedAnggotaIndex === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedAnggotaIndex(index)}
            >
              <div className="flex items-start gap-3">
                {/* Action buttons - di kiri paling depan */}
                <div className="flex gap-1 flex-shrink-0 items-start">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAnggota(index);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAnggota(index);
                    }}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAnggotaKeluarga(anggota.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Nomor urut dalam bulatan */}
                <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full font-bold flex-shrink-0">
                  {index + 1}
                </span>

                {/* Informasi anggota */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {anggota.nama}
                      </h4>
                      <p className="text-sm font-medium text-blue-600">
                        {getHubunganKeluargaLabel(anggota.hubunganKeluarga)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {anggota.nik && (
                      <div className="col-span-2">
                        <span className="text-gray-500">NIK:</span>{" "}
                        <span className="font-mono font-medium text-gray-900">
                          {anggota.nik}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Tanggal Lahir:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {new Date(anggota.tanggalLahir).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Umur:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {anggota.umur} tahun
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">L/P:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {anggota.jenisKelamin === "PRIA" ? "Pria" : "Wanita"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Agama:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {getAgamaLabel(anggota.agama)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Anggota - Alamat otomatis sama dengan Kepala Keluarga */}
      {showAddAnggota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900">
                Tambah Anggota Keluarga
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                📍 Alamat akan otomatis sama dengan alamat di Tab I (Pengenalan
                Tempat)
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={newAnggota.nama}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Contoh: Markus Wanggai"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    NIK (Nomor Induk Kependudukan){" "}
                    <span className="text-xs text-gray-500 font-normal">
                      - 16 digit
                    </span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={newAnggota.nik || ""}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Contoh: 9171051005850001"
                    maxLength={16}
                    pattern="[0-9]{16}"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 91 (Papua) 71 (Kota Jayapura) 01-05 (Kecamatan)
                    DDMMYY (Tanggal Lahir, +40 untuk perempuan) XXXX (Nomor
                    Urut)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hubungan Keluarga
                  </label>
                  <select
                    name="hubunganKeluarga"
                    value={newAnggota.hubunganKeluarga}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="KEPALA_KELUARGA">Kepala Keluarga</option>
                    <option value="ISTRI_SUAMI">Istri/Suami</option>
                    <option value="ANAK">Anak</option>
                    <option value="ORANG_TUA">Orang Tua</option>
                    <option value="FAMILI_LAIN">Famili Lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={newAnggota.tanggalLahir}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Umur{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      (otomatis dari tanggal lahir)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={newAnggota.umur || 0}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    readOnly
                    disabled
                    title="Umur dihitung otomatis dari tanggal lahir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenisKelamin"
                    value={newAnggota.jenisKelamin}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="PRIA">Pria</option>
                    <option value="WANITA">Wanita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status Perkawinan
                  </label>
                  <select
                    name="statusPerkawinan"
                    value={newAnggota.statusPerkawinan}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="KAWIN">Kawin</option>
                    <option value="BELUM_KAWIN">Belum Kawin</option>
                    <option value="CERAI">Cerai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agama
                  </label>
                  <select
                    name="agama"
                    value={newAnggota.agama}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="ISLAM">Islam</option>
                    <option value="KRISTEN">Kristen</option>
                    <option value="KATOLIK">Katolik</option>
                    <option value="HINDU">Hindu</option>
                    <option value="BUDHA">Budha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pendidikan{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      (untuk usia &gt;5 tahun)
                    </span>
                  </label>
                  <select
                    name="pendidikan"
                    value={newAnggota.pendidikan || ""}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">-- Pilih Pendidikan --</option>
                    <option value="1">Tidak pernah sekolah</option>
                    <option value="2">Tidak tamat SD/MI</option>
                    <option value="3">Tamat SD/MI</option>
                    <option value="4">Tamat SLTP/MTS</option>
                    <option value="5">Tamat SLTA/MA</option>
                    <option value="6">Tamat D1/D2/D3</option>
                    <option value="7">Tamat PT (S1/S2/S3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pekerjaan{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      (untuk usia &gt;10 tahun)
                    </span>
                  </label>
                  <select
                    name="pekerjaan"
                    value={newAnggota.pekerjaan || ""}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">-- Pilih Pekerjaan --</option>
                    <option value="1">Tidak kerja</option>
                    <option value="2">Sekolah</option>
                    <option value="3">PNS/TNI/Polri/BUMN/BUMD</option>
                    <option value="4">Pegawai Swasta</option>
                    <option value="5">Wiraswasta/Pedagang/Jasa</option>
                    <option value="6">Petani</option>
                    <option value="7">Nelayan</option>
                    <option value="8">Buruh</option>
                    <option value="9">Lainnya</option>
                  </select>
                </div>

                {/* Upload KTP - Semua anggota */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Upload KTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full px-4 py-2 border rounded-lg"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const preview = await handleFileUpload(file, "ktp");
                          setNewAnggota({
                            ...newAnggota,
                            ktpFile: file,
                            ktpPreview: preview,
                          });
                        } catch (error) {
                          console.error("Error uploading KTP:", error);
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, atau PDF. Maksimal 2MB
                  </p>

                  {/* Preview KTP */}
                  {newAnggota.ktpPreview && (
                    <div className="mt-3 p-3 border-2 border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          Preview KTP:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewAnggota({
                              ...newAnggota,
                              ktpFile: null,
                              ktpPreview: undefined,
                            });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      {newAnggota.ktpFile?.type === "application/pdf" ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="h-8 w-8 text-red-600" />
                          <span>{newAnggota.ktpFile.name}</span>
                        </div>
                      ) : (
                        <img
                          src={newAnggota.ktpPreview}
                          alt="Preview KTP"
                          className="w-full h-auto rounded-lg max-h-64 object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Upload KK - Hanya untuk Kepala Keluarga */}
                {newAnggota.hubunganKeluarga === "KEPALA_KELUARGA" && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Upload Kartu Keluarga (KK){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="w-full px-4 py-2 border rounded-lg"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const preview = await handleFileUpload(file, "kk");
                            setNewAnggota({
                              ...newAnggota,
                              kkFile: file,
                              kkPreview: preview,
                            });
                          } catch (error) {
                            console.error("Error uploading KK:", error);
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, atau PDF. Maksimal 2MB
                    </p>

                    {/* Preview KK */}
                    {newAnggota.kkPreview && (
                      <div className="mt-3 p-3 border-2 border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-900">
                            Preview Kartu Keluarga:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewAnggota({
                                ...newAnggota,
                                kkFile: null,
                                kkPreview: undefined,
                              });
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                        {newAnggota.kkFile?.type === "application/pdf" ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FileText className="h-8 w-8 text-red-600" />
                            <span>{newAnggota.kkFile.name}</span>
                          </div>
                        ) : (
                          <img
                            src={newAnggota.kkPreview}
                            alt="Preview KK"
                            className="w-full h-auto rounded-lg max-h-64 object-contain"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddAnggota(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={addAnggotaKeluarga}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Anggota */}
      {showEditAnggota && editingAnggotaIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-green-50">
              <h3 className="text-xl font-bold text-green-900">
                Edit Anggota Keluarga
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={newAnggota.nama}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Contoh: Markus Wanggai"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    NIK (Nomor Induk Kependudukan){" "}
                    <span className="text-xs text-gray-500 font-normal">
                      - 16 digit
                    </span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={newAnggota.nik || ""}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Contoh: 9171051005850001"
                    maxLength={16}
                    pattern="[0-9]{16}"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 91 (Papua) 71 (Kota Jayapura) 01-05 (Kecamatan)
                    DDMMYY (Tanggal Lahir, +40 untuk perempuan) XXXX (Nomor
                    Urut)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hubungan Keluarga
                  </label>
                  <select
                    name="hubunganKeluarga"
                    value={newAnggota.hubunganKeluarga}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="KEPALA_KELUARGA">Kepala Keluarga</option>
                    <option value="ISTRI_SUAMI">Istri/Suami</option>
                    <option value="ANAK">Anak</option>
                    <option value="ORANG_TUA">Orang Tua</option>
                    <option value="FAMILI_LAIN">Famili Lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={newAnggota.tanggalLahir}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Umur{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      (otomatis dari tanggal lahir)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={newAnggota.umur || 0}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    readOnly
                    disabled
                    title="Umur dihitung otomatis dari tanggal lahir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenisKelamin"
                    value={newAnggota.jenisKelamin}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="PRIA">Pria</option>
                    <option value="WANITA">Wanita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status Perkawinan
                  </label>
                  <select
                    name="statusPerkawinan"
                    value={newAnggota.statusPerkawinan}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="KAWIN">Kawin</option>
                    <option value="BELUM_KAWIN">Belum Kawin</option>
                    <option value="CERAI">Cerai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agama
                  </label>
                  <select
                    name="agama"
                    value={newAnggota.agama}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="ISLAM">Islam</option>
                    <option value="KRISTEN">Kristen</option>
                    <option value="KATOLIK">Katolik</option>
                    <option value="HINDU">Hindu</option>
                    <option value="BUDHA">Budha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pendidikan{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      (untuk usia &gt;5 tahun)
                    </span>
                  </label>
                  <select
                    name="pendidikan"
                    value={newAnggota.pendidikan || ""}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">-- Pilih Pendidikan --</option>
                    <option value="1">Tidak pernah sekolah</option>
                    <option value="2">Tidak tamat SD/MI</option>
                    <option value="3">Tamat SD/MI</option>
                    <option value="4">Tamat SLTP/MTS</option>
                    <option value="5">Tamat SLTA/MA</option>
                    <option value="6">Tamat D1/D2/D3</option>
                    <option value="7">Tamat PT (S1/S2/S3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pekerjaan{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      (untuk usia &gt;10 tahun)
                    </span>
                  </label>
                  <select
                    name="pekerjaan"
                    value={newAnggota.pekerjaan || ""}
                    onChange={handleNewAnggotaChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">-- Pilih Pekerjaan --</option>
                    <option value="1">Tidak kerja</option>
                    <option value="2">Sekolah</option>
                    <option value="3">PNS/TNI/Polri/BUMN/BUMD</option>
                    <option value="4">Pegawai Swasta</option>
                    <option value="5">Wiraswasta/Pedagang/Jasa</option>
                    <option value="6">Petani</option>
                    <option value="7">Nelayan</option>
                    <option value="8">Buruh</option>
                    <option value="9">Lainnya</option>
                  </select>
                </div>

                {/* Upload KTP - Semua anggota */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Upload KTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full px-4 py-2 border rounded-lg"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const preview = await handleFileUpload(file, "ktp");
                          setNewAnggota({
                            ...newAnggota,
                            ktpFile: file,
                            ktpPreview: preview,
                          });
                        } catch (error) {
                          console.error("Error uploading KTP:", error);
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, atau PDF. Maksimal 2MB
                  </p>

                  {/* Preview KTP */}
                  {newAnggota.ktpPreview && (
                    <div className="mt-3 p-3 border-2 border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          Preview KTP:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewAnggota({
                              ...newAnggota,
                              ktpFile: null,
                              ktpPreview: undefined,
                            });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      {newAnggota.ktpFile?.type === "application/pdf" ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="h-8 w-8 text-red-600" />
                          <span>{newAnggota.ktpFile.name}</span>
                        </div>
                      ) : (
                        <img
                          src={newAnggota.ktpPreview}
                          alt="Preview KTP"
                          className="w-full h-auto rounded-lg max-h-64 object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Upload KK - Hanya untuk Kepala Keluarga */}
                {newAnggota.hubunganKeluarga === "KEPALA_KELUARGA" && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Upload Kartu Keluarga (KK){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="w-full px-4 py-2 border rounded-lg"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const preview = await handleFileUpload(file, "kk");
                            setNewAnggota({
                              ...newAnggota,
                              kkFile: file,
                              kkPreview: preview,
                            });
                          } catch (error) {
                            console.error("Error uploading KK:", error);
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, atau PDF. Maksimal 2MB
                    </p>

                    {/* Preview KK */}
                    {newAnggota.kkPreview && (
                      <div className="mt-3 p-3 border-2 border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-900">
                            Preview Kartu Keluarga:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewAnggota({
                                ...newAnggota,
                                kkFile: null,
                                kkPreview: undefined,
                              });
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                        {newAnggota.kkFile?.type === "application/pdf" ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FileText className="h-8 w-8 text-red-600" />
                            <span>{newAnggota.kkFile.name}</span>
                          </div>
                        ) : (
                          <img
                            src={newAnggota.kkPreview}
                            alt="Preview KK"
                            className="w-full h-auto rounded-lg max-h-64 object-contain"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Checkbox Ikuti Alamat Kepala Keluarga */}
                <div className="col-span-2 mt-4">
                  <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    <input
                      type="checkbox"
                      name="ikutiKepalaKeluarga"
                      checked={newAnggota.ikutiKepalaKeluarga !== false}
                      onChange={(e) => {
                        setNewAnggota({
                          ...newAnggota,
                          ikutiKepalaKeluarga: e.target.checked,
                        });
                      }}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-medium text-blue-900">
                        Ikuti Alamat Kepala Keluarga
                      </span>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Centang jika alamat sama dengan kepala keluarga
                      </p>
                    </div>
                  </label>
                </div>

                {/* Alamat Section - Hanya muncul jika TIDAK ikuti KK */}
                {newAnggota.ikutiKepalaKeluarga === false && (
                  <>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2 text-amber-700">
                        Alamat Rumah (dari KTP){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="alamatRumah"
                        value={newAnggota.alamatRumah || ""}
                        onChange={handleNewAnggotaChange}
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        rows={2}
                        placeholder="Contoh: Jl. Percetakan Negara No. 123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-700">
                        Provinsi <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newAnggota.provinsiKode || ""}
                        onChange={(e) => {
                          const kode = e.target.value;
                          setNewAnggota({
                            ...newAnggota,
                            provinsiKode: kode,
                            kabupatenKode: "",
                            kecamatanKode: "",
                            desaKode: "",
                          });
                        }}
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">-- Pilih Provinsi --</option>
                        {provinsiList.map((prov) => (
                          <option key={prov.kode} value={prov.kode}>
                            {prov.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-700">
                        Kabupaten/Kota <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newAnggota.kabupatenKode || ""}
                        onChange={(e) => {
                          const kode = e.target.value;
                          setNewAnggota({
                            ...newAnggota,
                            kabupatenKode: kode,
                            kecamatanKode: "",
                            desaKode: "",
                          });
                        }}
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        disabled={!newAnggota.provinsiKode}
                      >
                        <option value="">-- Pilih Kabupaten/Kota --</option>
                        {kabupatenList.map((kab) => (
                          <option key={kab.kode} value={kab.kode}>
                            {kab.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-700">
                        Kecamatan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newAnggota.kecamatanKode || ""}
                        onChange={(e) => {
                          const kode = e.target.value;
                          setNewAnggota({
                            ...newAnggota,
                            kecamatanKode: kode,
                            desaKode: "",
                          });
                        }}
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        disabled={!newAnggota.kabupatenKode}
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        {kecamatanList.map((kec) => (
                          <option key={kec.kode} value={kec.kode}>
                            {kec.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-700">
                        Desa/Kelurahan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newAnggota.desaKode || ""}
                        onChange={(e) => {
                          setNewAnggota({
                            ...newAnggota,
                            desaKode: e.target.value,
                          });
                        }}
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        disabled={!newAnggota.kecamatanKode}
                      >
                        <option value="">-- Pilih Desa/Kelurahan --</option>
                        {desaList.map((desa) => (
                          <option key={desa.kode} value={desa.kode}>
                            {desa.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
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
                }}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={updateAnggotaKeluarga}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View Anggota */}
      {showViewAnggota && viewingAnggotaIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900">
                Detail Anggota Keluarga
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {(() => {
                const anggota = anggotaKeluarga[viewingAnggotaIndex];
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Nama
                        </label>
                        <p className="text-lg font-bold text-gray-900">
                          {anggota.nama}
                        </p>
                      </div>

                      {anggota.nik && (
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            NIK
                          </label>
                          <p className="text-base font-mono font-medium text-blue-600">
                            {anggota.nik}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Hubungan Keluarga
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {anggota.hubunganKeluarga.replace(/_/g, " ")}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Tanggal Lahir
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {new Date(anggota.tanggalLahir).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Umur
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {anggota.umur} tahun
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Jenis Kelamin
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {anggota.jenisKelamin}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Status Perkawinan
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {anggota.statusPerkawinan.replace(/_/g, " ")}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Agama
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {anggota.agama}
                        </p>
                      </div>

                      {anggota.pendidikan && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Pendidikan
                          </label>
                          <p className="text-base font-semibold text-gray-900">
                            {anggota.pendidikan}
                          </p>
                        </div>
                      )}

                      {anggota.pekerjaan && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Pekerjaan
                          </label>
                          <p className="text-base font-semibold text-gray-900">
                            {anggota.pekerjaan}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Data Kesehatan */}
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-bold text-lg text-gray-900 mb-4">
                        Data Kesehatan
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Kartu JKN
                          </label>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              anggota.kartuJKN === "YA"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {anggota.kartuJKN || "TIDAK"}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Merokok
                          </label>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              anggota.merokok === "YA"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {anggota.merokok || "TIDAK"}
                          </span>
                        </div>

                        {anggota.diagnosisTB && (
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Diagnosis TB
                            </label>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                anggota.diagnosisTB === "YA"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {anggota.diagnosisTB}
                            </span>
                          </div>
                        )}

                        {anggota.diagnosisHipertensi && (
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Diagnosis Hipertensi
                            </label>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                anggota.diagnosisHipertensi === "YA"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {anggota.diagnosisHipertensi}
                            </span>
                          </div>
                        )}

                        {anggota.sistolik && anggota.diastolik && (
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Tekanan Darah
                            </label>
                            <p className="text-base font-semibold text-gray-900">
                              {anggota.sistolik}/{anggota.diastolik} mmHg
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowViewAnggota(false);
                  setViewingAnggotaIndex(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabIV_SubB = () => {
    if (selectedAnggotaIndex === null) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Pilih anggota keluarga di tab "A. Identitas Keluarga" terlebih
            dahulu
          </p>
        </div>
      );
    }

    const anggota = anggotaKeluarga[selectedAnggotaIndex];

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="font-semibold text-blue-900">
            Data Gangguan Kesehatan untuk:
          </p>
          <p className="text-lg font-bold text-blue-900">
            {anggota.nama} ({anggota.umur} tahun)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kartu JKN?</label>
            <select
              value={anggota.kartuJKN || "TIDAK"}
              onChange={(e) =>
                handleAnggotaGangguanChange("kartuJKN", e.target.value)
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="YA">Ya</option>
              <option value="TIDAK">Tidak</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Merokok?</label>
            <select
              value={anggota.merokok || "TIDAK"}
              onChange={(e) =>
                handleAnggotaGangguanChange("merokok", e.target.value)
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="YA">Ya</option>
              <option value="TIDAK">Tidak</option>
            </select>
          </div>

          {anggota.umur >= 15 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Buang air besar di jamban? (≥15 tahun)
                </label>
                <select
                  value={anggota.buangAirBesarJamban || "YA"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange(
                      "buangAirBesarJamban",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Air bersih?
                </label>
                <select
                  value={anggota.airBersih || "YA"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange("airBersih", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Diagnosis TB?
                </label>
                <select
                  value={anggota.diagnosisTB || "TIDAK"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange("diagnosisTB", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Obat TBC 6 bulan?
                </label>
                <select
                  value={anggota.obatTBC6Bulan || "TIDAK"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange("obatTBC6Bulan", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Diagnosis Hipertensi?
                </label>
                <select
                  value={anggota.diagnosisHipertensi || "TIDAK"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange(
                      "diagnosisHipertensi",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Obat hipertensi teratur?
                </label>
                <select
                  value={anggota.obatHipertensiTeratur || "TIDAK"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange(
                      "obatHipertensiTeratur",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sistolik (mmHg)
                </label>
                <input
                  type="number"
                  value={anggota.sistolik || ""}
                  onChange={(e) =>
                    handleAnggotaGangguanChange(
                      "sistolik",
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Diastolik (mmHg)
                </label>
                <input
                  type="number"
                  value={anggota.diastolik || ""}
                  onChange={(e) =>
                    handleAnggotaGangguanChange(
                      "diastolik",
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="80"
                />
              </div>
            </>
          )}

          {anggota.jenisKelamin === "WANITA" &&
            anggota.umur >= 10 &&
            anggota.umur <= 54 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kontrasepsi/KB? (Wanita 10-54 th)
                </label>
                <select
                  value={anggota.kontrasepsiKB || "TIDAK"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange("kontrasepsiKB", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>
            )}

          {anggota.umur <= 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Melahirkan di faskes? (Ibu &lt;12 bln)
                </label>
                <select
                  value={anggota.melahirkanDiFaskes || "YA"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange(
                      "melahirkanDiFaskes",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  ASI Eksklusif? (0-6 bln)
                </label>
                <select
                  value={anggota.asiEksklusif || "YA"}
                  onChange={(e) =>
                    handleAnggotaGangguanChange("asiEksklusif", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="YA">Ya</option>
                  <option value="TIDAK">Tidak</option>
                </select>
              </div>
            </>
          )}

          {anggota.umur >= 1 && anggota.umur <= 2 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Imunisasi lengkap? (12-23 bln)
              </label>
              <select
                value={anggota.imunisasiLengkap || "YA"}
                onChange={(e) =>
                  handleAnggotaGangguanChange(
                    "imunisasiLengkap",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="YA">Ya</option>
                <option value="TIDAK">Tidak</option>
              </select>
            </div>
          )}

          {anggota.umur >= 2 && anggota.umur <= 5 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Pemantauan balita? (2-59 bln)
              </label>
              <select
                value={anggota.pemantauanPertumbuhanBalita || "YA"}
                onChange={(e) =>
                  handleAnggotaGangguanChange(
                    "pemantauanPertumbuhanBalita",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="YA">Ya</option>
                <option value="TIDAK">Tidak</option>
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabIV = () => (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            type="button"
            onClick={() => setSubTab("A")}
            className={`py-3 px-6 font-medium border-b-2 transition-colors ${
              subTab === "A"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            A. Identitas Keluarga
          </button>
          <button
            type="button"
            onClick={() => setSubTab("B")}
            className={`py-3 px-6 font-medium border-b-2 transition-colors ${
              subTab === "B"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            B. Gangguan Kesehatan
          </button>
        </nav>
      </div>

      {/* Sub Tab Content */}
      <div className="pt-4">
        {subTab === "A" ? renderTabIV_SubA() : renderTabIV_SubB()}
      </div>
    </div>
  );

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/questionnaires")}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" />
              {isEditMode
                ? "Edit Kuesioner Keluarga Sehat (KS)"
                : "Kuesioner Keluarga Sehat (KS)"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? "Ubah Data Kesehatan Keluarga"
                : "Pendataan Kesehatan Keluarga"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { num: 1, label: "I. Pengenalan Tempat", color: "blue" },
              { num: 2, label: "II. Keterangan Keluarga", color: "green" },
              { num: 3, label: "III. Pengumpul Data", color: "purple" },
              { num: 4, label: "IV. Keterangan Individu", color: "orange" },
            ].map((tab) => (
              <button
                key={tab.num}
                type="button"
                onClick={() => setMainTab(tab.num)}
                className={`flex-1 py-4 px-4 font-semibold border-b-4 transition-all ${
                  mainTab === tab.num
                    ? `border-${tab.color}-600 text-${tab.color}-600 bg-${tab.color}-50`
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {mainTab === 1 && renderTabI()}
          {mainTab === 2 && renderTabII()}
          {mainTab === 3 && renderTabIII()}
          {mainTab === 4 && renderTabIV()}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={() => setMainTab(Math.max(1, mainTab - 1))}
              className={`px-6 py-3 border rounded-lg hover:bg-gray-50 ${
                mainTab === 1 ? "invisible" : ""
              }`}
            >
              ← Sebelumnya
            </button>

            {mainTab < 4 ? (
              <button
                type="button"
                onClick={() => setMainTab(mainTab + 1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                disabled={loading || fetchingData}
              >
                <Save className="w-5 h-5" />
                {loading
                  ? isEditMode
                    ? "Mengupdate..."
                    : "Menyimpan..."
                  : isEditMode
                  ? "Update Kuesioner"
                  : "Simpan Kuesioner"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-slide-up">
          <div
            className={`px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            {toast.type === "success" && (
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {toast.type === "error" && (
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {toast.type === "info" && (
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <p className="font-medium flex-1">{toast.message}</p>
            <button
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
              className="ml-2 hover:opacity-80"
              aria-label="Tutup notifikasi"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestionnaireKS;
