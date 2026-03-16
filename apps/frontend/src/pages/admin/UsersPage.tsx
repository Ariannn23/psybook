import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Shield,
  Calendar,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import api from "@/api/axios";
import PageLoader from "@/components/ui/PageLoader";
import { logger } from "@/utils/logger";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PSYCHOLOGIST";
  createdAt: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/users");
      setUsers(response.data.data);
    } catch (err: unknown) {
      logger.error("Failed to fetch users", err);
      const msg = (() => {
        if (!axios.isAxiosError(err)) return undefined;
        const data = err.response?.data;
        if (!data || typeof data !== "object") return undefined;
        if (!("message" in data)) return undefined;
        const maybeMessage = (data as { message?: unknown }).message;
        return typeof maybeMessage === "string" ? maybeMessage : undefined;
      })();
      setError(msg ?? "Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      const msg = (() => {
        if (!axios.isAxiosError(err)) return undefined;
        const data = err.response?.data;
        if (!data || typeof data !== "object") return undefined;
        if (!("message" in data)) return undefined;
        const maybeMessage = (data as { message?: unknown }).message;
        return typeof maybeMessage === "string" ? maybeMessage : undefined;
      })();
      alert(msg ?? "Error al eliminar usuario");
    }
  };

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Acceso Denegado</h3>
            <p className="text-sm text-red-600">
              Solo los administradores pueden acceder a esta página.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader fullPage={false} message="Cargando usuarios..." />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Gestión de Usuarios
        </h1>
        <p className="text-slate-500">Administra los usuarios del sistema</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No hay usuarios registrados</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {user.name}
                          </p>
                          {user.id === currentUser?.id && (
                            <span className="text-xs text-emerald-600">
                              (Tú)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700",
                        )}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role === "ADMIN" ? "Administrador" : "Psicólogo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-sm text-slate-600">
          <strong>Total de usuarios:</strong> {users.length}
        </p>
        <p className="text-sm text-slate-600 mt-1">
          <strong>Administradores:</strong>{" "}
          {users.filter((u) => u.role === "ADMIN").length} |{" "}
          <strong>Psicólogos:</strong>{" "}
          {users.filter((u) => u.role === "PSYCHOLOGIST").length}
        </p>
      </div>
    </div>
  );
}
