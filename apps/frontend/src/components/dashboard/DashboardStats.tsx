import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: "emerald" | "blue" | "indigo" | "amber";
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colorStyles = {
    emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600",
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600",
    indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600",
    amber: "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2 group-hover:text-emerald-600 transition-colors">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorStyles[color]} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats({
  stats,
}: {
  stats: {
    patients: number;
    appointments: number;
    completed: number;
    pending: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Pacientes Totales"
        value={stats.patients}
        icon={Users}
        color="blue"
      />
      <StatCard
        title="Citas del Mes"
        value={stats.appointments}
        icon={Calendar}
        trend={
          stats.trend !== undefined
            ? `${stats.trend >= 0 ? "+" : ""}${stats.trend.toFixed(1)}% vs mes anterior`
            : undefined
        }
        color="emerald"
      />
      <StatCard
        title="Citas Completadas"
        value={stats.completed}
        icon={CheckCircle}
        color="indigo"
      />
      <StatCard
        title="Pendientes"
        value={stats.pending}
        icon={Clock}
        color="amber"
      />
    </div>
  );
}
