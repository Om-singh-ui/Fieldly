// components/shared/notifications/NotificationBell.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
  size = 'md',
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const bellRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { 
    notifications, 
    isLoading, 
    fetchNextPage, 
    hasNextPage,
    markAsRead,
    markAllAsRead,
    refetch
  } = useNotifications({ 
    userId,
    enabled: isOpen
  });

  const { unreadCount, refetch: refetchCount } = useNotificationCount(userId);

  const updatePosition = useCallback(() => {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(updatePosition);
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePositionUpdate = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handlePositionUpdate);
    window.addEventListener('scroll', handlePositionUpdate, { passive: true });

    return () => {
      window.removeEventListener('resize', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (bellRef.current && bellRef.current.contains(target)) {
        return;
      }
      
      const portalContent = document.querySelector('[data-notification-portal]');
      if (portalContent && portalContent.contains(target)) {
        return;
      }
      
      setIsOpen(false);
      setShowPreferences(false);
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleBellClick = useCallback(() => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setShowPreferences(false);
    
    if (newIsOpen) {
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
    refetch();
  }, [markAllAsRead, refetchCount, refetch]);

  const handlePreferencesClick = useCallback(() => {
    setShowPreferences(!showPreferences);
  }, [showPreferences]);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const dropdownContent = isOpen && (
    <div
      data-notification-portal="true"
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        right: dropdownPosition.right,
        zIndex: 99999,
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
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
    </div>
  );

  return (
    <>
      <div ref={bellRef} className={cn('relative', className)}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative rounded-full transition-all duration-200',
            sizeClasses[size],
            isOpen && 'bg-[#b7cf8a]/20'
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
                <BellRing className="text-[#b7cf8a]" size={iconSizes[size]} />
              </motion.div>
            ) : (
              <motion.div
                key="static"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <Bell size={iconSizes[size]} className="text-gray-600 dark:text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {showBadge && unreadCount > 0 && (
            <NotificationBadge count={unreadCount} />
          )}
        </Button>
      </div>

      {mounted && createPortal(dropdownContent, document.body)}
    </>
  );
};