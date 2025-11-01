import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import Select from "react-select";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import html2canvas from "html2canvas";

// Custom colorful marker icons - lebih menarik dari default!
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 18px;
          display: block;
        ">${emoji}</span>
      </div>
    `,
    className: "custom-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Array warna untuk variasi marker
const markerColors = [
  { color: "#FF6B6B", emoji: "🏠" }, // Merah
  { color: "#4ECDC4", emoji: "🏡" }, // Cyan
  { color: "#45B7D1", emoji: "🏘️" }, // Biru
  { color: "#FFA07A", emoji: "🏚️" }, // Orange
  { color: "#98D8C8", emoji: "🏠" }, // Hijau muda
  { color: "#F7DC6F", emoji: "🏡" }, // Kuning
  { color: "#BB8FCE", emoji: "🏘️" }, // Ungu
  { color: "#F8B500", emoji: "🏚️" }, // Emas
];

interface StatisticsData {
  totalKeluarga: number;
  totalWarga: number;
  lakiLaki: number;
  perempuan: number;
  distribusiKelamin: Array<{ name: string; value: number }>;
  distribusiUmur: Array<{ name: string; count: number }>;
  statistikKesehatan: Array<{ name: string; count: number }>;
}

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"statistics" | "map" | "data">(
    "statistics"
  );

  const { token } = useAuthStore();

  // Global filters yang berlaku untuk semua tab (sesuai schema Prisma)
  const [globalFilters, setGlobalFilters] = useState({
    nik: "",
    nama: "",
    jenisKelamin: "",
    umurMin: "",
    umurMax: "",
    provinsiKode: "",
    kabupatenKode: "",
    kecamatanKode: "",
    desaKode: "",
  });

  // State untuk CASCADE wilayah dropdown
  const [provinsiList, setProvinsiList] = useState<any[]>([]);
  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);

  // Load Provinsi on mount
  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reports/wilayah/provinsi",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProvinsiList(response.data.data);
      } catch (error) {
        console.error("Error loading provinsi:", error);
      }
    };
    fetchProvinsi();
  }, [token]);

  // Load Kabupaten when Provinsi selected
  useEffect(() => {
    if (globalFilters.provinsiKode) {
      const fetchKabupaten = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/reports/wilayah/kabupaten/${globalFilters.provinsiKode}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setKabupatenList(response.data.data);
        } catch (error) {
          console.error("Error loading kabupaten:", error);
        }
      };
      fetchKabupaten();
    } else {
      setKabupatenList([]);
      setKecamatanList([]);
      setDesaList([]);
    }
  }, [globalFilters.provinsiKode, token]);

  // Load Kecamatan when Kabupaten selected
  useEffect(() => {
    if (globalFilters.kabupatenKode) {
      const fetchKecamatan = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/reports/wilayah/kecamatan/${globalFilters.kabupatenKode}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setKecamatanList(response.data.data);
        } catch (error) {
          console.error("Error loading kecamatan:", error);
        }
      };
      fetchKecamatan();
    } else {
      setKecamatanList([]);
      setDesaList([]);
    }
  }, [globalFilters.kabupatenKode, token]);

  // Load Desa when Kecamatan selected
  useEffect(() => {
    if (globalFilters.kecamatanKode) {
      const fetchDesa = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/reports/wilayah/desa/${globalFilters.kecamatanKode}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDesaList(response.data.data);
        } catch (error) {
          console.error("Error loading desa:", error);
        }
      };
      fetchDesa();
    } else {
      setDesaList([]);
    }
  }, [globalFilters.kecamatanKode, token]);

  const handleFilterChange = (key: string, value: string) => {
    setGlobalFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // Reset child dropdowns when parent changes
      if (key === "provinsiKode") {
        newFilters.kabupatenKode = "";
        newFilters.kecamatanKode = "";
        newFilters.desaKode = "";
      } else if (key === "kabupatenKode") {
        newFilters.kecamatanKode = "";
        newFilters.desaKode = "";
      } else if (key === "kecamatanKode") {
        newFilters.desaKode = "";
      }

      return newFilters;
    });
  };

  const handleSearch = () => {
    // Trigger refresh untuk semua tab dengan filter baru
    setGlobalFilters({ ...globalFilters });
  };

  const handleReset = () => {
    setGlobalFilters({
      nik: "",
      nama: "",
      jenisKelamin: "",
      umurMin: "",
      umurMax: "",
      provinsiKode: "",
      kabupatenKode: "",
      kecamatanKode: "",
      desaKode: "",
    });
    setKabupatenList([]);
    setKecamatanList([]);
    setDesaList([]);
  };

  const exportToCSV = () => {
    // Export akan dipanggil dari DataTab component
    const event = new CustomEvent("exportCSV");
    window.dispatchEvent(event);
  };

  const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Laporan & Analisis
          </h1>
          <p className="text-gray-600 mt-2">
            Analisis data kesehatan keluarga dan peta sebaran
          </p>
        </div>

        {/* Global Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🔍 Filter Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* NIK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                value={globalFilters.nik}
                onChange={(e) => handleFilterChange("nik", e.target.value)}
                placeholder="Cari NIK..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kepala Keluarga
              </label>
              <input
                type="text"
                value={globalFilters.nama}
                onChange={(e) => handleFilterChange("nama", e.target.value)}
                placeholder="Cari nama..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={globalFilters.jenisKelamin}
                onChange={(e) =>
                  handleFilterChange("jenisKelamin", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Umur Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umur Minimal
              </label>
              <input
                type="number"
                value={globalFilters.umurMin}
                onChange={(e) => handleFilterChange("umurMin", e.target.value)}
                placeholder="Umur min..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Umur Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umur Maksimal
              </label>
              <input
                type="number"
                value={globalFilters.umurMax}
                onChange={(e) => handleFilterChange("umurMax", e.target.value)}
                placeholder="Umur max..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CASCADE WILAYAH - Provinsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provinsi
              </label>
              <select
                value={globalFilters.provinsiKode}
                onChange={(e) =>
                  handleFilterChange("provinsiKode", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Provinsi</option>
                {provinsiList.map((prov) => (
                  <option key={prov.kode} value={prov.kode}>
                    {prov.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* CASCADE WILAYAH - Kabupaten */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kabupaten/Kota
              </label>
              <Select
                value={
                  globalFilters.kabupatenKode
                    ? kabupatenList.find(
                        (k) => k.kode === globalFilters.kabupatenKode
                      )
                      ? {
                          value: globalFilters.kabupatenKode,
                          label:
                            kabupatenList.find(
                              (k) => k.kode === globalFilters.kabupatenKode
                            )?.nama || "",
                        }
                      : null
                    : null
                }
                onChange={(option) =>
                  handleFilterChange("kabupatenKode", option?.value || "")
                }
                options={kabupatenList.map((kab) => ({
                  value: kab.kode,
                  label: kab.nama,
                }))}
                isDisabled={!globalFilters.provinsiKode}
                isClearable
                placeholder="Pilih Kabupaten/Kota..."
                noOptionsMessage={() => "Tidak ada data"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused
                      ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                      : "none",
                    "&:hover": {
                      borderColor: "#3b82f6",
                    },
                  }),
                }}
              />
            </div>

            {/* CASCADE WILAYAH - Kecamatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kecamatan/Distrik
              </label>
              <Select
                value={
                  globalFilters.kecamatanKode
                    ? kecamatanList.find(
                        (k) => k.kode === globalFilters.kecamatanKode
                      )
                      ? {
                          value: globalFilters.kecamatanKode,
                          label:
                            kecamatanList.find(
                              (k) => k.kode === globalFilters.kecamatanKode
                            )?.nama || "",
                        }
                      : null
                    : null
                }
                onChange={(option) =>
                  handleFilterChange("kecamatanKode", option?.value || "")
                }
                options={kecamatanList.map((kec) => ({
                  value: kec.kode,
                  label: kec.nama,
                }))}
                isDisabled={!globalFilters.kabupatenKode}
                isClearable
                placeholder="Pilih Kecamatan..."
                noOptionsMessage={() => "Tidak ada data"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused
                      ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                      : "none",
                    "&:hover": {
                      borderColor: "#3b82f6",
                    },
                  }),
                }}
              />
            </div>

            {/* CASCADE WILAYAH - Desa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desa/Kelurahan
              </label>
              <Select
                value={
                  globalFilters.desaKode
                    ? desaList.find((d) => d.kode === globalFilters.desaKode)
                      ? {
                          value: globalFilters.desaKode,
                          label:
                            desaList.find(
                              (d) => d.kode === globalFilters.desaKode
                            )?.nama || "",
                        }
                      : null
                    : null
                }
                onChange={(option) =>
                  handleFilterChange("desaKode", option?.value || "")
                }
                options={desaList.map((desa) => ({
                  value: desa.kode,
                  label: desa.nama,
                }))}
                isDisabled={!globalFilters.kecamatanKode}
                isClearable
                placeholder="Pilih Desa/Kelurahan..."
                noOptionsMessage={() => "Tidak ada data"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused
                      ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                      : "none",
                    "&:hover": {
                      borderColor: "#3b82f6",
                    },
                  }),
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              🔍 Cari
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              🔄 Reset
            </button>
            <button
              onClick={exportToCSV}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto flex items-center gap-2"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("statistics")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "statistics"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📊 Grafik & Statistik
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "map"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🗺️ Peta Sebaran
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "data"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📋 Data Induk
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "statistics" && (
          <StatisticsTab filters={globalFilters} colors={COLORS} />
        )}
        {activeTab === "map" && <MapTab filters={globalFilters} />}
        {activeTab === "data" && <DataTab filters={globalFilters} />}
      </div>
    </div>
  );
};

// Statistics Tab Component
const StatisticsTab: React.FC<{
  filters: any;
  colors: string[];
}> = ({ filters, colors }) => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [filters]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ) as Record<string, string>
      );

      const response = await axios.get(
        `http://localhost:5000/api/reports/statistics?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        Data statistik tidak tersedia
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-5xl font-bold mb-2">
            {stats.totalKeluarga.toLocaleString()}
          </div>
          <div className="text-blue-100 text-lg">Total Keluarga</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-5xl font-bold mb-2">
            {stats.totalWarga.toLocaleString()}
          </div>
          <div className="text-purple-100 text-lg">Total Warga</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-5xl font-bold mb-2">
            {stats.lakiLaki.toLocaleString()}
          </div>
          <div className="text-pink-100 text-lg">Laki-laki</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-5xl font-bold mb-2">
            {stats.perempuan.toLocaleString()}
          </div>
          <div className="text-cyan-100 text-lg">Perempuan</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            👥 Distribusi Jenis Kelamin
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.distribusiKelamin}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.distribusiKelamin.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Distribusi Umur
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.distribusiUmur}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Health Statistics Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🏥 Statistik Kesehatan
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.statistikKesehatan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Map Tab Component
const MapTab: React.FC<{ filters: any }> = ({ filters }) => {
  const { token } = useAuthStore();
  const [mapData, setMapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<
    "osm" | "satellite" | "terrain" | "hybrid"
  >("osm");

  useEffect(() => {
    fetchMapData();
  }, [filters]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ) as Record<string, string>
      );

      const response = await axios.get(
        `http://localhost:5000/api/reports/map-data?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMapData(response.data.data);
    } catch (error) {
      console.error("Error fetching map data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportMapAsPNG = () => {
    const mapElement = document.getElementById("map-container");
    if (mapElement) {
      html2canvas(mapElement).then((canvas) => {
        const link = document.createElement("a");
        link.download = `peta-sebaran-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Center map on Kota Jayapura - koordinat tengah kota
  const center: [number, number] = [-2.565, 140.715]; // Pusat Kota Jayapura

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            🗺️ Peta Sebaran Wilayah Kota Jayapura
          </h3>
          <p className="text-sm text-gray-600">
            Total {mapData.length} lokasi dengan koordinat GPS 📍
          </p>
        </div>
        <button
          onClick={exportMapAsPNG}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          📥 Export PNG
        </button>
      </div>

      {/* Map Layer Control */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMapLayer("osm")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mapLayer === "osm"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🗺️ Peta Vector (OpenStreetMap)
        </button>
        <button
          onClick={() => setMapLayer("satellite")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mapLayer === "satellite"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🛰️ Peta Satelit (Esri)
        </button>
        <button
          onClick={() => setMapLayer("terrain")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mapLayer === "terrain"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🏔️ Peta Topografi
        </button>
        <button
          onClick={() => setMapLayer("hybrid")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mapLayer === "hybrid"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🗺️ Peta Hybrid (Satelit + Label)
        </button>
      </div>

      <div
        id="map-container"
        className="h-[600px] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200"
      >
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Dynamic Tile Layers based on selection */}
          {mapLayer === "osm" && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {mapLayer === "satellite" && (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {mapLayer === "terrain" && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          )}

          {mapLayer === "hybrid" && (
            <>
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                opacity={0.3}
              />
            </>
          )}

          {/* Marker Clustering - group nearby markers */}
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            iconCreateFunction={(cluster: any) => {
              const count = cluster.getChildCount();
              let size = "small";

              if (count >= 50) {
                size = "large";
              } else if (count >= 20) {
                size = "medium";
              }

              return L.divIcon({
                html: `
                  <div style="
                    background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
                    width: ${
                      size === "large"
                        ? "50px"
                        : size === "medium"
                        ? "42px"
                        : "36px"
                    };
                    height: ${
                      size === "large"
                        ? "50px"
                        : size === "medium"
                        ? "42px"
                        : "36px"
                    };
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${
                      size === "large"
                        ? "18px"
                        : size === "medium"
                        ? "16px"
                        : "14px"
                    };
                    color: #DC2626;
                  ">
                    ${count}
                  </div>
                `,
                className: "custom-cluster-icon",
                iconSize: L.point(
                  size === "large" ? 50 : size === "medium" ? 42 : 36,
                  size === "large" ? 50 : size === "medium" ? 42 : 36,
                  true
                ),
              });
            }}
          >
            {mapData.map((item, index) => {
              if (!item.latitude || !item.longitude) return null;

              // Pilih icon berdasarkan index untuk variasi warna
              const iconStyle = markerColors[index % markerColors.length];
              const customIcon = createCustomIcon(
                iconStyle.color,
                iconStyle.emoji
              );

              return (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-sm mb-2">
                        {item.namaKepalaKeluarga}
                      </h4>
                      <div className="text-xs space-y-1">
                        <p>
                          <strong>Alamat:</strong> {item.alamatRumah}
                        </p>
                        <p>
                          <strong>Kelurahan:</strong> {item.desaKelurahan}
                        </p>
                        <p>
                          <strong>Kecamatan:</strong> {item.kecamatan}
                        </p>
                        <p className="text-gray-500">
                          📍 {item.latitude.toFixed(4)},{" "}
                          {item.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

// Data Tab Component
const DataTab: React.FC<{ filters: any }> = ({ filters }) => {
  const { token } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<any>(null);
  const [editingQuestionnaireId, setEditingQuestionnaireId] =
    useState<string>("");

  // Fetch data from backend
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      });

      const response = await axios.get(
        `http://localhost:5000/api/reports/data-induk?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit anggota keluarga - open modal with full data
  const handleEditAnggota = (
    questionnaireId: string,
    anggota: any,
    questionnaire: any
  ) => {
    setEditingQuestionnaireId(questionnaireId);

    // Format tanggalLahir to YYYY-MM-DD for date input
    let formattedTanggalLahir = "";
    if (anggota.tanggalLahir) {
      const date = new Date(anggota.tanggalLahir);
      formattedTanggalLahir = date.toISOString().split("T")[0];
    }

    // Auto-populate GPS dari questionnaire jika anggota belum punya
    const populatedAnggota = {
      ...anggota,
      tanggalLahir: formattedTanggalLahir,
      latitude: anggota.latitude || questionnaire.latitude || undefined,
      longitude: anggota.longitude || questionnaire.longitude || undefined,
      // Auto-populate alamat dari questionnaire jika belum ada
      alamatRumah: anggota.alamatRumah || questionnaire.alamatRumah || "",
      provinsiKode: anggota.provinsiKode || questionnaire.provinsiKode || "",
      kabupatenKode: anggota.kabupatenKode || questionnaire.kabupatenKode || "",
      kecamatanKode: anggota.kecamatanKode || questionnaire.kecamatanKode || "",
      desaKode: anggota.desaKode || questionnaire.desaKode || "",
    };

    setEditingAnggota(populatedAnggota);
    setShowEditModal(true);
  };

  // Handle save edited anggota
  const handleSaveEditAnggota = async () => {
    if (!editingAnggota || !editingQuestionnaireId) return;

    try {
      // Validate required fields
      if (!editingAnggota.nama || !editingAnggota.nik) {
        alert("Nama dan NIK harus diisi!");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/questionnaires-ks/${editingQuestionnaireId}/anggota/${editingAnggota.id}`,
        editingAnggota,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh data and close modal
      fetchData(pagination.page);
      setShowEditModal(false);
      setEditingAnggota(null);
      alert("Data anggota keluarga berhasil diperbarui");
    } catch (error: any) {
      console.error("Error updating anggota:", error);
      alert(
        error.response?.data?.message ||
          "Gagal memperbarui data anggota keluarga"
      );
    }
  };

  // Handle delete anggota keluarga
  const handleDeleteAnggota = async (
    questionnaireId: string,
    anggotaId: string
  ) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/questionnaires-ks/${questionnaireId}/anggota/${anggotaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh data after successful delete
      fetchData(pagination.page);
      alert("Data anggota keluarga berhasil dihapus");
    } catch (error: any) {
      console.error("Error deleting anggota:", error);
      alert(
        error.response?.data?.message || "Gagal menghapus data anggota keluarga"
      );
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [filters]);

  const exportToCSV = () => {
    const headers = [
      "No",
      "Dinas Kesehatan",
      "Kelurahan",
      "Nama Kepala Keluarga",
      "Pendidikan Tertinggi",
      "Status Pekerjaan Utama",
      "Nama Pengumpul Data",
      "Status",
      "Tanggal",
    ];

    const pendidikanMap: { [key: string]: string } = {
      "1": "Tidak pernah sekolah",
      "2": "Tidak tamat SD/MI",
      "3": "Tamat SD/MI",
      "4": "Tamat SLTP/MTS",
      "5": "Tamat SLTA/MA",
      "6": "Tamat D1/D2/D3",
      "7": "Tamat PT",
    };

    const pekerjaanMap: { [key: string]: string } = {
      "1": "Tidak kerja",
      "2": "Sekolah",
      "3": "PNS/TNI/Polri/BUMN/BUMD",
      "4": "Pegawai Swasta",
      "5": "Wiraswasta/Pedagang/Jasa",
      "6": "Petani",
      "7": "Nelayan",
      "8": "Buruh",
      "9": "Lainnya",
    };

    const csvData = data.map((item, index) => {
      const kepalaKeluarga = item.anggotaKeluarga?.find(
        (anggota: any) =>
          anggota.hubunganKeluarga === "1" ||
          anggota.hubunganKeluarga === "Kepala Keluarga"
      );

      const pendidikan = pendidikanMap[kepalaKeluarga?.pendidikan] || "-";
      const pekerjaan = pekerjaanMap[kepalaKeluarga?.pekerjaan] || "-";

      return [
        index + 1,
        item.namaPuskesmas || "-",
        item.desaKelurahan || "-",
        item.namaKepalaKeluarga || "-",
        pendidikan,
        pekerjaan,
        item.namaPengumpulData || "-",
        item.status === "SUBMITTED"
          ? "Selesai"
          : item.status === "VERIFIED"
          ? "Terverifikasi"
          : item.status === "COMPLETED"
          ? "Selesai"
          : item.status === "IN_PROGRESS"
          ? "Proses"
          : "Draft",
        new Date(item.questionnaireDate).toLocaleDateString("id-ID"),
      ];
    });

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `data-kuesioner-${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div>
      {/* Data Table - Anggota Keluarga */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            � Data Anggota Keluarga
          </h3>
          <p className="text-sm text-gray-600">
            Total:{" "}
            {data.reduce(
              (total, item) => total + (item.anggotaKeluarga?.length || 0),
              0
            )}{" "}
            anggota keluarga
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Aksi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hubungan Keluarga
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Umur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pendidikan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pekerjaan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kepala Keluarga
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    (() => {
                      let rowNumber = 0;
                      return data.flatMap((questionnaire) => {
                        if (
                          !questionnaire.anggotaKeluarga ||
                          questionnaire.anggotaKeluarga.length === 0
                        ) {
                          return [];
                        }

                        return questionnaire.anggotaKeluarga.map(
                          (anggota: any) => {
                            rowNumber++;

                            // Map hubungan keluarga codes
                            const hubunganMap: { [key: string]: string } = {
                              "1": "Kepala Keluarga",
                              "2": "Istri/Suami",
                              "3": "Anak",
                              "4": "Menantu",
                              "5": "Cucu",
                              "6": "Orang tua",
                              "7": "Mertua",
                              "8": "Famili lain",
                              "9": "Pembantu rumah tangga",
                              "10": "Lainnya",
                            };

                            // Map jenis kelamin codes
                            const jenisKelaminMap: { [key: string]: string } = {
                              "1": "Laki-laki",
                              "2": "Perempuan",
                            };

                            // Map pendidikan codes
                            const pendidikanMap: { [key: string]: string } = {
                              "1": "Tidak pernah sekolah",
                              "2": "Tidak tamat SD/MI",
                              "3": "Tamat SD/MI",
                              "4": "Tamat SLTP/MTS",
                              "5": "Tamat SLTA/MA",
                              "6": "Tamat D1/D2/D3",
                              "7": "Tamat PT",
                            };

                            // Map pekerjaan codes
                            const pekerjaanMap: { [key: string]: string } = {
                              "1": "Tidak kerja",
                              "2": "Sekolah",
                              "3": "PNS/TNI/Polri/BUMN/BUMD",
                              "4": "Pegawai Swasta",
                              "5": "Wiraswasta/Pedagang/Jasa",
                              "6": "Petani",
                              "7": "Nelayan",
                              "8": "Buruh",
                              "9": "Lainnya",
                            };

                            const hubungan =
                              hubunganMap[anggota.hubunganKeluarga] ||
                              anggota.hubunganKeluarga ||
                              "-";
                            const jenisKelamin =
                              jenisKelaminMap[anggota.jenisKelamin] ||
                              anggota.jenisKelamin ||
                              "-";
                            const pendidikan =
                              pendidikanMap[anggota.pendidikan] || "-";
                            const pekerjaan =
                              pekerjaanMap[anggota.pekerjaan] || "-";

                            return (
                              <tr
                                key={`${questionnaire.id}-${anggota.id}`}
                                className="hover:bg-gray-50"
                              >
                                <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        window.open(
                                          `/questionnaires/view/${questionnaire.id}`,
                                          "_blank"
                                        )
                                      }
                                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                      title="Lihat Detail Kuesioner"
                                    >
                                      👁️
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditAnggota(
                                          questionnaire.id,
                                          anggota,
                                          questionnaire
                                        )
                                      }
                                      className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                                      title="Edit Anggota Keluarga"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `Apakah Anda yakin ingin menghapus data anggota keluarga "${anggota.nama}"?\n\nPeringatan: Data yang dihapus tidak dapat dikembalikan!`
                                          )
                                        ) {
                                          // Handle delete anggota
                                          handleDeleteAnggota(
                                            questionnaire.id,
                                            anggota.id
                                          );
                                        }
                                      }}
                                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                      title="Hapus Anggota Keluarga"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {rowNumber}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                                  {anggota.nik || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                  {anggota.nama || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {hubungan}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {jenisKelamin}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {anggota.umur || "-"} tahun
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {pendidikan}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {pekerjaan}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {questionnaire.namaKepalaKeluarga || "-"}
                                </td>
                              </tr>
                            );
                          }
                        );
                      });
                    })()
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => fetchData(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchData(i + 1)}
                    className={`px-4 py-2 border rounded-lg ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => fetchData(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Anggota Modal */}
      {showEditModal && editingAnggota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-xl font-semibold">Edit Anggota Keluarga</h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAnggota.nama || ""}
                  onChange={(e) =>
                    setEditingAnggota({
                      ...editingAnggota,
                      nama: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK (Nomor Induk Kependudukan){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAnggota.nik || ""}
                  onChange={(e) =>
                    setEditingAnggota({
                      ...editingAnggota,
                      nik: e.target.value,
                    })
                  }
                  maxLength={16}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="16 digit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Hubungan Keluarga */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hubungan Keluarga
                  </label>
                  <select
                    value={editingAnggota.hubunganKeluarga || ""}
                    onChange={(e) =>
                      setEditingAnggota({
                        ...editingAnggota,
                        hubunganKeluarga: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih...</option>
                    <option value="1">Kepala Keluarga</option>
                    <option value="2">Istri/Suami</option>
                    <option value="3">Anak</option>
                    <option value="4">Menantu</option>
                    <option value="5">Cucu</option>
                    <option value="6">Orang tua</option>
                    <option value="7">Mertua</option>
                    <option value="8">Famili lain</option>
                    <option value="9">Pembantu rumah tangga</option>
                    <option value="10">Lainnya</option>
                  </select>
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={editingAnggota.tanggalLahir || ""}
                    onChange={(e) => {
                      const birthDate = new Date(e.target.value);
                      const today = new Date();
                      const age = Math.floor(
                        (today.getTime() - birthDate.getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      );
                      setEditingAnggota({
                        ...editingAnggota,
                        tanggalLahir: e.target.value,
                        umur: age,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Umur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Umur (otomatis dari tanggal lahir)
                  </label>
                  <input
                    type="number"
                    value={editingAnggota.umur || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={editingAnggota.jenisKelamin || ""}
                    onChange={(e) =>
                      setEditingAnggota({
                        ...editingAnggota,
                        jenisKelamin: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih...</option>
                    <option value="1">Laki-laki</option>
                    <option value="2">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status Perkawinan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Perkawinan
                  </label>
                  <select
                    value={editingAnggota.statusPerkawinan || ""}
                    onChange={(e) =>
                      setEditingAnggota({
                        ...editingAnggota,
                        statusPerkawinan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih...</option>
                    <option value="1">Belum Kawin</option>
                    <option value="2">Kawin</option>
                    <option value="3">Cerai Hidup</option>
                    <option value="4">Cerai Mati</option>
                  </select>
                </div>

                {/* Agama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agama
                  </label>
                  <select
                    value={editingAnggota.agama || ""}
                    onChange={(e) =>
                      setEditingAnggota({
                        ...editingAnggota,
                        agama: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih...</option>
                    <option value="1">Islam</option>
                    <option value="2">Kristen</option>
                    <option value="3">Katolik</option>
                    <option value="4">Hindu</option>
                    <option value="5">Buddha</option>
                    <option value="6">Khonghucu</option>
                    <option value="7">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Pendidikan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pendidikan (untuk usia &gt;5 tahun)
                  </label>
                  <select
                    value={editingAnggota.pendidikan || ""}
                    onChange={(e) =>
                      setEditingAnggota({
                        ...editingAnggota,
                        pendidikan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih...</option>
                    <option value="1">Tidak pernah sekolah</option>
                    <option value="2">Tidak tamat SD/MI</option>
                    <option value="3">Tamat SD/MI</option>
                    <option value="4">Tamat SLTP/MTS</option>
                    <option value="5">Tamat SLTA/MA</option>
                    <option value="6">Tamat D1/D2/D3</option>
                    <option value="7">Tamat PT</option>
                  </select>
                </div>

                {/* Pekerjaan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan (untuk usia &gt;10 tahun)
                  </label>
                  <select
                    value={editingAnggota.pekerjaan || ""}
                    onChange={(e) =>
                      setEditingAnggota({
                        ...editingAnggota,
                        pekerjaan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih...</option>
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
              </div>

              {/* Sedang Hamil (jika perempuan) */}
              {editingAnggota.jenisKelamin === "2" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sedang Hamil
                  </label>
                  <select
                    value={editingAnggota.sedangHamil || ""}
                    onChange={(e) =>
                      setEditingAnggota({
                        ...editingAnggota,
                        sedangHamil: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih...</option>
                    <option value="1">Ya</option>
                    <option value="2">Tidak</option>
                  </select>
                </div>
              )}

              {/* GPS Koordinat Individu */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  📍 Lokasi GPS Individu
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editingAnggota.latitude || ""}
                      onChange={(e) =>
                        setEditingAnggota({
                          ...editingAnggota,
                          latitude: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: -2.578459"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editingAnggota.longitude || ""}
                      onChange={(e) =>
                        setEditingAnggota({
                          ...editingAnggota,
                          longitude: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 140.682547"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 GPS ini otomatis diambil dari questionnaire, bisa diubah
                  untuk lokasi individu yang berbeda
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAnggota(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEditAnggota}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                💾 Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
