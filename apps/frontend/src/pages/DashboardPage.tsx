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

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const location = useLocation();

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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/80 backdrop-blur-lg border-r border-slate-200/50 flex-shrink-0 shadow-lg">
        <div className="p-6 border-b border-slate-200/50 flex items-center gap-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
          <div className="relative">
            <img 
              src="/icono_psybook.png" 
              alt="PsyBook Logo" 
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl -z-10"></div>
          </div>
          <h1 className="text-xl font-bold gradient-text">
            PsyBook
          </h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium relative group",
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full"></div>
                )}
                <item.icon 
                  size={18} 
                  className={cn(
                    "transition-transform duration-200",
                    isActive && "scale-110",
                    !isActive && "group-hover:scale-110"
                  )} 
                />
                <span className={cn(
                  "transition-all duration-200",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 group/user">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center text-emerald-600 shadow-sm group-hover/user:shadow-md group-hover/user:scale-105 transition-all duration-200">
              <UserIcon size={18} />
            </div>
            <div className="overflow-hidden">
              <Link to="/dashboard/profile" className="block">
                <p className="text-sm font-medium text-slate-800 truncate hover:text-emerald-600 transition-colors">
                  {user?.name}
                </p>
              </Link>
              <p className="text-xs text-slate-500 capitalize truncate">
                {user?.role === "ADMIN" ? "Administrador" : "Psicólogo"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-600 transition-all duration-200 text-sm font-medium hover:bg-red-50 rounded-lg hover:shadow-sm hover:scale-[1.02] group"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-200" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Page Content */}
        {location.pathname === "/dashboard" ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Resumen</h1>
              <div className="flex items-center gap-4 animate-slide-in">
                <DigitalClock />
                <NotificationBell />
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
    return (
      <div className="p-8 text-center text-slate-500">Cargando resumen...</div>
    );
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
