'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { getAllSkillsByUser } from "@/src/services/skillService";
import type { SkillResponse } from "@/src/types/skill";
import { useAuth } from "./AuthContext";

interface SkillContextType {
  skills: SkillResponse[];
  refreshSkills: () => Promise<void>;
}

const SkillContext = createContext<SkillContextType | null>(null);

export const SkillProvider = ({ children }: { children: React.ReactNode }) => {
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      refreshSkills();
    }
  }, []);

  const refreshSkills = async () => {
    if (user) {
      try {
        const response = await getAllSkillsByUser(user.id);
        setSkills(response.data);
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.error("Erro ao carregar habilidades", error);
        }
      }
    }
  };

  return (
    <SkillContext.Provider value={{ skills, refreshSkills }}>
      {children}
    </SkillContext.Provider>
  );
};

export const useSkills = () => {
  const ctx = useContext(SkillContext);
  if (!ctx) throw new Error("useSkills precisa estar dentro de <SkillProvider>");
  return ctx;
};
