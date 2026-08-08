import api from "./axios";
import type {
  MedicalRecord,
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
} from "@/types/medical-records";

export const getMedicalRecordsByPatient = async (
  patientId: string,
): Promise<MedicalRecord[]> => {
  const response = await api.get(`/medical-records/${patientId}`);
  return response.data.data;
};

export const createMedicalRecord = async (
  data: CreateMedicalRecordInput,
): Promise<MedicalRecord> => {
  const formData = new FormData();
  formData.append("patientId", data.patientId);
  formData.append("content", data.content);
  if (data.attachments) {
    data.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  const response = await api.post("/medical-records", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

export const updateMedicalRecord = async (
  id: string,
  data: UpdateMedicalRecordInput,
): Promise<MedicalRecord> => {
  const response = await api.put(`/medical-records/${id}`, data);
  return response.data.data;
};

export const deleteMedicalRecord = async (id: string): Promise<void> => {
  await api.delete(`/medical-records/${id}`);
};
