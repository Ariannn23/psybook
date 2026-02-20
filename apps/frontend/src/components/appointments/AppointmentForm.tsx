import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, X, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import PatientSelect from "./PatientSelect";
import ServiceSelect from "./ServiceSelect";
import { getSchedules } from "@/api/schedules";
import { getServices } from "@/api/services";
import type { Schedule } from "@/types/schedules";
import type { Service } from "@/types/services";

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
        console.error("Failed to fetch schedules", error);
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
        console.error("Failed to fetch services", error);
      }
    };
    fetchServices();
  }, []);

  // Auto-calculate endTime when service or startTime changes
  useEffect(() => {
    if (!selectedServiceId || !selectedStartTime) return;

    const service = services.find((s) => s.id === selectedServiceId);
    if (!service) return;

    // Parse start time
    const [startH, startM] = selectedStartTime.split(":").map(Number);
    const startTotalMinutes = startH * 60 + startM;

    // Add service duration
    const endTotalMinutes = startTotalMinutes + service.duration;

    // Convert back to HH:MM format
    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    // Set the endTime value
    setValue("endTime", endTime);
  }, [selectedServiceId, selectedStartTime, services, setValue]);

  const validateSchedule = (data: AppointmentFormData) => {
    // Parse date string consistently: YYYY-MM-DD to get day of week in UTC
    const [year, month, day] = data.date.split('-').map(Number);
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

  // Re-validate when relevant fields change
  useEffect(() => {
    if (selectedDate && selectedStartTime && selectedEndTime) {
      setScheduleError(null);
    }
  }, [selectedDate, selectedStartTime, selectedEndTime]);

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          {initialData ? "Editar Cita" : "Nueva Cita"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {initialData
            ? "Modificar los detalles de la cita."
            : "Agendar una nueva sesión."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
        {(scheduleError || externalError) && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {scheduleError || externalError}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Fecha
              </label>
              <input
                {...register("date")}
                type="date"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                  errors.date
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300",
                )}
                disabled={isLoading}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Hora de Inicio
              </label>
              <input
                {...register("startTime")}
                type="time"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                  errors.startTime
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300",
                )}
                disabled={isLoading}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Hora de Fin
              </label>
              <input
                {...register("endTime")}
                type="time"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                  errors.endTime
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300",
                )}
                disabled={isLoading}
              />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Notas (Opcional)
          </label>
          <textarea
            {...register("notes")}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px] resize-none"
            placeholder="Enfoque de la sesión, recordatorios..."
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => onCancel ? onCancel() : navigate(-1)}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                {initialData ? "Guardar Cambios" : "Agendar Cita"}
              </>
            )}
          </button>
        </div>
      </form>
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
