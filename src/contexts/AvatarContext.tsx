'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { getAllAvatars } from "../services/storeService";
import type { AvatarResponse } from "../types/avatar";

interface AvatarContextType {
  avatars: AvatarResponse[];
  refreshAvatars: () => Promise<void>;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatars, setAvatars] = useState<AvatarResponse[]>([]);

  useEffect(() => {
    refreshAvatars();
  }, []);

  const refreshAvatars = async () => {
    try {
      const response = await getAllAvatars();
      setAvatars(response.data);
    } catch (error) {
      console.error("Erro ao carregar avatares", error);
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
