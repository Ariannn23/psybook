import api from "./axios";
import type { ApiResponse } from "@/types/auth";
import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/types/appointments";

export const getAppointments = async () => {
  const { data } = await api.get<ApiResponse<Appointment[]>>("/appointments");
  return data.data ?? [];
};

export const getAppointment = async (id: string) => {
  const { data } = await api.get<ApiResponse<Appointment>>(
    `/appointments/${id}`,
  );
  if (!data.data) throw new Error("Cita no encontrada");
  return data.data;
};

export const createAppointment = async (
  appointment: CreateAppointmentInput,
) => {
  const { data } = await api.post<ApiResponse<Appointment>>(
    "/appointments",
    appointment,
  );
  if (!data.data) throw new Error("No se pudo crear la cita");
  return data.data;
};

export const updateAppointment = async (
  id: string,
  appointment: UpdateAppointmentInput,
) => {
  const { data } = await api.put<ApiResponse<Appointment>>(
    `/appointments/${id}`,
    appointment,
  );
  if (!data.data) throw new Error("No se pudo actualizar la cita");
  return data.data;
};

export const deleteAppointment = async (id: string) => {
  await api.delete<ApiResponse<void>>(`/appointments/${id}`);
};
