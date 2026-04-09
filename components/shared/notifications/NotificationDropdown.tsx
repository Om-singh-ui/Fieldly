// components/shared/notifications/NotificationDropdown.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { GripHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { NotificationEmptyState } from './NotificationEmptyState';
import { NotificationLoadingState } from './NotificationLoadingState';
import { NotificationHeader } from './NotificationHeader';
import { NotificationFooter } from './NotificationFooter';
import { NotificationGroup } from './NotificationGroup';
import { Card } from '@/components/ui/card';
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

// Storage key for persisting position
const POSITION_STORAGE_KEY = 'notification-dropdown-position';

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
  const constraintsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Motion values for position persistence
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Load saved position on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(POSITION_STORAGE_KEY);
      if (saved) {
        try {
          const { x: savedX, y: savedY } = JSON.parse(saved);
          x.set(savedX);
          y.set(savedY);
        } catch {
          // Use default position
        }
      }
    }
  }, [x, y]);

  // Save position when drag ends
  const handleDragEnd = () => {
    if (typeof window !== 'undefined') {
      const position = { x: x.get(), y: y.get() };
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
    }
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Reset position to default
  const resetPosition = () => {
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(POSITION_STORAGE_KEY);
    }
  };

  // Check scroll position
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowScrollTop(scrollTop > 50);
    setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 50);
  };

  // Scroll to top
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Initial scroll check
  useEffect(() => {
    handleScroll();
  }, [notifications]);

  const groupedNotifications = React.useMemo(() => {
    return groupNotificationsByDate(notifications);
  }, [notifications]);

  const getRoleSpecificStyles = () => {
    switch (userRole) {
      case 'FARMER':
        return 'border-t-4 border-t-[#b7cf8a]';
      case 'LANDOWNER':
        return 'border-t-4 border-t-[#b7cf8a]';
      case 'ADMIN':
        return 'border-t-4 border-t-[#b7cf8a]';
      default:
        return '';
    }
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={true}
        style={{ x, y }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        initial={{ x: 0, y: 0, opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className={cn(
          'pointer-events-auto absolute top-20 right-6',
          isDragging && 'cursor-grabbing'
        )}
        whileDrag={{ scale: 1.02 }}
      >
        <Card
          className={cn(
            'flex h-[600px] max-h-[80vh] w-[380px] max-w-[95vw] flex-col overflow-hidden',
            'shadow-2xl border-[#b7cf8a]/20',
            getRoleSpecificStyles(),
            !isDragging && 'cursor-default'
          )}
        >
          {/* Drag Handle Bar */}
          <div 
            className={cn(
              'relative flex items-center justify-center py-1.5',
              'bg-gradient-to-r from-[#b7cf8a]/10 via-[#b7cf8a]/20 to-[#b7cf8a]/10',
              'border-b border-[#b7cf8a]/20',
              'cursor-grab active:cursor-grabbing'
            )}
          >
            <GripHorizontal className="h-4 w-4 text-[#b7cf8a]/60" />
            
            {/* Reset position button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetPosition();
              }}
              className={cn(
                'absolute right-2',
                'text-xs text-gray-400 hover:text-[#b7cf8a]',
                'transition-colors duration-200'
              )}
              title="Reset position"
            >
              Reset
            </button>
          </div>

          <NotificationHeader
            unreadCount={unreadCount}
            onMarkAllRead={onMarkAllRead}
            onPreferencesClick={onPreferencesClick}
            onClose={onClose}
            userRole={userRole}
          />

          {/* Custom Scroll Area */}
          <div className="relative flex-1 overflow-hidden">
            {/* Scroll to top button */}
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToTop}
                className={cn(
                  'absolute top-2 left-1/2 -translate-x-1/2 z-20',
                  'p-1.5 rounded-full',
                  'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
                  'border border-[#b7cf8a]/30',
                  'shadow-lg',
                  'hover:bg-[#b7cf8a]/20',
                  'transition-all duration-200'
                )}
              >
                <ChevronUp className="h-4 w-4 text-[#b7cf8a]" />
              </motion.button>
            )}

            {/* Scrollable Content */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={cn(
                'h-full overflow-y-auto overflow-x-hidden',
                'scrollbar-thin scrollbar-track-transparent',
                'scrollbar-thumb-[#b7cf8a]/30 hover:scrollbar-thumb-[#b7cf8a]/50',
                'px-1'
              )}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#b7cf8a transparent',
              }}
            >
              {isLoading && notifications.length === 0 ? (
                <NotificationLoadingState />
              ) : notifications.length === 0 ? (
                <NotificationEmptyState userRole={userRole} />
              ) : (
                <div className="divide-y divide-[#b7cf8a]/10">
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
            </div>

            {/* Scroll to bottom button */}
            {showScrollBottom && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={scrollToBottom}
                className={cn(
                  'absolute bottom-2 left-1/2 -translate-x-1/2 z-20',
                  'p-1.5 rounded-full',
                  'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
                  'border border-[#b7cf8a]/30',
                  'shadow-lg',
                  'hover:bg-[#b7cf8a]/20',
                  'transition-all duration-200'
                )}
              >
                <ChevronDown className="h-4 w-4 text-[#b7cf8a]" />
              </motion.button>
            )}

            {/* Scroll fade indicators */}
            {showScrollTop && (
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-gray-900 to-transparent pointer-events-none z-10" />
            )}
            {showScrollBottom && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none z-10" />
            )}
          </div>

          <NotificationFooter
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            onLoadMore={onLoadMore}
            totalCount={notifications.length}
          />
        </Card>
      </motion.div>
    </div>
  );
};
