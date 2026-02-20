import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile } from "@/api/users";
import { Loader2, Save, User, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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
      if (data.newPassword !== data.confirmPassword) {
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

  const {
    register,
    handleSubmit,
    setValue,
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
    } catch (error) {
      console.error("Failed to load profile", error);
      setErrorMessage("Error al cargar los datos del perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
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

      if (authUser) {
        updateUser({
          ...authUser,
          ...updatedUser,
        });
      }

      // Clear password fields
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    } catch (err: any) {
      console.error("Failed to update profile", err);
      setErrorMessage(
        err.response?.data?.message || "Error al actualizar el perfil",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>
        <p className="text-slate-500">
          Gestiona la configuración y preferencias de tu cuenta
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Información Personal
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    {...register("name")}
                    type="text"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                      errors.name ? "border-red-500" : "border-slate-300",
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    {...register("email")}
                    type="email"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                      errors.email ? "border-red-500" : "border-slate-300",
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Seguridad</h2>
            <p className="text-sm text-slate-500">
              Deja en blanco si no deseas cambiar tu contraseña
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    {...register("currentPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                      errors.currentPassword
                        ? "border-red-500"
                        : "border-slate-300",
                    )}
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-red-500">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                      {...register("newPassword")}
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                        errors.newPassword
                          ? "border-red-500"
                          : "border-slate-300",
                      )}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-slate-300",
                      )}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 font-medium shadow-sm hover:shadow-md"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
