import api from "./axios";
import type { ApiResponse } from "@/types/auth";
import type {
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
} from "@/types/patients";

export const getPatients = async () => {
  const { data } = await api.get<ApiResponse<Patient[]>>("/patients");
  return data.data;
};

export const getPatient = async (id: string) => {
  const { data } = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
  return data.data;
};

export const createPatient = async (patient: CreatePatientInput) => {
  const { data } = await api.post<ApiResponse<Patient>>("/patients", patient);
  return data.data;
};

export const updatePatient = async (
  id: string,
  patient: UpdatePatientInput,
) => {
  const { data } = await api.put<ApiResponse<Patient>>(
    `/patients/${id}`,
    patient,
  );
  return data.data;
};

export const deletePatient = async (id: string) => {
  const { data } = await api.delete<ApiResponse<void>>(`/patients/${id}`);
  return data.data;
};
