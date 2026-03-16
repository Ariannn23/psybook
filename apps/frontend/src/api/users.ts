import api from "./axios";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PSYCHOLOGIST";
  createdAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/users/profile");
  return response.data.data;
};

export const updateProfile = async (
  data: UpdateProfileInput,
): Promise<UserProfile> => {
  const response = await api.put("/users/profile", data);
  return response.data.data;
};
