import { useNavigate } from "react-router-dom";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { createAppointment } from "@/api/appointments";
import { useState } from "react";
import axios from "axios";
import { useNotificationContext } from "@/context/NotificationContext";
import { getPatient } from "@/api/patients";
import type { CreateAppointmentInput } from "@/types/appointments";

export default function AddAppointmentPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: CreateAppointmentInput) => {
    setIsLoading(true);
    setError("");
    try {
      // Now data includes serviceId from form
      await createAppointment(data);
      
      // Obtener el nombre del paciente para la notificación
      try {
        const patient = await getPatient(data.patientId);
        addNotification(
          `Cita enviada a ${patient.name}`,
          "success"
        );
      } catch (err) {
        // Si falla obtener el paciente, usar notificación genérica
        addNotification(
          "Cita creada exitosamente",
          "success"
        );
      }
      
      navigate("/dashboard/appointments");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create appointment");
        addNotification(
          err.response?.data?.message || "Error al crear la cita",
          "error"
        );
      } else {
        setError("An unexpected error occurred");
        addNotification("Error inesperado al crear la cita", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Programar cita</h1>
        <p className="text-slate-500">Crear una nueva cita para un paciente</p>
      </div>

      <AppointmentForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        externalError={error}
      />
    </div>
  );
}
