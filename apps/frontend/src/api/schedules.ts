import api from "./axios";
import type { Schedule, CreateScheduleInput } from "@/types/schedules";

export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await api.get("/schedules");
  return response.data;
};

export const createSchedule = async (
  data: CreateScheduleInput,
): Promise<Schedule> => {
  const response = await api.post("/schedules", data);
  return response.data.data;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await api.delete(`/schedules/${id}`);
};

export const updateSchedule = async (
  id: string,
  data: CreateScheduleInput,
): Promise<Schedule> => {
  const response = await api.patch(`/schedules/${id}`, data);
  return response.data.data;
};
