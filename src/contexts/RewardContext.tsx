'use client';

import { RewardResponse } from "../types/reward";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getAllRewardsByUser } from "../services/rewardService";

interface RewardContextType {
  rewards: RewardResponse[];
  refreshRewards: () => Promise<void>;
}

const RewardContext = createContext<RewardContextType | null>(null);

export const RewardProvider = ({ children }: { children: React.ReactNode }) => {
  const [rewards, setRewards] = useState<RewardResponse[]>([]);
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      refreshRewards();
    }
  }, [])

  const refreshRewards = async () => {
    if (user) {
      try {
        const response = await getAllRewardsByUser(user.id);
        setRewards(response.data);
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.error("Erro ao carregar recompensas:\n", error);
        } else {
          logout();
        }
      }
    }
  };

  return (
    <RewardContext.Provider value={{ rewards, refreshRewards }}>
      {children}
    </RewardContext.Provider>
  );
};

export const useRewards = () => {
  const ctx = useContext(RewardContext);
  if (!ctx) throw new Error("useRewards precisa estar dentro de <RewardProvider>");
  return ctx;
};