import api from "./axios";
import type { ApiResponse } from "@/types/auth";
import type {
  Service,
  CreateServiceInput,
  UpdateServiceInput,
} from "@/types/services";

export const getServices = async () => {
  const { data } = await api.get<ApiResponse<Service[]>>("/services");
  return data.data;
};

export const getService = async (id: string) => {
  const { data } = await api.get<ApiResponse<Service>>(`/services/${id}`);
  return data.data;
};

export const createService = async (service: CreateServiceInput) => {
  const { data } = await api.post<ApiResponse<Service>>("/services", service);
  return data.data;
};

export const updateService = async (
  id: string,
  service: UpdateServiceInput,
) => {
  const { data } = await api.put<ApiResponse<Service>>(
    `/services/${id}`,
    service,
  );
  return data.data;
};

export const deleteService = async (id: string) => {
  const { data } = await api.delete<ApiResponse<void>>(`/services/${id}`);
  return data.data;
};
