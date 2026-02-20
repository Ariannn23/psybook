import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";
import {
  getSchedules,
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from "@/api/schedules";
import type { Schedule } from "@/types/schedules";
import { cn } from "@/lib/utils";
import { Pencil, X, List, LayoutGrid } from "lucide-react";
import WeeklyScheduleView from "@/components/schedules/WeeklyScheduleView";

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const scheduleSchema = z
  .object({
    day: z.coerce.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Requerido"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Requerido"),
  })
  .refine(
    (data) => {
      const [startH, startM] = data.startTime.split(":").map(Number);
      const [endH, endM] = data.endTime.split(":").map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      return end > start;
    },
    {
      message: "La hora de fin debe ser posterior a la de inicio",
      path: ["endTime"],
    },
  );

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "weekly">("weekly");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      day: 1, // Monday
      startTime: "09:00",
      endTime: "17:00",
    },
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true);
    setError("");
    try {
      if (editingSchedule) {
        const updated = await updateSchedule(editingSchedule.id, {
          day: Number(data.day),
          startTime: data.startTime,
          endTime: data.endTime,
        });
        setSchedules(
          schedules
            .map((s) => (s.id === editingSchedule.id ? updated : s))
            .sort((a, b) => a.day - b.day),
        );
        setEditingSchedule(null);
      } else {
        const newSchedule = await createSchedule({
          day: Number(data.day),
          startTime: data.startTime,
          endTime: data.endTime,
        });
        setSchedules([...schedules, newSchedule].sort((a, b) => a.day - b.day));
      }
      reset({
        day: Number(data.day),
        startTime: "09:00",
        endTime: "17:00",
      });
    } catch (err: any) {
      console.error("Failed to save schedule", err);
      setError(
        err.response?.data?.message ||
          "Error al guardar horario. Verifica solapamientos.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este horario?")) return;
    try {
      await deleteSchedule(id);
      setSchedules(schedules.filter((s) => s.id !== id));
      if (editingSchedule?.id === id) {
        setEditingSchedule(null);
        reset();
      }
    } catch (err) {
      console.error("Failed to delete schedule", err);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setValue("day", schedule.day);
    setValue("startTime", schedule.startTime);
    setValue("endTime", schedule.endTime);
    setError("");
  };

  const cancelEdit = () => {
    setEditingSchedule(null);
    reset();
    setError("");
  };

  const handleQuickAdd = (dayIndex: number) => {
    setEditingSchedule(null);
    setValue("day", dayIndex);
    setValue("startTime", "09:00");
    setValue("endTime", "17:00");
    setError("");
  };

  const handleSetDayOff = async (dayIndex: number) => {
    const daySchedules = schedulesByDay[dayIndex];
    if (!daySchedules || daySchedules.length === 0) return;

    if (
      !confirm(
        "¿Estás seguro de marcar este día como libre? Se eliminarán todos los horarios configurados.",
      )
    ) {
      return;
    }

    try {
      // Delete all schedules for this day sequentially
      for (const schedule of daySchedules) {
        await deleteSchedule(schedule.id);
      }
      setSchedules((prev) => prev.filter((s) => s.day !== dayIndex));
    } catch (err) {
      console.error("Failed to clear day schedules", err);
      setError("Error al marcar el día como libre.");
    }
  };

  // Group schedules by day for display
  const schedulesByDay = Array.from({ length: 7 }, (_, i) =>
    schedules.filter((s) => s.day === i),
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Disponibilidad</h1>
          <p className="text-slate-500">
            Configura tus horarios de atención semanal.
          </p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode("weekly")}
            className={cn(
              "p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
              viewMode === "weekly"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Semanal</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
              viewMode === "list"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Section */}
        <div className="md:col-span-1">
          <div
            className={cn(
              "bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6 transition-all",
              editingSchedule && "ring-2 ring-emerald-500 border-emerald-500",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingSchedule ? "Editar Horario" : "Agregar Horario"}
              </h2>
              {editingSchedule && (
                <button
                  onClick={cancelEdit}
                  className="text-slate-400 hover:text-slate-600"
                  title="Cancelar edición"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Día de la Semana
                </label>
                <select
                  {...register("day")}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {DAYS.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Inicio
                  </label>
                  <input
                    type="time"
                    {...register("startTime")}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none",
                      errors.startTime && "border-red-500",
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Fin
                  </label>
                  <input
                    type="time"
                    {...register("endTime")}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none",
                      errors.endTime && "border-red-500",
                    )}
                  />
                </div>
              </div>
              {errors.endTime && (
                <p className="text-xs text-red-500">{errors.endTime.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2 cursor-pointer",
                  editingSchedule
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-emerald-600 hover:bg-emerald-700",
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {editingSchedule ? (
                      <Pencil className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {editingSchedule ? "Actualizar" : "Agregar"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : viewMode === "weekly" ? (
            <WeeklyScheduleView schedules={schedules} />
          ) : (
            <div className="space-y-4">
              {DAYS.map((dayName, dayIndex) => {
                const daySchedules = schedulesByDay[dayIndex];
                const isToday = new Date().getDay() === dayIndex;
                const hasSchedules = daySchedules && daySchedules.length > 0;

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-xl border transition-all hover:shadow-md",
                      isToday
                        ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                        : "border-slate-200 shadow-sm",
                    )}
                  >
                    <div className="w-24 shrink-0 flex flex-col gap-2">
                      <div
                        className={cn(
                          "inline-flex justify-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-full",
                          isToday
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {dayName}
                      </div>

                      {hasSchedules ? (
                        <button
                          onClick={() => handleSetDayOff(dayIndex)}
                          className="text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 py-1 px-2 rounded transition-colors text-center w-full cursor-pointer"
                        >
                          Marcar libre
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickAdd(dayIndex)}
                          className="text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 py-1 px-2 rounded transition-colors text-center w-full flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          Agregar
                        </button>
                      )}
                    </div>

                    <div className="flex-1 flex flex-wrap gap-2 items-center min-h-[40px]">
                      {hasSchedules ? (
                        daySchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className={cn(
                              "group relative flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all",
                              editingSchedule?.id === schedule.id
                                ? "ring-2 ring-amber-400 border-amber-400 bg-amber-50"
                                : "hover:border-emerald-300 hover:shadow-sm",
                            )}
                          >
                            <span className="font-semibold text-slate-700">
                              {schedule.startTime} - {schedule.endTime}
                            </span>

                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(schedule)}
                                className="text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded p-1 transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(schedule.id)}
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded p-1 transition-colors cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          onClick={() => handleQuickAdd(dayIndex)}
                          className="flex items-center gap-2 text-slate-400 italic pl-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-dashed border-slate-200 w-full sm:w-auto cursor-pointer hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Clic para agregar horario"
                        >
                          <span className="text-sm">
                            Día libre (No laborable)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && schedules.length === 0 && (
            <div className="mt-6 bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No hay disponibilidad configurada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
