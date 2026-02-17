'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { getAllTasksByUser } from "@/src/services/taskService";
import type { TaskResponse } from "@/src/types/task";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: TaskResponse[];
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      refreshTasks();
    }
  }, []);

  const refreshTasks = async () => {
    if (user) {
      try {
        const response = await getAllTasksByUser(user.id);
        setTasks(response.data);
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.error("Erro ao carregar tarefas:\n", error);
        } else {
          logout();
        }
      }
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks precisa estar dentro de <TaskProvider>");
  return ctx;
};
