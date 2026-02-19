import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/contexts/AuthContext';
import { getAllSkillsByUser } from '../services/skillService';

export default function useSkills() {
  const { user, logout } = useAuth();

  return useQuery({
    queryKey: ['skills', user?.id],
    queryFn: async () => {
      try {
        const response = await getAllSkillsByUser(user!.id);
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