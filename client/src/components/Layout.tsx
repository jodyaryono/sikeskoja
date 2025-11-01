import React, { useState } from "react";
import { Menu, X, FileText, Home, LogOut, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Kuesioner KS",
      href: "/questionnaires",
      icon: FileText,
    },
    {
      name: "Laporan & Analisis",
      href: "/reports",
      icon: FileText,
    },
    {
      name: "Kelola Admin",
      href: "/admin",
      icon: Users,
      adminOnly: true,
    },
  ];

  const isCurrentPath = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex flex-col items-center px-4">
              <img
                src="/images/logo-jayapura.png"
                alt="Logo Kota Jayapura"
                className="h-32 w-32 object-contain"
              />
              <div className="mt-3 text-center">
                <span className="block text-lg font-bold text-gray-900">
                  SiKesKoja
                </span>
                <span className="block text-xs text-gray-600 mt-1">
                  Sistem Kesehatan Kota Jayapura
                </span>
              </div>
            </div>
            <nav className="mt-6 px-2 space-y-1">
              {navigation
                .filter((item) => !item.adminOnly || user?.role === "ADMIN")
                .map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      isCurrentPath(item.href)
                        ? "bg-primary-100 text-primary-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isCurrentPath(item.href)
                          ? "text-primary-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </a>
                ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.profile?.fullName?.charAt(0) ||
                      user?.username?.charAt(0) ||
                      "U"}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700">
                  {user?.profile?.fullName || user?.username}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex flex-col items-center flex-shrink-0 px-4">
                <img
                  src="/images/logo-jayapura.png"
                  alt="Logo Kota Jayapura"
                  className="h-32 w-32 object-contain"
                />
                <div className="mt-3 text-center">
                  <span className="block text-lg font-bold text-gray-900">
                    SiKesKoja
                  </span>
                  <span className="block text-xs text-gray-600 mt-1">
                    Sistem Kesehatan Kota Jayapura
                  </span>
                </div>
              </div>
              <nav className="mt-6 flex-1 px-2 bg-white space-y-1">
                {navigation
                  .filter((item) => !item.adminOnly || user?.role === "ADMIN")
                  .map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`${
                        isCurrentPath(item.href)
                          ? "bg-primary-100 text-primary-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className={`${
                          isCurrentPath(item.href)
                            ? "text-primary-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </a>
                  ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.profile?.fullName?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.profile?.fullName || user?.username}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <img
                src="/images/logo-jayapura.png"
                alt="Logo Kota Jayapura"
                className="h-8 w-8 object-contain"
              />
              <span className="ml-2 text-lg font-bold text-gray-900">
                SiKesKoja
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
