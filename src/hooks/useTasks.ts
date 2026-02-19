import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/contexts/AuthContext';
import { getAllTasksByUser } from '../services/taskService';

export default function useTasks() {
  const { user, logout } = useAuth();

  return useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      try {
        const response = await getAllTasksByUser(user!.id);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
        }
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });
};