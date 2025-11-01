import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Calendar,
  CheckCircle,
  Plus,
  BarChart3,
  Settings,
  Eye,
  Zap,
} from "lucide-react";
import QuickActionButton from "../components/QuickActionButton";
import { useAuthStore } from "../store/authStore";
import API_BASE_URL from "../config/api";

const Dashboard: React.FC = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState([
    {
      name: "Total Kuesioner KS",
      value: "0",
      icon: FileText,
      color: "bg-blue-600", // Biru Jayapura
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      name: "Total Keluarga",
      value: "0",
      icon: Users,
      color: "bg-emerald-600", // Hijau Jayapura
      bgGradient: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Total Anggota Keluarga",
      value: "0",
      icon: Users,
      color: "bg-teal-600", // Teal untuk anggota keluarga
      bgGradient: "from-teal-500 to-teal-600",
    },
    {
      name: "Kuesioner Hari Ini",
      value: "0",
      icon: Calendar,
      color: "bg-amber-500", // Kuning Emas Jayapura
      bgGradient: "from-amber-400 to-amber-500",
    },
    {
      name: "Kuesioner Selesai",
      value: "0",
      icon: CheckCircle,
      color: "bg-red-600", // Merah Jayapura
      bgGradient: "from-red-500 to-red-600",
    },
  ]);

  // Update jam setiap detik
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format tanggal Indonesia
  const formatDate = (date: Date) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  // Format jam - Standard 24 jam (HH:MM:SS)
  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Fetch stats dari API
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        console.log("🔍 Debug authStore:");
        console.log(
          "  - Token from store:",
          token ? token.substring(0, 50) + "..." : "NULL"
        );
        console.log("  - User from store:", user);
        console.log("  - Token exists:", !!token);

        if (!token) {
          console.error("❌ No token found! Please login first.");
          console.error(
            "💡 Try logout and login again with phone: 085719195627, OTP: 123456"
          );
          setIsLoading(false);
          return;
        }

        console.log("🔑 Token exists:", !!token);
        console.log("👤 User:", user?.username);
        console.log(
          "📡 Fetching stats from:",
          `${API_BASE_URL}/questionnaires-ks/stats`
        );

        const response = await axios.get(
          `${API_BASE_URL}/questionnaires-ks/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Stats response:", response.data);
        setIsLoading(false);

        if (response.data.success) {
          const data = response.data.data;
          console.log("📊 Dashboard Data:", {
            totalKuesioner: data.totalKuesioner,
            totalKeluarga: data.totalKeluarga,
            totalAnggotaKeluarga: data.totalAnggotaKeluarga,
            kuesionerHariIni: data.kuesionerHariIni,
            kuesionerSelesai: data.kuesionerSelesai,
          });

          setStats([
            {
              name: "Total Kuesioner KS",
              value: data.totalKuesioner.toString(),
              icon: FileText,
              color: "bg-blue-600",
              bgGradient: "from-blue-500 to-blue-600",
            },
            {
              name: "Total Keluarga",
              value: data.totalKeluarga.toString(),
              icon: Users,
              color: "bg-emerald-600",
              bgGradient: "from-emerald-500 to-emerald-600",
            },
            {
              name: "Total Anggota Keluarga",
              value: data.totalAnggotaKeluarga.toString(),
              icon: Users,
              color: "bg-teal-600",
              bgGradient: "from-teal-500 to-teal-600",
            },
            {
              name: "Kuesioner Hari Ini",
              value: data.kuesionerHariIni.toString(),
              icon: Calendar,
              color: "bg-amber-500",
              bgGradient: "from-amber-400 to-amber-500",
            },
            {
              name: "Kuesioner Selesai",
              value: data.kuesionerSelesai.toString(),
              icon: CheckCircle,
              color: "bg-red-600",
              bgGradient: "from-red-500 to-red-600",
            },
          ]);
        }
      } catch (error: any) {
        console.error("❌ Error fetching stats:", error.message);
        setIsLoading(false);

        if (error.response) {
          console.error("❌ Error response:", error.response.data);
          console.error("❌ Error status:", error.response.status);

          if (error.response.status === 401) {
            console.error(
              "🔐 Token expired or invalid! Auto-logout in 3 seconds..."
            );
            alert("Session expired. Anda akan di-logout dalam 3 detik...");

            // Auto-logout and redirect to login
            setTimeout(() => {
              localStorage.clear();
              window.location.href = "/";
            }, 3000);
          }
        } else if (error.request) {
          console.error("❌ No response from server. Is backend running?");
          alert(
            "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan."
          );
        }
      }
    };

    fetchStats();

    // Auto-refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [token, user]);

  return (
    <div className="space-y-6">
      {/* Header with Logo & Digital Clock */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1 flex items-center space-x-4">
          <img
            src="/images/logo-jayapura.png"
            alt="Logo Kota Jayapura"
            className="h-16 w-16 object-contain hidden sm:block"
          />
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Selamat datang,{" "}
              <span className="font-bold text-blue-600">
                {user?.profile?.fullName || user?.username || "User"}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              di <span className="font-semibold text-amber-600">SiKesKoja</span>{" "}
              - Sistem Kesehatan Kota Jayapura
            </p>
          </div>
        </div>
        {/* Digital Clock & Date */}
        <div className="mt-4 md:mt-0 md:ml-4 text-right">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg">
            <div className="text-4xl font-black tracking-widest digital-clock">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs mt-2 font-medium opacity-90 tracking-wide">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Jayapura Theme */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="card hover:shadow-lg transition-shadow duration-300 border-l-4 border-transparent hover:border-amber-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-lg shadow-md`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons - Jayapura Theme */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-amber-500" />
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionButton
            icon={Plus}
            title="Tambah Kuesioner"
            description="Buat kuesioner keluarga sehat baru"
            gradient="from-blue-500 to-blue-600"
            href="/questionnaires/add"
            badge="Baru"
          />
          <QuickActionButton
            icon={Eye}
            title="Lihat Kuesioner KS"
            description="Pantau dan kelola kuesioner keluarga sehat"
            gradient="from-emerald-500 to-emerald-600"
            href="/questionnaires"
            badge={stats[0].value}
          />
          <QuickActionButton
            icon={BarChart3}
            title="Laporan & Analisis"
            description="Lihat statistik dan laporan lengkap"
            gradient="from-red-500 to-red-600"
            href="/reports"
          />
        </div>
      </div>

      {/* Role-based Actions */}
      {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-600" />
            Manajemen Sistem
            {user?.role === "SUPERADMIN" && (
              <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-amber-400 to-red-500 text-white rounded-full font-bold shadow-md">
                SUPERADMIN
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
              <>
                <QuickActionButton
                  icon={Users}
                  title="Kelola Admin"
                  description="Tambah, edit, hapus admin sistem"
                  gradient="from-blue-500 to-blue-600"
                  onClick={() => navigate("/admin")}
                />
                <QuickActionButton
                  icon={Settings}
                  title="Pengaturan Sistem"
                  description="Konfigurasi sistem dan database"
                  gradient="from-gray-600 to-gray-800"
                  onClick={() => alert("Fitur pengaturan segera hadir!")}
                />
              </>
            )}
            {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
              <QuickActionButton
                icon={Users}
                title="Kelola Petugas"
                description="Tambah, edit, hapus petugas"
                gradient="from-emerald-500 to-emerald-600"
                onClick={() => alert("Fitur kelola petugas segera hadir!")}
              />
            )}
            <QuickActionButton
              icon={BarChart3}
              title="Export Data"
              description="Download data dalam format Excel/PDF"
              gradient="from-amber-500 to-red-600"
              onClick={() => alert("Fitur export segera hadir!")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
