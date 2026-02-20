import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/api/axios";
import type { User, ApiResponse } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState(true);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Verify token and get user data
          // Assuming backend has /auth/me endpoint. If not, we might need to rely on stored user or just token validity.
          // For now, let's assume we decode token or fetch profile.
          // Since we didn't implement /auth/me yet in backend (Wait, did we?), let's check.
          // Step 12 checklist says "Documentar todos los endpoints".
          // If /auth/me is missing, we should implement it or store user in localStorage on login.
          // Let's fetch from /auth/me if possible.

          // Actually, let's try to fetch user. If it fails, logout.
          const { data } = await api.get<ApiResponse<User>>("/auth/me");
          setUser(data.data);
        } catch (error) {
          console.error("Session expired", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
