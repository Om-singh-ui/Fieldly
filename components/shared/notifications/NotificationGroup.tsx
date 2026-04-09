// components/shared/notifications/NotificationGroup.tsx
'use client';

import React from 'react';
import { NotificationItem } from './NotificationItem';
import { formatDateGroup } from '@/lib/utils/timeFormatter';
import { Calendar } from 'lucide-react';
import type { Notification } from '@/types/notification.types';

interface NotificationGroupProps {
  date: string;
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export const NotificationGroup: React.FC<NotificationGroupProps> = ({
  date,
  notifications,
  onNotificationClick,
}) => {
  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {formatDateGroup(date)}
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};