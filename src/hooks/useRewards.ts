import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/contexts/AuthContext';
import { getAllRewardsByUser } from '@/src/services/rewardService';

export default function useRewards() {
  const { user, logout } = useAuth();

  return useQuery({
    queryKey: ['rewards', user?.id],
    queryFn: async () => {
      try {
        const response = await getAllRewardsByUser(user!.id);
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