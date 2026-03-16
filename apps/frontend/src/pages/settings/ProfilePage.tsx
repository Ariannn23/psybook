import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile } from "@/api/users";
import { Loader2, Save, User, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/ui/PageLoader";
import { logger } from "@/utils/logger";
import axios from "axios";

const profileSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "La contraseña actual es requerida para establecer una nueva",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: "La nueva contraseña debe tener al menos 6 caracteres",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    },
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [initialData, setInitialData] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setValue("name", data.name);
      setValue("email", data.email);
      setInitialData({ name: data.name, email: data.email });
    } catch (error) {
      logger.error("Failed to load profile", error);
      setErrorMessage("Error al cargar los datos del perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    const isSensitiveChange =
      (initialData &&
        (data.name !== initialData.name || data.email !== initialData.email)) ||
      data.newPassword;

    if (isSensitiveChange && !data.currentPassword) {
      setError("currentPassword", {
        type: "manual",
        message:
          "Se requiere la contraseña actual para confirmar cambios sensibles",
      });
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const updatedUser = await updateProfile({
        name: data.name,
        email: data.email,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
      });

      setSuccessMessage("Perfil actualizado con éxito");
      if (updatedUser.name && updatedUser.email) {
        setInitialData({ name: updatedUser.name, email: updatedUser.email });
      }

      if (authUser) {
        updateUser({
          ...authUser,
          ...updatedUser,
        });
      }

      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    } catch (err: unknown) {
      logger.error("Failed to update profile", err);
      const msg = (() => {
        if (!axios.isAxiosError(err)) return undefined;
        const data = err.response?.data;
        if (!data || typeof data !== "object") return undefined;
        if (!("message" in data)) return undefined;
        const maybeMessage = (data as { message?: unknown }).message;
        return typeof maybeMessage === "string" ? maybeMessage : undefined;
      })();
      setErrorMessage(msg ?? "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PageLoader fullPage={false} message="Cargando perfil..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Mi Perfil
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestiona la configuración y preferencias de tu cuenta
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-slide-in">
          <div className="p-1.5 bg-white rounded-full shadow-sm">
            <Save className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-slide-in">
          <div className="p-1.5 bg-white rounded-full shadow-sm">
            <Loader2 className="w-4 h-4 text-rose-600" />
          </div>
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

          <div className="relative p-8 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Información Personal
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Nombre Completo
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register("name")}
                    type="text"
                    className={cn(
                      "w-full pl-12 pr-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm",
                      errors.name
                        ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                        : "border-slate-100 focus:border-emerald-500",
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-500 font-semibold ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    className={cn(
                      "w-full pl-12 pr-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm",
                      errors.email
                        ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                        : "border-slate-100 focus:border-emerald-500",
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 font-semibold ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Seguridad
              </h2>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">
                Confirmación requerida para cambios sensibles
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 max-w-md">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                Contraseña Actual
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                <input
                  {...register("currentPassword")}
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-12 pr-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm",
                    errors.currentPassword
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-100 focus:border-amber-500",
                  )}
                />
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-rose-500 font-semibold ml-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-6 border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Nueva Contraseña
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register("newPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-12 pr-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm",
                      errors.newPassword
                        ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                        : "border-slate-100 focus:border-emerald-500",
                    )}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-rose-500 font-semibold ml-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-12 pr-5 py-3.5 rounded-2xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm",
                      errors.confirmPassword
                        ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                        : "border-slate-100 focus:border-emerald-500",
                    )}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 font-semibold ml-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pr-8">
          <button
            type="submit"
            disabled={isSaving}
            className="group relative overflow-hidden bg-slate-900 text-white px-10 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200 active:scale-95 disabled:opacity-50 font-bold uppercase tracking-widest text-xs"
          >
            <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            ) : (
              <>
                <Save className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
