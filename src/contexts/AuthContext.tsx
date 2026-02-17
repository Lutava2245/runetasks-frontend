'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser, registerUser } from "../services/userService";
import { LoginRequest, LoginResponse } from "../types/auth";
import { UserResponse, UserCreateRequest } from "../types/user";
import { api } from "../services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AuthContextType = {
  user: UserResponse | null;
  token: string | null;
  loading: boolean | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: UserCreateRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        if (!token) {
          setUser(null);
          return;
        }

        console.log("Tentando resgatar usuário...")
        const response = await getAuthenticatedUser();
        const userResponse = response.data;

        localStorage.setItem("authenticatedUser", JSON.stringify(userResponse));
        setUser(userResponse);

        console.log("Usuário carregado: " + userResponse.nickname);
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.error("Erro ao carregar usuário autenticado:\n", error);
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

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

  const register = async (data: UserCreateRequest) => {
    await registerUser(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("authenticatedUser");
    toast.info(user?.nickname + " saiu")
    router.push('/');
  };

  const refreshUser = async () => {
    try {
      const response = await getAuthenticatedUser();
      setUser(response.data);
      localStorage.setItem("authenticatedUser", JSON.stringify(response.data));
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error("Erro ao carregar avatares", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refreshUser }}
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