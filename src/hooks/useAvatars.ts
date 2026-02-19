import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/contexts/AuthContext';
import { getAllAvatars } from '../services/storeService';

export default function useAvatars() {
  const { user, logout } = useAuth();

  return useQuery({
    queryKey: ['avatars', user?.id],
    queryFn: async () => {
      try {
        const response = await getAllAvatars();
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
        }
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};