import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const patientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z
    .string()
    .min(9, "El número de teléfono debe tener al menos 9 dígitos"),
  notes: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  initialData?: PatientFormData;
  onSubmit: (data: PatientFormData) => Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export default function PatientForm({
  initialData,
  onSubmit,
  isLoading = false,
  title = "Patient Information",
  description = "Enter the patient's details below.",
}: PatientFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData || {
      name: "",
      dni: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  return (
    <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

      <div className="relative">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Save className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {title === "Patient Information"
                  ? "Información del Paciente"
                  : title}
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                {description === "Enter the patient's details below."
                  ? "Ingrese los detalles del paciente."
                  : description}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                Nombre Completo
              </label>
              <input
                {...register("name")}
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                  errors.name
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-100 focus:border-emerald-500",
                )}
                placeholder="Juan Pérez"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 font-bold ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                DNI / Documento
              </label>
              <input
                {...register("dni")}
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                  errors.dni
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-100 focus:border-emerald-500",
                )}
                placeholder="12345678"
                disabled={isLoading}
              />
              {errors.dni && (
                <p className="text-xs text-rose-500 font-bold ml-1">
                  {errors.dni.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                Correo Electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                  errors.email
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-100 focus:border-emerald-500",
                )}
                placeholder="juan@ejemplo.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 font-bold ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                Teléfono
              </label>
              <input
                {...register("phone")}
                type="tel"
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 shadow-sm",
                  errors.phone
                    ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                    : "border-slate-100 focus:border-emerald-500",
                )}
                placeholder="+1234567890"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-xs text-rose-500 font-bold ml-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
              Notas (Opcional)
            </label>
            <textarea
              {...register("notes")}
              className="w-full px-5 py-3.5 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 min-h-[120px] resize-none font-medium text-slate-600 shadow-sm"
              placeholder="Historia médica, alergias, etc."
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
                  <span className="relative z-10">Guardar Paciente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
