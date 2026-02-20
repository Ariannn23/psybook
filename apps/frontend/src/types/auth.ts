export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
