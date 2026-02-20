import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "@/api/appointments";
import type { Appointment } from "@/types/appointments";
import {
  Loader2,
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
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CalendarView from "@/components/appointments/CalendarView";
import WeeklyView from "@/components/appointments/WeeklyView";
import AppointmentForm from "@/components/appointments/AppointmentForm";

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

// Función para extraer fecha en formato YYYY-MM-DD desde ISO string
function getDateStringFromISO(dateString: string): string {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Función para truncar notas
function truncateNotes(notes: string | null | undefined, maxLength: number = 50): string {
  if (!notes) return "-";
  if (notes.length > maxLength) {
    return notes.substring(0, maxLength) + "...";
  }
  return notes;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "weekly">("list");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = 
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patient?.name?.toLowerCase().includes(query) ||
          apt.patient?.email?.toLowerCase().includes(query) ||
          apt.service?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, searchQuery]);

  const handleStatusChange = async (
    id: string,
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  ) => {
    try {
      const updated = await updateAppointment(id, { status });
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? updated : apt)),
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };


  const onUpdateSubmit = async (data: any) => {
    if (!editingAppointment) return;
    try {
      const updated = await updateAppointment(editingAppointment.id, data);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === editingAppointment.id ? updated : apt)),
      );
      setIsModalOpen(false);
      setEditingAppointment(null);
    } catch (error: any) {
      console.error("Failed to update appointment", error);
      // We need a way to pass this error to the form, but the form is inside the modal.
      // For now, let's just alert or log it, as the modal might close or we need state.
      // Better: Add error state to this component and pass it to AppointmentForm.
      setUpdateError(
        error.response?.data?.message || "Error al actualizar la cita",
      );
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Citas</h1>
          <p className="text-slate-500">Gestiona tu agenda</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
                viewMode === "list"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={cn(
                "p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
                viewMode === "weekly"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Semanal</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
                viewMode === "calendar"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Mensual</span>
            </button>
          </div>

          <Link
            to="/dashboard/appointments/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Cita</span>
            <span className="sm:hidden">Nueva</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      {(viewMode === "list" || viewMode === "calendar") && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por paciente, email o servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl shadow border border-slate-200 p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : viewMode === "calendar" ? (
        <CalendarView appointments={filteredAppointments} />
      ) : viewMode === "weekly" ? (
        <WeeklyView appointments={appointments} />
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-slate-200 p-12 text-center text-slate-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No hay citas</h3>
          <p>
            {searchQuery || statusFilter !== "all"
              ? "No se encontraron citas con los filtros aplicados."
              : "No tienes citas programadas todavía."}
          </p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Fecha y Hora</th>
                        <th className="p-4">Paciente</th>
                        <th className="p-4">Servicio</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Notas</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredAppointments
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((apt) => (
                      <tr
                        key={apt.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 font-medium text-slate-900">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {formatDateWithoutTimezone(apt.date)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <Clock className="w-3 h-3" />
                              {apt.startTime} - {apt.endTime}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          {apt.patient?.name || "Paciente Desconocido"}
                        </td>
                        <td className="p-4">
                          {apt.service?.name || "Servicio Desconocido"}
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              getStatusColor(apt.status)
                                .replace("bg-", "border-")
                                .replace("text-", "text-") +
                                " " +
                                getStatusColor(apt.status),
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
                        </td>
                        <td className="p-4 max-w-xs text-slate-500">
                          <span title={apt.notes || ""}>
                            {truncateNotes(apt.notes, 50)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(apt)}
                              title="Ver Cita"
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {apt.status !== "CANCELLED" &&
                              apt.status !== "COMPLETED" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(apt.id, "COMPLETED")
                                    }
                                    title="Marcar como Atendido"
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(apt)}
                                    title="Editar Cita"
                                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            {apt.status !== "CANCELLED" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(apt.id, "CANCELLED")
                                }
                                title="Cancelar Cita"
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl shadow border border-slate-200 border-t-0">
              <div className="text-sm text-slate-600">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} de{" "}
                {filteredAppointments.length} citas
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({
                    length: Math.ceil(filteredAppointments.length / itemsPerPage),
                  }).map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={cn(
                        "w-8 h-8 text-sm font-medium rounded-lg transition-colors",
                        currentPage === index + 1
                          ? "bg-emerald-600 text-white"
                          : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
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
                        Math.ceil(filteredAppointments.length / itemsPerPage),
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(filteredAppointments.length / itemsPerPage)
                  }
                  className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
          ) : (
            <CalendarView appointments={appointments} />
          )}
        </>
      )}

      {/* View Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                  Detalles de la Cita
                </h2>
                <button
                  onClick={closeViewModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Fecha
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatDateWithoutTimezone(viewingAppointment.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Hora
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {viewingAppointment.startTime} - {viewingAppointment.endTime}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Paciente
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {viewingAppointment.patient?.name || "Paciente Desconocido"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Servicio
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {viewingAppointment.service?.name || "Servicio Desconocido"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Estado
                </p>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium border inline-block",
                    getStatusColor(viewingAppointment.status)
                      .replace("bg-", "border-")
                      .replace("text-", "text-") +
                      " " +
                      getStatusColor(viewingAppointment.status),
                  )}
                >
                  {viewingAppointment.status === "CONFIRMED"
                    ? "Confirmada"
                    : viewingAppointment.status === "COMPLETED"
                      ? "Completada"
                      : viewingAppointment.status === "CANCELLED"
                        ? "Cancelada"
                        : "Pendiente"}
                </span>
              </div>

              {viewingAppointment.notes && (
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">
                    Notas
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {viewingAppointment.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-slate-50 text-right">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
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
    </div>
  );
}
