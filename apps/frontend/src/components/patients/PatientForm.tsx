import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
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
      email: "",
      phone: "",
      notes: "",
    },
  });

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          {title === "Patient Information" ? "Información del Paciente" : title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {description === "Enter the patient's details below."
            ? "Ingrese los detalles del paciente."
            : description}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Nombre Completo
            </label>
            <input
              {...register("name")}
              className={cn(
                "w-full px-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300",
              )}
              placeholder="Juan Pérez"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Correo Electrónico
            </label>
            <input
              {...register("email")}
              type="email"
              className={cn(
                "w-full px-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300",
              )}
              placeholder="juan@ejemplo.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              {...register("phone")}
              type="tel"
              className={cn(
                "w-full px-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300",
              )}
              placeholder="+1234567890"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Notas (Opcional)
          </label>
          <textarea
            {...register("notes")}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px] resize-none"
            placeholder="Historia médica, alergias, etc."
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
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
                Guardar Paciente
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
