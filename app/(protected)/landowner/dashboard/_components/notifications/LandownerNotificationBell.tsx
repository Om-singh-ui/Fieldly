// app/(protected)/landowner/dashboard/_components/notifications/LandownerNotificationBell.tsx
'use client';

import React from 'react';
import { NotificationBell } from '@/components/shared/notifications/NotificationBell';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification.types';

export const LandownerNotificationBell: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    switch (notification.type) {
      case 'APPLICATION':
        toast.info('New application received!', {
          description: notification.message,
        });
        if (notification.entityId) {
          router.push(`/landowner/applications/${notification.entityId}`);
        }
        break;
      case 'BID':
        if (notification.entityId) {
          router.push(`/landowner/listings/${notification.entityId}/bids`);
        }
        break;
      case 'PAYMENT':
        if (notification.entityId) {
          router.push(`/landowner/payments/${notification.entityId}`);
        }
        break;
      case 'LEASE':
        if (notification.entityId) {
          router.push(`/landowner/leases/${notification.entityId}`);
        }
        break;
      default:
        if (notification.actionUrl) {
          router.push(notification.actionUrl);
        }
    }
  };

  if (!user) return null;

  return (
    <NotificationBell
      userId={user.id}
      userRole="LANDOWNER"
      onNotificationClick={handleNotificationClick}
      size="md"
    />
  );
};