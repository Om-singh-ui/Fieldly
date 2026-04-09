// components/shared/notifications/NotificationEmptyState.tsx
'use client';

import React from 'react';
import { Bell, CheckCircle2, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NotificationEmptyStateProps {
  userRole?: 'FARMER' | 'LANDOWNER' | 'ADMIN';
  className?: string;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  userRole = 'FARMER',
  className,
}) => {
  const roleSpecificMessages = {
    FARMER: {
      title: 'All caught up! 🌾',
      message: 'No new notifications. Check back later for updates on land listings, bids, or lease activities.',
      icon: Coffee,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    LANDOWNER: {
      title: 'Everything is quiet 🏡',
      message: 'You\'re all set. We\'ll notify you when you receive new applications, bids, or messages.',
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    ADMIN: {
      title: 'No notifications 📊',
      message: 'The system is running smoothly. No alerts or notifications at this time.',
      icon: Bell,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
  };

  const { title, message, icon: Icon, color, bgColor } = roleSpecificMessages[userRole];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center p-8 text-center', className)}
    >
      <div className={cn('mb-4 rounded-full p-4', bgColor)}>
        <Icon className={cn('h-8 w-8', color)} />
      </div>
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-[250px]">{message}</p>
    </motion.div>
  );
};