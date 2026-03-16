import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppointments, updateAppointment } from "@/api/appointments";
import { createMedicalRecord } from "@/api/medical-records";
import { AppointmentStatus } from "@/types/appointments";
import type { Appointment } from "@/types/appointments";
import SessionConfirmationModal from "@/components/appointments/SessionConfirmationModal";
import {
  Plus,
  Calendar,
  Clock,
  List,
  LayoutGrid,
  Pencil,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Search,
  User,
  Briefcase,
  FileText,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CalendarView from "@/components/appointments/CalendarView";
import WeeklyView from "@/components/appointments/WeeklyView";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import PageLoader from "@/components/ui/PageLoader";
import StatusFilter from "@/components/ui/StatusFilter";
import { logger } from "@/utils/logger";
import axios from "axios";

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

function getDateStringFromISO(dateString: string): string {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function truncateNotes(
  notes: string | null | undefined,
  maxLength: number = 50,
): string {
  if (!notes) return "-";
  if (notes.length > maxLength) {
    return notes.substring(0, maxLength) + "...";
  }
  return notes;
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "weekly">(
    "list",
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionToConfirm, setSessionToConfirm] = useState<Appointment | null>(
    null,
  );
  const itemsPerPage = 10;

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      logger.error("Failed to fetch appointments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patient?.name?.toLowerCase().includes(query) ||
          apt.patient?.email?.toLowerCase().includes(query) ||
          apt.service?.name?.toLowerCase().includes(query),
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, searchQuery]);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      const updated = await updateAppointment(id, { status });
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? updated : apt)),
      );
    } catch (error) {
      logger.error("Failed to update status", error);
    }
  };

  const handleFinishSession = async (notes: string, scheduleNext: boolean) => {
    if (!sessionToConfirm) return;

    try {
      const updatedApt = await updateAppointment(sessionToConfirm.id, {
        status: AppointmentStatus.COMPLETED,
        notes: notes.trim() || undefined,
      });

      if (notes.trim()) {
        await createMedicalRecord({
          patientId: sessionToConfirm.patientId,
          content: notes,
        });
      }

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === sessionToConfirm.id ? updatedApt : apt)),
      );

      setSessionToConfirm(null);

      if (scheduleNext) {
        navigate(
          `/dashboard/appointments/new?patientId=${sessionToConfirm.patientId}`,
        );
      }
    } catch (error) {
      logger.error("Failed to finish session", error);
    }
  };

  const onUpdateSubmit = async (data: Record<string, unknown>) => {
    if (!editingAppointment) return;
    try {
      const updated = await updateAppointment(editingAppointment.id, data);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === editingAppointment.id ? updated : apt)),
      );
      setIsModalOpen(false);
      setEditingAppointment(null);
    } catch (error: unknown) {
      logger.error("Failed to update appointment", error);
      const msg = (() => {
        if (!axios.isAxiosError(error)) return undefined;
        const data = error.response?.data;
        if (!data || typeof data !== "object") return undefined;
        if (!("message" in data)) return undefined;
        const maybeMessage = (data as { message?: unknown }).message;
        return typeof maybeMessage === "string" ? maybeMessage : undefined;
      })();
      setUpdateError(msg ?? "Error al actualizar la cita");
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setUpdateError(null);
    setIsModalOpen(true);
  };

  const handleView = (appointment: Appointment) => {
    setViewingAppointment(appointment);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setUpdateError(null);
  };

  const closeViewModal = () => {
    setViewingAppointment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600 bg-green-50";
      case "COMPLETED":
        return "text-blue-600 bg-blue-50";
      case "CANCELLED":
        return "text-red-600 bg-red-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Citas
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona de forma eficiente tu agenda y las sesiones de tus
            pacientes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest",
                viewMode === "list"
                  ? "bg-white text-emerald-600 shadow-md"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={cn(
                "px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest",
                viewMode === "weekly"
                  ? "bg-white text-emerald-600 shadow-md"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Semanal</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest",
                viewMode === "calendar"
                  ? "bg-white text-emerald-600 shadow-md"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Mensual</span>
            </button>
          </div>

          <Link
            to="/dashboard/appointments/new"
            className="group relative bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-emerald-200 active:scale-95"
          >
            <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <Plus className="w-5 h-5 relative z-10" />
            <span className="font-bold relative z-10">Nueva Cita</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {(viewMode === "list" || viewMode === "calendar") && (
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar por paciente o servicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <StatusFilter
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "Todos los estados" },
                  { value: "PENDING", label: "Pendientes" },
                  { value: "CONFIRMED", label: "Confirmadas" },
                  { value: "COMPLETED", label: "Atendidas" },
                  { value: "CANCELLED", label: "Canceladas" },
                ]}
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <PageLoader fullPage={false} message="Cargando agenda..." />
        ) : viewMode === "calendar" ? (
          <div className="p-6">
            <CalendarView appointments={filteredAppointments} />
          </div>
        ) : viewMode === "weekly" ? (
          <div className="p-6">
            <WeeklyView appointments={appointments} />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
              <Calendar className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Sin citas programadas
            </h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "No hay resultados para los filtros aplicados en este momento."
                : "Aún no se han agendado citas para este periodo."}
            </p>
          </div>
        ) : (
          <>
            {viewMode === "list" ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-emerald-100/60 overflow-hidden">
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse min-w-[800px]">
                      <thead className="bg-emerald-50/40">
                        <tr className="border-b border-emerald-100/30 uppercase tracking-widest text-[10px] text-slate-400 font-bold">
                          <th className="p-6">Fecha y Horario</th>
                          <th className="p-6">Paciente</th>
                          <th className="p-6">Servicio</th>
                          <th className="p-6">Estado</th>
                          <th className="p-6 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-50/50">
                        {filteredAppointments
                          .slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage,
                          )
                          .map((apt) => {
                            const patientName =
                              apt.patient?.name || "Paciente Desconocido";
                            const initials = patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .substring(0, 2);
                            const avatarColors = [
                              "bg-emerald-100 text-emerald-700",
                              "bg-blue-100 text-blue-700",
                              "bg-purple-100 text-purple-700",
                              "bg-rose-100 text-rose-700",
                              "bg-amber-100 text-amber-700",
                            ];
                            const avatarColor =
                              avatarColors[
                                patientName.length % avatarColors.length
                              ];

                            return (
                              <tr
                                key={apt.id}
                                className="group hover:bg-slate-50/80 transition-all duration-300 border-b border-emerald-100/50 last:border-0"
                              >
                                <td className="p-6">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2 font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                      {formatDateWithoutTimezone(apt.date)}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 font-medium bg-slate-100 rounded-lg px-2 py-1 w-fit">
                                      <Clock className="w-3 h-3 text-emerald-500" />
                                      {apt.startTime} - {apt.endTime}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-6">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform duration-300 group-hover:scale-110",
                                        avatarColor,
                                      )}
                                    >
                                      {initials}
                                    </div>
                                    <span className="font-semibold text-slate-800 leading-tight">
                                      {patientName}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-6">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 text-xs uppercase tracking-tight">
                                      {apt.service?.name ||
                                        "Servicio Desconocido"}
                                    </span>
                                    {apt.notes && (
                                      <span className="text-[10px] text-slate-400 mt-1 italic line-clamp-1 max-w-[150px]">
                                        "{truncateNotes(apt.notes, 30)}"
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-6 text-sm font-bold">
                                  <div className="mt-1">
                                    <span
                                      className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-semibold border-2 shadow-sm inline-block uppercase tracking-widest",
                                        getStatusColor(apt.status)
                                          .replace("bg-", "border-")
                                          .replace(
                                            "border-",
                                            "border-opacity-30 border-",
                                          )
                                          .replace("text-", "text-") +
                                          " " +
                                          getStatusColor(apt.status),
                                      )}
                                    >
                                      {apt.status ===
                                      AppointmentStatus.CONFIRMED
                                        ? "Confirmada"
                                        : apt.status ===
                                            AppointmentStatus.COMPLETED
                                          ? "Atendida"
                                          : apt.status ===
                                              AppointmentStatus.CANCELLED
                                            ? "Cancelada"
                                            : "Pendiente"}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-6 text-right">
                                  <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-4 md:group-hover:translate-x-0">
                                    <button
                                      onClick={() => handleView(apt)}
                                      title="Ver Detalles"
                                      className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-emerald-100 transition-all cursor-pointer"
                                      type="button"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    {apt.status !==
                                      AppointmentStatus.CANCELLED &&
                                      apt.status !==
                                        AppointmentStatus.COMPLETED && (
                                        <>
                                          <button
                                            onClick={() =>
                                              setSessionToConfirm(apt)
                                            }
                                            title="Finalizar y Atender"
                                            className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-xl text-blue-500 hover:text-blue-600 hover:border-blue-100 hover:shadow-blue-100 transition-all cursor-pointer"
                                            type="button"
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleEdit(apt)}
                                            title="Editar Cita"
                                            className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-200 hover:shadow-slate-100 transition-all cursor-pointer"
                                            type="button"
                                          >
                                            <Pencil className="w-4 h-4" />
                                          </button>
                                        </>
                                      )}
                                    {apt.status !==
                                      AppointmentStatus.CANCELLED && (
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            apt.id,
                                            AppointmentStatus.CANCELLED,
                                          )
                                        }
                                        title="Cancelar Cita"
                                        className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-xl text-red-500 hover:text-red-600 hover:border-red-100 hover:shadow-red-100 transition-all cursor-pointer"
                                        type="button"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl shadow border border-slate-200 border-t-0">
                  <div className="text-sm text-slate-600">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredAppointments.length,
                    )}{" "}
                    de {filteredAppointments.length} citas
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                      Anterior
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({
                        length: Math.ceil(
                          filteredAppointments.length / itemsPerPage,
                        ),
                      }).map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={cn(
                            "w-8 h-8 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
                            currentPage === index + 1
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                              : "text-slate-700 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200",
                          )}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            Math.ceil(
                              filteredAppointments.length / itemsPerPage,
                            ),
                            prev + 1,
                          ),
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredAppointments.length / itemsPerPage)
                      }
                      className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                <CalendarView appointments={appointments} />
              </div>
            )}
          </>
        )}
      </div>

      {viewingAppointment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in text-slate-600">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-slide-in">
            <div className="bg-slate-50/50 p-6 border-b border-slate-100 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Detalles de la Cita
                    </h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                      Información de la sesión
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeViewModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        Fecha
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {formatDateWithoutTimezone(viewingAppointment.date)}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        Horario
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {viewingAppointment.startTime} -{" "}
                      {viewingAppointment.endTime}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="group">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          Paciente
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-slate-800 leading-tight">
                        {viewingAppointment.patient?.name ||
                          "Paciente Desconocido"}
                      </p>
                      {viewingAppointment.patient?.email && (
                        <p className="text-sm text-slate-500 mt-1 truncate">
                          {viewingAppointment.patient.email}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          Servicio
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-slate-800 leading-tight">
                        {viewingAppointment.service?.name ||
                          "Servicio Desconocido"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          ${viewingAppointment.service?.price || 0} USD
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-500">
                          {viewingAppointment.service?.duration || 0} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          Estado
                        </span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm inline-block",
                            getStatusColor(viewingAppointment.status)
                              .replace("bg-", "border-")
                              .replace("border-", "border-opacity-30 border-")
                              .replace("text-", "text-") +
                              " " +
                              getStatusColor(viewingAppointment.status),
                          )}
                        >
                          {viewingAppointment.status === "CONFIRMED"
                            ? "CONFIRMADA"
                            : viewingAppointment.status === "COMPLETED"
                              ? "ATENDIDA"
                              : viewingAppointment.status === "CANCELLED"
                                ? "CANCELADA"
                                : "PENDIENTE"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          Observaciones
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed min-h-[80px]">
                        {viewingAppointment.notes ||
                          "No hay notas adicionales."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 flex justify-end">
              <button
                onClick={closeViewModal}
                className="w-full sm:w-auto px-10 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-100 active:scale-95 cursor-pointer uppercase text-xs tracking-widest"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <AppointmentForm
              onSubmit={onUpdateSubmit}
              externalError={updateError}
              onCancel={closeModal}
              initialData={{
                patientId: editingAppointment.patientId,
                serviceId: editingAppointment.serviceId,
                date: getDateStringFromISO(editingAppointment.date),
                startTime: editingAppointment.startTime,
                endTime: editingAppointment.endTime,
                notes: editingAppointment.notes || "",
              }}
            />
          </div>
        </div>
      )}
      {sessionToConfirm && (
        <SessionConfirmationModal
          appointment={sessionToConfirm}
          onConfirm={handleFinishSession}
          onCancel={() => setSessionToConfirm(null)}
        />
      )}
    </div>
  );
}
