import { useState } from "react";
import { Clock, Plus, Pencil, Trash2 } from "lucide-react";
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
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export default function WeeklyScheduleView({
  schedules,
  onEdit,
  onDelete,
}: WeeklyScheduleViewProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const getSchedulesForDay = (day: number) => {
    return schedules.filter((s) => s.day === day);
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // "09:00"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          Vista Semanal de Horarios
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Visualiza tus horarios de atención por día de la semana
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {DAYS.map((day) => {
            const daySchedules = getSchedulesForDay(day.value);
            const hasSchedules = daySchedules.length > 0;

            return (
              <div
                key={day.value}
                className={cn(
                  "border-2 rounded-lg p-4 transition-all min-h-[200px]",
                  hasSchedules
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-200 bg-slate-50/50",
                  hoveredDay === day.value && "border-emerald-400 shadow-md"
                )}
                onMouseEnter={() => setHoveredDay(day.value)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={cn(
                      "font-semibold text-sm",
                      hasSchedules ? "text-emerald-800" : "text-slate-500"
                    )}
                  >
                    {day.short}
                  </h3>
                  {hasSchedules && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {daySchedules.length}
                    </span>
                  )}
                </div>

                {hasSchedules ? (
                  <div className="space-y-2">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="bg-white border border-emerald-200 rounded-lg p-3 hover:shadow-sm transition-shadow group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatTime(schedule.startTime)} -{" "}
                              {formatTime(schedule.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEdit(schedule)}
                              className="p-1 hover:bg-emerald-100 rounded text-emerald-600 transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDelete(schedule.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-slate-400">
                    <Clock className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs text-center">Sin horarios</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
