// app/(protected)/farmer/dashboard/_components/notifications/FarmerNotificationBell.tsx
'use client';

import React from 'react';
import { NotificationBell } from '@/components/shared/notifications/NotificationBell';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification.types';

export const FarmerNotificationBell: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    switch (notification.type) {
      case 'LISTING':
        toast.success('New land listing available!', {
          description: notification.message,
        });
        if (notification.entityId) {
          router.push(`/marketplace/listing/${notification.entityId}`);
        }
        break;
      case 'BID':
        if (notification.entityId) {
          router.push(`/farmer/bids/${notification.entityId}`);
        }
        break;
      case 'LEASE':
        if (notification.entityId) {
          router.push(`/farmer/leases/${notification.entityId}`);
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
      userRole="FARMER"
      onNotificationClick={handleNotificationClick}
      size="md"
    />
  );
};