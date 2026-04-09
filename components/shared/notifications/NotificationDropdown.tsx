// components/shared/notifications/NotificationDropdown.tsx
'use client';

import React from 'react';
// Remove unused NotificationItem import
import { NotificationEmptyState } from './NotificationEmptyState';
import { NotificationLoadingState } from './NotificationLoadingState';
import { NotificationHeader } from './NotificationHeader';
import { NotificationFooter } from './NotificationFooter';
import { NotificationGroup } from './NotificationGroup';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { groupNotificationsByDate } from '@/lib/utils/notificationHelpers';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notification.types';

interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  hasNextPage?: boolean;
  unreadCount: number;
  userRole: 'FARMER' | 'LANDOWNER' | 'ADMIN';
  onNotificationClick: (notification: Notification) => void;
  onMarkAllRead: () => void;
  onLoadMore?: () => void;
  onPreferencesClick: () => void;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isLoading,
  hasNextPage,
  unreadCount,
  userRole,
  onNotificationClick,
  onMarkAllRead,
  onLoadMore,
  onPreferencesClick,
  onClose,
}) => {
  const groupedNotifications = React.useMemo(() => {
    return groupNotificationsByDate(notifications);
  }, [notifications]);

  const getRoleSpecificStyles = () => {
    switch (userRole) {
      case 'FARMER':
        return 'border-t-4 border-t-green-500';
      case 'LANDOWNER':
        return 'border-t-4 border-t-blue-500';
      case 'ADMIN':
        return 'border-t-4 border-t-purple-500';
      default:
        return '';
    }
  };

  return (
    <Card className={cn(
      'flex h-[600px] max-h-[80vh] flex-col overflow-hidden shadow-2xl',
      getRoleSpecificStyles()
    )}>
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllRead={onMarkAllRead}
        onPreferencesClick={onPreferencesClick}
        onClose={onClose}
        userRole={userRole}
      />

      <ScrollArea className="flex-1">
        {isLoading && notifications.length === 0 ? (
          <NotificationLoadingState />
        ) : notifications.length === 0 ? (
          <NotificationEmptyState userRole={userRole} />
        ) : (
          <div className="divide-y divide-border">
            {Object.entries(groupedNotifications).map(([date, items]) => (
              <NotificationGroup
                key={date}
                date={date}
                notifications={items}
                onNotificationClick={onNotificationClick}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <NotificationFooter
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
        totalCount={notifications.length}
      />
    </Card>
  );
};