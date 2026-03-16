import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, X, AlertTriangle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import PatientSelect from "./PatientSelect";
import ServiceSelect from "./ServiceSelect";
import { getSchedules } from "@/api/schedules";
import { getServices } from "@/api/services";
import type { Schedule } from "@/types/schedules";
import type { Service } from "@/types/services";
import { logger } from "@/utils/logger";

const appointmentSchema = z
  .object({
    patientId: z.string().min(1, "El paciente es obligatorio"),
    serviceId: z.string().min(1, "El servicio es obligatorio"),
    date: z.string().min(1, "La fecha es obligatoria"),
    startTime: z.string().min(1, "La hora de inicio es obligatoria"),
    endTime: z.string().min(1, "La hora de fin es obligatoria"),
    notes: z.string().optional(),
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

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<AppointmentFormData>;
  externalError?: string | null;
  onCancel?: () => void;
}

export default function AppointmentForm({
  onSubmit,
  isLoading = false,
  initialData,
  externalError,
  onCancel,
}: AppointmentFormProps) {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: initialData?.patientId || "",
      serviceId: initialData?.serviceId || "",
      date: initialData?.date || new Date().toISOString().split("T")[0],
      startTime: initialData?.startTime || "09:00",
      endTime: initialData?.endTime || "10:00",
      notes: initialData?.notes || "",
    },
  });

  const selectedDate = watch("date");
  const selectedStartTime = watch("startTime");
  const selectedEndTime = watch("endTime");
  const selectedServiceId = watch("serviceId");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getSchedules();
        setSchedules(data);
      } catch (error) {
        logger.error("Failed to fetch schedules", error);
      }
    };
    fetchSchedules();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data.filter((s) => s.isActive));
      } catch (error) {
        logger.error("Failed to fetch services", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!selectedServiceId || !selectedStartTime) return;

    const service = services.find((s) => s.id === selectedServiceId);
    if (!service) return;

    const [startH, startM] = selectedStartTime.split(":").map(Number);
    const startTotalMinutes = startH * 60 + startM;

    const endTotalMinutes = startTotalMinutes + service.duration;

    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    setValue("endTime", endTime);
  }, [selectedServiceId, selectedStartTime, services, setValue]);

  const validateSchedule = (data: AppointmentFormData) => {
    const [year, month, day] = data.date.split("-").map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = dateObj.getUTCDay();

    const daySchedule = schedules.find((s) => s.day === dayOfWeek);

    if (!daySchedule) {
      setScheduleError(
        `El doctor no tiene horarios disponibles en este día (${getDayName(dayOfWeek)}). Selecciona otro día.`,
      );
      return false;
    }

    const [schedStartH, schedStartM] = daySchedule.startTime
      .split(":")
      .map(Number);
    const [schedEndH, schedEndM] = daySchedule.endTime.split(":").map(Number);

    const [appStartH, appStartM] = data.startTime.split(":").map(Number);
    const [appEndH, appEndM] = data.endTime.split(":").map(Number);

    const schedStart = schedStartH * 60 + schedStartM;
    const schedEnd = schedEndH * 60 + schedEndM;
    const appStart = appStartH * 60 + appStartM;
    const appEnd = appEndH * 60 + appEndM;

    if (appStart < schedStart || appEnd > schedEnd) {
      setScheduleError(
        `La cita debe ser entre ${daySchedule.startTime} y ${daySchedule.endTime}.`,
      );
      return false;
    }

    setScheduleError(null);
    return true;
  };

  const onFormSubmit = async (data: AppointmentFormData) => {
    if (!validateSchedule(data)) return;
    await onSubmit(data);
  };

  useEffect(() => {
    if (selectedDate && selectedStartTime && selectedEndTime) {
      setScheduleError(null);
    }
  }, [selectedDate, selectedStartTime, selectedEndTime]);

  return (
    <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

      <div className="relative">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {initialData ? "Editar Cita" : "Nueva Cita"}
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                {initialData
                  ? "Modificar los detalles de la cita."
                  : "Agendar una nueva sesión."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
          {(scheduleError || externalError) && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {scheduleError || externalError}
            </div>
          )}

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                Paciente
              </label>
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <PatientSelect
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.patientId?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                Servicio
              </label>
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => (
                  <ServiceSelect
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.serviceId?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Fecha
                </label>
                <input
                  {...register("date")}
                  type="date"
                  className={cn(
                    "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                    errors.date
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-100 focus:border-emerald-500",
                  )}
                  disabled={isLoading}
                />
                {errors.date && (
                  <p className="text-xs text-rose-500 font-bold ml-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Hora de Inicio
                </label>
                <input
                  {...register("startTime")}
                  type="time"
                  className={cn(
                    "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                    errors.startTime
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-100 focus:border-emerald-500",
                  )}
                  disabled={isLoading}
                />
                {errors.startTime && (
                  <p className="text-xs text-rose-500 font-bold ml-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Hora de Fin
                </label>
                <input
                  {...register("endTime")}
                  type="time"
                  className={cn(
                    "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                    errors.endTime
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-100 focus:border-emerald-500",
                  )}
                  disabled={isLoading}
                />
                {errors.endTime && (
                  <p className="text-xs text-rose-500 font-bold ml-1">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
              Notas (Opcional)
            </label>
            <textarea
              {...register("notes")}
              className="w-full px-5 py-3.5 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 min-h-[120px] resize-none font-medium text-slate-600 shadow-sm"
              placeholder="Enfoque de la sesión, recordatorios..."
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-50">
            <button
              type="button"
              onClick={() => (onCancel ? onCancel() : navigate(-1))}
              className="px-6 py-3.5 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative overflow-hidden bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200 active:scale-95 disabled:opacity-50 font-bold uppercase tracking-widest text-xs cursor-pointer"
            >
              <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
              ) : (
                <>
                  <Save className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">
                    {initialData ? "Guardar Cambios" : "Agendar Cita"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getDayName(dayIndex: number): string {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[dayIndex] || "Desconocido";
}
