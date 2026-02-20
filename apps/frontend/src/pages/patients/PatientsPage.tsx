import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "@/api/patients";
import type { Patient } from "@/types/patients";
import { Loader2, Plus, Search, Trash2, Eye, Pencil } from "lucide-react";
import axios from "axios";
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
          <p className="text-slate-500">
            Gestiona los expedientes de tus pacientes
          </p>
        </div>
        <Link
          to="/dashboard/patients/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Paciente
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Nombre</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No se encontraron pacientes.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-900">
                      {patient.name}
                    </td>
                    <td className="p-4">{patient.email}</td>
                    <td className="p-4">{patient.phone}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/dashboard/patients/${patient.id}`}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {/* Edit placeholder */}
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-amber-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
