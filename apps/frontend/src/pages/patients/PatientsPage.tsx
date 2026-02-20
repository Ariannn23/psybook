import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "@/api/patients";
import type { Patient } from "@/types/patients";
import { Loader2, Plus, Search, Trash2, Eye, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      setPatients(patients.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete patient", error);
      alert("Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Pacientes
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona de forma eficiente los expedientes y el historial de tus
            pacientes.
          </p>
        </div>
        <Link
          to="/dashboard/patients/new"
          className="group relative bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-emerald-200 active:scale-95"
        >
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <Plus className="w-5 h-5 relative z-10" />
          <span className="font-bold relative z-10">Agregar Paciente</span>
        </Link>
      </div>

      <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-emerald-50/40">
              <tr className="border-b border-emerald-100/30">
                <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                  Paciente
                </th>
                <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                  Información de Contacto
                </th>
                <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                  Última Sesión
                </th>
                <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50/50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                      <p className="text-slate-400 font-medium">
                        Cargando pacientes...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-slate-400 italic"
                  >
                    No se encontraron resultados para tu búsqueda.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const initials = patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2);
                  const colors = [
                    "bg-emerald-100 text-emerald-700",
                    "bg-blue-100 text-blue-700",
                    "bg-purple-100 text-purple-700",
                    "bg-rose-100 text-rose-700",
                    "bg-amber-100 text-amber-700",
                  ];
                  const colorIndex = patient.name.length % colors.length;

                  return (
                    <tr
                      key={patient.id}
                      className="group hover:bg-slate-50/80 transition-all duration-300 border-b border-emerald-100/50 last:border-0"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform duration-300 group-hover:scale-110",
                              colors[colorIndex],
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                              {patient.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                DNI: {patient.dni}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium italic">
                                ID: #{patient.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                            {patient.phone || "Sin teléfono"}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                          Próximamente
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                          <Link
                            to={`/dashboard/patients/${patient.id}`}
                            className="p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-emerald-100 transition-all"
                            title="Ver Perfil Completo"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/dashboard/patients/edit/${patient.id}`}
                            className="p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-100 hover:shadow-blue-100 transition-all cursor-pointer"
                            title="Editar Datos"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 hover:shadow-red-100 transition-all cursor-pointer"
                            title="Eliminar Registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <p className="text-xs text-slate-400 font-medium">
            Mostrando {filteredPatients.length} pacientes
          </p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              disabled
            >
              Anterior
            </button>
            <button
              className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              disabled
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
