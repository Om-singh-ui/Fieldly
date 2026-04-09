// hooks/notifications/useNotificationCount.ts
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notifications/notificationService';

export const useNotificationCount = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notification-count', userId],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    unreadCount: data?.count ?? 0,
    isLoading,
    error,
    refetch,
  };
};