import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPatient } from "@/api/patients";
import type { Patient } from "@/types/patients";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MedicalRecordTimeline from "@/components/patients/MedicalRecordTimeline";
import PageLoader from "@/components/ui/PageLoader";

// Función para formatear fecha sin conversión de zona horaria
function formatDateWithoutTimezone(dateString: string): string {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}

// Función para capitalizar la primera letra
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert UTC date string to local Date object without hour shifts for comparison/display
function getLocalDateFromUTC(dateString: string): Date {
  const dateObj = new Date(dateString);
  return new Date(
    dateObj.getUTCFullYear(),
    dateObj.getUTCMonth(),
    dateObj.getUTCDate(),
  );
}

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "general" | "history" | "appointments"
  >("general");
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null,
  );

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
    return <PageLoader fullPage={false} message="Cargando expediente..." />;
  }

  if (!patient) return null;

  return (
    <div className="p-6 space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate("/dashboard/patients")}
          className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-bold text-sm uppercase tracking-widest"
        >
          <div className="p-2 rounded-xl group-hover:bg-emerald-50 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="truncate">Volver a Pacientes</span>
        </button>

        <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Link
            to={`/dashboard/patients/edit/${patient.id}`}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-lg transition-all shadow-sm flex items-center justify-center cursor-pointer shrink-0"
            title="Editar Paciente"
          >
            <Pencil className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Premium Header */}
      <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

        <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Dynamic Avatar */}
          <div
            className={cn(
              "h-32 w-32 rounded-4xl flex items-center justify-center text-4xl font-black shadow-lg shadow-emerald-100 border-4 border-white animate-slide-in",
              "bg-emerald-100 text-emerald-700",
            )}
          >
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)}
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                Expediente Activo
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {patient.name}
              </h1>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center gap-2.5 text-slate-500 font-bold text-sm">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Mail className="w-4 h-4 text-emerald-500" />
                </div>
                {patient.email}
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 font-bold text-sm">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                {patient.phone}
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 font-bold text-sm">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <FileText className="w-4 h-4 text-emerald-500" />
                </div>
                DNI: {patient.dni}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2 pr-4">
            <div className="text-right">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                Desde
              </p>
              <p className="text-slate-900 font-bold">
                {capitalize(
                  new Date(patient.createdAt).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  }),
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="px-8 bg-slate-50/50 border-t border-slate-50">
          <nav className="flex gap-8">
            <TabButton
              active={activeTab === "general"}
              onClick={() => setActiveTab("general")}
              label="General"
              icon={User}
            />
            <TabButton
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              label="Evolución Clínica"
              icon={FileText}
            />
            <TabButton
              active={activeTab === "appointments"}
              onClick={() => setActiveTab("appointments")}
              label="Citas & Horarios"
              icon={Calendar}
            />
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-slide-up">
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                  Información de Registro
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <InfoItem
                    label="Fecha de Creación"
                    value={new Date(patient.createdAt).toLocaleDateString(
                      "es-ES",
                      { day: "2-digit", month: "long", year: "numeric" },
                    )}
                  />
                  <InfoItem label="DNI / Documento" value={patient.dni} />
                  <InfoItem
                    label="Última modificación"
                    value={capitalize(
                      new Date(patient.updatedAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }),
                    )}
                  />
                </div>
              </div>

              <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                  Notas Adicionales
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {patient.notes ||
                    "No hay notas adicionales cargadas para este paciente."}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {(() => {
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Comparar solo fechas

                const nextApt = patient.appointments
                  ?.filter((a) => {
                    if (a.status === "CANCELLED" || a.status === "COMPLETED")
                      return false;
                    const aptDate = getLocalDateFromUTC(a.date);
                    return aptDate >= now;
                  })
                  .sort((a, b) => {
                    const dateA = getLocalDateFromUTC(a.date).getTime();
                    const dateB = getLocalDateFromUTC(b.date).getTime();
                    if (dateA !== dateB) return dateA - dateB;
                    return a.startTime.localeCompare(b.startTime);
                  })[0];

                if (!nextApt) {
                  return (
                    <div className="bg-slate-100 p-8 rounded-4xl text-slate-400 border border-slate-200 text-center">
                      <Calendar className="w-10 h-10 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-sm">No hay citas próximas</p>
                      <button
                        onClick={() => navigate("/dashboard/appointments/new")}
                        className="mt-4 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:text-emerald-700"
                      >
                        Agendar Cita
                      </button>
                    </div>
                  );
                }

                const displayDate = getLocalDateFromUTC(nextApt.date);

                return (
                  <div className="bg-emerald-900 p-8 rounded-4xl text-white shadow-xl shadow-emerald-200 overflow-hidden relative group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      Próxima Sesión
                    </h4>
                    <p className="text-2xl font-black mb-2 flex items-baseline gap-2">
                      <span className="capitalize">
                        {capitalize(
                          displayDate.toLocaleDateString("es-ES", {
                            weekday: "long",
                          }),
                        )}
                        ,
                      </span>
                      <span>
                        {displayDate.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-emerald-100/60 font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      {nextApt.startTime} - {nextApt.endTime}
                    </div>
                    <button
                      onClick={() => setActiveTab("appointments")}
                      className="mt-8 w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest relative z-10"
                    >
                      Ver Detalles
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-8">
            <MedicalRecordTimeline patientId={id!} />
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                Citas Registradas
              </h3>
              <button
                onClick={() => navigate("/dashboard/appointments/new")}
                className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:text-emerald-700 transition-colors bg-emerald-50 px-4 py-2 rounded-xl"
              >
                + Nueva Cita
              </button>
            </div>

            {patient.appointments && patient.appointments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {patient.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="group bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-emerald-600 shadow-sm transition-transform group-hover:scale-110">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
                          apt.status === "CONFIRMED"
                            ? "text-emerald-600 bg-emerald-50 border-emerald-100/30"
                            : apt.status === "COMPLETED"
                              ? "text-blue-600 bg-blue-50 border-blue-100/30"
                              : apt.status === "CANCELLED"
                                ? "text-red-600 bg-red-50 border-red-100/30"
                                : "text-amber-600 bg-amber-50 border-amber-100/30",
                        )}
                      >
                        {apt.status === "CONFIRMED"
                          ? "Confirmada"
                          : apt.status === "COMPLETED"
                            ? "Atendida"
                            : apt.status === "CANCELLED"
                              ? "Cancelada"
                              : "Pendiente"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-black text-slate-900 text-lg uppercase tracking-tight">
                        {formatDateWithoutTimezone(apt.date)}
                      </p>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {apt.startTime} - {apt.endTime}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="mt-6 pt-4 border-t border-slate-200/50 w-full text-left cursor-pointer group/service"
                    >
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/service:text-emerald-500 transition-colors">
                        Servicio
                      </p>
                      <p className="text-emerald-700 font-black text-sm group-hover/service:underline">
                        {apt.service?.name || "Sesión General"}
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50/50 rounded-4xl border border-dashed border-slate-200">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">
                  No hay historial de citas aún.
                </p>
                <button
                  onClick={() => navigate("/dashboard/appointments/new")}
                  className="mt-6 text-emerald-600 font-black text-xs uppercase tracking-widest hover:bg-emerald-50 px-6 py-3 rounded-2xl transition-all border border-emerald-100"
                >
                  Agendar Primera Cita
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal de Detalles de Cita */}
        {selectedAppointment && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedAppointment(null)}
          >
            <div
              className="bg-white rounded-4xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      Detalles de la Cita
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      Resumen
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer group"
                    title="Cerrar"
                  >
                    <X className="w-6 h-6 text-slate-400 group-hover:text-red-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Fecha
                    </p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      {formatDateWithoutTimezone(selectedAppointment.date)}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Horario
                    </p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      {selectedAppointment.startTime} -{" "}
                      {selectedAppointment.endTime}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">
                      Servicio Seleccionado
                    </p>
                    <p className="text-xl font-black text-emerald-900">
                      {selectedAppointment.service?.name || "Consulta General"}
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Estado de la Cita
                    </p>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
                        selectedAppointment.status === "CONFIRMED"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100/30"
                          : selectedAppointment.status === "COMPLETED"
                            ? "text-blue-600 bg-blue-50 border-blue-100/30"
                            : selectedAppointment.status === "CANCELLED"
                              ? "text-red-600 bg-red-50 border-red-100/30"
                              : "text-amber-600 bg-amber-50 border-amber-100/30",
                      )}
                    >
                      {selectedAppointment.status === "CONFIRMED"
                        ? "Confirmada"
                        : selectedAppointment.status === "COMPLETED"
                          ? "Atendida"
                          : selectedAppointment.status === "CANCELLED"
                            ? "Cancelada"
                            : "Pendiente"}
                    </span>
                  </div>

                  {selectedAppointment.reason && (
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Motivo de Consulta
                      </p>
                      <p className="text-slate-600 font-medium leading-relaxed text-sm whitespace-pre-wrap">
                        {selectedAppointment.reason}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.notes && (
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">
                        Notas de Sesión
                      </p>
                      <p className="text-emerald-900 font-medium leading-relaxed text-sm whitespace-pre-wrap">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all cursor-pointer uppercase tracking-widest text-xs shadow-lg shadow-slate-200"
                >
                  Cerrar Detalles
                </button>
              </div>
            </div>
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
