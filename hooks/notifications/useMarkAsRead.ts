// hooks/notifications/useMarkAsRead.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notifications/notificationService';
import type { Notification, PaginatedNotifications } from '@/types/notification.types';

interface NotificationsData {
  pages: Array<{
    notifications: Notification[];
    pagination: PaginatedNotifications['pagination'];
  }>;
  pageParams: number[];
}

export const useMarkAsRead = (userId: string) => {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      notificationService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] });

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData<NotificationsData>(['notifications', userId]);

      // Optimistically update
      queryClient.setQueryData<NotificationsData>(['notifications', userId], (old) => {
        if (!old) return old;
        
        const newPages = old.pages.map((page) => ({
          ...page,
          notifications: page.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
          ),
        }));
        
        return { ...old, pages: newPages };
      });

      // Update count
      queryClient.setQueryData<{ count: number }>(['notification-count', userId], (old) => ({
        count: Math.max(0, (old?.count || 0) - 1),
      }));

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications', userId], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notification-count', userId] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] });
      
      const previousNotifications = queryClient.getQueryData<NotificationsData>(['notifications', userId]);
      
      queryClient.setQueryData<NotificationsData>(['notifications', userId], (old) => {
        if (!old) return old;
        
        const newPages = old.pages.map((page) => ({
          ...page,
          notifications: page.notifications.map((n) => ({ ...n, isRead: true, readAt: new Date() })),
        }));
        
        return { ...old, pages: newPages };
      });

      queryClient.setQueryData<{ count: number }>(['notification-count', userId], { count: 0 });

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications', userId], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notification-count', userId] });
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    markAsReadAsync: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadAsync: markAllAsReadMutation.mutateAsync,
    isLoading: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
};