import { Link } from "react-router-dom";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  patient: {
    id: string;
    name: string;
  };
}

// Función para crear una fecha desde string ISO usando UTC
function getDateFromISO(dateString: string): Date {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth();
  const day = dateObj.getUTCDate();
  return new Date(year, month, day);
}

export default function UpcomingAppointments({
  appointments,
}: {
  appointments: Appointment[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50/50 to-white">
        <h2 className="text-lg font-bold text-slate-800">Próximas Citas</h2>
        <Link
          to="/dashboard/appointments"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group transition-all duration-200 hover:gap-2"
        >
          Ver todas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {appointments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
            <Calendar className="w-10 h-10 mb-2 opacity-20" />
            <p>No hay citas próximas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt, index) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-slate-50 transition-all duration-200 hover:shadow-sm hover:scale-[1.02] group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex flex-col items-center justify-center text-emerald-700 font-semibold text-xs shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-200">
                  <span className="capitalize text-[10px]">
                    {format(getDateFromISO(apt.date), "MMM", { locale: es })}
                  </span>
                  <span className="text-lg leading-none">
                    {format(getDateFromISO(apt.date), "d")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {apt.patient.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {apt.startTime} - {apt.endTime}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/dashboard/patients/${apt.patient.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
