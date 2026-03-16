import { useState } from "react";
import { Clock } from "lucide-react";
import type { Schedule } from "@/types/schedules";
import { cn } from "@/lib/utils";

const DAYS = [
  { name: "Domingo", short: "Dom", value: 0 },
  { name: "Lunes", short: "Lun", value: 1 },
  { name: "Martes", short: "Mar", value: 2 },
  { name: "Miércoles", short: "Mié", value: 3 },
  { name: "Jueves", short: "Jue", value: 4 },
  { name: "Viernes", short: "Vie", value: 5 },
  { name: "Sábado", short: "Sáb", value: 6 },
];

interface WeeklyScheduleViewProps {
  schedules: Schedule[];
}

export default function WeeklyScheduleView({
  schedules,
}: WeeklyScheduleViewProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const getSchedulesForDay = (day: number) => {
    return schedules.filter((s) => s.day === day);
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // "09:00"
  };

  const getDateForDay = (dayIndex: number) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sun) - 6 (Sat)

    const diff = dayIndex - currentDay;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    return targetDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Vista Semanal de Horarios
            </h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-0.5">
              Configuración actual de sesiones
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        <div className="grid grid-cols-7 gap-4 min-w-[800px]">
          {DAYS.map((day) => {
            const daySchedules = getSchedulesForDay(day.value);
            const hasSchedules = daySchedules.length > 0;
            const dateString = getDateForDay(day.value);

            return (
              <div
                key={day.value}
                className={cn(
                  "border rounded-xl transition-all flex flex-col overflow-hidden",
                  hasSchedules
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-100 bg-slate-50/30",
                  hoveredDay === day.value && "border-emerald-300 shadow-md",
                )}
                onMouseEnter={() => setHoveredDay(day.value)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div
                  className={cn(
                    "p-3 text-center border-b",
                    hasSchedules
                      ? "bg-emerald-100/50 border-emerald-100"
                      : "bg-slate-100/50 border-slate-100",
                  )}
                >
                  <h3
                    className={cn(
                      "font-semibold text-sm",
                      hasSchedules ? "text-emerald-800" : "text-slate-500",
                    )}
                  >
                    {day.name}
                  </h3>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      hasSchedules ? "text-emerald-600" : "text-slate-400",
                    )}
                  >
                    {dateString}
                  </p>
                </div>

                <div className="p-2 flex-1 flex flex-col gap-2 min-h-[160px]">
                  {hasSchedules ? (
                    daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="group relative w-full bg-emerald-50/30 border border-emerald-100 hover:border-emerald-300 rounded-lg py-3 px-2 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <div className="flex flex-col items-center justify-center gap-1 text-sm font-semibold text-emerald-700 w-full py-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-500/80 mb-0.5" />
                          <span>{formatTime(schedule.startTime)}</span>
                          <div className="w-3 h-0.5 bg-emerald-200 rounded-full my-0.5"></div>
                          <span>{formatTime(schedule.endTime)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-medium uppercase tracking-wider">
                        Libre
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
