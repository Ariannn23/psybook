export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  isActive?: boolean;
}
