// components/shared/notifications/NotificationItem.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  FileText, 
  Gavel, 
  Home, 
  MessageCircle, 
  Star, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils/timeFormatter';
import { Badge } from '@/components/ui/badge';
import type { Notification } from '@/types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  index: number;
}

const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
  const iconProps = { size: 16, className: 'text-muted-foreground' };
  
  const icons: Record<string, React.ReactNode> = {
    LISTING: <Home {...iconProps} />,
    BID: <Gavel {...iconProps} />,
    PAYMENT: <CreditCard {...iconProps} />,
    LEASE: <FileText {...iconProps} />,
    MESSAGE: <MessageCircle {...iconProps} />,
    APPLICATION: <User {...iconProps} />,
    REVIEW: <Star {...iconProps} />,
    REMINDER: <Calendar {...iconProps} />,
    SYSTEM: <Bell {...iconProps} />,
  };

  return icons[type] || <Bell {...iconProps} />;
};

const getTypeStyles = (type: string): string => {
  const styles: Record<string, string> = {
    LISTING: 'hover:bg-green-50 dark:hover:bg-green-950/20',
    BID: 'hover:bg-amber-50 dark:hover:bg-amber-950/20',
    PAYMENT: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
    LEASE: 'hover:bg-purple-50 dark:hover:bg-purple-950/20',
    MESSAGE: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/20',
    APPLICATION: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
  };
  
  return styles[type] || '';
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'group relative cursor-pointer p-4 transition-all duration-200',
        getTypeStyles(notification.type),
        !notification.isRead && 'bg-primary/5',
        'border-b border-border last:border-b-0'
      )}
      onClick={() => onClick(notification)}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          !notification.isRead ? 'bg-primary/10' : 'bg-muted'
        )}>
          <NotificationIcon type={notification.type} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              'text-sm font-medium leading-tight',
              !notification.isRead && 'font-semibold'
            )}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <Badge 
                variant="secondary" 
                className="h-1.5 w-1.5 rounded-full bg-primary p-0"
              />
            )}
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/70">
              {formatRelativeTime(notification.createdAt)}
            </span>
            
            {notification.entityType && (
              <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                {notification.entityType}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className={cn(
        'absolute inset-y-0 left-0 w-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100',
        !notification.isRead && 'opacity-100'
      )} />
    </motion.div>
  );
};