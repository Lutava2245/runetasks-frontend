'use client';

import { createContext, useContext, useState } from "react";
import { getAuthenticatedUser } from "../services/userService";
import { LoginRequest, LoginResponse } from "../types/auth";
import { UserResponse } from "../types/user";
import { api } from "../services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: UserResponse | null;
  token: string | null;
  loading: boolean | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("token");
    }
    return null;
  });

  const {
    data: user = null,
    isLoading: userLoading
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        console.log("Tentando resgatar usuário...")
        const response = await getAuthenticatedUser();
        const userResponse = response.data;
        console.log("Usuário carregado: " + userResponse.nickname);
        return response.data
      } catch (error: any) {
        if (error.response?.status !== 401) {
          logout();
        }
        throw error;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const login = async ({ username, password }: LoginRequest) => {
    const response = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });

    const jwtToken = response.data.jwtToken;
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    router.push('/dashboard');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("authenticatedUser");
    queryClient.clear();
    toast.info("Você saiu")
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: userLoading,
        login,
        logout,
        refreshUser: () => { queryClient.invalidateQueries({ queryKey: ['user'] }) }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("UseAuth precisa estar dentro de <AuthProvider>");
  return ctx;
};