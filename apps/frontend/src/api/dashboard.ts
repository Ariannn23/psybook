import api from "./axios";

export interface DashboardStats {
  stats: {
    patients: number;
    appointments: number;
    completed: number;
    pending: number;
    trend: number;
  };
  nextAppointments: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    patient: {
      id: string;
      name: string;
    };
  }[];
  charts: {
    byStatus: Array<{
      status: string;
      count: number;
    }>;
    byDay: Array<{
      day: number;
      dayName: string;
      count: number;
    }>;
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");
  return response.data.data;
};
