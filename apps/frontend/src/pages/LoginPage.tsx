import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import axios from "axios";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/ui/PageLoader";
import type { LoginResponse, ApiResponse } from "@/types/auth"; // Import types

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
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
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        data,
      );
      login(response.data.data.token, response.data.data.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al iniciar sesión");
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
        {/* Left Column: Visual & Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden animate-in fade-in duration-1000 ease-out">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

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
              <h1 className="text-5xl font-extrabold leading-tight">
                Bienvenido a <span className="text-emerald-400">PsyBook</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed italic">
                "La herramienta definitiva para la gestión clínica moderna.
                Simplifica tu práctica y enfócate en lo que realmente importa:
                tus pacientes."
              </p>
            </div>

            <div className="pt-8 border-t border-white/10 flex items-center gap-4 text-sm text-slate-500 animate-in fade-in slide-in-from-left-8 duration-700 delay-1000 fill-mode-both">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold"
                  >
                    {i === 1 ? "JD" : i === 2 ? "MS" : "RT"}
                  </div>
                ))}
              </div>
              <span>Más de 500 psicólogos confían en nosotros</span>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
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
              <h2 className="text-3xl font-bold text-slate-900">
                Bienvenido de nuevo
              </h2>
              <p className="text-slate-500 mt-2">
                Por favor, ingresa tus credenciales para continuar
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm border border-red-100 flex items-center gap-3 animate-shake">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 outline-none transition-all duration-300",
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Contraseña
                    </label>
                    <a
                      href="#"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <input
                    type="password"
                    {...register("password")}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-2xl border bg-slate-50 outline-none transition-all duration-300",
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
                      "Ingresar al Panel"
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
                ¿Aún no eres parte de PsyBook?{" "}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                  Crea tu cuenta gratis
                </Link>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400">
              &copy; 2026 PsyBook Clinical Systems. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
