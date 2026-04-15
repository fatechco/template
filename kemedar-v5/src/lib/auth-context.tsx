"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { apiClient } from "./api-client";

interface User {
  id: string;
  email: string;
  name: string | null;
  nameAr: string | null;
  role: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await apiClient.get<User>("/api/auth/session");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    const result = await apiClient.post<{ user: User; token: string }>("/api/auth/login", { email, password });
    localStorage.setItem("auth-token", result.token);
    setUser(result.user);
  };

  const register = async (data: Record<string, string>) => {
    const result = await apiClient.post<{ user: User; token: string }>("/api/auth/register", data);
    localStorage.setItem("auth-token", result.token);
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setUser(null);
    document.cookie = "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
