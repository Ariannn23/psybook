import { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User, Calendar } from "lucide-react";
import type { Appointment } from "@/types/appointments";
import { cn } from "@/lib/utils";

interface WeeklyViewProps {
  appointments: Appointment[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeeklyView({ appointments }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  const getAppointmentsForDayAndHour = (day: Date, hour: number) => {
    return appointments.filter((apt) => {
      const aptDate = parseISO(apt.date);
      if (!isSameDay(aptDate, day)) return false;

      const [aptHour] = apt.startTime.split(":").map(Number);
      return aptHour === hour;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100 opacity-60";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {format(weekStart, "d MMM", { locale: es })} -{" "}
                {format(addDays(weekStart, 6), "d MMM yyyy", { locale: es })}
              </h2>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-0.5">
                Agenda semanal
              </p>
            </div>
          </div>

          <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
            <button
              onClick={prevWeek}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-all cursor-pointer"
              title="Semana anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all border-x border-slate-100 cursor-pointer"
              title="Ir a esta semana"
            >
              Hoy
            </button>
            <button
              onClick={nextWeek}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-all cursor-pointer"
              title="Semana siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/50">
            <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200">
              Hora
            </div>
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "p-3 text-center border-r border-slate-200 last:border-r-0",
                    isToday && "bg-emerald-50",
                  )}
                >
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {format(day, "EEE", { locale: es })}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold mt-1",
                      isToday ? "text-emerald-600" : "text-slate-700",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="divide-y divide-slate-100">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-8 hover:bg-slate-50/50 transition-colors"
              >
                <div className="p-2 text-xs text-slate-500 font-medium border-r border-slate-200 flex items-center justify-end pr-3">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                {weekDays.map((day) => {
                  const dayAppointments = getAppointmentsForDayAndHour(
                    day,
                    hour,
                  );
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={`${day.toString()}-${hour}`}
                      className={cn(
                        "p-1 border-r border-slate-100 last:border-r-0 min-h-[60px]",
                        isToday && "bg-emerald-50/30",
                      )}
                    >
                      {dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={cn(
                            "text-[10px] p-1.5 rounded border mb-1 cursor-pointer hover:shadow-sm transition-all",
                            getStatusColor(apt.status),
                          )}
                          title={`${apt.startTime} - ${apt.patient?.name || "Paciente"} (${apt.status === "COMPLETED" ? "Atendida" : apt.status})`}
                        >
                          <div className="flex items-center gap-1 font-semibold mb-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {apt.startTime}
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <User className="w-2.5 h-2.5" />
                            {apt.patient?.name || "Desconocido"}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
