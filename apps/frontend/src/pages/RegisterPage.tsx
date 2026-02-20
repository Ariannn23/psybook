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
import type { ApiResponse } from "@/types/auth"; // Import types

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
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      // Register usually returns 201. Does it return the token?
      // Based on auth.controller.ts (which implies structure), let's see.
      // Actually backend controller register usually returns just "success" or maybe user data.
      // If it doesn't return token, we might need to login after.
      // Let's assume it DOES NOT log in automatically unless backend supports it.
      // If backend simple sends 201 Created, we redirect to login.

      await api.post<ApiResponse<any>>("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "PSYCHOLOGIST", // Default role
      });

      // If successful, maybe auto-login? Or redirect.
      // Since we don't know if register returns token, let's redirect to login with a message?
      // Or try to login immediately.
      // Let's just redirect to login for safety.
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
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
          Crear Cuenta
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              {...register("name")}
              className={cn(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                "bg-white border-slate-300 text-slate-900",
                errors.name ? "border-red-500 focus:ring-red-500" : "",
              )}
              placeholder="Dr. Juan Pérez"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className={cn(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                "bg-white border-slate-300 text-slate-900",
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "",
              )}
              placeholder="••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
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
              "Registrarse"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-emerald-600 hover:underline font-medium"
          >
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
