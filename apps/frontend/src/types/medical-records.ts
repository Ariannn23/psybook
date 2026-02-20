export interface MedicalRecord {
  id: string;
  patientId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  user?: {
    id: string;
    name: string;
  };
}

export interface CreateMedicalRecordInput {
  patientId: string;
  content: string;
  attachments?: File[];
}

export interface UpdateMedicalRecordInput {
  content: string;
}
