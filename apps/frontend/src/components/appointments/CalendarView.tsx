import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import type { Appointment } from "@/types/appointments";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  appointments: Appointment[];
}

export default function CalendarView({ appointments }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
          <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors border-x border-transparent hover:border-slate-100"
              title="Ir a hoy"
            >
              Hoy
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px border-b border-slate-200">
        {days.map((day) => {
          const isSelectedMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          const dayAppointments = appointments.filter((apt) =>
            isSameDay(parseISO(apt.date), day),
          );

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] bg-white p-2 transition-colors hover:bg-slate-50/50 flex flex-col gap-1",
                !isSelectedMonth && "bg-slate-50/30 text-slate-400",
              )}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday ? "bg-emerald-600 text-white" : "text-slate-700",
                  )}
                >
                  {format(day, dateFormat)}
                </span>
                {dayAppointments.length > 0 && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">
                    {dayAppointments.length}
                  </span>
                )}
              </div>

              <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[100px] scrollbar-thin">
                {dayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={cn(
                      "text-[10px] p-1.5 rounded border mb-1 truncate cursor-pointer hover:shadow-sm transition-all group",
                      getStatusColor(apt.status),
                    )}
                    title={`${apt.startTime} - ${apt.patient?.name || "Paciente"}`}
                  >
                    <div className="flex items-center gap-1 font-semibold mb-0.5">
                      <Clock className="w-3 h-3 opacity-70" />
                      {apt.startTime}
                    </div>
                    <div className="flex items-center gap-1 truncate opacity-90 group-hover:opacity-100">
                      <User className="w-3 h-3 opacity-70" />
                      {apt.patient?.name || "Desconocido"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
