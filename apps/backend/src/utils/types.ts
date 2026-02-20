import { Role } from "@prisma/client";

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}
