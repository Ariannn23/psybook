import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
      navigate("/dashboard"); // Or wherever
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">
          {" "}
          Iniciar Sesión{" "}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              {...register("email")}
              className={cn(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                "bg-white border-slate-300 text-slate-900",
                errors.email ? "border-red-500 focus:ring-red-500" : "",
              )}
              placeholder="doctor@ejemplo.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password")}
              className={cn(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                "bg-white border-slate-300 text-slate-900",
                errors.password ? "border-red-500 focus:ring-red-500" : "",
              )}
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-emerald-600 hover:underline font-medium"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
