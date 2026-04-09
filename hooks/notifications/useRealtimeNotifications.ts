// hooks/notifications/useRealtimeNotifications.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { realtimeService } from '@/services/notifications/realtimeService';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification.types';

export const useRealtimeNotifications = (userId: string, onNotification?: () => void) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const subscription = realtimeService.subscribeToUser(userId, (notification: Notification) => {
      queryClient.setQueryData(['notifications', userId], (oldData: { pages: Array<{ notifications: Notification[] }> } | undefined) => {
        if (!oldData) return oldData;
        
        const newPages = [...oldData.pages];
        if (newPages[0]) {
          newPages[0] = {
            ...newPages[0],
            notifications: [notification, ...newPages[0].notifications],
          };
        }
        
        return { ...oldData, pages: newPages };
      });

      queryClient.invalidateQueries({ queryKey: ['notification-count', userId] });
      onNotification?.();

      if (notification.priority === 'HIGH') {
        toast(notification.title, {
          description: notification.message,
          action: notification.actionUrl ? {
            label: 'View',
            onClick: () => window.location.href = notification.actionUrl!,
          } : undefined,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, queryClient, onNotification]);

  return {
    isConnected: realtimeService.isConnected(),
  };
};