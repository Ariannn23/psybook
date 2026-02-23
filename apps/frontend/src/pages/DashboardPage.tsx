import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  User as UserIcon,
  Clock,
  Menu,
  X,
  Shield,
} from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import NotificationBell from "@/components/dashboard/NotificationBell";
import DigitalClock from "@/components/dashboard/DigitalClock";
import ActivityChart from "@/components/dashboard/ActivityChart";
import StatusChart from "@/components/dashboard/StatusChart";
import { getDashboardStats } from "@/api/dashboard";
import type { DashboardStats as DashboardStatsType } from "@/api/dashboard";
import PageLoader from "@/components/ui/PageLoader";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const navItems = [
    {
      href: "/dashboard",
      label: "Resumen",
      icon: LayoutDashboard,
      exact: true,
    },
    { href: "/dashboard/patients", label: "Pacientes", icon: Users },
    { href: "/dashboard/appointments", label: "Citas", icon: Calendar },
    { href: "/dashboard/services", label: "Servicios", icon: LayoutDashboard },
    { href: "/dashboard/availability", label: "Disponibilidad", icon: Clock },
    ...(user?.role === "ADMIN"
      ? [{ href: "/dashboard/users", label: "Usuarios", icon: Shield }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/icono_psybook.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-slate-900 tracking-tight">
            PsyBook
          </span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Abrir Menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Sidebar Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 bottom-0 z-50 w-72 md:w-64 bg-white border-r border-slate-200/60 flex-shrink-0 shadow-2xl md:shadow-lg transition-transform duration-300 md:translate-x-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-100 to-amber-50 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="/icono_psybook.png"
                alt="PsyBook Logo"
                className="w-10 h-10 object-contain relative"
              />
            </div>
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">
              PsyBook
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
            title="Cerrar Menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-100">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold relative group mb-1",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-[#475569] hover:bg-[#f8fafc] hover:text-emerald-600",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-emerald-500 rounded-r-full"></div>
                )}
                <item.icon
                  size={20}
                  className={cn(
                    "transition-transform duration-300",
                    isActive && "text-emerald-600",
                    !isActive && "text-[#94a3b8] group-hover:text-emerald-600",
                  )}
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-4 mb-3 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group/user"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm group-hover/user:scale-105 transition-all">
              <UserIcon size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">
                {user?.name}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                {user?.role === "ADMIN" ? "Administrador" : "Psicólogo"}
              </p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 transition-all duration-300 text-sm font-bold hover:bg-red-50 rounded-xl group/logout"
          >
            <LogOut
              size={18}
              className="group-hover/logout:-translate-x-1 transition-transform"
            />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-64px)] md:min-h-screen">
        {/* Page Content */}
        {location.pathname === "/dashboard" ? (
          <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Resumen General
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  Bienvenido de nuevo,{" "}
                  <span className="text-emerald-600 font-bold">
                    {user?.name}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DigitalClock />
                <div className="hidden md:block">
                  <NotificationBell />
                </div>
              </div>
            </div>
            <DashboardContent />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <PageLoader fullPage={false} message="Cargando resumen..." />;
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-red-500">Error al cargar datos.</div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointments appointments={stats.nextAppointments} />
        <ActivityChart data={stats.charts.byDay} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart data={stats.charts.byStatus} />
      </div>
    </div>
  );
}
