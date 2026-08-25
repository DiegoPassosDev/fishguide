"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { UpdateProfileDto, User } from "@/types/auth";
import * as authApi from "@/lib/auth.api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateProfileDto) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .getProfile()
      .then((profile) => {
        setUser(profile);
        setToken("cookie");
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setToken("cookie");
    setUser(response.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });
    setToken("cookie");
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (data: UpdateProfileDto) => {
    const updated = await authApi.updateProfile(data);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
