export interface Schedule {
  id: string;
  userId: string;
  day: number; // 0=Sunday, 1=Monday...
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  createdAt: string;
}

export interface CreateScheduleInput {
  day: number;
  startTime: string;
  endTime: string;
}
