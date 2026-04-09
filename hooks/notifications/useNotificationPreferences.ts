// hooks/notifications/useNotificationPreferences.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { preferenceService } from '@/services/notifications/preferenceService';
import type { NotificationPreferences, NotificationType } from '@/types/notification.types';

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  types: {
    SYSTEM: { email: true, push: true, sms: false },
    LEASE: { email: true, push: true, sms: true },
    PAYMENT: { email: true, push: true, sms: true },
    MESSAGE: { email: true, push: true, sms: false },
    LISTING: { email: true, push: true, sms: false },
    BID: { email: true, push: true, sms: true },
    REVIEW: { email: false, push: true, sms: false },
    APPLICATION: { email: true, push: true, sms: true },
    REMINDER: { email: true, push: true, sms: true },
  } as Record<NotificationType, { email: boolean; push: boolean; sms: boolean }>,
};

export const useNotificationPreferences = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notification-preferences', userId],
    queryFn: () => preferenceService.getPreferences(),
    initialData: defaultPreferences,
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: (preferences: NotificationPreferences) =>
      preferenceService.updatePreferences(userId, preferences),
    onSuccess: (data) => {
      queryClient.setQueryData(['notification-preferences', userId], data);
    },
  });

  return {
    preferences: data,
    isLoading,
    error,
    updatePreferences: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};