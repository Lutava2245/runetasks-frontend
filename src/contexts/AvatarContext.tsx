'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { getAllAvatars } from "../services/storeService";
import type { AvatarResponse } from "../types/avatar";
import { useAuth } from "./AuthContext";

interface AvatarContextType {
  avatars: AvatarResponse[];
  refreshAvatars: () => Promise<void>;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatars, setAvatars] = useState<AvatarResponse[]>([]);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      refreshAvatars();
    }
  }, []);

  const refreshAvatars = async () => {
    try {
      const response = await getAllAvatars();
      setAvatars(response.data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error("Erro ao carregar avatares", error);
      }
    }
  };

  return (
    <AvatarContext.Provider value={{ avatars, refreshAvatars }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatars = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatars precisa estar dentro de <AvatarProvider>");
  return ctx;
};
