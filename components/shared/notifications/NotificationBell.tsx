// components/shared/notifications/NotificationBell.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useNotificationCount } from '@/hooks/notifications/useNotificationCount';
import { NotificationDropdown } from './NotificationDropdown';
import { NotificationBadge } from './NotificationBadge';
import { NotificationPreferences } from './NotificationPreferences';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { Notification } from '@/types/notification.types';

interface NotificationBellProps {
  className?: string;
  userRole: 'FARMER' | 'LANDOWNER' | 'ADMIN';
  userId: string;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className,
  userRole,
  userId,
  showBadge = true,
  size = 'sm',
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { 
    notifications, 
    isLoading, 
    fetchNextPage, 
    hasNextPage,
    markAsRead,
    markAllAsRead,
    refetch // Add refetch
  } = useNotifications({ 
    userId,
    enabled: isOpen // Only fetch when open
  });

  const { unreadCount, refetch: refetchCount } = useNotificationCount(userId);

  // Force refetch when opening
  const handleBellClick = useCallback(() => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setShowPreferences(false);
    
    if (newIsOpen) {
      // Force refetch both count and notifications when opening
      refetchCount();
      refetch();
    }
  }, [isOpen, refetchCount, refetch]);

  const handleNotificationClick = useCallback(async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      refetchCount();
    }
    
    onNotificationClick?.(notification);
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
    
    setIsOpen(false);
  }, [markAsRead, refetchCount, onNotificationClick, router]);

  const handleMarkAllRead = useCallback(async () => {
    await markAllAsRead();
    refetchCount();
    refetch(); // Refetch notifications after marking all as read
  }, [markAllAsRead, refetchCount, refetch]);

  const handlePreferencesClick = useCallback(() => {
    setShowPreferences(!showPreferences);
  }, [showPreferences]);

  const sizeClasses = {
    sm: 'h-9 w-9',
    md: 'h-10 w-10',
    lg: 'h-11 w-11',
  };

  const iconSizes = {
    sm: 18,
    md: 20,
    lg: 22,
  };

  return (
    <div ref={bellRef} className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'relative rounded-full transition-all duration-200',
          sizeClasses[size],
          isOpen && 'bg-accent'
        )}
        onClick={handleBellClick}
      >
        <AnimatePresence mode="wait">
          {unreadCount > 0 ? (
            <motion.div
              key="ringing"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <BellRing className="text-primary" size={iconSizes[size]} />
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <Bell size={iconSizes[size]} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {showBadge && unreadCount > 0 && (
          <NotificationBadge count={unreadCount} />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-0 top-full z-50 mt-2 w-[380px] max-w-[95vw]"
          >
            {showPreferences ? (
              <NotificationPreferences
                userId={userId}
                userRole={userRole}
                onClose={() => setShowPreferences(false)}
              />
            ) : (
              <NotificationDropdown
                notifications={notifications}
                isLoading={isLoading}
                hasNextPage={hasNextPage}
                unreadCount={unreadCount}
                userRole={userRole}
                onNotificationClick={handleNotificationClick}
                onMarkAllRead={handleMarkAllRead}
                onLoadMore={fetchNextPage}
                onPreferencesClick={handlePreferencesClick}
                onClose={() => setIsOpen(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};