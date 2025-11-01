import React, { useState } from "react";
import {
  Phone,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Heart,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import API_BASE_URL from "../config/api";

const Login: React.FC = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { login } = useAuthStore();

  // Timer for OTP expiration
  React.useEffect(() => {
    if (expiresAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(expiresAt).getTime();
        const diff = Math.floor((expiry - now) / 1000);

        if (diff <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(diff);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [expiresAt]);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/otp/request`, {
        phone: phone,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setExpiresAt(new Date(response.data.data.expiresAt));
        setStep("otp");
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Gagal mengirim OTP. Pastikan nomor HP sudah terdaftar."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/otp/verify`, {
        phone: phone,
        otpCode: otpCode,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        login(user, token);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Kode OTP tidak valid atau sudah kadaluarsa."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/otp/resend`, {
        phone: phone,
      });

      if (response.data.success) {
        setSuccess("Kode OTP baru telah dikirim!");
        setExpiresAt(new Date(response.data.data.expiresAt));
        setOtpCode("");
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim ulang OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtpCode("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-2xl">
                <img
                  src="/images/logo-jayapura.png"
                  alt="Logo Kota Jayapura"
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerHTML =
                      '<div class="h-16 w-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center"><svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>';
                  }}
                />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
            SiKesKoja
          </h2>
          <p className="mt-2 text-blue-100 text-sm font-medium">
            Sistem Kesehatan Kota Jayapura
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-blue-200">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              <span>Aman & Terpercaya</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span>Untuk Kesehatan</span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-white/20">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Phone Number */}
          {step === "phone" && (
            <form className="space-y-6" onSubmit={handleRequestOTP}>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nomor WhatsApp
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Masukkan nomor WhatsApp yang terdaftar
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !phone}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim OTP...
                    </div>
                  ) : (
                    "Kirim Kode OTP"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Demo: 081234567890, 081234567891, 081234567892
                </p>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kode OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono sm:text-sm"
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, ""))
                    }
                    autoComplete="off"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Kode dikirim ke: <strong>{phone}</strong>
                  </span>
                  {timeLeft > 0 && (
                    <span className="text-blue-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memverifikasi...
                    </div>
                  ) : (
                    "Verifikasi & Masuk"
                  )}
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ganti Nomor
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading || timeLeft > 0}
                    className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kirim Ulang
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
