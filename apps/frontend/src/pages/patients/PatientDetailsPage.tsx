import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient } from "@/api/patients";
import type { Patient } from "@/types/patients";
import {
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MedicalRecordTimeline from "@/components/patients/MedicalRecordTimeline";

// Función para formatear fecha sin conversión de zona horaria
function formatDateWithoutTimezone(dateString: string): string {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${year}-${month}-${day}T00:00:00`));
}

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "general" | "history" | "appointments"
  >("general");

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        const data = await getPatient(id);
        setPatient(data);
      } catch (error) {
        console.error("Failed to fetch patient", error);
        navigate("/dashboard/patients");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/dashboard/patients")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Pacientes
      </button>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
        <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl font-bold">
          {patient.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {patient.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {patient.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4">
          <TabButton
            active={activeTab === "general"}
            onClick={() => setActiveTab("general")}
            label="Información General"
            icon={User}
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            label="Historia Clínica"
            icon={FileText}
          />
          <TabButton
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
            label="Citas"
            icon={Calendar}
          />
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[300px]">
        {activeTab === "general" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="Registrado"
                value={new Date(patient.createdAt).toLocaleDateString("es-ES")}
              />
              <InfoItem
                label="Última Actualización"
                value={new Date(patient.updatedAt).toLocaleDateString("es-ES")}
              />
            </div>
          </div>
        )}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Antecedentes (Estático)
              </h4>
              {patient.notes ? (
                <p className="text-slate-600 text-sm whitespace-pre-wrap">
                  {patient.notes}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic">
                  Sin antecedentes registrados.
                </p>
              )}
            </div>

            <MedicalRecordTimeline patientId={id!} />
          </div>
        )}
        {activeTab === "appointments" && (
          <div>
            {patient.appointments && patient.appointments.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {patient.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {formatDateWithoutTimezone(apt.date)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {apt.startTime} - {apt.endTime}
                        </p>
                        <p className="text-sm font-medium text-emerald-600">
                          {apt.service?.name || "Servicio"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          apt.status === "CONFIRMED"
                            ? "text-green-600 bg-green-50"
                            : apt.status === "COMPLETED"
                              ? "text-blue-600 bg-blue-50"
                              : apt.status === "CANCELLED"
                                ? "text-red-600 bg-red-50"
                                : "text-amber-600 bg-amber-50",
                        )}
                      >
                        {apt.status === "CONFIRMED"
                          ? "Confirmada"
                          : apt.status === "COMPLETED"
                            ? "Completada"
                            : apt.status === "CANCELLED"
                              ? "Cancelada"
                              : "Pendiente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay citas encontradas.</p>
                <button
                  onClick={() => navigate("/dashboard/appointments/new")}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Agendar Cita
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: any;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
        active
          ? "border-emerald-500 text-emerald-600"
          : "border-transparent text-slate-500 hover:text-slate-700",
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}
