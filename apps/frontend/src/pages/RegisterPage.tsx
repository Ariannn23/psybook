import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/ui/PageLoader";
import type { ApiResponse } from "@/types/auth"; // Import types
import { useEffect } from "react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post<ApiResponse<unknown>>("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "PSYCHOLOGIST",
      });
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al registrarse");
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isPageLoading && <PageLoader />}
      <div className="min-h-screen flex bg-white animate-fade-in">
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden animate-in fade-in duration-1000 ease-out">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -ml-64 -mt-64 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -mr-32 -mb-32"></div>

          <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-8 duration-700 delay-500 fill-mode-both">
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 backdrop-blur-md">
                <img
                  src="/icono_psybook.png"
                  alt="PsyBook Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">PsyBook</h2>
            </div>

            <div className="space-y-6 max-w-md animate-in fade-in slide-in-from-left-8 duration-700 delay-700 fill-mode-both">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                Únete a la comunidad
              </div>
              <h1 className="text-5xl font-extrabold leading-tight">
                Lleva tu clínica al{" "}
                <span className="text-emerald-400">siguiente nivel</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                Crea tu cuenta hoy y descubre por qué PsyBook es la plataforma
                preferida por los profesionales de la salud mental.
              </p>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-1000 fill-mode-both">
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-sm">
                <p className="text-sm italic text-slate-300">
                  "El proceso de registro fue increíblemente rápido. En menos de
                  2 minutos ya estaba configurando mis servicios."
                </p>
                <p className="mt-3 text-xs font-bold text-emerald-400">
                  — Dr. Alejandro Castro
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
          <div className="w-full max-w-md space-y-8 animate-slide-in">
            <div className="text-center lg:text-left">
              <div className="lg:hidden flex justify-center mb-6">
                <img
                  src="/icono_psybook.png"
                  alt="Logo"
                  className="w-12 h-12"
                />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Empecemos</h2>
              <p className="text-slate-500 mt-2">
                Crea tu cuenta profesional en PsyBook
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm border border-red-100 flex items-center gap-3 animate-shake">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className={cn(
                      "w-full px-5 py-3 rounded-2xl border bg-slate-50 outline-none transition-all duration-300",
                      "border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
                      errors.name
                        ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                        : "",
                    )}
                    placeholder="Juan Pérez"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={cn(
                      "w-full px-5 py-3 rounded-2xl border bg-slate-50 outline-none transition-all duration-300",
                      "border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
                      errors.email
                        ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                        : "",
                    )}
                    placeholder="doctor@psybook.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      {...register("password")}
                      className={cn(
                        "w-full px-5 py-3 rounded-2xl border bg-slate-50 outline-none transition-all duration-300",
                        "border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
                        errors.password
                          ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                          : "",
                      )}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 ml-2 font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                      Confirmar
                    </label>
                    <input
                      type="password"
                      {...register("confirmPassword")}
                      className={cn(
                        "w-full px-5 py-3 rounded-2xl border bg-slate-50 outline-none transition-all duration-300",
                        "border-slate-200 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                          : "",
                      )}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 ml-2 font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden group bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Crear mi Cuenta"
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
                ¿Ya tienes una cuenta registrada?{" "}
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                  Inicia Sesión
                </Link>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400">
              Al registrarte, aceptas nuestros **Términos de Servicio** y
              **Política de Privacidad**.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
