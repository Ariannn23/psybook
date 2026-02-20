import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, updatePatient } from "@/api/patients";
import type { Patient, UpdatePatientInput } from "@/types/patients";
import PatientForm from "@/components/patients/PatientForm";
import { Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function EditPatientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        const data = await getPatient(id);
        setPatient(data);
      } catch (err) {
        console.error("Failed to fetch patient:", err);
        setError("No se pudo cargar la información del paciente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    setIsSaving(true);
    setError("");
    try {
      // Cast to UpdatePatientInput (dni is now optional in partial)
      await updatePatient(id, data as UpdatePatientInput);
      navigate("/dashboard/patients");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Error al actualizar el paciente",
        );
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!patient && error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => navigate("/dashboard/patients")}
          className="mt-4 text-emerald-600 hover:underline flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
          title="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Editar Paciente
          </h1>
          <p className="text-slate-500 text-sm italic">
            Modifica los datos de {patient?.name}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      <PatientForm
        initialData={{
          name: patient!.name,
          dni: patient!.dni,
          email: patient!.email,
          phone: patient!.phone,
          notes: patient!.notes || "",
        }}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        title="Actualizar Datos"
        description="Actualice la información del contacto y notas médicas."
      />
    </div>
  );
}
